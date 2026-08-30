# BUILD-04 Location Model

## Observer location flow

User joins group → explicit "Share Location" consent → OS/browser location permission → GPS/Wi-Fi/Cell/fused positioning → latitude + longitude + accuracy + timestamp (+ elevation when the device provides it) → Observer Location → map marker.

## Rules

1. Observer location is never silently collected.
2. Group consent is separate from OS permission in the application model.
3. `observer_location` and `object_location` are different fields/entities.
4. If object location is unavailable, it remains `unknown`; user location is not substituted.
5. Accuracy is preserved in metres when supplied by the positioning API.
6. Elevation is stored only when supplied; terrain-derived elevation will be added in a later build.
7. BUILD-04 does not infer object location from an image.
8. Distance between known observer/object coordinates uses the Haversine formula.

## Normalized record

```text
user_id
group_id
latitude
longitude
accuracy_m
elevation_m
timestamp
source
consent
```
