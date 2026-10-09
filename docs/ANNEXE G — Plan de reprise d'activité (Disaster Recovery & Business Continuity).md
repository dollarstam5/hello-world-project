BUILD-SUPABASE.md

ANNEXE G — Plan de reprise d'activité (Disaster

Recovery & Business Continuity)

Version : V1

Statut : Référentiel officiel de continuité et de reprise d'activité de Vitala

1. Objectif

Cette annexe définit la stratégie officielle de continuité et de reprise d'activité de Vitala.

Elle vise à :

•

limiter les interruptions de service ;

•

protéger les données ;

•

restaurer rapidement les systèmes ;

•

réduire l'impact des incidents ;

•

assurer la continuité des activités critiques.

2. Principes directeurs

Le plan repose sur les principes suivants :

•

Continuité de service

•

Préparation

•

Documentation

•

Tests réguliers

•

Amélioration continue

•

Priorisation des services critiques

La reprise d'activité fait partie intégrante de l'architecture de Vitala.

3. Scénarios couverts

Le plan doit couvrir notamment :

•

panne du serveur VPS ;

•

indisponibilité de PostgreSQL ;

•

corruption de la base de données ;

1

•

perte du stockage ;

•

erreur humaine ;

•

suppression accidentelle de données ;

•

déploiement défectueux ;

•

panne réseau ;

•

incident de sécurité ;

•

compromission d'un compte administrateur.

Chaque scénario doit disposer d'une procédure documentée.

4. Classification des incidents

Les incidents sont classés selon leur gravité :

•

Niveau 1 : incident mineur ;

•

Niveau 2 : incident important ;

•

Niveau 3 : incident critique ;

•

Niveau 4 : catastrophe majeure.

Chaque niveau entraîne une procédure adaptée.

5. Objectifs de reprise

Pour chaque service critique, définir :

•

le RTO (Recovery Time Objective) : délai maximal de restauration ;

•

le RPO (Recovery Point Objective) : perte maximale de données acceptable.

Ces objectifs doivent être validés en fonction des exigences métier de Vitala.

6. Procédure de reprise

Chaque procédure de reprise doit préciser :

•

les prérequis ;

•

les responsables ;

•

les étapes techniques ;

•

les vérifications ;

•

les critères de validation avant remise en service.

Les procédures doivent être reproductibles.

2

7. Sauvegardes

Le plan de reprise s'appuie sur :

•

les sauvegardes PostgreSQL ;

•

les sauvegardes des fichiers ;

•

les sauvegardes des configurations ;

•

les migrations versionnées.

Les sauvegardes doivent être régulièrement vérifiées.

8. Continuité des services

Les services critiques doivent être priorisés lors de la reprise.

Exemples :

•

authentification ;

•

synchronisation ;

•

accès aux données utilisateur ;

•

notifications essentielles.

Les fonctionnalités secondaires peuvent être rétablies dans un second temps.

9. Communication

En cas d'incident majeur, une procédure de communication doit préciser :

•

les personnes à informer ;

•

les canaux utilisés ;

•

les informations à transmettre ;

•

la fréquence des mises à jour.

Toutes les communications doivent être tracées.

10. Tests du plan

Le plan de reprise doit être testé régulièrement.

Les exercices doivent vérifier :

•

les procédures ;

•

les sauvegardes ;

•

les délais de reprise ;

3

•

la coordination des intervenants.

Les résultats doivent être documentés.

11. Analyse post-incident

Après chaque incident majeur, une revue doit être réalisée afin de :

•

identifier les causes ;

•

mesurer les impacts ;

•

documenter les actions correctives ;

•

améliorer le plan de reprise.

L'objectif est de renforcer continuellement la résilience de la plateforme.

12. Références croisées

Le plan de reprise est lié à :

•

BUILD-SUPABASE ;

•

BUILD-SECURITY ;

•

BUILD-DEPLOYMENT ;

•

BUILD-VPS ;

•

Performance Budget ;

•

Documentation d'exploitation.

13. Critères de conformité

Le plan est conforme lorsque :

•

les procédures sont documentées ;

•

les sauvegardes sont opérationnelles ;

•

les tests sont réalisés ;

•

les objectifs RTO/RPO sont respectés ;

•

les équipes connaissent les procédures.

14. Évolution

Le plan doit être révisé :

•

après un incident majeur ;

•

lors d'une évolution importante de l'infrastructure ;

•

lors de l'ajout d'un nouveau service critique ;

4

•

au minimum une fois par an.

Les révisions doivent être versionnées.

15. Conclusion

Le Plan de reprise d'activité garantit que Vitala est capable de faire face aux incidents techniques

majeurs tout en préservant la continuité de ses services essentiels.

Il constitue le référentiel officiel permettant de protéger les données, de restaurer rapidement les

systèmes et d'assurer une exploitation fiable et durable de la plateforme.

5

