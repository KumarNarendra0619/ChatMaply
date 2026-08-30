import { normalizeMessage } from './common.js';

const LINE = /^(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?:\s?[APMapm]{2})?)\s+-\s+([^:]+):\s([\s\S]*)$/;

export function parseWhatsApp(text) {
  const messages = [];
  let current = null;
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(LINE);
    if (match) {
      if (current) messages.push(current);
      current = normalizeMessage({
        id: `wa-${messages.length + 1}`,
        sender: match[3].trim(),
        date: match[1],
        time: match[2],
        text: match[4].trim()
      });
    } else if (current && line.trim()) {
      current.text += `\n${line.trim()}`;
    }
  }
  if (current) messages.push(current);
  return messages;
}
