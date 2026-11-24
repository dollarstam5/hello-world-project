# Audit de reprise — dossiers historiques et graphe de dépendances

- Branche : `chore/architecture-folder-cleanup-2026-11`
- Base vérifiée : `b6beffa07841cf12124a8fc6cc66f997941efd5a`
- Instantané : 2026-11-24
- Portée de cette révision : configuration des alias, façades d'entrée, composition/layouts, routes et frontières server/client.
- Statut : audit ciblé en cours; le graphe AST exhaustif n'est pas encore produit.

## 1. Inventaire structurel

Le tree Git de la branche est complet (436 fichiers TypeScript/JavaScript sous `src/`, `tests/`, `tooling/` et `packages/`; 1 145 938 octets de source dans `src/` seulement). L'instantané structurel des dossiers historiques reste :

| Répertoire | Fichiers | Lecture initiale |
|---|---:|---|
| `src/components/` | 107 | Mélange de composants app, expérience et UI |
| `src/lib/` | 72 | Mélange AI, API, communication, expérience, sync, utilitaires et plateformes |
| `src/features/` | 9 | Façades/flows résiduels |
| `src/layouts/` | 12 | Façades responsive et surfaces de présentation |
| `src/widgets/` | 13 | Façades de blocs d'expérience |
| `src/integrations/` | 8 | Adaptateurs externes, à classifier server/client |
| `src/hooks/` | 2 | Façades de hooks |
| `src/services/` | 2 | Services et orchestration |
| `src/stores/` | 1 | Façade d'état global |

## 2. Configuration des résolutions

- `tsconfig.json` définit `@/* → ./src/*`.
- `vite.config.ts` reprend explicitement les alias des quatre packages workspace `@eco/core-contracts`, `@eco/core-logic`, `@eco/core-db` et `@eco/core-sync`.
- `tests/vitest.config.ts` définit les mêmes alias `@` et `@eco/*`; les tests utilisent donc une résolution alignée sur l'application.
- Le worker/server build dépend d'alias Vite explicites pour les packages `@eco/*`; ils ne doivent pas être modifiés dans une migration de dossiers sans validation dédiée.
- `src/routes/routeTree.gen.ts` est généré par TanStack et ne doit pas être édité manuellement.

## 3. Dépendances observées sur les façades et l'assemblage

Inspection des points d'entrée et d'un échantillon ciblé de fichiers route/layout/composition :

- `src/routes/__root.tsx` consomme `@/app/composition`, `@/app/bootstrap` et directement `@/lib/i18n/useI18n`.
- `src/app/composition/RootAppComposition.tsx` consommait `@/domains/access-mode`, alors que le module public existe désormais en `@/modules/access-mode`. Cette référence résiduelle a été corrigée dans le commit suivant cet audit.
- `src/layouts/AdaptiveLayout.tsx` consomme `@/lib/platform/useResponsive` et délègue aux façades mobile/tablet/desktop.
- Les façades `src/layouts/{mobile,tablet,desktop,ecosystem}/index.ts` réexportent toutes `AppShell` depuis `@/components/app/AppShell`; ce dernier est déjà un shim vers `@/app/shell/AppShell`.
- `src/layouts/modal/index.ts` réexporte `Sheet` et `Modal` depuis `components/app`.
- Les façades `src/widgets/{smart-feed,ai-layer,offline-banner,smart-state,section-foundation}/index.ts` réexportent des implémentations dans `src/components/experience/`. `activity-strip` est encore un placeholder vide.
- `src/hooks/index.ts` agrège des hooks de `lib/platform`, `lib/i18n`, `lib/design` et `lib/experience`.
- `src/services/index.ts` réexporte `useExperienceBoot` depuis `lib/experience/orchestrator`; `src/stores/index.ts` réexporte le thème depuis `lib/app/theme`.
- `src/server.ts` importe explicitement plusieurs modules `.server` de `src/lib` et utilise un `import()` dynamique de `@tanstack/react-start/server-entry`. Cette frontière server-only est à préserver.

Cet échantillon établit des chaînes de compatibilité concrètes, mais ne constitue pas encore la liste exhaustive des importeurs de chaque fichier legacy.

## 4. Répartition des composants : règles d'ownership

- `src/components/app` contient actuellement un mélange : des primitives génériques (`Icon`, `Surface`, `Skeletons`) mais aussi des cartes métier (`FlashCard`, `RadarCard`, `WalletCard`, `TrustCard`). Ne pas déplacer le dossier en bloc.
- `src/components/experience` assemble des éléments d'expérience (`HomeFoundation`, `CommunicationSheet`, `OnboardingSheet`, `OfflineBanner`, `SmartStateView`). À classifier entre `composition/experiences`, `composition/widgets` et modules selon les dépendances métier.
- Les cartes métier doivent rejoindre leur module propriétaire; les primitives sans vocabulaire métier peuvent rejoindre `shared/ui` ou `shared/components`.
- Les re-exports existants sont des points de compatibilité temporaires à conserver jusqu'à migration des consommateurs.

## 5. Graphe exhaustif restant à produire

Le graphe complet demandé n'est pas certifié à ce stade. Il doit couvrir les 436 sources recensées et les autres fichiers de configuration pertinents, avec analyse AST TypeScript plutôt qu'une simple expression régulière, pour inclure correctement :

1. imports statiques et exports nommés/par défaut;
2. re-exports et chaînes de barrels;
3. `import()` littéraux et calculés;
4. `require()`, `require.resolve()` et imports de side effects;
5. alias TypeScript/Vite/Vitest et résolution des chemins relatifs/extensions;
6. tests, setup Vitest, scripts, routes, packages workspace et fichiers de configuration;
7. cycles, importeurs entrants/sortants, frontières server/client et fichiers non résolus.

Pour chaque fichier, le livrable doit donner : chemin actuel, propriétaire cible, importeurs directs, dépendances directes, exports publics, type de runtime, test associé et niveau de risque. Une recherche de code GitHub limitée à la branche par défaut ne suffit pas pour certifier ce résultat sur cette branche de travail.

## 6. Ordre des migrations après le graphe

1. Séparer les composants génériques, métier et d'assemblage.
2. Migrer widgets et layouts par tranches cohérentes vers `src/composition/{widgets,layouts}`, en déplaçant aussi les consommateurs et en gardant des shims.
3. Classifier chaque fichier de `src/lib` : infrastructure → `platform`; utilitaires purs → `shared`; règles métier → module propriétaire; orchestration produit → `composition` ou `app`.
4. Traiter intégrations, services, hooks et stores après classification server/client et ownership.
5. Supprimer un ancien dossier uniquement lorsque le graphe complet ne montre plus aucun consommateur, que les tests/scripts sont actualisés et que les validations passent.

## 7. Validations

Aucun typecheck, lint, test Vitest ou build n'a été exécuté dans cet audit GitHub. Aucun résultat de validation n'est donc revendiqué. Chaque tranche de migration devra fournir les résultats réels de ces contrôles.

## Verdict

La cible architecturale est établie, mais les dossiers historiques restent actifs. Des façades et des dépendances résiduelles sont maintenant identifiées; le graphe AST exhaustif reste le premier verrou avant une migration plus large.