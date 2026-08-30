# ChatMaply — BUILD-27: Real Export Validation & Parser QA

## Purpose
Harden the import boundary before claiming real-world compatibility. ChatMaply must report what an export actually contains instead of silently treating an unreadable or unsupported export as successfully processed.

## Implemented
- ZIP import now returns parser identity and parser status.
- Import QA reports archive readability, message count, media count and unsupported-file count.
- Observation builder validates latitude/longitude ranges.
- Negative/invalid accuracy values are rejected.
- Canonical `latitude/longitude` and UI-compatible `lat/lng` are emitted together.
- Location provenance is preserved as `location_type` and `source`.
- `auditObservations()` provides a lightweight structural QA report.

## Verified parser targets in code

### WhatsApp
Recognizes a baseline `_chat.txt` / `chat.txt` entry and applies the existing WhatsApp parser.

### Telegram
Recognizes a JSON export matching `result`, `chat`, or `export` naming and applies the Telegram JSON parser.

### Signal / Messenger
Not claimed as parsed. Their export formats must be supplied as sanitized real samples and implemented only after format validation.

## Critical limitation discovered
The current browser UI still routes non-ZIP uploads through an empty placeholder result. Therefore TXT/JSON direct upload is **not** considered supported by BUILD-27. ZIP is the only processed import path at this stage.

## Data integrity rule
A parser may produce zero observations. Zero observations is a valid result; it must never be replaced with fabricated coordinates or observer coordinates.

## QA acceptance criteria
- Valid ZIP opens without throwing.
- Parser status is explicit.
- Message/media counts are explicit.
- Invalid coordinates do not become map observations.
- Missing accuracy remains `null`.
- Observer location is never copied into object location.
- Unsupported platform is not labelled as supported.

## Status
**BUILD-27 code hardening complete. Real-platform compatibility remains validation-dependent.**
