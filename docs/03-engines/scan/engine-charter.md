# Scan — fiche de cadrage du moteur

## Statut

Dossier de cadrage initial. Il réserve le périmètre du moteur et distingue les décisions déjà connues des sujets à spécifier. Il ne certifie pas l'état d'implémentation du runtime.

## Rôle du moteur

Scan est le moteur qui permet de **démarrer le scanner des possibilités**. Son interface doit placer le lancement du scan au centre de l'expérience et présenter ensuite les résultats et contrôles utiles.

## Repères d'interface déjà établis

- En-tête propre à Scan : icône et nom du moteur à gauche, commandes propres à Scan à droite.
- Aucun titre, icône ou décor au centre de l'en-tête.
- L'action principale au centre de la page est le démarrage du scanner.
- Les informations et résultats propres à Scan apparaissent sous l'en-tête.

## Utilisation du profil

Scan doit définir sa propre projection du profil en fonction des informations réellement nécessaires à ses possibilités et à ses résultats. Il ne doit pas hériter automatiquement du profil complet ni du réglage de visibilité d'Instant.

**À décider avant implémentation détaillée :**
- si Scan a besoin d'une identité visible ou peut fonctionner avec une identité minimale ;
- quels champs du profil sont strictement nécessaires ;
- si l'utilisateur peut autoriser séparément l'affichage du profil complet depuis Scan ;
- comment traiter les utilisateurs invités et les résultats qui les concernent.

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
