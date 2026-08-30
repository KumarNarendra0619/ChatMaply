# ChatMaply — BUILD-23: Media Evidence Viewer + EXIF Inspector

## Objective
Inspect an image or video locally and explicitly distinguish exact embedded GPS from object location, observer location and unknown location.

## Implemented
- Browser-side media preview for image/video.
- JPEG EXIF GPS inspection using the existing BUILD-06 parser.
- Location evidence classification.
- File type, size and location status display.
- Local object URL cleanup when a new file is selected.
- UI legend explaining the four location states.

The existing EXIF reader accepts GPS only when valid JPEG GPS tags are present. fileciteturn33file0
The existing media-location pipeline already distinguishes embedded media GPS from text-reported coordinates and otherwise leaves location unavailable. fileciteturn34file0

## Evidence classes

```text
EXACT_GPS
  └─ embedded in media EXIF

OBJECT_LOCATION
  └─ mapped object/event coordinate

OBSERVER_LOCATION
  └─ person/device coordinate

UNKNOWN
  └─ no reliable coordinate
```

## Important limitation
Video metadata support is currently preview-only in this build. The inspector does not claim that every video container contains readable GPS metadata.

## Privacy
Inspection is browser-local. The selected file is rendered using a temporary object URL and is not uploaded by this feature.

## Research integrity
EXIF GPS is evidence of embedded metadata, not proof that the photographed object is exactly at that coordinate. Metadata can be absent, stale or altered. Object location remains a separate observation class.
