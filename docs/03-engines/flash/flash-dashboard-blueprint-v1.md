# Flash — Blueprint du Dashboard de gestion V1

**Statut :** Décision produit validée — règles d'entrée à implémenter et vérifier
**Version :** V1
**Branche de travail :** `scan-phase-a-interpreter`
**Périmètre :** parcours obligatoire de première création, déverrouillage du dashboard après sauvegarde ou publication confirmée, puis gestion des Flashs
**Blueprint de référence UX/produit ; toute implémentation doit respecter le périmètre texte/voix et les décisions existantes.**

## 1. Objectif et mission

Flash est le moteur qui permet à l'utilisateur d'exprimer, publier, retrouver et gérer ses propres Flashs (besoins, offres, opportunités, informations, disponibilités). Le Dashboard Flash est le centre de gestion de ces Flashs : il aide l'utilisateur à comprendre leur état, suivre leur évolution, traiter les interactions qui leur sont liées et accomplir les actions autorisées.

Le dashboard n'est ni un flux social, ni un moteur de suggestions générales, ni un écran de promotion des autres moteurs Vitalis. Il privilégie l'utilité, la pertinence, la clarté et les résultats concrets.

## 2. Principes non négociables

1. **Propriété utilisateur :** le dashboard ne montre et ne permet de gérer que les Flashs appartenant à l'utilisateur connecté, sauf éléments publics séparés et explicitement identifiés dans l'espace Découvrir.
2. **Données réelles :** états, compteurs, réponses, intérêts, propositions, relations, notifications et résultats ne sont affichés que s'ils proviennent d'une source métier confirmée.
3. **Aucun faux résultat :** données d'exemple marquées « Exemple », sans interaction métier et sans être mélangées à l'activité réelle.
4. **Incomplet mais utile :** un Flash incomplet reste enregistrable si le contrat le permet. Les compléments sont présentés comme améliorations, pas comme des conditions arbitraires d'accès ou de publication.
5. **Draft ≠ Published :** enregistrer localement un brouillon ne signifie jamais qu'il est publié, diffusé, visible ou traité par le serveur.
6. **Publication confirmée :** l'écran et les messages de confirmation ne déclarent un Flash publié qu'après succès confirmé par l'opération serveur autorisée.
7. **Vita contextualisée :** ses conseils sont liés aux Flashs de l'utilisateur, à leurs données, événements, évolution et contexte de zone/proximité/entourage seulement si les données sont accessibles, pertinentes et autorisées.
8. **Frontières des moteurs :** Flash ne calcule pas les fonctions propres à Scan, Radar, Réel, Veille, Recommendation ou Trust. Il peut exposer des données Flash par contrats autorisés, sans les transformer en recommandations externes.
9. **Respect de la vie privée :** afficher uniquement les informations permises par les règles de visibilité et de profil du Flash. Ne pas révéler de coordonnées GPS précises, identifiants temporaires invités ou données privées d'interaction.
10. **Actionnable, sans surcharge :** prioriser les actions réellement nécessaires; éviter les tableaux de bord encombrés, scores artificiels, métriques de vanité et formulaires longs.

## 3. Distinction des expériences selon le statut

Le parcours actuel de création permet l'enregistrement local d'un brouillon. La publication distante géographique demeure dépendante du contrat backend et de ses validations.

### 3.1 Brouillon local

- Accès depuis la confirmation de sauvegarde ou « Mes Flashs ».
- Montrer l'état **Brouillon** clairement.
- Permettre de reprendre, modifier et supprimer le brouillon selon les capacités existantes.
- Ne montrer aucune métrique de diffusion, réponse, intérêt ou activité distante.
- Si l'utilisateur souhaite publier, présenter le parcours de publication seulement lorsqu'il est réellement disponible et raccordé.

### 3.2 Flash publié

Après confirmation serveur de publication, ouvrir ou proposer directement la **fiche de gestion du Flash publié**. La personne peut revenir à l'overview, mais la publication doit déboucher sur un espace de suivi et non sur une simple liste.

- Confirmer le statut Published/live selon la terminologie canonique/runtime.
- Afficher la portée et la zone sous forme non précise conforme aux règles de visibilité.
- Afficher expiration/durée uniquement à partir des données persistées.
- Afficher les activités et actions réellement disponibles.
- Aucune confirmation optimiste en cas d'erreur, timeout ou offline.

### 3.3 Flash terminé, expiré, archivé ou supprimé

