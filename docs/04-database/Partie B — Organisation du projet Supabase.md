BUILD-SUPABASE.md

Partie B — Organisation du projet Supabase

Version : V1

Statut : Référence officielle d'organisation des environnements Supabase

1. Objectif

Cette section définit l'organisation officielle des projets Supabase utilisés par Vitala.

Elle garantit :

•

une séparation claire des environnements ;

•

des déploiements sécurisés ;

•

une gestion maîtrisée des configurations ;

•

une reproductibilité de l'infrastructure.

2. Principes directeurs

L'organisation des environnements repose sur les principes suivants :

•

Isolation complète des environnements

•

Configuration reproductible

•

Séparation des responsabilités

•

Sécurité par défaut

•

Déploiement progressif

•

Traçabilité des changements

Aucun environnement ne doit être utilisé à plusieurs fins.

3. Environnements officiels

Vitala utilise quatre environnements distincts.

3.1 Local

Objectif :

Développement individuel sur la machine du développeur.

1

Utilisation :

•

développement quotidien ;

•

tests rapides ;

•

validation locale ;

•

expérimentation.

Caractéristiques :

•

base de données locale ;

•

stockage local ;

•

Edge Functions locales ;

•

données de démonstration ou de test.

Aucune donnée réelle ne doit y être utilisée.

3.2 Développement (Development)

Objectif :

Intégration des développements de l'équipe.

Utilisation :

•

validation des nouvelles fonctionnalités ;

•

tests d'intégration ;

•

vérification des migrations.

Les données utilisées doivent être fictives ou anonymisées.

3.3 Préproduction (Staging)

Objectif :

Reproduire fidèlement la production avant chaque déploiement.

Utilisation :

•

validation finale ;

•

tests de charge ;

•

tests de sécurité ;

•

validation fonctionnelle.

La configuration doit être aussi proche que possible de la production.

2

3.4 Production

Objectif :

Héberger la plateforme utilisée par les utilisateurs.

Exigences :

•

haute disponibilité ;

•

sécurité maximale ;

•

supervision continue ;

•

sauvegardes automatiques ;

•

accès strictement contrôlé.

Aucun test expérimental ne doit être réalisé sur cet environnement.

4. Isolation des environnements

Chaque environnement possède :

•

son propre projet Supabase ;

•

sa propre base de données ;

•

son propre stockage ;

•

ses propres Edge Functions ;

•

ses propres secrets ;

•

ses propres clés API.

Le partage de ressources entre environnements est interdit.

5. Configuration

Chaque environnement possède une configuration indépendante.

Les paramètres suivants doivent être spécifiques à chaque environnement :

•

URL Supabase ;

•

clés publiques ;

•

clés de service ;

•

secrets ;

•

buckets ;

•

configuration Realtime ;

•

Edge Functions.

Aucune valeur de production ne doit être utilisée en développement.

3

6. Variables d'environnement

Toutes les informations sensibles doivent être fournies via des variables d'environnement.

Exemples :

•

URL Supabase

•

Clé publique (Anon Key)

•

Clé de service (Service Role Key)

•

JWT Secret

•

URL des Edge Functions

•

Clés des services tiers

Les secrets ne doivent jamais être codés en dur dans le code source.

7. Gestion des secrets

Les secrets doivent :

•

être stockés dans un gestionnaire sécurisé ;

•

être différents pour chaque environnement ;

•

être renouvelés périodiquement ;

•

être accessibles uniquement aux services autorisés.

Les secrets ne doivent jamais être partagés dans des dépôts Git ou des documents publics.

8. Convention de nommage

Les projets Supabase doivent suivre une convention claire.

Exemple :

•

vitala-local

•

vitala-dev

•

vitala-staging

•

vitala-prod

Les ressources internes (buckets, fonctions, etc.) doivent également suivre des conventions cohérentes

définies dans les sections suivantes du document.

4

9. Gestion des accès

Les accès aux environnements doivent être limités selon les rôles :

•

Développeur

•

Testeur

•

Architecte

•

DevOps

•

Administrateur

Les permissions doivent respecter le principe du moindre privilège.

10. Déploiement entre environnements

Le passage d'un environnement au suivant suit obligatoirement le flux :

Local

↓

Développement

↓

Préproduction

↓

Production

Le déploiement direct de Local vers Production est interdit.

11. Journalisation

Toutes les opérations importantes doivent être tracées :

•

déploiements ;

•

migrations ;

•

changements de configuration ;

•

modifications des secrets ;

•

accès administratifs.

Les journaux doivent être conservés conformément à la politique de rétention du projet.

5

12. Sauvegarde des configurations

Les éléments suivants doivent être versionnés ou documentés :

•

migrations ;

•

configuration des Edge Functions ;

•

politiques RLS ;

•

schéma de base de données ;

•

configuration des buckets.

Les secrets restent exclus du versionnage.

13. Contrôles avant mise en production

Avant tout déploiement en production, vérifier :

•

migrations appliquées ;

•

tests réussis ;

•

politiques RLS validées ;

•

Edge Functions déployées ;

•

variables d'environnement configurées ;

•

sauvegardes disponibles ;

•

monitoring opérationnel.

14. Critères de conformité

L'organisation Supabase est conforme lorsque :

•

les environnements sont totalement isolés ;

•

les configurations sont reproductibles ;

•

les secrets sont protégés ;

•

les déploiements suivent le processus officiel ;

•

les contrôles de sécurité sont respectés.

15. Conclusion

L'organisation des projets Supabase constitue une base essentielle de la stabilité et de la sécurité de

Vitala.

Le respect de cette structure garantit des développements fiables, des déploiements maîtrisés et une

exploitation durable de la plateforme.

6

