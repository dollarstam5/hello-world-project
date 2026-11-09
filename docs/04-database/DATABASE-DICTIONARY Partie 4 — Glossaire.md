DATABASE-DICTIONARY.md

Partie 4 — Glossaire

Version : V1

Statut : Référentiel officiel des concepts métier de Vitala

1. Objectif

Le glossaire définit les principaux concepts fonctionnels, techniques et métiers utilisés dans Vitala.

Son objectif est de garantir que tous les intervenants — développeurs, architectes, testeurs,

administrateurs et intelligences artificielles — utilisent un vocabulaire commun et interprètent les

termes de manière identique.

Les définitions du présent glossaire font autorité pour l'ensemble de la documentation du projet.

2. Principes

Chaque définition doit être :

•

unique ;

•

claire ;

•

concise ;

•

cohérente avec le Domain Model ;

•

indépendante de son implémentation technique.

Les termes doivent décrire un concept métier avant de décrire une structure technique.

3. Concepts métier

Utilisateur

Personne disposant d'un compte sur la plateforme Vitala et pouvant accéder aux fonctionnalités selon

ses droits.

Profil

Ensemble des informations publiques et privées associées à un utilisateur.

1

UDI (Universal Digital Identity)

Identité numérique unique permettant d'identifier un utilisateur de manière fiable au sein de la

plateforme.

Flash

Contenu créé par un utilisateur représentant une information, une idée, une publication ou un élément

partageable.

Brouillon (Draft)

Version non publiée d'un contenu pouvant être modifiée avant sa publication.

Mission

Activité, tâche ou objectif pouvant être créé, suivi et réalisé au sein de Vitala.

Média

Fichier associé à un contenu (image, vidéo, document, audio ou autre ressource numérique).

Notification

Message système ou événement transmis à un utilisateur afin de l'informer d'une action ou d'un

changement.

Synchronisation

Processus assurant la cohérence des données entre les appareils des utilisateurs et le serveur.

Conflit de synchronisation

Situation où plusieurs modifications incompatibles sont détectées lors d'une synchronisation.

2

Trust Score

Indicateur représentant le niveau de confiance calculé pour un utilisateur, un contenu ou une

interaction selon les règles métier de Vitala.

Domaine

Ensemble cohérent de fonctionnalités et de données partageant une responsabilité métier commune.

Audit

Enregistrement des événements permettant d'assurer la traçabilité des actions réalisées sur la

plateforme.

4. Concepts techniques

Table

Structure PostgreSQL contenant un ensemble homogène d'enregistrements.

Colonne

Champ décrivant une propriété des données stockées dans une table.

Clé primaire

Identifiant unique d'un enregistrement.

Clé étrangère

Référence reliant un enregistrement à une autre table.

Index

Structure optimisant les performances des recherches dans PostgreSQL.

3

Politique RLS

Règle PostgreSQL définissant les droits d'accès aux lignes d'une table.

Trigger

Traitement exécuté automatiquement lors d'un événement affectant une table.

Fonction SQL

Bloc de logique exécuté dans PostgreSQL et pouvant retourner une valeur ou un ensemble de données.

Vue

Objet PostgreSQL présentant une représentation logique de données issues d'une ou plusieurs tables.

Migration

Évolution versionnée de la structure de la base de données.

5. Maintenance du glossaire

Tout nouveau concept introduit dans Vitala doit être ajouté au présent glossaire.

Les définitions doivent rester cohérentes avec :

•

le VPS ;

•

le Domain Model ;

•

les API Contracts ;

•

BUILD-SUPABASE.

6. Conclusion

Le glossaire constitue la référence terminologique officielle de Vitala.

Il garantit un langage commun entre les équipes, facilite la compréhension de la documentation et

limite les ambiguïtés lors du développement, des revues d'architecture et de la génération de code par

les intelligences artificielles.

4

