# VITALA-FLASH-ENGINE

**Document ID :** VITALA-ENGINE-01 **Titre :** Flash Engine — Moteur de diffusion **Version :** 1.0 **Statut :** VALIDÉ

# DÉPENDANCES

- VITALA-VISION-V1
- VITALA-PERSONAS-V1
- VITALA-TRUST-LEVELS-V1
- VITALA-UJ-01 à UJ-07

# 1. Objectif

Flash est le moteur de diffusion principal de Vitala. Sa mission est de permettre à un utilisateur de diffuser rapidement une information, un besoin, une opportunité ou une disponibilité vers les personnes les plus pertinentes de l'écosystème.

# 2. Philosophie

Flash ne fonctionne pas comme un réseau social. Flash ne cherche pas à maximiser :

- les vues;
- les likes;
- les commentaires;
- la viralité.
  Flash cherche à maximiser :

- la pertinence;
- la rapidité;
- l'utilité;
- la mise en relation;
- le résultat réel.

# 3. Définition

Un Flash est une information diffusée dans Vitala avec un objectif précis. Chaque Flash possède :

- une intention;
- une durée de vie;
- une zone d'application;
- une catégorie;
- un niveau de visibilité.

# 4. Types de Flash

Le moteur Flash peut diffuser plusieurs catégories.

## Opportunité

Exemples :

- Mission
- Besoin
- Recherche
- Collaboration
- Partenariat
- Projet

## Disponibilité

Exemples :

- Je suis disponible
- Service disponible
- Ressource disponible
- Salle disponible

## Information utile

Exemples :

- Information locale
- Alerte

- Changement important
- Signalement utile

## Événement

Exemples :

- Réunion
- Rencontre
- Formation
- Activité

## Offre

Exemples :

- Produit
- Service
- Ressource
- Location

# 5. Modes d'entrée

Flash doit accepter plusieurs modes de création.

## Texte

L'utilisateur rédige directement son Flash.

## Voix

L'utilisateur parle naturellement. Vita extrait automatiquement :

- intention;
- catégorie;
- lieu;
- date;
- contraintes;
- durée.

## Modes d'entrée supplémentaires : hors périmètre actuel et soumis à une décision produit distincte

# 6. Assistance Vita

Vita accompagne la création. Exemple :

```
J'ai besoin de deux serveurs pour demain à Bonanjo.
```

Vita comprend :

```
Type : Besoin
Catégorie : Service
Lieu : Bonanjo
Date : Demain
Quantité : 2
```

Puis complète uniquement les informations manquantes.

# 7. Structure d'un Flash

Chaque Flash possède :

- Identifiant
- Auteur
- Intention
- Type
- Catégorie
- Description
- Localisation
- Date de création
- Date d'expiration
- Visibilité
- Niveau de confiance requis

- Statut

# 8. Statuts

Un Flash peut être :

```
Brouillon
Analyse
Validation
Diffusé
En cours
Expiré
Archivé
Supprimé
```

# 9. Validation automatique

Avant diffusion : Flash passe par les contrôles internes.

## Vérifications

- Spam
- Doublon
- Fraude potentielle
- Contenu interdit
- Cohérence minimale

## Résultat

```
Accepté
Refusé
```

```
À compléter
```

# 10. Durée de vie

Chaque Flash possède une durée limitée.

## Exemples

- 1 heure
- 6 heures
- 24 heures
- 3 jours
- 7 jours
- 30 jours

## Expiration

À expiration :

```
Expiré
↓
Archivé
```

# 11. Diffusion intelligente

Flash ne diffuse jamais à toute la plateforme.

## Critères

- Proximité
- Catégorie
- Pertinence
- Disponibilité
- Historique
- Niveau de confiance
- Préférences utilisateur

# 12. Localisation

Chaque Flash peut être :

## Local

Exemple :

```
Quartier
Commune
Ville
```

## Régional

Exemple :

```
Département
Région
```

## National

Exemple :

```
Pays entier
```

## Flexible

Selon la volonté de l'auteur.

# 13. Réponses

Les utilisateurs peuvent :

- Montrer leur intérêt

- Répondre
- Se proposer
- Demander des précisions
  Les réponses sont encadrées par les règles Vitala.

# 14. Limites selon le niveau

La diffusion dépend du niveau de confiance.

## Consultant

Très limitée.

## Membre

Limitée.

## Identifié

Normale.

## Confirmé

Étendue.

**Pro** Avancée.

# 15. Expérience utilisateur

Flash doit rester extrêmement simple.

## Principe

L'utilisateur exprime une intention. Le système fait le reste.

# 16. Effet Flash

Lors d'une publication : Animation dédiée :

⚡ Analyse ⚡ Compréhension ⚡ Classification ⚡ Vérification ⚡ Diffusion

L'effet doit être court. Spectaculaire. Compréhensible. Utile.

# 17. Résultats attendus

Après diffusion :

- Réponses
- Intérêts
- Opportunités
- Mises en relation
- Actions

# 18. Relation avec les autres moteurs

Flash constitue l'entrée principale de l'information.

## Cycle

```
FLASH
↓
Diffuser
SCAN
↓
Trouver maintenant
RADAR
↓
Surveiller jusqu'à trouver
VEILLE
↓
Rester informé
```

# 19. Architecture recommandée

```
packages/
└── engines/
└── flash-engine/
├── parser/
├── validator/
├── classifier/
├── distributor/
├── expiration/
├── notifications/
└── flash.types.ts
```

# 20. Principes UX

## Principe 1

Publier en quelques secondes.

## Principe 2

Parler naturellement.

## Principe 3

Réduire les formulaires.

## Principe 4

Privilégier l'intention.

## Principe 5

Diffuser de manière pertinente.

## Principe 6

Favoriser les résultats réels.

# 21. Critère de réussite

Le moteur Flash est réussi lorsque :

```
Intention utilisateur
↓
Compréhension Vita
↓
Structuration automatique
↓
Validation
↓
Diffusion ciblée
↓
Réponses pertinentes
↓
Action réelle
```

avec un minimum d'effort pour l'utilisateur.

# Fin du document

Document ID : VITALA-ENGINE-01 Version : 1.0 Statut : VALIDÉ

# 22. Lieu du Flash — facultatif, distinct de la position de l'auteur

Certains Flash, notamment les annonces de biens ou de lieux (maison à louer, local, lieu d'un événement), peuvent proposer un lieu propre au Flash. Ce champ n'est pas obligatoire. Il ne doit pas reprendre automatiquement la position GPS de l'auteur.

La personne peut continuer sans ajouter de lieu. La future UI devra présenter un choix explicite de confidentialité/precision avant toute diffusion. Les options envisagées sont : lieu exact, zone approximative, ou lieu masqué. Elles sont une proposition de conception, pas encore un choix final de UI.

**Garde-fous :** consentement explicite, séparation de la position auteur et du lieu annoncé, aucun partage de coordonnées précises dans Sync ou projections publiques génériques, et un contrôle serveur adapté avant affichage. Une option de localisation activée ne doit pas divulguer les coordonnées brutes.

# 23. Informations absentes — publication permissive

Les critères non fournis restent facultatifs sauf lorsqu'un champ est réellement indispensable pour la sécurité, les autorisations ou l'action elle-même. Flash doit pouvoir enregistrer/publier une expression exploitable sans exiger que tous les critères soient renseignés.

Les critères absents restent inconnus/non précisés, ne sont ni inventés ni interprétés comme des contraintes. Les contrôles de sécurité, modération, propriété, statut et intégrité ne sont jamais assouplis.
