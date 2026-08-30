# ChatMaply — BUILD-18: Entity Review UI

## Objective
Give a non-technical village user a safe way to decide whether nearby evidence belongs to the same physical entity.

## Review choices

1. **Merge** — explicitly confirms both observations represent one physical entity.
2. **Keep Separate** — explicitly confirms they are different entities.
3. **Needs Review** — leaves the candidate unresolved.

## Review principle
AI/spatial proximity may recommend a candidate, but it cannot silently merge physical entities.

## Evidence shown to reviewer
The intended panel should show, where available:
- map location
- distance between candidates
- horizontal accuracy
- timestamp
- linked text
- image/video count
- condition history
- elevation and slope

## Data integrity
Merge creates a lineage record through `last_review` and combines unique evidence IDs. Keep Separate preserves the entity as independently verified. All decisions carry reviewer and timestamp metadata.

## UX principle
Use plain-language actions rather than GIS jargon. A village user should understand: “Same place”, “Different places”, and “I’m not sure”.

## Important limitation
This build provides the review state engine and styling. Full attachment preview and interactive map-to-panel wiring should be integrated after the current app shell is audited for its existing UI selectors/components.
