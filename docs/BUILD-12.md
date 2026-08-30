# ChatMaply — BUILD-12: DEM + 3D Terrain/Globe Foundation

## Objective
Move from stored elevation values to a provider-agnostic terrain architecture and prepare confirmed observations for 3D rendering.

## Implemented
- Injectable elevation/DEM provider adapter.
- Terrain tile/request contract with explicit resolution and licensing note.
- 3D observation point model using latitude, longitude and verified elevation.
- Globe dataset builder that drops observations without valid elevation rather than inventing Z values.

## Data flow

```text
Confirmed Observation
        ↓
Latitude + Longitude
        ↓
DEM / Elevation Provider
        ↓
Elevation (Z)
        ↓
Slope derivation
        ↓
3D Observation Point
        ↓
3D Globe / Terrain Renderer
```

## Village-scale recommendation
Use the smallest practical DEM tile around the selected village and cache only the required extent. Do not load a global high-resolution surface into the browser. The exact DEM source, resolution, vertical datum and licensing must be configured before production deployment.

## Accuracy rule
Horizontal location accuracy and vertical/elevation accuracy are separate fields. A precise-looking 3D point does not imply precise elevation. Both source and quality must be retained.

## Deferred
- Selecting and licensing a production DEM source.
- WebGL globe/terrain renderer integration.
- Terrain mesh/contour generation.
- 3D temporal playback.
- Photogrammetric 3D reconstruction from multiple images.
