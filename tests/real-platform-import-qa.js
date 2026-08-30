import fs from 'node:fs';
import assert from 'node:assert/strict';
import { parseWhatsApp } from '../parsers/whatsapp.js';
import { parseTelegramExport } from '../parsers/telegram.js';
import { parseSignalJSON } from '../parsers/signal.js';
import { parseMessengerJSON } from '../parsers/messenger.js';

const root = new URL('./fixtures/real-platform/', import.meta.url);
const read = name => fs.readFileSync(new URL(name, root), 'utf8');

const cases = [
  ['WhatsApp', () => parseWhatsApp(read('whatsapp-synthetic.txt')), 3],
  ['Telegram', () => parseTelegramExport(read('telegram-synthetic.json')), 3],
  ['Signal', () => parseSignalJSON(read('signal-synthetic.json')), 3],
  ['Messenger', () => parseMessengerJSON(read('messenger-synthetic.json')), 3]
];

const results = cases.map(([platform, run, expected]) => {
  try {
    const messages = run();
    assert.equal(messages.length, expected, `${platform}: message count`);
    assert.ok(messages.every(m => m.id && m.sender && m.text), `${platform}: normalized message fields`);
    assert.ok(messages.every(m => m.date || m.time), `${platform}: timestamp normalization`);
    return { platform, pass: true, messages: messages.length };
  } catch (error) {
    return { platform, pass: false, error: error.message };
  }
});

const report = {
  suite: 'ChatMaply Real-Platform Import QA',
  fixture_type: 'synthetic, privacy-safe platform-shaped exports',
  generated_at: new Date().toISOString(),
  results,
  overall: results.every(r => r.pass) ? 'PASS' : 'FAIL'
};

console.log(JSON.stringify(report, null, 2));
if (report.overall !== 'PASS') process.exitCode = 1;
