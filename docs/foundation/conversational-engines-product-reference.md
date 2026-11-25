# Référentiel produit — collecte en langage humain des moteurs Vitalis

**Statut : référentiel de clarification produit — V1**  
**Portée : Flash, Scan et Radar**  
**Priorité d'expérience : téléphones Android et iOS (P0), tablette (P1), desktop (P2).**  
**Règle de lecture : ce document décrit séparément l'existant vérifié, les clarifications nécessaires et les évolutions qui ne sont pas encore livrées. Il ne transforme pas une intention produit en capacité technique acquise.**

## 1. Objet et méthode

Ce référentiel rassemble ce qui est déjà défini dans les principes de Vitalis et ce que les parcours V1 montrent réellement dans le code. Il sert à préparer la documentation produit puis la conception de la première interface moderne.

Il ne s'agit pas de réinventer les moteurs, de remplacer leurs règles métier ni de prétendre qu'une conversation adaptative existe déjà.

Chaque constat est classé ainsi :

- **Existant vérifié** : présent dans les documents ou les composants inspectés.
- **À clarifier** : comportement déjà présent, mais dont la signification produit, la nécessité ou la présentation n'est pas assez explicite.
- **À compléter** : capacité ou règle qui n'est pas démontrée dans la V1 et qui nécessitera une décision et/ou une implémentation.
- **Décision produit à confirmer** : arbitrage qui ne peut pas être déduit du code seul.

Les références de code mentionnées sont celles inspectées pendant l'audit documentaire. Une inspection statique ne certifie pas le comportement réel sur appareil.

## 2. Principes transversaux déjà établis

Le document [Principes fondamentaux de Vitalis](./vitalis-core-principles.md) est prioritaire et reste la référence normative.

Il établit notamment que Vitalis doit :

1. comprendre l'intention et l'action demandée ;
2. distinguer le minimum réellement indispensable des informations simplement utiles ;
3. avancer avec les informations disponibles dès que l'action peut être exécutée de manière sûre et autorisée ;
4. ne pas bloquer une action pour une préférence facultative manquante ;
5. demander uniquement l'information qui empêche réellement l'action ;
6. conserver ce qui a déjà été exprimé et éviter de faire répéter la personne ;
7. ne jamais inventer une donnée inconnue ;
8. expliquer honnêtement les limites du résultat ;
9. proposer les enrichissements facultatifs sans les imposer ;
10. respecter identité, droits, consentement, sécurité, modération et règles serveur.

**Conséquence UX :** la personne commence par exprimer son intention dans ses propres mots. Les contrôles structurés ne sont utilisés que lorsqu'ils aident réellement à lever une ambiguïté, à choisir une option utile ou à confirmer une action engageante. Un écran rempli de champs n'est pas le parcours de référence.

Ce principe n'impose pas que chaque moteur ait déjà une IA conversationnelle. Il fixe le comportement produit attendu et oblige à décrire honnêtement les capacités effectivement disponibles.

## 3. Contrat commun de collecte

### 3.1 Parcours de référence

Le parcours cible commun est le suivant, en restant adapté à chaque moteur :

1. **Expression libre** — la personne décrit ce qu'elle veut faire, trouver, proposer ou surveiller, en langage naturel. Le texte est le moyen de base ; la voix est un complément lorsqu'elle est réellement disponible.
2. **Compréhension explicite** — Vitalis conserve la formulation d'origine et identifie les éléments qu'il sait réellement reconnaître.
3. **Qualification honnête** — chaque élément est distingué comme explicitement exprimé, détecté avec incertitude, proposé par défaut, confirmé par la personne ou encore inconnu.
4. **Progression** — si le minimum métier, les droits et les permissions sont réunis, le moteur avance sans exiger les préférences facultatives.
5. **Clarification ciblée** — si une information est réellement bloquante, Vitalis pose une seule question courte à la fois, en conservant le reste du contexte.
6. **Confirmation proportionnée** — la personne confirme l'action lorsqu'elle crée un engagement, publie, active une veille ou déclenche une opération qui le nécessite. Les détails déjà compris ne sont pas soumis à une succession de confirmations inutiles.
7. **Action et résultat** — l'interface dit précisément ce qui a été fait : brouillon enregistré, publication effectuée, recherche lancée, mission enregistrée ou action impossible.
8. **Enrichissement facultatif** — les précisions qui peuvent améliorer le résultat sont proposées au bon moment, sans transformer la progression en formulaire obligatoire.

