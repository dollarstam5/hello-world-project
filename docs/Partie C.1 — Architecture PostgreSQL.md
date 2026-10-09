BUILD-SUPABASE.md

Partie C.1 — Architecture PostgreSQL

Version : V1

Statut : Référence officielle de l'architecture PostgreSQL de Vitala

1. Objectif

Cette section définit l'architecture officielle de PostgreSQL au sein de Vitala.

Elle décrit :

•

le rôle de PostgreSQL ;

•

sa position dans l'architecture globale ;

•

ses responsabilités ;

•

ses limites ;

•

les principes qui gouvernent son utilisation.

Toutes les implémentations PostgreSQL doivent respecter cette architecture.

2. Vision

PostgreSQL constitue le moteur de persistance principal de Vitala.

Il est responsable du stockage, de l'intégrité et de la disponibilité des données.

Il ne représente pas la logique métier de la plateforme.

Les règles métier appartiennent exclusivement aux domaines définis dans le Domain Model.

3. Position dans l'architecture

PostgreSQL appartient à la couche Infrastructure.

L'architecture officielle est la suivante :

Utilisateur

↓

1

Interface utilisateur

↓

Application

↓

API

↓

Domaines métier

↓

Infrastructure

↓

PostgreSQL

Aucune couche supérieure ne doit contourner cette hiérarchie.

4. Responsabilités

PostgreSQL est responsable de :

•

stocker les données ;

•

garantir leur intégrité ;

•

appliquer les contraintes relationnelles ;

•

gérer les transactions ;

•

optimiser les requêtes ;

•

fournir des mécanismes de recherche ;

•

assurer la cohérence des écritures.

5. Responsabilités exclues

PostgreSQL ne doit jamais :

•

implémenter la logique métier des domaines ;

•

prendre des décisions fonctionnelles ;

•

remplacer les cas d'utilisation ;

•

piloter la navigation de l'application ;

•

remplacer les moteurs d'intelligence.

2

Les fonctions SQL et les triggers doivent rester limités à des besoins techniques clairement identifiés.

6. Organisation par domaines

La base de données reflète directement le Domain Model.

Chaque domaine possède :

•

ses tables ;

•

ses contraintes ;

•

ses index ;

•

ses politiques RLS ;

•

ses migrations.

Les domaines restent autonomes.

7. Source unique de vérité

PostgreSQL constitue la source officielle des données persistantes.

Les copies locales (cache, Local Workspace, Drafts) sont temporaires et ne remplacent jamais la base

centrale.

En cas de divergence, les règles de synchronisation définies dans BUILD-SYNC.md s'appliquent.

8. Intégrité des données

L'intégrité repose sur plusieurs mécanismes complémentaires :

•

clés primaires ;

•

clés étrangères ;

•

contraintes d'unicité ;

•

contraintes de validation ;

•

transactions ;

•

politiques RLS.

Aucune règle d'intégrité ne doit dépendre uniquement du client.

9. Transactions

Toutes les opérations critiques doivent être exécutées dans des transactions atomiques.

3

Les propriétés ACID doivent être respectées :

•

Atomicité

•

Cohérence

•

Isolation

•

Durabilité

Une transaction incomplète doit être annulée.

10. Séparation des responsabilités

Chaque couche possède une responsabilité précise :

•

PostgreSQL : persistance et intégrité.

•

Infrastructure : accès aux données.

•

Domaine : logique métier.

•

Application : orchestration.

•

Interface : expérience utilisateur.

Cette séparation est obligatoire.

11. Évolutivité

L'architecture PostgreSQL doit permettre :

•

l'ajout de nouveaux domaines ;

•

l'évolution des schémas ;

•

l'augmentation du volume de données ;

•

l'optimisation progressive des performances.

Les évolutions ne doivent pas casser les contrats existants.

12. Performances

La conception doit privilégier :

•

des requêtes simples ;

•

une indexation adaptée ;

•

des transactions courtes ;

•

des plans d'exécution optimisés ;

•

des lectures ciblées.

Les optimisations doivent préserver la lisibilité et la maintenabilité.

4

13. Sécurité

Toutes les données sont protégées par :

•

Authentification Supabase ;

•

Politiques RLS ;

•

Permissions PostgreSQL ;

•

Validation applicative ;

•

Journalisation.

La sécurité est appliquée à plusieurs niveaux afin d'assurer une défense en profondeur.

14. Auditabilité

Toute opération importante doit pouvoir être retracée.

Les mécanismes d'audit doivent permettre d'identifier :

•

l'utilisateur concerné ;

•

la date et l'heure ;

•

l'opération réalisée ;

•

les objets impactés.

Les journaux doivent être conservés conformément à la politique de rétention définie par Vitala.

15. Compatibilité avec le Build Blueprint

Cette architecture est cohérente avec :

•

BUILD-ARCHITECTURE.md

•

BUILD-DATABASE.md

•

BUILD-DOMAINS.md

•

BUILD-APIS.md

•

BUILD-SYNC.md

•

BUILD-INTELLIGENCE.md

Aucune implémentation PostgreSQL ne peut contredire ces documents.

16. Critères de conformité

L'architecture PostgreSQL est conforme lorsque :

•

les responsabilités sont clairement séparées ;

•

les domaines restent autonomes ;

5

•

l'intégrité des données est garantie ;

•

les transactions respectent les propriétés ACID ;

•

la sécurité est appliquée à tous les niveaux ;

•

les performances sont validées ;

•

la documentation est synchronisée.

17. Conclusion

PostgreSQL constitue le moteur de persistance officiel de Vitala.

Il assure la conservation, l'intégrité, la sécurité et la disponibilité des données, tout en restant

strictement séparé de la logique métier.

Cette architecture garantit une plateforme évolutive, fiable et conforme aux principes du Build

Blueprint.

6

