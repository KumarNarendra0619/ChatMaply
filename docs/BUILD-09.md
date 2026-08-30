# ChatMaply — BUILD-09: Terrain Intelligence

## Objective
Attach defensible terrain context to a confirmed observation: elevation, slope, distance and data quality.

## Implemented
- Terrain point validation.
- Slope calculation from elevation difference and horizontal distance.
- Terrain attachment to object/event observations.
- Observer-to-object Haversine distance.
- Observer and object location accuracy retained separately.

## Data-source rule
Terrain values must come from an explicit source (for example a DEM or trusted elevation service) or a measured device value. The engine never fabricates elevation or slope.

## Slope formula

` slope = atan2(|Δelevation|, horizontal_distance) ` converted to degrees.

For production terrain analysis, the horizontal distance and DEM resolution must be recorded because coarse DEMs can materially distort village-scale slopes.

## Output

```text
Observation
├── object location
├── location accuracy
├── timestamp
├── observer distance
└── terrain
    ├── elevation_m
    ├── slope_deg
    ├── source
    └── quality
```

## Not yet implemented
- Live DEM provider integration.
- Contour/profile view.
- watershed/drainage context.
- Image-based 3D reconstruction.
- Metric object measurement from a single uncalibrated photograph.
