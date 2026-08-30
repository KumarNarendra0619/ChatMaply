// BUILD-02 common normalized message/media model.
export function normalizeMessage({id, sender, date, time, text = '', media = null}) {
  return { id, sender, date, time, text, media };
}

export function classifyMedia(filename = '') {
  const ext = filename.toLowerCase().split('.').pop();
  if (['jpg','jpeg','png','webp','gif','heic'].includes(ext)) return 'image';
  if (['mp4','mov','m4v','avi','webm','mkv'].includes(ext)) return 'video';
  return 'other';
}
