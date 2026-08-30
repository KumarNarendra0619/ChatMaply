// BUILD-04 location engine. Browser-only observer location capture with explicit consent.
// Observer location and object location are intentionally separate.

export function getLocationSupport() {
  return 'geolocation' in navigator;
}

export function requestObserverLocation(onSuccess, onError) {
  if (!getLocationSupport()) {
    onError?.(new Error('This browser does not provide location services.'));
    return;
  }
  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude, accuracy, altitude } = position.coords;
      onSuccess?.({
        latitude,
        longitude,
        accuracy_m: Number.isFinite(accuracy) ? accuracy : null,
        elevation_m: Number.isFinite(altitude) ? altitude : null,
        timestamp: new Date(position.timestamp).toISOString(),
        source: 'OS geolocation (GPS/Wi-Fi/Cell/fused)',
        consent: true
      });
    },
    error => onError?.(error),
    { enableHighAccuracy: true, maximumAge: 30000, timeout: 15000 }
  );
}

export function validateCoordinate(location) {
  return Number.isFinite(location?.latitude) && Number.isFinite(location?.longitude)
    && location.latitude >= -90 && location.latitude <= 90
    && location.longitude >= -180 && location.longitude <= 180;
}

export function haversineMeters(a, b) {
  if (!validateCoordinate(a) || !validateCoordinate(b)) return null;
  const R = 6371008.8;
  const toRad = deg => deg * Math.PI / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function createObserverLocation({ userId, groupId, location }) {
  if (!validateCoordinate(location)) throw new Error('Invalid observer coordinates.');
  return {
    user_id: userId || 'anonymous',
    group_id: groupId || 'current-group',
    latitude: location.latitude,
    longitude: location.longitude,
    accuracy_m: location.accuracy_m ?? null,
    elevation_m: location.elevation_m ?? null,
    timestamp: location.timestamp || new Date().toISOString(),
    source: location.source || 'OS geolocation',
    consent: location.consent === true
  };
}
