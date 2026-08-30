# BUILD-29 — Signal Export Adapter

## Scope

BUILD-29 adds a conservative Signal adapter and deterministic QA tests.

## Important limitation

Signal does not provide one universal portable chat-export format across all clients and versions. ChatMaply therefore does **not** claim universal Signal import. The adapter accepts only recognizable JSON/TXT structures supplied by the user.

## Safety rules

- No location is inferred from sender identity.
- No observer location is converted into object location.
- Missing coordinates remain missing.
- Invalid JSON returns a controlled error.
- Invalid/unknown export structures are not silently treated as Signal data.
- Real private exports must not be committed to the repository.

## QA

`tests/BUILD-29-signal-qa.js` covers format detection, message extraction, timestamp handling, absence of invented coordinates and invalid JSON handling.

## Status

Signal adapter: **experimental / controlled testing**.
Production compatibility requires sanitized real exports from the target Signal client/version.
