import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const failures = [];

page.on('console', msg => {
  if (msg.type() === 'error') failures.push(`console.error: ${msg.text()}`);
});
page.on('pageerror', error => failures.push(`pageerror: ${error.message}`));

try {
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });

  const required = [
    '#chatFile', '#processChat', '#shareLocation', '#timeRange',
    '#map', '#threeD', '#evidencePanel', '#saveCondition'
  ];
  for (const selector of required) {
    if (!(await page.locator(selector).count())) failures.push(`missing UI: ${selector}`);
  }

  const checks = {
    title: await page.title(),
    indexedDB: await page.evaluate(() => typeof indexedDB !== 'undefined'),
    leaflet: await page.evaluate(() => typeof window.L !== 'undefined'),
    timeRange: await page.locator('#timeRange').inputValue(),
    mapVisible: await page.locator('#map').isVisible()
  };

  if (!checks.indexedDB) failures.push('IndexedDB unavailable');
  if (!checks.leaflet) failures.push('Leaflet runtime unavailable');
  if (!checks.mapVisible) failures.push('map not visible');

  // Verify the timeline control actually emits an input event without throwing.
  await page.locator('#timeRange').evaluate(el => {
    el.value = el.max;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });

  // Verify the browser persistence API is callable from the page context.
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

  const report = { suite: 'ChatMaply Browser E2E QA', checks, failures, overall: failures.length ? 'FAIL' : 'PASS' };
  console.log(JSON.stringify(report, null, 2));
  if (failures.length) process.exitCode = 1;
} finally {
  await browser.close();
}
