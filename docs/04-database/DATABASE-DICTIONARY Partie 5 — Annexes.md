DATABASE-DICTIONARY.md

Partie 5 — Annexes

Version : V1

Statut : Référentiel des conventions et références techniques de Vitala

1. Objectif

Cette partie regroupe les éléments transversaux du dictionnaire de données.

Elle contient les conventions, standards et références techniques qui s'appliquent à l'ensemble de la

base de données Vitala.

Elle permet d'assurer :

•

la cohérence technique globale ;

•

la standardisation des pratiques ;

•

la compréhension uniforme des conventions ;

•

la stabilité du modèle de données.

2. Conventions de nommage

2.1 Tables

•

Format :  snake_case

•

Singulier ou pluriel selon le domaine métier, mais cohérent dans tout le système

•

•

Exemple :
users

•

•

user_profiles

flash_contents

2.2 Colonnes

•

Format :  snake_case

•

Noms explicites et non ambigus

•

Préférence pour les noms métier plutôt que techniques

Exemples :

•

created_at

1

•

•

•

updated_at

user_id

flash_id

2.3 Index

•

Format :  idx_<table>_<columns>

•

•

Exemple :
idx_users_email

•

idx_flash_created_at

2.4 Contraintes

•

•

•

Format :  ck_<table>_<rule>  pour CHECK
Format :  fk_<table>_<reference>  pour FOREIGN KEY
Format :  uq_<table>_<column>  pour UNIQUE

2.5 Fonctions

•

Format :  fn_<domain>_<action>

•

•

Exemple :
fn_flash_publish

•

fn_user_update_score

3. Types PostgreSQL standards

Les types suivants sont privilégiés dans Vitala :

•

•

•

•

•

•

•

•

uuid  → identifiants uniques

text  → chaînes longues

varchar(n)  → chaînes limitées

boolean  → vrai/faux

timestamp with time zone  → dates globales

jsonb  → données flexibles structurées

int / bigint  → valeurs numériques

numeric  → valeurs précises (scores, montants)

L'utilisation de  jsonb  doit être justifiée.

2

4. Abbréviations officielles

Les abréviations suivantes sont autorisées :

•

ID → Identifiant

•

RLS → Row Level Security

•

FK → Foreign Key

•

PK → Primary Key

•

UDI → Universal Digital Identity

•

MVP → Minimum Viable Product

•

API → Application Programming Interface

•

DB → Database

Toute autre abréviation doit être documentée avant utilisation.

5. Gestion des versions

Chaque évolution majeure de la base de données doit :

•

être versionnée ;

•

être documentée ;

•

être alignée avec les migrations PostgreSQL ;

•

être reflétée dans les documents BUILD correspondants.

Le versioning garantit la traçabilité des évolutions.

6. Références documentaires

Le dictionnaire de données est aligné avec les documents suivants :

•

VPS (Vision Produit & Système)

•

Domain Model

•

API Contracts

•

BUILD-ARCHITECTURE

•

BUILD-SUPABASE

•

BUILD-SECURITY

•

BUILD-DEPLOYMENT

En cas de conflit, le Domain Model et les BUILD prévalent sur les conventions techniques.

7. Bonnes pratiques globales

•

privilégier la lisibilité à la complexité ;

•

éviter les optimisations prématurées ;

3

•

documenter toute exception ;

•

maintenir une cohérence stricte entre les domaines ;

•

favoriser la simplicité dans la structure des données.

8. Maintenance du dictionnaire

Le DATABASE-DICTIONARY est un document vivant.

Toute modification du schéma de données doit entraîner :

•

une mise à jour du dictionnaire ;

•

une vérification de cohérence avec les BUILD ;

•

une validation architecturale si nécessaire.

9. Historique des modifications

Version

Date

Description

V1

2026

Création initiale du dictionnaire de données Vitala

10. Conclusion

Les annexes du DATABASE-DICTIONARY constituent le socle technique transversal de la base de

données de Vitala.

Elles garantissent l'uniformité des conventions, la stabilité du modèle et la cohérence entre tous les

composants de la plateforme.

Ce cadre assure que la base de données reste lisible, maintenable et évolutive dans le temps, même à

grande échelle.

4