- Un Flash résolu/terminé doit être distingué d'un Flash expiré ou simplement archivé.
- Les transitions et libellés doivent suivre les états canoniques du domaine, après réconciliation des statuts historiques et runtime.
- L'historique n'expose que les événements et informations autorisés.
- Restaurer, renouveler, republier ou réactiver ne sont proposés que si un contrat et une permission le permettent.
- Suppression avec confirmation claire et explication de son effet; ne pas promettre une suppression irréversible si le runtime ne la garantit pas.

## 4. Architecture d'expérience

### 4.1 Vue d'ensemble — « Mes Flashs »

La vue overview constitue le point d'entrée de gestion. Elle doit permettre, en un regard :

- repérer les Flashs actifs;
- identifier les Flashs nécessitant une action;
- retrouver les brouillons;
- consulter les réponses ou propositions reçues, si ces données existent;
- repérer les expirations imminentes;
- accéder à l'historique des Flashs terminés, expirés et archivés.

Structure fonctionnelle proposée :

1. En-tête « Mes Flashs » et action de création.
2. Carte Vita uniquement lorsqu'un conseil ou une action contextuelle pertinente existe.
3. Section « À traiter » avec événements/action-items réels.
4. Flashs actifs, avec statut, titre, durée restante et résumé d'activité factuelle.
5. Brouillons séparés des publications.
6. Historique repliable/accessible.
7. États de chargement, erreur, vide et offline explicitement conçus.

Les sections peuvent être des filtres/onglets de la même vue, sans créer de navigation profonde inutile.

### 4.2 Fiche de gestion d'un Flash

Chaque Flash dispose d'une fiche individuelle, accessible depuis l'overview.

**En-tête**
- Titre ou extrait lisible.
- Type/catégorie lorsque renseignés.
- Statut canonique.
- Date de création/publication (source fiable).
- Expiration, si applicable.
- Portée/zone avec présentation respectueuse de la confidentialité.
- Retour à Mes Flashs.

**Résumé / état**
- Message simple sur l'état réel : actif, en attente, expiré, etc.
- Aucune barre de progression ou pourcentage arbitraire.
- La progression n'est présentée que si elle correspond à des étapes métier définies et persistées.

**Contenu et paramètres**
- Texte/contenu du Flash.
- Type, catégorie, moment, urgence, zone, portée, visibilité, durée et autres champs disponibles.
- Modifications autorisées par le cycle de vie et la validation serveur.
- Champs non renseignés restent non renseignés; ne pas fabriquer des valeurs.

**Interactions**
- Réponses.
- Intérêts.
- Propositions.
- Mises en relation/connexions établies, si Flash en possède le contrat.
- Chaque élément présente sa source, son état réel et les actions permises.

**Évolution et événements**
- Timeline des changements et événements utiles (création, mise à jour, publication confirmée, interaction reçue, expiration, clôture, archivage).
- Aucun événement ne doit être inventé ou dérivé d'une simple action UI non confirmée.
- Les événements sensibles ne sont visibles qu'au propriétaire et selon la politique de conservation.

**Actions**
- Actions principales priorisées selon le statut.
- Menu secondaire pour les opérations moins fréquentes.
- Confirmation requise pour actions destructrices ou qui changent significativement la diffusion/visibilité.

## 5. Centre « À traiter »

Il rassemble les actions concrètes qui nécessitent l'utilisateur, provenant des Flashs qu'il possède. Exemples possibles, sous réserve d'une source runtime et d'un contrat :

- réponse à consulter;
- proposition à examiner;
- détail manquant à compléter (si vraiment utile et facultatif/obligatoire selon la publication);
- échéance à vérifier;
- Flash à confirmer comme terminé;
- erreur de publication ou synchronisation à reprendre.

Chaque item doit contenir : Flash concerné, motif clair, action proposée, priorité justifiée et état de traitement. Ne pas générer d'item dupliqué à partir du même événement. Le centre se vide ou se met à jour lorsque l'action est réellement traitée.

## 6. Vita — accompagnement du cycle de vie

Vita est un compagnon contextuel du propriétaire du Flash. Elle n'est pas un chatbot permanent ni un générateur de recommandations générales.

### 6.1 Domaines d'aide

- **Comprendre :** expliquer le statut et un événement de son Flash.
- **Compléter :** proposer un détail utile, en précisant son caractère facultatif ou requis.
- **Répondre :** orienter vers les réponses, intérêts ou propositions reçus.
- **Ajuster :** proposer de vérifier une zone, une portée ou une durée, seulement si les règles le permettent.
- **Suivre :** prévenir d'une échéance réelle ou d'un changement significatif.
- **Clôturer :** aider à marquer comme terminé, archiver ou conserver le Flash lorsque les actions correspondantes existent.

