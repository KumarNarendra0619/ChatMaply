# ChatMaply — BUILD-11: 3D Terrain + Temporal Playback

## Objective
Make the existing spatial + temporal model visible through a simple timeline/playback layer and prepare terrain observations for a future 3D globe.

## Implemented
- 3D-ready GeoJSON terrain point model with elevation as Z when available.
- Temporal playback controller with play, pause, step and reset.
- Chronological record handling.
- Explicit terrain source and quality fields.

## Current product boundary
The public prototype still uses Leaflet 2D mapping. BUILD-11 prepares the data and playback architecture; it does **not** claim that a full 3D globe or DEM terrain surface is already rendered.

## Planned presentation
```text
Village / Group
      ↓
2D Map ↔ 3D Terrain View
      ↓
Time slider
      ↓
Play / Pause
      ↓
Observation appears/disappears by timestamp
      ↓
Click observation
      ↓
Evidence + object location + accuracy + elevation + slope
```

## Data integrity
- Missing elevation stays missing.
- Missing timestamps stay outside temporal playback.
- Object and observer locations remain separate.
- Playback does not alter source evidence.
