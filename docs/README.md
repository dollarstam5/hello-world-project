# Documentation

Ce répertoire suit une structure canonique pour la documentation active.

## Structure active

- [`00-foundation/`](./00-foundation/README.md) — architecture, conventions et langage de design
- [`01-product/`](./01-product/README.md) — vision, personas, parcours, confiance et expérience
- [`02-architecture/`](./02-architecture/README.md) — architecture système, front-end, identité numérique et domaine Trust
- [`03-api/`](./03-api/README.md) — contrats et références API
- [`04-database/`](./04-database/README.md) — schémas et standards de données
- [`05-ai/`](./05-ai/README.md) — gouvernance et règles d'ingénierie IA
- [`06-operations/`](./06-operations/README.md) — déploiement, performance et release
- [`07-annexes/`](./07-annexes/README.md) — glossaire et références complémentaires

## Références canoniques

- [Langage de design Vitala](./00-foundation/design-language.md)
- [Vitala Experience System](./01-product/experience-system.md)
- [Architecture front-end et expérience](./02-architecture/frontend-experience.md)
- [Personas Vitala](./01-product/personas.md)
- [Parcours utilisateurs](./01-product/user-journeys.md)
- [Niveaux de confiance](./01-product/trust-levels.md)
- [Domaine Trust et Trust Engine](./02-architecture/trust-domain.md)
- [Modèle d'identité numérique unifiée](./02-architecture/identity-model.md)
- [Performance PWA](./06-operations/performance-pwa.md)
- [Registre des problèmes de performance](./06-operations/performance-issues.md)

## Archives

Les sources historiques sont conservées dans [l'index des archives](./archive/README.md) pour assurer la traçabilité. Une entrée dans l'archive ne signifie pas que le fichier a été supprimé ni que la migration est approuvée.

## Convention

- Les nouvelles modifications doivent viser les références canoniques.
- Les sources historiques ne sont ni supprimées ni déplacées avant validation technique et autorisation explicite.
- Éviter de créer de nouveaux fragments numérotés lorsque le contenu peut être intégré à une référence canonique.
- Une référence documentaire décrit l'intention et les règles ; elle ne certifie pas à elle seule l'implémentation courante.
