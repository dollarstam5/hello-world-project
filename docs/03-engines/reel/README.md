# Réel — vision et cadrage produit

**Projet :** Vitalis  
**Domaine :** moteur Réel  
**Version documentaire :** brouillon de cadrage V1  
**Statut :** vision initiale consignée ; arbitrages fonctionnels à poursuivre  
**Branche de travail :** `reconcile/lot-a-2026-11`  
**Périmètre de ce document :** produit et règles métier. Il ne constitue ni une preuve d'implémentation runtime ni une autorisation de modifier le code.

## 1. Vision

Réel est le moteur de la présence et des opportunités immédiates de Vitalis : **« ici, maintenant, tout de suite »**.

Il permet aux personnes qui se trouvent dans un même environnement local de rendre visible une intention, une demande ou une proposition valable dans le présent. Plusieurs personnes peuvent être présentes dans un même secteur et découvrir les intentions publiées par les autres.

Réel n'est pas un réseau social généraliste ni un fil d'actualité à consulter sans objectif. Sa valeur repose sur la proximité, l'instant présent, la clarté de l'intention et une mise en relation contrôlée par son auteur.

## 2. Exemples d'intentions

- « Je veux discuter avec une voisine. »
- « J'offre un plat de nourriture à la première personne qui arrive. »
- « J'ai un petit travail de 30 minutes à proposer maintenant. »
- « Je souhaite faire une rencontre maintenant. »

Ces exemples illustrent des usages possibles ; ils ne constituent pas encore une taxonomie exhaustive ni une autorisation de toutes les catégories d'activité.

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
2. Il publie une intention immédiate.
3. Les personnes présentes dans le secteur peuvent découvrir cette intention.
4. Une personne intéressée sélectionne la carte et manifeste son intérêt.
5. L'auteur reçoit la demande et choisit d'accepter ou de refuser.
6. En cas d'acceptation, la mise en relation est créée ; les informations complémentaires autorisées deviennent accessibles au demandeur.
7. Les participants peuvent alors communiquer dans le contexte de cette mise en relation.
8. En cas de refus, aucune conversation n'est ouverte.

Le déclencheur de conversation après acceptation et l'absence de messagerie libre sont des décisions produit déjà validées. Les règles détaillées de fin de conversation, de participants, de blocage et de signalement sont suivies dans la matrice de décisions Communication.

## 6. Informations visibles — première base

La vision exprimée prévoit au minimum :
- le nom affiché de l'auteur ;
- un titre court qui exprime son intention ;
- une description qui apporte le contexte utile.

La distinction entre informations visibles avant intérêt et informations révélées après acceptation reste à préciser. Ne pas exposer par défaut les coordonnées exactes, les informations de contact ou des données personnelles non nécessaires.

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
| Règles de publication et nombre d'intentions actives | À décider |
| Découverte, tri et actualisation locale | À définir |
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
- Une intention Réel n'est pas automatiquement une publication Flash.
- Une mise en relation Réel n'est pas un message libre.
- La découverte locale ne doit pas révéler la position exacte d'une personne.
- La présence et les intentions expirées ne doivent pas rester visibles comme si elles étaient encore actives.
- Les mécanismes de classement ou de recommandation avancée ne sont pas présumés V1.
- Les documents doivent distinguer décision validée, proposition, point à décider et point à vérifier dans le runtime.

## 10. Prochaine étape de conception

Définir la règle de publication : un utilisateur peut-il avoir plusieurs intentions Réel actives en même temps, ou une seule intention active à la fois ? Cette décision conditionne la simplicité de l'interface, les limites V1, les notifications et le modèle de données.
