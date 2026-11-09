# Réel — compteur des bips et mises en relation

**Projet :** Vitalis  
**Périmètre :** règles produit V1  
**Statut :** décisions validées le 9 novembre 2026  
**Branche :** `reconcile/lot-a-2026-11`

## 1. Décision validée : deux espaces distincts

La fenêtre ouverte depuis le compteur de Réel présente deux espaces clairement séparés :

1. **Bips reçus** — sollicitations temporaires encore valides, qui attendent éventuellement une décision.
2. **Mes mises en relation** — connexions acceptées, établies et conservées durablement.

Cette séparation évite de confondre une sollicitation en attente avec une relation déjà établie.

## 2. Bips reçus

- Afficher les bips reçus qui sont encore dans leur fenêtre de conservation de 24 heures.
- Pour chaque bip, afficher le temps restant avant expiration.
- Permettre de consulter les informations essentielles du profil : photo ou avatar, nom affiché et description de présence lorsqu'elle existe.
- Le destinataire peut accepter directement un bip depuis cet espace.
- Un bip non accepté disparaît automatiquement à l'expiration des 24 heures.
- Les bips en attente ne sont pas transférés dans la cloche, dans Notifications ou dans Messages.
- L'historique temporaire est accessible exclusivement depuis Réel, même lorsque la présence de l'utilisateur est inactive.

Le compteur des bips indique le nombre de bips reçus encore valides. Il reste consultable lorsque la présence Réel est inactive. Le retour dans Réel ne réactive jamais automatiquement la présence.

## 3. Mes mises en relation

- Cet espace contient uniquement les mises en relation résultant d'un bip accepté.
- Une mise en relation acceptée est durable et reste accessible aux deux personnes, indépendamment de l'activité ou de l'expiration de leur présence Réel.
- L'accès depuis Réel et la notification de confirmation dans la cloche renvoient à la même mise en relation ; ils ne créent pas de doublon.
- La conversation reste facultative au moment de l'acceptation et suit les règles du moteur Communication.
- Les mises en relation ne sont pas supprimées à l'expiration du bip d'origine.

## 4. États et distinction visuelle

L'interface doit distinguer immédiatement :
- **En attente :** bip reçu, décision possible, durée restante visible.
- **Accepté :** mise en relation établie, retrouvable dans « Mes mises en relation ».
- **Expiré :** bip non accepté arrivé au terme des 24 heures ; il disparaît de la liste active.

Ne pas mélanger les deux espaces dans une liste indifférenciée. Les compteurs doivent correspondre aux éléments réellement présents dans chaque espace.

## 5. Accès et navigation

Les deux espaces sont présentés sous forme de deux onglets dans une seule fenêtre du compteur Réel :

- **Ouverture par défaut :** « Bips reçus » lorsque l'utilisateur ouvre le compteur.
- **Accès contextuel :** si l'utilisateur ouvre le compteur depuis l'espace « Mes mises en relation », cet onglet est sélectionné directement.
- Le changement d'onglet ne crée pas une nouvelle fenêtre et ne mélange jamais les deux listes.
- Consulter le compteur ou changer d'onglet ne réactive jamais la présence Réel.

Ils ne constituent pas de nouvelles rubriques dans la cloche centrale, qui conserve ses trois parcours :
1. Notifications ;
2. Messages ;
3. Assistance.

Les bips en attente restent exclusivement dans Réel. La notification de confirmation d'une acceptation apparaît dans Notifications. Les conversations liées aux mises en relation relèvent de Messages, selon les règles de Communication.

## 6. Résilience réseau

La conservation de 24 heures vise notamment à absorber les perturbations réseau et les retards de synchronisation. Les événements en attente doivent être préservés localement et réconciliés au retour du réseau sans doublons.

Restent à spécifier et tester techniquement : le point de départ exact du délai, les accusés de réception, les reprises après échec, le traitement des événements reçus tardivement, la déduplication et la suppression à expiration. Cette décision produit ne prouve pas que ces mécanismes sont déjà implémentés.

