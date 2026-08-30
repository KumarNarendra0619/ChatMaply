# ChatMaply — BUILD-07: Evidence AI / Condition Review

## Objective
Create a safe first AI layer for classifying reported conditions without pretending that a text rule or future vision model has established an object's exact location or physical measurements.

## Implemented
- Explainable text/evidence category classification.
- Categories: Waste/disposal, water issue, road/access, fire/smoke, unclassified.
- Explicit condition signals: Good, Moderate, Poor, Severe, Needs review.
- Structured waste/disposal report.
- Human-review flag on every generated assessment.

## Location rule
The classifier may receive a known location, but it cannot create coordinates from the visual/text category. Object location remains evidence-derived and separate from observer location.

## AI boundary
BUILD-07 is an explainable baseline, not a trained computer-vision model. It does not claim to detect waste, measure volume, measure object dimensions, infer slope, or geolocate an image from pixels.

## Next AI-ready input
A later multimodal model can consume an image/video frame plus its provenance and return a structured assessment. The UI must show confidence, evidence, and human-review state.
