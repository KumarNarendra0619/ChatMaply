// BUILD-27: parser-to-observation QA hardened.
// Only explicit, valid coordinates become map observations. Both canonical and
// legacy coordinate keys are emitted so downstream UI modules stay compatible.

function coordinateOf(value = {}) {
  const latitude = Number(value.latitude ?? value.lat);
  const longitude = Number(value.longitude ?? value.lng);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return null;
  return { latitude, longitude };
}

function accuracyOf(value = {}) {
  const n = Number(value.accuracy_m ?? value.accuracy);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function makeObservation(prefix, item, index, type, source, confidence) {
  const coordinate = coordinateOf(item);
  if (!coordinate) return null;
  const accuracy_m = accuracyOf(item);
  return {
    id: `${prefix}-${item.id ?? index}`,
    type,
    latitude: coordinate.latitude,
    longitude: coordinate.longitude,
    lat: coordinate.latitude,
    lng: coordinate.longitude,
    accuracy_m,
    accuracy: accuracy_m,
    timestamp: item.timestamp || item.dateTime || item.time || null,
    source,
    confidence,
    location_type: item.location_type || item.locationType || 'UNKNOWN',
    evidence: [item]
  };
}

export function buildObservations({ messages = [], media = [] } = {}) {
  const observations = [];
  messages.forEach((m, i) => {
    const observation = makeObservation('msg', m, i, 'Message report', 'message evidence', 'Reported');
    if (observation) observations.push(observation);
  });
  media.forEach((m, i) => {
    const observation = makeObservation('media', m, i, 'Media observation', m.source || 'media evidence', m.confidence || 'Embedded');
    if (observation) observations.push(observation);
  });
  return observations;
}

export function auditObservations(observations = []) {
  const checks = observations.map(o => {
    const coordinate = coordinateOf(o);
    const accuracy = accuracyOf(o);
    return {
      id: o?.id || null,
      coordinate_valid: Boolean(coordinate),
      accuracy_valid: accuracy === null || accuracy >= 0,
      timestamp_present: Boolean(o?.timestamp),
      provenance_present: Boolean(o?.source),
      pass: Boolean(coordinate && (accuracy === null || accuracy >= 0) && o?.source)
    };
  });
  return { total: checks.length, passed: checks.filter(c => c.pass).length, failed: checks.filter(c => !c.pass).length, checks };
}
