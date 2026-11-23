# Folder relocation manifest — PWA modular architecture (2026)

Repository: `dollarstam5/hello-world-project`
Branch: `chore/architecture-folder-cleanup-2026-11`
Status: target paths locked where tooling compatibility is confirmed; guarded items listed below.
Scope: folders only in this phase. No file-level refactoring, import edits, API changes, or merges into main.

## Target architecture
`src/{app,modules,platform,shared,composition,config,data,assets}`
Dependency direction: shared is foundational; platform depends on shared; modules depend on shared/platform; composition assembles modules and platform; app bootstraps and composes upper layers. Lower layers may not import upper layers.

## Root folder moves
| Current | Target | Operation / guard |
|---|---|---|
| `.github/` | `.github/` | Keep CI/workflows at root |
| `.lovable/` | `.lovable/` | Keep until Lovable metadata location is verified |
| `docs/00-foundation/` | `docs/foundation/` | Rename |
| `docs/01-product/` | `docs/product/` | Rename |
| `docs/02-architecture/` | `docs/architecture/` | Rename |
| `docs/03-api/` | `docs/api/` | Rename |
| `docs/03-engines/` | `docs/modules/` | Rename |
| `docs/04-database/` | `docs/database/` | Rename |
| `docs/05-ai/` | `docs/engineering/ai/` | Move |
| `docs/06-operations/` | `docs/operations/` | Rename |
| `docs/07-annexes/` | `docs/reference/` | Rename |
| `docs/archive/` | `docs/archive/` | Keep |
| `drizzle/` | `drizzle/` | Keep until drizzle config/package scripts updated |
| `packages/core-contracts/` | `packages/core-contracts/` | Keep until workspace/alias and imports are migrated |
| `packages/core-db/` | `packages/core-db/` | Same guard |
| `packages/core-logic/` | `packages/core-logic/` | Same guard |
| `packages/core-sync/` | `packages/core-sync/` | Same guard |
| `public/` | `public/` | Keep static public URL assets, manifest, service worker |
| `screenshots/` | `design/references/screenshots/` | Move; reference-only assets |
| `scripts/` | `tooling/scripts/` | Move only after package.json scripts and workflow paths updated atomically |
| `supabase/` | `supabase/` | Keep CLI/CI path until all invocations/config verified |
| `tests/` | `tests/` | Keep transversal root; ownership-based test moves deferred to file phase |