Ce parcours est une référence produit. Il ne faut pas prétendre que les étapes 2 à 6 sont aujourd'hui assurées par un agent conversationnel adaptatif si le code utilise un parseur déterministe et des écrans fixes.

### 3.2 Statut des données

| Statut | Signification | Règle de présentation |
|---|---|---|
| Explicitement exprimée | La personne l'a dite ou écrite | Peut être reprise comme donnée déclarée |
| Détectée | Une règle ou un parseur a reconnu un indice | La présenter comme une interprétation corrigeable |
| Proposée par défaut | Valeur technique initiale ou de repli | Ne jamais la présenter comme une déclaration de la personne |
| Confirmée | La personne a validé la valeur ou le récapitulatif correspondant | Peut être utilisée selon le contrat métier |
| Inconnue | Aucune information fiable disponible | Rester inconnue ; ne pas inventer |
| Facultative | Utile pour améliorer le résultat, non nécessaire à l'action minimale | Ne bloque pas l'action |
| Indispensable | Son absence empêche réellement une action sûre, autorisée et cohérente | Poser une seule question ciblée ou expliquer pourquoi l'action ne peut pas avancer |

Un champ affiché dans une interface n'est pas automatiquement indispensable. Un contrôle prérempli n'est pas automatiquement confirmé. Une permission système n'est jamais supposée à partir d'une donnée détectée.

### 3.3 Voix et permissions

- Le texte doit rester une voie complète lorsque la dictée n'est pas disponible ou est refusée.
- La dictée vocale ne doit être annoncée que lorsque la capacité du navigateur ou de la plateforme la permet.
- Une permission de localisation est demandée au moment où elle est réellement nécessaire, avec une explication compréhensible.
- Le refus d'une permission ne doit pas conduire à inventer une localisation ni à présenter une localisation approximative comme une donnée confirmée.
- Les états d'écoute, de traitement, d'erreur et d'indisponibilité doivent être compréhensibles et accessibles.

## 4. Flash — exprimer un besoin, une offre ou une opportunité

### 4.1 Rôle produit

Flash permet à la personne d'exprimer un besoin ou une offre de façon directe, puis de préparer un contenu Flash qui pourra être enregistré comme brouillon ou publié selon le parcours existant.

### 4.2 Existant vérifié dans la V1

Sources inspectées :
- `src/modules/flash/ui/FlashComposerWriteStep.tsx`
- `src/modules/flash/ui/FlashComposerReviewStep.tsx`
- `src/modules/flash/ui/useFlashComposer.ts`
- `src/modules/flash/ui/flash-composer-helpers.ts`
- `packages/core-logic/src/flash.ts`

Constats :
- L'entrée initiale accepte un texte libre jusqu'à 600 caractères.
- Une dictée vocale est proposée lorsque l'API Web Speech Recognition est disponible.
- `parseFlashIntent` est un parseur local, pur et déterministe, fondé sur des expressions régulières.
- Il propose trois éléments structurés : type besoin/offre, catégorie et créneau temporel.
- Les règles reconnues sont limitées à des mots et expressions français/anglais prévus dans le code.
- Le parseur ne démontre pas une extraction générale du lieu, de la date exacte, de la quantité, de la durée ou de toutes les contraintes.
- Les valeurs de repli actuelles comprennent notamment « offre », « autre » et « aujourd'hui ». Elles ne prouvent pas que la personne a exprimé ces informations.
- Après la saisie, une étape de revue présente le texte d'origine et des contrôles de localisation, type, catégorie, date/créneau, portée et urgence.
- La localisation peut être ajoutée explicitement ; elle n'est pas automatiquement connue.
- Le parcours distingue l'enregistrement d'un brouillon et la publication dans les actions de revue.

### 4.3 Ce qui doit être clarifié

