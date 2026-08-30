# BUILD-38 — Slope & Accessibility Engine

BUILD-38 adds deterministic terrain screening for mapped objects/events.

## Flow

```text
Object/Event coordinate
        ↓
Terrain elevations / route context
        ↓
Slope calculation
        ↓
Slope class
        ↓
Accessibility screening
```

## Slope classes

- FLAT: <5°
- GENTLE: 5–<15°
- MODERATE: 15–<30°
- STEEP: 30–<45°
- VERY_STEEP: ≥45°
- UNKNOWN: insufficient data

## Accessibility

Accessibility is a screening result, not a medical, emergency-response or engineering guarantee. It considers slope and optional road distance/surface information. Missing terrain inputs remain unknown/tentative.

## Safety

Slope is not inferred from GPS accuracy. No terrain value is fabricated. The engine does not claim that a person, ambulance or vehicle can physically traverse a route solely from slope.

## QA

`tests/BUILD-38-slope-qa.js` validates slope calculation, classification, missing-data handling, accessibility screening and observation attachment.
