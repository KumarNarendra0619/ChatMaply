# ChatMaply — BUILD-20: Map ↔ Timeline ↔ Evidence Linking

## Objective
Create one interaction contract so a selected observation can be traced across map, timeline and source evidence.

## Interaction model

```text
MAP MARKER
   ↓ click
Observation Context
   ↓
Entity + Timeline + Evidence

TIMELINE ITEM
   ↓ click
Map Jump
   ↓
Exact observation coordinates + timestamp

EVIDENCE ITEM
   ↓ select
Source lineage
   ↓
Message / Media reference
```

## Implemented
- `ui/evidence-linker.js`: creates indexed links between entities, observations and lineage.
- `ui/evidence-panel.js`: renders a lightweight evidence detail panel.
- Map-jump payload preserves coordinates and timestamp.

## Safety / integrity
- No coordinate is generated when an observation has no explicit latitude/longitude.
- Evidence linkage uses stored lineage IDs rather than guessing source relationships.
- Timestamp is displayed as unknown when absent.

## UI principle
The user should be able to answer three questions quickly:
1. **Where?** — map / coordinates / accuracy.
2. **When?** — observation timestamp / timeline.
3. **Why is this marker here?** — linked source evidence.

## Integration note
This build establishes the interaction contract and panel renderer. Existing page-specific DOM wiring should be connected only after selectors are verified, to avoid breaking the current app shell.
