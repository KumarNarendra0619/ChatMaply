# BUILD-31 — End-to-End Import Engine

BUILD-31 connects the ZIP importer to all four conservative platform adapters and adds a normalized observation QA contract.

## Flow

```text
Export ZIP
  ↓
Archive validation
  ↓
Platform adapter detection
  ↓
Messages + media
  ↓
Normalized observations
  ↓
Evidence store
  ↓
2D map / 3D globe
```

## Adapters

- WhatsApp TXT baseline
- Telegram JSON baseline
- Signal JSON/TXT conservative adapter
- Messenger JSON conservative adapter

## Safety

No observer coordinate is silently copied to an object. Missing coordinates stay missing. Invalid coordinates are rejected by the observation builder. Source and timestamp remain part of the evidence record where available.

## Known limitation

The browser currently performs the full ZIP route. Non-ZIP uploads remain intentionally limited and must not be presented as equivalent to a processed chat export. Real sanitized exports are still required to validate platform-specific compatibility.

## QA

`tests/BUILD-31-e2e-import-qa.js` checks the normalized message/media-to-observation contract, coordinates and provenance. This is deterministic code QA, not a substitute for real platform exports.
