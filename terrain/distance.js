// BUILD-09: geospatial distance and terrain context utilities.

export function haversineMeters(a, b) {
  if (!Number.isFinite(a?.latitude) || !Number.isFinite(a?.longitude) || !Number.isFinite(b?.latitude) || !Number.isFinite(b?.longitude)) return null;
  const R = 6371008.8;
  const rad = d => d * Math.PI / 180;
  const p1 = rad(a.latitude), p2 = rad(b.latitude);
  const dp = rad(b.latitude - a.latitude), dl = rad(b.longitude - a.longitude);
  const h = Math.sin(dp/2)**2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl/2)**2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function buildSpatialRelation(observer, object, terrain = null) {
  return {
    distance_m: haversineMeters(observer, object),
    observer_accuracy_m: Number.isFinite(observer?.accuracy_m) ? observer.accuracy_m : null,
    object_accuracy_m: Number.isFinite(object?.accuracy_m) ? object.accuracy_m : null,
    terrain: terrain || null
  };
}
