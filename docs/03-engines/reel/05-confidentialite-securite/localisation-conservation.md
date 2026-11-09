# Confidentialité, localisation et conservation

## Modes d'accès et identité

Réel propose un mode invité sans compte Vitalis et un mode complet avec compte. Les deux modes disposent des mêmes privilèges fonctionnels.

En mode invité, l'absence de compte permanent ne dispense pas le système de distinguer les sessions et de sécuriser les actions. Un identifiant temporaire de session devra être conçu. Il ne doit pas être confondu avec les coordonnées de localisation ni avec une identité civile. Sa génération, sa durée de vie, son renouvellement, sa révocation et un éventuel rattachement ultérieur à un compte restent à spécifier.

L'avatar personnalisé du mode invité est un élément de représentation ; il ne constitue pas à lui seul une preuve d'identité.

## Présence et localisation

Présence manuelle et volontaire ; partage volontaire de la localisation ; rayon personnalisable jusqu'à 1 km. Les coordonnées de position peuvent contribuer au calcul de proximité et à la représentation des présences, mais ne doivent pas être utilisées comme identifiant unique d'un utilisateur ou d'une session.

À spécifier : permissions, refus, précision, fréquence, protection contre la triangulation, perte de localisation, minimisation des données, durée de conservation et purge. L'interface doit expliquer la permission demandée et permettre à l'utilisateur de comprendre quand sa présence est visible.

## Durées

Présence : 30 min, 1 h, 2 h, 3 h, 6 h, 12 h, 24 h. À expiration, le statut est supprimé.

## Bips non acceptés

Conservation temporaire de 24 h, même après fermeture de Réel, puis expiration. Aucun historique permanent. Le point de départ exact du délai reste à définir.

## Mises en relation acceptées

Accès dans deux emplacements. À la clôture, retrait immédiat des deux espaces pour les deux participants. Ne pas confondre le délai des bips non acceptés avec la durée de vie des mises en relation acceptées.

## Trace après clôture

Trace minimale retenue : date, statut et événement, pour cohérence et traçabilité. Pas d'historique de conversation ni de mise en relation active après clôture. Durée de conservation technique, accès, pseudonymisation et suppression à préciser.

## Sécurité à spécifier

Authentification ou validation adaptée à chaque mode, autorisation, contrôle d'accès aux profils et mises en relation, autorité serveur, prévention des abus, blocage/signalement, limitation de débit, validation des intentions et audit des événements sensibles.

Aucune implémentation de sécurité n'est prouvée par ce document.
