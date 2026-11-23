# Tooling relocation — Lot 2

Date: 2026-11-23

## Scope

Moved all 10 maintenance scripts from `scripts/` and `src/scripts/` into `tooling/scripts/`. Updated package commands, test imports, and script-internal path references.

## Files relocated

- `scripts/check-global-audit.ts` → `tooling/scripts/check-global-audit.ts`
- `scripts/check-go-no-go.ts` → `tooling/scripts/check-go-no-go.ts`
- `scripts/check-mobile-scroll.mjs` → `tooling/scripts/check-mobile-scroll.mjs`
- `scripts/check-performance-budgets.ts` → `tooling/scripts/check-performance-budgets.ts`
- `scripts/check-reproducibility.ts` → `tooling/scripts/check-reproducibility.ts`
- `scripts/performance-budget-measurement.ts` → `tooling/scripts/performance-budget-measurement.ts`
- `scripts/test-mobile-e2e.sh` → `tooling/scripts/test-mobile-e2e.sh`
- `src/scripts/check-foundation.mjs` → `tooling/scripts/check-foundation.mjs`
- `src/scripts/check-secrets.mjs` → `tooling/scripts/check-secrets.mjs`
- `src/scripts/check-supabase-tests.mjs` → `tooling/scripts/check-supabase-tests.mjs`

## Reference updates

- `package.json` command entries use the new tooling paths.
- The mobile E2E script and contract test reference the relocated mobile scroll helper.
- The performance budget checker and tests import the relocated measurement module.
- Audit and go/no-go checks require the relocated paths.
- Foundation checker now points to the relocated Supabase test checker.

## Validation status

Path references were reviewed and updated. Lint, tests, typecheck and build were not run in this environment. Some foundation checker documentation paths and references to scripts outside this lot remain legacy and are deferred to later cleanup.
