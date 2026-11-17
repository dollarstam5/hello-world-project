# Architecture du système de communication Vitalis

**Statut :** architecture cible V1 à confronter au code existant avant implémentation.  
**Principe :** local-first, déterministe, sans coût variable par message en V1.  
**Limite :** les responsabilités décrites ici ne prouvent pas que des modules équivalents existent déjà dans le dépôt.

## 1. Objectif

Centraliser la sélection et la validation des messages prédéfinis, expressions simples et communications contextuelles, sans centraliser la logique métier des moteurs.

Le système reçoit un contexte minimal et une intention ou un événement métier déjà établi, sélectionne une entrée du catalogue, puis remet un résultat structuré à l'interface.

Il ne doit pas devenir un second système de notifications, une messagerie, un historique de conversation, un moteur de décision métier ou un assistant IA distant en V1.

## 2. Chaîne logique cible

Écran ou domaine métier → intention/événement vérifié → résolution du contexte minimal → sélection du catalogue local → priorité et fréquence → validation → message structuré → présentation UI.

| Responsabilité | Entrée | Résultat |
|---|---|---|
| Context Resolver | Langue, heure, mode, écran, état autorisé | Contexte minimal |
| Intent Resolver | Intention ou événement métier | Catégorie de communication |
| Catalog Selector | Clé, langue, variantes locales | Texte candidat |
| Personalization | Prénom ou variable déjà disponible | Texte personnalisé |
| Priority Manager | Priorité et visibilité actuelle | Décision d'affichage |
| Frequency Manager | Session et événements stables | Afficher ou ignorer |
| Message Validator | Variables, langue, état réel | Message validé ou rejeté |
| Presentation Adapter | Message validé | Contrat consommable par l'UI |

Ces responsabilités peuvent être regroupées dans peu de modules. Ne pas créer une architecture surdimensionnée ni un service distant pour une fonction locale.

## 3. Frontières de responsabilité

- Le domaine métier décide si un bip, une mission, une relation ou une action a réellement atteint son état.
- Le système de communication décide comment l'annoncer, dans quelle langue et à quel moment.
- Le centre de communication conserve ses responsabilités d'organisation des notifications, de l'assistant, des messages et des événements En direct.
- Les composants UI affichent le message et gèrent l'interaction ; ils ne choisissent pas arbitrairement le texte.
- Le système i18n existant reste la source de localisation s'il répond au besoin. Ne pas créer un deuxième moteur de traduction.

## 4. V1 : local-first et sans coût variable par message

La V1 ne doit nécessiter :
- aucun appel à une API de génération de texte ou à un fournisseur IA ;
- aucun appel serveur dédié à une salutation ou expression ;
- aucune nouvelle table Supabase ou migration pour stocker les salutations ;
- aucune requête profil uniquement pour récupérer un prénom ;
- aucun stockage serveur de l'historique des messages de routine.

Le coût marginal des messages standards doit être nul en appels externes et requêtes dédiées. Le système utilise les ressources locales déjà disponibles dans l'application. Cela ne signifie pas que l'hébergement global de l'application n'a aucun coût.

Ordre de préférence pour le contexte :
1. données déjà présentes dans l'état applicatif ;
2. session et profil déjà chargés selon les règles de sécurité ;
3. contexte local de l'écran ou du domaine ;
4. heure et langue du terminal.

En cas de donnée manquante, utiliser une variante neutre. Ne jamais déclencher une requête réseau pour compléter un message non essentiel.

Stockage :
- catalogue dans le bundle local ou le mécanisme i18n existant ;
- règles versionnées dans le code/configuration locale ;
- anti-répétition en mémoire locale limitée ;
- invité : aucune persistance inter-session, effacement à la fin de session ;
- membre : aucune création d'historique parallèle ; préférences futures à raccorder au profil existant après validation.

## 5. Contrat conceptuel du message

