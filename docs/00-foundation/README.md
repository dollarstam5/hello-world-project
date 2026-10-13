# Foundation

Cette section contient les fondations canoniques du projet : architecture, séquencement du build, conventions d'ingénierie et langage de design.

## Contents

- [Architecture](./architecture.md)
- [Build overview](./build-overview.md)
- [Build conventions](./build-conventions.md)
- [Langage de design Vitala](./design-language.md)

## Core principle

Le projet se construit dans un ordre stable et guidé par les dépendances. Toute évolution doit respecter les frontières d'architecture et les références canoniques.

## Canonical references

- [Architecture](../../ARCHITECTURE.md)
- [Quality](../../QUALITY.md)
- [Préparation de release et décision Go/No-Go](../06-operations/release-readiness.md)
- [Reproducibility](../../REPRODUCIBILITY.md)
- [Langage de design](./design-language.md)

Le document historique `docs/GO_NO_GO.md` reste conservé pour traçabilité et figure parmi les candidats à comparer avant toute proposition de retrait.

## Legacy sources merged here

Les fichiers historiques restent des sources de traçabilité et ne sont pas supprimés sans validation technique et autorisation explicite. Voir la [cartographie de migration documentaire](../07-annexes/documentation-migration-map.md) et la [liste des suppressions proposées](../07-annexes/proposed-document-removals.md).
