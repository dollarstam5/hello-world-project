# Réconciliation Communication et moteurs secondaires — vague 10

**Projet :** Vitalis  
**Lot :** A — réconciliation documentaire et fonctionnelle  
**Branche :** `reconcile/lot-a-2026-11`  
**Référence auditée :** HEAD `e241243dfdc07bd10c0c2f818ed07325cfe2d067` au début de cette passe  
**Méthode :** lecture seule de l'arborescence, des composants UI, des routes, des domaines, des contrats API, des migrations et des tests.  
**Statut :** constats statiques ; aucun test applicatif, SQL distant, navigateur ou déploiement exécuté dans cette passe.

## 1. Périmètre et règle de preuve

Cette vague examine :
- la cloche et la fenêtre Communication ;
- notifications ;
- conversations/messages et leur rattachement aux actions ;
- communication avec l'assistance Vita ;
- Flash, Scan, Radar, Veille, Recommendation, Trust et Missions, dans la limite des artefacts runtime identifiables ;
- l'entrée 2x2 / Espace / Talents.

Un contrat historique, un nom de domaine ou un composant d'interface vide n'est pas une preuve d'un service opérationnel. Les statuts distinguent **présent**, **partiel**, **placeholder**, **contrat historique non raccordé** et **non démontré**.

## 2. Cloche et fenêtre Communication

### 2.1 Éléments présents

- `AppHeader.tsx` affiche une cloche et ouvre `CommunicationSheet`.
- `AppShell.tsx` monte cette fenêtre au niveau global.
- `CommunicationSheet.tsx` expose trois onglets : `notifications`, `assistant`, `conversations`.
- Le composant réutilise une Sheet mobile et les Tabs accessibles du système UI.

### 2.2 Écarts avec le parcours produit attendu

Le parcours validé pour Vitalis est un espace unique contenant trois voies compréhensibles : **Notifications**, **Messages liés aux actions** et **Communication avec l'assistance**.

L'interface actuelle présente bien trois onglets, mais :
- l'onglet central est nommé **Assistant**, au lieu de rendre explicite « Assistance » ou « Aide » ;
- les onglets Notifications et Conversations ne sont que des messages d'état vide codés en dur ;
- aucun compteur non lu, état de lecture, liste, pagination ou action d'archivage n'est raccordé ;
- aucune liste de conversations ni contexte d'action n'est chargé ;
- aucune règle ne lie une conversation à une mission, une mise en relation, une demande ou une autre action métier.

**Décision :** la coque de navigation est présente ; les deux flux Notifications et Messages sont des placeholders. Ne pas déclarer la cloche V1 opérationnelle.

### 2.3 Notifications : contrat et runtime

Le contrat historique `docs/03-api/14. Notification API.md` décrit un service central avec lecture, historique, archivage, préférences, suppression et événements. Il énumère des endpoints REST `/notifications`.

En revanche :
- `src/platform/notifications/index.ts` ne fournit qu'un type de payload et un `noopNotifications` dont `notify()` ne fait rien ;
- aucun domaine `src/domains/notifications/`, route API notifications, fonction serveur de liste/marquage lu, table SQL de notifications ou test de cycle de vie n'a été identifié dans les arborescences examinées ;
- l'inventaire runtime `docs/03-api/contract-runtime-status.md` ne confirme aucun endpoint Notification.

**Résultat :** contrat historique présent, runtime Notifications non démontré. Les canaux push/email sont des types futurs, pas des canaux effectivement livrés.

### 2.4 Messages et conversations

- Aucun domaine runtime `conversation` ou `messaging`, route dédiée, schéma partagé, table de conversation/message, fonction serveur ou test de permissions n'a été identifié dans les chemins examinés.
- Le contrat Notification API n'est pas un contrat de conversation et ne peut pas être utilisé comme preuve de messagerie.
- L'Assistant Vita est un échange utilisateur/assistant ; il ne constitue pas une messagerie entre membres.
- L'absence de messagerie libre est cohérente avec la règle produit. Le besoin restant est un **fil de conversation contextualisé à une action**, ouvert uniquement lorsqu'une action autorisée crée une mise en relation.

**Résultat :** conversation liée à une action non démontrée dans le runtime ; ne pas introduire de messagerie libre ni de boîte de réception générique sans décision produit explicite.

### 2.5 Assistance Vita

