# ChatMaply — BUILD-10: 4D Spatio-Temporal Map

## Objective
Represent evidence by **where + when**, allowing a village/group-chat dataset to be explored as a temporal map rather than a static collection of markers.

## Implemented
- Timestamp normalization to machine-readable time values.
- Chronological sorting.
- Time-window filtering.
- Temporal snapshots.
- Conservative condition-change comparison across repeated observations.
- Human-review flag for detected changes.

## Core model

```text
Evidence
├── location
├── spatial accuracy
├── timestamp
├── observer
├── object/event
├── condition
└── terrain

        ↓

Spatial + Temporal Index
        ↓

Map + Timeline
```

## 4D interpretation
For ChatMaply, “4D” means **3D geographic context + time**. The current UI is a 2D map with temporal filtering; elevation/slope provide the third spatial dimension. A full 3D globe is a later presentation layer, not assumed to exist merely because elevation is stored.

## Change detection rule
A change is only suggested when comparable observations have explicit condition values. It is labelled `worsened`, `improved`, or `unchanged`; otherwise the result is `insufficient evidence`.

## Important limitation
The engine does not decide that two nearby reports describe the same physical object unless an explicit entity linkage is provided by a later matching/verification layer. Spatial proximity alone is not proof of identity.
