# ChatMaply BUILD-01

## Goal
Convert an exported group conversation into a structured foundation for spatio-temporal mapping.

## Frozen scope
- Exported WhatsApp, Telegram, Signal and Messenger chat as input targets.
- ZIP/TXT/JSON/HTML upload interface.
- Extract sender, message, date, time and media references.
- Keep observer location separate from object/event location.
- Preserve spatial accuracy and timestamp fields.
- Show a simple 2D map and timeline.
- Village-friendly UI; no GIS expertise required.

## Location model
A user first grants OS location permission and explicitly shares location for a group. The app records latitude, longitude, device-reported accuracy and timestamp as the observer location. Later observations must not automatically overwrite this with object location.

```text
User joins group
  -> Share Location permission
  -> OS location permission
  -> GPS / Wi-Fi / Cell positioning
  -> lat + lng + accuracy + timestamp
  -> Observer Location
  -> Map marker
```

## Observation model
```text
Observation
- observer_id
- group_id
- message_id
- object_type
- condition
- observer_location
- object_location
- spatial_accuracy_m
- capture_time
- message_time
- event_time
- confidence
- evidence_media
```

## Accuracy rule
Known, estimated and unknown locations must remain distinguishable. The system must never invent exact coordinates when evidence is insufficient.

## Terrain
Elevation, slope and aspect are derived from the mapped coordinate and a DEM in a later build. They are not claimed to be directly measured from an ordinary image.

## BUILD-01 non-goals
- Live access to private messaging accounts.
- Facial recognition or person surveillance.
- 3D/4D globe.
- Exact waste volume measurement from one ordinary image.
- Production AI object geolocation.
- Permanent storage of uploaded private chats.
