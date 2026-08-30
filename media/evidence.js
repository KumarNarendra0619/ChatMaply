// BUILD-05 media evidence inventory.
// This stage inventories media and preserves provenance. It does not guess object coordinates from pixels.

export function createMediaEvidence({ media_id, message_id, path, type, timestamp = null, metadata = {} }) {
  return {
    media_id: media_id || `media-${Date.now()}`,
    message_id: message_id || null,
    path,
    type,
    timestamp,
    metadata,
    location_status: Number.isFinite(metadata.latitude) && Number.isFinite(metadata.longitude) ? 'known' : 'unknown',
    object_location_source: Number.isFinite(metadata.latitude) && Number.isFinite(metadata.longitude) ? 'embedded metadata' : 'not available'
  };
}

export function supportedMediaType(type) {
  return type === 'image' || type === 'video';
}