## src folder moves
| Current | Target | Guard |
|---|---|---|
| `src/app/app-shell/` | `src/app/shell/` | rename; update imports |
| `src/app/router/` | `src/app/routing/` | rename; generated route-tree compatibility verified |
| `src/domains/*` | `src/modules/*` | rename namespace; merge domain presence into reel |
| `src/features/discovery/` | `src/modules/discovery/` | merge if distinct from existing module |
| `src/features/presence/` | `src/modules/reel/` | merge with domains/presence |
| `src/features/search/` | `src/modules/search/` | relocate |
| `src/features/settings/` | `src/modules/settings/` | relocate |
| `src/components/app/` | `src/app/ui/` | relocate |
| `src/components/experience/` | `src/composition/experiences/` | relocate |
| `src/components/ui/` | `src/shared/ui/components/` | consolidate UI |
| `src/widgets/activity-strip/` | `src/composition/widgets/activity-strip/` | relocate |
| `src/widgets/ai-layer/` | `src/composition/widgets/ai-layer/` | relocate after ownership check |
| `src/widgets/offline-banner/` | `src/platform/offline/ui/` | relocate |
| `src/widgets/section-foundation/` | `src/composition/widgets/section-foundation/` | relocate |
| `src/widgets/smart-feed/` | `src/modules/feed/ui/` | module-owned |
| `src/widgets/smart-state/` | `src/composition/widgets/smart-state/` | relocate |
| `src/layouts/{desktop,mobile,tablet,ecosystem}/` | `src/composition/layouts/{desktop,mobile,tablet,ecosystem}/` | relocate |
| `src/layouts/modal/` | `src/shared/ui/overlays/` | after ownership review |
| `src/platform/internationalization/` | `src/platform/i18n/` | rename |
| `src/platform/trust/` | `src/platform/security/trust/` | relocate |
| `src/shared/animations/` | `src/shared/ui/animations/` | relocate |
| `src/shared/icons/` | `src/shared/ui/icons/` | relocate |
| `src/shared/tokens/` | `src/shared/design/tokens/` | relocate |
| `src/shared/utils/` | `src/shared/lib/utils/` | relocate |
| `src/shared/validators/` | `src/shared/lib/validators/` | relocate |
| `src/shared/components/` | `src/shared/ui/components/` or module owner | ownership review |
| `src/shared/mocks/` | module-owned `testing/mocks/` | distribute |
| `src/lib/ai/` | `src/platform/ai/` or assistant module | ownership review |
| `src/lib/api/` | `src/platform/backend/` | relocate |
| `src/lib/app/` | `src/app/` | distribute |
| `src/lib/communication/` | `src/platform/communication/` or communication module | ownership review |
| `src/lib/design/` | `src/shared/design/` | relocate |
| `src/lib/experience/` | `src/composition/experiences/` | relocate |
| `src/lib/i18n/` | `src/platform/i18n/` | merge with platform i18n |
| `src/lib/maintenance/` | `src/platform/maintenance/` or tooling | ownership review |
| `src/lib/observability/` | `src/platform/observability/` | relocate |
| `src/lib/performance/` | `src/platform/performance/` | relocate |
| `src/lib/platform/` | `src/platform/` | distribute |
| `src/lib/sync/` | `src/platform/sync/` | relocate |
| `src/hooks/` | `src/shared/hooks/`, platform, or module | ownership review |
| `src/integrations/supabase/` | `src/platform/backend/adapters/supabase/` | relocate |
| `src/services/` | platform/module service owners | classify first |
| `src/stores/` | app state, platform state, or module model | classify first |
| `src/scripts/` | `tooling/scripts/` | relocate |
| `src/supabase/` | platform adapters and backend migrations/tests | reconcile duplicate migration chain before moving |
| `src/tests/*` | `tests/*` | merge into transversal test root |
| `src/config/` | `src/config/` plus platform/app-owned config | split by responsibility |
| `src/data/` | `src/data/` or module-owned data | classify first |
| `src/assets/` | `src/assets/` or module-owned assets | keep imported source assets accessible |
| `src/routes/` | `src/routes/` | mandatory TanStack Start file-based route directory; do not move |
| `src/services/public-flash-discovery.server.ts` | `src/platform/backend/discovery/public-flash-discovery.server.ts` | shared server service; imports/config must be updated in file phase |

## Compatibility hold list
- **Routes:** TanStack Start file-based routing requires `src/routes/`; root route-tree is generated. Keep path.
- **Supabase:** package scripts, CI and local CLI currently use root `supabase/`. Keep until CLI config/workdir path behavior and all scripts/workflows are migrated and validated.
- **Lovable:** keep `.lovable/` until its expected metadata path is confirmed.
- **Packages:** keep existing names in this folder-only phase because Vite aliases, tsconfig paths, workspace globs and source imports reference `core-*`.
- **Drizzle:** current config references `./drizzle/schema.ts` and `./drizzle/migrations`; keep until config changes validated.
- **Server discovery service:** move only with all import paths and tests updated in a coherent commit.
- **Script/test paths:** relocate only with package scripts, workflows and test config updated in the same change.

## Execution batches (atomic commits, no merge)
1. Reference screenshots move (safe first batch).
2. Documentation directory normalization (after inventory of all docs destinations and collisions).
3. Tooling/scripts move (update scripts, workflows, package scripts in same commit).
4. Shared/platform foundational reclassification (imports and tests in same commit).
5. Modules migration (domain/feature merges, module-owned tests, imports).
6. Composition and app reclassification.
7. Final tests and old empty-directory cleanup.

Folder transfers will preserve content; no file deletion except empty source directory removal inherent in a move. This plan is not permission to rewrite module logic or alter behavior.
