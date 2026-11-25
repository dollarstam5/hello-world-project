# Lot 5A — Inventaire des imports, exports et ownership

Date: 2026-11-23
Branche: `chore/architecture-folder-cleanup-2026-11`
Scope: revue des façades/entrypoints et des frontières de dépendance; aucun déplacement de fichier.

## Limite de couverture
Le dépôt contient 420 fichiers TS/TSX/JS/JSX dans `src/`. Une extraction automatique exhaustive des import/export de tous les fichiers n'a pas été menée à bien dans cette session. L'audit ci-dessous est une revue ciblée des façades principales et de fichiers représentatifs, avec cheminement documenté. Il ne doit pas être présenté comme un graphe complet ni comme une certification d'absence de cycles.

## Entrées et façades vérifiées
| Fichier | Exports/dépendances actuels | Ownership provisoire | Cible proposée |
|---|---|---|---|
| `src/app/index.ts` | re-export app-shell, providers, router, bootstrap, guards, shell, composition | app | `src/app` (garder) |
| `src/app/app-shell/index.ts` | `AppShell`, `BottomNav`, `MenuSheet` via `components/app` | shell/compat | app/shell; compat à garder si consommateurs |
| `src/app/shell/index.ts` | export `AppShell` local | shell | app/shell (canonique) |
| `src/app/composition/index.ts` | export `RootAppComposition` | composition racine | app/composition (canonique) |
| `src/features/index.ts` | namespaces search/settings/discovery/presence | façades de flows | à comparer à domains; supprimer uniquement après consumer scan |
| `src/features/presence/index.ts` | re-export `@/lib/experience/presence` | expérience/presence (pas domaine métier) | composition ou domain presence selon contenu réel |
| `src/features/discovery/index.ts` | re-export `@/lib/experience/discovery` | orchestration discovery | composition; ownership à confirmer |
| `src/features/search/index.ts` | placeholder vide | feature non implémentée dans façade | pas de migration |
| `src/features/settings/index.ts` | re-export theme store de `lib/app/theme` | état app/settings | app/settings ou platform/theme |
| `src/platform/index.ts` | 12 namespaces de capacités (AI, realtime, offline, PWA, trust, monetization, analytics, i18n, notifications, permissions, device, accessibility) | platform façade | platform (canonique) |
| `src/platform/ai/index.ts` | re-export `@/lib/ai/assistant` | AI runtime | platform/ai, conserver shim le temps de migration |
| `src/platform/realtime/index.ts` | re-export `@/lib/platform/realtime` | realtime système | platform/realtime, compat shim |
| `src/platform/internationalization/index.ts` | re-export `@/lib/i18n/useI18n` et types messages | i18n | platform/i18n; compat shim |
| `src/platform/offline/index.ts` | local query/sync-status/local-scope/controller + repositories `@eco/core-db` | offline & persistence | platform/offline, DB demeure dans package core-db |
| `src/platform/pwa.ts` | re-export install/update | PWA | platform/pwa; shim compatible |
| `src/shared/index.ts` | namespaces UI/components/utils/tokens/animations | shared façade | shared (canonique) |
| `src/widgets/index.ts` | six blocs composés (feed, AI, offline, smart state, section, activity) | composition UX | composition/widgets |
| `src/layouts/AdaptiveLayout.tsx` | choisit mobile/tablet/desktop selon `@/lib/platform/useResponsive` | layout/adaptation | composition/layouts; capacité responsive platform |
| `src/layouts/index.ts` | exports mobile/tablet/desktop/ecosystem/modal + AdaptiveLayout | layouts | composition/layouts |
| `src/services/index.ts` | `useExperienceBoot` de `@/lib/experience/orchestrator` | orchestration expérience | composition/bootstrap ou app/bootstrap |
| `src/stores/index.ts` | theme store de `@/lib/app/theme` | état global | app/state; source canonique à décider |
| `src/services/public-flash-discovery.server.ts` | Supabase client, types core contracts, config server, RPC | service server de découverte publique | domaine Scan/Flash ou service API neutre; trancher ownership fonctionnel |

## Cartographie de dépendances observée
- Façades `app`, `platform`, `shared` et `widgets` réexportent des modules sous-jacents; les nouvelles frontières sont encore des couches de compatibilité, pas toutes des implementations déplacées.
- Plusieurs chemins alias `@/lib/*` sont directement exposés par `features`, `platform`, `services` et `stores`. Les consumers peuvent donc contourner les façades.
- `platform/offline` dépend d'un package externe `@eco/core-db`, et non d'une implémentation DB locale.
- `AdaptiveLayout` dépend du hook responsive historique `lib/platform/useResponsive`, alors que layouts sont appelés composition dans la cible.
- Les domaines métier (`src/domains/*`) gardent leur sous-structure API/model/hooks/ui/policy/service. La revue de Flash a confirmé une frontière interne organisée; Presence est également organisée API/model/policy/services/UI. Ce sont des candidats de migration par domaine, pas des déplacements atomiques.
- `components/app` est un barrel mixte: primitives génériques et composants cartes métier sont exportés ensemble. Il faut tracer les consumers avant split.
- `src/integrations/supabase`, `src/supabase`, `src/lib/api`, `src/lib/sync`, `src/services` et `src/stores` sont des points à inventorier pour éviter duplications/alias d'accès.

## Décisions de migration recommandées
1. Geler les déplacements; ajouter une règle de dépendance : `app → composition → modules/features → platform/shared` (avec shared/platform sans imports métier). Confirmer la direction exacte dans la doc architecture avant enforcement.
2. `features`: traiter comme compat façades, pas comme nouveau propriétaire; chercher les consumers, migrer les imports vers la destination canonique, puis retirer les façades uniquement quand la recherche d'usage est nulle.
3. `lib`: classifier fichier par fichier (app-state, platform, communication, AI, API, experience orchestration, utilities) avant toute migration. Priorité aux modules qui ont une façade platform/composition existante.
4. `components/app`: séparer primitives agnostiques et cartes spécifiques Flash/Radar/Wallet/Trust; consumer map obligatoire.
5. `widgets/layouts/components/experience`: consolidation progressive vers composition, en préservant les exports.
6. Services server Supabase/RPC : définir owner module ou platform API avant mouvement; ne pas mélanger client/server code.
7. Pour le graphe complet : extraction AST (TypeScript compiler) des import/export statiques, dynamic imports, alias `@`, package imports `@eco/*`, barrels et dépendances route; identifier cycles et imports server/client. Validation par scripts/tests après chaque lot.

## État
- Revue ciblée des entrypoints/facades effectuée et documentée.
- Ownership/cible provisoires indiqués; points nécessitant une recherche consumer explicite listés.
- Graphe exhaustif des 420 fichiers, cycles, imports dynamiques et références directes : **non terminé / non certifié**.
- Aucun code déplacé ou supprimé.
- Aucun lint, test, typecheck ou build exécuté.