Le message remis à l'interface devrait contenir une clé stable, une catégorie, une priorité, le texte localisé résolu, une action ou destination facultative fournie par le domaine, une règle de présentation et un identifiant d'événement métier stable lorsqu'il existe.

Ne jamais inclure de coordonnées précises, identifiants temporaires invités, secrets, jetons d'authentification, contenu de conversation ou données sensibles non nécessaires.

Le contrat TypeScript définitif doit suivre les conventions de types, schémas et validation du dépôt. Ce document ne fournit pas un code prêt à copier.

## 6. Événements et raccordement aux domaines

Les exemples ci-dessous sont des intentions à vérifier, pas un contrat runtime existant :

| Intention | Domaine pressenti | Vérification nécessaire |
|---|---|---|
| Application ouverte / retour | App et session | Point d'entrée et cycle de navigation réels |
| Mission créée / mise à jour | Missions | Événements et statuts déjà existants |
| Bip reçu | En direct | Canal temps réel et événement confirmé |
| Relation établie / clôturée | En direct | Transition métier et participants |
| Scan terminé | Scan | Résultat réel, pas état d'interface supposé |
| Permission refusée | Plateforme | Distinguer refus, indisponibilité et permission non demandée |
| Réseau perdu / retrouvé | Plateforme et synchronisation | Réutiliser les états de connectivité centralisés |

Aucun événement ne doit être émis uniquement pour provoquer un message. Dédupliquer avec les identifiants stables du domaine. Ne jamais exposer les identifiants de session invités.

## 7. Temps, langue et fallback

Utiliser l'heure locale et le fuseau disponibles sur le terminal. Les périodes sont configurables et désactivables. Une heure ou un fuseau indisponible conduit à une formulation neutre. La langue active de l'application est prioritaire ; utiliser le fallback i18n existant. Ne jamais mélanger des fragments FR et EN dans une phrase ni déduire les habitudes de vie à partir de l'heure.

## 8. Priorité et fréquence

Le système garantit que les erreurs et confirmations métier importantes ne sont pas masquées par des salutations ou suggestions.

Il empêche les répétitions sur les re-rendus et changements de route sans nouvelle intention, déduplique les événements, évite les rafales, respecte les préférences et permissions, et laisse l'écran silencieux lorsqu'aucun message n'apporte de valeur.

Les fenêtres temporelles exactes doivent être déterminées par tests UX ; ne pas fixer des délais arbitraires sans mesure.

## 9. Sécurité et confidentialité

- Les messages ne confèrent aucun droit et ne remplacent ni authentification, ni contrôles métier, ni RLS.
- Le prénom est une donnée de présentation, pas une preuve d'identité.
- Les métadonnées modifiables par l'utilisateur ne servent jamais à l'autorisation.
- Aucun identifiant temporaire invité dans les événements de communication.
- Aucun contexte de profil ou de navigation envoyé à un fournisseur tiers en V1.
- Aucun journal du contenu des salutations de routine.
- Les notifications métier suivent les règles de confidentialité du domaine propriétaire.
- Les erreurs n'exposent jamais les secrets ni détails internes.

## 10. Évolution V2 et V3

### V2 — adaptation plus riche
Peut introduire des préférences explicites de ton/fréquence/périodes, des dialogues contextuels et une compréhension naturelle facultative. Une génération IA éventuelle exige une décision dédiée, limites, quotas, consentement, contrôle des données, suivi budgétaire et fallback local. Les confirmations, erreurs, permissions et statuts critiques restent déterministes.

### V3 — assistant personnel facultatif
Peut introduire conversation approfondie, interaction vocale et contexte plus continu, avec contrôles de confidentialité et coordination entre moteurs. Ces capacités restent désactivables et budgétées. Le mode invité ne devient pas un profil persistant par défaut.

## 11. Observabilité et maîtrise des coûts

