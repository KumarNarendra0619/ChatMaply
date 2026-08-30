import { normalizeMessage } from './common.js';

function safeTime(value) {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(11, 19);
}

export function parseTelegramExport(json) {
  const source = typeof json === 'string' ? JSON.parse(json) : json;
  const messages = [];
  for (const item of source?.messages || []) {
    if (item?.type !== 'message') continue;
    const text = Array.isArray(item.text)
      ? item.text.map(part => typeof part === 'string' ? part : (part?.text || '')).join('')
      : String(item.text || '');
    messages.push(normalizeMessage({
      id: `tg-${item.id}`,
      sender: item.from || item.actor || 'Unknown',
      date: item.date || '',
      time: safeTime(item.date),
      text,
      media: item.photo || item.file || null
    }));
  }
  return messages;
}
