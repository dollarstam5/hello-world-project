18-VITALA-DATABASE-V1.md

Partie 2A — Domaine Utilisateur

Domaine Utilisateur

Objectif

Le Domaine Utilisateur regroupe toutes les informations permettant d'identifier un utilisateur, de gérer

son profil, son niveau de confiance, ses préférences, ses appareils et ses sessions.

Il constitue le point d'entrée de tous les autres domaines de la plateforme.

Aucun moteur de Vitala ne manipule directement un utilisateur sans passer par ce domaine.

Principes du domaine

Le Domaine Utilisateur est construit autour de plusieurs principes :

•

une identité unique par utilisateur ;

•

une séparation entre l'authentification et le profil métier ;

•

une évolution progressive du niveau de confiance ;

•

une gestion indépendante des préférences utilisateur ;

•

une compatibilité avec plusieurs appareils et plusieurs clients (PWA aujourd'hui, Flutter demain).

Vue d'ensemble

Le Domaine Utilisateur est composé des tables suivantes :

•

User

•

Profile

•

Identity

•

Trust

•

Settings

•

Device

•

Session

Chaque table possède une responsabilité précise.

1

Table : User

Objectif

Représenter l'utilisateur technique de la plateforme.

Cette table constitue le point d'ancrage de toutes les relations.

Elle correspond au compte authentifié (géré principalement par Supabase Auth).

Responsabilités

Cette table gère :

•

l'identifiant unique ;

•
•

le fournisseur d'authentification ;
les informations techniques de connexion ;

•

les métadonnées de création du compte.

Elle ne stocke pas les informations publiques du profil.

Relations

User possède :

•

un Profile ;

•

une Identity ;

•

un Settings ;

•

plusieurs Devices ;

•

plusieurs Sessions.

Il est également lié aux missions, Flash, Radar, Veille, recommandations, messages et notifications via

les autres domaines.

Synchronisation

Cloud uniquement.

Les informations critiques d'authentification ne sont jamais modifiées hors ligne.

Sécurité

Accès extrêmement restreint.

2

Lecture et écriture contrôlées par Supabase Auth et les politiques RLS.

Cycle de vie

Création lors de l'inscription.

Mises à jour limitées.

Suppression logique selon les règles de conservation de la plateforme.

Table : Profile

Objectif

Contenir toutes les informations publiques et métier de l'utilisateur.

Le profil représente l'identité visible dans Vitala.

Responsabilités

Le profil contient notamment :

•

nom d'affichage ;

•

photo ;

•

biographie ;

•

localisation choisie ;

•

compétences ;

•

domaines d'activité ;

•

préférences de visibilité.

Le profil ne contient aucune donnée d'authentification.

Relations

Un Profile appartient à un User.

Il est utilisé par :

•

Flash ;

•

Scan ;

•

Radar ;

•

Veille ;

•

Recommendation ;

•

Conversations.

3

Synchronisation

Hybride.

Les informations sont disponibles hors ligne et synchronisées automatiquement.

Sécurité

Le propriétaire peut modifier son profil.

Les autres utilisateurs ne voient que les informations autorisées.

Cycle de vie

Évolutif.

Le profil est enrichi progressivement tout au long de la vie du compte.

Table : Identity

Objectif

Gérer les éléments de vérification d'identité.

Cette table est indépendante du profil afin de protéger les données sensibles.

Responsabilités

Elle regroupe notamment :

•

vérifications effectuées ;

•

pièces justificatives validées ;

•

statut de vérification ;

•

historique des validations.

Synchronisation

Cloud uniquement.

4

Sécurité

Très sensible.

Accès strictement limité au propriétaire et aux traitements autorisés.

Table : Trust

Objectif

Suivre l'évolution du niveau de confiance de l'utilisateur.

Cette table matérialise le système de confiance défini dans les documents métiers.

Responsabilités

Elle conserve :

•

niveau actuel ;

•

historique des évolutions ;

•

événements ayant modifié le niveau ;

•

indicateurs de fiabilité.

Relations

Utilisée par :

•

Recommendation ;

•

Radar ;

•

Veille ;

•

Sélection des candidats.

Synchronisation

Hybride.

Lecture possible hors ligne.

Les mises à jour proviennent du serveur.

5

Table : Settings

Objectif

Centraliser les préférences personnelles.

Responsabilités

Exemples :

•

langue ;

•

thème ;

•

notifications ;

•

confidentialité ;

•

préférences Radar ;

•

préférences Veille ;

•

préférences de recommandation.

Synchronisation

Hybride.

Les modifications locales sont synchronisées automatiquement.

Table : Device

Objectif

Identifier les appareils utilisés par un utilisateur.

Responsabilités

Permet notamment :

•

la gestion des notifications push ;

•

le suivi des connexions ;

•

la sécurité des accès ;

•

la synchronisation multi-appareils.

6

Synchronisation

Cloud.

Sécurité

Très protégée.

Les informations techniques ne sont jamais exposées publiquement.

Table : Session

Objectif

Suivre les sessions ouvertes.

Responsabilités

Gestion :

•

des connexions actives ;

•

des expirations ;

•

des révocations ;

•

des déconnexions à distance.

Synchronisation

Cloud uniquement.

Relations du domaine

Le Domaine Utilisateur constitue la racine des autres domaines.

Tous les moteurs utilisent ces informations sans jamais les dupliquer.

Les relations sont établies par des identifiants uniques garantissant la cohérence des données.

7

Principes de qualité

Le Domaine Utilisateur respecte les règles suivantes :

•

une seule identité par utilisateur ;

•

un seul profil principal ;

•

aucune duplication des informations personnelles ;

•

séparation stricte entre données publiques et données sensibles ;

•

compatibilité avec plusieurs appareils ;

•

compatibilité avec plusieurs clients.

Conclusion du Domaine Utilisateur

Le Domaine Utilisateur fournit l'ensemble des fondations nécessaires au fonctionnement de Vitala.

Il garantit une identité unique, une gestion progressive de la confiance, une séparation claire des

responsabilités et une base solide pour tous les moteurs de la plateforme.

8