En V1 : pas de télémétrie contenant le contenu des salutations, pas d'appel serveur par message, pas de dépendance à une clé fournisseur. Les métriques agrégées ne sont autorisées que si un mécanisme existant et conforme est disponible.

En V2/V3, si une génération distante est approuvée : quota par compte/session, budget maximal, limite de longueur et fréquence, cache si sûr, fallback local, coupe-circuit et suivi des coûts. Aucune activation par défaut sans décision explicite.

## 12. Vérification technique et inventaire

1. Identifier les catalogues i18n et conventions de messages existants.
2. Identifier les composants globaux d'accueil, expérience, erreur et notification.
3. Inventorier les événements métier réels.
4. Vérifier la représentation du mode invité et de la session membre.
5. Vérifier la source réelle du prénom et la disponibilité heure/langue.
6. Définir un contrat compatible avec les couches architecturales existantes.
7. Définir les tests sans ajouter de stockage serveur.
8. Mesurer bundle et performance ; éviter une dépendance supplémentaire si les primitives existantes suffisent.

## 12. État réel du dépôt — inventaire initial

L'inventaire ci-dessous a été vérifié dans le dépôt avant d'étendre l'intégration. Il sert à réutiliser les points d'entrée existants et à éviter un second système parallèle.

| Élément existant | Rôle observé | Décision d'intégration |
|---|---|---|
| `src/lib/i18n/messages.ts` et `src/lib/i18n/useI18n.ts` | Catalogue FR/EN et fonction de traduction typée | Conserver comme catalogue et moteur de localisation V1 |
| `src/lib/communication/greeting.ts` | Sélection locale des neuf périodes et garde-fou du nom par session | Première règle contextuelle intégrée ; à étendre sans multiplier les sélecteurs isolés |
| `src/lib/communication/format.ts` | Résolution d'une clé i18n et remplacement contrôlé des variables | Formateur commun utilisé par l'accueil et les notices assistant ; les clés et traductions restent dans i18n |
| `src/components/experience/HomeFoundation.tsx` | Affiche l'accueil et consomme le sélecteur temporel | Premier écran raccordé |
| `src/lib/app/assistant-notices.ts` | Canal Zustand de messages ponctuels, soumis à l'activation volontaire de l'assistant | Réutiliser comme adaptateur de présentation ; ne pas créer un second canal de notices |
| `src/components/experience/AssistantNoticeLayer.tsx` | Affiche et ferme les notices temporaires, avec retrait après neuf secondes | Conserver la responsabilité d'affichage et d'accessibilité ; utiliser le formateur commun |
| `src/lib/app/assistant-preferences.ts` | Préférence locale de l'assistant, désactivée par défaut | Respecter ce consentement ; la communication standard ne doit pas dépendre de l'activation de l'assistant |
| `src/components/experience/CommunicationSheet.tsx` | Centre de communication avec onglets Notifications, Assistant facultatif, Messages et En direct | Conserver le centre ; ses panneaux vides ne sont pas des événements métier |
| `src/components/app/AppShell.tsx` | Monte la couche de notices et le centre de communication | Point de montage global existant à réutiliser |

### Implémentation locale ajoutée — contrat et préparation des messages

Les modules suivants sont maintenant présents sur la branche :

