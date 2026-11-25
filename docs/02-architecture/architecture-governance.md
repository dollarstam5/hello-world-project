# Architecture Governance

**Règles obligatoires** pour les développeurs, Lovable, agents IA, générateurs et revues de code.

## Références avant toute intervention

Lire `AGENTS.md`, `docs/07-annexes/PROJECT_BIBLE.md`, ce document, `docs/05-ai/CONTRIBUTING_AI.md`, puis la documentation canonique du domaine concerné. Un ancien plan ou un prompt ponctuel ne permet pas de contourner ces règles.

## 1. Graphe de dépendances

Fondations : `core-contracts → core-logic → core-db → core-sync`.

Application : `shared → platform → features → domains → widgets → routes`.

Les imports vont uniquement vers les couches inférieures. Les domaines ne dépendent jamais des features, widgets ou routes. Éviter les dépendances latérales directes entre domaines ; préférer contrats, événements et composition au niveau supérieur. `src/app/bootstrap/` compose le démarrage sans devenir propriétaire du métier. `src/platform/index.ts` est une façade d'exports et ne change pas la propriété des modules.

## 2. Propriété des couches

| Couche | Possède | Interdit |
|---|---|---|
| `core-contracts` | contrats stables inter-packages | runtime, UI, dépendances app |
| `core-logic` | règles pures, calculs, validations | React, I/O, stockage, transport |
| `core-db` | schéma local, repositories, transactions, outbox | orchestration UX |
| `core-sync` | moteur de synchronisation et adaptateurs injectés | présentation métier |
| `shared` | primitives et types génériques, sans métier | concepts ou règles de domaines |
| `platform` | infrastructure technique : réseau, realtime, offline, PWA, device, permissions, observabilité, analytics, i18n | politique métier, état métier, parcours |
| `features` | parcours utilisateur qui orchestrent domaines + platform | propriété des faits, agrégats et invariants métier |
| `domains/<name>` | vocabulaire, données, invariants, règles, événements, état, API et services métier | dépendance vers features/widgets/routes |
| `widgets` | composition de plusieurs domaines/features | devenir propriétaire du métier |
| `routes` | entrée URL, chargement et composition | logique métier, appels backend, état métier lourd |
| `app/bootstrap` | initialisation et cycle de vie applicatif | règles métier |

**Repère :** platform explique comment une capacité technique fonctionne ; domain définit ce que le produit sait et les règles applicables ; feature définit comment une personne accomplit un parcours. Le caractère transversal ou réutilisé ne suffit pas à faire de quelque chose du platform ou du shared.

## 3. Arbre de décision

1. Contrat ou règle pure inter-packages ? → `packages/core-contracts` / `core-logic`.
2. Primitive générique sans métier ? → `src/shared`.
3. Adaptateur technique sans sémantique métier ? → `src/platform`.
4. Fait, état, événement, invariant ou règle d'un métier identifiable ? → `src/domains/<owner>`.
5. Parcours utilisateur composé de domaines et de platform ? → `src/features/<journey>`.
6. Composition visuelle multi-capacités ? → `src/widgets`.
7. Entrée URL et composition de page ? → `src/routes`.
8. Démarrage du cycle de vie ? → `src/app/bootstrap`.

Identifier le propriétaire des données, invariants et décisions ; ne pas choisir le dossier le plus commode.

## 4. Règles de dépendance

- Un domaine est l'unique propriétaire de ses faits, invariants, règles, événements et contrats.
- Une feature orchestre les domaines, sans redéfinir leurs règles ni dupliquer leurs faits.
- Platform reste technique et ne connaît pas les concepts métier.
- Shared ne connaît aucune couche supérieure.
- Les features utilisent les API publiques des domaines et platform, jamais routes/widgets.
- Widgets et routes composent sans déplacer la propriété métier.
- Éviter les barrels qui masquent les dépendances interdites.
- Ne pas créer un service global pour contourner la propriété d'un domaine.

## 5. Migration d'un ancien répertoire transversal

**Ne jamais déplacer un dossier historique en bloc.** Pour chaque migration :

1. Inventorier fichiers, exports, consommateurs, tests, effets de bord et dépendances.
2. Lire la Bible et les documents canoniques concernés.
3. Classer chaque responsabilité indépendamment.
4. Identifier le propriétaire réel, pas seulement le nom ou le chemin historique.
5. Repérer cycles et dépendances latérales.
6. Scinder les fichiers qui mélangent plusieurs propriétaires.
7. Déplacer par lots cohérents sans changement fonctionnel non demandé.
8. Mettre à jour consommateurs, tests, barrels et documentation.
9. Garder des façades `@deprecated` si nécessaire ; aucune logique dupliquée ni dépendance inversée.
10. Vérifier imports résiduels, typecheck, lint, tests et build selon scripts disponibles ; rapporter les limites.

## 6. Stores, hooks, services et types

- État métier → store/hook du domaine propriétaire.
- Progression temporaire d'un parcours → feature.
- État technique réseau/device/permissions/transport → platform.
- État visuel local → composant, sans store global.
- Service métier → `domains/<name>/services`.
- Adaptateur technique → `platform/<capability>`.
- Types métier → domaine ; types techniques → platform ; types génériques → shared/core-contracts.

## 7. Règles d'implémentation

TanStack Start exclusivement sous `src/routes/`; pas de `src/pages` ni autre routeur. Pas d'import `@supabase/*` depuis composants/widgets/routes. Les écritures suivent les repositories `@eco/core-db` et le protocole de synchronisation. Textes visibles via i18n FR/EN ; valeurs visuelles via tokens. Ne pas modifier les fichiers générés. Respecter SSR/hydration, accessibilité, responsive, offline et sécurité.

Nouveau composant : 300 lignes maximum selon la convention ESLint ; viser moins de 200 lorsque cohérent. Ne pas contourner la limite par des helpers opaques.

## 8. Checklist de revue

- [ ] Propriétaire de chaque responsabilité identifié.
- [ ] Chaque fichier placé dans la couche correcte.
- [ ] Imports descendants uniquement, sans cycle ni dépendance latérale injustifiée.
- [ ] Features orchestrent ; domaines gardent faits et règles.
- [ ] Platform ne contient aucune politique métier.
- [ ] Consommateurs, tests, barrels et façades cohérents.
- [ ] i18n, tokens, SSR, accessibilité et offline respectés.
- [ ] Contrôles annoncés réellement exécutés.
- [ ] Documentation et consignes agents mises à jour.

**Question finale : qui possède cette responsabilité, ses données et ses invariants ?** Cette réponse détermine le dossier.
