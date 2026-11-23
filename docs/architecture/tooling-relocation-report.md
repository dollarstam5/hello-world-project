# Documentation normalization — Lot 3

Date: 2026-11-23

## Scope
Normalized the nine active documentation folder names, removing numeric prefixes. Files were relocated with their Git blob contents preserved. No destination collisions were found.

## Directory mapping
- `docs/00-foundation/` → `docs/foundation/`
- `docs/01-product/` → `docs/product/`
- `docs/02-architecture/` → `docs/architecture/`
- `docs/03-api/` → `docs/api/`
- `docs/03-engines/` → `docs/modules/`
- `docs/04-database/` → `docs/database/`
- `docs/05-ai/` → `docs/engineering/ai/`
- `docs/06-operations/` → `docs/operations/`
- `docs/07-annexes/` → `docs/reference/`
- `docs/archive/` remains unchanged.

## Additional changes
- Updated `docs/README.md` active folder paths and references.
- Renamed the malformed UDI model file to `Evolution du modèle de données - Unified Digital Identity UDI.md`.
- Added this report.

## Validation
- 231 files found in the active folders.
- No destination path collisions found before migration.
- Markdown link audit deferred to Lot 4.
- Archive contents were not moved.
