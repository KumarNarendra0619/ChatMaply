// BUILD-51 QA contract. Run with a JS test runner that supports ESM.
import assert from 'node:assert/strict';
import {
  createPipelineContext,
  ingestEvidence,
  reviewEvidence,
  deriveObservations,
  addMeasurements,
  applySpatialQuery,
  registerExport,
  pipelineSummary
} from '../integration/build-51-pipeline.js';

const ctx0 = createPipelineContext({workspace_id: 'ws-1', dataset_id: 'ds-1', run_id: 'qa-51'});
const ctx1 = ingestEvidence(ctx0, [{evidence_id: 'e-1', workspace_id: 'ws-1', dataset_id: 'ds-1', text: 'road damage'}]);
assert.equal(ctx1.stage, 'IMPORTED');
assert.equal(ctx1.raw_evidence[0].raw_immutable, true);

assert.throws(() => ingestEvidence(ctx0, [{evidence_id: 'e-x', workspace_id: 'ws-2', dataset_id: 'ds-1'}]), /BOUNDARY_VIOLATION/);

const ctx2 = reviewEvidence(ctx1, [{evidence_id: 'e-1', review_status: 'APPROVED'}]);
const ctx3 = deriveObservations(ctx2, [{observation_id: 'o-1', evidence_id: 'e-1', object_type: 'ROAD_DAMAGE'}]);
const ctx4 = addMeasurements(ctx3, [{measurement_id: 'm-1', observation_id: 'o-1', measurement_type: 'DISTANCE', value: 42, unit: 'm'}]);
const ctx5 = applySpatialQuery(ctx4, {type: 'radius', distance_m: 500}, ['o-1']);
const ctx6 = registerExport(ctx5, 'geojson', 1);

const summary = pipelineSummary(ctx6);
assert.equal(summary.stage, 'EXPORTED');
assert.equal(summary.evidence_count, 1);
assert.equal(summary.observation_count, 1);
assert.equal(summary.measurement_count, 1);
assert.equal(summary.export_count, 1);
console.log('BUILD-51 QA PASS', summary);
