BUILD-SUPABASE.md

ANNEXE D — Catalogue officiel des objets

programmables PostgreSQL

Version : V1

Statut : Référentiel officiel des objets programmables PostgreSQL de Vitala

1. Objectif

Cette annexe définit les standards de documentation et de gestion des objets programmables

PostgreSQL utilisés dans Vitala.

Elle centralise les éléments suivants :

•

Fonctions SQL

•

Procédures SQL

•

Triggers

•

Vues

•

Materialized Views

Son objectif est de garantir une architecture cohérente, documentée et maintenable.

2. Principes directeurs

Tous les objets programmables doivent respecter les principes suivants :

•

Single Responsibility

•

Simplicité

•

Lisibilité

•

Documentation obligatoire

•

Performance

•

Sécurité

Chaque objet possède une responsabilité clairement définie.

3. Catalogue des fonctions SQL

Chaque fonction doit être documentée selon le modèle suivant.

1

Informations générales

•

Nom

•
•

Domaine
Description

•

Responsable

Signature

•

Paramètres

•

Types

•

Valeur retournée

Responsabilité

Décrire précisément :

•

son objectif ;

•

les traitements réalisés ;

•

les limites.

Une fonction ne doit réaliser qu'une seule responsabilité technique.

Dépendances

Identifier :

•

tables utilisées ;

•

vues ;

•

autres fonctions ;

•

triggers ;

•

APIs concernées.

Sécurité

Préciser :

•

SECURITY INVOKER

•

SECURITY DEFINER

•

permissions nécessaires.

2

Tests

Documenter :

•

scénarios normaux ;

•

cas d'erreur ;

•

résultats attendus.

4. Catalogue des procédures SQL

Chaque procédure doit préciser :

•

son objectif ;

•

les paramètres ;

•

les opérations réalisées ;

•

les transactions éventuelles ;

•

les dépendances ;

•

les performances.

Les procédures sont réservées aux traitements techniques nécessitant plusieurs opérations.

5. Catalogue des triggers

Chaque trigger doit documenter :

•

nom ;

•

•

•

table concernée ;
événement ( INSERT ,  UPDATE ,  DELETE ) ;
moment ( BEFORE ,  AFTER ,  INSTEAD OF ) ;

•

fonction appelée ;

•

objectif technique.

Les triggers ne doivent jamais contenir de logique métier complexe.

6. Catalogue des vues

Chaque vue doit préciser :

•

nom ;

•

objectif ;

•

tables sources ;

•

colonnes exposées ;

•

utilisateurs concernés ;

•

performances attendues.

3

Les vues servent à simplifier l'accès aux données, sans contourner les règles de sécurité.

7. Catalogue des Materialized Views

Pour chaque vue matérialisée, documenter :

•

objectif ;

•

fréquence de rafraîchissement ;

•

dépendances ;

•

impact sur les performances ;

•

stratégie de mise à jour.

Leur utilisation doit être justifiée par un gain mesurable.

8. Standards de développement

Tous les objets programmables doivent :

•

être nommés selon les conventions officielles ;

•

être documentés ;

•

être testés ;

•

être versionnés via des migrations ;

•

respecter les Domaines métier.

9. Cas interdits

Les pratiques suivantes sont interdites :

•

implémenter une logique métier complexe dans une fonction ou un trigger ;

•

contourner les politiques RLS ;

•

créer des dépendances circulaires ;

•

dupliquer des traitements existants.

10. Maintenance

Toute création, modification ou suppression d'un objet programmable doit :

•

être réalisée via une migration ;

•

être documentée ;

•

être testée ;

•

être validée avant la mise en production.

4

11. Références croisées

Chaque objet doit être relié à :

•

son Domaine ;

•

les tables concernées ;

•

les API Contracts ;

•

BUILD-SUPABASE ;

•

BUILD-SECURITY ;

•

les migrations associées.

12. Critères de conformité

Un objet programmable est conforme lorsqu'il :

•

possède une responsabilité unique ;

•

est documenté ;

•

est testé ;

•

respecte les standards de sécurité ;

•

respecte les conventions de Vitala.

13. Évolution du catalogue

Le catalogue est un document vivant.

Toute évolution des fonctions, procédures, triggers ou vues doit être immédiatement répercutée dans

cette annexe.

14. Conclusion

Le Catalogue officiel des objets programmables PostgreSQL constitue la référence de tous les

traitements techniques exécutés au niveau de la base de données.

Il garantit que chaque objet est documenté, sécurisé, performant et cohérent avec l'architecture globale

de Vitala.

5

