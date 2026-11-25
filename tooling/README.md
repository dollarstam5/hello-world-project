# Tooling

Repository maintenance, audit, CI helper and performance-validation scripts live here, separated from application source under `src/`.

## Commands

- `bun run check:performance-budget`
- `bun run test:e2e`
- `bun run check:global-audit`
- `bun run check:reproducibility`
- `bun run check:go-no-go`

All ten relocated scripts are in `tooling/scripts/`. Package entry points and internal path references were updated during Lot 2.
