BUILD-SUPABASE.md

Partie C.3 — Conventions de création des tables

Version : V1

Statut : Référence officielle de création des tables PostgreSQL

1. Objectif

Cette section définit les règles obligatoires de création des tables PostgreSQL de Vitala.

Toutes les tables doivent respecter ces conventions afin de garantir :

•

une structure homogène ;

•

une maintenance simplifiée ;

•

une meilleure lisibilité ;

•

une compatibilité avec les outils de développement et les intelligences artificielles.

Aucune table ne peut être créée en dehors de ces règles.

2. Principes directeurs

Toute table doit respecter les principes suivants :

•

Domain First

•

Single Responsibility

•

Security by Design

•

Audit by Design

•

Performance by Design

•

Documentation First

Chaque table représente une responsabilité métier clairement identifiée.

3. Convention de nommage

Les noms des tables doivent :

•

•

être en minuscules ;
utiliser le  snake_case  ;

•

être explicites ;

•

être au pluriel lorsque cela représente une collection.

1

Exemples :

•

•

•

•

•

•

•

udi_profiles

flash_drafts

missions

trust_scores

media_files

sync_operations

audit_logs

Les abréviations ambiguës sont interdites.

4. Clé primaire

Chaque table doit posséder une clé primaire.

Règles :

•

type  UUID  ;

•

générée automatiquement ;

•

immuable ;

•

unique.

Convention :

id UUID PRIMARY KEY

Aucune clé primaire numérique auto-incrémentée ne doit être utilisée pour les données métier.

5. Colonnes obligatoires

Sauf justification documentée, chaque table doit inclure les colonnes suivantes :

•

•

•

id

created_at

updated_at

Selon les besoins du domaine, peuvent également être ajoutées :

•

•

•

•

created_by

updated_by

deleted_at  (si suppression logique)
version  (gestion de concurrence)

Ces champs doivent conserver la même signification dans tous les domaines.

2

6. Colonnes métier

Les colonnes métier doivent :

•

avoir un nom explicite ;

•

représenter une seule information ;

•

utiliser le type de données le plus adapté ;

•

éviter les redondances.

Les colonnes génériques telles que  data ,  value  ou  info  sont interdites sauf justification

exceptionnelle.

7. Clés étrangères

Les relations entre tables doivent être matérialisées par des clés étrangères.

Les contraintes doivent garantir l'intégrité référentielle.

Les suppressions en cascade doivent être utilisées avec prudence et être documentées.

8. Valeurs par défaut

Toute valeur par défaut doit être explicitement définie.

Exemples :

•

date de création ;

•

statut initial ;

•

indicateur booléen.

Les valeurs implicites non documentées sont interdites.

9. Champs d'audit

Les tables contenant des données sensibles ou critiques doivent intégrer des champs permettant

d'assurer la traçabilité des opérations.

Les mécanismes d'audit doivent rester cohérents sur l'ensemble de la plateforme.

10. Suppression logique

Lorsque le domaine le nécessite, la suppression logique est privilégiée.

3

Convention :

•

•

colonne  deleted_at
éventuellement  deleted_by

Les données supprimées logiquement ne doivent plus être visibles pour les utilisateurs non autorisés.

11. Versionnement

Les tables susceptibles de subir des modifications concurrentes peuvent intégrer une colonne de

version.

Ce mécanisme facilite :

•

la synchronisation ;

•

la résolution des conflits ;

•

l'optimistic locking.

12. Contraintes

Chaque table doit définir les contraintes nécessaires pour garantir :

•

l'unicité ;

•

la cohérence ;

•

la validité des données.

Les contraintes doivent être documentées dans les migrations.

13. Documentation

Chaque table doit être accompagnée d'une documentation précisant :

•

son objectif ;

•

son domaine propriétaire ;

•

ses principales colonnes ;

•

ses relations ;

•

les règles particulières.

4

14. Évolution

Toute modification d'une table doit :

•

passer par une migration ;

•

préserver l'intégrité des données ;

•

maintenir la compatibilité lorsque cela est possible ;

•

mettre à jour la documentation.

15. Critères de conformité

Une table est conforme lorsque :

•

son nom respecte les conventions ;

•

elle possède une clé primaire UUID ;

•

les colonnes obligatoires sont présentes ;

•

les contraintes sont définies ;

•

les relations sont documentées ;

•

les migrations sont versionnées ;

•

la documentation est à jour.

16. Conclusion

Les conventions de création des tables garantissent une base de données homogène, lisible et

évolutive.

Le respect de ces règles est obligatoire pour toutes les tables présentes et futures de Vitala.

5

