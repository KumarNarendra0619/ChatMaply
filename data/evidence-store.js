// BUILD-25 + audit: normalized client-side evidence store.
// Raw chat/media metadata stays separate from derived observations and review records.
const state={messages:[],media:[],observers:[],observations:[],reviews:[],media_links:[],assessments:[]};
export function resetEvidenceStore(){state.messages=[];state.media=[];state.observers=[];state.observations=[];state.reviews=[];state.media_links=[];state.assessments=[];return getEvidenceSnapshot();}
export function ingestExport(result={}){state.messages=Array.isArray(result.messages)?result.messages:[];state.media=Array.isArray(result.media)?result.media:[];state.observers=Array.isArray(result.observers)?result.observers:[];state.observations=Array.isArray(result.observations)?result.observations:[];state.reviews=Array.isArray(result.reviews)?result.reviews:[];state.media_links=Array.isArray(result.media_links)?result.media_links:[];state.assessments=Array.isArray(result.assessments)?result.assessments:[];return getEvidenceSnapshot();}
export function addObservation(observation){if(!observation?.id)throw new Error('Observation requires an id.');state.observations.push(observation);return observation;}
export function addReview(review){if(!review?.review_id)throw new Error('Review requires review_id.');state.reviews.push(review);return review;}
export function addMediaEvidenceLink(link){if(!link?.media_id||!link?.observation_id)throw new Error('Media evidence link requires media_id and observation_id.');state.media_links.push(link);return link;}
export function addConditionAssessment(assessment){if(!assessment?.assessment_id||!assessment?.observation_id)throw new Error('Condition assessment requires assessment_id and observation_id.');state.assessments.push(assessment);return assessment;}
export function getMediaEvidenceLinks(observationId){return state.media_links.filter(x=>x.observation_id===observationId).map(x=>({...x}));}
export function getConditionAssessments(observationId){return state.assessments.filter(x=>x.observation_id===observationId).map(x=>({...x}));}
export function getEvidenceSnapshot(){return JSON.parse(JSON.stringify(state));}