| Module | Responsabilité réellement implémentée | Limite actuelle |
|---|---|---|
| `src/lib/communication/gate.ts` | Trie les demandes par priorité, conserve l'ordre d'origine à priorité égale et supprime les doublons via identifiant d'événement ou clé de répétition fournis | Ne mémorise pas lui-même les messages déjà livrés ; l'appelant fournit cet état |
| `src/lib/communication/dispatch.ts` | Applique le filtre de priorité/déduplication puis résout le texte avec le formateur et le catalogue i18n existants | Prépare un lot ; ne déclenche pas de notification et ne modifie aucun état métier |
| `src/lib/communication/delivery-session.ts` | Conserve en mémoire les identifiants réellement présentés après accusé de présentation explicite ; déduplication des lots suivants pendant la session | Aucun stockage local persistant, aucun identifiant invité temporaire ; aucun producteur de notifications moteur raccordé |
| `src/lib/communication/maturity.ts` | Sélectionne une posture conversationnelle selon le nombre agrégé de comptes inscrits : lancement, croissance, communauté établie, maturité | Fonction pure sans requête ; pas encore raccordée à une source de comptage ni aux composants de suggestions |
| `tests/communication/gate.test.ts` | Vérifie priorités, doublons connus, déduplication dans un lot et limite d'affichage | Tests unitaires, pas tests d'intégration UI |
| `tests/communication/dispatch.test.ts` | Vérifie la chaîne complète locale et l'interpolation des variables | Ne prouve pas encore le raccordement aux événements des moteurs |
| `tests/communication/delivery-session.test.ts` | Vérifie l'accusé de présentation avant déduplication et l'isolation entre sessions | Tests unitaires du contrat de livraison |

Le contrat d'appelant exige un identifiant d'événement stable provenant du domaine lorsqu'une déduplication inter-lots est nécessaire. Ne jamais utiliser un identifiant invité temporaire, un identifiant de rendu React ou une valeur générée à chaque rendu. Sans identifiant stable, la fonction ne peut dédupliquer que ce que l'appelant identifie explicitement.

Aucun délai de fréquence n'est imposé : la déduplication est déterministe et fondée sur les identifiants fournis. La conservation de l'état « déjà livré » est assurée par delivery-session.ts uniquement après que le composant appelant confirme la présentation. La mémoire est limitée à la session courante et disparaît à sa recréation ; aucun stockage serveur ni appel réseau n'est ajouté.

### Parcours d'accueil et reconnaissance de l'identité

- `HomeFoundation` reçoit la session depuis `useAuth`. L'état Auth est la source de vérité pour le libellé Invité/Membre ; le store local `useIdentity` ne doit pas, à lui seul, attribuer un statut de compte ou de confiance.
- La page d'accueil propose au visiteur un accès au mode invité En direct et un accès à la création de compte. Le membre reconnu reçoit un accès à son profil et une explication courte de ce que son compte lui permet de gérer.
- `OnboardingSheet` adapte sa dernière explication au statut de session, sans devenir un formulaire d'inscription.
- L'inscription courte transmet le nom affiché dans les métadonnées Auth. Le déclencheur `handle_new_user` existant crée le profil avec cette valeur. Ce nom reste déclaratif et ne change pas le niveau UDI.
- L'inscription sans session (par exemple en attente de confirmation e-mail) doit rester présentée comme une confirmation en attente, pas comme une connexion réussie.
- Les niveaux UDI supérieurs ne sont pas inférés du fait d'être connecté. Ils exigent une lecture fiable de la source UDI ; le présent raccordement ne prétend pas encore fournir cette lecture.
- Les suggestions d'accueil n'utilisent aucun compteur de progression non disponible. Les événements de première utilisation et les signaux de maturité ne doivent être raccordés qu'à partir de sources métier réelles.

### État réel des moteurs Réel et Radar — inventaire complémentaire

L'inspection du HEAD `a813f026` confirme des producteurs et rendus métier propres aux moteurs, mais pas leur raccordement au pipeline partagé de communication ni au centre global.

