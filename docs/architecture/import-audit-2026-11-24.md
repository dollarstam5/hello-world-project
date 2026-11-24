# Audit des imports et contrôles de migration — 24 novembre 2026

## Périmètre et méthode

Audit exécuté sur la branche `chore/architecture-folder-cleanup-2026-11`, commit contrôlé `dee07def7a2d68642c56b06c0385125daf8a4811`.

Le script `tooling/scripts/check-architecture-imports.mjs` parcourt les sources TypeScript/JavaScript de `src/`, `packages/`, `tests/` et `tooling/`. Il examine les imports statiques, les réexports et les imports dynamiques littéraux, puis vérifie la résolution des chemins relatifs, de l’alias `@/` et des alias workspace `@eco/*`. Il signale également les anciens chemins d’ownership pour les fichiers déjà migrés.

Le contrôle a été ajouté à `check:foundation` via `check:architecture-imports`, afin que l’audit soit rejoué à chaque validation Quality.

## Résultat de l’audit

**Résultat : passé**

- **589 fichiers** TypeScript/JavaScript parcourus.
- **1 292 imports locaux** vérifiés.
- **0 import local non résolu**.
- **0 référence détectée** vers les anciens chemins d’ownership suivis par le contrôle (anciens `domains/*`, primitives partagées déplacées et surfaces déplacées de `components/experience`).

Résultat CI observé :

```text
Import resolution passed: 589 source files and 1292 local imports checked.
No legacy ownership imports detected for migrated paths.
```

## Références corrigées pendant l’audit

- Le shell utilise les points d’entrée `@/modules/auth` et `@/modules/access-mode`, au lieu de chemins historiques `@/domains/*`.
- Les routes et façades de widgets pointent vers les propriétaires canoniques de HomeFoundation, SectionFoundation, SmartStateView et OfflineBanner.
- Les imports de navigation et le test de BottomNav utilisent `app/navigation`.
- Les consommateurs de Surface et Indicator concernés utilisent `shared/components`.
- Les bannières PWA/offline utilisent les modules plateforme appropriés ; les hooks d’installation et de mise à jour importent directement leurs modules, sans passer par la façade UI.
- Les scripts de budget de performance ciblent désormais `platform/performance` et leur chemin relatif vers `src/` a été corrigé.
- La carte de raccourcis de l’accueil a été extraite dans `composition/experiences/home/HomeEngineCard.tsx`, pour garder HomeFoundation sous la limite ESLint de lignes.

Les anciens fichiers de compatibilité sont conservés lorsqu’ils sont nécessaires aux consommateurs historiques, mais aucun import actif des chemins d’ownership migrés suivis par le script n’a été relevé dans le périmètre analysé.

## Résultats des contrôles GitHub Actions

PR brouillon : [#90 — Architecture migration audit and validation](https://github.com/dollarstam5/hello-world-project/pull/90)

| Contrôle | Résultat | Détail |
|---|---|---|
| Foundation check | Réussi | 27 ancres d’architecture et le corpus local de connaissances sont présents. |
| Architecture import audit | Réussi | 589 fichiers, 1 292 imports locaux, aucun chemin non résolu ni ancien ownership détecté. |
| Dependency review | Réussi | Aucune modification de dépendance rejetée. |
| Scan Validation | Réussi | Lint ciblé Scan et tests ciblés Scan réussis. |
| Quality — lint global | Échoué | 55 erreurs et 15 avertissements ESLint/Prettier. |

### Interprétation du lint global

Le dernier contrôle Quality sur cette branche rapporte **55 erreurs et 15 avertissements**. Le contrôle Quality de référence sur `main` (commit `909a0d60b6dd57cb455a73441cbd7ed2b00d1262`, 21 novembre 2026) rapportait **59 erreurs et 15 avertissements**. Le niveau global s’est donc amélioré de quatre erreurs, mais le lint n’est pas vert.

Les erreurs restantes sont principalement des problèmes de formatage dans des fichiers Reel auparavant situés sous `domains/presence`, désormais sous `modules/reel`, ainsi que des défauts préexistants dans quelques fichiers plateforme/UI. Elles ne signalent pas d’imports locaux non résolus ; le contrôle d’imports dédié est passé.

Comme `check:foundation` s’arrête sur le lint global, les étapes Quality suivantes ont été ignorées pour cette exécution : tests RLS Supabase, smoke tests E2E mobiles et Release check (qui comprend le build). Ces contrôles ne sont donc **pas validés** par cette exécution. Les tests ciblés Scan, eux, ont bien été exécutés et ont réussi.

## Conclusion

L’audit de résolution des imports sur le périmètre analysé est passé et les anciens chemins d’ownership ciblés ont été éliminés des imports actifs. La migration reste toutefois **non validée au niveau global** : le lint complet échoue encore et les étapes DB/E2E/build n’ont pas été atteintes. La PR reste en brouillon et ne doit pas être fusionnée sur la seule base de l’audit d’imports.
