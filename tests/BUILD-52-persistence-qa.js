// BUILD-52 persistence QA contract
import assert from 'node:assert/strict';
import { MemoryPersistenceAdapter, PersistentStore, PersistenceError } from '../data/persistence-store.js';

const store = new PersistentStore(new MemoryPersistenceAdapter());
store.saveWorkspace({workspace_id:'ws-1',name:'Village A',status:'ACTIVE'});
store.saveDataset({dataset_id:'ds-1',workspace_id:'ws-1',name:'August',status:'ACTIVE'});
store.saveEvidence({evidence_id:'ev-1',workspace_id:'ws-1',dataset_id:'ds-1',status:'UNREVIEWED'});
assert.equal(store.listEvidence('ws-1','ds-1').length,1);
assert.equal(store.listEvidence('ws-other','ds-1').length,0);
assert.throws(() => store.saveEvidence({evidence_id:'ev-2',dataset_id:'ds-1'}), PersistenceError);
const copy=store.getEvidence('ev-1'); copy.status='MUTATED';
assert.equal(store.getEvidence('ev-1').status,'UNREVIEWED');
assert.equal(store.snapshot().evidence.length,1);
console.log('BUILD-52 persistence QA passed');