### 6.2 Déclencheurs et fréquence

- Intervenir à la suite d'un événement confirmé, d'une échéance, d'un blocage ou d'un constat de données suffisamment fiables.
- Ne pas répéter un conseil ignoré sans évolution significative.
- Pas de message si aucun conseil utile n'existe.
- Dédupliquer les interventions; un même événement ne doit pas déclencher plusieurs cartes ou notifications identiques.
- Le ton est humain, chaleureux, direct et bref.
- L'utilisateur garde la décision et le contrôle; Vita n'effectue pas de mutation sans consentement explicite.

### 6.3 Exemples illustratifs

- « Ton Flash est actif. Tu pourrais préciser l'heure pour aider les personnes à te répondre. »
- « Tu as reçu une réponse. Tu veux la consulter ? »
- « Ton Flash arrive à expiration. Vérifie s'il est toujours d'actualité avant de le prolonger. »
- « La portée actuelle est limitée à la zone choisie. Tu peux la revoir si tu souhaites élargir la diffusion, dans les limites autorisées. »

Ces phrases sont des exemples de ton et de comportement, pas des déclencheurs implémentés.

## 7. Limites avec les autres moteurs

Flash ne doit pas :

- suggérer les Flash d'autres utilisateurs dans son espace de gestion;
- fournir des recommandations génériques d'endroits, de services, d'emplois, de personnes ou d'opportunités;
- lancer ou remplacer une recherche Scan;
- créer ou gérer une veille Radar;
- montrer la présence réelle de Réel comme une fonctionnalité Flash;
- faire des analyses Trust, Veille ou Recommendation.

Flash peut exposer ses propres publications et les événements autorisés à d'autres moteurs via les contrats de domaine. Les consommateurs ne doivent pas accéder à des coordonnées précises, données privées ou identifiants guest temporaires, sauf permission/contrat explicitement défini.

## 8. Données, API et événements — prérequis à l'implémentation

Le dashboard ne peut dépendre que de données réelles ou de contrats prévus clairement identifiés. Avant de construire chaque section, inventorier et valider :

- les données de Flash propriétaire disponibles et leur source;
- les statuts canoniques et transitions réelles;
- les événements publiés/consommés;
- la structure et les permissions des réponses, intérêts, propositions et connexions;
- la pagination et le chargement incrémental;
- les règles de conservation et de suppression;
- les états offline, pending, retry, erreur et conflit de synchronisation;
- les permissions de consultation/modification;
- l'existence réelle de chaque action et son résultat serveur.

Ne pas ajouter de nouvelles tables, colonnes, RPC ou migrations dans le cadre de ce blueprint. Toute modification de contrat sera auditée et proposée séparément.

## 9. Confidentialité et sécurité

- Le dashboard est protégé par l'authentification et les contrôles de propriété côté serveur.
- Les contrôles client ne remplacent pas les contrôles d'autorisation backend.
- Les données de localisation précise restent privées et ne sont pas affichées dans la fiche ou le dashboard.
- La visibilité de profil et la visibilité du Flash restent distinctes.
- Ne jamais exposer de guest/temp ID, données de profil non autorisées, données privées de réponse ou contenu de communication d'autres moteurs.
- Les actions destructrices sont confirmées et expliquées.
- Les erreurs ne divulguent ni secrets ni détails internes.

## 10. Offline, erreurs et états UI

Le dashboard doit gérer explicitement :

- **Chargement :** skeleton ou état stable; éviter les compteurs à zéro avant chargement.
- **Vide :** message chaleureux et action simple pour créer/reprendre un Flash.
- **Offline :** indiquer les données locales et les mutations en attente; ne pas les présenter comme confirmées par le serveur.
- **Publication pending :** état en attente de connexion, pas « publié ».
- **Erreur :** explication compréhensible, possibilité de réessayer sans perdre les saisies.
- **Conflit :** présenter une résolution adaptée, ne pas écraser silencieusement.
- **Données périmées :** indiquer qu'une actualisation est nécessaire lorsqu'un état pourrait être trompeur.

## 11. Modèle de navigation proposé

- **Overview** : résumé et priorité.
- **Actifs** : Flashs en cours.
- **À traiter** : actions liées aux Flashs.
- **Brouillons** : Flashs locaux/non publiés.
- **Historique** : expirés, terminés, archivés, selon états disponibles.

Ce sont des vues/filtres logiques; leur forme (tabs, chips, sections, route) sera décidée pendant la conception UI en respectant la navigation Vitalis existante et en évitant les sous-pages inutiles.

