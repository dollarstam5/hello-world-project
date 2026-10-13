BUILD-SUPABASE.md

Partie C.11 — Extensions PostgreSQL

Version : V1

Statut : Référence officielle des extensions PostgreSQL autorisées

1. Objectif

Cette section définit les règles officielles concernant l'utilisation des extensions PostgreSQL dans Vitala.

Les extensions permettent d'ajouter des fonctionnalités au moteur PostgreSQL tout en conservant une

architecture maîtrisée.

Seules les extensions officiellement approuvées peuvent être utilisées.

2. Principes directeurs

L'utilisation des extensions repose sur les principes suivants :

•

Minimalisme

•

Sécurité

•

Performance

•

Compatibilité avec Supabase

•

Documentation obligatoire

Une extension n'est installée que lorsqu'un besoin réel est identifié.

3. Extensions officiellement autorisées

Les extensions suivantes sont approuvées pour Vitala.

3.1 pgcrypto

Utilisation :

•

génération de UUID ;

•

fonctions cryptographiques.

Statut :

1

Obligatoire.

3.2 uuid-ossp

Utilisation :

•

génération d'identifiants UUID lorsque nécessaire.

Statut :

Autorisée si le projet en a besoin.

3.3 pg_trgm

Utilisation :

•

recherche approximative ;

•

amélioration du moteur de recherche.

Cas d'usage :

•

recherche utilisateur ;

•

recherche Flash ;

•

recherche Mission.

3.4 unaccent

Utilisation :

•

suppression des accents lors des recherches textuelles.

Permet une meilleure expérience utilisateur dans les recherches multilingues.

3.5 pg_stat_statements

Utilisation :

•

analyse des performances ;

•

identification des requêtes lentes ;

•

optimisation continue.

Recommandée pour les environnements de développement, préproduction et production.

2

4. Extensions conditionnelles

Certaines extensions pourront être activées uniquement si un besoin est validé.

Exemples :

•

PostGIS (géolocalisation avancée)

•

pgvector (recherche vectorielle / IA)

•

pg_cron (planification de tâches)

Leur activation nécessite une validation architecturale et une documentation spécifique.

5. Extensions interdites

Toute extension :

•

non compatible avec Supabase ;

•

non maintenue ;

•

présentant un risque de sécurité ;

•

sans justification fonctionnelle ou technique ;

est interdite.

6. Installation

Toute nouvelle extension doit :

•

être installée via une migration ;

•

être versionnée ;

•

être documentée ;

•

être testée dans les environnements de développement et de préproduction avant la production.

7. Sécurité

Chaque extension doit être évaluée selon :

•

son niveau de maintenance ;

•

sa compatibilité avec Supabase ;

•

ses impacts sur les performances ;

•

ses implications en matière de sécurité.

Les permissions associées doivent respecter le principe du moindre privilège.

3

8. Performances

Avant d'adopter une extension, une analyse doit vérifier :

•

le gain attendu ;

•

le coût en ressources ;

•

les impacts sur les requêtes existantes.

Une extension ne doit jamais être installée uniquement par convenance.

9. Documentation

Chaque extension utilisée doit être documentée avec :

•

son objectif ;

•

sa version ;

•

les domaines concernés ;

•

les dépendances éventuelles ;

•

les impacts techniques connus.

10. Évolution

Toute activation, mise à jour ou suppression d'une extension doit :

•

être réalisée via une migration ;

•

être validée sur les environnements de test ;

•

être accompagnée d'une analyse d'impact ;

•

mettre à jour la documentation.

11. Compatibilité

Les extensions doivent rester compatibles avec :

•

la version de PostgreSQL utilisée par Supabase ;

•

les API Contracts ;

•

le Build Blueprint ;

•

les politiques de sécurité de Vitala.

4

12. Critères de conformité

Une extension est conforme lorsqu'elle :

•

répond à un besoin identifié ;

•

est officiellement autorisée ;

•

est documentée ;

•

est testée ;

•

ne compromet ni la sécurité ni les performances.

13. Conclusion

Les extensions PostgreSQL permettent d'enrichir les capacités techniques de Vitala tout en conservant

une architecture maîtrisée.

Leur utilisation doit rester limitée, justifiée et documentée afin de garantir la stabilité, la sécurité et la

pérennité de la plateforme.

5

