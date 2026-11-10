# Catalogue des contenus d'exemple par interface — V1

**Statut :** scénarios éditoriaux révisés pour représenter des besoins quotidiens concrets ; chaque fixture reste soumise à la validation du contrat de son domaine.  
**Branche de travail :** `docs/language-audit-v1`.  
**Décisions déjà validées :** affichage progressif selon la quantité de données réelles ; marqueur visible « Exemple » sur chaque contenu fictif.

## 1. But

Préparer chaque écran avec des contenus plausibles qui expliquent immédiatement son utilité, sans créer de fausses activités. Les exemples doivent donner l'impression d'une application vivante et prête à servir, mais jamais faire croire qu'un utilisateur, une présence, une demande ou une notification fictive est réel.

Les contenus ci-dessous sont des scénarios éditoriaux. Avant leur implémentation, chaque fixture doit être adaptée aux types et contrats réellement présents dans le domaine concerné. Aucun champ, statut ou identifiant métier ne doit être inventé dans le code.

## 2. Règles communes

- Tous les exemples sont déterministes, locaux, en lecture seule et détenus par leur domaine.
- Chaque élément porte une provenance explicite `demo` et affiche le libellé « Exemple » / « Example ».
- Les données réelles restent prioritaires. Les exemples ne complètent l'écran que si le domaine juge les données réelles insuffisantes.
- Les exemples disparaissent de la liste principale dès que le seuil de suffisance propre à l'écran est atteint.
- Les exemples ne sont jamais écrits dans Dexie, l'outbox ou Supabase.
- Aucun exemple ne crée de notification, message, relation, bip, présence, disponibilité, réservation ou événement réel.
- Toute action qui pourrait être comprise comme une action réelle est désactivée dans les exemples ou ouvre une explication claire.
- Les noms, lieux et entreprises utilisés sont fictifs. Ne pas utiliser de photos de personnes réelles ni de coordonnées réelles.
- Les textes sont disponibles en français et en anglais naturel.
- Ne pas charger les exemples avant la fin du chargement des données réelles.

## 3. Catalogue par interface

### 3.1 Accueil

**Rôle de l'écran :** aider à comprendre où commencer et montrer les possibilités de Vitalis.

Contenus préparés et première présentation intégrée :
- une grande salutation en haut de page, lisible sur mobile et adaptée à la langue ; en mode invité : « Bonjour et bienvenue chez Vitalis ! » ;
- une courte phrase d'accueil qui explique simplement l'utilité de Vitalis ;
- quatre accès aux espaces principaux : Flash, Scan, Réel et Radar ;
- trois aperçus Flash concrets, affichés dans une section pédagogique distincte et chacun marqué « Exemple » : garde d’enfants le week-end, aide au déménagement dans deux heures et deux personnes pour la vaisselle après une réunion du dimanche vers 15 h à Dakar ;
- une indication discrète pour retrouver les espaces complémentaires dans le menu 2×2.

Les aperçus d'accueil sont des exemples de présentation, pas une activité en direct : ils ne sont ni des publications d'utilisateurs, ni des notifications, ni des compteurs. Leurs textes sont localisés en français et en anglais. Ils ne sont jamais interactifs et ne sont pas injectés dans un flux métier.

Exemple de salutation :
- FR : « Bonjour et bienvenue chez Vitalis ! »
- EN : « Hello, and welcome to Vitalis! »

Ne pas afficher de faux compteurs d'activité, de personnes connectées ou de notifications.

### 3.2 Flash

**Rôle :** publier et consulter des besoins, offres, opportunités ou disponibilités.

Jeu éditorial révisé — des demandes formulées comme une personne les exprimerait :
1. « Je cherche une personne de confiance pour garder mes enfants ce week-end. »
2. « J’aurais besoin d’un coup de main pour mon déménagement dans deux heures. »
3. « Je cherche une personne pour veiller auprès d’un parent âgé pendant quelques heures chaque jour cette semaine. »
4. « Je cherche un emploi et je peux commencer dans une heure si une occasion se présente. »
5. « Après notre réunion de dimanche, vers 15 h, nous cherchons deux personnes pour aider à faire la vaisselle. »
6. « Nous préparons la cuisine pour les membres de notre réunion à Dakar. Un coup de main serait le bienvenu. »

