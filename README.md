# ChatMaply

**Group chats → simple, time- and location-aware maps.**

ChatMaply is a lightweight prototype for turning exported community group conversations and their media into structured geographic observations. The project keeps **observer location** separate from **object/event location**, and preserves time and location accuracy.

## BUILD-01

Current prototype includes:

- Simple village-friendly web interface
- Exported chat upload foundation
- Demo interactive OpenStreetMap map
- Observer and object/event markers
- Time slider UI
- Accuracy, elevation and slope fields in the observation model
- Privacy-first local-processing direction

### Supported input targets

- WhatsApp exported chat
- Telegram exported chat
- Signal exported chat
- Messenger exported chat

Parser support is being implemented progressively; BUILD-01 is the foundation, not a claim of complete parsing for every export variant.

## Run locally

No build system is required for the current static prototype. Open `index.html` in a modern browser, or serve the repository with any static web server.

## Core concept

```text
Export group chat + media
        ↓
ChatMaply parser
        ↓
Messages + media + sender + time
        ↓
Observer location
        ↓
Object / event location
        ↓
Accuracy + time
        ↓
Interactive map
```

### Observer location

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

## Important design rule

`Observer Location ≠ Object Location`

If an object's location cannot be supported by GPS, explicit place information, manual placement or a defensible estimation method, the object location remains **unknown** rather than being assigned the observer's coordinates.

## Planned builds

1. **BUILD-01** — Foundation + upload + map
2. **BUILD-02** — Chat/media parsers + metadata
3. **BUILD-03** — Observer/object location workflow
4. **BUILD-04** — Accuracy + time model
5. **BUILD-05** — Elevation + slope + terrain context
6. **BUILD-06** — Waste/object condition AI
7. **BUILD-07** — Timeline + change monitoring
8. **BUILD-08** — Deployment + documentation

## Primary demonstration

The first field demonstration is **village waste and environmental observation**. The same observation engine can later support road damage, water pollution, landslide, flood and other community-reported events.

## Privacy

Exported chats can contain sensitive personal information. The production version should process locally where practical, minimize retention, avoid exposing observer locations by default, and require explicit consent before associating a user's location with a group.

## License

Apache-2.0
