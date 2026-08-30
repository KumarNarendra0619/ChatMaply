// BUILD-05: evidence-based object/event location extraction.
// Never substitutes observer coordinates for an object location.

export function createObjectObservation({ id, type = 'Unknown', latitude = null, longitude = null, accuracy_m = null, timestamp = null, source = 'unknown', confidence = 'Unknown', evidence = [] }) {
  const hasCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude);
  return {
    id: id || `obs-${Date.now()}`,
    type,
    latitude: hasCoordinates ? latitude : null,
    longitude: hasCoordinates ? longitude : null,
    accuracy_m: Number.isFinite(accuracy_m) ? accuracy_m : null,
    timestamp: timestamp || null,
    source,
    confidence,
    evidence,
    location_status: hasCoordinates ? 'known' : 'unknown'
  };
}

export function extractGpsFromText(text = '') {
  const patterns = [
    /(?:lat(?:itude)?)[^0-9-]*(-?\d{1,3}(?:\.\d+)?)[\s,;]+(?:lon(?:gitude)?|lng)[^0-9-]*(-?\d{1,3}(?:\.\d+)?)/i,
    /(-?\d{1,3}\.\d{3,})\s*,\s*(-?\d{1,3}\.\d{3,})/
  ];
  for (const pattern of patterns) {
    const match = String(text).match(pattern);
    if (!match) continue;
    const latitude = Number(match[1]);
    const longitude = Number(match[2]);
    if (latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180) return { latitude, longitude, source: 'message text', confidence: 'Reported' };
  }
  return null;
}

export function linkObservationToObserver(observation, observer, distanceFn) {
  if (!observation?.latitude || !observation?.longitude || !observer) return { ...observation, observer_distance_m: null };
  return { ...observation, observer_distance_m: distanceFn(observation, observer) };
}