- Identifier, pour chaque contrôle de la revue, s'il est requis pour enregistrer un brouillon, requis pour publier, ou seulement utile pour améliorer la pertinence.
- Distinguer visuellement les valeurs détectées par le parseur des valeurs de repli.
- Ne pas transformer un défaut technique en fait déclaré.
- Expliquer pourquoi une confirmation de publication est nécessaire, sans faire confirmer chaque détail non engageant.
- Vérifier que les corrections restent possibles sans obliger à recommencer la saisie.

### 4.4 À compléter, sans prétendre que c'est déjà livré

- Une clarification conversationnelle contextuelle lorsque le type besoin/offre ne peut pas être déterminé avec suffisamment de fiabilité, si cette information est réellement requise pour l'action concernée.
- Une extraction plus large du lieu, de la date et des contraintes uniquement si une capacité produit/technique est décidée et testée.
- Une présentation de revue moins formulaire, centrée sur la reformulation et les corrections utiles, sans supprimer les choix indispensables à la publication.
- Des critères de confiance et des scénarios de test représentatifs pour les langues et formulations réellement prises en charge.

## 5. Scan — exprimer une recherche ou un besoin à explorer

### 5.1 Rôle produit

Scan reçoit une demande exprimée naturellement, l'interprète dans les limites de ses capacités actuelles et prépare le lancement d'une recherche.

### 5.2 Existant vérifié dans la V1

Sources inspectées :
- `src/modules/scan/ui/ScanPanel.tsx`
- `src/modules/scan/ui/ScanNeedInterpretation.tsx`
- `src/modules/scan/ui/ScanPreferences.tsx`
- `src/modules/scan/hooks/useScanFlow.ts`
- `packages/core-logic/src/scan-interpreter.ts`

Constats :
- L'entrée accepte une demande libre jusqu'à 160 caractères.
- Une dictée vocale est proposée via le hook de saisie vocale.
- Le parcours est organisé en quatre étapes fixes : `need`, `confirmation`, `criteria`, `final`.
- L'interpréteur est déterministe ; il conserve le texte original et extrait certains indices de tâche, objet, lieu, distance, quantité, temps, urgence, exigences et préférences.
- Il reconnaît un ensemble borné d'intentions ; une intention inconnue reste possible.
- Le composant de revue précise qu'il ne prétend pas reformuler au-delà de l'extraction locale.
- Le rayon est présenté comme une préférence facultative, mais il occupe une étape dédiée du parcours.
- Le lancement n'a lieu qu'à l'étape finale, après action explicite.
- La localisation est demandée au lancement de la recherche.
- Le code inspecté ne montre pas de dialogue adaptatif qui pose une question selon les informations manquantes.

### 5.3 Ce qui doit être clarifié

- Justifier chacune des quatre étapes par une valeur réelle pour la personne, une nécessité métier, une permission ou une confirmation.
- Déterminer si la confirmation de l'interprétation est nécessaire dans tous les cas ou seulement lorsque l'interprétation est incertaine.
- Le rayon étant présenté comme facultatif, confirmer qu'il ne doit pas retarder une recherche déjà exploitable et documenter la valeur utilisée lorsqu'il n'est pas modifié.
- Distinguer clairement les indices extraits par le parseur des éléments qu'il n'a pas compris.
- Expliquer le rôle de la localisation au moment du lancement et le comportement lorsque la personne refuse cette permission.

### 5.4 À compléter, sans prétendre que c'est déjà livré

- Une progression plus directe lorsque la demande est suffisamment exploitable.
- Une clarification ciblée uniquement lorsque l'information manquante est réellement bloquante.
- Une adaptation du parcours à l'incertitude, si cette évolution est approuvée, plutôt que des étapes fixes systématiques.
- Des scénarios de validation du parseur couvrant demandes minimales, ambiguës, partielles, corrigées et multilingues.

## 6. Radar — exprimer librement une mission de veille

### 6.1 Rôle produit clarifié

Radar est lui aussi un moteur d'expression libre. La personne doit pouvoir transmettre une mission avec ses propres mots, comme elle expliquerait naturellement à Vitalis ce qu'elle souhaite surveiller, repérer ou retrouver.

Le formulaire de paramètres actuel ne définit donc pas à lui seul l'expérience produit de Radar. Il représente l'interface V1 actuellement codée, pas le modèle de collecte de référence.

