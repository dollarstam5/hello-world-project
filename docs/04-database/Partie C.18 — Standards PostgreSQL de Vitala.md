BUILD-SUPABASE.md

Partie C.18 — Standards PostgreSQL de Vitala

Version : V1

Statut : Standard officiel PostgreSQL de Vitala

1. Objectif

Cette section regroupe les standards officiels qui régissent la conception, le développement, l'évolution

et l'exploitation de PostgreSQL dans Vitala.

Elle constitue la référence unique à respecter pour toute intervention sur la base de données.

2. Principes fondamentaux

Toute conception PostgreSQL dans Vitala respecte les principes suivants :

•

Database as Code

•

Domain First

•

Security by Design

•

Performance by Design

•

Observability by Design

•

Least Privilege

•

Simplicité

•

Évolutivité

•

Documentation systématique

Ces principes prévalent sur toute préférence individuelle.

3. Standards de modélisation

Toute table doit :

•

représenter une entité métier ou technique clairement identifiée ;

•

•

posséder une clé primaire en UUID ;
inclure les colonnes d'audit standard lorsque pertinentes ( created_at ,  updated_at , etc.) ;

•

respecter les conventions de nommage officielles.

Les tables redondantes ou ambiguës sont interdites.

1

4. Standards des relations

Les relations doivent :

•

utiliser des clés étrangères ;

•

préserver l'intégrité référentielle ;

•

limiter le couplage entre domaines ;

•

être documentées.

Les relations plusieurs-à-plusieurs utilisent obligatoirement une table de liaison.

5. Standards de sécurité

Toutes les tables métier doivent :

•

activer la Row Level Security (RLS) ;

•

définir des politiques d'accès explicites ;

•

appliquer le principe du moindre privilège.

Aucune donnée sensible ne doit être exposée sans protection adaptée.

6. Standards des performances

Les requêtes doivent :

•

sélectionner uniquement les colonnes nécessaires ;

•

utiliser les index disponibles ;

•

limiter les lectures inutiles ;

•

être optimisées avant la mise en production.

Les performances sont validées à partir de mesures et non de suppositions.

7. Standards des fonctions

Les fonctions SQL sont réservées aux traitements techniques.

Toute logique métier appartient aux Domaines.

Chaque fonction possède une responsabilité unique, une documentation et des tests adaptés.

2

8. Standards des triggers

Les triggers sont limités à des opérations techniques telles que :

•

audit ;

•

journalisation ;

•

mise à jour de métadonnées ;

•

maintien de la cohérence technique.

Les décisions métier sont interdites dans les triggers.

9. Standards des migrations

Toute évolution du schéma :

•

passe par une migration versionnée ;

•

est testée ;

•

est documentée ;

•

est conservée dans le dépôt Git.

Les modifications manuelles en production sont interdites.

10. Standards des sauvegardes

Les sauvegardes doivent :

•

être planifiées ;

•

être sécurisées ;

•

être conservées selon une politique de rétention ;

•

faire l'objet de tests réguliers de restauration.

Une sauvegarde non testée n'est pas considérée comme fiable.

11. Standards du monitoring

La plateforme doit surveiller en permanence :

•

les performances ;

•

les erreurs ;

•

les ressources ;

•

les transactions ;

•

les index ;

•

les alertes critiques.

Les incidents doivent être détectés avant qu'ils n'impactent les utilisateurs.

3

12. Standards de documentation

Chaque élément PostgreSQL doit être documenté :

•

tables ;

•

colonnes ;

•

relations ;

•

index ;

•

vues ;

•

fonctions ;

•

triggers ;

•

politiques RLS ;

•

migrations.

La documentation évolue en même temps que le schéma.

13. Standards d'évolution

Toute évolution doit respecter le cycle officiel :

1.

Mise à jour du Domain Model.

2.

Mise à jour de la documentation.

3.

Création de la migration.

4.

Validation des API Contracts.

5.

Tests automatisés.

6.

Déploiement progressif.

7.

Mise à jour de la documentation finale.

Aucune étape ne doit être ignorée.

14. Règles absolues

Les règles suivantes sont obligatoires :

•

aucune logique métier dans PostgreSQL ;

•

aucune table métier sans RLS ;

•

aucune modification du schéma hors migration ;

•

aucun secret stocké dans les tables métier ;

•

aucune optimisation sans mesure ;

•

aucune migration non testée ;

•

aucune documentation obsolète.

4

15. Erreurs à éviter

Les pratiques suivantes sont interdites :

•

utiliser  SELECT *  en production ;

•

créer des index sans justification ;

•

écrire des triggers complexes ;

•

multiplier les transactions longues ;

•

contourner les politiques RLS ;

•

dupliquer les données sans nécessité ;

•

modifier directement la base en production.

16. Gouvernance

Les standards PostgreSQL sont obligatoires pour :

•

les développeurs Backend ;

•

les développeurs Full Stack ;

•

les administrateurs de la base de données ;

•

les contributeurs externes ;

•

les intelligences artificielles générant du code.

Toute exception doit être validée par l'architecte de la plateforme.

17. Critères de conformité

Une implémentation PostgreSQL est conforme lorsqu'elle :

•

respecte les standards définis dans BUILD-SUPABASE.md ;

•

applique les principes de sécurité ;

•

satisfait aux exigences de performance ;

•

suit les conventions de développement ;

•

est documentée et testée.

18. Conclusion

Les Standards PostgreSQL de Vitala constituent le référentiel officiel de conception et d'exploitation de

la base de données.

Ils garantissent une architecture cohérente, sécurisée, performante, évolutive et maintenable. Toute

évolution de PostgreSQL doit s'y conformer afin de préserver la qualité globale de la plateforme.

5

