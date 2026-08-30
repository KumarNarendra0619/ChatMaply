// BUILD-03 browser-side ZIP import utilities.
// Uses JSZip from the CDN loaded by index.html.
import { classifyMedia } from './common.js';
import { parseWhatsApp } from './whatsapp.js';
import { parseTelegramExport } from './telegram.js';

const TEXT_NAMES = ['_chat.txt', 'chat.txt'];

export async function inspectChatZip(file) {
  if (!window.JSZip) throw new Error('ZIP library is not loaded.');
  const zip = await window.JSZip.loadAsync(file);
  const entries = Object.values(zip.files).filter(entry => !entry.dir);
  const files = entries.map(entry => ({
    path: entry.name,
    name: entry.name.split('/').pop(),
    mediaType: classifyMedia(entry.name),
    size: entry._data?.uncompressedSize || 0
  }));

  const chatEntry = entries.find(entry => TEXT_NAMES.includes(entry.name.split('/').pop().toLowerCase()));
  let messages = [];
  if (chatEntry) {
    const text = await chatEntry.async('text');
    messages = parseWhatsApp(text);
  } else {
    const jsonEntry = entries.find(entry => entry.name.toLowerCase().endsWith('.json') && /result|chat|export/.test(entry.name.toLowerCase()));
    if (jsonEntry) messages = parseTelegramExport(await jsonEntry.async('text'));
  }

  return {
    fileName: file.name,
    totalFiles: files.length,
    media: files.filter(f => f.mediaType === 'image' || f.mediaType === 'video'),
    images: files.filter(f => f.mediaType === 'image'),
    videos: files.filter(f => f.mediaType === 'video'),
    messages,
    files
  };
}
