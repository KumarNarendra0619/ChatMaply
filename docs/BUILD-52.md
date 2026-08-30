# BUILD-52 — Real Storage & Persistence Layer

BUILD-52 introduces a persistence abstraction between ChatMaply domain logic and storage technology.

## Goals

- Persist workspace, dataset, evidence and revision records through a common adapter contract.
- Keep domain code independent from browser storage or a specific database.
- Enforce workspace/dataset scope on evidence writes and reads.
- Return defensive copies so callers cannot silently mutate stored records.
- Make the storage layer replaceable for IndexedDB, SQLite, PostgreSQL/PostGIS or another production adapter.

## Architecture

```text
UI / Import / Review / Query / Export
                 ↓
          PersistentStore
                 ↓
        Storage Adapter Contract
          ↙       ↓        ↘
      Memory   IndexedDB   Server DB
```

## Current adapter

`MemoryPersistenceAdapter` is included for deterministic prototype and test execution. It is **not** a production persistence solution.

## Scope rules

Evidence requires both `workspace_id` and `dataset_id`.
Evidence listing requires `workspace_id` and can optionally constrain `dataset_id`.

## Production migration path

The next storage adapter can implement the same `put/get/list/delete` contract and move data to IndexedDB for browser-only deployment or PostgreSQL/PostGIS for multi-user deployment. Raw evidence/media should remain outside Git and should use controlled object storage in a production service.

## QA

`tests/BUILD-52-persistence-qa.js` verifies scope requirements, isolation, defensive copies and snapshot integrity.

## Explicit non-goal

BUILD-52 does not claim that the current in-memory adapter provides durable persistence across browser sessions or servers. Durable production storage is the next integration step.
