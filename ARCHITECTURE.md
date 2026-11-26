# Architecture Governance

This document defines the canonical architecture for `src/`. It supersedes the former `features → domains → widgets` layering. Historical folders may remain temporarily as compatibility locations, but they are not target owners.

## Canonical structure

```text
src/
├── app/           # Application shell, bootstrap, routing, global providers/guards
├── modules/       # Autonomous business capabilities and domain rules
├── platform/      # Cross-cutting technical capabilities and device/runtime adapters
├── shared/        # Business-agnostic UI, types, tokens, utilities and validators
├── composition/   # Product experiences assembled from modules
├── config/        # Runtime/build configuration
├── data/          # Static/reference data (not repositories or business services)
├── assets/        # Images, fonts and other static assets
└── tests/         # Source-adjacent tests only when intentionally colocated;
                   # the repository-level tests/ remains the primary test suite
```

TanStack Start routing remains under `src/routes/` because the framework requires it. Generated route artifacts and server/client entrypoints remain at their current framework-owned paths unless a dedicated routing migration is designed.

**Important distinction — two composition boundaries:** `src/composition/` is the product-experience layer described below: it assembles business modules into reusable experiences, layouts and widgets. `src/app/composition/` is a narrower application-root implementation detail: it currently contains `RootAppComposition`, which wires global providers around `AppShell` and the route outlet. It does not replace or duplicate the product-experience layer. The global shell, bootstrap and route lifecycle remain owned by `src/app/`; framework route files remain in `src/routes/`.

## Ownership

| Area | Owns | Must not own |
|---|---|---|
| `app/` | bootstrap, root shell, route integration, global providers and guards | feature business rules |
| `modules/<name>/` | business models, policies, services, UI and module-specific state | generic primitives or device infrastructure |
| `platform/<capability>/` | PWA, device, offline, network, permissions, notifications, realtime, storage, analytics and technical adapters | product screens and domain decisions |
| `shared/` | generic UI, hooks, types, tokens, validators and pure utilities | business-specific concepts |
| `composition/` | experiences, layouts and widgets that assemble modules | owning module business rules or duplicating module services |
| `config/`, `data/`, `assets/` | configuration, static data and static resources | runtime orchestration or business services |
| `routes/` | framework route entrypoints and route-level composition | heavy business logic and direct data ownership |

## Dependency direction

Allowed direction (higher layers may depend on lower layers):

```text
app → composition → modules → platform → shared
       └───────────────┘
```

Additional rules:
- `shared` imports no app, composition, module or platform code.
- `platform` may depend on `shared`, never on modules or product composition.
- A module may depend on `shared` and `platform`; cross-module dependencies must use the other module's public `index.ts` and must be justified.
- `composition` may assemble modules and shared/platform capabilities, but must not become a second home for business rules.
- `app` owns global wiring and may consume composition and platform entrypoints.
- Framework route files may call app/composition/module public entrypoints as required by the routing framework.
- Server-only modules must never leak into client bundles. Keep server authorization authoritative.

## Migration policy

- Legacy paths (`src/components`, `src/features`, `src/hooks`, `src/integrations`, `src/layouts`, `src/lib`, `src/services`, `src/stores`, `src/widgets`) are transitional until audited and emptied or explicitly retained with documented ownership.
- Never move files based on path/name alone. Classify each file by responsibility, runtime (server/client/shared), importers, exports, side effects and test coverage.
- Preserve compatibility re-exports while consumers are migrated. Remove a shim only after a complete consumer search and successful validation.
- Migrate one coherent slice at a time. Each slice must update imports, aliases, barrels, tests and scripts atomically.
- Do not modify generated route trees manually.

## Validation gates for each migration slice

1. Consumer/import graph reviewed, including static and dynamic imports, barrel re-exports and aliases.
2. No forbidden dependency direction or new cycle introduced.
3. TypeScript typecheck and ESLint pass.
4. Relevant focused tests pass, then full test suite.
5. Production build passes.
6. Runtime-sensitive server/client boundaries and route loading are checked.

A Git commit or a clean folder tree is not evidence that the application builds or behaves correctly. Record validation results explicitly.

## File size and code quality

- Keep components cohesive and preferably below 200 lines.
- Existing large files may be split incrementally when responsibility is clear; do not create opaque helper files solely to satisfy a line count.
- User-facing strings use the project's internationalization layer.
- Visual values use design tokens.
- Mocks belong with their owning module or in explicitly shared test fixtures.
