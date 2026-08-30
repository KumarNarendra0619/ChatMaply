import assert from 'node:assert/strict';
import { createWorkspace, createDataset, getWorkspace, getDataset, listWorkspaceDatasets, archiveWorkspace, resetWorkspaceManager } from '../data/workspace-manager.js';

resetWorkspaceManager();
const ws = createWorkspace({ name: 'QA Workspace', description: 'Synthetic isolation test' });
const ds1 = createDataset({ workspace_id: ws.workspace_id, name: 'Dataset A', source_platform: 'WHATSAPP' });
const ds2 = createDataset({ workspace_id: ws.workspace_id, name: 'Dataset B', source_platform: 'TELEGRAM' });

assert.equal(getWorkspace(ws.workspace_id).dataset_ids.length, 2);
assert.equal(getDataset(ds1.dataset_id).workspace_id, ws.workspace_id);
assert.equal(listWorkspaceDatasets(ws.workspace_id).length, 2);
assert.throws(() => createDataset({ workspace_id: 'missing', name: 'Invalid' }), /Workspace not found/);

const archived = archiveWorkspace(ws.workspace_id);
assert.equal(archived.status, 'ARCHIVED');
assert.equal(getDataset(ds1.dataset_id).status, 'ARCHIVED');
assert.equal(getDataset(ds2.dataset_id).status, 'ARCHIVED');

console.log(JSON.stringify({ suite: 'ChatMaply BUILD-46 workspace isolation QA', workspace: ws.workspace_id, datasets: 2, archive: 'PASS', overall: 'PASS' }, null, 2));
