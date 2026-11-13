# Visibilité et confidentialité propres à chaque moteur

## Principe directeur

Chaque moteur Vitalis possède ses propres réglages de visibilité. Le profil global ne constitue pas une autorisation générale de tout montrer : chaque moteur ne reçoit et ne présente que les informations nécessaires à son usage, selon les choix explicites de l'utilisateur.

Les réglages d'un moteur ne doivent pas modifier ceux d'un autre. Une autorisation donnée dans Instant ne vaut donc pas autorisation dans Flash, Scan ou Radar.

## Contrôle par l'utilisateur

- Présenter les choix sous forme de cases à cocher, interrupteurs ou contrôles simples équivalents.
- Expliquer en langage naturel ce que chaque choix rend visible, à qui et dans quel périmètre.
- Appliquer le principe du refus par défaut : une information non autorisée reste privée.
- Distinguer la visibilité d'une publication, la découverte de son auteur et l'accès au profil complet.
- Lorsqu'une publication possède ses propres réglages, ceux-ci s'appliquent à cette publication sans élargir les autorisations générales du profil.
- Une modification des réglages doit être vérifiée côté serveur ; masquer une information uniquement dans l'interface ne constitue pas une protection.

## Projection de profil propre à Instant

Instant expose par défaut uniquement le **nom**, la **photo/avatar** et la **description de présence** définie pour ce moteur. Cette description est contextuelle et ne remplace pas la biographie générale du compte.

La consultation du profil complet depuis Instant est un choix distinct, propre à ce moteur, désactivé par défaut et activé uniquement par consentement explicite dans ses paramètres. Le retrait de ce consentement doit être appliqué côté serveur/API et aux consultations suivantes ; il ne doit pas ouvrir l'accès dans Flash, Scan ou Radar. Les fiches rapides restent limitées aux trois champs minimaux, même lorsqu'un accès distinct au profil complet est autorisé.

La fiche canonique détaillée de cette règle est [Instant — périmètre du profil et visibilité](./reel/instant-profile-visibility.md).

## Périmètres à distinguer

1. **Informations publiques de profil** : éléments que l'utilisateur a explicitement autorisés pour un moteur ou un contexte.
2. **Public cible** : personnes auxquelles le contenu est destiné selon les critères choisis par son auteur.
3. **Zone de découverte** : périmètre géographique ou contextuel dans lequel le contenu ou son auteur peut être découvert.
4. **Découverte de l'expéditeur** : possibilité de découvrir qui a publié, sans pour autant ouvrir son profil complet.
5. **Profil complet** : consultation distincte, qui nécessite une autorisation explicite et propre au moteur.

Le public cible et la zone de découverte déterminent où et par qui un contenu peut être découvert ; ils ne donnent jamais, à eux seuls, accès à des données privées.

## Interface de réglage

Privilégier des cases à cocher et des choix courts, compréhensibles et réversibles. Ne pas imposer un long formulaire. Les options exactes sont définies dans la fiche de chaque moteur et ne doivent pas être inventées avant validation produit.

## Exigences techniques et tests

- Appliquer les règles de visibilité à la lecture des données, dans les API et politiques d'accès, pas seulement dans les composants UI.
- Vérifier les accès membre/invité et les accès depuis un autre compte.
- Tester les combinaisons autorisé/non autorisé, public cible/hors cible et zone autorisée/hors zone.
- Ne jamais exposer d'identifiants temporaires ou de champs privés dans les réponses réseau.
- Documenter séparément les décisions validées, les questions ouvertes et les fonctions réellement déployées.

Ce document définit le principe transversal ; les contrats spécifiques des moteurs restent prioritaires pour leurs propres fonctionnalités.
