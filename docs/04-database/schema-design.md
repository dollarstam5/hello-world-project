# Schema design, grants, and row-level security

This page records the SQL-backed baseline and the boundaries of what has actually been verified. It is not a claim about the live hosted database.

## Migration authority

- Supabase project configuration is at `supabase/config.toml`.
- The repository's standard migration directory is `supabase/migrations/`, which currently contains three SQL files.
- `src/supabase/migrations/` contains six additional artifacts, but is not the standard CLI migration path. One of those files is Markdown-wrapped SQL. Their deployment status is unknown from repository contents alone.
- The database test suite is `supabase/tests/database/rls_core.test.sql`; it uses pgTAP-style assertions and declares a plan of 40 checks.

**Release gate:** do not claim an additional table, grant, function, or RLS policy is deployed until the migration path is corrected/confirmed and the intended migration has been applied and tested against a database.

## Baseline access matrix

The matrix below describes policies and grants in the initial SQL migration under `supabase/migrations/`. It is a source-code inventory, not a complete security audit.

| Table | Authenticated SQL grants in baseline | RLS policies in baseline | Intended boundary expressed by policy |
|---|---|---|---|
| `user_roles` | `SELECT` | `own roles are readable`; `owners manage roles` | Read own role rows; an owner-management policy is present, but authenticated has no DML grant in this baseline |
| `profiles` | `SELECT, INSERT, UPDATE` | `profiles readable by members`; `own profile insert`; `own profile update` | Signed-in members can read non-deleted profiles; insert/update own profile |
| `udi` | `SELECT, INSERT, UPDATE` | `own identity readable`; `own identity insert`; `own identity update` | Own-row access plus admin read access in the initial policy; owner writes |
| `media` | `SELECT, INSERT, UPDATE, DELETE` | `media readable by members`; `own media write` | Signed-in members can read non-deleted metadata; writes require ownership |
| `flashes` | `SELECT, INSERT, UPDATE, DELETE` | `flashes readable by members`; `own flashes write`; `moderators moderate flashes` | Draft visibility is limited by author; author writes; moderator/admin update path |
| `missions` | `SELECT, INSERT, UPDATE, DELETE` | `missions readable by members`; `own missions write`; `assignee advances mission` | Authenticated reads of non-deleted rows; author and assignee write paths |
| `posts` | `SELECT, INSERT, UPDATE, DELETE` | `posts readable by members`; `own posts write` | Private posts are limited to their author; author writes |
| `notifications` | `SELECT, UPDATE` | `own notifications readable`; `own notifications update` | Recipient reads and updates own notifications |
| `audit` | `SELECT` | `audit readable by admins` | Admin/owner role required to read audit rows |

The `user_roles` policy named `owners manage roles` does not itself grant write privileges: authenticated has only `SELECT` on this table in the baseline, so that policy alone does not enable owner DML. The baseline grants `ALL` to `service_role` on these tables. That role bypasses RLS; use it only in trusted server code after authorization, never as a substitute for checking the caller.

The initial storage migration defines separate policies on `storage.objects`: avatar objects are readable by authenticated members and writable/deletable only under the caller's folder; media objects are restricted to the caller's folder for select/insert/update/delete. Bucket existence/configuration and deployed Storage policy state are not proven by the policy file alone.

## Grants and RLS are separate controls

For each table, review both layers:

1. SQL privileges determine whether the role may attempt an operation.
2. RLS determines which rows are visible or writable for that role.
3. Column grants and triggers can further restrict fields or transitions.
4. `SECURITY DEFINER` functions require explicit execute grants, a safe `search_path`, and a review of caller identity checks.

A policy does not grant SQL privileges by itself. Conversely, a table grant does not bypass RLS for ordinary authenticated callers.

## Test coverage currently visible

`rls_core.test.sql` asserts the existence of the nine baseline tables, RLS enabled on those tables, expected policy names, and a set of user A/user B access boundaries. It is valuable baseline coverage, but it does not by itself prove:
- every column grant is minimal,
- every possible write or role escalation is blocked,
- candidate tables in `src/supabase/migrations/` exist,
- the live Supabase database matches repository migrations,
- Storage policies or all privileged functions are correctly deployed.

Run `bun run test:db` in an environment with the Supabase CLI and the project's database test prerequisites. The repository's `check:db-tests` script only checks that a SQL test file exists; it does not execute the assertions.

## Known reconciliation items

1. **Migration location and format:** confirm whether `src/supabase/migrations/` is intended to be a second source, relocate/convert artifacts only with explicit approval, and ensure the actual migration runner applies them in deterministic order.
2. **Schema vs TypeScript contracts:** reconcile columns exposed by `PROFILE_FIELD_COLUMNS` and `FLASH_FIELD_COLUMNS` in `src/lib/sync/mapping.ts` with the baseline migration.
3. **RLS evolution:** the initial policies for UDI, profiles, and missions differ from the later hardening artifacts. Document the effective policy only after the intended migration chain is established.
4. **Roles and helper functions:** verify grants on `has_role`, `handle_new_user`, and all later `SECURITY DEFINER` functions in the actual deployed schema.
5. **RLS tests:** expand tests alongside any confirmed migration-chain repair so that all sync tables, owner boundaries, protected fields, and privileged command paths are covered.

No SQL, application behavior, migration files, or legacy documents are changed by this documentation lot.
