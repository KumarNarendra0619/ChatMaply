// BUILD-06: lightweight browser-side EXIF GPS reader for JPEG images.
// No upload is performed. Coordinates are accepted only when a valid GPS tag is present.

function read16(view, offset, little) { return view.getUint16(offset, little); }
function read32(view, offset, little) { return view.getUint32(offset, little); }

function rational(view, offset, little) {
  const numerator = read32(view, offset, little);
  const denominator = read32(view, offset + 4, little);
  return denominator ? numerator / denominator : null;
}

function dmsToDecimal(values, ref) {
  if (!values?.every(Number.isFinite)) return null;
  const decimal = values[0] + values[1] / 60 + values[2] / 3600;
  return /[SW]/i.test(ref) ? -decimal : decimal;
}

export async function extractJpegGps(file) {
  if (!file || !/^image\/jpe?g$/i.test(file.type) && !/\.jpe?g$/i.test(file.name || '')) return null;
  const buffer = await file.arrayBuffer();
  const view = new DataView(buffer);
  if (view.byteLength < 4 || view.getUint16(0, false) !== 0xFFD8) return null;
  let offset = 2;
  while (offset + 4 <= view.byteLength) {
    if (view.getUint8(offset) !== 0xFF) break;
    const marker = view.getUint8(offset + 1);
    const length = view.getUint16(offset + 2, false);
    if (marker === 0xE1 && offset + 10 < view.byteLength) {
      const exifStart = offset + 10;
      const header = new TextDecoder().decode(new Uint8Array(buffer, offset + 4, 6));
      if (header === 'Exif\0\0') {
        const tiff = offset + 10;
        const little = view.getUint16(tiff, false) === 0x4949;
        if ((little ? view.getUint16(tiff + 2, true) : view.getUint16(tiff + 2, false)) !== 42) return null;
        const ifd0Offset = little ? view.getUint32(tiff + 4, true) : view.getUint32(tiff + 4, false);
        const ifd0 = tiff + ifd0Offset;
        const count = little ? view.getUint16(ifd0, true) : view.getUint16(ifd0, false);
        let gpsOffset = null;
        for (let i = 0; i < count; i++) {
          const e = ifd0 + 2 + i * 12;
          const tag = little ? view.getUint16(e, true) : view.getUint16(e, false);
          if (tag === 0x8825) gpsOffset = little ? view.getUint32(e + 8, true) : view.getUint32(e + 8, false);
        }
        if (gpsOffset == null) return null;
        const gps = tiff + gpsOffset;
        const gpsCount = little ? view.getUint16(gps, true) : view.getUint16(gps, false);
        let latRef = '', lonRef = '', lat = null, lon = null;
        for (let i = 0; i < gpsCount; i++) {
          const e = gps + 2 + i * 12;
          const tag = little ? view.getUint16(e, true) : view.getUint16(e, false);
          const type = little ? view.getUint16(e + 2, true) : view.getUint16(e + 2, false);
          const n = little ? view.getUint32(e + 4, true) : view.getUint32(e + 4, false);
          const valueOffset = little ? view.getUint32(e + 8, true) : view.getUint32(e + 8, false);
          const valuePos = (type === 2 && n <= 4) ? e + 8 : tiff + valueOffset;
          if (tag === 1 && type === 2) latRef = new TextDecoder().decode(new Uint8Array(buffer, valuePos, Math.min(n, 4))).replace(/\0/g, '');
          if (tag === 3 && type === 2) lonRef = new TextDecoder().decode(new Uint8Array(buffer, valuePos, Math.min(n, 4))).replace(/\0/g, '');
          if (tag === 2 && type === 5 && n >= 3) lat = [0,1,2].map(k => rational(view, tiff + valueOffset + k * 8, little));
          if (tag === 4 && type === 5 && n >= 3) lon = [0,1,2].map(k => rational(view, tiff + valueOffset + k * 8, little));
        }
        const latitude = dmsToDecimal(lat, latRef); const longitude = dmsToDecimal(lon, lonRef);
        if (latitude != null && longitude != null && latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180) return { latitude, longitude, source: 'JPEG EXIF GPS', confidence: 'Embedded' };
      }
    }
    offset += 2 + length;
  }
  return null;
}
