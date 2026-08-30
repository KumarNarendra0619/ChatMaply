// BUILD-15: platform-neutral export adapters.
// Adapters normalize platform-specific exports into one schema without claiming unsupported formats are parsed.

import { parseWhatsApp } from './whatsapp.js';
import { parseTelegramExport } from './telegram.js';

export const PLATFORM_STATUS = {
  whatsapp: 'implemented-baseline',
  telegram: 'implemented-baseline',
  signal: 'adapter-required-real-export-test',
  messenger: 'adapter-required-real-export-test'
};

export function detectPlatform(fileName = '', text = '') {
  const name = String(fileName).toLowerCase();
  if (name.includes('whatsapp') || /whatsapp chat/i.test(text)) return 'whatsapp';
  if (name.includes('telegram') || /telegram/i.test(text)) return 'telegram';
  if (name.includes('signal') || /signal/i.test(text)) return 'signal';
  if (name.includes('messenger') || /facebook messenger|messenger/i.test(text)) return 'messenger';
  return 'unknown';
}

export function normalizePlatformMessages(platform, input) {
  switch (platform) {
    case 'whatsapp': return parseWhatsApp(String(input || ''));
    case 'telegram': return parseTelegramExport(input);
    case 'signal':
    case 'messenger':
      return [];
    default:
      return [];
  }
}

export function adapterStatus(platform) {
  return PLATFORM_STATUS[platform] || 'unsupported';
}
