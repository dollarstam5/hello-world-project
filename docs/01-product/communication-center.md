# Centre de communication — Vitalis V1

**Statut :** spécification produit en cours de construction. Les décisions ci-dessous sont validées ; elles ne prouvent pas l'implémentation.

## Principe

La cloche ouvre une fenêtre unique avec trois onglets en haut : **Notifications**, **Messages** et **Assistance**. L'utilisateur peut naviguer entre eux sans quitter cette fenêtre.

## Ouverture et indicateurs

- À l'ouverture, Vitalis privilégie un onglet contenant une nouvelle activité.
- Si plusieurs espaces sont concernés, Notifications est prioritaire en cas d'égalité.
- La cloche affiche le total des activités non lues.
- Chaque onglet affiche son propre compteur : notifications non lues, messages non lus, nouvelles réponses/activités d'assistance non lues.
- La règle précise de sélection en présence de plusieurs activités reste à définir.

## Conversations : règle fondamentale

Vitalis ne propose pas de messagerie libre entre utilisateurs. Une conversation découle d'une action, d'une mise en relation ou d'un parcours métier explicitement autorisé.

- Afficher uniquement les conversations autorisées et existantes.
- Conserver l'origine métier de chaque conversation.
- Ne pas proposer d'annuaire, de recherche générale d'utilisateurs ou de bouton permettant d'envoyer librement un nouveau message.
- Appliquer les participants, permissions, états et règles du parcours métier source.
- Garder l'assistance séparée des conversations entre utilisateurs.

## Origine visible

Chaque conversation affiche son contexte, par exemple : « Mise en relation — Réel », « Mission — Flash » ou « Action — Scan ». Ces exemples ne signifient pas que tous ces moteurs autorisent déjà une conversation en V1 : chaque cas doit être confirmé dans la spécification du moteur concerné.

## Décisions validées

| ID | Décision | État |
| --- | --- | --- |
| COM-01 | Une cloche, un centre, trois parcours | Validée |
| COM-02 | Trois onglets en haut de la fenêtre | Validée |
| COM-03 | Ouvrir un espace avec nouveauté ; Notifications prioritaire en cas d'égalité | Validée |
| COM-04 | Compteur global et compteurs distincts par onglet | Validée |
| COM-05 | Conversations uniquement liées à une action/mise en relation autorisée ; pas de messagerie libre | Validée |
| COM-06 | Afficher l'origine métier de chaque conversation | Validée |


## Notifications — périmètre V1

Les quatre catégories suivantes sont incluses dans la V1 :

1. Activité des moteurs : Réel, Flash, Scan et Radar.
2. Mises en relation et actions engagées.
3. Compte et sécurité.
4. Informations et annonces de Vitalis.

### Ouverture d'une notification

Le comportement dépend de la nature de la notification :

- Une notification liée à une action simple peut ouvrir directement la page ou le moteur concerné.
- Une notification nécessitant du contexte ouvre un aperçu dans une fenêtre, avec une possibilité de poursuivre vers la page concernée.
- Une notification sensible présente les informations utiles sans exposer inutilement les données personnelles.

### Regroupement intelligent

- Les notifications similaires reçues sur une courte période sont regroupées automatiquement en une seule entrée.
- Le regroupement présente un résumé compréhensible et le nombre d'activités concernées.
- L'utilisateur peut ouvrir le groupe pour consulter les éléments individuels.
- Le regroupement ne doit pas masquer une action urgente, sensible ou nécessitant une décision individuelle.
- La fenêtre de regroupement et les critères de similarité restent à définir à partir des catégories et événements réels ; aucun seuil arbitraire n'est fixé ici.

### Lecture, historique et organisation

- Une notification consultée passe automatiquement à l'état « Lue ».
- Les notifications non lues restent visuellement prioritaires.
- Les notifications lues restent accessibles dans l'historique.
- L'affichage distingue « Non lues » et « Toutes ».
- Les notifications sont regroupées de manière lisible par date et catégorie.
- Une action « Tout marquer comme lu » est disponible.
- Le compteur de la cloche et celui de l'onglet Notifications sont actualisés automatiquement.
- L'archivage et la durée de conservation restent à définir ; aucune durée n'est présumée par cette décision.

## À préciser

- La règle exacte de sélection de l'onglet si plusieurs espaces ont des nouveautés.
- Le contenu détaillé des notifications et des listes de conversations.
- Le lien permettant de retrouver l'action ou la mise en relation d'origine.
- Les états de lecture, accusés de réception et synchronisation.
- Les permissions, blocages, clôture et conservation hérités de chaque parcours.
- Les états vides, chargement, erreur et hors ligne, ainsi que les critères de test.

## Limite de preuve

Ce document décrit les décisions produit. Il ne confirme pas que les panneaux, notifications, conversations ou échanges d'assistance sont implémentés ou testés.

Référence : [Parcours utilisateurs](./user-journeys.md).
