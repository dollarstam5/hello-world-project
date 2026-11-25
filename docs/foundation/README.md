# Foundation

Cette section contient les fondations canoniques du projet : architecture, séquencement du build, conventions d'ingénierie et langage de design.

## Contents

- [Architecture](./architecture.md)
- [Build overview](./build-overview.md)
- [Build conventions](./build-conventions.md)
- [Langage de design Vitalis](./design-language.md)
- [Standards UX et accessibilité — Phase 2](./phase-2-ux-standards.md)
- [Adaptation PWA et capacités des plateformes](./pwa-platform-adaptation.md)
- [Référentiel produit — collecte en langage humain des moteurs](./conversational-engines-product-reference.md) — état vérifié, clarifications et évolutions non encore livrées pour Flash, Scan et Radar.
- [Expérience géographique — En direct](./en-direct-geographic-experience.md) — parcours cible, recherche autour de soi, types de résultats, fiabilité des informations, interactions et confidentialité.
- [Parcours produit — première ouverture et découverte](./first-opening-product-journey.md) — audit de l'introduction actuelle, de l'accueil, de la langue, de la persistance et des points à décider avant la modernisation.
- [Proposition éditoriale — première découverte et exemples des quatre moteurs](./first-opening-copy-and-examples.md) — textes proposés écran par écran, exemples Flash/Scan/En direct/Radar et limites à expliciter avant validation.

## Principe produit prioritaire

- [Principes fondamentaux de Vitalis](./vitalis-core-principles.md) — règle P0 obligatoire pour tous les moteurs : traiter les demandes exploitables avec les informations disponibles, puis proposer les compléments facultatifs. Les contrôles de sécurité, de consentement et de droits restent impératifs.

## Core principle

Le projet se construit dans un ordre stable et guidé par les dépendances. Toute évolution doit respecter les frontières d'architecture et les références canoniques.

## Canonical references

- [Architecture](../../ARCHITECTURE.md)
- [Quality](../operations/QUALITY.md)
- [Préparation de release et décision Go/No-Go](../operations/release-readiness.md)
- [Reproducibility](../operations/REPRODUCIBILITY.md)
- [Langage de design](./design-language.md)
- [Standards UX et accessibilité — Phase 2](./phase-2-ux-standards.md)
- [Adaptation PWA et capacités des plateformes](./pwa-platform-adaptation.md)
- [Référentiel produit des moteurs conversationnels](./conversational-engines-product-reference.md)

Le document historique `docs/operations/GO_NO_GO.md` reste conservé pour traçabilité et figure parmi les candidats à comparer avant toute proposition de retrait.

## Legacy sources merged here

Les fichiers historiques restent des sources de traçabilité et ne sont pas supprimés sans validation technique et autorisation explicite. Voir la [cartographie de migration documentaire](../reference/documentation-migration-map.md) et la [liste des suppressions proposées](../reference/proposed-document-removals.md).
