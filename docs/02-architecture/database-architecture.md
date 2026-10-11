# Database architecture

This document describes the persistence model visible in the repository and explicitly separates the baseline migration chain from later candidate artifacts. It does not certify the state of the hosted database.

## Architecture at a glance

- **Identity source:** Supabase Auth owns user identity in `auth.users`.
- **Application profile:** `public.profiles` references the Auth user ID and stores member-facing profile fields.
- **Authorization:** `public.user_roles` stores `member`, `moderator`, `admin`, and `owner` roles separately from the profile. The baseline defines `public.has_role(uuid, app_role)` as a `SECURITY DEFINER` helper with `search_path = public`.
- **Progressive identity:** `public.udi` has one row per user in the baseline and stores a level plus structured attributes.
- **Domain persistence:** `media`, `flashes`, `missions`, `posts`, `notifications`, and `audit`.
- **Local-first synchronization:** TypeScript contracts and the sync mapper translate logical table names and camelCase fields into the physical snake_case PostgreSQL schema.

The concrete baseline schema is summarized in the [data dictionary](../04-database/data-dictionary.md). The initial grant and RLS inventory is in [schema design](../04-database/schema-design.md).

## Repository-backed migration chain

The standard Supabase migration directory is `supabase/migrations/`. It currently contains:
1. The initial nine-table schema, baseline grants/RLS policies, Auth user trigger, revision sequence/function, and sync revision triggers.
2. Revocations/grants for selected helper and trigger functions.
3. Storage-object policies for the `avatars` and `media` buckets.

The project configuration at `supabase/config.toml` only declares the project ID; it does not configure `src/supabase/migrations/` as an alternate migration directory.

A separate `src/supabase/migrations/` directory contains six later SQL-like artifacts for profile/UDI hardening, mission transitions, sync receipts, assistant quota/cache, a public Flash projection, and Radar. They are not in the standard migration path. In addition, the mission-transition file is a Markdown document containing a fenced SQL block rather than a raw migration script. Their intended application path and deployment status are unresolved.

**Consequence:** the source tree alone cannot establish that the later tables/functions/policies are present in the live database. The correct next step is to establish a single ordered migration source and verify it against a disposable/test database and, separately, the hosted schema before describing the effective production model.

## Synchronization contract

The shared contracts in `packages/core-contracts/src/records.ts` define a client record envelope with UUID identity, epoch-millisecond timestamps, nullable revision, and soft deletion. The mapper in `src/lib/sync/mapping.ts` maps:
- logical `users` to physical `profiles`,
- logical `udi`, `flashes`, `missions`, `radars`, `posts`, `media`, `notifications`, and `audit` to similarly named tables,
- camelCase fields to snake_case columns,
- owner columns per domain (`id`, `user_id`, `author_id`, `owner_id`, or `recipient_id`).

The database baseline assigns `revision` server-side via `sync_revision_seq`; the client should not set `revision` or `server_updated_at`. Soft deletion is represented by nullable `deleted_at` in the baseline schema. The TypeScript contracts and baseline SQL are not yet fully reconciled: for example, mapper constants refer to profile and Flash columns not present in the initial migration, and the mapper includes Radar although `radars` is only defined in a later artifact outside the standard migration path.

## Security layers

Database authorization is layered:
1. Table/column grants decide whether a database role may perform an operation.
2. RLS policies scope rows by caller identity and, for privileged actions, role checks.
3. Triggers enforce server-owned revision fields and selected protected state transitions.
4. Trusted server functions may use the service-role client, which bypasses RLS; such access must follow caller authentication and authorization in server code.

The baseline migration enables RLS for all nine application tables. The separate storage migration applies path-based policies to Storage objects. The later candidate artifacts introduce more restrictive profile/UDI grants and domain state machines, but they must not be treated as effective until the migration chain is verified.

## Validation and limitations

`supabase/tests/database/rls_core.test.sql` declares 40 pgTAP assertions covering the nine baseline tables, policy names, RLS activation, and selected cross-user access boundaries. This is a source-level test suite; it does not establish that the tests were run successfully in this review or that the hosted database has the same schema.

See [Schema design, grants, and row-level security](../04-database/schema-design.md) for explicit coverage limits and reconciliation tasks.
