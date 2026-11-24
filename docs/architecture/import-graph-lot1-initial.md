# Lot 1 — graphe d'import vérifié (première tranche)

Branche : `chore/architecture-folder-cleanup-2026-11`  
Base auditée : `001921b203b2423c3756926fedaa3158625d6267`

## Portée de cette livraison

Cette première tranche consigne les fichiers dont le contenu a été relu directement dans la branche. Elle ne prétend pas être le graphe AST complet de tout `src/` : les importeurs entrants de l'ensemble du dépôt, les imports calculés, les exports indirects et les tests associés à chaque façade restent à établir. Aucun fichier applicatif n'est déplacé dans cette étape.

## Graphe vérifié

| Fichier | Dépendances sortantes vérifiées | Rôle / frontière |
|---|---|---|
| `src/routes/__root.tsx` | `@tanstack/react-router`, `@tanstack/react-query`, `../styles.css?url`, `@/app/composition`, `@/lib/i18n/useI18n`, `@/app/bootstrap` | Racine TanStack, shell SSR, point de montage de l'application. |
| `src/app/composition/index.ts` | `./RootAppComposition` | Façade publique de composition. |
| `src/app/composition/RootAppComposition.tsx` | `react`, `@tanstack/react-query`, `@/modules/access-mode`, `@/app/shell/AppShell` | Composition providers + shell. Client React. |
| `src/app/bootstrap/index.ts` | `@/lib/experience/orchestrator`, `./useRootLifecycle` | Façade lifecycle/bootstrap. |
| `src/app/bootstrap/useRootLifecycle.ts` | `react`, `@tanstack/react-router`, `@/platform/pwa`, `@/lib/performance/web-vitals`, `@/lib/performance/interaction-navigation` | Hook client : service worker, Web Vitals, mesure navigation. |
| `src/app/shell/index.ts` | `./AppShell` | Façade publique du shell. |
| `src/app/shell/AppShell.tsx` | `react`, `@tanstack/react-router`, `@/components/app/BottomNav`, plusieurs composants `@/components/experience/*`, `@/lib/*`, `@/modules/reel/*`, `@/domains/auth/model/useAuth`, `@/domains/access-mode` ; imports dynamiques de ReelBottomNav, MenuSheet, CommunicationSheet, OnboardingSheet | Shell client et point d'assemblage transverse. |
| `src/app/index.ts` | `./app-shell`, `./providers`, `./router`, `./bootstrap`, `./guards`, `./shell`, `./composition` | Façade agrégatrice de l'application. |
| `src/layouts/AdaptiveLayout.tsx` | `@/lib/platform/useResponsive`, `./mobile`, `./tablet`, `./desktop`, `react` | Sélection de layout selon le terminal. Client. |
| `src/layouts/index.ts` | `./mobile`, `./tablet`, `./desktop`, `./ecosystem`, `./modal`, `./AdaptiveLayout` | Façade des layouts. |
| `src/layouts/mobile/index.ts` | `@/components/app/AppShell` | Façade mobile qui réexporte AppShell comme MobileLayout. |
| `src/widgets/index.ts` | `./smart-feed`, `./ai-layer`, `./offline-banner`, `./smart-state`, `./section-foundation`, `./activity-strip` | Façade agrégatrice des widgets. |
| `src/server.ts` | `./lib/error-page`, `./lib/safe-log.server`, `./lib/security-headers.server`, `./lib/request-context.server`, import dynamique `@tanstack/react-start/server-entry` | Entrée serveur explicite ; ne doit pas être aspirée dans le graphe client. |
| `src/start.ts` | `@tanstack/react-start`, `@tanstack/react-start/server`, `./lib/error-page`, `@/integrations/supabase/auth-attacher`, `./lib/safe-log.server`, `./lib/request-context.server` | Bootstrap TanStack Start avec middleware serveur. |

## Alias et résolution

- `@/*` résout vers `./src/*` dans `tsconfig.json`.
- `@eco/core-contracts`, `@eco/core-logic`, `@eco/core-db`, `@eco/core-sync` résolvent vers les points d'entrée `packages/*/src/index.ts`.
- Vite redéfinit explicitement les quatre alias `@eco/*` pour les bundles worker.
- Vitest redéfinit `@` et les quatre alias `@eco/*` dans `tests/vitest.config.ts`.
- La configuration Vite délègue TanStack Start et le routage de l'entrée serveur à `src/server.ts`.

## Constats d'architecture à traiter dans les lots suivants

1. **Migration partielle de l'authentification et du mode d'accès :** `RootAppComposition.tsx` importe `@/modules/access-mode`, alors que `AppShell.tsx` conserve `@/domains/access-mode` et `@/domains/auth/model/useAuth`. Il faut vérifier les consommateurs, les contrats et les tests avant de retirer ces façades historiques.
2. **Façade de layout encore adossée à l'ancien emplacement :** `src/layouts/mobile/index.ts` réexporte `@/components/app/AppShell`. L'historique de migration de `components/app` doit être vérifié avant toute consolidation.
3. **Responsabilités transverses dans AppShell :** navigation, communication, auth, préférences assistant, onboarding, PWA/offline et projections Reel y convergent. Une extraction éventuelle doit être guidée par les importeurs et tests, pas par un simple déplacement de fichier.
4. **Frontière serveur :** `src/server.ts` et `src/start.ts` importent des modules `.server` et du middleware serveur. Ils restent séparés des modules React client.

## Couverture et limites

- Les alias TypeScript, Vite et Vitest ont été lus directement.
- Les dépendances listées sont les imports statiques et dynamiques visibles dans les fichiers consultés.
- Les entrées serveur `src/server.ts` et `src/start.ts` ont été consultées directement.
- Cette tranche ne certifie pas l'exhaustivité des importeurs entrants, des imports calculés, des dépendances indirectes, des cycles, ni l'association exhaustive des tests.
- Aucun lint, typecheck, test ou build n'a été exécuté depuis cette session.
- Aucun déplacement ni changement de code applicatif n'est inclus.

## Prochaine opération technique

Compléter le graphe AST sur l'ensemble du périmètre Lot 1 (routes, app, layouts, widgets et leurs importeurs), en incluant les réexports, imports dynamiques, alias, tests et classification client/serveur. La migration des composants et façades ne commence qu'après validation de cette couverture.
