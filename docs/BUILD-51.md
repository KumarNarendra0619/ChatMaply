# BUILD-51 — Production Integration & End-to-End Workflow

## Purpose

Connect the ChatMaply lifecycle without allowing AI-derived values or user corrections to overwrite raw evidence.

## Pipeline

`Import → Evidence → Review → Observation → Condition → Measurement → Query → Map → Export`

## Design rules

1. `workspace_id` and `dataset_id` are mandatory pipeline context.
2. Raw evidence is marked immutable and retained as the source record.
3. Every derived observation, measurement and export inherits workspace/dataset boundaries.
4. Cross-workspace or cross-dataset evidence is rejected before ingestion.
5. Review and correction are represented as derived state/revision, not silent mutation of raw evidence.
6. AI/provider calls remain adapters outside the deterministic orchestration layer.
7. Pipeline failures are explicit; partial successful stages remain inspectable.

## Stage states

`CREATED → IMPORTED → REVIEWED → OBSERVATIONS_READY → MEASURED → QUERIED → EXPORTED`

Terminal failure state: `FAILED`.

## QA

`tests/BUILD-51-pipeline-qa.js` verifies context requirements, workspace/dataset isolation, immutable raw evidence, stage progression, and summary counts.

## Scope boundary

BUILD-51 is an integration/orchestration layer. It does not claim that external platform parsers, AI models, terrain services, or production storage are fully deployed. Those adapters must be validated independently before production use.
