# ChatMaply — Stage Audit: BUILD-01 to BUILD-12

## Audit result
The architecture is coherent as a prototype, but several earlier stages were foundations rather than fully integrated production features. BUILD-13 therefore focuses on presentation/integration without overstating capability.

| Stage | Status | Audit finding |
|---|---|---|
| 01 | Foundation | Present; documentation exists. |
| 02 | Parser foundation | WhatsApp/Telegram parser files exist; coverage must be tested against real exports. |
| 03 | Import foundation | ZIP inspection is present; media-location extraction is not yet automatically wired into import. |
| 04 | Observer location | Browser permission and observer marker are wired into the UI. |
| 05 | Object location | Evidence model exists; object coordinates remain evidence-derived. |
| 06 | Media GPS | JPEG EXIF reader exists; video/HEIC are not covered. |
| 07 | Classification | Explainable text baseline only; not a trained vision model. |
| 08 | AI contract/review | Contract and review queue exist; no hosted multimodal provider is secretly assumed. |
| 09 | Terrain | Terrain calculations and provider adapter exist; production DEM is not connected. |
| 10 | Temporal | Time utilities/change comparison exist; entity matching remains unresolved. |
| 11 | Playback | Playback model exists; full UI integration remains partial. |
| 12 | 3D foundation | 3D data model and DEM adapter exist; renderer was not yet integrated. |

## Critical corrections
1. The demo observation `W-003` previously used longitude `30.269`, which is inconsistent with the surrounding Uttarakhand demo coordinates. It should not be treated as real data; the demo should use internally consistent coordinates or be clearly labelled synthetic.
2. A 4D map means x/y/z + time; a 2D Leaflet map with an elevation field is not itself a 3D globe.
3. AI classification must not be presented as physical measurement or exact visual geolocation.
4. Observer location must never silently become object location.
5. Accuracy must be source-reported; missing uncertainty stays unknown.
6. Production deployment needs a secure backend boundary for AI keys and provider credentials.

## BUILD-13 decision
Integrate a browser 3D globe using Cesium as a presentation layer, using only observations with verified/known elevation. Do not claim live DEM terrain until a licensed DEM provider is configured.
