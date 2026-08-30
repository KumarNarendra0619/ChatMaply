// BUILD-14: convert parser evidence into map-safe records.
// Location is only copied when explicitly present in the source evidence.

export function buildObservations({ messages = [], media = [] } = {}) {
  const observations = [];
  messages.forEach((m, i) => {
    const lat = Number(m.latitude ?? m.lat); const lng = Number(m.longitude ?? m.lng);
    if (Number.isFinite(lat) && Number.isFinite(lng)) observations.push({
      id: `msg-${m.id ?? i}`, type: 'Message report', latitude: lat, longitude: lng,
      accuracy_m: Number.isFinite(Number(m.accuracy_m)) ? Number(m.accuracy_m) : null,
      timestamp: m.timestamp || m.time || null, source: 'message evidence', confidence: 'Reported', evidence: [m]
    });
  });
  media.forEach((m, i) => {
    const lat = Number(m.latitude ?? m.lat); const lng = Number(m.longitude ?? m.lng);
    if (Number.isFinite(lat) && Number.isFinite(lng)) observations.push({
      id: `media-${m.id ?? i}`, type: 'Media observation', latitude: lat, longitude: lng,
      accuracy_m: Number.isFinite(Number(m.accuracy_m)) ? Number(m.accuracy_m) : null,
      timestamp: m.timestamp || m.time || null, source: m.source || 'media evidence', confidence: m.confidence || 'Embedded', evidence: [m]
    });
  });
  return observations;
}
