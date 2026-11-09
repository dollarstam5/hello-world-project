# Réel — vision et cadrage produit

**Projet :** Vitalis  
**Domaine :** moteur Réel  
**Version documentaire :** brouillon de cadrage V1  
**Statut :** vision initiale consignée ; arbitrages fonctionnels à poursuivre  
**Branche de travail :** `reconcile/lot-a-2026-11`  
**Périmètre de ce document :** produit et règles métier. Il ne constitue ni une preuve d'implémentation runtime ni une autorisation de modifier le code.

## 1. Vision

Réel est le moteur de la présence et de la mise en relation instantanée de Vitalis : **« ici, maintenant, tout de suite »**.

Réel ne fonctionne pas comme un moteur de publication. L'utilisateur n'y publie pas un contenu destiné à rester consultable dans une zone. Il active volontairement une visibilité en temps réel et peut l'accompagner d'une description courte indiquant sa disponibilité, son intention ou ce qu'il souhaite faire à cet instant. Les autres personnes également visibles à proximité peuvent alors se découvrir dans un même environnement : salle, stade, campus ou espace public.

La disponibilité est strictement locale pour la première version : elle concerne l'environnement immédiat de l'utilisateur, dans les limites de proximité définies par le produit. La présence cesse d'être visible lorsque l'utilisateur la désactive ou lorsqu'elle expire.

La valeur de Réel repose sur la simultanéité, la proximité physique, le consentement et la mise en relation contrôlée par chaque personne.

## 2. Exemples de descriptions de présence

- « Disponible pour discuter. »
- « Je cherche quelqu'un pour jouer au football maintenant. »
- « Disponible pour un petit travail de 30 minutes. »
- « Je souhaite faire une rencontre maintenant. »

Ces formulations décrivent une présence et une intention immédiates. Elles ne constituent pas des publications autonomes, des annonces persistantes ou un fil de contenus. Les catégories d'activités autorisées restent à définir.

## 3. Mission

Aider une personne à découvrir rapidement ce qui peut se faire autour d'elle, maintenant, et permettre aux personnes intéressées de se mettre en relation sans exposer inutilement leurs informations.

## 4. Principes directeurs

1. **Présence volontaire :** l'utilisateur choisit d'activer sa présence.
2. **Proximité :** les contenus Réel sont pertinents pour un environnement local, pas pour une audience générale.
3. **Instantanéité :** une intention correspond à une disponibilité ou un besoin du moment.
4. **Lisibilité :** chaque carte doit exprimer rapidement qui propose et ce qui est proposé ou recherché.
5. **Contrôle par l'auteur :** manifester son intérêt ne force jamais l'auteur à accepter une mise en relation.
6. **Consentement :** les informations supplémentaires et le contact sont accessibles après l'acceptation de la demande par l'auteur.
7. **Pas de chat libre :** toute conversation est issue d'une mise en relation autorisée et reste liée à son action source.
8. **Simplicité :** limiter les choix, les réglages et les notifications au strict utile.
9. **Confidentialité de la localisation :** la présence s'appuie sur une zone ; les coordonnées exactes ne sont pas exposées aux autres utilisateurs.
10. **Coûts V1 maîtrisés :** privilégier des règles déterministes, des limites d'usage et des échanges de données minimaux.

## 5. Parcours de mise en relation — base produit

1. L'utilisateur active volontairement sa présence dans une zone.
2. Il renseigne une description courte de sa présence, sans créer de publication.
3. Les personnes ayant elles aussi activé leur visibilité dans le même environnement local peuvent se découvrir en temps réel.
4. Une personne consulte une carte de présence à proximité.
5. Le mode d'interaction permettant d'entrer en relation reste **À CONCEVOIR** à partir de la vision de l'utilisateur ; aucun bouton ou mécanisme « Ça m'intéresse » n'est retenu.
6. Les étapes de consentement, de mise en relation et d'accès aux informations complémentaires seront définies avec cette nouvelle approche.
7. Toute communication éventuelle devra respecter les règles de conversation contextualisée déjà validées.

Les étapes 5 et 6 ne constituent pas encore un parcours fonctionnel validé.

Le déclencheur de conversation après acceptation et l'absence de messagerie libre sont des décisions produit déjà validées. Les règles détaillées de fin de conversation, de participants, de blocage et de signalement sont suivies dans la matrice de décisions Communication.

