# Documentation

Ce répertoire suit une structure canonique pour la documentation active.

## Structure active

- [foundation/](./foundation/README.md) — architecture, conventions et langage de design
- [product/](./product/README.md) — vision, personas, parcours, navigation, confiance et expérience
- [architecture/](./architecture/README.md) — architecture système, front-end, backend, base de données, synchronisation et identité numérique
- [api/](./api/README.md) — contrats et références API
- [modules/](./modules/README.md) — documents de domaines métier classés par moteur
- [database/](./database/README.md) — modèle de données, schéma PostgreSQL, grants et politiques RLS
- [engineering/ai/](./engineering/ai/README.md) — gouvernance et règles d'ingénierie IA
- [operations/](./operations/README.md) — déploiement, performance, problèmes techniques et release
- [reference/](./reference/README.md) — glossaire et références complémentaires

## Références canoniques

- [Langage de design Vitalis](./foundation/design-language.md)
- [Vitalis Experience System](./product/experience-system.md)
- [Navigation produit Vitalis](./product/navigation.md)
- [Système de communication humaine V1 à V3](./product/communication-system-v1-v3.md)
- [Gouvernance complète de la communication V1 à V3](./product/communication-system-governance-v1-v3.md) — exigences, limites, sécurité, maturité, IA future, tests et critères de livraison.
- [Catalogue de communication V1](./product/communication-catalog-v1.md)
- [Architecture du système de communication](./architecture/communication-system-architecture.md)
- [Centre de communication — règles produit V1](./product/communication-center-v1.md)
- [Langage humain et communication Vitalis](./product/communication-language.md)
- [Espaces personnels et gestion indépendante des moteurs — V1](./product/personal-and-engine-management-v1.md)
- [Parcours utilisateurs](./product/user-journeys.md)
- [Présentation des pages moteurs — V1](./product/engine-page-preview-standard-v1.md)
- [Parcours du profil — V1](./product/profile-experience-v1.md)
- [Architecture front-end et expérience](./architecture/frontend-experience.md)
- [Standards de navigation mobile Android, iOS et Web](./architecture/mobile-navigation-standards.md)
- [Architecture backend et API](./architecture/backend-api.md)
- [Architecture de la base de données](./architecture/database-architecture.md)
- [Synchronisation, mode hors ligne et temps réel](./architecture/synchronization-offline-realtime.md)
- [Architecture IA et intégrations](./architecture/ai-architecture-integrations.md)
- [API de synchronisation](./api/sync-api.md)
- [Dictionnaire de données](./database/data-dictionary.md)
- [Schéma, grants et politiques RLS](./database/schema-design.md)
- [Personas Vitalis](./product/personas.md)
- [Niveaux de confiance](./product/trust-levels.md)
- [Domaine Trust et Trust Engine](./architecture/trust-domain.md)
- [Modèle d'identité numérique unifiée](./architecture/Evolution du modèle de données - Unified Digital Identity (UDI).md)
- [Performance PWA](./operations/performance-pwa.md)
- [Registre des problèmes de performance](./operations/performance-issues.md)
- [Registre des problèmes techniques](./operations/technical-issues.md)
- [Préparation de release et décision Go/No-Go](./operations/release-readiness.md)
- [Reprise après incident et continuité d'activité](./operations/disaster-recovery.md)

## Annexes de contrôle

- [Matrice de conformité de la navigation Vitalis V1](./reference/navigation-compliance-matrix.md) — critères, constats sur PR #37, preuves et tests d'acceptation.

## Migration documentaire

- [Cartographie des références canoniques et historiques](./reference/documentation-migration-map.md) — correspondances par domaine et vérifications restantes.
- [Réconciliation fichier par fichier du Lot 12](./reference/lot12-file-reconciliation.md) — dépendances, contrôles disponibles, corrections proposées et limites de validation de la PR #25.
- [Audit préliminaire de couverture du contenu](./reference/documentation-content-coverage.md) — premiers constats de comparaison ; aucun retrait n'est autorisé par cet audit.
- [Candidats aux suppressions documentaires](./reference/proposed-document-removals.md) — propositions uniquement, en attente d'approbation explicite.

## Archives

Les sources historiques sont répertoriées dans [l'index des archives](./archive/README.md). Être répertorié ne signifie pas qu'un fichier a été déplacé, supprimé ou que sa migration est approuvée.

## Convention

- Les nouvelles modifications doivent viser les références canoniques.
- Les sources historiques ne sont ni supprimées ni déplacées avant validation technique et autorisation explicite.
- Une candidature au retrait ne constitue pas une autorisation de suppression.
- Éviter de créer de nouveaux fragments numérotés lorsque le contenu peut être intégré à une référence canonique.
- Une référence documentaire décrit l'intention et les règles ; elle ne certifie pas à elle seule l'implémentation courante.
