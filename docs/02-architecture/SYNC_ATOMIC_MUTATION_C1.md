# Sync C1 — Transactional mutation and idempotency design

**Status:** implementation design under review  
**Scope:** F1-C Sync concurrency and receipt correctness  
**Out of scope:** Expiration audit (explicitly suspended)

## Confirmed current failure window

The current `runPush` performs a receipt lookup, a business-table write (or `command_radar` RPC), and then a receipt insert as separate PostgREST calls. They are not one database transaction. Two requests carrying the same owner + mutation ID can both observe no receipt and both perform an update before either receipt insert wins. Receipt conflict verification prevents blind acceptance of a conflicting receipt, but does not prevent duplicate business writes. Recovery by comparing current row values is not a general idempotency proof: identical values may already have existed before the mutation, and update triggers/revisions may still have fired.

## Required atomic contract

For each mutation key `(owner_id, mutation_id)`:

1. Validate the authenticated owner and mutation envelope (table, target record, operation, patch).
2. Serialize concurrent attempts for this key inside PostgreSQL.
3. Read the receipt after acquiring serialization.
4. If a verified receipt exists, return it without touching the business row.
5. If absent, authorize and execute exactly one business operation.
6. Store the authoritative response receipt in the **same transaction** as the business write.
7. Commit before the API reports acceptance.

A rollback must roll back both the business write and receipt. A committed operation must always have a receipt. Retries must return the persisted receipt.

## Recommended mechanism

Use a single authenticated Postgres RPC for each mutation, with a transaction boundary covering steps 1–7. Use a transaction-scoped advisory lock keyed by owner + mutation ID (or an equivalent row-lock/claim mechanism with correct crash semantics). The RPC must remain `SECURITY INVOKER` where possible, preserve caller RLS, and never use service-role privileges to bypass authorization.

The RPC must not accept arbitrary SQL identifiers or unrestricted patches. It must use a strict allowlist of logical tables and operations and server-owned mappings of logical table to physical table, owner column, writable columns, and mutation-specific rules. Validate protected columns and target ownership/deletion state inside the transaction, not in an earlier HTTP round trip.

### Special case: Radar lifecycle

Radar status transitions must continue through the existing `command_radar` lifecycle authority. The atomic Sync implementation must either incorporate its transition logic into a shared transaction-safe internal function or call a transaction-compatible helper that executes the command and writes the receipt in the same transaction. Do not replace it with direct status updates.

### Receipt identity

The primary key is owner-scoped `(owner_id, mutation_id)`. Every receipt lookup and return must verify the table and record binding. Receipt response is the authoritative record envelope.

## Test plan (must pass before C1 closure)

- Concurrent same-key create: one business insert, one receipt, both callers return the same authoritative response.
- Concurrent same-key update: one business update/trigger revision, both callers return same response.
- Same mutation ID, different target table/record: reject as protocol conflict; no second business write.
- Different owners, same mutation ID: independent receipts and no cross-owner response disclosure.
- Receipt/business write failure: transaction rolls both back; retry succeeds once.
- Server commits but response is lost: retry reads receipt and performs no business write.
- Delete/tombstone concurrency: one tombstone transition and stable receipt response.
- Radar lifecycle concurrency: transition applied once; receipt and transition commit together.
- RLS / owner isolation: unauthorized mutation is rejected without receipt or data leakage.
- Client Outbox: remove entry only after verified accepted response; ensure response record is merged before cursor advancement.

## Migration / rollout cautions

- Verify the actual installed migration state before applying SQL.
- Preserve existing receipts; do not truncate or reset idempotency history.
- The receipt composite primary key migration must be applied before any RPC assumes owner-scoped uniqueness.
- Inventory table-specific constraints, trigger side effects, owner columns, writable grants, and RPC-only operations before finalizing the allowlist.
- Do not declare transactionality complete based solely on mocked transport tests; include SQL-level concurrency tests (e.g. pgTAP or disposable Postgres integration tests).

## Current interim behavior

The HTTP/TypeScript transport still has a multi-request write/receipt gap. Receipt-conflict verification and update recovery are defensive interim measures, **not** a substitute for the atomic RPC. C1 remains open until the implementation and concurrency tests demonstrate the contract above.
