# ChatMaply — BUILD-14: Export → Evidence Store → Map Pipeline

## Purpose
Connect the existing parser outputs to a normalized evidence store and create map observations only from explicit source locations.

## Pipeline

```text
Chat Export
   ↓
ZIP / TXT / JSON / HTML parser
   ↓
Messages + Media metadata
   ↓
Normalized Evidence Store
   ↓
Evidence-to-Observation Builder
   ↓
Only explicit coordinates become mapped observations
   ↓
2D Map / 3D Globe / Timeline
```

## Hard rule
A message/media record without explicit object/event coordinates remains unmapped. Observer location is never copied into an object observation.

## Implemented
- `data/evidence-store.js`: in-memory normalized evidence store.
- `data/observation-builder.js`: safe conversion of explicit message/media coordinates to map records.
- `app.js`: existing ZIP inspection is now connected to the map status/count workflow.

## Privacy model
The prototype processes selected ZIP files in the browser. No server-side persistence is introduced by this build. Raw media should not be uploaded to a third-party AI provider without explicit user action and a clear privacy policy.

## Known limitation
The current ZIP parser is an inspection layer; it does not yet guarantee correct extraction of every platform's message/media relationship. Signal and Messenger remain unverified until real exports are tested. This build therefore reports what was actually parsed instead of fabricating observations.
