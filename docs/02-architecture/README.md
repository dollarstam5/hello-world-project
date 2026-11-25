# Références architecturales

Ce dossier est le point d'entrée canonique de la documentation d'architecture du projet.

## Gouvernance et architecture générale

- [Gouvernance architecturale](./architecture-governance.md) — propriété des responsabilités, graphe de dépendances, règles de migration et checklist obligatoire.
- [Architecture système](./system-architecture.md)
- [Architecture front-end et expérience](./frontend-experience.md)

## Références techniques

- [Standards de navigation mobile Android, iOS and Web](./mobile-navigation-standards.md)
- [Architecture backend et API](./backend-api.md)
- [Architecture de la base de données](./database-architecture.md)
- [Synchronisation, mode hors ligne et temps réel](./synchronization-offline-realtime.md)
- [Architecture du système de communication](./communication-system-architecture.md)
- [Architecture IA et intégrations](./ai-architecture-integrations.md)
- [Modèle d'identité numérique unifiée](./identity-model.md)
- [Domaine Trust et Trust Engine](./trust-domain.md)

## Références produit et capacités

- [Gouvernance des données de démonstration — V1](./demo-data-governance.md)
- [Historique Scan — V1](./scan-history-v1.md) — historique local minimal, données exclues et règles de suppression.
- [Adaptateur SQL des fixtures de démonstration — V1](./demo-sql-fixture-adapter-v1.md)
- [Aperçus publics de profil — V1](./public-profile-preview-v1.md)

## Sources historiques conservées

Les anciens documents restent conservés pour traçabilité et ne remplacent pas les références canoniques de ce dossier :

- `docs/18-VITALA-ARCHITECTURE-V1 Partie 1.md`
- `docs/18-VITALA-ARCHITECTURE-V1 Partie 2.md`
- `docs/18-VITALA-ARCHITECTURE-V1 Partie 3.md`
- `docs/Database Architecture.md`

Les sources historiques UDI et Trust restent également conservées dans `docs/` jusqu'à validation et autorisation explicite.

Toute nouvelle modification doit viser les références canoniques ci-dessus et respecter la propriété des données par domaine. Une référence documentaire n'est pas une preuve que le composant décrit est déjà implémenté.
