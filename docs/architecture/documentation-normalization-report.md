# Documentation normalization — Lot 3

Date: 2026-11-23

## Scope
Normalized the nine active documentation folder names, removing numeric prefixes. 231 files were relocated into canonical folders; no destination collisions were found.

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
- Updated `docs/README.md` active folder paths and canonical links.
- Renamed the UDI model document to `Evolution du modèle de données - Unified Digital Identity UDI.md` for a Markdown-safe link.

## Validation
- 231 files moved from the nine numbered folders.
- No destination path collisions were found.
- All 46 relative links in `docs/README.md` were checked: zero missing targets.
- The full repository-wide Markdown link audit remains Lot 4.
- Archive contents were not moved or modified.