## 6. Informations visibles — première base

La présence peut afficher au minimum :
- le nom affiché de la personne ;
- une description courte de sa disponibilité ou de son intention actuelle.

La forme exacte de cette description (titre, phrase courte ou combinaison des deux) reste à arbitrer. La distinction entre informations visibles avant manifestation d'intérêt et informations révélées après acceptation reste également à préciser. Ne pas exposer par défaut les coordonnées exactes, les informations de contact ou des données personnelles non nécessaires.

## 7. Décisions Réel déjà formulées dans les échanges produit

Les éléments suivants proviennent d'arbitrages antérieurs et doivent être conservés dans la réconciliation documentaire :
- présence volontaire, représentée par une zone ;
- activation et gestion de présence manuelles ;
- rayon configurable, avec un maximum produit précédemment fixé à 1 km ;
- options de proximité fine déjà évoquées : 10 m, 25 m, 50 m et 100 m ;
- durées de présence proposées : 30 min, 1 h, 2 h, 3 h, 6 h, 12 h et 24 h ;
- à expiration, la présence est supprimée ;
- la position actuelle est partagée volontairement ; les coordonnées exactes restent privées ;
- le mécanisme d'interaction et de mise en relation est **À CONCEVOIR** ; l'ancien principe « Ça m'intéresse » est explicitement écarté.

Ces décisions doivent être reliées à leurs exigences et tests dans une matrice de traçabilité Réel. Toute évolution devra être explicitement arbitrée, pas supposée.

## 8. Périmètre documentaire à compléter

