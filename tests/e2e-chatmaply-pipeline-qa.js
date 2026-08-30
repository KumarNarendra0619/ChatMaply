import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parseWhatsApp } from '../parsers/whatsapp.js';
import { parseTelegramExport } from '../parsers/telegram.js';
import { parseSignalJSON } from '../parsers/signal.js';
import { parseMessengerJSON } from '../parsers/messenger.js';
import { createEvidence, normalizeEvidenceBatch } from '../data/unified-evidence-model.js';
import { createPipelineContext, ingestEvidence, reviewEvidence, deriveObservations, addMeasurements, applySpatialQuery, registerExport, pipelineSummary } from '../integration/build-51-pipeline.js';

const root = new URL('./fixtures/real-platform/', import.meta.url);
const read = name => fs.readFileSync(new URL(name, root), 'utf8');
const workspace_id = 'qa-workspace';
const dataset_id = 'qa-dataset';
const parsers = [
  ['WHATSAPP', () => parseWhatsApp(read('whatsapp-synthetic.txt'))],
  ['TELEGRAM', () => parseTelegramExport(read('telegram-synthetic.json'))],
  ['SIGNAL', () => parseSignalJSON(read('signal-synthetic.json'))],
  ['MESSENGER', () => parseMessengerJSON(read('messenger-synthetic.json'))]
];
const messages = parsers.flatMap(([platform, run]) => run().map(m => ({...m, source_platform: platform})));
assert.equal(messages.length, 12);
const evidence = normalizeEvidenceBatch(messages.map((m,i) => createEvidence({id:`qa-ev-${i+1}`,type:'MESSAGE',source_platform:m.source_platform,source_id:m.id,sender:m.sender,text:m.text,timestamp:`${m.date || '2026-01-01'}T${m.time || '12:00:00'}Z`,provenance:{fixture:true},metadata:{qa:true}})));
assert.equal(evidence.length, 12);
const bound = evidence.map(e => ({...e, workspace_id, dataset_id}));
let ctx = createPipelineContext({workspace_id,dataset_id,run_id:'qa-run-001'});
ctx = ingestEvidence(ctx,bound);
ctx = reviewEvidence(ctx,bound.map(e => ({evidence_id:e.id,review_status:'APPROVED'})));
ctx = deriveObservations(ctx,bound.map(e => ({observation_id:`qa-ob-${e.id}`,evidence_id:e.id,workspace_id,dataset_id,location:null,status:'REVIEWED'})));
ctx = addMeasurements(ctx,[{measurement_id:'qa-m-1',value:1,unit:'count',workspace_id,dataset_id}]);
ctx = applySpatialQuery(ctx,{type:'ALL',temporal:null},ctx.observations.map(o => o.observation_id));
ctx = registerExport(ctx,'JSON',ctx.observations.length);
const summary = pipelineSummary(ctx);
assert.equal(summary.stage,'EXPORTED');
assert.equal(summary.evidence_count,12);
assert.equal(summary.observation_count,12);
assert.equal(summary.measurement_count,1);
assert.equal(summary.export_count,1);
const restored = JSON.parse(JSON.stringify(ctx));
assert.equal(restored.workspace_id,workspace_id);
assert.equal(restored.dataset_id,dataset_id);
assert.equal(restored.observations.length,12);
console.log(JSON.stringify({suite:'ChatMaply E2E synthetic import pipeline QA',fixture_type:'synthetic',platforms:parsers.map(([p])=>p),summary, persistence_reload:'PASS',overall:'PASS'},null,2));