| Domaine | Source et déclencheur observés | Présentation actuelle | Limite / décision |
|---|---|---|---|
| Réel — membre | RPC Supabase dédiées pour présence, bips et relations ; abonnement privé `subscribeToReelMemberActivity` aux changements `reel_bips` / `reel_connections` et au broadcast `reel_activity` | `ReelActivityPanel` recharge les projections autorisées et affiche bips reçus, décisions et relations | Garder la propriété au moteur ; ne pas recopier automatiquement dans le centre global |
| Réel — invité | Fonctions serveur de session invitée ; rafraîchissement périodique de 3 secondes dans le contrôleur lorsque les panneaux d'activité sont ouverts | Même panneau, avec projections et actions invitées séparées | Pas d'identifiant de session invité dans le pipeline partagé ; ne pas transformer le polling local au moteur en nouvelle infrastructure globale |
| Radar V1 | `radarsRepository` via `useLocalQuery`, opérations créer/modifier/annuler et états conservés par le dépôt offline | `RadarManagement` affiche les intentions personnelles, leur statut, les erreurs et confirme en inline les sauvegardes/modifications/annulations réussies via le formateur commun | Aucun moteur de matching automatique ni producteur d'alerte confirmé dans ce raccordement ; ne pas annoncer de correspondance ou d'alerte |
| Centre global | Aucun adaptateur Réel/Radar vers `dispatch.ts` ou producteur de notification partagé établi dans cet inventaire | Les moteurs conservent leurs panneaux et retours locaux | Toute future agrégation exige un contrat d'événement stable, une projection autorisée et des tests anti-doublon |

Le panneau Réel expose des états métier réels et recharge les données après les actions. Son onglet « Alertes » compose localement des bips en attente et des relations actives ; il ne constitue pas à lui seul un flux de notifications global. Les états Réel ne doivent donc pas être dupliqués dans `CommunicationSheet` sans contrat explicite.

Radar conserve et gère des intentions privées offline-first. La présence de statuts dans le modèle ne prouve pas l'existence d'un traitement de matching, d'une alerte planifiée ou d'une source de correspondance. La communication peut confirmer la sauvegarde ou l'échec d'une opération seulement à partir du résultat effectif du dépôt ; elle ne peut pas annoncer un résultat de recherche automatique.

### Limites observées

- Le canal `publishAssistantNotice` n'a pas d'appel métier externe à son propre module dans l'état inspecté ; le seul déclenchement observé est le message de bienvenue après activation volontaire dans les paramètres.
- Les onglets Notifications, Messages et En direct du centre présentent encore des états vides ; aucun flux de notifications métier ne doit être supposé opérationnel à partir de leur seule présence.
- Le sélecteur temporel ajouté à Home est une première règle, pas encore un orchestrateur universel pour tous les textes de l'application.
- Le formateur commun résout les variables de catalogue ; il ne décide pas des priorités, de la fréquence ou du déclenchement des messages.
- Flash utilise maintenant le formateur commun pour la confirmation de brouillon réellement enregistré et l'erreur de sauvegarde ; ces retours restent inline dans l'expérience Flash.
- Scan utilise maintenant le formateur commun pour les erreurs de capacité navigateur, de permission/localisation et d'exécution de recherche ; ces retours restent inline dans le panneau Scan.
- Radar utilise le formateur commun pour les erreurs d'action et confirme en inline, après retour réussi du dépôt offline-first, la création, la modification et l'annulation d'une veille. Ces confirmations ne signifient pas qu'un matching ou une alerte distante a eu lieu.
- Flash conserve aussi des états localisés inline pour la dictée (navigateur non compatible, écoute, résultat reçu, permission refusée et erreur) ainsi que pour la localisation facultative (indisponibilité, permission, délai dépassé, erreur et saisie manuelle après échec du géocodage inverse). Ces textes viennent déjà du catalogue i18n ; ils ne déclenchent ni notification ni événement partagé.
- La localisation Flash est facultative : son échec ne bloque pas l'enregistrement du brouillon ; le lieu peut être renseigné manuellement. La confirmation de brouillon n'est affichée qu'après le retour réussi de `createFlash`.
- Scan présente « aucun résultat » comme un état neutre localisé, distinct d'une erreur. Le résultat vide n'est pas une notification et ne doit pas être interprété comme un échec.
- Les états de dictée, de localisation facultative et le résultat vide Scan n'ont pas besoin d'être forcés dans `dispatch.ts` ou `delivery-session.ts` : ils sont des retours inline synchrones/contextuels, déjà localisés par i18n et sans variables à interpoler. Le formateur commun est réservé ici aux messages où sa résolution de clé/variables apporte une valeur réelle.
- Ces raccordements ne passent volontairement ni par `dispatch.ts`, ni par `delivery-session.ts`, ni par le canal Assistant : il s'agit de confirmations/erreurs locales appartenant aux moteurs, pas de notifications d'événements partagés. Les autres erreurs et confirmations restent à inventorier avant migration.
- Le canal de l'assistant reste facultatif et opt-in. Il ne doit pas être utilisé pour les confirmations essentielles, erreurs, permissions ou communications qui doivent fonctionner même si l'assistant est désactivé.