## 7. Traçabilité des décisions

| Sujet | Décision |
|---|---|
| Nombre d'espaces dans la fenêtre du compteur | Deux espaces distincts — VALIDÉ |
| Présentation | Deux onglets dans une seule fenêtre — VALIDÉ |
| Onglet par défaut à l'ouverture du compteur | « Bips reçus » — VALIDÉ |
| Ouverture depuis « Mes mises en relation » | Sélection directe de cet onglet — VALIDÉ |
| Consultation / changement d'onglet | Ne réactive jamais la présence Réel — VALIDÉ |
| Libellé du premier espace | « Bips reçus » — VALIDÉ |
| Contenu du premier espace | Bips reçus encore valides — VALIDÉ |
| Durée des bips non acceptés | 24 heures — VALIDÉ |
| Temps restant affiché | Oui, pour chaque bip reçu — VALIDÉ |
| Compteur des bips | Nombre de bips reçus encore valides — VALIDÉ |
| Accès après désactivation de Réel | Oui, sans réactiver la présence — VALIDÉ |
| Libellé du second espace | « Mes mises en relation » — VALIDÉ |
| Contenu du second espace | Mises en relation acceptées uniquement — VALIDÉ |
| Conservation des mises en relation acceptées | Durable, selon Communication — VALIDÉ |
| Bips en attente dans la cloche | Non — VALIDÉ |
| Notification d'acceptation | Dans Notifications — VALIDÉ |
| Conversation | Facultative immédiatement, régie par Communication — VALIDÉ |

## 8. Points restant à définir

- Détails visuels et comportementaux des onglets (animations, transitions et états de chargement), en préservant la simplicité et l'accessibilité.
- États et actions après refus, blocage ou signalement.
- Possibilité de retirer un bip envoyé.
- Limites anti-abus et règles sur les bips répétés.
- Détail des informations et actions visibles dans une mise en relation durable.
- Règles techniques de synchronisation, d'horodatage, de déduplication et d'expiration, avec tests d'acceptation.

Aucune de ces questions ouvertes ne doit remettre en cause les décisions déjà validées ci-dessus sans nouvel arbitrage explicite.


## 9. Présentation des deux cartes du compteur — VALIDÉE le 9 novembre 2026

La fenêtre du compteur présente les deux espaces sous forme de cartes modernes, côte à côte lorsque la largeur disponible le permet. La priorité reste la lisibilité, la compréhension immédiate et une faible charge cognitive.

Chaque carte comprend :
- une icône identifiable ;
- le libellé explicite de l'espace ;
- un compteur visible correspondant au nombre réel d'éléments ;
- une courte prévisualisation de profils sous forme d'avatars ;
- un état visuel clair lorsque la carte / l'espace est sélectionné.

### Prévisualisation des profils

- Afficher au maximum **trois avatars** par carte.
- S'il existe davantage de profils, afficher un indicateur complémentaire **« +N »** pour représenter les profils non prévisualisés.
- Les avatars sont secondaires par rapport au libellé et au compteur ; ils ne doivent pas réduire leur lisibilité ni surcharger la carte.
- Dans « Bips reçus », les avatars représentent les personnes dont les bips sont encore valides.
- Dans « Mes mises en relation », les avatars représentent les personnes avec lesquelles une mise en relation a été établie.
- Les aperçus et compteurs sont alimentés par les données réelles ; aucun nombre ou profil fictif ne doit apparaître dans l'interface de production.

### Adaptation aux écrans

- Sur les largeurs permettant une lecture confortable, conserver les deux cartes côte à côte.
- Sur les écrans étroits, empiler les cartes verticalement plutôt que de comprimer les contenus.
- Préserver des zones tactiles confortables, des libellés lisibles et un contraste suffisant.
- La sélection d'une carte affiche son espace dans la même fenêtre, sans navigation inutile ni réactivation de la présence Réel.

Cette décision décrit le comportement et la hiérarchie visuelle attendus ; elle ne signifie pas que l'interface est déjà implémentée.