Exemples illustratifs d'expression d'une mission :
- « Préviens-moi si une opportunité de partenariat agricole apparaît à Douala. »
- « Je cherche un développeur disponible pour m'accompagner sur un projet mobile. »
- « Surveille les propositions de terrains à vendre dans cette zone. »

Ces phrases illustrent la liberté d'expression attendue ; elles ne signifient pas que le moteur actuel sait déjà détecter, apparier, surveiller ou notifier ces cas.

### 6.2 Existant vérifié dans la V1

Sources inspectées :
- `src/modules/radar/ui/RadarDraftForm.tsx`
- `src/modules/radar/ui/RadarManagement.tsx`

Constats :
- L'interface actuelle est un formulaire structuré de création et de modification.
- Le texte de recherche est obligatoire, entre 3 et 2 000 caractères.
- La zone est facultative.
- Le rayon est sélectionné dans une liste de valeurs prédéfinies ; la valeur initiale est de 5 km.
- La durée est sélectionnée parmi 3, 7, 14, 30, 60 ou 90 jours ; la valeur initiale est de 7 jours.
- La sauvegarde crée ou modifie un enregistrement de brouillon privé.
- Le code décrit explicitement Radar V1 comme un mécanisme de sauvegarde et de gestion de recherches privées en mode offline-first.
- Le commentaire du composant précise que l'appariement automatique et les alertes restent indisponibles tant que le moteur et le traitement planifié ne sont pas connectés.
- La gestion actuelle permet de consulter les enregistrements, modifier un brouillon et l'annuler.

**Point essentiel :** dans le code inspecté, enregistrer une intention Radar ne signifie pas qu'une veille active est démarrée. Il faut distinguer sans ambiguïté « mission enregistrée comme brouillon » et « surveillance réellement active ».

### 6.3 Ce qui doit être clarifié

- Définir le minimum nécessaire pour enregistrer une intention ou un brouillon Radar, sans confondre ce minimum avec les paramètres d'une future veille active.
- Déterminer si la zone, le rayon et la durée sont nécessaires à la sauvegarde, à l'activation future, ou seulement à l'amélioration de la pertinence.
- Expliquer la différence entre une intention enregistrée, une mission prête à être activée et une surveillance effectivement en cours.
- Définir les états et les messages qui empêchent de laisser croire qu'une alerte ou une correspondance sera produite lorsque le moteur n'est pas encore connecté.
- Définir comment une personne corrige ou complète sa mission sans perdre son expression initiale.

### 6.4 À compléter, conformément à l'expression libre attendue

- Une entrée principale en langage naturel, texte et voix lorsque la capacité est disponible.
- Une reformulation fidèle de la mission à partir des éléments réellement compris.
- Une distinction explicite entre les détails exprimés, détectés, inconnus et facultatifs.
- Des questions humaines ciblées, une à la fois, seulement si une donnée indispensable à l'étape visée manque.
- Des choix compacts et contextuels pour zone, rayon ou durée lorsque ces paramètres deviennent utiles ; ils ne doivent pas transformer l'entrée en formulaire classique.
- Une confirmation adaptée à l'action réellement disponible : sauvegarder le brouillon aujourd'hui, ou activer une veille lorsque cette capacité existera et sera autorisée.
- Un statut honnête pour les fonctions d'appariement et d'alerte qui ne sont pas encore opérationnelles dans la V1 inspectée.

**Décision produit de ce référentiel :** l'expression libre est le point de départ de Radar, au même titre que Flash et Scan. **Ce parcours cible n'est pas encore démontré par l'interface V1 actuelle.**

## 7. Comparaison synthétique : existant et cible

| Moteur | Entrée libre actuelle | Traitement actuel vérifié | Écart principal à clarifier |
|---|---|---|---|
| Flash | Texte 600 caractères ; dictée si API disponible | Parseur déterministe limité puis revue structurée, brouillon ou publication | Distinguer suggestions/defaults et données déclarées ; statuer sur les contrôles indispensables |
| Scan | Texte 160 caractères ; dictée disponible selon support | Interprétation déterministe et quatre étapes fixes avant lancement | Justifier les étapes ; rendre la préférence facultative réellement non bloquante |
| Radar | Texte de recherche dans un formulaire ; pas de parcours libre dédié démontré | Enregistrement/gestion de brouillons privés ; appariement automatique et alertes non connectés | Concevoir l'expression libre de mission et distinguer brouillon et veille active |

