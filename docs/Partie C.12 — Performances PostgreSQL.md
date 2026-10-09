BUILD-SUPABASE.md

Partie C.12 — Performances PostgreSQL

Version : V1

Statut : Référence officielle des performances PostgreSQL

1. Objectif

Cette section définit les règles officielles permettant de garantir les performances de PostgreSQL dans

Vitala.

Les objectifs sont :

•

garantir des temps de réponse faibles ;

•

préserver la scalabilité ;

•

limiter la consommation des ressources ;

•

maintenir une expérience utilisateur fluide.

Les performances doivent être prises en compte dès la conception.

2. Principes directeurs

Toutes les optimisations suivent les principes suivants :

•

Performance by Design

•

Simplicité

•

Évolutivité

•

Mesure avant optimisation

•

Documentation obligatoire

Toute optimisation doit être justifiée par des mesures.

3. Conception des requêtes

Les requêtes doivent :

•

sélectionner uniquement les colonnes nécessaires ;

•

limiter le nombre de lignes retournées ;

•

éviter les requêtes inutiles ;

•

utiliser les index disponibles.

1

L'utilisation de  SELECT *  est interdite dans le code de production.

4. Pagination

Toutes les listes susceptibles de contenir un grand nombre d'enregistrements doivent être paginées.

Les APIs doivent privilégier :

•

•

pagination par curseur (cursor-based) lorsque possible ;
pagination par limite ( LIMIT ) et décalage ( OFFSET ) uniquement lorsque adaptée.

Les tailles de page doivent être contrôlées.

5. Jointures

Les jointures doivent :

•

être limitées aux besoins réels ;

•

utiliser des clés indexées ;

•

éviter les chaînes de jointures profondes.

Les requêtes complexes doivent être revues avant leur mise en production.

6. Accès aux données

Les lectures doivent privilégier :

•

les index ;

•

les vues adaptées ;

•

les projections ciblées.

Les scans complets de tables ( Sequential Scan ) doivent être limités aux cas justifiés.

7. Transactions

Les transactions doivent :

•

être courtes ;

•

contenir uniquement les opérations nécessaires ;

•

éviter les blocages prolongés.

Les transactions longues sont interdites sauf justification exceptionnelle.

2

8. Gestion des écritures

Les opérations d'écriture doivent :

•

être regroupées lorsque cela est pertinent ;

•

limiter les mises à jour inutiles ;

•

préserver les performances globales.

Les traitements massifs doivent être planifiés et supervisés.

9. Analyse des requêtes

Les requêtes critiques doivent être analysées avec :

•

•

EXPLAIN

EXPLAIN ANALYZE

Les plans d'exécution doivent être revus avant toute optimisation importante.

10. Surveillance

Les performances doivent être surveillées en continu.

Les indicateurs comprennent notamment :

•

temps moyen des requêtes ;

•

requêtes lentes ;

•

consommation CPU ;

•

consommation mémoire ;

•

utilisation des index ;

•

verrouillages.

Les alertes doivent être configurées pour détecter toute dégradation significative.

11. Maintenance

Une maintenance régulière doit être réalisée afin de :

•

analyser les statistiques ;

•

supprimer les index inutilisés ;

•

optimiser les index existants ;

•

maintenir les performances dans le temps.

3

12. Évolutivité

L'architecture PostgreSQL doit rester performante malgré :

•

l'augmentation du nombre d'utilisateurs ;

•

la croissance du volume de données ;

•

l'ajout de nouveaux domaines ;

•

l'augmentation du trafic.

Les choix techniques doivent anticiper cette évolution.

13. Documentation

Toute optimisation significative doit être documentée avec :

•

le problème identifié ;

•

les mesures réalisées ;

•

la solution retenue ;

•

les résultats obtenus.

14. Tests de performance

Avant une mise en production majeure, des tests doivent vérifier :

•

les temps de réponse ;

•

les performances sous charge ;

•

le comportement lors de pics d'activité ;

•

la stabilité des requêtes critiques.

Les résultats doivent être archivés.

15. Critères de conformité

Les performances sont conformes lorsque :

•

les requêtes critiques respectent les objectifs définis ;

•

les index sont utilisés efficacement ;

•

les transactions restent courtes ;

•

les temps de réponse sont surveillés ;

•

les optimisations sont documentées.

4

16. Conclusion

Les performances PostgreSQL constituent un élément essentiel de la qualité de Vitala.

Une approche fondée sur la conception, la mesure et l'amélioration continue garantit une plateforme

rapide, fiable et capable d'évoluer avec la croissance du projet.

5

