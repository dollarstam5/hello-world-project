# Centre de communications — règles produit V1

## Objectif

La cloche ouvre un centre unique de contrôle des communications et événements nécessitant l'attention de la personne. Elle regroupe quatre espaces distincts, sans fusionner leurs responsabilités.

## Les quatre espaces

| Ordre | Espace        | Responsabilité V1                                                                                    |
| ----- | ------------- | ---------------------------------------------------------------------------------------------------- |
| 1     | Notifications | Informations système, alertes et changements d'état utiles à la personne.                            |
| 2     | Assistant     | Accès à Vita, aide contextuelle et suivi des demandes d'assistance.                                  |
| 3     | Messages      | Conversations rattachées à une action ou à une mise en relation acceptée. Aucune messagerie libre.   |
| 4     | Réel          | Demandes, invitations, acceptations et interactions Réel qui nécessitent une décision ou une action. |

L'onglet Réel est un point de contrôle et d'accès aux événements du moteur. Il ne constitue pas un second moteur Réel et ne duplique pas ses écrans opérationnels.

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
- Une conversation Réel ne devient disponible que dans le cadre de la mise en relation prévue par les règles du moteur.
- La clôture d'une mise en relation suit le cycle du moteur Réel : elle s'applique aux deux personnes, désactive la communication associée et informe la personne concernée.
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

- Les quatre onglets sont présents dans l'ordre Notifications, Assistant, Messages, Réel.
- Les libellés sont disponibles en français et en anglais.
- Les onglets restent utilisables sur petit écran sans débordement horizontal.
- Les responsabilités et les règles de non-duplication sont respectées.
- Aucun message libre n'est rendu possible par le centre.
- Aucun compteur fictif n'est affiché.
- Les modes invité et compte respectent leurs règles d'historique respectives.

## Statut d'implémentation

Le composant V1 expose les quatre espaces et leurs états vides localisés. Les compteurs et indicateurs métier ne sont pas encore raccordés aux sources réelles ; ils ne sont donc pas présentés comme implémentés. Les critères ci-dessus restent le contrat de référence pour leur intégration.
