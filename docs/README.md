# Documentation

Ce répertoire suit une structure canonique pour la documentation active.

## Structure active

- [`00-foundation/`](./00-foundation/README.md) — architecture, conventions et langage de design
- [`01-product/`](./01-product/README.md) — vision, personas, parcours, confiance et expérience
- [`02-architecture/`](./02-architecture/README.md) — architecture système, front-end, backend, base de données, synchronisation et identité numérique
- [`03-api/`](./03-api/README.md) — contrats et références API
- [`03-engines/`](./03-engines/README.md) — documents de domaines métier classés par moteur
- [`04-database/`](./04-database/README.md) — modèle de données, schéma PostgreSQL, grants et politiques RLS
- [`05-ai/`](./05-ai/README.md) — gouvernance et règles d'ingénierie IA
- [`06-operations/`](./06-operations/README.md) — déploiement, performance, problèmes techniques et release
- [`07-annexes/`](./07-annexes/README.md) — glossaire et références complémentaires

## Références canoniques

- [Langage de design Vitala](./00-foundation/design-language.md)
- [Vitala Experience System](./01-product/experience-system.md)
- [Architecture front-end et expérience](./02-architecture/frontend-experience.md)
- [Architecture backend et API](./02-architecture/backend-api.md)
- [Architecture de la base de données](./02-architecture/database-architecture.md)
- [Synchronisation, mode hors ligne et temps réel](./02-architecture/synchronization-offline-realtime.md)
- [Architecture IA et intégrations](./02-architecture/ai-architecture-integrations.md)
- [API de synchronisation](./03-api/sync-api.md)
- [Dictionnaire de données](./04-database/data-dictionary.md)
- [Schéma, grants et politiques RLS](./04-database/schema-design.md)
- [Personas Vitala](./01-product/personas.md)
- [Parcours utilisateurs](./01-product/user-journeys.md)
- [Niveaux de confiance](./01-product/trust-levels.md)
- [Domaine Trust et Trust Engine](./02-architecture/trust-domain.md)
- [Modèle d'identité numérique unifiée](./02-architecture/identity-model.md)
- [Performance PWA](./06-operations/performance-pwa.md)
- [Registre des problèmes de performance](./06-operations/performance-issues.md)
- [Registre des problèmes techniques](./06-operations/technical-issues.md)
- [Préparation de release et décision Go/No-Go](./06-operations/release-readiness.md)
- [Reprise après incident et continuité d'activité](./06-operations/disaster-recovery.md)

## Migration documentaire

- [Cartographie des références canoniques et historiques](./documentation-migration-map.md) — correspondances par domaine et vérifications restantes.
- [Audit préliminaire de couverture du contenu](./documentation-content-coverage.md) — premiers constats de comparaison ; aucun retrait n'est autorisé par cet audit.
- [Candidats aux suppressions documentaires](./proposed-document-removals.md) — propositions uniquement, en attente d'approbation explicite.

## Archives

Les sources historiques sont répertoriées dans [l'index des archives](./archive/README.md). Être répertorié ne signifie pas qu'un fichier a été déplacé, supprimé ou que sa migration est approuvée.

## Convention

- Les nouvelles modifications doivent viser les références canoniques.
- Les sources historiques ne sont ni supprimées ni déplacées avant validation technique et autorisation explicite.
- Une candidature au retrait ne constitue pas une autorisation de suppression.
- Éviter de créer de nouveaux fragments numérotés lorsque le contenu peut être intégré à une référence canonique.
- Une référence documentaire décrit l'intention et les règles ; elle ne certifie pas à elle seule l'implémentation courante.
