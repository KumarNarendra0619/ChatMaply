# ChatMaply — BUILD-19: Evidence Timeline + Condition History

## Objective
Show the history of one verified physical entity across time, including linked observations, condition, location accuracy, elevation, slope and evidence lineage.

## Data flow

```text
Verified Physical Entity
        ↓
Linked Observations
        ↓
Chronological Timeline
        ↓
Condition History
        ↓
Map / 3D Globe / Evidence
```

## Implemented
- `temporal/entity-history.js` builds a chronological entity timeline.
- Condition-change summary: improved / worsened / unchanged / insufficient evidence.
- Time-window filtering.
- Retains location accuracy, elevation, slope, evidence and lineage per observation.
- `ui/entity-timeline.js` provides a simple “Place history” panel.

## Interpretation rules
- A condition trend is descriptive, not a causal assessment.
- Missing timestamps are retained as unknown and sorted without inventing a date.
- Missing elevation/slope/accuracy remain unavailable.
- A condition change is only calculated from explicit condition labels; AI confidence is not treated as a measurement.

## Intended user view

```text
Waste Site E-001

First report     → Moderate
Second report    → Poor
Third report     → Severe

Trend: Worsened

Location: ±25 m
Elevation: 1,105 m
Slope: 7°
Evidence: 4 images + 2 messages + 1 video
```

## Next integration
Connect the timeline panel to the map/entity selection so clicking a physical entity opens its evidence history and selecting a timeline item highlights its corresponding location/time on the map.
