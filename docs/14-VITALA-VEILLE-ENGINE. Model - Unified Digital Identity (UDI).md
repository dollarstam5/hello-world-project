# Évolution du Domain Model : Unified Digital Identity (UDI)

## 1. Nouveau principe fondamental

Le **Profile** n'est plus considéré comme une simple fiche utilisateur. À partir de cette version du Domain Model, chaque utilisateur possède une **Unified Digital Identity** **(UDI)**. L'UDI est l'agrégat métier central représentant l'identité numérique complète d'un utilisateur dans l'écosystème Vitala. Elle constitue le point de référence unique (Single Source of Truth) pour l'identité de l'utilisateur.

# 2. Rôle de l'UDI

L'UDI ne calcule pas les données métier. Elle agrège les informations produites par les différents domaines de la plateforme afin de présenter une vision cohérente et unifiée de l'utilisateur. Chaque domaine reste propriétaire de ses propres données. L'UDI ne duplique jamais ces données; elle expose uniquement leur représentation.

# 3. Structure de l'UDI

L'Unified Digital Identity est composée des modules suivants :

## Identity

Informations d'identité :

- identifiant
- nom
- photo
- langue
- pays
- vérifications
- statut du compte

## Capabilities

Représente les capacités de la personne :

- compétences
- domaines d'expertise
- expériences
- certifications
- centres d'intérêt
## Context

Décrit le contexte actuel :

- localisation
- disponibilité
- mobilité
- fuseau horaire
## Intentions

Décrit les objectifs actuels de l'utilisateur. Exemples :

- rechercher une opportunité;
- proposer une opportunité;
- développer son réseau;
- trouver des partenaires;
- recruter;
- rechercher des investisseurs.
Les intentions sont dynamiques et peuvent évoluer au fil du temps.

## Preferences

Paramètres utilisés par les moteurs :

- préférences Radar;
- préférences Veille;
- préférences Recommendation;
- paramètres de personnalisation.

## Privacy

Détermine les règles de visibilité des informations. Chaque module applique les politiques de confidentialité définies par l'utilisateur et par la plateforme.

## Activity View

Vue agrégée de l'activité de l'utilisateur :

- Flash publiés;
- réponses;
- missions;
- interactions;
- historique.
Cette vue est alimentée par les domaines responsables.

## Trust View

Vue produite par le Trust Engine. Elle expose notamment :

- Trust Score;
- niveau de confiance;
- historique du Trust;
- preuves de confiance.
Le calcul reste entièrement sous la responsabilité du Trust Engine.

## Recommendation View

Présente les recommandations générées par le Recommendation Engine.

## Radar View

Présente les informations issues du moteur Radar.

## Veille View

Présente les informations produites par le moteur Veille.

## Statistics

Expose des indicateurs agrégés concernant l'activité et l'utilisation de la plateforme.

# 4. Gouvernance des données

Chaque donnée appartient à un seul domaine métier. Les autres domaines ne doivent jamais dupliquer cette donnée. Ils la consultent ou en présentent une vue via l'UDI. Ce principe garantit :

- la cohérence des informations;
- l'absence de duplication;
- la facilité d'évolution;
- la maintenabilité de la plateforme.
# 5. Relations avec les autres domaines

L'UDI interagit avec les domaines suivants :

- Auth
- Profile
- Flash
- Scan
- Radar
- Veille
- Recommendation
- Trust
- Mission
- Notification
- Media
Ces domaines restent autonomes. L'UDI agit comme un agrégateur métier et une représentation unifiée de l'utilisateur.

# 6. Principes d'évolution

L'architecture de l'UDI est modulaire. De nouveaux modules pourront être ajoutés sans modifier les modules existants.

Les moteurs métier continueront à produire leurs propres données, tandis que l'UDI assurera leur présentation cohérente. Ce modèle garantit une identité numérique évolutive, capable d'accompagner la croissance de Vitala sans remettre en cause les fondations du Domain Model.