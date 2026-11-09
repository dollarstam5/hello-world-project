# Parcours et expérience utilisateur

**Direction UX :** moderne, intelligente, simple, vivante, premium sans surcharge cognitive.

## Choix du mode d'accès

À l'entrée dans Réel, l'utilisateur peut choisir entre deux parcours :

### Mode rapide — invité

- Aucun compte Vitalis n'est obligatoire.
- Le parcours cible comporte deux ou trois étapes au maximum.
- L'utilisateur valide les permissions nécessaires, notamment la localisation s'il souhaite être visible à proximité.
- Il choisit ou crée un avatar personnalisé.
- Il accède ensuite à Réel.

L'objectif est de réduire au minimum le temps entre l'ouverture du moteur et la première présence active.

### Mode complet — compte Vitalis

- L'utilisateur accède à Réel avec son compte et son profil Vitalis.
- Les informations de profil sont utilisées selon les règles de visibilité et les autorisations applicables.
- Le parcours s'inscrit dans la continuité de son expérience Vitalis.

### Parité fonctionnelle

Les deux parcours donnent accès aux mêmes fonctions essentielles de Réel : publier une intention, découvrir les présences proches, consulter les profils accessibles, envoyer et recevoir des bips, accepter une mise en relation et choisir de poursuivre la communication associée après acceptation.

L'interface ne doit pas présenter le mode invité comme une version bridée. La différence doit être expliquée simplement : accès rapide sans compte ou continuité avec le profil Vitalis.

## Activation de présence

Après le choix du mode d'accès : ouvrir Réel, activer volontairement sa présence, accorder la permission de localisation si nécessaire, choisir un rayon, renseigner une intention, choisir une durée, puis devenir visible. Les étapes exactes et les états de permission refusée restent à confirmer.

## Écran principal

- Profil ou avatar de l'utilisateur au centre.
- Zone circulaire/radiale autour.
- Profils proches distribués autour du centre et cliquables.
- Indicateurs numériques pour les regroupements.
- Présentation moderne, lisible et adaptée au mobile.

La visualisation ne doit pas suggérer une précision de localisation supérieure à celle réellement disponible.

## Cartes et bips

Les cartes côte à côte sont souhaitées lorsque pertinentes, avec hiérarchie et lecture rapide. L'utilisateur actif consulte ses bips, peut consulter le profil de l'émetteur et accepter directement depuis la liste.

## Historique Réel selon le mode d'accès

- **Compte Vitalis :** un historique consultable conserve les bips, les mises en relation et les interactions passées liées à Réel.
- **Invité :** pas d'historique personnel persistant ; les données personnelles liées à la session disparaissent à la fin de celle-ci.
- L'historique d'un compte est distinct des éléments actifs. Une mise en relation clôturée disparaît du compteur Réel et de Notifications, mais reste consultable dans l'historique.
- L'historique présente les événements et les conversations selon les règles de rétention, d'archivage et d'accès exceptionnel décrites ci-dessous ; les archives sont conservées 6 mois à compter de leur archivage.

## Accès aux mises en relation

Deux emplacements actifs : compteur dans Réel et Notifications. Aucun quatrième espace « Temps réel ». L'historique est un accès rétrospectif distinct, pas un troisième emplacement de mise en relation active.

## Clôture

Demande de confirmation, clôture pour les deux, désactivation de la communication, retrait immédiat des deux espaces et notification de l'autre participant.

## Qualité UX

Mobile-first, responsive, faible charge mentale, états vides/chargement/erreur/hors ligne/reprise, animations utiles mais non indispensables, accessibilité et lisibilité.

**À confirmer :** wireframes, libellés exacts, gestes, états détaillés, animations et accessibilité.


## Conservation, archivage et limites de stockage V1

Pour les comptes Vitalis, les conversations sont archivées après 3 mois ou plus tôt si le plafond de 50 conversations conservées est dépassé : la plus ancienne est alors archivée. Une conversation archivée est inaccessible à l'utilisateur, sauf demande de celui-ci autorisée par un administrateur pour une durée de 24 heures. Ensuite, elle redevient inaccessible. L'utilisateur peut supprimer son historique, mais ne peut pas l'exporter.

Chaque espace dispose d'un plafond de stockage gratuit en V1. En cas de saturation, l'interface propose deux choix : supprimer des données ou limiter les nouveaux usages/enregistrements dans cet espace. Aucun paiement ni supplément de stockage n'est proposé en V1. Les quotas chiffrés, les seuils d'avertissement et la durée de conservation des archives restent à définir.