La fiche Flash peut contenir des sections ou onglets : Résumé, Contenu, Interactions, Évolution. Préférer une fiche scrollable légère ou des sections progressives à une navigation complexe.

## 12. Responsive et qualité visuelle

- Mobile-first, confortable sur petits écrans, avec safe-area et navigation cohérente.
- Apparence moderne, premium, vivante mais maîtrisée; animations discrètes seulement si elles renforcent la compréhension.
- Hiérarchie forte : actions à traiter avant informations secondaires.
- Contraste et lisibilité conformes au thème Vitalis; éviter un écran uniformément sombre et surchargé.
- Les cartes ne doivent pas être toutes de même importance; réserver les accents visuels aux événements réellement importants.
- Textes courts, naturels, pas de jargon API ou statuts techniques exposés directement.
- Toute action critique doit être accessible et ne dépendre que d'un geste/animation.

## 13. Critères d'acceptation UX et fonctionnels

Le dashboard ne sera accepté que si :

1. Un brouillon local est clairement différencié d'un Flash publié.
2. La confirmation « publié » ne peut apparaître sans succès serveur.
3. L'utilisateur retrouve ses Flashs, filtre leur état et ouvre la fiche individuelle.
4. Les sections affichent uniquement les données réelles disponibles.
5. Les états loading/empty/error/offline/pending/conflict sont correctement traités.
6. Les actions sont conformes au statut et au contrat; action invalide refusée par le serveur.
7. La gestion de la portée, visibilité et zone respecte les limites du Flash et ne révèle pas le GPS précis.
8. Vita est contextualisée, dédupliquée, non intrusive, explicable et non décisionnaire.
9. Aucun contenu d'autres Flashs ou moteur n'est injecté comme recommandation dans le dashboard de gestion.
10. Aucune donnée d'exemple ne se mélange aux données réelles ou n'effectue d'action métier.
11. Les interactions sont accessibles au clavier/lecteur d'écran, disposent de labels et de confirmations claires.
12. Les layouts restent utilisables sur mobile et desktop, sans overflow horizontal injustifié.
13. Le dashboard ne fait pas de requêtes inutiles ou coûteuses; pagination/limites sont définies.
14. Les tests couvrent permissions, états, actions, offline, erreurs, transitions et cas d'événements dupliqués.

## 14. Phasage de conception/implémentation à proposer (sans autoriser le code)

**Lot DB/API audit :** cartographier les données/événements existants, endpoints, permissions et gaps.
**Lot UX skeleton :** overview et fiche Flash alimentées uniquement par données disponibles; states loading/empty/error/offline.
**Lot interactions :** réponses/intérêts/propositions uniquement après vérification des contrats et sources.
**Lot Vita :** règles d'intervention et actions, avec dedup et préférences de communication.
**Lot lifecycle :** transitions, expiration, archivage, résolution, restauration, après validation des statuts canoniques.
**Lot validation :** tests, audit privacy/accessibility, revue de coût et preuves de fonctionnement.

Chaque lot devra faire l'objet d'une validation des écarts avant de commencer le code.

## 15. Documents sources et limites

Références principales confrontées :

- `engine-charter.md` — rôle, création rapide, Flash partiels, visibilité et UI.
- `11-VITALA-UJ-08-FLASH-ENGINE.md` — mission historique, cycle, Vita, diffusion et résultats attendus.
- `6. Flash API.md` — capacités du domaine, responsabilités, états et événements.
- `flash-ui-implementation.md` — état actuel du composer brouillon-first et parcours UI.
- `publication-backend-contract.md` — publication géographique, confidentialité, atomicité et prérequis serveur.

Les références historiques/API ne certifient pas la disponibilité runtime. Le blueprint rassemble la vision UX et les contraintes, sans affirmer que toutes les capacités sont implémentées.

## 16. Questions non tranchées / décisions requises avant code

- Quelle terminologie canonique de statut UI doit correspondre au runtime (Draft/Published/live/active/expired/archived/resolved)?
- Quels événements réels existent déjà pour réponse, intérêt, proposition, relation et résolution?
- Quels résultats doivent être conservés dans l'historique, et combien de temps?
- Le dashboard doit-il s'ouvrir directement sur le dernier Flash publié, ou rester sur l'overview avec un accès direct à sa fiche?
- Quelle structure de navigation (tabs, sections, route) s'accorde le mieux au shell existant?
- Les capacités de Vita après publication nécessitent-elles une communication proactive/notifications, ou uniquement un accompagnement in-dashboard en V1?

Ces décisions doivent être résolues ou laissées explicitement en suspens avant d'engager le développement.
