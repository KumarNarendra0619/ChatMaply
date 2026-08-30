# BUILD-53 — Durable Browser Storage

BUILD-53 adds an IndexedDB persistence adapter for ChatMaply. It provides durable browser-side storage while keeping the application domain layer independent from the storage technology.

## Stores

- `workspaces`
- `datasets`
- `evidence`
- `revisions`

## Architecture

```text
ChatMaply domain services
        ↓
PersistentStore contract
        ↓
IndexedDBPersistenceAdapter
        ↓
Browser IndexedDB
```

## Guarantees

- Data survives page reloads/browser restarts subject to browser storage policies.
- Records are stored under explicit IDs.
- Returned records are defensive copies.
- Workspace/dataset scope remains a domain-layer responsibility; this adapter does not replace authorization.

## Important limitation

IndexedDB is local browser storage, not a multi-user authoritative database. It does not provide server-side authorization, cross-device synchronization, conflict resolution, or centralized backup. Those belong to the future server persistence layer.

## Media

Large original media should not be placed into Git. A production implementation should use controlled object storage and keep metadata/references in the persistence layer.

## QA

`tests/BUILD-53-indexeddb-qa.js` defines the browser QA contract for put/get/list/delete, defensive-copy behavior, and cleanup.
