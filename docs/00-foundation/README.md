# Fondations

Cette section rassemble les fondations du projet : conventions d'ingénierie, séquencement du build, langage de design et principes fondamentaux.

## Contenu

- [Gouvernance d'architecture — référence canonique](../02-architecture/architecture-governance.md)
- [Index des références architecturales](../02-architecture/README.md)
- [Bible du projet](../07-annexes/PROJECT_BIBLE.md)
- [Instructions Lovable et agents IA](../05-ai/CONTRIBUTING_AI.md)
- [Build overview](./build-overview.md)
- [Build conventions](./build-conventions.md)
- [Langage de design Vitalis](./design-language.md)
- [Standards UX et accessibilité — Phase 2](./phase-2-ux-standards.md)
- [Adaptation PWA et capacités des plateformes](./pwa-platform-adaptation.md)

## Principe produit prioritaire

- [Principes fondamentaux de Vitalis](./vitalis-core-principles.md) — règle P0 obligatoire pour tous les moteurs : traiter les demandes exploitables avec les informations disponibles, puis proposer les compléments facultatifs. Les contrôles de sécurité, de consentement et de droits restent impératifs.

## Principe fondamental

Le projet se construit dans un ordre stable et guidé par les dépendances. Toute évolution doit respecter les frontières d'architecture et les références canoniques. Les règles détaillées d'architecture ne sont pas maintenues dans ce dossier de fondations : elles résident dans [02-architecture](../02-architecture/README.md).

## Références de fondation

- [Bible du projet](../07-annexes/PROJECT_BIBLE.md)
- [Quality](../06-operations/QUALITY.md)
- [Préparation de release et décision Go/No-Go](../06-operations/release-readiness.md)
- [Reproducibility](../06-operations/REPRODUCIBILITY.md)
- [Langage de design](./design-language.md)
- [Standards UX et accessibilité — Phase 2](./phase-2-ux-standards.md)
- [Adaptation PWA et capacités des plateformes](./pwa-platform-adaptation.md)

Le document historique `docs/GO_NO_GO.md` reste conservé pour traçabilité et figure parmi les candidats à comparer avant toute proposition de retrait.

## Sources historiques

Les fichiers historiques restent des sources de traçabilité et ne sont pas supprimés sans validation technique et autorisation explicite. Voir la [cartographie de migration documentaire](../07-annexes/documentation-migration-map.md) et la [liste des suppressions proposées](../07-annexes/proposed-document-removals.md).
