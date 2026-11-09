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
| COM-07 | Quatre catégories de notifications incluses dans la V1 | Validée |
| COM-08 | Ouverture directe ou aperçu selon la nature de la notification | Validée |
| COM-09 | Historique conservé, distinction « Non lues » / « Toutes », lecture automatique et regroupement par date/catégorie | Validée |
| COM-10 | Regroupement intelligent des notifications similaires, sans masquer les événements nécessitant une attention individuelle | Validée |
| COM-11 | Trois niveaux de priorité : Normal, Important et Urgent, avec interruption uniquement si nécessaire | Validée |
| COM-12 | Consultation hors ligne et synchronisation automatique au retour du réseau, sans doublons ni avalanche d'alertes | Validée |

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

### Priorités et interruptions

Vitalis classe les notifications selon trois niveaux :

- **Normal :** notification discrète dans le centre, sans interruption.
- **Important :** notification mise en évidence dans le centre, sans interruption automatique par défaut.
- **Urgent :** alerte immédiate uniquement lorsqu'une réaction rapide est réellement nécessaire.

Règles transversales :

- Les événements de sécurité réellement critiques peuvent déclencher une alerte immédiate.
- Les annonces promotionnelles ou informations ordinaires ne peuvent pas être classées Urgent.
- Les alertes évitent les répétitions inutiles et respectent les préférences de l'utilisateur ainsi que les réglages du système.
- Les aperçus ne doivent pas exposer de données sensibles.
- Le niveau Urgent doit rester rare et justifié ; il ne sert pas à augmenter artificiellement l'engagement.

### Fonctionnement hors ligne et synchronisation

- Les notifications déjà reçues et mises en cache restent consultables hors ligne.
- Les nouvelles notifications générées pendant l'absence de connexion restent récupérables depuis le serveur au retour du réseau.
- Vitalis relance automatiquement la synchronisation ; l'utilisateur n'a pas à actualiser manuellement ni à relancer l'application.
- La synchronisation évite de créer des doublons et conserve l'état de lecture de manière cohérente.
- Au retour du réseau, les notifications accumulées sont regroupées intelligemment et seules les informations encore pertinentes sont mises en évidence.
- La reconnexion ne doit pas provoquer une avalanche d'alertes ni rejouer toutes les notifications comme si elles venaient d'arriver.
- Les limites de cache local, la stratégie de reprise, la déduplication technique et la gestion des conflits d'état restent à spécifier et à tester.

## À préciser

- La règle exacte de sélection de l'onglet si plusieurs espaces ont des nouveautés.
- Les événements précis associés aux niveaux Normal, Important et Urgent, notamment les critères objectifs d'urgence.
- Le comportement des alertes selon les réglages du téléphone et les préférences de l'utilisateur.
- Le contenu détaillé des notifications et des listes de conversations.
- Le lien permettant de retrouver l'action ou la mise en relation d'origine.
- Les états de lecture, accusés de réception et synchronisation.
- Les permissions, blocages, clôture et conservation hérités de chaque parcours.
- Les limites de cache local, la stratégie de reprise, la déduplication technique et les tests hors ligne.
- Les états vides, chargement, erreur et hors ligne, ainsi que les critères de test.

## Limite de preuve

Ce document décrit les décisions produit. Il ne confirme pas que les panneaux, notifications, conversations ou échanges d'assistance sont implémentés ou testés.

Référence : [Parcours utilisateurs](./user-journeys.md).
