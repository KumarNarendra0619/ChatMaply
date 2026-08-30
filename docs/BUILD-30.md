# BUILD-30 — Messenger Export Adapter + QA

## Scope
Adds a conservative Meta Messenger/Facebook export adapter for recognizable JSON structures.

## Processing

```text
Messenger export
      ↓
Format detection
      ↓
JSON parser
      ↓
Normalized ChatMaply message
      ↓
Evidence pipeline
```

## Safety rules

- No coordinates are invented from sender or observer location.
- Missing coordinates remain missing.
- Timestamps are normalized when valid.
- Invalid JSON returns `INVALID_JSON`.
- Unknown formats are not silently parsed.
- Real private exports must not be committed to the repository.

## Support status

The adapter is prototype-level, not universal Messenger compatibility. Real sanitized Messenger exports still need validation against the actual export format supplied by users. Until then, ChatMaply should not claim production support for every Messenger/Facebook export variant.

## QA

`tests/BUILD-30-messenger-qa.js` checks format detection, message/sender/text preservation, media preservation, no invented location, and malformed JSON handling.