### Ordre d'intégration recommandé

1. Stabiliser le contrat local commun et le catalogue i18n sans changer le rendu des domaines.
2. Raccorder les notices ponctuelles existantes au contrat commun, en préservant l'opt-in de l'assistant.
3. Étendre le raccordement du formateur commun aux autres erreurs et confirmations des moteurs après inventaire des sources fiables ; ne passer par le dispatch partagé que pour des communications multi-composants qui justifient réellement priorité et déduplication.
4. Raccorder les notifications des moteurs uniquement à partir d'événements métier existants et dédupliqués.
5. Remplir les panneaux du centre de communication seulement lorsque leurs données réelles sont disponibles.

## 13. Tests d'acceptation

- sélection déterministe, FR/EN et fallback ;
- limites des périodes horaires, fuseau manquant et changement d'heure ;
- invité/membre, prénom présent/absent/non autorisé ;
- priorités, concurrence, répétition et déduplication ;
- distinction local/envoyé/confirmé ;
- erreur et reprise hors ligne ;
- absence d'appel réseau pour une salutation ;
- absence d'historique serveur et d'identifiant invité dans les payloads ;
- taille du bundle et performance mobile.


## 14. Contrat d'architecture pour toute évolution

Toute nouvelle couche doit respecter le contrat de gouvernance produit. La chaîne technique reste : producteur métier propriétaire → adaptateur typé → contexte minimal → catalogue i18n → personnalisation autorisée → politique de consentement/maturité/priorité/fréquence → validation → présentation → accusé de présentation.

Règles d'implémentation :
- Le producteur est la seule source de vérité pour son événement et son état.
- L'adaptateur de communication ne modifie jamais l'état métier et ne fabrique aucun événement.
- Le catalogue i18n existant reste la source des textes ; aucune traduction parallèle.
- Les confirmations et erreurs essentielles utilisent des canaux non dépendants de l'opt-in assistant.
- Le centre ne reçoit que des événements munis d'un identifiant stable et d'un propriétaire de domaine clairement défini.
- L'accusé de livraison est enregistré uniquement après présentation effective.
- Le mode invité ne fournit aucun identifiant temporaire réutilisable hors de sa session.
- Toute donnée agrégée de maturité doit venir d'une source autorisée ; aucun comptage côté client des sessions.
- Les suggestions sont évaluées à partir de la disponibilité réelle de la route, du moteur et de l'action au moment de l'affichage.
- Les composants En direct restent propriétaires de leurs états jusqu'à la mise en place d'un contrat d'événements partagés vérifié.

## 15. Gouvernance V2/V3 pour les couches intelligentes

Une couche de compréhension naturelle ou de génération ne peut être ajoutée qu'en V2/V3 après décision distincte. Elle doit rester un adaptateur facultatif et remplaçable, avec fallback local déterministe. Elle ne peut ni confirmer une transition métier, ni décider des droits, ni modifier la RLS, ni générer des identifiants ou événements.

Avant connexion d'un fournisseur distant, documenter le flux de données, les champs transmis, la finalité, le consentement, la rétention, les régions de traitement, les coûts, les quotas, le coupe-circuit, les délais, les erreurs et le comportement hors ligne. Aucun contexte sensible ou identifiant invité temporaire ne doit être envoyé. Le système doit rester utilisable lorsque l'assistant est désactivé ou indisponible.