Les demandes de garde d’enfants et d’accompagnement d’une personne âgée doivent rester sobres, sans détails personnels, et rappeler que la confiance et les vérifications adaptées comptent. Ne pas inventer de salaire, d'employeur, de qualification ou de disponibilité confirmée.

Chaque élément doit utiliser uniquement les catégories, créneaux et champs déjà prévus par `FlashRecord` et les contrats partagés. Les noms d'auteurs, zones et dates sont clairement fictifs ou génériques. Ne pas inventer de réputation, de validation ou de nombre de réponses.

### 3.3 Scan

**Rôle :** montrer comment rechercher ou identifier des informations utiles autour d'un besoin.

Préparer 3 résultats pédagogiques, pas des identifications prétendument vérifiées :
- « Aide pour un déménagement » — exemple de mots-clés pour retrouver un service adapté ;
- « Garde d’enfants le week-end » — exemple de besoin à rechercher, sans afficher de profil ni de disponibilité fictive ;
- « Préparation de repas pour une réunion à Dakar » — exemple de recherche formulée en langage courant.

L'écran doit distinguer clairement un exemple d'un résultat réellement obtenu par une recherche. Ne jamais afficher une distance précise, une disponibilité en direct, un score de confiance ou un statut vérifié fictifs.

Si Scan ne peut pas afficher des exemples sans les faire passer pour des résultats de recherche, préférer une courte scène d'explication statique portant le marqueur « Exemple ».

### 3.4 Réel

**Rôle :** permettre de voir et de contacter les personnes réellement présentes dans une zone, au moment présent.

**Règle renforcée : aucune fausse présence à proximité.**

Ne jamais injecter de profils fictifs dans le rayon réel, dans le compteur de personnes proches, dans la liste des personnes présentes ou dans les bips reçus.

Pour préparer l'interface :
- utiliser une scène d'aperçu séparée, explicitement marquée « Exemple » ;
- montrer une carte illustrative d'un profil fictif sans distance ni position réelle ;
- montrer le fonctionnement du bouton de signal dans un tutoriel non interactif ou désactivé ;
- afficher un état vide utile lorsque personne n'est réellement présent : expliquer simplement comment activer sa propre présence.

Aucun bip, lien, message ou compteur fictif ne doit être généré.

### 3.5 Radar

**Rôle :** découvrir et suivre des recherches ou opportunités dans une zone et pendant une période définies.

Préparer 3 à 4 exemples de recherches, adaptés au schéma réel :
- « Trouver une personne de confiance pour garder les enfants ce week-end »
- « Trouver une aide pour un déménagement dans deux heures »
- « Chercher un emploi avec une prise de poste rapide »
- « Trouver une personne pour accompagner un parent âgé pendant une période définie »
- « Organiser une aide pour la cuisine lors d’une réunion à Dakar »

Les exemples doivent respecter les catégories, rayons, durées et statuts réellement autorisés par le schéma Radar. Ne pas fabriquer de nombre de correspondances, de dernière activité ou de disponibilité en temps réel.

Les exemples sont consultables en aperçu mais ne peuvent pas être activés, renouvelés ou annulés comme une vraie recherche. Les durées, rayons et états affichés doivent provenir des choix réellement autorisés, jamais d'une disponibilité inventée.

### 3.6 Menu 2×2 et espaces complémentaires

Le menu doit expliquer chaque espace sans simuler une activité :
- une description claire de son utilité ;
- une illustration ou un exemple statique marqué « Exemple » lorsqu'elle apporte une vraie compréhension ;
- un état « bientôt disponible » uniquement si la fonction n'est réellement pas implémentée.

Ne pas remplir les tuiles avec des faux nombres, des badges de nouveauté artificiels ou des compteurs.

