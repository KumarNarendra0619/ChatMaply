import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const failures = [];

page.on('console', msg => {
  if (msg.type() === 'error') failures.push(`console.error: ${msg.text()}`);
});
page.on('pageerror', error => failures.push(`pageerror: ${error.message}`));

try {
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.L && document.querySelector('#map'));

  const required = [
    '#chatFile', '#processBtn', '#shareLocation', '#timeRange',
    '#map', '#toggleGlobe', '#evidencePanel', '#saveCondition'
  ];
  for (const selector of required) {
    if (!(await page.locator(selector).count())) failures.push(`missing UI: ${selector}`);
  }

  const checks = {
    title: await page.title(),
    indexedDB: await page.evaluate(() => typeof indexedDB !== 'undefined'),
    leaflet: await page.evaluate(() => typeof window.L !== 'undefined'),
    timeRange: await page.locator('#timeRange').inputValue(),
    mapVisible: await page.locator('#map').isVisible(),
    initialMappedReports: await page.locator('.leaflet-marker-icon').count()
  };

  if (!checks.indexedDB) failures.push('IndexedDB unavailable');
  if (!checks.leaflet) failures.push('Leaflet runtime unavailable');
  if (!checks.mapVisible) failures.push('map not visible');
  if (checks.initialMappedReports < 1) failures.push('demo map markers missing');

  const fixture = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'fixtures/real-platform/whatsapp-synthetic.txt');
  await page.locator('#chatFile').setInputFiles(fixture);
  await page.locator('#processBtn').click();
  await page.waitForFunction(() => document.querySelector('#statusText')?.textContent?.startsWith('Imported '), null, { timeout: 10000 });

  const importResult = await page.evaluate(() => ({
    status: document.querySelector('#statusText')?.textContent || '',
    messages: document.querySelector('#messageCount')?.textContent || '',
    observations: document.querySelector('#obsCount')?.textContent || ''
  }));
  if (!/^Imported 3 messages/.test(importResult.status)) failures.push(`synthetic import failed: ${importResult.status}`);
  if (importResult.messages !== '3') failures.push(`expected 3 messages, got ${importResult.messages}`);

  const before = Number(importResult.observations);
  await page.locator('#timeRange').fill('0');
  await page.locator('#timeRange').dispatchEvent('input');
  await page.waitForTimeout(100);
  const after = Number(await page.locator('#obsCount').textContent());
  if (!(after <= before)) failures.push(`timeline filter did not reduce/retain observations: ${before} -> ${after}`);

  const persistence = await page.evaluate(async () => {
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open('chatmaply-browser-e2e', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('qa');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise((resolve, reject) => {
      const tx = db.transaction('qa', 'readwrite');
      tx.objectStore('qa').put({ ok: true }, 'smoke');
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
    return true;
  });
  if (!persistence) failures.push('IndexedDB persistence smoke test failed');

  const report = { suite: 'ChatMaply Browser E2E QA', checks, importResult, timeline: { before, after }, failures, overall: failures.length ? 'FAIL' : 'PASS' };
  console.log(JSON.stringify(report, null, 2));
  if (failures.length) process.exitCode = 1;
} finally {
  await browser.close();
}
