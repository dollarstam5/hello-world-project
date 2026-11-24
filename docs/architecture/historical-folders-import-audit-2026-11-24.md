# Audit de reprise — dossiers historiques et frontières d'import

- Branche : `chore/architecture-folder-cleanup-2026-11`
- Commit observé : `e45742a58c4ca8190dc6cbbe4ad43117ef7b86ca`
- Instantané : 2026-11-24
- Type : audit de structure et préparation de l'inventaire des dépendances
- Aucun déplacement de code effectué dans ce lot.

## 1. État réel de l'arborescence

Le tree GitHub du commit ci-dessus est complet (non tronqué). Comptage des fichiers sous les répertoires historiques :

| Répertoire | Fichiers | Lecture initiale |
|---|---:|---|
| `src/components/` | 107 | Mélange de composants app, expérience et UI; à trier par ownership |
| `src/lib/` | 72 | Mélange AI, API, communication, experience, sync, utilitaires et plateformes |
| `src/features/` | 9 | Façades/flows résiduels; vérifier chaque export et consommateur |
| `src/layouts/` | 12 | Candidat composition/layouts après vérification des imports |
| `src/widgets/` | 13 | Candidat composition/widgets; vérifier logique métier cachée |
| `src/integrations/` | 8 | Adaptateurs externes; classifier server/client et dépendances |
| `src/hooks/` | 2 | Façades/hooks génériques ou métier à identifier |
| `src/services/` | 2 | Services server et orchestration; ownership à confirmer |
| `src/stores/` | 1 | État global ou métier à identifier |

Autres constats vérifiés :
- `src/domains/` ne contient plus de fichiers.
- Les 17 dossiers de `src/modules/` ont chacun un `index.ts`.
- `src/platform/` expose 14 sous-domaines indexés.
- `src/shared/`, `src/app/`, `src/config/`, `src/data/` et `src/assets/` existent.
- `src/composition/` à la racine n'existait pas encore dans cet instantané; seul `src/app/composition/` existait.
- `src/routes/`, les entrées serveur/client et les artefacts TanStack restent présents et doivent être conservés.

## 2. Écarts de gouvernance corrigés

L'ancien `ARCHITECTURE.md` décrivait encore `features → domains → widgets → routes`, ce qui contredisait la cible actuelle `modules/platform/shared/composition/app`. Il a été remplacé par une gouvernance unique qui précise :
- ownership de chaque couche;
- direction des dépendances;
- traitement transitoire des anciens répertoires;
- compatibilité des exports;
- contrôles obligatoires avant suppression ou migration.

## 3. Ce qui n'est pas encore prouvé

Cet audit ne prétend pas fournir un graphe AST exhaustif. Les nombres de fichiers et les répertoires sont vérifiés dans l'arbre Git, mais les points suivants restent à établir avant tout déplacement de masse :
- importeurs exacts de chaque fichier legacy (imports relatifs, alias `@/`, imports dynamiques);
- chaînes de re-export/barrels et usages indirects;
- dépendances cycliques et violations de couches;
- frontières server/client et effets de bord;
- usages depuis tests, scripts, routes et packages workspace.

Les recherches GitHub de code ne ciblent pas nécessairement cette branche de travail; elles ne doivent donc pas être utilisées seules pour certifier l'absence de consommateurs.

## 4. Ordre d'audit et migration sans casse

### Lot A — graphe d'import fiable
Générer localement avec le compilateur TypeScript un inventaire AST des imports statiques, exports, `import()`, `require()`, alias TS et références de tests/scripts. Produire pour chaque fichier : owner actuel, owner cible, importeurs, exports publics, runtime server/client et niveau de risque. Comparer le graphe avant/après chaque tranche.

### Lot B — composants
Séparer `src/components/ui` (primitives candidates shared), `src/components/app` (shell/app), et `src/components/experience` (composition ou UI de module selon responsabilité). Les cartes Flash/Radar/Wallet/Trust restent dans leur module; pas de déplacement automatique par nom.

### Lot C — composition
Créer `src/composition/{widgets,layouts,experiences}`. Migrer widgets et layouts cohérents, garder des re-exports temporaires et migrer les consommateurs dans le même commit.

### Lot D — lib et platform
Classifier `src/lib` fichier par fichier : infrastructure → platform; orchestration d'expérience → composition/app; règles métier → module propriétaire; utilitaires purs → shared. Les implémentations déjà extraites (internationalization/performance) conservent leurs shims tant que des consommateurs existent.

### Lot E — intégrations, services, stores, hooks
Établir le propriétaire et les frontières server/client avant déplacement. Ne pas fusionner `src/integrations/supabase`, `src/supabase`, `src/lib/api` et les services sans cartographie des responsabilités.

### Lot F — retrait des anciens dossiers
Supprimer chaque dossier historique seulement lorsqu'il est vide, que les références sont nulles, que les scripts/tests sont mis à jour et que tous les contrôles passent.

## 5. Critères de sortie de chaque tranche

- Importeurs vérifiés et zéro import cassé.
- Aucun nouveau cycle ni dépendance inversée.
- Typecheck, lint, tests ciblés, tests complets et build réussis.
- Vérification des routes et frontières server/client.
- Commit isolé et rapport des validations réellement exécutées.

## Verdict

La structure cible est présente, mais l'arborescence reste hybride. Les dossiers legacy les plus volumineux sont encore actifs. La prochaine migration sûre dépend d'un graphe d'import fiable; il serait risqué de déplacer ces répertoires en bloc à partir du seul inventaire de chemins.