### 3.7 Profil et identité

Préparer un profil de démonstration isolé, présenté dans un aperçu et non comme un compte connecté :
- prénom fictif ;
- courte présentation ;
- domaines d'intérêt ;
- compétences ou activités, uniquement si ces champs existent déjà ;
- indicateur « Exemple » visible sur l'ensemble du profil.

Ne pas attribuer de niveau de confiance, de vérification, de badge officiel ou d'historique fictif. Ne pas créer de faux compte dans le système d'identité.

### 3.8 Centre de communication

Le centre comporte quatre onglets : Notifications, Assistant, Messages et Réel.

**Notifications**
- Ne pas injecter de fausses notifications dans la boîte réelle.
- Si une explication est utile, afficher un aperçu pédagogique isolé montrant à quoi ressemble une notification, marqué « Exemple » et sans compteur non lu.

**Assistant**
- Préparer 3 questions d'exemple que la personne peut choisir pour découvrir l'assistant :
  - « Comment publier un besoin ? »
  - « Quelle est la différence entre Flash et Radar ? »
  - « Comment protéger ma position dans Réel ? »
- Les questions suggérées ne doivent pas être présentées comme des messages déjà envoyés.

**Messages**
- Ne pas créer de fausses conversations dans la boîte réelle.
- Prévoir un état vide chaleureux qui explique que les échanges apparaissent après une mise en relation ou une action acceptée.
- Une scène de démonstration éventuelle doit être séparée de la boîte et porter le marqueur « Exemple ».

**Réel**
- Ne pas créer de faux bips ni de relations.
- Expliquer que les bips reçus apparaissent lorsque la présence est active et qu'une personne envoie réellement un signal.

### 3.9 Assistant Vita

Préparer des suggestions de départ et quelques exemples de réponses courtes :
- aide à choisir le bon moteur ;
- explication des règles de confidentialité ;
- aide à comprendre les étapes d'une action V1.

Les exemples doivent rester cohérents avec les capacités réellement disponibles en V1. Ils ne doivent pas simuler une compréhension libre, une action accomplie, un accès à des données privées ou une capacité adaptative réservée à V2/V3. Les réponses fictives sont montrées comme exemples pédagogiques, jamais ajoutées à l'historique de conversation réel.

### 3.10 Compte, connexion et permissions

Préparer des explications et exemples de saisie uniquement pour illustrer les champs existants :
- exemple de format d'adresse e-mail ;
- exemple de nom d'affichage ;
- explication de la permission de position avant Scan ou Réel.

Ne jamais préremplir un vrai formulaire avec des identifiants utilisables, des mots de passe ou des coordonnées personnelles fictives qui pourraient être soumis par erreur. Les exemples de saisie restent des placeholders, pas des valeurs enregistrées.

### 3.11 Administration

L'administration utilise des données réelles autorisées et des environnements de test isolés. Ne pas injecter de données de démonstration dans les indicateurs de production, les audits, les utilisateurs, les rôles, les notifications ou les journaux.

Pour présenter l'interface, utiliser un environnement de démonstration distinct, explicitement signalé, avec des données synthétiques sans identifiants réels.

## 4. Seuils de suffisance

Ne pas appliquer un seuil numérique global. Le seuil est défini pour chaque surface en fonction de son objectif :
- Accueil : assez de données pour expliquer les usages, sans faux indicateurs d'activité.
- Flash : diversité suffisante pour comprendre les principaux types de publications.
- Scan : ne pas mélanger les résultats réels et les scénarios pédagogiques.
- Réel : zéro présence fictive dans la zone active ; aperçu pédagogique séparé seulement.
- Radar : variété d'exemples de recherches, sans fausses correspondances.
- Profil : aperçu isolé, jamais une identité réelle.
- Communication : aucun faux événement dans les boîtes réelles.
- Assistant : suggestions de départ, pas de conversations préchargées.
- Administration : environnement de démonstration séparé uniquement.

Le domaine doit définir et tester le critère exact avant de coder le sélecteur progressif.

