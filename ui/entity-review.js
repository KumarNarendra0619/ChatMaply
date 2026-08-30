// BUILD-18: simple entity review/merge/split state machine.
// No merge is final without explicit human confirmation.

export const REVIEW_ACTIONS = Object.freeze({ MERGE: 'merge', KEEP_SEPARATE: 'keep-separate', NEEDS_REVIEW: 'needs-review' });

export function createReviewDecision({candidateId, action, reviewer='user', note=''}={}) {
  if (!candidateId) throw new Error('candidateId is required.');
  if (!Object.values(REVIEW_ACTIONS).includes(action)) throw new Error('Invalid review action.');
  return { review_id:`review-${Date.now()}`, candidate_id:candidateId, action, reviewer, note, decided_at:new Date().toISOString() };
}

export function mergeEntities(primary, secondary, decision) {
  if (decision?.action !== REVIEW_ACTIONS.MERGE) throw new Error('Explicit merge decision required.');
  const evidence=[...(primary?.evidence_ids||[]),...(secondary?.evidence_ids||[])];
  return {...primary, evidence_ids:[...new Set(evidence)], merged_from:[primary?.entity_id,secondary?.entity_id].filter(Boolean), status:'verified-merged', last_review:decision.review_id};
}

export function keepSeparate(entity, decision) {
  if (decision?.action !== REVIEW_ACTIONS.KEEP_SEPARATE) throw new Error('Explicit keep-separate decision required.');
  return {...entity, status:'verified-separate', last_review:decision.review_id};
}
