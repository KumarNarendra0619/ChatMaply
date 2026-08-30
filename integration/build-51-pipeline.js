// BUILD-51: deterministic orchestration layer for the ChatMaply evidence lifecycle.
// This module deliberately keeps AI/provider calls out of the core pipeline.
// Adapters may supply imported evidence and derived observations, but every
// stage returns explicit state and never silently mutates raw evidence.

const REQUIRED_CONTEXT = ['workspace_id', 'dataset_id'];
const TERMINAL = new Set(['REJECTED', 'FAILED']);

const clone = value => value == null ? value : JSON.parse(JSON.stringify(value));
const assertContext = context => {
  for (const key of REQUIRED_CONTEXT) {
    if (!context || !context[key]) throw new Error(`Missing ${key}.`);
  }
};

export function createPipelineContext({workspace_id, dataset_id, run_id = `run-${Date.now()}`} = {}) {
  assertContext({workspace_id, dataset_id});
  return {
    run_id,
    workspace_id,
    dataset_id,
    stage: 'CREATED',
    raw_evidence: [],
    observations: [],
    measurements: [],
    query: null,
    exports: [],
    errors: [],
    history: [{stage: 'CREATED', at: new Date().toISOString()}]
  };
}

function transition(ctx, stage, patch = {}) {
  if (TERMINAL.has(ctx.stage)) throw new Error(`Pipeline is terminal: ${ctx.stage}`);
  const next = {...ctx, ...clone(patch), stage};
  next.history = [...ctx.history, {stage, at: new Date().toISOString()}];
  return next;
}

export function ingestEvidence(ctx, evidence = []) {
  assertContext(ctx);
  if (!Array.isArray(evidence)) throw new Error('Evidence must be an array.');
  const safe = evidence.map(e => {
    if (!e || e.workspace_id !== ctx.workspace_id || e.dataset_id !== ctx.dataset_id) {
      throw new Error('WORKSPACE_DATASET_BOUNDARY_VIOLATION');
    }
    return {...clone(e), raw_immutable: true, status: e.status || 'UNREVIEWED'};
  });
  return transition(ctx, 'IMPORTED', {raw_evidence: safe});
}

export function reviewEvidence(ctx, decisions = []) {
  if (!Array.isArray(decisions)) throw new Error('Review decisions must be an array.');
  const byId = new Map(decisions.map(d => [d.evidence_id, d]));
  const reviewed = ctx.raw_evidence.map(e => {
    const d = byId.get(e.evidence_id);
    return d ? {...e, review_status: d.review_status || 'APPROVED', review_revision: clone(d.revision || null)} : e;
  });
  return transition(ctx, 'REVIEWED', {raw_evidence: reviewed});
}

export function deriveObservations(ctx, observations = []) {
  if (!Array.isArray(observations)) throw new Error('Observations must be an array.');
  const safe = observations.map(o => ({...clone(o), workspace_id: ctx.workspace_id, dataset_id: ctx.dataset_id}));
  return transition(ctx, 'OBSERVATIONS_READY', {observations: safe});
}

export function addMeasurements(ctx, measurements = []) {
  if (!Array.isArray(measurements)) throw new Error('Measurements must be an array.');
  const safe = measurements.map(m => ({...clone(m), workspace_id: ctx.workspace_id, dataset_id: ctx.dataset_id}));
  return transition(ctx, 'MEASURED', {measurements: safe});
}

export function applySpatialQuery(ctx, query, resultIds = []) {
  if (!query || typeof query !== 'object') throw new Error('Query is required.');
  return transition(ctx, 'QUERIED', {query: clone(query), query_result_ids: [...resultIds]});
}

export function registerExport(ctx, format, recordCount) {
  if (!format) throw new Error('Export format is required.');
  const item = {format: String(format).toUpperCase(), record_count: Number(recordCount) || 0, at: new Date().toISOString(), dataset_id: ctx.dataset_id, workspace_id: ctx.workspace_id};
  return transition(ctx, 'EXPORTED', {exports: [...ctx.exports, item]});
}

export function failPipeline(ctx, message) {
  return transition(ctx, 'FAILED', {errors: [...ctx.errors, String(message || 'Unknown pipeline error')]});
}

export function pipelineSummary(ctx) {
  return {
    run_id: ctx.run_id,
    workspace_id: ctx.workspace_id,
    dataset_id: ctx.dataset_id,
    stage: ctx.stage,
    evidence_count: ctx.raw_evidence.length,
    observation_count: ctx.observations.length,
    measurement_count: ctx.measurements.length,
    export_count: ctx.exports.length,
    error_count: ctx.errors.length
  };
}
