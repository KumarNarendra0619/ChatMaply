// BUILD-23: browser-side media evidence inspection.
import { extractJpegGps } from './exif.js';

export async function inspectMedia(file, { observerLocation = null, objectLocation = null, timestamp = null } = {}) {
  const embeddedGps = await extractJpegGps(file).catch(() => null);
  const type = file?.type?.startsWith('video/') ? 'video' : file?.type?.startsWith('image/') ? 'image' : 'file';
  const source = embeddedGps ? 'exact-gps-exif' : objectLocation ? 'object-location' : observerLocation ? 'observer-location' : 'unknown';
  return {
    media_type: type,
    name: file?.name || 'media',
    size_bytes: Number(file?.size || 0),
    timestamp: timestamp || null,
    exif: embeddedGps,
    location: embeddedGps || objectLocation || observerLocation || null,
    location_source: source,
    location_status: embeddedGps ? 'Exact GPS embedded in media' : objectLocation ? 'Object location linked from observation' : observerLocation ? 'Observer location only — not object location' : 'No reliable location',
    privacy: 'processed locally in browser'
  };
}

export function classifyLocationEvidence({ exif = null, object = null, observer = null } = {}) {
  if (exif?.latitude != null && exif?.longitude != null) return { type:'EXACT_GPS', confidence:'Embedded', note:'Coordinates are embedded in the media EXIF.' };
  if (object?.latitude != null && object?.longitude != null) return { type:'OBJECT_LOCATION', confidence:object.confidence || 'Unknown', note:'Coordinates belong to the mapped object/event observation.' };
  if (observer?.latitude != null && observer?.longitude != null) return { type:'OBSERVER_LOCATION', confidence:'Device-reported', note:'This is the observer/device position and must not be treated as object location.' };
  return { type:'UNKNOWN', confidence:'Unknown', note:'No reliable location evidence is available.' };
}

export function createMediaPreviewUrl(file) {
  if (!file || typeof URL === 'undefined' || !URL.createObjectURL) return null;
  return URL.createObjectURL(file);
}
