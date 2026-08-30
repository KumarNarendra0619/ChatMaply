// BUILD-53: browser persistence QA contract.
// Run in a browser/test runner with IndexedDB and structuredClone available.
import assert from 'node:assert/strict';
import { IndexedDBPersistenceAdapter } from '../data/indexeddb-persistence.js';

export async function runBuild53QA() {
  const adapter = new IndexedDBPersistenceAdapter({ dbName: `chatmaply-qa-${Date.now()}` });
  await adapter.put('workspaces', 'ws-1', { workspace_id:'ws-1', name:'Village A' });
  await adapter.put('datasets', 'ds-1', { dataset_id:'ds-1', workspace_id:'ws-1' });
  await adapter.put('evidence', 'ev-1', { evidence_id:'ev-1', workspace_id:'ws-1', dataset_id:'ds-1' });

  assert.equal((await adapter.get('evidence','ev-1')).workspace_id, 'ws-1');
  assert.equal((await adapter.list('evidence')).length, 1);

  const copy = await adapter.get('evidence','ev-1');
  copy.dataset_id = 'tampered';
  assert.equal((await adapter.get('evidence','ev-1')).dataset_id, 'ds-1');

  await adapter.delete('evidence','ev-1');
  assert.equal(await adapter.get('evidence','ev-1'), null);
  await adapter.clear();
  return 'BUILD-53 IndexedDB QA passed';
}
