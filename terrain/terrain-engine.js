// BUILD-09: terrain intelligence primitives.
// DEM/elevation providers are intentionally injected; this module never invents terrain values.

export function validateTerrainPoint(point = {}) {
  const elevation = Number(point.elevation_m);
  const slope = Number(point.slope_deg);
  return {
    elevation_m: Number.isFinite(elevation) ? elevation : null,
    slope_deg: Number.isFinite(slope) && slope >= 0 && slope <= 90 ? slope : null,
    source: point.source || 'unknown',
    timestamp: point.timestamp || null,
    quality: point.quality || 'unknown'
  };
}

export function slopeFromElevations(center, neighbour, horizontalDistanceM) {
  const d = Number(horizontalDistanceM);
  const dz = Number(neighbour) - Number(center);
  if (!Number.isFinite(d) || d <= 0 || !Number.isFinite(dz)) return null;
  return Math.atan2(Math.abs(dz), d) * 180 / Math.PI;
}

export function attachTerrainToObservation(observation, terrain = {}) {
  const t = validateTerrainPoint(terrain);
  return {
    ...observation,
    terrain: {
      elevation_m: t.elevation_m,
      slope_deg: t.slope_deg,
      source: t.source,
      quality: t.quality,
      timestamp: t.timestamp
    }
  };
}

export function terrainSummary(terrain = {}) {
  const t = validateTerrainPoint(terrain);
  return `${t.elevation_m == null ? 'Elevation unavailable' : `${t.elevation_m} m`} • ${t.slope_deg == null ? 'Slope unavailable' : `${t.slope_deg.toFixed(1)}° slope`}`;
}
