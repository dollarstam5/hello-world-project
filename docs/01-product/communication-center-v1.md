# Centre de communications — règles produit V1

## Objectif

La cloche ouvre un centre unique de contrôle des communications et événements nécessitant l'attention de la personne. Elle regroupe quatre espaces distincts, sans fusionner leurs responsabilités.

## Les quatre espaces

| Ordre | Espace        | Responsabilité V1                                                                                    |
| ----- | ------------- | ---------------------------------------------------------------------------------------------------- |
| 1     | Notifications | Informations système, alertes et changements d'état utiles à la personne.                            |
| 2     | Assistant     | Accès facultatif à Vita, aide contextuelle et suivi des demandes d'assistance. L'espace n'est affiché que si la personne a activé l'assistant. |
| 3     | Messages      | Conversations rattachées à une action ou à une mise en relation acceptée. Aucune messagerie libre.   |
| 4     | En direct          | Demandes, invitations, acceptations et interactions En direct qui nécessitent une décision ou une action. |

L'onglet En direct est un point de contrôle et d'accès aux événements du moteur. Il ne constitue pas un second moteur En direct et ne duplique pas ses écrans opérationnels.

## Indicateurs et comptage

- Chaque espace possède son propre indicateur visuel.
- L'indicateur d'un espace ne s'allume que lorsqu'un élément non lu ou une action en attente nécessite réellement l'attention de la personne.
- La cloche globale signale qu'au moins un élément unique nécessite une attention.
- Un même événement référencé dans plusieurs espaces ne doit être compté qu'une fois dans le total global.
- Les états « non lu » et « action à effectuer » sont distincts : lire une demande ne vaut pas acceptation, refus ou clôture.
- Ouvrir le centre ou changer d'onglet ne marque pas automatiquement tous les éléments comme lus.
- Le passage à l'état lu doit être explicite et lié à l'élément consulté. L'accomplissement d'une action suit son propre cycle métier.

## Règles métier et limites

- Les Messages restent liés aux actions et mises en relation ; aucun canal de discussion libre n'est introduit.
- Une conversation En direct ne devient disponible que dans le cadre de la mise en relation prévue par les règles du moteur.
- La clôture d'une mise en relation suit le cycle du moteur En direct : elle s'applique aux deux personnes, désactive la communication associée et informe la personne concernée.
- En mode invité, aucun historique persistant n'est conservé. Avec un compte, l'historique suit les règles de rétention définies pour le moteur concerné.
- Les Notifications ne doivent pas recopier intégralement une conversation ou un événement déjà consultable dans son espace spécialisé ; elles peuvent fournir un résumé et un lien vers celui-ci.

## États attendus

Chaque espace doit pouvoir distinguer au minimum :

- vide ;
- contenu disponible ;
- élément non lu ;
- action en attente ;
- chargement ;
- erreur récupérable ;
- indisponibilité réseau et reprise après reconnexion.

Les états doivent être compréhensibles sans multiplier les badges ou les alertes. Les compteurs numériques sont réservés aux éléments réellement actionnables ou non lus ; un simple point discret peut signaler une présence sans volume significatif.

## Contrat d'indicateurs à raccorder

Les sources de données et événements doivent fournir, pour chaque élément, un identifiant stable, un espace propriétaire, un état de lecture, un état d'action, une date et une cible de navigation. L'agrégateur global doit dédupliquer par identifiant d'événement.

Aucun compteur dynamique ne doit être simulé côté interface en l'absence de source métier fiable. Tant que les sources ne sont pas raccordées, les onglets et leurs états vides restent explicites.

## Critères d'acceptation

- Les quatre espaces fonctionnels sont définis dans l'ordre Notifications, Assistant, Messages, En direct. L'onglet Assistant est volontairement masqué lorsque l'assistant facultatif est désactivé ; lorsqu'il est activé, les quatre onglets sont présents dans cet ordre.
- Les libellés sont disponibles en français et en anglais.
- Les onglets restent utilisables sur petit écran sans débordement horizontal.
- Les responsabilités et les règles de non-duplication sont respectées.
- Aucun message libre n'est rendu possible par le centre.
- Aucun compteur fictif n'est affiché.
- Les modes invité et compte respectent leurs règles d'historique respectives.

## Gouvernance générale

Les règles transversales de déclenchement, de fréquence, de confidentialité, d'accessibilité, de sécurité, d'évolution V2/V3 et de validation des sources sont définies dans la [gouvernance complète du système de communication](./communication-system-governance-v1-v3.md). En cas de divergence, les règles de propriété des données et de vérité métier du domaine restent prioritaires ; le centre ne fabrique jamais d'événement.

## Statut d'implémentation

Le composant V1 expose Notifications, Messages et En direct par défaut, avec leurs états vides localisés. L'espace Assistant apparaît uniquement après activation explicite de l'assistant, conformément à son caractère facultatif et désactivé par défaut. Les Notifications affichent les événements Flash et Radar confirmés pendant la session, avec une cible de retour vers le moteur propriétaire. Les confirmations déjà visibles dans le moteur sont classées comme lues et ne déclenchent pas la cloche. Le compteur global additionne les notifications réellement non lues et les bips En direct en attente, à partir de la projection Réel existante. L’espace En direct affiche les agrégats chargés par le moteur et renvoie vers /reel pour les actions ; il ne refait aucune lecture réseau. Scan conserve ses résultats et son historique local dans son écran, car une recherche volontaire et synchrone ne constitue pas une notification. Messages reste vide tant qu’aucun système de conversation lié à une action n’est réellement disponible. Le registre d’événements partagé est en mémoire dans le runtime applicatif : il n’ajoute ni stockage, ni API, ni synchronisation ; il est effacé au changement de session ou au rechargement. Les notifications métier distantes, l’historique durable et les conversations ne sont donc pas déclarés implémentés.

## Évolution — événements serveur Réel

Les événements entrants réellement émis par les transitions serveur de Réel sont maintenant projetés dans le registre du runtime commun : bip reçu, bip accepté/refusé pour le membre expéditeur, et mise en relation clôturée. Ils apparaissent dans Notifications avec un lien vers En direct. Les listes et actions détaillées restent la propriété du moteur.

La cloche ne compte pas deux fois un bip reçu présent à la fois dans le flux d'événements et dans la projection des bips en attente. Le flux reste limité à la session applicative ; aucun historique durable n'est ajouté.

L'abonnement privé membre est unique et monté au niveau de l'application. Le contrôleur Réel ne crée plus d'abonnement par onglet. Le mode invité conserve son parcours temporaire et n'est jamais abonné au canal membre. Les essais multi-appareils et les mesures réseau réelles restent à effectuer avant validation terrain.
