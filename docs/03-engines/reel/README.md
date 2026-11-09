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
4. Une personne intéressée sélectionne la présence et manifeste son intérêt.
5. L'auteur reçoit la demande et choisit d'accepter ou de refuser.
6. En cas d'acceptation, la mise en relation est créée ; les informations complémentaires autorisées deviennent accessibles au demandeur.
7. Les participants peuvent alors communiquer dans le contexte de cette mise en relation.
8. En cas de refus, aucune conversation n'est ouverte.

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
- la mise en relation suit le principe « Ça m'intéresse » → décision de l'auteur → connexion ; un refus n'ouvre aucune conversation.

Ces décisions doivent être reliées à leurs exigences et tests dans une matrice de traçabilité Réel. Toute évolution devra être explicitement arbitrée, pas supposée.

## 8. Périmètre documentaire à compléter

| Domaine | État |
|---|---|
| Vision et mission | Première base consignée ; validation détaillée à poursuivre |
| Principes fondamentaux | Première base consignée ; validation détaillée à poursuivre |
| Périmètre V1 / exclusions | À définir |
| Fonctionnalités V1 | À détailler |
| Carte, fiche et informations révélées | À arbitrer |
| États de visibilité Visible / Invisible | **VALIDÉ V1** — contrôle volontaire et réversible ; Invisible masque la présence sans fermer l'application ni supprimer les données |\n| Nombre de présences simultanées | À décider |
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

**Points à préciser ultérieurement :** comportement exact d'une présence mise en Invisible (mise en pause ou retrait temporaire du flux de découverte), traitement de sa durée pendant cette période, et reprise de visibilité. Ces détails ne sont pas implicitement décidés ici.