| Domaine | État |
|---|---|
| Vision et mission | Première base consignée ; validation détaillée à poursuivre |
| Principes fondamentaux | Première base consignée ; validation détaillée à poursuivre |
| Périmètre V1 / exclusions | À définir |
| Fonctionnalités V1 | À détailler |
| Cartes de présence : nom, description facultative, indication de proximité ; carte géographique non obligatoire | **VALIDÉ V1** |\n| Nouvelle interaction pour entrer en relation (remplace « Ça m'intéresse ») | **À CONCEVOIR avec la vision de l'utilisateur** |
| États de visibilité Visible / Invisible | **VALIDÉ V1** — contrôle volontaire et réversible ; Invisible masque la présence sans fermer l'application ni supprimer les données |\n| Nombre de présences simultanées | **VALIDÉ V1** — une seule présence active par utilisateur ; modification de la présence existante plutôt que cumul |
| Description de présence facultative ; visibilité possible sans texte | **VALIDÉ V1** — la description n'est pas obligatoire pour activer la visibilité |
| Forme et longueur maximale de la description facultative | À préciser |
| Découverte simultanée, actualisation et disponibilité locale | À définir |
| Rayon, présence et expiration | Décisions antérieures à réconcilier et tracer |
| Demande d'intérêt, acceptation et refus | Base déjà définie ; cas limites à préciser |
| Blocage, signalement et sécurité | À relier aux décisions Communication validées |
| Données, permissions et contrats API | À définir après validation fonctionnelle |
| Performance, quotas et coûts | À définir selon le cadre économique V1 |
| Offline et synchronisation | À définir sans promettre une présence locale temps réel hors connexion |
| Interactions avec Flash, Scan, Radar, Trust et Communication | À définir |
| V2 / V3 | À isoler du périmètre V1 |
| Tests d'acceptation et traçabilité | À construire au fil des décisions |

## 9. Garde-fous

- Réel reste un moteur métier indépendant ; il ne doit pas absorber les responsabilités de Flash, Scan ou Radar.
- Réel ne publie pas de contenu persistant : une présence Réel n'est pas une publication Flash.
- La visibilité Réel est simultanée et locale ; elle ne doit pas être confondue avec la disponibilité différée d'une information Flash.
- Une mise en relation Réel n'est pas un message libre.
- La découverte locale ne doit pas révéler la position exacte d'une personne.
- La présence et les intentions expirées ne doivent pas rester visibles comme si elles étaient encore actives.
- Les mécanismes de classement ou de recommandation avancée ne sont pas présumés V1.
- Les documents doivent distinguer décision validée, proposition, point à décider et point à vérifier dans le runtime.

## 10. Prochaine étape de conception

Définir si un utilisateur peut activer plusieurs présences ou descriptions simultanées, ou si une seule présence active est autorisée à la fois. Cette décision conditionne la simplicité de l'interface, les limites V1 et le modèle de données.

## 11. Décision produit validée — description facultative (2026-11-09)

**Statut : VALIDÉ V1.** Un utilisateur peut activer sa présence Réel et devenir visible à proximité sans renseigner de description. La description est facultative ; elle permet, si l'utilisateur le souhaite, de préciser brièvement sa disponibilité ou son intention actuelle. L'activation de la présence ne dépend donc pas de la rédaction d'un texte. La forme et la longueur maximale de cette description restent à définir.

## 12. Décision produit validée — états de visibilité (2026-11-09)

**Statut : VALIDÉ V1.** La visibilité Réel repose sur deux états contrôlés par l'utilisateur :

- **Visible :** la présence active peut être découverte par les autres personnes à proximité, selon les règles de zone et de durée applicables.
- **Invisible :** la présence n'est plus présentée aux autres utilisateurs, même si l'application reste ouverte.

Le passage en mode Invisible est réversible et ne supprime ni le compte, ni le profil, ni les autres données de l'utilisateur. Il agit sur la découvrabilité de la présence Réel uniquement. Il ne doit pas être interprété comme une déconnexion du compte ou une suppression de la présence enregistrée.

**Conséquence UX V1 :** l'état de visibilité doit être compréhensible en un coup d'œil et modifiable simplement, sans parcours complexe. L'interface doit confirmer clairement à l'utilisateur lorsqu'il n'est plus découvrable.

**Règles associées validées :** le décompte de la durée continue normalement en mode Invisible. Si l'utilisateur repasse en mode Visible avant l'expiration, sa présence redevient découvrable uniquement pour le temps restant. Si la durée arrive à son terme en mode Invisible, la présence expire normalement et ne peut pas être réactivée.

## 13. Décision produit validée — durée pendant l'invisibilité (2026-11-09)

**Statut : VALIDÉ V1.** Le passage en mode Invisible ne suspend et ne réinitialise pas la durée de la présence Réel.

- La présence cesse immédiatement d'être découvrable par les autres utilisateurs.
- Le compte à rebours continue normalement à partir de l'heure d'expiration initialement définie.
- Si l'utilisateur repasse en mode Visible avant l'expiration, la présence redevient découvrable pour le temps restant uniquement.
- Si la durée arrive à son terme pendant que la présence est Invisible, elle expire normalement et ne peut pas être réactivée ; l'utilisateur devra créer/activer une nouvelle présence s'il souhaite redevenir visible.

Cette règle évite qu'une présence masquée puisse être conservée indéfiniment et garantit que la durée choisie par l'utilisateur reste effective.

## 14. Décision produit validée — une seule présence active (2026-11-09)

**Statut : VALIDÉ V1.** Un utilisateur ne peut avoir qu'une seule présence Réel active à la fois.

- L'utilisateur peut modifier la description facultative et les paramètres autorisés de sa présence existante.
- Il ne peut pas créer une deuxième présence active en parallèle.
- Pour exprimer une nouvelle intention, il modifie sa présence actuelle plutôt que d'en cumuler plusieurs.
- La modification ne doit pas créer de présence concurrente ni contourner les règles de visibilité et d'expiration déjà validées.

**Motifs produit :** réduire la charge mentale, éviter les intentions contradictoires, simplifier la gestion de la visibilité et de l'expiration, et limiter les données et traitements nécessaires en V1.

**Règle de modification validée :** la description facultative et le rayon peuvent être modifiés pendant que la présence est active. Les changements prennent effet immédiatement et ne suspendent pas la présence ni ne réinitialisent sa durée.

## 15. Décision produit validée — modification d'une présence active (2026-11-09)

**Statut : VALIDÉ V1.** L'utilisateur peut modifier sa présence Réel pendant qu'elle est active et visible, sans devoir la désactiver ni en créer une nouvelle.

- La description facultative peut être modifiée.
- Le rayon de visibilité peut être modifié, dans les limites V1 déjà définies.
- Les changements prennent effet immédiatement pour la découverte à proximité.
- La modification ne suspend pas la présence et ne remet pas son compte à rebours à zéro : l'heure d'expiration initialement choisie est conservée.
- La règle d'une seule présence active par utilisateur reste applicable.

Cette décision vise une gestion souple et simple de la présence, sans multiplier les étapes ni permettre de prolonger implicitement sa durée.

## 16. Décision produit validée — masquer ou terminer une présence (2026-11-09)

**Statut : VALIDÉ V1.** L'utilisateur dispose de deux actions distinctes pour gérer sa présence :

1. **Masquer temporairement :** la présence passe en mode Invisible et cesse immédiatement d'être découvrable. Elle reste active jusqu'à son expiration ; son compte à rebours continue normalement. L'utilisateur peut la rendre visible à nouveau avant l'expiration, pour le temps restant.
2. **Terminer ma présence :** la présence est clôturée immédiatement. Elle ne peut pas être réactivée. Pour redevenir visible, l'utilisateur doit créer/activer une nouvelle présence, dans le respect de la limite d'une seule présence active.

**Conséquence UX :** les deux actions doivent être nommées et différenciées sans ambiguïté. Masquer est réversible avant expiration ; terminer est définitif pour cette présence. Une confirmation explicite avant la fin définitive est recommandée afin d'éviter une suppression accidentelle.

## 17. Décision produit validée — aucune reconduction automatique (2026-11-09)

**Statut : VALIDÉ V1.** Une présence Réel arrivée à expiration n'est jamais renouvelée ni réactivée automatiquement.

- À l'expiration, la présence cesse d'être découvrable et est supprimée conformément à la règle d'expiration déjà définie.
- Pour redevenir visible, l'utilisateur doit lancer volontairement une nouvelle activation.
- Il choisit à nouveau la durée et le rayon applicables à cette nouvelle présence.
- Aucune ancienne description ou intention expirée ne redevient visible sans une nouvelle action explicite de l'utilisateur.

**Conséquence UX :** l'interface peut proposer une action claire pour recommencer, mais ne doit pas présenter cette proposition comme une reconduction déjà activée. La nouvelle présence constitue une nouvelle activation et un nouveau cycle de durée.

## 18. Décision produit validée — cartes de présence et nouvelle interaction à concevoir (2026-11-09)

**Statut : présentation des cartes VALIDÉE V1 ; mécanisme d'interaction À CONCEVOIR.**

Chaque présence à proximité est présentée sous forme de carte simple. La carte affiche :

- le nom affiché de la personne ;
- sa description facultative, lorsqu'elle existe ;
- une indication qualitative de proximité, sans coordonnées exactes.

Une carte géographique n'est pas obligatoire pour découvrir les présences. L'interface privilégie la lecture immédiate et la simplicité.

**Correction produit explicite :** le bouton et le mécanisme « Ça m'intéresse » sont abandonnés. Ils ne doivent pas être renommés ni réintroduits sous une autre forme par défaut. L'utilisateur souhaite définir une nouvelle approche d'interaction à partir de sa propre vision. Aucun libellé, bouton, geste, demande ou enchaînement de mise en relation n'est donc décidé à ce stade.

**Conséquence documentaire :** les anciens passages décrivant « Ça m'intéresse » comme un mécanisme validé sont remplacés par un point ouvert. Les règles déjà validées sur le consentement, la conversation contextualisée, le blocage et le signalement restent des contraintes à prendre en compte lors de la conception du nouveau parcours, sans préjuger de son fonctionnement.

## 19. Vision utilisateur — découverte spatiale et humaine (2026-11-09)

**Statut : VISION UTILISATEUR CONSIGNÉE — spécification et validation détaillée à poursuivre.** Cette section retranscrit la vision exprimée par l'utilisateur ; elle ne transforme pas encore chaque détail d'interface en règle technique définitive.

### 19.1 Vue spatiale centrée sur l'utilisateur

La page Réel doit proposer une représentation vivante de la présence locale : le profil de l'utilisateur se trouve au centre de la zone d'affichage et les profils des autres personnes présentes apparaissent autour de lui, dans une représentation circulaire avec des rayons visuels fixes. Cette représentation est symbolique et ne doit pas révéler les coordonnées GPS exactes des personnes.

Les profils visibles représentent les présences actives et découvrables dans le même environnement local. Leur apparition et leur disparition doivent suivre les changements réels de disponibilité, sans donner l'impression d'une carte géographique précise.

### 19.2 Regroupement et indicateurs numériques

Dans un même lieu (par exemple salle de réunion, salle de classe, événement ou concert), plusieurs profils proches visuellement peuvent être regroupés. Un indicateur numérique affiche le nombre de profils disponibles dans ce regroupement (exemple : 5 ou 6).

L'indicateur est cliquable. Il ouvre un modal ou une liste dynamique présentant les profils concernés. Le nombre indiqué doit correspondre exactement aux profils effectivement affichés dans la liste au moment de son ouverture/actualisation ; les profils devenus indisponibles ne doivent pas être comptés comme présents.

### 19.3 Consultation d'un profil

L'utilisateur peut sélectionner un profil qui attire son attention, notamment à partir de sa description de présence. Le contenu exact de la fiche profil et les actions possibles après consultation restent à concevoir avec l'utilisateur.

### 19.4 Bascule vers une vue liste

L'utilisateur peut transformer la vue spatiale en une vue liste dynamique des présences. Les deux modes doivent représenter le même ensemble de présences locales et rester cohérents lors des actualisations. La bascule de vue ne doit pas changer la présence active de l'utilisateur ni réinitialiser sa durée.

### 19.5 Intention d'expérience

L'expérience doit être vivante, humaine, simple et lisible. Elle ne doit pas devenir un tableau de bord technique ou un radar anxiogène. Les rayons servent à organiser visuellement les profils et les regroupements, pas à communiquer une distance exacte.

### 19.6 Points ouverts

- comportement exact au toucher d'un profil individuel ;
- contenu de la fiche de profil et informations visibles avant toute interaction ;
- nouvelle approche d'interaction entre deux personnes, sans reprendre « Ça m'intéresse » ;
- règles exactes de regroupement spatial et de calcul du nombre affiché ;
- comportement de la vue spatiale et de la liste lorsque les présences arrivent, disparaissent ou changent de visibilité ;
- accessibilité et alternative à la représentation spatiale pour les personnes qui préfèrent une liste.


## 20. Décision produit validée — fiche compacte au clic sur un profil (2026-11-09)

**Statut : VALIDÉ V1.** Lorsqu'un utilisateur touche un profil dans la vue spatiale Réel, une petite fiche de profil apparaît directement sur la page, au-dessus de la représentation spatiale.

- La fiche est compacte et ne prend pas tout l'écran.
- La page Réel et les autres présences restent dans leur contexte visuel ; l'utilisateur ne quitte pas la vue spatiale.
- La fiche doit être rapide à consulter et facile à fermer.
- Le contenu précis de la fiche et les actions proposées après consultation restent **À CONCEVOIR** avec l'utilisateur.

Cette présentation est distincte d'une grande fiche plein écran. Elle préserve la continuité de la découverte locale et limite la charge cognitive.


## 21. Décision produit validée — contenu essentiel de la fiche compacte (2026-11-09)

**Statut : VALIDÉ V1.** La fiche compacte affichée lorsqu'un utilisateur sélectionne un profil dans la vue spatiale contient uniquement les éléments essentiels suivants :

1. **Photo ou avatar** de la personne.
2. **Nom affiché** de la personne.
3. **Description de présence**, lorsqu'elle a été renseignée.

La description étant facultative, son absence ne doit pas empêcher la consultation du profil ni créer un emplacement vide inutile. La fiche reste compacte et ne présente pas d'autres informations ou actions à ce stade. Toute extension de son contenu devra faire l'objet d'un arbitrage distinct.


## 22. Décision produit validée — bip et acceptation directe pour le jumelage (2026-11-09)

**Statut : PARCOURS DE PRINCIPE VALIDÉ V1 — règles de détail à préciser.** Le mécanisme de mise en relation de Réel repose sur un signal volontaire appelé provisoirement **« bip »**. Le bip permet à une personne de faire discrètement signe à un profil qu'elle souhaite contacter, sans envoyer de message libre et sans déclencher automatiquement une conversation.

### 22.1 Envoyer un bip depuis la fiche compacte

La fiche compacte d'un profil comporte un petit bouton **« Biper »**. En l'utilisant, la personne manifeste son souhait d'entrer en contact avec le profil sélectionné.

Le bip est un signal d'intérêt, pas un message. Il ne crée pas à lui seul un jumelage et n'ouvre pas de conversation.

### 22.2 Compteur des bips reçus

La page Réel présente en bas un compteur permettant à l'utilisateur de voir combien de personnes lui ont envoyé un bip. Ce compteur donne accès à la consultation des bips reçus.

Le compteur et son accès doivent rester simples, visibles et compréhensibles, sans détourner l'attention de la découverte des présences locales.

### 22.3 Liste des personnes ayant envoyé un bip

Lorsque l'utilisateur touche le compteur, une fenêtre s'ouvre sous la forme d'une **bottom sheet** ou d'un modal. Elle présente les profils des personnes qui lui ont envoyé un bip, avec les éléments essentiels déjà retenus pour les profils : avatar ou photo, nom affiché et description de présence lorsqu'elle existe.

### 22.4 Accepter directement — parcours court validé

**Décision utilisateur : option B — VALIDÉE V1.** Depuis cette liste, l'utilisateur peut appuyer directement sur le bouton **« Accepter »** associé à un profil. Il n'a pas besoin de renvoyer un bip ni de suivre un échange de signaux réciproques.

L'acceptation confirme le jumelage entre les deux personnes et autorise l'étape de communication contextualisée selon les règles Vitalis. Le bip initial seul ne donne jamais accès à une conversation.

### 22.5 Principes et limites

- Le bip est volontaire et déclenché par l'utilisateur.
- Recevoir un bip n'oblige jamais à accepter.
- L'acceptation est une action explicite du destinataire.
- Le parcours doit rester court : consulter les bips reçus, puis accepter directement si l'utilisateur le souhaite.
- Le mécanisme ne réintroduit pas « Ça m'intéresse », ni sous ce nom ni sous une autre forme : le bip constitue l'approche nouvelle exprimée par l'utilisateur.
- Le détail de la conversation après jumelage reste soumis aux règles du moteur Communication ; aucune messagerie libre n'est créée.

### 22.6 Points restant à arbitrer

- comportement exact après l'envoi d'un bip et confirmation visuelle pour son expéditeur ;
- possibilité ou non de retirer un bip envoyé ;
- règles contre les bips répétés ou abusifs et limites V1 ;
- comportement d'un bip lorsque la présence de l'expéditeur expire ou devient invisible ;
- actions disponibles pour refuser, ignorer, bloquer ou signaler un profil ;
- état et mise à jour du compteur après acceptation, refus ou expiration ;
- libellé final du mécanisme si « bip » reste un nom de travail ;
- contenu et comportement précis de la conversation contextualisée après acceptation.

Ces points restent ouverts et ne doivent pas être considérés comme implémentés ou décidés par anticipation.


## 23. Décision produit validée — caractère éphémère des bips et conservation des jumelages (2026-11-09)

**Statut : VALIDÉ V1.** Réel est une expérience instantanée. Les bips ne constituent pas un historique et ne sont pas conservés après la fin du contexte de présence.

### 23.1 Aucun historique de bips

- L'envoi d'un bip ne crée pas d'historique consultable par son expéditeur.
- Les bips reçus sont consultables par le destinataire uniquement dans le contexte de sa présence Réel active.
- Aucun journal des bips envoyés ou reçus n'est proposé dans Réel.
- Le produit ne doit pas afficher après coup une liste des personnes bipées ou des bips reçus qui ont expiré.

### 23.2 Fin du contexte Réel

À la fermeture de la présence ou à la déconnexion de l'utilisateur, les bips non convertis en jumelage sont supprimés et ne sont plus accessibles dans Réel.

Cette règle s'applique aux bips en attente, qu'ils aient ou non été consultés. Un bip ne doit pas survivre comme sollicitation en attente après la fin du contexte instantané auquel il appartient.

### 23.3 Seules les mises en relation acceptées sont conservées

Lorsqu'un destinataire appuie sur **« Accepter »**, la mise en relation devient une relation validée. Seules ces mises en relation acceptées sont conservées selon les règles du moteur Communication et les règles de conservation Vitalis applicables.

Un bip non accepté ne devient jamais une mise en relation et ne doit pas être conservé comme historique.

### 23.4 Conséquences produit et techniques à respecter

- Le compteur représente uniquement les bips encore actifs dans le contexte Réel courant ; il ne représente jamais un total historique.
- La disparition des bips à la fermeture de la présence ou à la déconnexion doit être cohérente dans l'interface et dans les données.
- Les mises en relation acceptées doivent être séparées des bips éphémères afin que leur conservation ne dépende pas de la durée de vie de la présence Réel.
- Les modalités techniques de suppression, de synchronisation et de gestion des cas de déconnexion restent à spécifier et à vérifier ; cette décision produit ne constitue pas une preuve d'implémentation.
