// BUILD-14: normalized client-side evidence store.
// Keeps raw chat/media metadata separate from derived map observations.

const state = { messages: [], media: [], observers: [], observations: [], reviews: [] };

export function resetEvidenceStore() {
  state.messages = []; state.media = []; state.observers = []; state.observations = []; state.reviews = [];
  return getEvidenceSnapshot();
}

export function ingestExport(result = {}) {
  state.messages = Array.isArray(result.messages) ? result.messages : [];
  state.media = Array.isArray(result.media) ? result.media : [];
  state.observers = Array.isArray(result.observers) ? result.observers : [];
  state.observations = Array.isArray(result.observations) ? result.observations : [];
  return getEvidenceSnapshot();
}

export function addObservation(observation) {
  if (!observation || !observation.id) throw new Error('Observation requires an id.');
  state.observations.push(observation);
  return observation;
}

export function addReview(review) {
  if (!review?.review_id) throw new Error('Review requires review_id.');
  state.reviews.push(review);
  return review;
}

export function getEvidenceSnapshot() {
  return JSON.parse(JSON.stringify(state));
}
