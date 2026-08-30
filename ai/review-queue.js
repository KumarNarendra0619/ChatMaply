// BUILD-08: human review queue for AI assessments.

export function createReviewItem({ analysis, mediaId, messageId = null }) {
  return {
    review_id: `review-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    media_id: mediaId || null,
    message_id: messageId,
    analysis,
    status: 'pending',
    reviewer_decision: null,
    reviewed_at: null,
    published_to_map: false
  };
}

export function applyReviewDecision(item, decision, notes = '') {
  if (!['confirm','reject','edit'].includes(decision)) throw new Error('Invalid review decision.');
  return {
    ...item,
    status: decision === 'confirm' ? 'confirmed' : decision === 'reject' ? 'rejected' : 'edited',
    reviewer_decision: { decision, notes },
    reviewed_at: new Date().toISOString(),
    published_to_map: decision === 'confirm' || decision === 'edit'
  };
}
