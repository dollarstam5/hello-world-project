# Inventaire fonctionnel — Réel

Ce document décrit le périmètre fonctionnel retrouvé pour Réel. Les fonctionnalités décrites ne constituent pas une preuve d'implémentation.

## 0. Deux modes d'accès avec les mêmes privilèges

Réel peut être utilisé selon deux modes :

- **Mode rapide / invité :** accès sans création obligatoire d'un compte Vitalis. Le parcours doit rester très court (deux ou trois étapes au maximum dans l'expérience cible), notamment pour les permissions nécessaires et le choix ou la création d'un avatar personnalisé.
- **Mode complet / compte Vitalis :** accès à Réel avec le compte et le profil Vitalis de l'utilisateur.

**Règle produit validée : les deux modes disposent des mêmes privilèges fonctionnels dans Réel.** Un utilisateur invité ne doit pas être privé d'une interaction essentielle au seul motif qu'il n'a pas créé de compte.

Dans les deux modes, les fonctions essentielles sont les mêmes : publier une intention, découvrir les présences proches, consulter les profils accessibles, envoyer et recevoir des bips, accepter une mise en relation et choisir de poursuivre la communication associée après acceptation.

La différence porte sur le mode d'identification et la continuité de l'expérience liée au compte, pas sur les droits d'interaction dans Réel. Le mécanisme technique d'identifiant temporaire pour une session invitée, sa durée de vie et les possibilités éventuelles de rattachement ultérieur à un compte restent à concevoir.

## 1. Présence volontaire

- L'utilisateur active et désactive sa présence manuellement.
- Le partage de la localisation est volontaire.
- Un seul statut/intention peut être actif à la fois.
- Le profil détaillé associé à la présence est facultatif.
- L'utilisateur choisit une durée prédéfinie : 30 min, 1 h, 2 h, 3 h, 6 h, 12 h ou 24 h.
- Aucune durée personnalisée n'est prévue dans le périmètre actuellement retenu.
- À expiration, le statut est supprimé.

## 2. Rayon de proximité

- Le rayon est personnalisable par l'utilisateur.
- Les petits rayons retenus sont 10 m, 25 m, 50 m et 100 m.
- Des distances supérieures sont possibles, jusqu'à 1 km maximum.
- Le rayon par défaut et les paliers entre 100 m et 1 km restent à arbitrer.

## 3. Intention

Le statut exprime une intention immédiate, contextualisée et compréhensible rapidement.

Exemples d'intentions :
- « Je veux discuter avec une voisine. »
- « J'offre un plat de nourriture à qui arrive le premier. »
- « Je propose un travail de 30 minutes. »

La longueur maximale, les catégories éventuelles, les formats, l'édition, la modération et les règles de validation restent à spécifier.

## 4. Découverte et représentation de la zone

- L'écran Réel présente le profil de l'utilisateur au centre.
- La zone de proximité est représentée autour de ce profil par une visualisation radiale, avec des repères/rayons visuels.
- Les profils proches apparaissent autour du profil central et sont cliquables.
- Plusieurs profils présents dans un même lieu ou une même zone peuvent être regroupés.
- Un indicateur numérique signale le nombre de profils regroupés (par exemple 5 ou 6 personnes dans une salle, une réunion, une classe ou un concert).
- La présentation doit rester lisible sur mobile et ne pas suggérer une précision géographique supérieure à celle réellement disponible.

Le placement exact, les règles de chevauchement, le seuil de regroupement et l'ouverture d'un groupe restent à spécifier. La représentation radiale est une représentation de proximité, pas une carte garantissant la position physique exacte de chaque personne.

## 5. Bips

- Les bips sont consultables par l'utilisateur uniquement lorsqu'il est actif dans Réel.
- L'auteur d'une intention peut consulter le profil de l'émetteur du bip avant de décider.
- L'auteur peut accepter directement depuis la liste des bips, sans renvoyer de bip.
- Un bip non accepté reste actif pendant 24 h, même si Réel est fermé, puis expire en tant qu'action.
- Pour un utilisateur connecté à son compte Vitalis, l'événement du bip (envoyé/reçu, date et état, selon les données minimisées retenues) reste consultable dans son historique après l'expiration.
- En mode invité, aucune histoire personnelle persistante n'est conservée : les données personnelles liées à la session disparaissent à sa fin.
- Le point de départ exact du délai de 24 h reste à définir.

Le refus, l'annulation par l'émetteur, les demandes répétées et les limites anti-abus restent à arbitrer.

## 6. Mises en relation acceptées

- L'acceptation d'un bip crée une mise en relation.
- Les mises en relation acceptées sont accessibles dans deux emplacements actifs : le compteur de Réel et Notifications.
- Pour un utilisateur connecté, les mises en relation et leurs événements passés restent consultables dans l'historique, y compris après leur clôture ; leur présence dans l'historique ne les maintient pas actives.
- Aucun espace autonome supplémentaire « Temps réel » n'est prévu.
- La poursuite du contact après acceptation relève d'un choix ; l'acceptation ne doit pas être assimilée à l'ouverture automatique d'une messagerie libre.
- Une mise en relation acceptée reste accessible jusqu'à sa clôture selon les règles actuellement retenues ; sa durée maximale avant clôture n'est pas fixée.
- La clôture confirmée par un participant s'applique aux deux participants et retire immédiatement la mise en relation des deux emplacements pour chacun.

## 7. Communication

- La communication est de type texte dans le périmètre actuellement retenu.
- Elle est rattachée à une mise en relation ou à une action autorisée.
- Il n'existe pas de messagerie libre indépendante.
- La communication associée est désactivée lorsque la mise en relation est clôturée.
- Les pièces jointes, les limites, la modération et les détails du comportement hors ligne restent à préciser.

## 8. Notifications

- L'autre participant est informé lorsqu'une mise en relation est clôturée.
- Les mises en relation acceptées sont également accessibles depuis l'emplacement Notifications.
- Le catalogue complet des événements et les préférences de notification restent à établir.

## 9. Traçabilité et résilience réseau

- Pour les comptes Vitalis, l'historique conserve les bips, les mises en relation et les interactions passées associées à Réel.
- La clôture retire la mise en relation des espaces actifs des deux participants et désactive la communication, mais ne supprime pas son entrée de l'historique des comptes.
- L'historique est une chronologie d'événements et de statuts ; cela ne vaut pas validation de la conservation du contenu des conversations, qui reste exclu en l'état.
- En mode invité, l'historique personnel n'est pas persistant et les données personnelles de session disparaissent à la fin de celle-ci.
- Les traces techniques minimales nécessaires à la sécurité et à la cohérence restent distinctes de l'historique visible.
- Les actions en attente doivent être préservées en cas de perturbation réseau puis synchronisées au retour de la connexion.
- La synchronisation doit éviter les doublons et les incohérences ; une action en attente localement ne doit pas être présentée comme confirmée par le serveur.

Les durées de conservation des traces, les règles détaillées de synchronisation et les arbitrages de conflits restent à concevoir.
