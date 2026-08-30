# ChatMaply — BUILD-25: Media → Observation Evidence Chain

## Goal
Connect an image/video to a specific mapped observation without silently treating media GPS, observer GPS and object GPS as the same thing.

## Evidence chain
Chat message → Media → Observation → Object location → Time → Terrain

## Location precedence
1. Exact GPS: embedded media EXIF, when available.
2. Object location: coordinates explicitly linked to the observation.
3. Observer location: person/device position only.
4. Unknown: no reliable location.

The precedence is an evidence classification rule, not proof that EXIF coordinates are the photographed object's coordinates.

## Implemented
- `media/media-evidence-linker.js` creates media-to-observation evidence links.
- `resolveMediaLocationEvidence()` keeps location provenance explicit.
- `data/evidence-store.js` stores and retrieves media evidence links.
- Evidence panel displays linked media and object-location confirmation state.
- Existing local media inspection remains browser-side.

## Review principle
A reviewer must be able to answer:
- Which media file supports this observation?
- Which observation does the media belong to?
- What is the media's location source?
- Is the object location confirmed?
- What accuracy applies to the location?

## Privacy
Do not commit real chat exports, private media, phone numbers, credentials or access tokens to the repository.

## Scope boundary
Automatic object recognition, image geolocation and video-frame geolocation are not claimed as verified capabilities by BUILD-25. Those should be introduced only with explicit confidence/provenance and human review.
