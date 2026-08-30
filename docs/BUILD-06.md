# ChatMaply — BUILD-06: Media Location & Confirmation

## Implemented
- Browser-side JPEG EXIF GPS extraction.
- Media-to-location enrichment pipeline.
- Explicit text-coordinate fallback when EXIF is unavailable.
- User-confirmed object/event location model.
- Provenance and confidence are preserved.

## Location precedence

```text
JPEG EXIF GPS
      ↓ if unavailable
Explicit coordinates in related message text
      ↓ if unavailable
User-confirmed map location
      ↓ if unavailable
UNKNOWN
```

The observer's location is never used as an automatic object location.

## Accuracy

EXIF GPS normally provides coordinates but does not necessarily provide a trustworthy uncertainty radius. Therefore BUILD-06 does **not invent a metre accuracy value** for EXIF coordinates. `accuracy_m` remains null unless an actual accuracy value is available from the source.

## Privacy

EXIF parsing happens in the browser. The prototype does not upload the original image to a server merely to read its GPS tags.

## Deferred
- EXIF video metadata parsing.
- HEIC/AVIF metadata parsing.
- Visual AI geolocation.
- Object measurement from image geometry.
- DEM-based elevation and slope.
