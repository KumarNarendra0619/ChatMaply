export async function enrichImportedMediaWithExif(media = []) {
  // Browser ZIP entries are represented as metadata objects. Actual Blob/File
  // inspection must happen at import time where the bytes are available.
  // This normalizer preserves the evidence contract without inventing GPS.
  return media.map(item => ({
    ...item,
    exif_status: item.exif_status || 'not_inspected',
    location_status: item.location_status || (item.latitude != null && item.longitude != null ? 'gps_present' : 'not_available')
  }));
}

export function attachMediaLocationEvidence(mediaItem, exif = {}) {
  const lat = Number(exif.latitude);
  const lng = Number(exif.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return { ...mediaItem, exif_status: 'inspected_no_gps', location_status: 'not_available' };
  }
  return {
    ...mediaItem,
    latitude: lat,
    longitude: lng,
    lat,
    lng,
    exif_status: 'gps_present',
    location_status: 'gps_evidence'
  };
}
