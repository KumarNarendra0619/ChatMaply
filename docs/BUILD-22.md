# ChatMaply — BUILD-22: Real Validation + Interaction Wiring

## Objective
Connect the BUILD-19 timeline and BUILD-20 evidence-linking modules to the actual workspace and establish a controlled real-export validation path.

## Implemented
- Map observation clicks now populate Selected report, Place history and Evidence panels.
- Map jump context preserves observation coordinates and timestamp.
- Evidence panel consumes lineage data when available.
- Workspace keeps observer and object locations separate.
- Import status explicitly reports mapped evidence locations and states that locations are not invented.
- Existing 2D/3D switching remains available.

## Validation protocol
Use only synthetic or consented exports.

For each platform:
1. Export a small group chat with media.
2. Run it locally through ChatMaply.
3. Compare original message count with imported count.
4. Compare media count and media linkage.
5. Compare explicit location records.
6. Verify timestamp preservation.
7. Verify that observer location is never substituted for object location.
8. Record pass/fail without committing the private export.

## Important status
The repository integration is not a certification that WhatsApp, Telegram, Signal or Messenger exports are all production-compatible. Platform support must remain gated by actual representative export tests.

## Security boundary
No private chat export, personal media, phone number list, credentials or access token should be committed to GitHub. External AI processing is not required for the core import/map workflow.

## Next build
BUILD-23 should focus on a real media evidence viewer and EXIF/location evidence inspection, with clear distinction between exact GPS, observer location, inferred location and unknown location.
