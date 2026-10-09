BUILD-SUPABASE.md
ANNEXE E — Performance Budget PostgreSQL
Version : V1
Statut : Référentiel officiel des objectifs de performance PostgreSQL de Vitala
1. Objectif
Cette annexe définit les objectifs de performance (Performance Budget) applicables à PostgreSQL dans
Vitala.
Elle permet de :
• fixer des objectifs mesurables ;
• garantir une expérience utilisateur fluide ;
• détecter les régressions ;
• guider les optimisations ;
• harmoniser les critères de validation.
Les budgets de performance constituent des objectifs de conception et de validation.
2. Principes directeurs
Le Performance Budget repose sur les principes suivants :
• Performance by Design
• Mesure avant optimisation
• Simplicité
• Évolutivité
• Amélioration continue
Toute optimisation doit être justifiée par des mesures objectives.
3. Temps de réponse cibles
Les objectifs suivants servent de référence.
Opération Objectif cible
Lecture simple ( SELECT ) < 50 ms
1

| Opération              |          | Objectif cible |
| ---------------------- | -------- | -------------- |
| Lecture avec jointures |          | < 150 ms       |
| Recherche complexe     |          | < 200 ms       |
| Insertion (            | INSERT ) | < 100 ms       |
UPDATE
| Mise à jour (               | )        | < 100 ms |
| --------------------------- | -------- | -------- |
| Suppression (               | DELETE ) | < 100 ms |
| Transaction métier standard |          | < 300 ms |
Ces valeurs peuvent être ajustées selon les contraintes métier documentées.
4. Temps de réponse des fonctionnalités
À titre indicatif :
Fonctionnalité Objectif
Chargement du profil utilisateur < 300 ms
Ouverture du tableau de bord < 500 ms
Chargement du fil d'activité < 500 ms
Recherche globale < 300 ms
Synchronisation des données < 500 ms
Chargement des médias (hors téléchargement) < 300 ms
Ces budgets concernent la partie PostgreSQL et les traitements associés.
5. Volume de données
L'architecture doit rester performante avec :
• plusieurs millions d'enregistrements ;
• plusieurs centaines de milliers d'utilisateurs ;
• des tables de grande taille ;
• une croissance continue des données.
Les optimisations doivent anticiper cette évolution.
2

6. Requêtes
Les requêtes doivent :
• utiliser les index appropriés ;
• limiter les lectures inutiles ;
• éviter les SELECT * en production ;
• être validées avec EXPLAIN ANALYZE lorsqu'elles sont critiques.
Les requêtes lentes doivent être identifiées et optimisées.
7. Transactions
Les transactions doivent :
• rester courtes ;
• limiter les verrous ;
• éviter les traitements longs ;
• préserver la concurrence entre utilisateurs.
Les traitements asynchrones doivent être privilégiés lorsque nécessaire.
8. Index
Les index doivent :
• améliorer les performances des requêtes critiques ;
• rester limités aux besoins réels ;
• être régulièrement réévalués.
Chaque index doit démontrer un bénéfice mesurable.
9. Monitoring
Les indicateurs suivants doivent être suivis :
• temps moyen des requêtes ;
• requêtes lentes ;
• utilisation des index ;
• taux d'erreur ;
• consommation CPU ;
• mémoire ;
• stockage ;
• connexions actives.
3

Ces métriques permettent de vérifier le respect du Performance Budget.
10. Tests de performance
Les tests doivent couvrir :
• les scénarios nominaux ;
• les pics de charge ;
• les volumes importants ;
• les traitements critiques.
Les résultats doivent être documentés et comparés aux objectifs.
11. Régressions
Toute régression de performance doit :
• être détectée ;
• être analysée ;
• être corrigée avant la mise en production si elle dépasse les seuils acceptables.
Les performances font partie des critères de qualité.
12. Références croisées
Le Performance Budget est lié à :
• BUILD-SUPABASE ;
• BUILD-ARCHITECTURE ;
• BUILD-SECURITY ;
• Deployment Guide ;
• Domain Model ;
• API Contracts.
13. Critères de conformité
Une implémentation PostgreSQL est conforme lorsque :
• les objectifs de performance sont atteints ;
• les tests sont validés ;
• les régressions sont maîtrisées ;
• les métriques restent dans les seuils définis.
4

14. Révision du budget
Le Performance Budget doit être réévalué :
• lors de l'ajout de nouvelles fonctionnalités majeures ;
• lors d'une évolution importante du trafic ;
• après une modification significative de l'architecture ;
• à intervalles réguliers dans le cadre des revues techniques.
Toute évolution des objectifs doit être documentée.
15. Conclusion
Le Performance Budget PostgreSQL constitue la référence officielle des exigences de performance de
Vitala.
Il permet de concevoir, développer et faire évoluer la plateforme avec des objectifs mesurables,
garantissant une expérience utilisateur fluide, une architecture évolutive et une qualité constante.
5