# Architecture baseline

Ce document est un point d'orientation vers les références architecturales canoniques. Il ne définit pas une seconde architecture parallèle.

## Références canoniques

- [Gouvernance architecturale du dépôt](../../ARCHITECTURE.md) — structure de `src/`, responsabilités, direction des dépendances, politique de migration et gates de validation.
- [Architecture système](../architecture/system-architecture.md) — vue d'ensemble de la plateforme et de ses frontières techniques.
- [Architecture front-end et expérience](../architecture/frontend-experience.md) — organisation effective de l'application React/TanStack, shell, bootstrap et composition des expériences.
- [Index architecture](../architecture/README.md) — catalogue des références techniques.
- [Bible du projet](../reference/PROJECT_BIBLE.md) — principes structurants et contraintes produit/techniques.

## Règle de lecture

En cas de divergence, `ARCHITECTURE.md` à la racine du dépôt est la source normative pour les couches, leurs responsabilités et les dépendances autorisées. Les documents spécialisés détaillent son application sans la contredire.

Les chemins historiques et documents archivés sont des sources de traçabilité, pas des propriétaires canoniques par défaut. Leur contenu doit être comparé au code actuel avant toute migration ou suppression.

La présence d'une structure, d'un export ou d'une description documentaire ne prouve pas qu'une fonctionnalité est complète ou validée à l'exécution.
