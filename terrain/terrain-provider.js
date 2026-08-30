// BUILD-12: provider adapter for elevation/DEM services.
// The app supplies a provider implementation; this core layer never invents terrain values.

export function createTerrainProvider(fetchElevation) {
  if (typeof fetchElevation !== 'function') throw new Error('A terrain provider function is required.');
  return {
    async elevationAt(latitude, longitude) {
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
      const result = await fetchElevation(latitude, longitude);
      if (!result || !Number.isFinite(Number(result.elevation_m))) return null;
      return {
        elevation_m: Number(result.elevation_m),
        source: result.source || 'external DEM/elevation provider',
        quality: result.quality || 'provider-reported',
        timestamp: result.timestamp || new Date().toISOString()
      };
    }
  };
}

export function buildTerrainTileRequest(bounds, resolution = 'village') {
  return {
    bounds,
    resolution,
    requested_layers: ['elevation'],
    derived_layers: ['slope'],
    note: 'Provider implementation and licensing must be verified before production use.'
  };
}