## 5. Critères de validation avant implémentation

Pour chaque interface, vérifier :
1. Le contrat ou type réel qui décrit les données.
2. Le propriétaire du domaine et l'emplacement des fixtures.
3. Les surfaces où le marqueur « Exemple » doit rester visible.
4. Le seuil de suffisance et le comportement lorsque le chargement réel est en cours.
5. Les actions désactivées et les explications affichées.
6. La séparation stricte avec Dexie, outbox, Supabase et les événements réels.
7. Les textes FR/EN et leur accessibilité.
8. Les tests de tri, filtrage, fusion, détail, hors connexion et synchronisation.

## 6. Ordre de préparation recommandé

1. Catalogue i18n commun et états généraux.
2. Accueil et Flash.
3. Scan et Radar.
4. Réel avec règle stricte d'absence de fausses présences.
5. Profil et menu 2×2.
6. Centre de communication et Assistant.
7. Compte, permissions et écrans secondaires.
8. Administration et environnements de démonstration isolés.

**Important :** ce catalogue prépare les contenus et les règles de présentation. Il ne prouve pas que les jeux de données sont déjà codés ni que les écrans sont déjà conformes. La création des fixtures doit suivre l'inspection des contrats de chaque domaine.


## 7. Contrats techniques vérifiés — préparation des fixtures

Cette section remplace les suppositions éditoriales par les formes réellement présentes dans le dépôt (lecture de main, commit 9d8446c). Elle ne crée pas encore de données dans l'application.

### Flash — deux formes à ne pas confondre

- FlashRecord (packages/core-contracts/src/records.ts) est l'enregistrement local synchronisable : enveloppe id, createdAt, updatedAt, revision, deletedAt, puis authorId, title, body, status, expiresAt, mediaIds et les champs optionnels kind, category, timeSlot, areaLabel.
- PublicFlash (packages/core-contracts/src/flash.ts) est la forme publique minimale : id, kind, category, title, timeSlot, areaLabel, expiresAt, createdAt. Elle n'expose ni auteur, ni coordonnées, ni corps complet.
- Les catégories autorisées sont personal, professional, commercial, home, transport, food, education, health, events, other. Les types sont offer / need, les créneaux now / today / tomorrow / this_week.
- Décision d'implémentation : ne jamais réutiliser une fixture publique comme enregistrement local ni contourner l'enveloppe synchronisable. Les exemples d'interface restent séparés du dépôt local et ne sont pas créés via createFlash.

### Scan — résultat public avec distance obligatoire

ScanResult (packages/core-contracts/src/scan.ts) contient id, kind, category, title, timeSlot, areaLabel, distanceKm, createdAt et expiresAt. L'écran affiche explicitement distanceKm.

Le scan envoie actuellement latitude et longitude au serveur dans ScanQuery, avec rayon et limite. La position n'est pas affichée comme coordonnée publique, mais il serait inexact de dire qu'elle n'est jamais partagée. En conséquence :
- aucun faux ScanResult ne sera injecté dans les résultats réels ;
- l'aperçu de démonstration sera une scène explicative distincte, sans distance inventée ;
- le texte de confidentialité devra dire que la position est utilisée temporairement pour effectuer la recherche et n'est pas affichée aux autres personnes, après vérification du traitement serveur.

### Radar — demandes et cycle de vie

RadarDraftInput contient exactement title, query, category, areaLabel, radiusKm, startsAt, expiresAt. RadarRecord ajoute l'enveloppe BaseRecord, ownerId, status, nextReviewAt, lastReviewedAt.

- Rayons autorisés : 1, 3, 5, 10, 25 ou 50 km.
- Durée autorisée : 3 à 90 jours.
- Statuts connus : draft, active, watching, matched, paused, expired, cancelled.
- Les aperçus ne sont pas des RadarRecord activables : ne pas inventer de propriétaire, de correspondance, de date de contrôle ou d'état métier.

### Assistant — messages de conversation

