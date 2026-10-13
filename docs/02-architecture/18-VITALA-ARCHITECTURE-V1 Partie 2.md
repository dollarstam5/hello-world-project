18-VITALA-ARCHITECTURE-V1.md

Partie 2 — Architecture logique de l'écosystème Vitala

6. Vue d'ensemble

L'architecture logique de Vitala est organisée autour d'un ensemble de domaines métier et de moteurs

spécialisés qui collaborent sans dépendances directes.

Chaque composant possède une responsabilité unique.

La plateforme est construite selon une architecture modulaire où chaque domaine peut évoluer

indépendamment tout en restant cohérent avec l'ensemble du système.

7. Les couches de l'architecture

L'écosystème Vitala est structuré en plusieurs couches logiques.

Couche Expérience Utilisateur

Cette couche regroupe les interfaces utilisées par les personnes :

•

PWA React (référence principale)

•

Future application Flutter

•
•

Interfaces d'administration
Interfaces partenaires (évolutions futures)

Son rôle est exclusivement de présenter les informations et de collecter les actions des utilisateurs.

Aucune logique métier complexe ne doit y être implémentée.

Couche Fonctionnelle

Cette couche contient les parcours utilisateurs et les fonctionnalités métier.

Elle orchestre les interactions entre les interfaces et les moteurs.

Elle applique les règles métier de Vitala.

1

Couche des moteurs

Les moteurs représentent le cœur intelligent de la plateforme.

Ils sont indépendants les uns des autres et collaborent à travers des interfaces clairement définies.

Les moteurs officiels sont :

•

Flash Engine

•

Scan Engine

•

Radar Engine

•

Veille Engine

•

Recommendation Engine

•

Trust Engine

Chaque moteur possède son propre cycle de vie et ses propres responsabilités.

Couche Domaine

Cette couche contient les objets métier.

Par exemple :

•

Utilisateurs

•

Opportunités

•

Missions

•

Recommandations

•

Conversations

•

Notifications

•

Médias

Elle garantit la cohérence des informations manipulées par les moteurs.

Couche Persistance

Cette couche regroupe :

•

la base de données ;

•

le stockage des médias ;

•

les journaux d'événements ;

•

les mécanismes de synchronisation.

Elle constitue la mémoire permanente de la plateforme.

2

8. Les moteurs de Vitala

Chaque moteur possède un objectif précis.

Flash

Capture les intentions immédiates.

Scan

Recherche des solutions rapides.

Radar

Explore un périmètre plus large afin d'identifier des opportunités pertinentes.

Veille

Observe en continu les évolutions, détecte les tendances et accompagne les utilisateurs dans la durée.

Recommendation

Analyse les relations entre les utilisateurs, les besoins et les opportunités afin de proposer des

recommandations pertinentes.

Trust Engine

Évalue la fiabilité des interactions et construit le Capital de Confiance ainsi que le Trust Profile.

9. Les flux principaux

Les moteurs ne communiquent jamais directement entre eux.

Ils échangent uniquement par l'intermédiaire des objets métier, des événements validés ou des services

prévus à cet effet.

Cette règle garantit :

•

une faible dépendance ;

3

•

une meilleure évolutivité ;

•

une maintenance simplifiée.

10. Les domaines métier

Les données sont organisées par domaines.

Chaque domaine possède ses propres responsabilités.

Les principaux domaines sont :

•

Utilisateurs

•

Opportunités

•

Communication

•

Médias

•

Géographie

•

Intelligence

•

Sécurité

Les domaines exposent uniquement les informations nécessaires aux autres composants.

11. Les événements

Chaque moteur produit des événements représentant des actions importantes.

Ces événements permettent notamment :

•

la synchronisation ;

•

les notifications ;

•

les analyses ;

•

le Trust Engine ;

•

les statistiques ;

•

les audits.

Les événements constituent un mécanisme de collaboration entre les différents composants sans créer

de dépendances fortes.

12. Les services transversaux

Certains services sont utilisés par l'ensemble de la plateforme.

Ils comprennent notamment :

•

authentification ;

•

autorisations ;

4

•

notifications ;

•

géolocalisation ;

•

recherche ;

•

synchronisation ;

•

journalisation ;

•

stockage des médias.

Ces services ne contiennent pas de logique métier propre à un moteur.

Ils fournissent des capacités communes à l'ensemble de l'écosystème.

13. Les principes de collaboration

Les composants de Vitala collaborent selon plusieurs règles :

•

un moteur ne modifie jamais directement les données internes d'un autre moteur ;

•

chaque domaine reste responsable de ses propres données ;

•

les événements constituent le principal mécanisme de propagation des changements ;

•

les services transversaux restent indépendants des règles métier ;

•

la cohérence globale est privilégiée par rapport aux optimisations locales.

14. Évolutivité

L'architecture logique est conçue pour accueillir de nouveaux moteurs, domaines ou services sans

remettre en cause les composants existants.

Toute nouvelle fonctionnalité doit trouver naturellement sa place dans l'un des domaines ou moteurs

existants.

Si ce n'est pas possible, un nouveau domaine ou un nouveau moteur devra être créé plutôt que de

surcharger un composant existant.

15. Conclusion de la Partie 2

L'architecture logique de Vitala repose sur une séparation claire entre les interfaces, les règles métier,

les moteurs, les domaines et les services transversaux.

Cette organisation garantit une plateforme modulaire, cohérente et capable d'évoluer durablement tout

en limitant les dépendances entre les différents composants.

5

