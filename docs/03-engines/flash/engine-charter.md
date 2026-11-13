# Flash — fiche de cadrage du moteur

## Statut

Dossier de cadrage initial. Les éléments ci-dessous réservent le périmètre documentaire ; ils ne déclarent pas que toutes les fonctions sont déjà implémentées ou validées.

## Rôle du moteur

Flash est le moteur de publication d'une information courte, locale et limitée dans le temps. Son action principale est de **démarrer/créer un Flash**. Il ne doit pas devenir un flux social généraliste ni reprendre l'action centrale d'un autre moteur.

## Repères d'interface déjà établis

- En-tête propre à Flash : icône et nom du moteur à gauche, commandes propres à Flash à droite.
- Aucun titre, icône ou décor au centre de l'en-tête.
- L'action principale au centre de la page est le démarrage d'un Flash.
- Les informations, états et contenus secondaires se placent sous l'en-tête autour de cette action.

## Utilisation du profil

Chaque moteur définit sa propre projection du profil. Flash ne doit pas afficher automatiquement le profil complet parce qu'un utilisateur est connecté.

**À décider avant implémentation détaillée :**
- quelles informations d'auteur sont nécessaires à la compréhension et à la confiance dans un Flash ;
- si le nom et la photo suffisent ou si une description contextuelle est utile ;
- si l'ouverture du profil complet doit être possible, avec un consentement propre à Flash ;
- quelles informations sont visibles en mode invité, si ce mode est prévu pour Flash.

Ne pas réutiliser automatiquement le réglage de visibilité du profil d'Instant.

## Sections à compléter pendant la conception

- Création et durée de vie d'un Flash.
- Zone géographique et portée de diffusion.
- Catégories, pièces jointes et limites V1.
- Expiration, suppression et modération.
- États vides, erreurs, confirmations et notifications.
- Données et permissions membre/invité.
- Contrats API, modèle de données et critères de test.

## Garde-fous

- Pas de fonctionnalité simulée présentée comme opérationnelle.
- V1 privilégie une création simple, peu coûteuse et sans média obligatoire.
- Les règles de confidentialité et de visibilité doivent être vérifiées côté serveur.
- Les choix d'Instant ne s'appliquent pas à Flash sans décision explicite.
