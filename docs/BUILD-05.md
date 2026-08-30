# ChatMaply — BUILD-05: Object/Event Location + Evidence

## Purpose
Separate **observer location** from **object/event location** and preserve how every location was obtained.

## Location priority
1. Explicit GPS coordinates embedded in a media/message record.
2. Explicit coordinates reported in message text.
3. User-confirmed object/event location (future UI workflow).
4. Unknown — never substitute the observer location.

## Confidence
- `Reported`: explicit coordinate from message text.
- `Embedded`: coordinate supplied by media metadata.
- `Confirmed`: manually confirmed by a user (future UI).
- `Estimated`: derived by a future, auditable method; never silently presented as exact.
- `Unknown`: no reliable object coordinate.

## Evidence provenance
Every observation should retain:

```text
observation_id
object_type
latitude
longitude
accuracy_m
timestamp
source
confidence
evidence[]
observer_distance_m
```

## Current BUILD-05 implementation
- Object/event observation model.
- Coordinate extraction from explicit coordinate text.
- Media evidence/provenance model.
- Observer-to-object distance linkage utility.

## Deliberately deferred
- EXIF binary metadata extraction from ZIP media.
- Automatic image geolocation from visual content.
- AI object measurement.
- Elevation/slope derivation.
- Manual object-location picker.

Those features belong to later builds and must expose uncertainty rather than invent coordinates.
