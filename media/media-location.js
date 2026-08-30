// BUILD-06 media-to-location pipeline.
import { extractJpegGps } from './exif.js';
import { createObjectObservation, extractGpsFromText } from '../location/object-location.js';

export async function enrichMediaLocation(file, relatedText = '', timestamp = null, id = null) {
  const embedded = await extractJpegGps(file).catch(() => null);
  const reported = embedded ? null : extractGpsFromText(relatedText);
  const location = embedded || reported;
  return createObjectObservation({
    id: id || `media-${Date.now()}`,
    type: 'Media observation',
    latitude: location?.latitude ?? null,
    longitude: location?.longitude ?? null,
    accuracy_m: null,
    timestamp,
    source: location?.source || 'not available',
    confidence: location?.confidence || 'Unknown',
    evidence: [{ type: file?.type?.startsWith('video/') ? 'video' : 'image', name: file?.name || 'media' }]
  });
}

export function createManualConfirmation({ latitude, longitude, accuracy_m = null, timestamp = null, type = 'User-confirmed report', evidence = [] }) {
  return createObjectObservation({
    id: `confirmed-${Date.now()}`,
    type,
    latitude: Number(latitude),
    longitude: Number(longitude),
    accuracy_m: Number.isFinite(Number(accuracy_m)) ? Number(accuracy_m) : null,
    timestamp,
    source: 'user-confirmed map location',
    confidence: 'Confirmed',
    evidence
  });
}
