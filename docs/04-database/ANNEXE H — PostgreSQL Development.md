BUILD-SUPABASE.md
ANNEXE H — PostgreSQL Development
Cookbook
Version : V1
Statut : Bibliothèque officielle des modèles PostgreSQL de Vitala
1. Objectif
Cette annexe constitue la bibliothèque officielle des modèles de développement PostgreSQL utilisés
dans Vitala.
Elle fournit des patrons de conception réutilisables afin de garantir :
• une architecture homogène ;
• un développement rapide ;
• une qualité constante ;
• une maintenance facilitée ;
• une génération de code cohérente par les intelligences artificielles.
Les modèles présentés dans cette annexe servent de référence pour toute nouvelle implémentation.
2. Principes du Cookbook
Tous les modèles doivent respecter les principes suivants :
• réutilisabilité ;
• simplicité ;
• lisibilité ;
• cohérence avec les standards Vitala ;
• sécurité ;
• performance ;
• documentation.
Les modèles sont des références officielles et ne doivent être adaptés qu'en cas de nécessité
documentée.
1

3. Catalogue des modèles
Le Cookbook couvre notamment les modèles suivants :
Schéma
• création d'une table ;
• création d'une table de liaison ;
• ajout de colonnes ;
• suppression de colonnes ;
• renommage d'objets.
Contraintes
• clé primaire ;
• clé étrangère ;
| • contraintes  | UNIQUE  ; |     |
| -------------- | --------- | --- |
| • contraintes  | CHECK  ;  |     |
• valeurs par défaut.
Index
• index simple ;
• index composite ;
• index GIN ;
• index BRIN ;
• bonnes pratiques d'indexation.
Sécurité
• activation de la RLS ;
| • politique       | SELECT  ;        |     |
| ----------------- | ---------------- | --- |
| • politique       | INSERT  ;        |     |
| • politique       | UPDATE  ;        |     |
| • politique       | DELETE  ;        |     |
| • utilisation de  | SECURITY DEFINER | .   |
Fonctions SQL
• fonction simple ;
• fonction retournant un ensemble ;
• fonction avec paramètres ;
• gestion des erreurs.
2

Procédures SQL
• procédure transactionnelle ;
• procédure de maintenance ;
• procédure d'administration.
Triggers
• trigger BEFORE ;
• trigger AFTER ;
• audit automatique ;
• mise à jour des métadonnées.
Vues
• vue métier ;
• vue technique ;
• vue de reporting ;
• vue matérialisée.
Transactions
• transaction simple ;
• transaction multi-tables ;
• transaction multi-domaines ;
• compensation ;
• Saga.
Migrations
• création de migration ;
• modification du schéma ;
• migration compatible avec les versions précédentes ;
• stratégie de retour arrière.
Monitoring
• journalisation ;
• collecte de métriques ;
• alertes ;
• supervision.
3

4. Utilisation des modèles
Avant de créer un nouvel objet PostgreSQL, le développeur ou l'IA doit :
1. vérifier si un modèle officiel existe ;
2. réutiliser ce modèle lorsque cela est possible ;
3. documenter toute adaptation significative.
La duplication de modèles divergents est interdite.
5. Compatibilité
Tous les modèles doivent être compatibles avec :
• BUILD-SUPABASE ;
• BUILD-SECURITY ;
• BUILD-ARCHITECTURE ;
• Domain Model ;
• API Contracts ;
• Deployment Guide.
6. Maintenance
Le Cookbook est évolutif.
Chaque nouveau modèle validé doit :
• être documenté ;
• être testé ;
• être approuvé ;
• être ajouté à cette annexe.
Les modèles obsolètes doivent être retirés ou archivés.
7. Références croisées
Chaque modèle doit indiquer :
• les documents associés ;
• les cas d'utilisation ;
• les dépendances éventuelles ;
• les limitations connues.
4

8. Critères de conformité
Un modèle est conforme lorsqu'il :
• respecte les standards Vitala ;
• est documenté ;
• est testé ;
• est réutilisable ;
• est maintenu.
9. Évolution
Le Cookbook est enrichi au fil de l'évolution de la plateforme.
Les nouveaux modèles doivent être ajoutés uniquement après validation afin de préserver la cohérence
de l'ensemble.
10. Conclusion
Le PostgreSQL Development Cookbook constitue la bibliothèque officielle des modèles de
développement PostgreSQL de Vitala.
Il permet aux développeurs et aux intelligences artificielles de produire un code homogène, sécurisé,
performant et conforme aux standards de la plateforme, tout en accélérant les développements futurs.
5