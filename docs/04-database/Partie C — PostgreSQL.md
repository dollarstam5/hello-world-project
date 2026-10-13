BUILD-SUPABASE.md

Partie C — PostgreSQL

Version : V1

Statut : Référence officielle de la base de données PostgreSQL de Vitala

Objectif

Cette partie définit les règles officielles de conception, d'organisation et d'exploitation de PostgreSQL

dans Vitala.

Elle complète BUILD-DATABASE.md en apportant les détails techniques spécifiques à PostgreSQL et à

son utilisation via Supabase.

Toutes les tables, vues, fonctions, index et mécanismes PostgreSQL doivent respecter cette partie.

Organisation de la Partie C

C.1 — Architecture PostgreSQL

Définit :

•

le rôle de PostgreSQL ;

•

sa place dans l'architecture ;

•

les principes de conception ;

•

la séparation entre les domaines métier et l'infrastructure.

C.2 — Organisation des schémas (Schemas)

Décrit :

•

les schémas utilisés ;

•

leur responsabilité ;

•

les règles de création ;

•

les conventions de nommage ;

•

les accès autorisés.

1

C.3 — Conventions de création des tables

Décrit :

•

les règles de nommage ;

•

les colonnes obligatoires ;

•

les identifiants ;

•

les clés primaires ;

•

les relations ;

•

les champs d'audit.

C.4 — Types de données

Normalise :

•

UUID

•

TEXT

•

VARCHAR

•

BOOLEAN

•

INTEGER

•

BIGINT

•

NUMERIC

•

DATE

•

TIMESTAMP

•

TIMESTAMPTZ

•

JSONB

•

ARRAY

•

ENUM

Détermine dans quels cas chaque type peut être utilisé.

C.5 — Contraintes

Décrit :

•

Primary Keys

•

Foreign Keys

•

Unique Constraints

•

Check Constraints

•

Not Null

•

Default Values

Toutes les contraintes officielles doivent être documentées.

2

C.6 — Relations entre tables

Décrit :

•

One-to-One

•

One-to-Many

•

Many-to-Many

•

Tables de liaison

•

Références inter-domaines

Cette section définit également les limites des dépendances entre domaines.

C.7 — Index

Décrit :

•

B-Tree

•

GIN

•

GiST

•

Index composites

•

Index partiels

•

Index JSONB

Définit les critères de création et d'optimisation.

C.8 — Vues (Views)

Décrit :

•

vues simples ;

•

vues matérialisées ;

•

projections de lecture ;

•

optimisation des requêtes.

Les vues ne doivent jamais remplacer la logique métier.

C.9 — Fonctions SQL

Décrit :

•

fonctions SQL ;

•

fonctions PL/pgSQL ;

•

paramètres ;

•

valeurs de retour ;

•

règles de sécurité.

Les fonctions métier restent limitées afin de préserver l'architecture Domain-Driven.

3

C.10 — Triggers

Décrit :

•

cas d'utilisation autorisés ;

•

audit ;

•

automatisation ;

•

synchronisation ;

•

restrictions.

Les triggers ne doivent jamais implémenter des règles métier complexes.

C.11 — Extensions PostgreSQL

Liste officielle des extensions autorisées.

Exemples :

•

pgcrypto

•

uuid-ossp

•

pg_trgm

•

unaccent

•

pg_stat_statements

Chaque extension doit être justifiée.

C.12 — Performances

Décrit :

•

optimisation ;

•

analyse des requêtes ;

•

statistiques ;

•

plans d'exécution ;

•

maintenance.

C.13 — Sécurité PostgreSQL

Décrit :

•

rôles ;

•

permissions ;

•

politiques RLS ;

•

chiffrement ;

•

isolation.

4

Complète les règles définies dans BUILD-SECURITY.

C.14 — Transactions

Décrit :

•

BEGIN

•

COMMIT

•

ROLLBACK

•

Isolation Levels

•

Atomicité

•

Cohérence

Les transactions doivent préserver l'intégrité des données.

C.15 — Migrations PostgreSQL

Décrit :

•

création ;

•

évolution ;

•

suppression ;

•

rollback ;

•

versionnement.

Complète BUILD-DATABASE.

C.16 — Sauvegarde et restauration

Décrit :

•

sauvegardes ;

•

restauration ;

•

tests de récupération ;

•

stratégie de rétention.

C.17 — Monitoring PostgreSQL

Décrit :

•

métriques ;

•

journaux ;

•

performances ;

•

alertes ;

•

observabilité.

5

C.18 — Checklist PostgreSQL

Avant toute mise en production :

•

contraintes validées ;

•

index validés ;

•

migrations validées ;

•

RLS validées ;

•

performances validées ;

•

sauvegardes disponibles ;

•

monitoring actif.

Conclusion

Cette Partie C constitue la référence officielle de l'utilisation de PostgreSQL dans Vitala.

Toutes les implémentations PostgreSQL doivent respecter cette structure afin de garantir une base de

données cohérente, performante, sécurisée et durable.

6

