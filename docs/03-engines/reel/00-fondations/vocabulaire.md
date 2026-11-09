# Vocabulaire fonctionnel — Réel

| Terme | Définition |
|---|---|
| Présence | État volontaire indiquant qu'un utilisateur est visible dans Réel pendant une durée choisie. |
| Zone / rayon | Périmètre de proximité autour de l'utilisateur, utilisé pour la découverte locale. |
| Statut / intention | Expression courte de ce que l'utilisateur souhaite dans l'instant ; un seul statut peut être actif à la fois. |
| Profil | Informations consultables sur une personne. Le rattachement d'un profil détaillé à une présence est facultatif. |
| Profil central | Représentation du profil de l'utilisateur actif au centre de la zone de Réel. |
| Profil proche | Représentation cliquable d'une personne détectée dans la zone de proximité. |
| Regroupement | Présentation collective de plusieurs profils proches situés dans une même zone, avec un indicateur numérique. |
| Bip | Manifestation d'intérêt adressée à l'auteur d'une intention. |
| Émetteur du bip | Personne qui envoie le bip. |
| Auteur de l'intention | Personne dont la présence et l'intention reçoivent le bip. |
| Acceptation | Décision de l'auteur d'accepter directement un bip ; elle crée une mise en relation. |
| Mise en relation | Relation fonctionnelle créée après acceptation d'un bip et accessible dans les deux emplacements prévus. |
| Poursuite du contact | Choix effectué après acceptation pour déterminer si les participants poursuivent la communication selon le parcours autorisé. |
| Communication | Échange textuel associé à une mise en relation ou à une action autorisée ; ce n'est pas une messagerie libre autonome. |
| Clôture | Fin d'une mise en relation, déclenchée par un participant après confirmation et appliquée aux deux participants. |
| Trace technique | Métadonnées minimales nécessaires à la cohérence et à la traçabilité, sans contenu de conversation. |

## Distinctions importantes

- La présence peut exister sans profil détaillé associé.
- La consultation du profil de l'émetteur d'un bip est possible avant la décision de l'auteur.
- Accepter un bip crée la mise en relation ; la poursuite du contact reste un choix distinct.
- Un bip non accepté et une mise en relation acceptée ont des cycles de vie différents.
- La communication est textuelle et rattachée à une mise en relation/action autorisée ; elle est désactivée à la clôture.

## Éléments encore à préciser

Les états techniques détaillés d'un bip, les libellés UX exacts, les informations visibles dans chaque niveau de profil et les modalités précises du choix de poursuivre le contact restent à spécifier.
