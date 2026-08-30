# ChatMaply — BUILD-15: Platform Export Adapters + QA

## Goal
Create one normalized import contract for WhatsApp, Telegram, Signal and Messenger while being explicit about which formats are actually implemented and tested.

## Current adapter status

| Platform | Status | Rule |
|---|---|---|
| WhatsApp | Implemented baseline | Real exports must be regression-tested |
| Telegram | Implemented baseline | JSON export required |
| Signal | Adapter required | Do not claim support until a real export is tested |
| Messenger | Adapter required | Do not claim support until a real export is tested |

## Normalized message contract

```text
id
sender
date
time
text
media
latitude
longitude
accuracy_m
timestamp
```

Optional fields remain null/absent rather than being guessed.

## QA rule
Every imported export gets a validation report. Invalid or unsupported messages do not become map observations.

## Real-world testing plan

1. Create a small test group with consenting participants.
2. Export a WhatsApp chat containing text, one shared location, images and video.
3. Export a Telegram JSON chat with equivalent evidence.
4. Obtain a representative Signal export and Messenger export from supported official user workflows.
5. Run each through ChatMaply and compare message count, timestamps, media linkage and explicit coordinates against the original export.
6. Record failures as fixtures/regression tests before enabling production support.

## Privacy
Use synthetic or consented test data. Do not commit personal chat exports, private media, phone numbers, access tokens or credentials to GitHub.

## Hard mapping rule
Only explicit evidence coordinates become object/event map observations. An observer's location is never copied into a message or media observation.
