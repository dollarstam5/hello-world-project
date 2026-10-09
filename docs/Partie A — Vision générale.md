BUILD-SUPABASE.md

Partie A — Vision générale

Version : V1

Statut : Référence officielle de l'utilisation de Supabase dans Vitala

1. Objectif

Cette section définit la place officielle de Supabase dans l'architecture de Vitala.

Elle précise :

•

son rôle ;

•

ses responsabilités ;

•

ses limites ;

•

ses interactions avec les autres composants.

Supabase constitue le socle technique principal de la plateforme, mais il ne représente pas la logique

métier de Vitala.

2. Philosophie

Vitala est conçu selon une architecture Domain-Driven Design.

Dans cette architecture :

•

les domaines métier représentent les règles métier ;

•

les APIs représentent les points d'accès ;

•

Supabase fournit les services techniques nécessaires au fonctionnement de la plateforme.

Supabase est une infrastructure.

Il n'est jamais considéré comme un domaine métier.

3. Position dans l'architecture

Supabase appartient à la couche Infrastructure / Plateforme du Build Blueprint.

1

Il fournit les capacités techniques suivantes :

•

Base de données PostgreSQL

•

Authentification

•

Stockage des fichiers

•

Edge Functions

•

Realtime

•

Journalisation

•

Sécurité

•

Gestion des secrets

Il ne contient aucune logique fonctionnelle propre à Vitala.

4. Rôle officiel

Supabase est responsable de fournir :

Stockage des données

•

persistance des données métier ;

•

intégrité des données ;

•

transactions ;

•

index ;

•

performances.

Authentification

•

création des comptes ;

•

gestion des sessions ;

•

émission des JWT ;

•

récupération des mots de passe ;

•

authentification externe.

L'identité métier reste gérée par l'UDI.

Stockage des médias

Supabase Storage héberge :

•

images ;

•

documents ;

•

pièces jointes ;

•

avatars ;

•

médias des différents domaines.

2

Exécution serveur

Les Edge Functions exécutent les traitements serveur nécessitant :

•

une logique technique ;

•

des intégrations externes ;

•

des traitements sécurisés.

Les règles métier restent dans les domaines.

Realtime

Supabase fournit les capacités temps réel nécessaires à :

•

la synchronisation ;

•

certaines notifications ;

•

les mises à jour en direct lorsque cela est justifié.

5. Ce que Supabase ne doit jamais faire

Supabase ne doit jamais devenir :

•

un domaine métier ;

•

une couche de présentation ;

•

un moteur d'intelligence ;

•

un orchestrateur métier.

Les règles métier appartiennent exclusivement aux domaines définis dans le Domain Model.

6. Interaction avec les domaines

Les domaines utilisent Supabase uniquement via :

•

les repositories ;

•

les services d'infrastructure ;

•

les APIs officielles.

Un domaine ne dépend jamais directement d'une implémentation spécifique de Supabase.

Cette règle facilite les tests, la maintenance et une éventuelle évolution technologique.

3

7. Interaction avec les APIs

Toutes les communications avec Supabase passent par les APIs ou les services d'infrastructure.

Il est interdit :

•

d'accéder directement à PostgreSQL depuis l'interface utilisateur ;

•

de contourner les couches applicatives ;

•

d'exposer directement les tables métier aux écrans.

8. Interaction avec les moteurs d'intelligence

Les moteurs Radar, Veille, Recommendation et Search utilisent des données provenant de Supabase

uniquement par les mécanismes autorisés :

•

APIs ;

•

projections de lecture ;

•

événements métier.

Ils n'écrivent jamais directement dans les tables métier.

9. Principes d'utilisation

L'utilisation de Supabase dans Vitala repose sur les principes suivants :

•

Infrastructure as a Service

•

Security by Design

•

Offline First

•

API First

•

Domain First

•

Documentation First

•

Évolutivité

•

Observabilité

Chaque fonctionnalité exploitant Supabase doit respecter ces principes.

10. Gouvernance

Toute évolution concernant Supabase doit rester cohérente avec :

•

le VPS ;

•

le Domain Model ;

•

BUILD-ARCHITECTURE.md ;

•

BUILD-DATABASE.md ;

4

•

BUILD-APIS.md ;

•

BUILD-SYNC.md ;

•

BUILD-SECURITY (lorsqu'il sera disponible).

Aucune évolution technique ne peut remettre en cause les principes d'architecture de Vitala.

11. Objectifs à long terme

L'intégration de Supabase vise à garantir :

•

une plateforme fiable ;

•

une infrastructure sécurisée ;

•

une haute disponibilité ;

•

une forte évolutivité ;

•

une maintenance simplifiée ;

•

une excellente expérience pour les développeurs.

Supabase est un accélérateur technologique, mais la valeur de Vitala réside dans son architecture

métier et ses domaines fonctionnels.

12. Conclusion

Supabase constitue le socle technique officiel de Vitala.

Il fournit les services d'infrastructure indispensables au fonctionnement de la plateforme tout en

restant strictement séparé des règles métier.

Cette séparation garantit que Vitala reste modulaire, maintenable, évolutive et conforme aux principes

définis dans le Build Blueprint.

5

