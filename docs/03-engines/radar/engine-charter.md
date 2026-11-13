# Radar — fiche de cadrage du moteur

## Statut

Dossier de cadrage initial. Ce document prépare la conception du moteur sans déclarer les fonctions non spécifiées comme implémentées.

## Rôle du moteur

Radar est le moteur de découverte et de repérage des opportunités. Son action principale est de **démarrer le balayage/la recherche d'opportunités**. Il doit avoir une expérience propre, distincte de la présence immédiate d'Instant, de la publication de Flash et du scanner de possibilités de Scan.

## Repères d'interface déjà établis

- En-tête propre à Radar : icône et nom du moteur à gauche, commandes propres à Radar à droite.
- Aucun titre, icône ou décor au centre de l'en-tête.
- L'action principale au centre de la page est le démarrage du balayage Radar.
- Les informations, filtres et résultats propres à Radar se placent sous l'en-tête.

## Configuration avant une recherche Radar

Avant chaque lancement, l'utilisateur définit le périmètre et les conditions de la recherche :

- **Zones à explorer** : une ou plusieurs zones géographiques explicitement choisies.
- **Critères de recherche** : types d'opportunités, catégories et caractéristiques recherchées.
- **Durée de recherche** : temps pendant lequel Radar effectue la recherche ou maintient le balayage actif.

Les réglages doivent être simples et adaptés à chaque type de choix : sélection de zones, cases à cocher pour les critères, contrôle de durée. Éviter un long formulaire.

Distinguer :
1. les préférences par défaut enregistrées dans les paramètres de Radar ;
2. les paramètres propres à une recherche, modifiables avant chaque lancement.

La durée doit être effectivement respectée par le moteur : à son terme, la recherche s'arrête ou passe dans l'état prévu et l'utilisateur en est informé. Les zones et critères doivent être appliqués aux sources de données, et non seulement affichés dans l'interface.

**À préciser avant implémentation :** mode de sélection des zones (carte, rayon, lieux enregistrés ou combinaison), durée minimale et maximale, comportement en arrière-plan, actualisation, arrêt anticipé, reprise éventuelle et règles de consommation/coût.

## Utilisation du profil

Radar définit sa propre projection du profil selon le type d'opportunité et les interactions nécessaires. Il ne doit pas afficher automatiquement le profil complet ni réutiliser le réglage de visibilité d'Instant.

**À décider avant implémentation détaillée :**
- quelles informations d'identité sont nécessaires pour consulter ou répondre à une opportunité ;
- quelles informations doivent rester privées ;
- si un accès facultatif au profil complet est pertinent et, dans ce cas, quel consentement propre à Radar le contrôle ;
- quelles règles s'appliquent aux invités et aux comptes membres.

## Sections à compléter pendant la conception

- Types d'opportunités et sources de données.
- Zone, filtres, rayon et fréquence d'actualisation.
- Démarrage, progression et arrêt du balayage.
- Présentation et classement des résultats.
- Mise en relation, suivi et historique éventuels.
- Limites V1, coûts, permissions et fonctionnement hors ligne.
- Contrats API, sécurité et critères de test.

## Garde-fous

- Ne pas confondre Radar avec Instant : Radar repère des opportunités, Instant montre la présence immédiate à proximité.
- Ne pas afficher de faux résultats comme des données réelles.
- Les critères de découverte doivent être déterministes et compréhensibles.
- Les choix de visibilité du profil restent propres à Radar.
- La durée, les zones et les critères affichés doivent correspondre aux paramètres réellement appliqués côté service.
