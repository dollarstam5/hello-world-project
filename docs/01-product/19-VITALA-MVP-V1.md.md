# 19-VITALA-MVP-V1.md

## Vitala Minimum Viable Platform (MVP)

**Version :** 1.0 **Statut :** Validé

# 1. Introduction

## Objectif

Ce document définit le périmètre officiel du MVP (Minimum Viable Platform) de Vitala. Le MVP ne représente pas une version incomplète de la plateforme. Il représente la plus petite version capable de démontrer la proposition de valeur de Vitala auprès de vrais utilisateurs. Toutes les fonctionnalités retenues doivent contribuer directement à cette démonstration.

# 2. Vision du MVP

Le MVP doit permettre à un utilisateur de parcourir l'intégralité du cycle de vie d'un besoin : **Besoin → Publication → Découverte → Interaction → Confiance → Validation → Résolution** Si cette boucle fonctionne de manière fluide, alors Vitala remplit sa mission principale.

# 3. Les capacités essentielles

Le MVP est organisé autour de cinq grandes capacités.

## 3.1 Exprimer un besoin

L'utilisateur peut :

- créer un compte;
- compléter son profil;
- publier un Flash;
- ajouter une localisation;

- joindre des médias si nécessaire;
- modifier ou supprimer son Flash.
## 3.2 Découvrir des opportunités

L'utilisateur peut :

- utiliser Scan;
- explorer Radar;
- effectuer une recherche;
- filtrer les résultats;
- consulter les opportunités pertinentes.
## 3.3 Recevoir une assistance intelligente

Le MVP inclut :

- Recommendation Engine;
- Veille personnalisée;
- notifications essentielles;
- suggestions contextualisées.
## 3.4 Construire la confiance

Le MVP comprend :

- Trust Profile;
- Trust Score;
- historique des interactions;
- preuves de confiance disponibles;
- évolution du niveau de confiance.
## 3.5 Finaliser une mise en relation

Le MVP permet :

- répondre à une opportunité;
- sélectionner un candidat;
- valider une action;
- clôturer une mission;
- enregistrer le résultat.

# 4. Les moteurs inclus

Le MVP intègre les moteurs suivants :

- Flash
- Scan
- Radar
- Veille
- Recommendation
- Trust Engine
Tous les moteurs fonctionnent ensemble conformément aux principes définis dans le VPS.

# 5. Fonctionnalités transversales

Le MVP comprend également :

- authentification;
- gestion des profils;
- notifications;
- géolocalisation;
- gestion des médias;
- recherche;
- synchronisation offline-first;
- historique personnel;
- paramètres utilisateur.
# 6. Architecture du MVP

Le MVP repose sur :

- PWA React comme client principal;
- Backend Supabase;
- PostgreSQL;
- stockage des médias;
- synchronisation offline-first;
- monorepo prêt à accueillir Flutter.
L'architecture doit déjà être compatible avec les évolutions futures.

# 7. Critères de réussite

Le MVP est considéré comme réussi si :

- un utilisateur peut publier un besoin en moins de 30 secondes;
- un besoin trouve des opportunités pertinentes rapidement;
- les recommandations améliorent les mises en relation;
- le Trust Engine influence positivement les décisions;
- la plateforme reste utilisable hors connexion pour les fonctions essentielles;
- les données sont correctement synchronisées au retour du réseau;
- l'expérience utilisateur est simple, fluide et cohérente.
# 8. Ce qui est volontairement reporté

Les éléments suivants ne font pas partie du MVP :

- IA conversationnelle avancée;
- organisations et comptes entreprise;
- API publiques;
- marketplace étendue;
- internationalisation complète;
- analytics avancés;
- automatisations complexes;
- application Flutter;
- client Desktop.
Ces fonctionnalités sont prévues pour les versions ultérieures.

# 9. Roadmap d'évolution

## Version 1

Consolidation du MVP. Optimisation des performances. Amélioration du Trust Engine. Évolution des recommandations.

## Version 2

Application Flutter.

API publiques. Premières intégrations externes. Nouveaux moteurs spécialisés.

## Version 3

Support des organisations. Marketplace complète. Déploiement multi-pays. Fonctionnalités d'intelligence artificielle avancées.

# 10. Conclusion

Le MVP de Vitala constitue la première version pleinement exploitable de la plateforme. Il ne cherche pas à proposer toutes les fonctionnalités imaginées, mais à démontrer la valeur fondamentale de Vitala : permettre à une personne d'exprimer un besoin, de découvrir des opportunités pertinentes, de créer des relations de confiance et d'aboutir à une solution grâce à un écosystème intelligent, modulaire et évolutif. Le MVP est la première étape d'une plateforme conçue pour grandir sans remettre en cause ses fondations.