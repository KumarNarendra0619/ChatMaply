// BUILD-12: 3D-ready terrain/globe presentation model.
// Rendering is provider/UI-specific; this module converts observations into normalized 3D points.

export function observationTo3DPoint(observation = {}) {
  const lat = Number(observation.latitude);
  const lon = Number(observation.longitude);
  const elevation = Number(observation.terrain?.elevation_m);
  if (![lat, lon, elevation].every(Number.isFinite)) return null;
  return {
    latitude: lat,
    longitude: lon,
    elevation_m: elevation,
    timestamp: observation.timestamp || null,
    category: observation.category || observation.type || 'Observation',
    condition: observation.condition || 'Unknown',
    confidence: observation.confidence || 'Unknown',
    accuracy_m: Number.isFinite(Number(observation.accuracy_m)) ? Number(observation.accuracy_m) : null
  };
}

export function buildGlobeDataset(observations = []) {
  return observations.map(observationTo3DPoint).filter(Boolean);
}