Les outils d'action restent en lecture seule par défaut. Toute action externe ou ayant un effet durable exige une confirmation adaptée au risque et une validation par le domaine métier. La sortie du modèle est une proposition de formulation ou d'aide, jamais une source de vérité.

## 16. Porte de validation avant raccordement

Un raccordement est refusé tant que les éléments suivants ne sont pas établis :
1. producteur réel et propriétaire identifié ;
2. contrat de données typé et stable ;
3. règles invité/membre et autorisations vérifiées ;
4. clés i18n et fallback disponibles ;
5. priorité, fréquence, anti-répétition et durée de vie définies ;
6. état réseau/local/serveur correctement représenté ;
7. destination UI réelle et accessible ;
8. tests unitaires, intégration et rendu mobile ;
9. coût réseau, stockage, bundle et IA acceptable ;
10. documentation et statut d'implémentation mis à jour.

Une capacité documentée comme future ou expérimentale ne doit pas être raccordée à un écran de production avant franchissement de cette porte.

## Références

- [Système de communication humaine V1 à V3](../01-product/communication-system-v1-v3.md)
- [Gouvernance complète V1 à V3](../01-product/communication-system-governance-v1-v3.md)
- [Catalogue de communication V1](../01-product/communication-catalog-v1.md)
- [Architecture front-end et expérience](./frontend-experience.md)
- [Architecture IA et intégrations](./ai-architecture-integrations.md)
- [Centre de communication — règles produit V1](../01-product/communication-center-v1.md)


### Règle de production — aucune notification fabriquée

Le centre de communication ne doit afficher que les événements transmis par une source métier réelle et confirmée. En l'absence de source, les états vides localisés restent visibles ; aucun exemple, compteur, événement simulé ou notification de démonstration ne doit être injecté dans les onglets de production.

Le pipeline est prêt à consommer un lot lorsque son domaine producteur sera disponible :
1. le domaine fournit une clé i18n autorisée et un identifiant d'événement stable, jamais un identifiant temporaire invité ;
2. prepareCommunicationMessages() valide les doublons et prépare le texte localisé ;
3. l'interface présente le message ;
4. seulement après présentation effective, l'appelant transmet le message à markDelivered() du delivery-session ;
5. un nouvel arrivage portant le même identifiant dans la session est ignoré.

Le système ne crée ni événement métier, ni notification, ni compteur, ni historique. Les événements En direct déjà exposés dans ReelActivityPanel restent affichés par leur composant métier tant qu'aucun flux partagé de notifications n'est fourni. Il ne faut pas recopier ou agréger ces données dans le centre par supposition.

**État de préparation :** catalogue, formatage, priorité, déduplication et accusé de livraison en mémoire sont implémentés ; les producteurs de notifications du centre ne sont pas présents dans le dépôt inspecté. Le raccordement UI doit donc rester inactif jusqu'à la disponibilité de ces producteurs.


### Posture selon la taille de la communauté

`getCommunicationMaturityProfile()` applique les seuils définis dans la spécification produit : 0–500, 501–5 000, 5 001–9 999 et 10 000+. Le compteur attendu est un agrégat fiable de comptes inscrits, hors invités et comptes de test. Le module n'effectue aucune lecture réseau et retombe sur la posture de lancement si le nombre est absent. Il ne faut pas brancher un compteur inventé ni déduire le volume depuis les sessions locales.

Cette fonction est un sélecteur de posture, pas un générateur de suggestions. Les suggestions restent conditionnées à l'existence réelle des fonctionnalités et de leurs données. Tant que la source agrégée et les producteurs métier ne sont pas disponibles, le helper peut être testé mais ne doit pas être présenté comme une personnalisation déjà active en production.
