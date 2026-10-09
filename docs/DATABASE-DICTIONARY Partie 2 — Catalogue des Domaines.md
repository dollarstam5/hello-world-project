DATABASE-DICTIONARY.md

Partie 2 — Catalogue des Domaines

Version : V1

Statut : Cartographie officielle des domaines de données de Vitala

1. Objectif

Cette partie présente l'organisation fonctionnelle des données de Vitala.

Les tables PostgreSQL sont regroupées par domaines métier afin de :

•

faciliter la compréhension du modèle de données ;

•

limiter le couplage entre fonctionnalités ;

•

améliorer la maintenabilité ;

•

simplifier les évolutions futures.

Chaque domaine possède une responsabilité clairement définie.

2. Principes d'organisation

Les domaines suivent les principes du Domain-Driven Design (DDD).

Chaque domaine :

•

possède un périmètre fonctionnel propre ;

•

gère ses propres entités ;

•

expose uniquement les données nécessaires aux autres domaines ;

•

limite les dépendances directes.

Les échanges entre domaines doivent rester maîtrisés et documentés.

3. Catalogue des domaines

3.1 Core

Rôle

Fournit les éléments fondamentaux communs à l'ensemble de la plateforme.

1

Responsabilités

•

paramètres globaux ;

•

constantes ;

•

références communes ;

•

configuration technique.

Relations principales

Tous les domaines dépendent de Core.

3.2 Identity

Rôle

Gestion des utilisateurs et de leur identité.

Responsabilités

•

comptes utilisateurs ;

•

authentification ;

•

profils ;

•

appareils autorisés ;

•

sessions.

Relations principales

•

UDI

•

Trust

•

Notification

•

Audit

3.3 UDI

Rôle

Gestion de l'identité numérique universelle de l'utilisateur.

Responsabilités

•

identifiants uniques ;

•

informations de confiance ;

•

liens entre les différentes identités.

Relations principales

•

Identity

•

Trust

•

Mission

2

3.4 Flash

Rôle

Gestion des Flashs et de leurs contenus.

Responsabilités

•

création ;

•

édition ;

•

archivage ;

•

brouillons ;

•

partage.

Relations principales

•

Media

•
•

Sync
Social

•

Audit

3.5 Mission

Rôle

Gestion des missions et de leur cycle de vie.

Responsabilités

•

création ;

•

affectation ;

•

suivi ;

•

historique.

Relations principales

•

Identity

•

Notification

•

Trust

3.6 Social

Rôle

Gestion des interactions entre utilisateurs.

3

Responsabilités

•

relations ;

•

abonnements ;

•

réactions ;

•

commentaires ;

•

partages.

Relations principales

•

Identity

•

Flash

•

Notification

3.7 Trust

Rôle

Calcul et gestion des indicateurs de confiance.

Responsabilités

•

scores ;

•

réputation ;

•

validations ;

•

historiques.

Relations principales

•

Identity

•

UDI

•

Mission

3.8 Media

Rôle

Gestion des fichiers multimédias.

Responsabilités

•

images ;

•

vidéos ;

•

documents ;

•

métadonnées.

Relations principales

•

Flash

4

•

Mission

•

Sync

3.9 Notification

Rôle

Gestion des notifications et messages système.

Responsabilités

•

notifications push ;

•

notifications internes ;

•

état de lecture.

Relations principales

•

Identity

•

Mission

•

Social

3.10 Sync

Rôle

Gestion de la synchronisation entre les appareils et le serveur.

Responsabilités

•

synchronisation ;

•

conflits ;

•

file d'attente ;

•

reprise.

Relations principales

•

Flash

•

Media

•

Identity

3.11 Intelligence

Rôle

Gestion des traitements intelligents de la plateforme.

5

Responsabilités

•

recommandations ;

•

analyses ;

•

classifications ;

•

assistance.

Relations principales

•

Flash

•

Mission

•

Trust

3.12 Administration

Rôle

Gestion des fonctions d'administration.

Responsabilités

•

utilisateurs administrateurs ;

•

permissions ;

•

supervision ;

•

outils internes.

Relations principales

Tous les domaines.

3.13 Audit

Rôle

Traçabilité des opérations réalisées dans la plateforme.

Responsabilités

•

journaux ;

•

événements ;

•

historiques ;

•

conformité.

Relations principales

Tous les domaines.

6

3.14 Configuration

Rôle

Gestion des paramètres fonctionnels.

Responsabilités

•

préférences ;

•

paramètres ;

•

options.

Relations principales

Core Administration

3.15 Infrastructure

Rôle

Gestion des composants techniques.

Responsabilités

•

files techniques ;

•

tâches internes ;

•

supervision ;

•

maintenance.

Relations principales

Tous les domaines techniques.

4. Relations entre domaines

Les domaines communiquent selon les principes suivants :

•

faible couplage ;

•

responsabilités clairement définies ;

•

échanges documentés ;

•

absence de dépendances circulaires.

Les interactions complexes doivent être décrites dans le Domain Model et les API Contracts.

7

5. Évolution des domaines

Toute création, modification ou suppression d'un domaine doit entraîner :

•

une mise à jour du Domain Model ;

•

une mise à jour du présent dictionnaire ;

•

une révision des API Contracts si nécessaire.

L'organisation des domaines doit rester cohérente avec l'évolution de la plateforme.

6. Conclusion

Le Catalogue des Domaines constitue la cartographie officielle de l'organisation des données de Vitala.

Il fournit une vision globale de la structure fonctionnelle de la base de données et sert de point d'entrée

avant la consultation détaillée des tables dans la Partie 3.

8

