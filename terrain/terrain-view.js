// BUILD-11: presentation helpers for a lightweight 3D-ready terrain view.
// The actual terrain surface must be supplied by a trusted DEM/elevation provider.

export function buildTerrainPoint(point = {}) {
  return {
    latitude: Number.isFinite(Number(point.latitude)) ? Number(point.latitude) : null,
    longitude: Number.isFinite(Number(point.longitude)) ? Number(point.longitude) : null,
    elevation_m: Number.isFinite(Number(point.elevation_m)) ? Number(point.elevation_m) : null,
    slope_deg: Number.isFinite(Number(point.slope_deg)) ? Number(point.slope_deg) : null,
    source: point.source || 'unknown',
    quality: point.quality || 'unknown'
  };
}

export function terrainFeatureCollection(points = []) {
  return {
    type: 'FeatureCollection',
    features: points.map((p, index) => {
      const t = buildTerrainPoint(p);
      return {
        type: 'Feature',
        id: p.id || `terrain-${index + 1}`,
        geometry: t.latitude == null || t.longitude == null ? null : { type: 'Point', coordinates: [t.longitude, t.latitude, t.elevation_m] },
        properties: { elevation_m: t.elevation_m, slope_deg: t.slope_deg, source: t.source, quality: t.quality }
      };
    })
  };
}
