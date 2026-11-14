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

## Utilisation du profil et visibilité de chaque Flash
Flash utilise une projection du profil propre à ce moteur. La visibilité de l'auteur est distincte de la visibilité du contenu : découvrir une publication ne donne jamais automatiquement accès au profil complet de son auteur.

Chaque Flash possède son propre périmètre de diffusion et de découverte, choisi par son auteur au moment de la publication. Les réglages d'un Flash ne modifient ni les paramètres généraux du profil, ni ceux d'un autre moteur, ni ceux d'une publication précédente ou suivante.

L'auteur doit pouvoir régler séparément, pour chaque publication :
1. les informations de profil visibles avec ce Flash (nom, photo, description et, si autorisés, d'autres champs) ;
2. la possibilité ou non d'ouvrir son profil complet depuis ce Flash ;
3. le public cible autorisé à découvrir le Flash ;
4. la ou les zones de découverte autorisées ;
5. le mode « découverte de l'expéditeur uniquement », lorsque ce mode est choisi.

Règles d'application :
- L'accès au profil complet est une autorisation distincte, jamais implicite et désactivée par défaut tant qu'une décision produit contraire n'est pas validée.
- Le mode « découverte de l'expéditeur uniquement » permet d'identifier l'auteur uniquement à partir des informations explicitement autorisées pour Flash ; il n'ouvre pas son profil complet.
- Les personnes hors du public cible ou hors des zones autorisées ne doivent pas pouvoir découvrir le Flash par les mécanismes de recherche ou de proximité de Flash.
- Les réglages d'une publication ne sont pas silencieusement repris par la publication suivante. Des valeurs préremplies pourront être proposées uniquement si l'utilisateur les confirme pour le nouveau Flash.
- Les choix doivent être présentés sous forme de cases à cocher, interrupteurs ou contrôles courts, avec une explication simple de ce qui sera visible et par qui.
- Les API ne transmettent jamais les champs non autorisés. Le contrôle est appliqué côté serveur, pas uniquement dans l'interface.
- Si un mode invité est pris en charge, ses informations temporaires et ses droits restent distincts de ceux d'un membre.

La liste exacte des champs, les libellés UI et les valeurs de public/zone restent à finaliser en conception. Ces règles sont des exigences produit, pas une déclaration d'implémentation déjà disponible.

Voir aussi la [politique transversale de visibilité par moteur](../visibility-and-profile-policy.md).

## Sources, durée et cycle de vie
- Flash est une source possible de résultats pour Scan et de signaux agrégés pour Veille, selon les autorisations et les règles de confidentialité.
- Scan peut rechercher des Flash actifs pour répondre à une demande immédiate ; cela ne donne pas à Scan le droit de modifier ou de republier ces Flash.
- Radar peut utiliser des Flash comme source de correspondances persistantes uniquement lorsque cette source et son traitement sont effectivement raccordés.
- Une publication Flash ne devient pas automatiquement une mission Radar, un engagement Mission ou une présence Instant.
- La durée, l'expiration, la suppression, la modération et les états du Flash doivent être définis dans son propre contrat.

## Première expérience d'interface

La première page Flash et son parcours de création sont décrits dans [Flash — expérience d'interface V1](./flash-ui-implementation.md). Le parcours comprend une expression libre par texte ou dictée vocale lorsque le navigateur le permet, une proposition structurée modifiable, puis une confirmation explicite avant enregistrement. La découverte et « Mes Flashs » sont deux espaces distincts.

Cette livraison d'interface ne valide pas encore la visibilité par publication : les champs de public cible, de zones autorisées et de projection du profil ne sont pas présents dans le contrat local/public actuel. Ils restent à raccorder au stockage, à la synchronisation, aux API et aux protections serveur avant d'être proposés dans l'interface.

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