## 8. Règles UX communes à respecter lors de la future conception

1. Présenter une invitation naturelle à raconter son besoin ou sa mission, pas une liste de champs.
2. Garder le texte d'origine accessible et ne pas le remplacer silencieusement par une interprétation.
3. Répondre par une reformulation simple avant d'exposer des paramètres techniques.
4. Ne montrer que les contrôles qui sont utiles à l'étape présente.
5. Présenter les préférences comme facultatives lorsqu'elles ne sont pas indispensables.
6. Poser une question à la fois lorsqu'une clarification est réellement nécessaire.
7. Conserver les données déjà exprimées et confirmées pendant une correction.
8. Proportionner les confirmations à l'impact de l'action.
9. Ne pas afficher un état « actif », « surveillé », « trouvé » ou « notifié » tant que l'action correspondante n'a pas réellement eu lieu.
10. Prévoir les états sans réseau, en cours, erreur, permission refusée, brouillon enregistré et action terminée selon les capacités réelles de chaque moteur.
11. Garder une voie texte complète si la voix n'est pas prise en charge.
12. Respecter les standards mobile Vitalis : lisibilité, cibles tactiles, safe areas, clavier, lecteur d'écran et réduction des animations.

## 9. Décisions à ne pas inventer

Les points suivants ne sont pas déductibles des fichiers inspectés et doivent rester ouverts tant qu'une décision produit n'est pas documentée :

- le modèle d'IA ou le niveau d'automatisation qui pourrait compléter les parseurs actuels ;
- les seuils chiffrés de confiance et les politiques de confirmation par seuil ;
- les champs strictement indispensables à chaque type de publication Flash ;
- la nécessité exacte de chaque étape Scan dans tous les cas ;
- les critères d'activation future d'une mission Radar, ses sources de correspondances, sa fréquence de surveillance et ses garanties de notification ;
- la durée de conservation et les règles de reprise d'une mission au-delà de ce que le code actuel démontre ;
- le contenu, l'ordre et la durée du tutoriel de première ouverture, qui feront l'objet d'une spécification dédiée après validation des parcours produit.

Une proposition future doit être étiquetée comme proposition et validée avant d'être présentée comme une règle produit acquise.

## 10. Critères d'acceptation documentaires et produit

Le référentiel et les futures interfaces devront permettre de vérifier les cas suivants :

| Scénario | Résultat attendu |
|---|---|
| Expression complète et claire | Le moteur réutilise les éléments exprimés sans question inutile |
| Expression partielle mais exploitable | Le moteur avance avec le minimum disponible |
| Préférence facultative absente | L'action minimale n'est pas bloquée |
| Information réellement indispensable absente | Une question ciblée, une seule à la fois |
| Parseur incertain | L'incertitude est visible et corrigeable |
| Valeur par défaut | Elle n'est jamais présentée comme une donnée dite ou confirmée |
| Correction libre | Le texte initial et les éléments non concernés sont conservés |
| Voix indisponible/refusée | Le texte permet de terminer le parcours |
| Permission nécessaire refusée | Aucune donnée n'est inventée ; une alternative honnête est expliquée si elle existe |
| Action non implémentée | Le produit ne prétend pas l'avoir exécutée |
| Radar enregistré mais non actif | Le statut dit clairement qu'il s'agit d'un brouillon ou d'une intention enregistrée |
| Confirmation engageante | La personne comprend ce qui va être publié, lancé ou activé |

## 11. Références et limites

Références canoniques :
- [Principes fondamentaux de Vitalis](./vitalis-core-principles.md)
- [Standards d'interface mobile](./mobile-interface-standards.md)
- [Audit du parcours de collecte en langage humain](./shared-components-mobile-audit.md#11-audit-du-parcours-de-collecte-en-langage-humain--et-non-des-formulaires-classiques)

Ce document est une clarification produit basée sur les fichiers inspectés et les décisions explicitement communiquées pour Vitalis. Il ne certifie ni la précision des parseurs sur un corpus réel, ni les rendus sur appareil, ni l'existence d'une conversation adaptative en production.

**Aucun code applicatif, parseur, service, schéma de données ou comportement runtime n'est modifié par ce référentiel.**
