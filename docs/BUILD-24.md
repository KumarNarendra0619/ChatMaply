# ChatMaply — BUILD-24: Object Location Confirmation

## Purpose
Separate the location of the observer/device from the location of the object or event being reported.

## User workflow
1. Select a mapped report.
2. Review its current candidate location.
3. Choose `Confirm object location` if the location is acceptable.
4. Choose `Move marker` and click the actual object/event position if correction is needed.
5. Choose `Reject` when the location evidence is not reliable.

## Evidence states
- `candidate` — location exists but has not been accepted by the reviewer.
- `confirmed` — reviewer explicitly accepted the object/event location.
- `rejected` — reviewer rejected the location.

## Location provenance
`location_type=OBJECT_LOCATION` is assigned only after explicit confirmation. Observer location remains a separate record.

## Accuracy
A manually moved marker does not create better GPS accuracy. The existing accuracy is retained as the source uncertainty unless a stronger measurement is supplied.

## Safety / integrity
No automatic inference is presented as a confirmed object location. The interface requires a human review action before confirmation.

## Next build
BUILD-25 should add an evidence-aware media-to-observation link so an inspected image/video can be attached to a specific object report and then reviewed on the map.
