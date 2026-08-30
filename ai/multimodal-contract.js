// BUILD-08: provider-neutral contract for a future multimodal vision model.
// The browser app can prepare evidence, but model calls are intentionally kept behind a server-side boundary.

export const AI_ANALYSIS_VERSION = '0.1';

export function createVisionAnalysisRequest({ mediaId, fileName, mediaType, timestamp = null, knownLocation = null }) {
  return {
    version: AI_ANALYSIS_VERSION,
    media_id: mediaId || null,
    file_name: fileName || null,
    media_type: mediaType || 'unknown',
    timestamp,
    known_location: knownLocation,
    requested_outputs: [
      'object_or_event_category',
      'condition',
      'visible_evidence',
      'measurement_candidates',
      'review_notes'
    ],
    constraints: [
      'Do not infer exact coordinates from pixels.',
      'Do not infer identity or face recognition.',
      'Do not convert observer location into object location.',
      'Return uncertainty when evidence is insufficient.'
    ]
  };
}

export function validateVisionResult(result = {}) {
  const allowedConditions = new Set(['Good','Moderate','Poor','Severe','Needs review','Unknown']);
  return {
    category: String(result.category || 'Unclassified'),
    condition: allowedConditions.has(result.condition) ? result.condition : 'Needs review',
    confidence: Number.isFinite(Number(result.confidence)) ? Math.max(0, Math.min(1, Number(result.confidence))) : null,
    evidence: Array.isArray(result.evidence) ? result.evidence : [],
    measurements: Array.isArray(result.measurements) ? result.measurements : [],
    notes: String(result.notes || ''),
    object_location: result.object_location || null,
    needs_human_review: true
  };
}