Le parcours Assistant est plus avancé :
- `AssistantTab`, `useHybridAssistant`, recherche locale et flux serveur existent ;
- les fonctions serveur passent par `requireSupabaseAuth` ;
- les entrées sont validées par Zod ; la politique limite les messages, leur taille, les routes de contexte et les données sensibles ;
- le serveur prévoit une limite de 6 demandes par minute et 40 par 24 heures via `claim_assistant_request` ;
- le SQL crée des tables d'usage et de cache avec RLS et privilèges restreints ; les prompts bruts ne sont pas enregistrés dans `ai_requests` selon le commentaire et le modèle SQL examiné ;
- les tests unitaires couvrent la validation de conversation, la détection de secrets, l'éligibilité du cache et l'isolation locale par compte.

Limites :
- l'assistant est séparé du parcours d'assistance de la cloche par un second point d'entrée flottant `AILayer` ;
- le flux conversationnel est local à l'appareil et isolé par compte ; aucun historique serveur de conversation membre n'est démontré ;
- les tests repérés sont des tests de politique/isolation, pas une validation end-to-end du parcours complet ;
- l'assistant requiert une session pour le flux distant ; des réponses locales peuvent être proposées avant ce flux.

**Résultat :** assistance IA présente en partie, avec protections et quotas identifiables ; son intégration UX à la cloche et la stratégie d'historique restent à arbitrer. Le composant Assistant ne doit pas être confondu avec une assistance humaine ou une conversation entre membres.

## 3. État des moteurs secondaires

| Domaine | Artefacts runtime confirmés | Écran / route observé | Tests observés | Évaluation |
|---|---|---|---|---|
| Flash | Feed public, création locale, transition et sauvegarde de position privée ; synchronisation locale prévue | `/flash` raccorde `FlashComposer` et `FlashFeed` | Tests d'intention et feed public | **Partiel / le plus avancé** ; la couverture des parcours d'action et de contact reste à vérifier. |
| Scan | Fonction serveur de scan, hook, classement des résultats et abonnement Realtime aux changements Flash | `/scan` monte `ScanPanel` | Test de stabilité Realtime ; tests SQL de flux public dans une autre chaîne | **Partiel / présent** ; la confidentialité de position est documentée, mais les tests SQL spécifiques de non-divulgation restent à compléter. |
| Radar | Schéma strict, mapper, contrats partagés, logique de cycle de vie et migration SQL candidate | `/radar` affiche `SectionFoundation` avec sections « Tout près » et « Dans votre zone », sans liste métier ni commandes raccordées | Tests de contrat et de cycle de vie | **Logique de domaine partielle ; écran placeholder**. |
| Veille | Contrat API et documents d'engine historiques | Aucune route Veille ni domaine runtime Veille identifié | Aucun test runtime Veille identifié | **Contrat historique non raccordé**. |
| Recommendation | Contrat API historique et documentation de moteur | Aucune route ni domaine runtime Recommendation identifié | Aucun test runtime Recommendation identifié | **Contrat historique non raccordé**. |
| Trust | Documents Trust et index de domaine | Aucune route utilisateur Trust dédiée identifiée dans les routes examinées | Pas de parcours runtime V1 complet démontré par cette passe | **Couverture runtime non démontrée** ; les niveaux de confiance produit ne prouvent pas un moteur Trust opérationnel. |
| Missions | Contrat historique ; migration SQL Missions mal formée déjà relevée en vague 8 | Aucune route ou domaine runtime Missions identifié dans l'arborescence examinée | Pas de suite de tests runtime Missions identifiée dans ce périmètre | **Non démontré ; dépendance SQL à risque**. |

### 3.1 Réserve Radar

Le contrat historique Radar décrit des opportunités détectées et des actions save/hide/report. Le runtime repéré dans cette passe est plutôt un modèle de Radar personnel avec brouillon, rayon, période, statut et révision. La route actuelle reste un placeholder. Il faut arbitrer le modèle produit canonique avant de prétendre que les deux descriptions sont équivalentes.

### 3.2 Réserve Veille / Recommendation

Les documents décrivent des moteurs proactifs qui consomment des événements d'autres domaines. Aucun worker, planificateur, producteur d'événements, stockage, route ou test runtime de ces moteurs n'a été confirmé dans l'arborescence ciblée. Ne pas créer de traitements périodiques coûteux ni d'appels IA récurrents avant une définition V1 bornée et un budget serveur.

