# Flash — expérience d'interface V1

**Statut :** première implémentation de l'écran et du parcours de création  
**Domaine :** `src/domains/flash/`  
**Route :** `/flash`

## Intention de l'écran

Flash aide une personne à exprimer rapidement un besoin ou une proposition, à vérifier ce que le moteur a compris, puis à publier volontairement. L'écran présente ensuite les Flash disponibles et ceux créés par la personne. Ce n'est ni un fil social ni une interface de statistiques.

## Organisation de la page

1. **En-tête Flash** : identité du moteur à gauche et retour vers l'accueil. Le header global de l'application est masqué sur cette route afin d'éviter deux en-têtes superposés.
2. **Action centrale** : une invitation claire et un bouton « Exprimer un besoin ». Le bouton ouvre le parcours de création.
3. **Deux espaces** : « Découvrir » affiche les Flash disponibles ; « Mes Flashs » affiche les publications locales associées au compte connecté.
4. **Navigation principale** : conservée en bas de l'écran selon la navigation actuelle de l'application.

## Création guidée

### Étape 1 — Exprimer

- Saisie libre en texte, sans formulaire long.
- Dictée vocale lorsque le navigateur expose Web Speech Recognition.
- Si cette capacité n'est pas disponible ou si l'autorisation microphone est refusée, la saisie texte reste utilisable et un message l'explique.
- Le texte est analysé localement avec `parseFlashIntent`. L'analyse actuelle est déterministe et fondée sur des règles, pas sur une compréhension IA distante.
- Le parseur couvre notamment les formulations françaises courantes de garde d'enfants et de déménagement, ainsi que les repères temporels comme « ce week-end ».
- Le moteur propose un type, une catégorie et un créneau temporel lorsqu'il les reconnaît.

### Étape 2 — Vérifier

La personne peut relire le texte et corriger séparément :
- le type (besoin ou offre) ;
- la catégorie ;
- le moment ;
- un libellé de zone facultatif.

La publication n'est jamais automatique. Elle exige une action explicite sur « Publier mon Flash ». La fiche est d'abord enregistrée dans la base locale existante et suit le mécanisme de synchronisation déjà en place.

## Découverte et données d'exemple

- Le composant de découverte conserve la priorité des publications réelles.
- Les données fictives existantes complètent uniquement les emplacements manquants et portent le libellé « Exemple ».
- Les états de chargement, d'erreur et hors ligne restent visibles.
- Aucun compteur de vues, de réponses ou de popularité fictif n'est ajouté.

## Limites fonctionnelles à ne pas masquer

Le modèle local `FlashRecord`, la création `createFlash` et la projection publique `PublicFlash` ne portent pas encore les autorisations de visibilité par publication décrites dans la charte Flash. En conséquence, cette première interface ne prétend pas proposer ni appliquer :
- le choix du public cible ;
- le choix des zones de découverte autorisées ;
- l'affichage sélectif des champs du profil de l'auteur ;
- l'autorisation d'ouvrir le profil complet ;
- le mode « découverte de l'expéditeur uniquement ».

Ces contrôles ne doivent être ajoutés qu'après extension cohérente du contrat, du stockage local, de la synchronisation, des API et des règles serveur/RLS. Les masquer provisoirement est préférable à un réglage visuel qui ne protégerait rien.

La reconnaissance vocale dépend du navigateur et de ses permissions. Elle transforme la parole en texte ; elle ne constitue pas une promesse de traitement vocal universel hors ligne.

## Vérifications attendues

- Les expressions françaises usuelles de besoin, dont garde d'enfants et déménagement, sont reconnues par le parseur.
- La personne peut corriger les champs proposés avant publication.
- Aucune écriture n'a lieu avant la confirmation explicite.
- Une publication créée apparaît dans les données locales et dans « Mes Flashs ».
- Les exemples restent identifiables et ne remplacent jamais les publications réelles.
- Le parcours reste utilisable au clavier, sur petit écran et avec la dictée indisponible.
- Les règles de visibilité restent signalées comme non raccordées tant que le contrat serveur ne les applique pas.
