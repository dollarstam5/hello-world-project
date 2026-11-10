# Catalogue des contenus d'exemple par interface — V1

**Statut :** préparation produit à valider avec les contrats de chaque domaine avant création des fixtures.  
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
- trois aperçus Flash issus des fixtures SQL neutralisées (plomberie, cours de mathématiques, aide domestique), affichés dans une section pédagogique distincte et chacun marqué « Exemple » ;
- une indication discrète pour retrouver les espaces complémentaires dans le menu 2×2.

Les aperçus d'accueil sont des exemples de présentation, pas une activité en direct : ils ne sont ni des publications d'utilisateurs, ni des notifications, ni des compteurs. Leurs textes sont localisés en français et en anglais. Ils ne sont jamais interactifs et ne sont pas injectés dans un flux métier.

Exemple de salutation :
- FR : « Bonjour et bienvenue chez Vitalis ! »
- EN : « Hello, and welcome to Vitalis! »

Ne pas afficher de faux compteurs d'activité, de personnes connectées ou de notifications.

### 3.2 Flash

**Rôle :** publier et consulter des besoins, offres, opportunités ou disponibilités.

Jeu éditorial initial : 4 à 6 exemples, variés mais courts :
1. Offre de coup de main : « Je peux aider à porter quelques cartons cet après-midi. »
2. Besoin de service : « Je cherche quelqu'un pour réparer un ventilateur. »
3. Offre professionnelle : « Je propose des cours de soutien en mathématiques. »
4. Besoin de transport : « Je cherche un trajet partagé pour demain matin. »
5. Offre de proximité : « Quelques fruits frais disponibles aujourd'hui. »
6. Besoin ponctuel : « Je cherche une perceuse à emprunter pour une heure. »

Chaque élément doit utiliser uniquement les catégories, créneaux et champs déjà prévus par `FlashRecord` et les contrats partagés. Les noms d'auteurs, zones et dates sont clairement fictifs ou génériques. Ne pas inventer de réputation, de validation ou de nombre de réponses.

### 3.3 Scan

**Rôle :** montrer comment rechercher ou identifier des informations utiles autour d'un besoin.

Préparer 3 résultats pédagogiques, pas des identifications prétendument vérifiées :
- « Atelier de réparation » — résultat illustratif expliquant le type d'information que Scan peut aider à trouver ;
- « Cours de soutien » — exemple de service correspondant à une recherche ;
- « Point de collecte » — exemple de lieu ou de ressource, si ce type est effectivement pris en charge.

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
- « Trouver un réparateur de téléphone »
- « Chercher un logement à louer »
- « Trouver des cours de langues »
- « Repérer des fournisseurs de produits frais »

Les exemples doivent respecter les catégories, rayons, durées et statuts réellement autorisés par le schéma Radar. Ne pas fabriquer de nombre de correspondances, de dernière activité ou de disponibilité en temps réel.

Les exemples sont consultables en aperçu mais ne peuvent pas être activés, renouvelés ou annulés comme une vraie recherche.

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

Une première tranche de fixtures est désormais ajoutée dans `src/domains/flash/model/demo-flashes.ts`, sur la branche de travail. Elle reprend trois scénarios neutres du SQL (plomberie, cours de mathématiques, aide domestique), en écartant les coordonnées, identités, descriptions privées, compteurs et dates historiques.

Le flux Flash conserve ses sources réelles (publications distantes et publications locales hors connexion), puis utilise un sélecteur de présentation commun sur la forme `PublicFlash`. Les contenus réels sont toujours prioritaires ; les exemples ne complètent l'affichage jusqu'à trois cartes qu'après la résolution du chargement réel. Chaque carte garde sa provenance et affiche « Exemple » / « Example » à la place de « En direct ».

Tests ajoutés : `tests/flash-demo-feed.test.ts`. L'exécution CI est en attente ; cette intégration n'est donc pas encore déclarée validée. Aucun autre moteur n'a reçu de données fictives dans ses résultats réels.