## 4. Navigation 2x2, Espace et Talents

- La barre basse affiche Réel, Flash, Scan, Radar et un bouton Menu.
- Le bouton Menu ouvre `MenuSheet`, qui présente seulement Espace et Talents.
- La page `/espace` utilise `SectionFoundation` et reste un écran de fondation ; le lien Profil de l'en-tête pointe actuellement vers `/espace`.
- La page `/talents` utilise également `SectionFoundation` et reste un écran de fondation.
- Aucun écran 2x2 de catégories ni registre de catégories complet n'a été confirmé dans ce parcours.

**Résultat :** navigation technique présente, mais l'entrée Menu 2x2 n'est pas encore équivalente à une page catégories dédiée. Le profil est actuellement routé vers Espace, ce qui doit être clarifié avec la destination Profil attendue.

## 5. Synthèse des écarts à traiter

| Priorité proposée | Écart | Prochaine action documentaire / décision |
|---|---|---|
| P0 produit | Notifications et conversations vides dans la cloche | Définir les objets, états, événements, règles de visibilité et liens vers les actions ; préserver l'absence de messagerie libre. |
| P0 produit | Messages liés aux actions non représentés dans le runtime | Définir les déclencheurs d'ouverture, participants, durée, fermeture, blocage/signalement et contexte d'action. |
| P1 UX | Assistant dupliqué entre cloche et bouton flottant | Définir un point d'entrée principal et un accès secondaire cohérent, sans dupliquer l'historique ni augmenter la charge mentale. |
| P1 backend | Notification API uniquement historique ; sink noop | Définir un contrat V1 borné et une implémentation serveur idempotente avant toute route ou table. |
| P1 moteur | Radar UI placeholder malgré logique et tests de domaine | Relier le modèle Radar canonique à l'expérience validée et clarifier l'écart avec le contrat Radar Opportunity historique. |
| P1 moteur | Veille, Recommendation, Trust, Missions non démontrés en runtime | Établir une matrice V1/V2/V3, dépendances, déclencheurs et plafonds de coût avant implémentation. |
| P1 navigation | Menu 2x2 affiche Espace/Talents plutôt que des catégories validées | Réconcilier le besoin catégorie avec la navigation actuelle ; clarifier Profil vs Espace. |
| P2 qualité | Tests de parcours de communication absents | Ajouter plus tard tests de droits, isolation, action-context, états, navigation clavier/mobile et absence de chat libre. |

## 6. Principes de conception à préserver

1. **Une seule cloche, trois parcours clairement nommés** : Notifications, Messages liés aux actions, Assistance.
2. **Aucun message libre entre membres** : une conversation n'existe que lorsqu'une action produit une mise en relation autorisée.
3. **Chaque message doit garder son contexte métier** : action source, participants autorisés, statut et règles de clôture.
4. **Notifications utiles, non bruyantes** : priorités explicites, regroupement et préférences à définir ; pas de notifications redondantes générées par plusieurs moteurs.
5. **Assistance distincte de la messagerie membre** : l'assistant IA ne doit jamais être présenté comme un interlocuteur humain.
6. **Moteurs autonomes et peu coûteux en V1** : règles déterministes, quotas, traitement déclenché par événement ou à la demande ; pas de veille ou de recommandation continue coûteuse sans budget validé.
7. **UI simple** : un parcours principal par besoin, états vides utiles, actions explicites, navigation prévisible.

## 7. Limites de validation

- Aucun code runtime, SQL, test, migration ou configuration n'a été modifié.
- Aucun test applicatif, navigateur, RLS distant ou build n'a été exécuté dans cette vague.
- Les absences sont limitées aux arborescences et artefacts explicitement inspectés ; elles ne constituent pas une preuve universelle d'absence de fonctionnalité hors du dépôt.
- Les contrats REST historiques ne sont pas considérés comme des routes disponibles.
- Les migrations distantes restent non vérifiées.
- TECH-001 à TECH-006 restent ouverts.
- Aucune validation production n'est revendiquée.

**Prochaine étape recommandée :** produire une matrice de décision V1 pour la cloche et les moteurs secondaires, en commençant par les notifications et les conversations déclenchées par action. Cette matrice doit être validée avant tout changement runtime.
