// BUILD-25: normalized client-side evidence store.
// Keeps raw chat/media metadata separate from derived map observations.

const state = { messages: [], media: [], observers: [], observations: [], reviews: [], media_links: [] };

export function resetEvidenceStore() { state.messages=[]; state.media=[]; state.observers=[]; state.observations=[]; state.reviews=[]; state.media_links=[]; return getEvidenceSnapshot(); }
export function ingestExport(result={}) { state.messages=Array.isArray(result.messages)?result.messages:[]; state.media=Array.isArray(result.media)?result.media:[]; state.observers=Array.isArray(result.observers)?result.observers:[]; state.observations=Array.isArray(result.observations)?result.observations:[]; state.media_links=Array.isArray(result.media_links)?result.media_links:[]; return getEvidenceSnapshot(); }
export function addObservation(observation){if(!observation||!observation.id)throw new Error('Observation requires an id.');state.observations.push(observation);return observation;}
export function addReview(review){if(!review?.review_id)throw new Error('Review requires review_id.');state.reviews.push(review);return review;}
export function addMediaEvidenceLink(link){if(!link?.media_id||!link?.observation_id)throw new Error('Media evidence link requires media_id and observation_id.');state.media_links.push(link);return link;}
export function getMediaEvidenceLinks(observationId){return state.media_links.filter(x=>x.observation_id===observationId).map(x=>({...x}));}
export function getEvidenceSnapshot(){return JSON.parse(JSON.stringify(state));}
