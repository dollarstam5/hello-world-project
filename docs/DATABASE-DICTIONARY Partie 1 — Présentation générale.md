DATABASE-DICTIONARY.md

Partie 1 — Présentation générale

Version : V1

Statut : Référentiel officiel des données de Vitala

1. Objectif

Le présent document constitue le dictionnaire officiel de la base de données de Vitala.

Il centralise l'ensemble des informations relatives aux objets de données utilisés par la plateforme et

constitue la source de référence pour leur compréhension, leur évolution et leur maintenance.

Ses principaux objectifs sont :

•

fournir une documentation unique de la base de données ;

•

garantir une compréhension commune des modèles de données ;

•

assurer la cohérence entre les Domaines, les API Contracts et PostgreSQL ;

•

faciliter le développement, les tests, les audits et la maintenance ;

•

servir de référence aux développeurs, aux administrateurs de bases de données et aux

intelligences artificielles.

Ce document fait autorité pour toute question relative aux structures de données de Vitala.

2. Périmètre

Le dictionnaire couvre l'ensemble des objets de données utilisés par la plateforme, notamment :

•

les tables PostgreSQL ;

•

les colonnes ;

•

les clés primaires et étrangères ;

•

les contraintes ;

•

les relations ;

•

les index ;

•

les politiques Row Level Security (RLS) ;

•

les vues ;

•

les fonctions SQL ;

•

les triggers ;

•

les dépendances fonctionnelles.

Les détails opérationnels des migrations, des performances ou des politiques RLS sont documentés

dans leurs référentiels spécialisés.

1

3. Public concerné

Ce document est destiné à :

•

l'équipe Backend ;

•

l'équipe Frontend ;

•

l'équipe Mobile ;

•

les administrateurs PostgreSQL ;

•

les DevOps ;

•

les testeurs QA ;

•

les architectes logiciels ;

•

les intelligences artificielles générant ou analysant du code.

Toute personne intervenant sur les données de Vitala doit s'y référer.

4. Organisation du document

Le dictionnaire est structuré en cinq grandes parties :

Partie 1 — Présentation générale

Décrit les objectifs, l'organisation et les conventions du document.

Partie 2 — Catalogue des Domaines

Présente les différents domaines fonctionnels et les tables qui leur sont associées.

Partie 3 — Dictionnaire des tables

Contient une fiche détaillée pour chaque table PostgreSQL de Vitala.

Partie 4 — Glossaire

Décrit les principaux concepts métier utilisés dans la plateforme.

Partie 5 — Annexes

Regroupe les conventions techniques, les références et les informations complémentaires.

5. Source de vérité

Le présent dictionnaire constitue la référence officielle concernant les structures de données.

2

En cas de divergence entre plusieurs documents :

1.

le VPS définit la vision fonctionnelle ;

2.

le Domain Model définit les entités métier ;

3.

les API Contracts définissent les échanges de données ;

4.

le présent dictionnaire définit l'implémentation des données dans PostgreSQL.

Toute incohérence identifiée doit être corrigée dans l'ensemble des documents concernés.

6. Cycle de vie

Le dictionnaire est un document vivant.

Toute création, modification ou suppression d'un objet de données doit entraîner une mise à jour du

présent document.

Aucune évolution de la base de données ne doit être considérée comme terminée tant que le

dictionnaire n'a pas été mis à jour.

7. Conventions générales

Les conventions suivantes s'appliquent à l'ensemble du dictionnaire :

•

•

noms de tables en  snake_case  ;
noms de colonnes en  snake_case  ;

•

identifiants stables et explicites ;

•

descriptions métier claires ;

•

terminologie cohérente avec le Domain Model ;

•

documentation systématique des relations et contraintes.

Les conventions détaillées sont définies dans BUILD-SUPABASE.md.

8. Références documentaires

Le dictionnaire est directement lié aux documents suivants :

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

Ces documents doivent rester cohérents avec le présent dictionnaire.

3

9. Gouvernance

Le dictionnaire est placé sous la responsabilité de l'architecte logiciel de Vitala.

Toute modification importante doit être :

•

documentée ;

•

validée ;

•

versionnée ;

•

communiquée aux équipes concernées.

Les évolutions doivent préserver la cohérence globale du modèle de données.

10. Conclusion

Le DATABASE-DICTIONARY constitue le référentiel officiel des données de Vitala.

Il garantit une compréhension commune de la base de données, facilite les développements et assure

la cohérence entre les différents composants de la plateforme tout au long de son évolution.

4

