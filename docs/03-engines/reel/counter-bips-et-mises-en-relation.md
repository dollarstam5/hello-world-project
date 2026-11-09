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


## 10. Cartes de bip reçu et consultation du profil — VALIDÉ le 9 novembre 2026

Chaque bip reçu est présenté dans une carte lisible permettant deux parcours directs :

- **Accepter** : le destinataire peut accepter le bip directement depuis la carte, sans bip retour ni étape intermédiaire obligatoire.
- **Consulter le profil** : le destinataire peut ouvrir le profil avant de prendre sa décision. La consultation ne vaut jamais acceptation.

Le motif du bip n'est pas affiché et n'est pas inclus dans le périmètre V1.

### Fiche profil superposée

- L'ouverture du profil se fait dans une fiche superposée à la fenêtre du compteur Réel.
- Une commande de retour permet de retrouver la liste des bips.
- Le retour conserve la position de consultation dans la liste et le contexte de la fenêtre.
- Consulter un profil ou revenir à la liste ne réactive pas la présence Réel.

### Visibilité du profil

Depuis ce parcours, seules les informations que le propriétaire a choisi de rendre visibles sont présentées : photo/avatar si disponible, nom affiché et présentation si elle est renseignée et autorisée à être visible. Aucune information privée ou non autorisée ne doit être exposée.

## 11. Acceptation d'un bip — résultat immédiat — VALIDÉ le 9 novembre 2026

Lorsqu'un bip est accepté :

1. Le bip quitte immédiatement « Bips reçus ».
2. La mise en relation correspondante apparaît immédiatement dans « Mes mises en relation ».
3. Les compteurs des deux espaces sont actualisés automatiquement.
4. Une même mise en relation est référencée dans les différents points d'accès ; aucun doublon n'est créé.
5. Une confirmation discrète et brève affiche le message **« Mise en relation établie ! »**.
6. Après la confirmation, l'utilisateur reste dans « Bips reçus » et peut poursuivre sa consultation.

L'acceptation établit la mise en relation immédiatement. Elle ne rend pas obligatoire l'envoi d'un message ; la communication reste soumise aux règles du moteur Communication.

## 12. Présentation et classement de « Mes mises en relation » — VALIDÉ le 9 novembre 2026

Chaque mise en relation est présentée dans une carte cohérente avec le langage visuel des cartes de « Bips reçus ». La carte permet notamment :

- de consulter le profil, dans le respect des paramètres de visibilité ;
- d'accéder à la communication contextuelle autorisée par les règles de Communication ;
- d'ouvrir les options de gestion de la mise en relation.

Les mises en relation sont classées automatiquement de la plus récente à la plus ancienne. Le classement est actualisé lors de chaque nouvelle acceptation.

**Recherche et filtres :** aucune recherche ni aucun filtre de mise en relation ne sont prévus en V1. Une éventuelle évolution sera réexaminée pour une version ultérieure.

## 13. Clôture d'une mise en relation — VALIDÉ le 9 novembre 2026

L'utilisateur peut mettre fin à une mise en relation depuis les options de la carte correspondante.

- Une confirmation explicite est obligatoire avant la clôture afin d'éviter une action accidentelle.
- La clôture est réciproque : la mise en relation est clôturée pour les deux personnes.
- La communication associée est désactivée pour les deux personnes.
- La personne concernée est informée de la clôture.
- La connexion clôturée disparaît immédiatement de « Mes mises en relation » pour les deux utilisateurs.
- Aucun historique visible des mises en relation terminées n'est créé en V1.
- Une trace technique minimale est conservée pour la cohérence et la traçabilité : date de clôture, dernier statut et événement de clôture.
- Cette trace technique ne constitue ni un historique de conversation ni une mise en relation active.

La conception technique devra garantir une clôture cohérente pour les deux utilisateurs, y compris en cas de perturbation réseau ou de synchronisation différée. Les modalités techniques et leurs tests restent à spécifier ; la présente décision produit ne prouve pas que le mécanisme est déjà implémenté.

## 14. Traçabilité complémentaire des arbitrages V1 — 9 novembre 2026

| Sujet | Décision |
|---|---|
| Actions sur une carte de bip reçu | « Accepter » directement ou « Consulter le profil » — VALIDÉ |
| Motif du bip | Hors périmètre V1 — VALIDÉ |
| Consultation du profil | Fiche superposée avec retour à la liste — VALIDÉ |
| Position de la liste au retour | Conservée — VALIDÉ |
| Informations du profil | Uniquement les informations rendues visibles par son propriétaire — VALIDÉ |
| Acceptation | Immédiate, sans bip retour — VALIDÉ |
| Après acceptation | Bip retiré et mise en relation ajoutée immédiatement — VALIDÉ |
| Compteurs après acceptation | Actualisation automatique des deux espaces — VALIDÉ |
| Confirmation d'acceptation | Animation discrète « Mise en relation établie ! » — VALIDÉ |
| Navigation après acceptation | Rester dans « Bips reçus » — VALIDÉ |
| Classement des mises en relation | De la plus récente à la plus ancienne — VALIDÉ |
| Recherche dans les mises en relation | Hors périmètre V1 — VALIDÉ |
| Fin d'une mise en relation | Action disponible depuis la carte — VALIDÉ |
| Confirmation avant clôture | Obligatoire — VALIDÉ |
| Portée de la clôture | Réciproque, pour les deux personnes — VALIDÉ |
| Communication après clôture | Désactivée pour les deux personnes — VALIDÉ |
| Information de l'autre personne | Notification de clôture — VALIDÉ |
| Visibilité après clôture | Retrait immédiat des deux listes « Mes mises en relation » — VALIDÉ |
| Historique utilisateur des clôtures | Aucun historique visible en V1 — VALIDÉ |
| Trace technique de clôture | Date, dernier statut et événement — VALIDÉ |
| Historique de conversation dans la trace | Non — VALIDÉ |

Ces arbitrages complètent les décisions précédentes. Ils restent des exigences produit documentées ; leur réalisation technique, leur résilience réseau et leurs tests doivent être vérifiés séparément avant toute déclaration d'implémentation.
