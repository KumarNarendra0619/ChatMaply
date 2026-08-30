# ChatMaply — BUILD-21: End-to-End Workspace Integration

## Objective
Bring the prototype into one simple workflow: import → process → map → select report → inspect evidence. The UI is intentionally minimal for non-technical users.

## Integrated workspace

```text
1. Upload exported chat
        ↓
2. Process locally
        ↓
3. Mapped reports appear
        ↓
4. Click a report
        ↓
5. Inspect location + accuracy + terrain + evidence
        ↓
6. Switch to 3D Globe
```

## UI changes
- Updated hero copy from BUILD-13 to BUILD-21.
- Added explicit `Explore evidence` workspace wording.
- Added Place history and Evidence panels to the existing side panel.
- Clarified platform support status instead of implying universal export compatibility.
- Kept existing 2D map, observer location and 3D Globe controls.

## Integrity boundary
This is an integration build, not a claim that all platform exports are production-ready. Actual platform verification remains dependent on real representative exports passing BUILD-16 QA.

## Next integration target
Wire BUILD-19 timeline and BUILD-20 interaction modules into the actual DOM after verifying their selectors, then add attachment previews without sending private media to external services by default.
