# ChatMaply — BUILD-08: Multimodal AI + Human Review

## Goal
Prepare a safe interface for image/video analysis and a human-in-the-loop publication workflow.

## Implemented
- Provider-neutral multimodal analysis request contract.
- Structured outputs for category, condition, visible evidence, measurement candidates and review notes.
- Strict AI constraints against pixel-based exact geolocation, face recognition, observer/object substitution, and false certainty.
- Result validation and confidence normalization.
- Human review queue with confirm / reject / edit decisions.
- Only confirmed or edited observations can be marked for map publication.

## Architecture

```text
Image / Video
     ↓
Evidence Record
     ↓
AI Analysis Request
     ↓
Multimodal Model (future provider adapter)
     ↓
Validated Result
     ↓
Human Review
   ↙   ↓   ↘
Reject Edit Confirm
      ↓
  Map Publication
```

## Important boundary
The current repository contains the contract and review workflow, not a claim that a hosted vision model is already connected. API keys must never be placed in browser code or committed to GitHub.

## Measurements
A model may return *measurement candidates*, but these are not treated as metric measurements unless scale, camera geometry, calibration or another defensible reference is available. Elevation and slope remain separate geospatial computations.
