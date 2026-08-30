# ChatMaply — BUILD-17: Observation Identity + Evidence Lineage

## Objective
Prevent duplicate markers from being mistaken for separate physical events and allow multiple chat records/media items to be linked to one physical observation after verification.

## Model

```text
Message A ─┐
Image A ───┤
Video A ───┼──> Physical Entity E-001
Message B ─┤
Image B ───┘

E-001
├── location
├── time history
├── condition history
├── terrain context
└── evidence lineage
```

## Implemented
- Canonical coordinate key for deterministic spatial indexing.
- Haversine distance for candidate duplicate links.
- Candidate links within a configurable radius (default 50 m).
- Physical entity record with evidence IDs.
- Evidence lineage connecting derived observations to source records/media.

## Critical rule
Spatial proximity is **not identity**. A 20 m or 50 m separation only creates a candidate link. A human reviewer or a future evidence-matching layer must confirm that records refer to the same physical object/event.

## Why this matters
One waste site can generate ten messages and five images. ChatMaply should display one physical observation with fifteen linked evidence records rather than fifteen apparently independent sites.

## Next integration
The next UI/data build should expose entity clusters, evidence counts, condition history and a review action for merging/splitting candidate observations.
