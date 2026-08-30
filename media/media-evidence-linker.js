// BUILD-25: link local media evidence to a specific ChatMaply observation.
// A link is an evidence relationship, not a claim that media GPS equals object GPS.

export function createMediaEvidenceLink({ mediaId, observationId, source = 'manual', relation = 'supports', note = '' } = {}) {
  if (!mediaId || !observationId) throw new Error('mediaId and observationId are required.');
  return { id:`mel-${Date.now()}-${Math.random().toString(36).slice(2,8)}`, media_id:mediaId, observation_id:observationId, source, relation, note, created_at:new Date().toISOString() };
}

export function resolveMediaLocationEvidence({ mediaInfo = null, observation = null, observerLocation = null } = {}) {
  if (mediaInfo?.exif?.latitude != null && mediaInfo?.exif?.longitude != null) return { type:'EXACT_GPS', latitude:Number(mediaInfo.exif.latitude), longitude:Number(mediaInfo.exif.longitude), accuracy_m:mediaInfo.exif.accuracy_m ?? null, source:'media-exif' };
  if (observation?.latitude != null && observation?.longitude != null) return { type:'OBJECT_LOCATION', latitude:Number(observation.latitude), longitude:Number(observation.longitude), accuracy_m:observation.accuracy_m ?? null, source:'linked-observation' };
  if (observerLocation?.latitude != null && observerLocation?.longitude != null) return { type:'OBSERVER_LOCATION', latitude:Number(observerLocation.latitude), longitude:Number(observerLocation.longitude), accuracy_m:observerLocation.accuracy_m ?? null, source:'observer' };
  return { type:'UNKNOWN', latitude:null, longitude:null, accuracy_m:null, source:'none' };
}
