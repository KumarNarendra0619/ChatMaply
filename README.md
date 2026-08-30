# ChatMaply

**Group chats → simple, time- and location-aware maps.**

ChatMaply is a lightweight browser-first prototype for turning exported community group conversations and their media into structured geographic observations. The system keeps **observer location** separate from **object/event location**, and preserves time, accuracy and evidence provenance.

## Current build status

- BUILD-01–BUILD-25: architecture and feature modules present in the repository.
- BUILD-26: condition-assessment engine + UI + end-to-end save workflow integrated.
- Prototype status: field-test ready for controlled sample exports; not yet a production service.

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
Condition assessment
          ↓
2D map + optional 3D globe
          ↓
Timeline / evidence review
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

Manual placement does **not** improve the underlying GPS accuracy. The original accuracy/provenance is retained.

## Media evidence

BUILD-25 links media to a specific observation while keeping location provenance explicit:

```text
Media EXIF → Exact/embedded GPS evidence
Observation → Object-location evidence
Observer → Person/device location
Unknown → No reliable location
```

Media inspection is browser-side in the prototype. Real chat exports and private media must not be committed to GitHub.

## Condition assessment — BUILD-26

Human-reviewed condition records support common community field observations:

- Waste site
- Road
- Water body
- Drain
- Building
- Vegetation
- Other

Condition levels:

`Clean → Moderate → Poor → Critical → Unknown`

Additional fields include quantity/size, obstruction, contamination, notes, reviewer and assessment time. The prototype does not claim that a visual label is automatically correct merely because an AI model proposes it.

## Supported input targets

The architecture targets exports from:

- WhatsApp
- Telegram
- Signal
- Messenger

Parser support varies by export format and must be validated against real sample exports before being described as production-ready.

## Run locally

No build system is required for the current static prototype. Serve the repository with a static web server and open `index.html`. A local server is preferable to opening the file directly because browser module and security policies vary by browser.

## Privacy and safety

Exported chats can contain names, phone numbers, locations, images, videos and other sensitive information. Production deployment should:

1. Process locally where practical.
2. Minimize retention.
3. Keep observer and object locations as separate data classes.
4. Require explicit consent before collecting observer location.
5. Avoid publishing precise personal locations by default.
6. Never commit real chat exports, credentials, tokens or private media to the repository.

## Scope boundary

ChatMaply is an evidence-mapping tool, not a surveillance system. Facial recognition, identity inference, automatic person tracking and covert location collection are outside the current scope.

Automatic object recognition, image geolocation, terrain measurement and condition classification should be treated as **candidate evidence** until validated and/or human-reviewed.

## License

Apache-2.0
