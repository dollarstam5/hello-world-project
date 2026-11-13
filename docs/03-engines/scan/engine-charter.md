# Scan — fiche de cadrage du moteur

## Statut

Dossier de cadrage initial. Il réserve le périmètre du moteur et distingue les décisions déjà connues des sujets à spécifier. Il ne certifie pas l'état d'implémentation du runtime.

## Rôle du moteur

Scan permet de **démarrer le scanner des possibilités**. Son interface place le lancement du scan au centre de l'expérience et présente ensuite les résultats et contrôles utiles.

## Repères d'interface déjà établis

- En-tête propre à Scan : icône et nom du moteur à gauche, commandes propres à Scan à droite.
- Aucun titre, icône ou décor au centre de l'en-tête.
- L'action principale au centre de la page est le démarrage du scanner.
- Les informations et résultats propres à Scan apparaissent sous l'en-tête.

## Configuration avant un Scan

Avant chaque lancement, l'utilisateur doit pouvoir définir les paramètres qui déterminent ce que le moteur explore :

- **Rayon de scan** : distance maximale autour du point de référence autorisé pour ce scan.
- **Types de résultats recherchés** : choix des possibilités ou catégories que l'utilisateur souhaite détecter.
- **Priorité des résultats** : sélection des types à mettre en avant dans les résultats, sans masquer silencieusement les autres résultats pertinents si l'utilisateur n'a pas demandé un filtrage strict.

Les réglages doivent être rapides à comprendre et à manipuler : cases à cocher, sélecteurs de rayon et contrôles simples adaptés au choix. Éviter un long formulaire.

Distinguer :
1. les préférences par défaut enregistrées dans les paramètres de Scan ;
2. les paramètres du lancement en cours, que l'utilisateur peut ajuster avant de démarrer.

Le rayon et les catégories effectivement choisis doivent être transmis au moteur et appliqués par les sources de données. L'interface ne doit jamais afficher un rayon comme appliqué si le service de recherche ne le respecte pas.

**À préciser avant implémentation :** valeurs de rayon disponibles, point de référence (position actuelle ou autre lieu autorisé), catégories de possibilités, distinction entre filtre strict et simple classement, durée/actualisation éventuelle du scan.

## Utilisation du profil et confidentialité

Scan définit sa propre projection du profil selon les informations strictement nécessaires à ses résultats et interactions. Il ne doit pas hériter automatiquement du profil complet ni des réglages de visibilité d'Instant ou de Flash.

Les champs visibles, l'éventuel accès au profil complet et les règles membre/invité restent à définir dans le contrat propre à Scan. En attendant cette décision, ne pas supposer qu'un résultat de scan autorise l'affichage de l'identité complète d'une personne.

Les paramètres de recherche (rayon, catégories et priorité) ne constituent pas des autorisations de profil et ne doivent pas élargir la visibilité des personnes ou publications. Toute donnée non autorisée est exclue de la réponse côté service/API.

## Sections à compléter pendant la conception

- Nature des possibilités détectées et sources autorisées.
- Déclenchement, progression, arrêt et reprise du scan.
- Présentation, classement et actualisation des résultats.
- Permissions système et consentements nécessaires.
- États sans résultat, hors ligne, erreur et limitation.
- Données, API, sécurité, coûts et critères de test.

## Garde-fous

- Le scanner ne doit pas prétendre détecter une possibilité si aucune source réelle n'est raccordée.
- Les permissions doivent être demandées au moment où elles deviennent utiles.
- V1 privilégie des critères simples, explicables et peu coûteux.
- Les choix de visibilité du profil restent propres à Scan.
- Le rayon et les critères affichés doivent correspondre aux paramètres réellement appliqués côté service.
