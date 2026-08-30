// BUILD-24: explicit object-location candidate + human confirmation.
// Observer position and object position are separate records.

export function createObjectLocationCandidate({ observationId, latitude, longitude, accuracy_m = null, source = 'manual', confidence = 'Unverified', timestamp = null } = {}) {
  const lat = Number(latitude), lng = Number(longitude);
  if (!observationId) throw new Error('observationId is required.');
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) throw new Error('Valid latitude and longitude are required.');
  return { observation_id: observationId, latitude: lat, longitude: lng, accuracy_m: Number.isFinite(Number(accuracy_m)) ? Number(accuracy_m) : null, source, confidence, timestamp, status: 'candidate' };
}

export function confirmObjectLocation(candidate, { reviewer = 'current-user', note = '' } = {}) {
  if (!candidate?.observation_id) throw new Error('A candidate location is required.');
  return { ...candidate, status: 'confirmed', location_type: 'OBJECT_LOCATION', confirmed_at: new Date().toISOString(), reviewer, note };
}

export function rejectObjectLocation(candidate, { reviewer = 'current-user', note = '' } = {}) {
  if (!candidate?.observation_id) throw new Error('A candidate location is required.');
  return { ...candidate, status: 'rejected', rejected_at: new Date().toISOString(), reviewer, note };
}