Le hook V1 utilise des messages d'interface { id, role, content }, avec role égal à user ou assistant. Les suggestions de départ sont des raccourcis de questions, pas des messages de conversation déjà envoyés. Les réponses d'exemple doivent rester dans une carte pédagogique séparée et ne jamais être ajoutées à l'historique réel.

### Surfaces sans contrat de données démonstratif vérifié

Pour Réel, notifications, messages, profil, compte, menu 2×2 et administration, cette passe n'a pas validé de contrat de fixture sûr et complet. La règle reste donc : aperçu statique séparé ou état vide utile ; aucune injection dans les listes, compteurs, historiques, événements ou boîtes de réception réels.

## 8. Règle d'implémentation après cette vérification

Avant d'ajouter un fichier de fixtures dans un domaine, vérifier son contrat public, ses imports autorisés et son chemin de rendu. Les exemples doivent être des données de présentation explicitement typées et marquées comme démonstration ; ils ne doivent jamais être convertis en enregistrements métier ni passer par les repositories, l'outbox ou les fonctions serveur. Le marquage « Exemple » doit être visible sur chaque carte ou scène pédagogique, en FR et EN.


## 9. Source SQL fictive fournie — règle d'utilisation

Le fichier `donnees_sql.sql` est confirmé comme source de données fictives destinée à remplir les interfaces. Il ne doit pas être importé tel quel dans la base Vitalis.

Son contenu doit passer par la spécification [Adaptation du jeu SQL de démonstration aux domaines Vitalis — V1](../02-architecture/demo-sql-fixture-adapter-v1.md). Les annonces ne sont réutilisées que si elles peuvent être converties vers un contrat existant du domaine. Les utilisateurs SQL ne deviennent jamais des comptes ou identités Vitalis. Les contacts, mots de passe, compteurs et dates périmées sont exclus ou neutralisés.

Objectif : faire passer les fixtures dans les mêmes chemins de lecture, validations et règles de présentation que les données réelles, tout en conservant `origin: "demo"` et en interdisant toute écriture ou synchronisation.


## 10. Première intégration effective — Flash

La fixture locale de `src/domains/flash/model/demo-flashes.ts` présente désormais trois besoins concrets : garde d’enfants pour le week-end, aide au déménagement dans deux heures et deux personnes pour aider à faire la vaisselle après une réunion du dimanche vers 15 h à Dakar. Les lieux génériques et la mention « Dakar (exemple) » évitent de faire croire à une annonce locale réelle.

Le flux Flash conserve ses sources réelles (publications distantes et publications locales hors connexion), puis utilise un sélecteur de présentation commun sur la forme `PublicFlash`. Les contenus réels sont toujours prioritaires ; les exemples ne complètent l'affichage jusqu'à trois cartes qu'après la résolution du chargement réel. Chaque carte garde sa provenance et affiche « Exemple » / « Example » à la place de « En direct ».

Les tests de `tests/flash-demo-feed.test.ts` vérifient aussi les intitulés de ces scénarios et le libellé de zone pédagogique. Scan, Réel, Radar et les autres espaces ne reçoivent pas de fausses données métier : leurs exemples restent des scènes explicatives séparées jusqu'à validation de leurs contrats.


## 7. Scénarios sensibles et limites de publication

- **Maternité de substitution (mère porteuse)** : ne pas utiliser comme carte Flash ordinaire ni comme annonce de recrutement dans les exemples publics V1. Le sujet implique des enjeux médicaux, juridiques, éthiques et de protection des personnes. Il ne pourra être présenté qu'après une validation juridique et produit dédiée, avec un parcours adapté et sans sollicitation publique simplifiée.
- **Garde d’enfants** : formulation centrée sur le besoin, sans identité d’enfant, adresse, horaire détaillé ou coordonnées. Ne pas suggérer qu'une personne est déjà vérifiée ou disponible.
- **Veille auprès d’une personne âgée** : parler d'accompagnement ou de présence, sans exposer d'informations de santé. Ne pas présenter ce besoin comme un service médical.
- **Recherche d'emploi urgente** : ne pas promettre un emploi ni une embauche directe. La formulation décrit une recherche et une disponibilité déclarée dans le scénario fictif, pas une offre vérifiée.
- **Aide après une réunion** : dire « deux personnes » plutôt que cibler un genre. Garder le dimanche et l'heure comme éléments de contexte de l'exemple, sans les convertir en date réelle.
- **Cuisine à Dakar** : garder Dakar comme lieu explicitement indiqué par le scénario. Ne pas laisser entendre que la demande est proche de la personne qui consulte.

