# ChatMaply

**Group chats → simple, time- and location-aware maps.**

ChatMaply is a browser-first evidence-mapping prototype for turning exported community group conversations and their media into structured geographic observations. The system keeps **observer location** separate from **object/event location**, and preserves time, accuracy and evidence provenance.

## Current status — 2026-08-31

- Core map, import, evidence, observation, review, condition, timeline and 2D/3D modules are present.
- BUILD-27–32, BUILD-37–38 and BUILD-46, BUILD-51–53 have repository code and QA contracts.
- Direct TXT/JSON/HTML import, durable active-dataset persistence, workspace/dataset session state, media EXIF normalization and browser E2E QA have been integrated.
- GitHub Pages deployment workflow has completed successfully.
- Browser E2E CI is being hardened against actual runtime failures.
- Real production exports have **not** been claimed as validated; current platform fixtures are synthetic.
- Status: **functional prototype / controlled field-test candidate**, not a production service.

See [`docs/MASTER-STAGE-AUDIT.md`](docs/MASTER-STAGE-AUDIT.md) for the authoritative stage reconciliation.

## Core workflow

```text
Export group chat + media
        ↓
Local parser
        ↓
Messages + media + sender + time
        ↓
Location evidence
   ┌────┴──────────┐
Observer       Object/Event
location       location
   │                │
   └──────┬─────────┘
          ↓
Accuracy + time + provenance
          ↓
Human review / condition assessment
          ↓
2D map + optional 3D globe
          ↓
Timeline / evidence review
          ↓
Workspace / Dataset persistence
```

## Observer location

```text
User joins Group
      ↓
Share Location permission
      ↓
OS Location Permission
      ↓
GPS / Wi-Fi / Cell positioning
      ↓
lat + lng + accuracy + timestamp
      ↓
Observer Location
      ↓
Map marker
```

Observer coordinates are not silently copied to an object/event.

## Object location rule

`Observer Location ≠ Object Location`

An object/event location can be derived from explicit location evidence, media metadata, a defensible estimation method, or manual map placement followed by human confirmation. If none is available, the location remains **unknown**.

Manual placement does **not** improve the underlying GPS accuracy. Original accuracy and provenance are retained.

## Media evidence

```text
Media EXIF → Exact/embedded GPS evidence
Observation → Object-location evidence
Observer → Person/device location
Unknown → No reliable location
```

Media inspection is browser-side. Real chat exports and private media must not be committed to GitHub.

## Condition assessment

Human-reviewed condition records support:

`Waste site | Road | Water body | Drain | Building | Vegetation | Other`

Condition levels:

`Clean | Moderate | Poor | Critical | Unknown`

## Supported input targets

The architecture targets:

- WhatsApp
- Telegram
- Signal
- Messenger

Parser support varies by export format. Real sanitized exports must pass QA before production support is claimed.

## QA

Synthetic platform fixtures and browser E2E tests are included under `tests/`. The browser CI checks the actual UI, map runtime, synthetic import flow, timeline filtering and IndexedDB availability.

## Privacy and safety

Exported chats can contain names, phone numbers, locations, images, videos and other sensitive information. ChatMaply should:

1. Process locally where practical.
2. Minimize retention.
3. Keep observer and object locations as separate data classes.
4. Require explicit consent before collecting observer location.
5. Avoid publishing precise personal locations by default.
6. Never commit real chat exports, credentials, tokens or private media to the repository.

## Scope boundary

ChatMaply is an evidence-mapping tool, not a surveillance system. Facial recognition, identity inference, automatic person tracking and covert location collection are outside the current scope.

Automatic object recognition, image geolocation, terrain measurement and condition classification are candidate evidence until validated and/or human-reviewed.

## License

Apache-2.0
