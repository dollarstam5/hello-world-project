# Audit des références — Lot 4

Date: 2026-11-23
Branch: chore/architecture-folder-cleanup-2026-11

## Corrections appliquées
- `tooling/scripts/check-global-audit.ts`: chemins documentaires actualisés vers la structure canonique.
- `tooling/scripts/check-go-no-go.ts`: chemins documentaires actualisés vers la structure canonique.
- `docs/archive/README.md`: réindexation des sources historiques vers leurs emplacements actuels; liens relatifs vers les index de migration corrigés.
- `docs/reference/documentation-migration-map.md`: références des domaines normalisées.
- `PRODUCTION_CHECKLIST.md`: dossiers API, base de données, opérations et IA alignés.
- `docs/architecture/folder-relocation-manifest-2026.md`: état du plan précisé après les Lots 1 à 3 et chemins de documentation canonisés.

## Finding bloquant à traiter
Le checker `tooling/scripts/check-foundation.mjs` référence encore un inventaire de fichiers obsolète. Comparaison de son inventaire avec l'arbre de la branche: **110 chemins inexistants sur 145 références**. Des chemins de documentation et scripts historiques y figurent encore; son résultat ne peut donc pas servir de validation fiable. Il n'a pas été modifié dans ce lot afin d'éviter d'effacer des contrôles fonctionnels sans revue de leur intention. Une refonte de son inventaire est recommandée au lot de stabilisation.

## Validation effectuée
- Arbre Git de la branche récupéré et non tronqué: 1 147 entrées (924 fichiers).
- Vérification ciblée des scripts de contrôle global, Go/No-Go, foundation et checklist de production.
- Références de dossiers documentaires normalisées dans les fichiers corrigés.
- Les 46 liens relatifs du `docs/README.md` avaient déjà été contrôlés au Lot 3 (0 cible manquante).

## Limites
L'audit n'a pas exécuté Bun, tests, lint, typecheck ni build; l'environnement de travail ne dispose pas de l'installation locale du projet. Une analyse exhaustive de chaque lien Markdown de tous les fichiers et des imports TypeScript n'est pas certifiée par ce lot. Le checker Foundation en mauvais état constitue un point de suivi explicite.