## 8. Adaptation par moteur — limites d'intégration

Les scénarios suivants constituent un référentiel éditorial partagé, pas des données injectées dans les résultats métier :

| Moteur / espace | Exemple de langage naturel | Présentation autorisée |
| --- | --- | --- |
| Accueil | Garde d’enfants ce week-end ; déménagement dans deux heures ; aide à la vaisselle après une réunion à Dakar | Trois cartes pédagogiques Flash, marquées « Exemple » |
| Flash | Besoin de garde ; déménagement urgent ; veille d’un parent âgé ; recherche d’emploi rapide ; vaisselle après réunion ; préparation de cuisine à Dakar | Fixtures Flash seulement après validation des contrats et protections du domaine |
| Scan | « Je cherche de l’aide pour déménager » ; « Je cherche une personne pour garder les enfants » | Scène explicative séparée, jamais de faux résultat, distance ou disponibilité |
| Réel | « Je suis à une réunion et je souhaite signaler ma présence » | Tutoriel statique ; aucune fausse personne, présence, distance ou bip |
| Radar | « Je cherche une garde pour le week-end » ; « Je cherche un emploi avec une prise de poste rapide » ; « Je souhaite être accompagné auprès d’un parent âgé pendant une période définie » | Aperçu de recherche non activable, sans correspondance ni activité inventée |
| 2×2 | « Aide à domicile », « Emploi », « Services pour les réunions » | Catégories explicatives seulement si elles existent réellement dans le menu |
| Profil | Présentation d’une personne qui propose de l’aide pour préparer des repas | Profil de démonstration isolé, jamais un compte ou une réputation réelle |
| Notifications / Messages | « Votre demande a reçu une réponse » | Exemple pédagogique isolé, jamais injecté dans les boîtes réelles |
| Assistant Vita | « Aide-moi à expliquer mon besoin pour dimanche à 15 h » | Suggestion de question, pas de conversation préchargée |

Aucun moteur autre que Flash et l'aperçu Accueil n'est activé par cette mise à jour. Les exemples des autres espaces restent des repères éditoriaux jusqu'à l'audit de leurs contrats et de leurs parcours.



## 9. Aperçu des personnes et consultation d’un profil

Les cartes de résultat qui disposent d'un aperçu public autorisé peuvent présenter, sans surcharge :
- un avatar compact (photo publique consentie ou initiales) ;
- le nom d'affichage ;
- une zone large, par exemple une ville ou un quartier volontairement partagé ;
- une catégorie courte ;
- le besoin ou la proposition, qui reste l'information principale de la carte.

Un appui sur le nom ou l'avatar ouvre une fiche courte : avatar, nom, zone, catégorie et présentation personnelle. La fiche ne montre ni téléphone, ni adresse précise, ni coordonnées, ni réputation, ni disponibilité, ni statut de vérification non confirmés.

Pour les exemples, utiliser des noms fictifs, des avatars à initiales et la mention « Exemple ». Les identités et lieux fictifs ne doivent jamais être présentés comme des membres présents ou disponibles.

Pour les résultats réels, afficher le profil uniquement si la personne a activé sa visibilité publique et si le moteur reçoit la projection publique autorisée. Si le profil n'est pas public, conserver la carte sans identité plutôt que d'inventer un nom ou de révéler un compte privé.

Les profils complets, les moyens de contact et les interactions ne sont accessibles qu'au travers des parcours et permissions dédiés, jamais depuis une carte de résultat anonyme.
