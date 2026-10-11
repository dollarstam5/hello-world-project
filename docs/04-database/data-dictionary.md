# Data dictionary

This page describes the **repository-backed PostgreSQL schema**, not an assumed production database snapshot. The executable baseline is the SQL in `supabase/migrations/`; later files under `src/supabase/migrations/` are inventoried separately because that is not the standard Supabase CLI migration directory configured by this repository.

## Domain table inventory

The initial schema migration creates these nine `public` tables.

| Table | Domain / purpose | Primary identity and ownership | Important columns |
|---|---|---|---|
| `user_roles` | Authorization roles | `id`; `user_id → auth.users.id` | `role app_role`, `created_at`; unique `(user_id, role)` |
| `profiles` | Member-facing profile | `id → auth.users.id` | `display_name`, unique `handle`, `avatar_media_id`, `status`, `locale`, `trust_score` |
| `udi` | Progressive digital identity | `id`; unique `user_id → auth.users.id` | `level`, `verified_at`, `attributes jsonb` |
| `media` | Metadata for media objects | `id`; `owner_id → auth.users.id` | `kind`, `state`, `remote_path`, `mime_type`, `byte_size`, dimensions |
| `flashes` | Short-lived publications | `id`; `author_id → auth.users.id` | `title`, `body`, `status`, `expires_at`, `media_ids uuid[]` |
| `missions` | Work / collaboration tasks | `id`; `author_id`, optional `assignee_id → auth.users.id` | `title`, `brief`, `status`, `reward_amount numeric(14,2)`, `reward_currency`, `due_at` |
| `posts` | Social posts | `id`; `author_id → auth.users.id` | `body`, `visibility`, `media_ids uuid[]`, reaction and reply counts |
| `notifications` | Per-recipient notifications | `id`; `recipient_id → auth.users.id` | `channel`, translation keys, `params jsonb`, `read_at` |
| `audit` | Sensitive-action audit entries | `id`; nullable `actor_id → auth.users.id` | `action`, `target_table`, `target_id`, `summary` |

The migration also defines the `app_role` enum (`member`, `moderator`, `admin`, `owner`), the global `sync_revision_seq` sequence, and the `assign_sync_revision()` trigger function.

## Common persistence envelope

The baseline tables use a mixture of domain columns and synchronization metadata:

- `id`: UUID primary key for most records; `profiles.id` is the Auth user ID.
- Ownership is domain-specific: `author_id`, `owner_id`, `recipient_id`, `user_id`, or `actor_id`. These columns are not interchangeable.
- `created_at` and `updated_at` are generally epoch milliseconds stored as `BIGINT`.
- `deleted_at` is a nullable epoch-millisecond soft-delete marker on sync-oriented tables.
- `revision` is a server-assigned sequence value; `server_updated_at` is a server timestamp.
- `assign_sync_revision()` assigns a new revision and server update timestamp on insert/update for the baseline sync tables.

Exceptions matter: `user_roles.created_at` is `TIMESTAMPTZ`, and `ai_requests` / `ai_cache` in the later candidate SQL use native `TIMESTAMPTZ` timestamps and do not share the full baseline envelope.

## Relationship and deletion behavior

- User-owned rows reference `auth.users`; most use `ON DELETE CASCADE`.
- `missions.assignee_id` uses `ON DELETE SET NULL`.
- `audit.actor_id` uses `ON DELETE SET NULL`.
- `ai_cache_hits.cache_id` in the later candidate SQL cascades when its cache row is deleted.
- `profiles.avatar_media_id` is a UUID column but the baseline migration does not declare a foreign key to `media`.

## Later schema proposals / candidate migrations

The repository contains additional SQL-like artifacts under `src/supabase/migrations/` for:
- `sync_mutation_receipts` (offline mutation idempotency),
- `ai_requests`, `ai_cache`, `ai_cache_hits` (assistant quotas and reviewed cache),
- `radars` (Radar lifecycle),
- mission transition constraints and field protections,
- profile / UDI hardening and a public Flash projection function.

These are **not included in the standard `supabase/migrations/` directory**. One file, `20260912001000_secure_mission_transitions.sql`, contains Markdown headings and fenced SQL instead of a raw SQL migration. Treat these definitions as candidate/historical artifacts until their intended deployment path, format, and applied database state are verified. Do not infer that the tables or policies exist in production from their presence in the repository alone.

## Contract differences to keep visible

The TypeScript contracts in `packages/core-contracts/src/records.ts` use camelCase and define fields such as `BaseRecord.updatedAt`, `revision`, and `deletedAt`. The database uses snake_case. The sync mapper in `src/lib/sync/mapping.ts` maps logical tables to physical tables, including `users → profiles` and `radars → radars`.

Some contract fields do not appear in the baseline table definitions (for example, the mapper's `audience_type`, `environment_mode`, `guidance_mode`, Flash `kind` / `category` / `time_slot` / `area_label` / `response_limit`). Reconcile these against the actual intended migration chain before calling the schema and contracts fully aligned.

## Source of truth

1. Executable migration files under `supabase/migrations/` for repository-declared schema history.
2. Database tests under `supabase/tests/database/` for the behavior they explicitly assert.
3. TypeScript contracts and mapper for client/sync shapes.
4. Older documents under `docs/` as historical design context only.

See [Database architecture](../02-architecture/database-architecture.md) and [Schema and access matrix](./schema-design.md).
