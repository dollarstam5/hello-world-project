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

## Utilisation du profil et visibilité de l'auteur

Flash utilise une projection du profil propre à ce moteur. La visibilité de l'auteur est distincte de la visibilité du contenu Flash : découvrir une publication ne donne jamais automatiquement accès au profil complet de son auteur.

L'auteur contrôle les informations de profil qu'il rend visibles dans le contexte de Flash et les personnes/zones pouvant découvrir chaque publication. Les règles doivent être définies au niveau du moteur et, pour les paramètres de diffusion, au niveau de chaque Flash.

- Les informations d'auteur (nom, photo, description et autres champs) ne sont visibles que si l'auteur les a explicitement autorisées pour Flash.
- L'accès au profil complet est une autorisation distincte, désactivée par défaut tant qu'une décision produit contraire n'est pas validée.
- Chaque Flash possède son propre public cible et sa propre zone de découverte, choisis par son auteur.
- Un Flash ne doit pas être découvert hors du public cible ou des zones autorisées par ses paramètres.
- Les réglages d'un Flash ne modifient pas les paramètres généraux du profil ni ceux d'un autre moteur.
- La publication suivante ne doit pas reprendre silencieusement les autorisations d'un Flash précédent.
- Les options sont présentées avec des cases à cocher, interrupteurs ou choix courts, en langage naturel.
- Les API ne transmettent jamais les champs non autorisés ; le contrôle est appliqué côté serveur, et non uniquement dans l'interface.
- Si un mode invité est pris en charge, ses informations temporaires et ses droits doivent rester distincts de ceux d'un membre.

### Choix à présenter lors d'une publication

La conception doit permettre à l'auteur de régler séparément :
1. les informations de profil visibles avec ce Flash ;
2. l'autorisation ou non d'ouvrir son profil complet depuis ce Flash ;
3. le public cible ;
4. la ou les zones de découverte ;
5. le mode « découverte de l'expéditeur uniquement ».

La liste exacte des champs et les libellés UI restent à finaliser. Ces règles sont des exigences produit, pas une déclaration d'implémentation déjà disponible.

Voir aussi la [politique transversale de visibilité par moteur](../visibility-and-profile-policy.md).

## Visibilité propre à chaque Flash

Chaque Flash publié doit posséder son propre périmètre de visibilité et de découverte, choisi par son auteur au moment de la publication. L'auteur — et non le lecteur — détermine les critères selon lesquels son Flash peut être découvert.

Un Flash peut notamment être publié en mode **découverte de l'expéditeur uniquement** : les personnes qui le découvrent peuvent identifier son auteur à partir des seules informations que celui-ci a explicitement rendues publiques pour Flash, sans obtenir automatiquement l'accès à son profil complet.

Les règles suivantes s'appliquent :

- Le nom, la photo, la description et tout autre champ ne sont visibles que si l'auteur les a autorisés pour Flash.
- L'accès au profil complet est une autorisation distincte ; il n'est jamais implicite.
- L'auteur choisit le public cible et la ou les zones de découverte du Flash.
- Les personnes hors du public cible ou hors des zones autorisées ne doivent pas pouvoir découvrir le Flash par les mécanismes de recherche ou de proximité de Flash.
- Les critères d'un Flash ne modifient pas les réglages généraux du profil ni ceux d'un autre moteur.
- Chaque Flash conserve son propre périmètre ; publier un nouveau Flash ne doit pas reprendre silencieusement les autorisations d'une publication précédente.
- Les options sont présentées sous forme de cases à cocher, interrupteurs ou contrôles courts équivalents, avec des explications simples sur ce qui sera visible et par qui.
- Les autorisations sont appliquées côté serveur. L'interface ne doit jamais recevoir les champs non autorisés.

### Base de réglages à concevoir

La liste exacte des choix et leurs libellés restent à valider en conception. Elle devra permettre au minimum de configurer séparément :
1. les informations de l'expéditeur visibles dans Flash ;
2. la possibilité ou non d'ouvrir son profil complet ;
3. le public cible autorisé à découvrir le Flash ;
4. les zones de découverte autorisées ;
5. le mode « découverte de l'expéditeur uniquement ».

Ces choix sont des exigences produit à implémenter et tester, pas une déclaration de fonctionnalité déjà disponible.

Voir aussi la [politique transversale de visibilité par moteur](../visibility-and-profile-policy.md).

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
