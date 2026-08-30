// BUILD-27: browser-side ZIP import with explicit parser status and QA metadata.
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
  const jsonEntry = entries.find(entry => entry.name.toLowerCase().endsWith('.json') && /result|chat|export/.test(entry.name.toLowerCase()));
  let messages = [];
  let parser = 'none';
  let parserStatus = 'NO_CHAT_DATA';

  if (chatEntry) {
    const text = await chatEntry.async('text');
    messages = parseWhatsApp(text);
    parser = 'whatsapp-txt';
    parserStatus = messages.length ? 'PARSED' : 'NO_MESSAGES_MATCHED';
  } else if (jsonEntry) {
    try {
      messages = parseTelegramExport(await jsonEntry.async('text'));
      parser = 'telegram-json';
      parserStatus = messages.length ? 'PARSED' : 'NO_MESSAGES_MATCHED';
    } catch (error) {
      parser = 'telegram-json';
      parserStatus = 'INVALID_JSON';
    }
  }

  return {
    fileName: file.name,
    totalFiles: files.length,
    media: files.filter(f => f.mediaType === 'image' || f.mediaType === 'video'),
    images: files.filter(f => f.mediaType === 'image'),
    videos: files.filter(f => f.mediaType === 'video'),
    messages,
    files,
    parser,
    parser_status: parserStatus,
    chat_file: chatEntry?.name || jsonEntry?.name || null,
    qa: {
      archive_readable: true,
      message_count: messages.length,
      media_count: files.filter(f => f.mediaType === 'image' || f.mediaType === 'video').length,
      unsupported_files: files.filter(f => f.mediaType === 'other').length
    }
  };
}
