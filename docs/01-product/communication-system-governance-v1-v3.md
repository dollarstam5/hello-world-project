# Gouvernance complète du système de communication Vitalis — V1 à V3

**Statut :** référence normative complémentaire pour produit, design, développement, QA et futurs agents.
**Portée :** toute communication visible ou audible : accueil, onboarding, aide, suggestions, confirmations, erreurs, notifications, centre, assistant et futures expériences conversationnelles.
**À lire avec :** [spécification produit](./communication-system-v1-v3.md), [catalogue V1](./communication-catalog-v1.md), [charte de langage](./communication-language.md), [centre](./communication-center-v1.md) et [architecture](../02-architecture/communication-system-architecture.md).

Une exigence produit n'est pas une preuve d'implémentation. Chaque capacité doit être vérifiée dans le code, les tests et les sources métier avant activation.

---

## 1. Mission et principes non négociables

Le système aide une personne à comprendre Vitalis, ses actions et les informations utiles. Il ne remplace ni les moteurs métier, ni le système de notifications, ni la messagerie, ni l'authentification, ni les permissions, ni un assistant conversationnel.

1. **Vérité avant formulation :** annoncer uniquement ce qu'une source fiable a confirmé.
2. **Humain avant technique :** ton chaleureux, naturel, direct, simple et respectueux ; jamais robotique, culpabilisant ou artificiellement enthousiaste.
3. **Utilité avant présence :** le silence est préférable à une intervention inutile.
4. **Contexte minimal :** utiliser uniquement les données déjà disponibles, nécessaires et autorisées.
5. **Séparation des responsabilités :** le domaine décide de l'état ; la communication choisit comment le dire.
6. **Consentement et contrôle :** les communications facultatives respectent les préférences ; l'assistant reste opt-in.
7. **Local-first en V1 :** aucun fournisseur IA distant, aucune requête dédiée par message, aucune dépense variable par communication standard.
8. **Progressivité :** une fonctionnalité future n'est jamais présentée comme disponible.
9. **Accessibilité et réactivité :** communication lisible, non bloquante et cohérente avec l'action.
10. **Évolutivité sans dette :** réutiliser i18n, les notices, les préférences et les domaines existants ; pas de systèmes parallèles.

## 2. Taxonomie : ne jamais confondre les types

| Type | Finalité | Déclencheur autorisé | Règle |
|---|---|---|---|
| Accueil | Accueillir ou retrouver | Ouverture/retour réellement identifié | Peu fréquent, peut être silencieux |
| Explication / onboarding | Faire découvrir une capacité existante | Étape ou écran pertinent | Progressif, une aide à la fois |
| Suggestion | Proposer une action utile | Contexte pertinent + capacité disponible | Facultative, ignorable, anti-répétition |
| Aide contextuelle | Expliquer comment continuer | Demande ou difficulté identifiable | Courte et actionnable |
| Confirmation | Confirmer le résultat d'une action | Résultat confirmé par le domaine | Indépendante de l'assistant |
| Erreur / récupération | Dire ce qui a échoué et la suite | Échec réel ou blocage | Immédiate, précise, non culpabilisante |
| Notification métier | Signaler un événement utile | Événement confirmé par le domaine | Stable, dédupliquée, préférences respectées |
| Message / conversation | Échange lié à une action autorisée | Cycle métier correspondant | Pas de messagerie libre en V1 |
| Assistant | Aide conversationnelle facultative | Activation explicite et demande | Transparence, quotas et limites propres |
| Expression décorative | Ajouter une touche humaine | Aucun besoin métier | Rare, jamais prioritaire |

Une suggestion de découverte n'est pas une notification, n'entre pas dans les compteurs non lus et ne crée aucun événement. Une confirmation n'est pas une suggestion. Un message assistant n'est pas une notification métier. Le centre organise les espaces mais ne devient pas propriétaire des données métier.

## 3. Posture selon la maturité de Vitalis

La taille de communauté ajuste le degré d'accompagnement, jamais les droits, la vérité métier ou la sécurité.

| Comptes inscrits cumulés | Posture | Niveau d'accompagnement |
|---:|---|---|
| 0–500 | Conversationnelle et proche | Aide de découverte généreuse, explications simples, suggestions fréquentes mais espacées, accompagnement des premières actions et présentation des moteurs |
| 501–5 000 | Guidée | Conseils contextualisés, moins d'explications générales, aide sur les étapes réellement non maîtrisées |
| 5 001–9 999 | Discrète mais présente | Moins d'interventions spontanées, aide surtout à la demande ou au moment utile |
| 10 000+ | Professionnelle et intelligente | Messages concis et précis, contexte autorisé, anticipation prudente et justifiée |

**Mesure retenue pour V1 :** nombre agrégé de comptes inscrits cumulés, hors invités et comptes de test. Ce choix opérationnel n'est pas encore une source runtime vérifiée. Une évolution vers les utilisateurs actifs (par exemple actifs mensuels) exige une décision produit et une définition stable de l'activité. Ne pas mélanger inscrits, visiteurs, invités, appareils et comptes actifs.

**Source et repli :**
- utiliser uniquement une valeur agrégée fiable déjà disponible ;
- ne pas compter localement les sessions ni demander une liste de profils ;
- aucune requête réseau supplémentaire par communication ;
- si la source est absente, invalide ou trop ancienne, utiliser la posture de lancement sans afficher ni prétendre connaître le nombre ;
- le sélecteur de posture ne génère aucune suggestion et ne déclenche aucun message.

« Fréquente » au lancement signifie plusieurs occasions de découverte au fil du parcours, pas plusieurs popups sur un même écran. Une suggestion à la fois, jamais au-dessus d'une erreur ou d'une confirmation, jamais répétée immédiatement après fermeture/refus. Préférer une aide inline, un guide ou une explication dans le moteur, pas une notification système.

## 4. Conditions de déclenchement

Avant affichage, vérifier : intention exacte ; source et propriétaire de l'état ; fiabilité et fraîcheur ; mode invité/membre ; disponibilité réelle de la fonction ; utilité ; priorité concurrente ; répétition ; préférence/permission ; exactitude si le réseau ou la session change immédiatement après.

Si une condition essentielle manque, ne pas afficher le message. Le domaine propriétaire conserve son état et son rendu.

**Sources autorisées :** résultat du domaine, transition de statut validée, résultat d'une permission réellement demandée, connectivité de la couche existante, préférence explicite, contexte local déjà chargé, heure et langue du terminal.

**Sources interdites :** clic sans résultat ; compteur déduit du nombre de composants ou sessions ; fixtures en production ; ID temporaire invité utilisé comme événement ; donnée d'un autre moteur sans contrat ; inférence d'humeur, intention, situation familiale ou disponibilité ; statut optimiste non confirmé ; présence d'un onglet vide.

## 5. Cycle de vie et vérité des états

Préserver les distinctions applicables : proposé, prêt à envoyer, en cours, enregistré localement, en attente de synchronisation, envoyé par le client, reçu par le service, accepté/confirmé par le domaine, échoué, annulé, expiré, clôturé.

Ne jamais réduire ces états à « fait » ou « envoyé ». Une opération locale en attente n'est pas une opération serveur confirmée. Une réponse réseau positive n'est pas la preuve de la transition métier finale si le contrat du domaine exige une confirmation supplémentaire.

Hors ligne :
- dire ce qui est gardé sur l'appareil ;
- promettre la reprise automatique uniquement si la file et le mécanisme existent ;
- ne pas perdre l'action au redémarrage si le domaine promet sa conservation ;
- signaler un échec définitif et une suite simple ;
- ne pas annoncer un résultat distant avant confirmation.

## 6. Priorités et arbitrage

Ordre obligatoire :
1. sécurité, confidentialité et information critique ;
2. erreur bloquante ou résultat d'action attendu ;
3. confirmation métier nécessaire ;
4. demande d'action ou notification importante ;
5. reprise, progression ou attente utile ;
6. aide contextuelle et suggestion pertinente ;
7. accueil ;
8. expression décorative.

Une priorité basse ne masque jamais une priorité haute. Éviter deux messages demandant une décision au même moment. Les confirmations et erreurs métier restent disponibles si l'assistant est désactivé. Les messages critiques ne sont pas supprimés par un quota de suggestions. La priorité ne contourne pas le consentement aux notifications non critiques.

## 7. Fréquence, répétition et fatigue

- Dédupliquer les événements avec un identifiant stable fourni par le domaine.
- Pour une suggestion, définir une clé de contexte stable et une règle de réapparition.
- Ne jamais utiliser un ID de rendu, un timestamp généré à chaque rendu ou un ID invité temporaire.
- Accuser livraison après présentation effective, jamais lors de la simple préparation.
- Interpréter fermeture, refus et report selon le type ; ne pas réafficher immédiatement.
- Ne pas imposer de délais arbitraires sans test UX ; les limites par type/session/jour doivent être mesurables et configurables.
- Les messages essentiels ne sont pas soumis au quota des suggestions.
- Aucun historique serveur des salutations ou conseils de routine.
- Prévoir un contrôle « ne plus montrer » ou une préférence lorsque la répétition est possible.
- Ignorer une suggestion ne doit jamais priver d'une fonctionnalité.

## 8. Personnalisation et contexte

Variables V1 admises : langue active, heure/fuseau disponibles, mode invité ou compte, écran/moteur actif, état métier autorisé, nom d'affichage déjà chargé et autorisé, préférences explicites.

**Règles du nom :** usage occasionnel et facultatif ; jamais systématique ; ne pas extraire un prénom d'un nom complet ; aucune lecture réseau supplémentaire ; inutile dans les erreurs techniques, libellés et notifications répétitives ; variante neutre obligatoire.

Interdictions : inférence psychologique ou sensible ; personnalisation publicitaire ; profilage caché ; géolocalisation pour personnaliser une salutation ; envoi de contexte à un tiers en V1 ; variables non validées ou texte utilisateur injecté dans une clé i18n.

## 9. Frontières invité / membre / confiance

- Invité et membre sont distincts ; ne jamais attribuer les droits membre à l'invité.
- Aucun historique persistant de communication invité ; état temporaire limité à la session et effacé à sa fin.
- Aucun ID temporaire invité dans événements partagés, logs, analytics ou clés de déduplication persistantes.
- Ne pas suggérer à l'invité une action réservée au membre.
- Authentifié ne signifie pas identité vérifiée ou confiance élevée.
- Le nom d'affichage n'est pas une preuve d'identité.
- Les règles de rétention du moteur prévalent.
- La communication ne modifie jamais permissions, RLS ou accès.

## 10. Langue, accessibilité et expérience

- Réutiliser i18n et ses types ; pas de second moteur de traduction.
- Toute nouvelle clé visible est traduite dans toutes les langues supportées avant activation.
- Traduire le sens, le ton, la politesse et l'exactitude, pas mot à mot.
- Variable absente : variante neutre, jamais placeholder brut.
- Pas de HTML non échappé ni de contenu serveur traité comme instruction.
- Messages courts, une idée principale et une prochaine étape si nécessaire.
- Contraste, taille de texte, focus clavier, lecteur d'écran, labels et annonces ARIA appropriés.
- Ne pas annoncer deux fois le même message par toast et lecteur d'écran.
- Messages temporaires lisibles sans dépendre d'une animation.
- Ne pas bloquer la navigation ni masquer les contrôles.
- Petit écran : pas de débordement, popups empilées ou dialogues trop longs.
- Respecter mouvement réduit ; animation brève et jamais nécessaire à la compréhension.
- Le ton humain ne doit pas remplacer une information essentielle par une formule vague.

## 11. Centre de communication

Quatre espaces distincts : Notifications, Assistant (masqué si désactivé car opt-in), Messages, En direct.

- Chaque espace conserve sa source et sa responsabilité.
- Aucun compteur sans données réelles.
- Ouvrir le centre ne marque pas tout comme lu.
- Lu, action à faire et action accomplie sont distincts.
- Un événement présent dans plusieurs espaces est compté une fois au total.
- Les notifications peuvent résumer et renvoyer vers l'espace propriétaire, sans dupliquer tout le contenu.
- Messages liés à une action ou mise en relation acceptée ; pas de messagerie libre V1.
- En direct reste propriétaire de ses bips et relations ; le centre ne duplique pas le moteur.
- Sans producteurs métier, afficher un état vide explicite, jamais une démonstration en production.

## 12. Suggestions de découverte par moteur

| Moteur | Conseil autorisé V1 | Limite obligatoire |
|---|---|---|
| Flash | Aider à préparer un besoin ou une proposition à durée limitée | Compte connecté et validations requises ; succès après confirmation de création |
| Scan | Expliquer comment lancer une recherche publique de proximité | Déclenchement volontaire ; demander la position au moment utile ; aucun résultat promis |
| En direct | Expliquer présence, bips et mise en relation | Permissions et mode d'accès requis ; aucune présence, bip ou relation simulée |
| Radar | Expliquer l'enregistrement et la gestion d'une intention privée | Ne pas promettre correspondance automatique ni alertes tant que non raccordées |

Évaluer la disponibilité au moment de l'affichage. Les suggestions pointent vers une route/action existante et testée. Une aide ne contourne pas un contrôle d'accès et ne déclenche pas une permission sans explication et geste volontaire.

## 13. Architecture cible et réutilisation

Chaîne cible : source métier confirmée → adaptateur typé → contexte minimal → catalogue/i18n → personnalisation → politique (consentement, maturité, priorité, fréquence, déduplication) → validation → présentation → accusé de présentation → mesure qualité minimale.

Ne pas implémenter dix services si quelques fonctions pures et adaptateurs suffisent. Réutiliser les briques présentes sur la branche :
- i18n existant pour catalogue et traduction ;
- canal Zustand de notices et AssistantNoticeLayer pour notices assistant ;
- assistant-preferences pour opt-in ;
- CommunicationSheet pour le centre ;
- gate, dispatch, format, delivery-session, runtime, `CommunicationRuntimeProvider` et maturity pour les contrats locaux déjà ajoutés.

Ne pas créer un second store de notices, un deuxième catalogue, un nouvel orchestrateur de navigation, un historique parallèle ou un service réseau dédié aux salutations.

## 14. Limites techniques et budgétaires V1

- Aucun appel IA distant pour communications standard.
- Aucun coût variable par message.
- Aucune table, migration ou requête Supabase uniquement pour la communication de routine.
- Aucun chargement de profil uniquement pour personnaliser un texte.
- Pas de push, polling, websocket ou abonnement temps réel ajouté pour faire vivre artificiellement le centre.
- Pas de dépendance lourde pour quelques règles de texte.
- Respect des budgets bundle, lazy loading et performance PWA/mobile.
- Messages essentiels hors ligne lorsqu'ils reposent sur contexte local.
- La couche de communication ne garantit pas la livraison distante d'une notification ; cela relève de l'infrastructure métier existante.

Toute exception exige décision produit/technique, estimation de coûts, quotas, fallback et validation sécurité.

## 15. Feuille de route fonctionnelle

### V1 — fondation locale, gratuite et fiable
Salutations locales ; catalogue FR/EN ; formatage typé ; messages prédéfinis ; règles déterministes ; priorité et anti-répétition ; confirmation de brouillon et erreur de sauvegarde Flash, erreurs de localisation/recherche Scan et confirmations de création/modification/annulation Radar formatées par la couche commune tout en restant inline dans leurs moteurs ; conseils de découverte progressifs dès qu'une source et un point UI réels existent ; centre alimenté seulement par producteurs vérifiés ; assistant facultatif désactivé par défaut ; invité sans historique persistant ; aucune IA distante pour communications standard.

### V2 — adaptation contextuelle et dialogue guidé
Capacités envisageables : préférences explicites de fréquence, moments de silence, ton et catégories ; onboarding adaptatif selon étapes réellement terminées ; dialogues courts avec réponses prédéfinies ; aide proactive à partir d'états fiables ; personnalisation consentie ; voix ciblée ; assistant intelligent facultatif si budget approuvé.

Exigences V2 :
- aucune génération libre pour statuts métier, permissions, sécurité, confirmations ou erreurs critiques ;
- toute suggestion générée est validée contre fonctions et actions disponibles ;
- contexte minimal, consentement et protection des données ;
- quotas par compte/session, plafonds budgétaires, alertes et coupe-circuit ;
- fallback déterministe local si service lent, indisponible, trop coûteux ou désactivé ;
- distinguer suggestion IA et vérité confirmée par le domaine ;
- évaluer qualité, biais, sécurité, hallucinations et coûts avant activation.

### V3 — compagnon personnel multimodal sous contrôle
Capacités possibles : conversation naturelle suivie à la demande ; voix bidirectionnelle ; mémoire personnelle contrôlée, visible, modifiable et supprimable ; orchestration multi-moteurs sans transfert de propriété des données ; recommandations anticipées sur signaux autorisés ; adaptation du style sans imitation trompeuse d'une personne humaine.

Exigences V3 :
- consentement granulaire voix, mémoire, données et intégrations ;
- transparence sur ce que l'assistant sait, ignore et a fait ;
- outils en lecture seule par défaut ; confirmation adaptée au risque pour toute action ;
- rétention définie par catégorie, finalité et contrôle utilisateur ;
- séparation mémoire conversationnelle / état métier ;
- évaluations sécurité, vie privée, robustesse et coût ;
- désactivation de l'assistant sans dégrader l'application essentielle.

Aucune capacité future n'est promise ou activée par cette feuille de route. Chaque mise en œuvre demande une spécification et une validation propres.

## 16. Gouvernance de l'intelligence et de l'IA

L'intelligence évolue par paliers : règles déterministes V1, adaptation contrôlée V2, assistant multimodal facultatif V3. « Plus intelligent » signifie plus pertinent et fiable, pas plus bavard ou intrusif.

L'IA ne crée jamais de vérité métier ; ne décide pas de droits, identité, confiance ou permissions ; ne confirme pas une action non confirmée ; ne fabrique pas de personnes, offres, événements, compteurs ou disponibilités ; ne contourne pas invité/membre ou RLS ; n'infère pas d'attributs sensibles ; ne se présente pas comme humain. Elle peut expliquer ou suggérer ; validation et exécution appartiennent aux domaines et à la personne.

Avant toute IA distante : cas d'usage justifié, fournisseur approuvé, flux de données cartographié, consentement, minimisation, rétention, sécurité, coûts, quotas, observabilité, fallback, désactivation et tests d'hallucination.

## 17. Dégradation gracieuse

- Assistant désactivé : aucun message/espace Assistant, mais erreurs et confirmations essentielles actives.
- Catalogue incomplet : fallback local neutre ; jamais de clé brute.
- Compteur absent : posture de lancement, sans inventer le nombre.
- Source métier absente : aucune notification ni compteur correspondant.
- Réseau absent : état local réel, aucune annonce de résultat distant.
- Permission refusée : expliquer l'effet et permettre de continuer sans permission si le produit le permet.
- Route indisponible : ne pas afficher la suggestion.
- IA indisponible : revenir aux règles locales et ne pas bloquer l'application.
- Rendu UI échoué : ne pas marquer le message comme présenté.

## 18. Tests obligatoires

**Unitaires :** sélection et fallback FR/EN ; variables absentes/invalides ; bornes horaires, fuseaux et changements d'heure ; seuils de maturité et valeurs invalides ; priorités ; déduplication intra/inter-lots ; accusé après présentation ; fermeture/refus ; distinction suggestion/notification/confirmation ; séparation invité/membre.

**Intégration :** source métier réelle vers adaptateur et présentation ; aucun message sans événement confirmé ; aucun doublon entre espaces ; assistant désactivé sans impact sur erreurs essentielles ; permission refusée, réseau absent et reprise ; destinations réelles ; compteur depuis source agrégée approuvée ; absence d'ID invité temporaire dans payloads/logs.

**UI et non fonctionnels :** petits écrans, Android, iOS/PWA, desktop ; lecteur d'écran, clavier, focus et contraste ; mouvement réduit ; absence de popup empilée ; réactivité ; bundle et chargement différé ; aucune requête dédiée aux messages locaux ; budget performance et coût.

Un texte existant dans le catalogue ne suffit pas : source, conditions, permission, destination, présentation, déduplication, accessibilité et tests doivent être validés.

## 19. Mesure de qualité sans surveillance excessive

Mesures possibles et minimisées : suggestions présentées par catégorie ; fermeture/ignorance agrégée ; erreurs de rendu/traduction ; latence de présentation ; réussite d'action mesurée par le domaine, non attribuée automatiquement au message.

Interdictions : journaliser le contenu personnel des messages de routine ; enregistrer conversations invitées ; tracer les déplacements pour mesurer une suggestion ; optimiser les clics au détriment de la compréhension ou du contrôle. Les mesures réduisent le bruit et améliorent la clarté, pas l'engagement artificiel.

## 20. Processus obligatoire avant toute nouvelle fonctionnalité

1. Identifier version cible V1/V2/V3.
2. Décrire problème utilisateur et bénéfice.
3. Inventorier composants, stores, clés i18n, événements et services existants.
4. Nommer source de vérité et propriétaire métier.
5. Préciser invité/membre, permissions, consentement et données.
6. Classer le type de communication et la priorité.
7. Définir déclencheur, conditions, états et cas de silence.
8. Écrire textes FR/EN et fallbacks.
9. Définir fréquence, déduplication, durée de vie et rétention.
10. Vérifier budgets réseau, IA, stockage, bundle et performance.
11. Définir tests unitaires, intégration, UI, sécurité et accessibilité.
12. Documenter limites connues et repli.

Pendant le développement, réutiliser les briques existantes, ne pas modifier les transitions métier depuis la communication, ne pas ajouter de producteurs fictifs et livrer progressivement avec preuves. Avant activation, vérifier sources, autorisations, traductions, modes, réseau, performances, coûts et désactivation de l'assistant.

## 21. Statut d'implémentation constaté sur la branche

Cette photographie doit être recontrôlée sur le HEAD courant avant chaque release.

| Couche | État constaté | Limite |
|---|---|---|
| Catalogue i18n FR/EN | Présent | Catalogue éditorial complet pas entièrement raccordé |
| Salutation locale | Présente | Premier cas, pas orchestrateur global |
| Formateur central | Présent | Résout clés/variables, ne déclenche pas seul |
| Gate priorité/déduplication | Présent | Dépend des identifiants fournis par domaines ; les messages critiques sont préservés des limites d'affichage |
| Préparation messages | Présente | Ne crée aucun événement/notification |
| Runtime de session | Instance unique montée par `AppShell`, partagée via `useCommunicationRuntime()` ; accusé après présentation et réinitialisation disponibles | Utilisée par les notices Assistant ; pas encore de producteurs métier partagés Flash/Scan/Réel/Radar ni de centre global alimenté |
| Accusé présentation session | Présent | Mémoire de session, dépend de l'appelant |
| Sélecteur maturité | Présent | Source compteur et UI non raccordées |
| Conseils par moteur | Documentés | Pas actifs comme suggestions runtime |
| Réel — activité métier | Présente dans le moteur | Bips/relations membres via RPC + Realtime privé ; invités via fonctions serveur + rafraîchissement périodique ; aucun adaptateur vers le centre global |
| Radar V1 | Gestion locale offline-first présente | Création, modification et annulation confirmées inline après succès du dépôt ; matching automatique et alertes non établis |
| Centre communication | UI présente | Flux métier et compteurs globaux non raccordés ; les panneaux propres à Réel restent séparés |
| Assistant | Facultatif, opt-in | Ne porte pas les communications essentielles |
| Producteurs partagés du centre | Non établis dans l'audit | Ne pas inventer de notifications |
| IA standard | Absente et exclue V1 | Toute évolution demande une décision |

Cette table est une photographie, pas une promesse permanente. Mettre à jour chaque ligne avec fichiers, tests, source métier et preuve UI lorsqu'une capacité évolue.

## 22. Definition of Done — communication

- [ ] Version cible et statut (existant, prévu, expérimental, activé) explicites.
- [ ] Source de vérité et déclencheur vérifiés.
- [ ] Aucune donnée ou notification inventée.
- [ ] Droits invité/membre et permissions respectés.
- [ ] Textes naturels, localisés et exacts.
- [ ] Priorité, fréquence et anti-répétition définies.
- [ ] États réseau/local/serveur distingués.
- [ ] Accessibilité et rendu mobile vérifiés.
- [ ] Coûts et performances dans les limites de la version.
- [ ] Tests verts sur le commit courant.
- [ ] Limites et étapes futures documentées.
- [ ] Assistant désactivable sans casser l'application.

## 23. Décisions futures à prendre explicitement

Ne pas trancher implicitement : remplacer ou non les inscrits cumulés par les utilisateurs actifs ; fréquence chiffrée par session/jour ; préférences de silence et désactivation ; événements réellement exposables au centre ; push et livraison arrière-plan ; rétention par type ; langues supplémentaires ; cas d'usage V2 pour compréhension naturelle/voix ; fournisseur, quotas et budget IA ; périmètre mémoire/orchestration V3.

Toute décision doit être ajoutée à la spécification, au catalogue et aux tests. En attendant, appliquer la règle protectrice : moins de données, moins d'interventions, aucune promesse non vérifiée.

---

## Références

- [Spécification produit V1 à V3](./communication-system-v1-v3.md)
- [Catalogue V1](./communication-catalog-v1.md)
- [Langage humain](./communication-language.md)
- [Centre de communication](./communication-center-v1.md)
- [Architecture du système](../02-architecture/communication-system-architecture.md)
- [Architecture IA et intégrations](../02-architecture/ai-architecture-integrations.md)

## 24. Ligne directrice obligatoire : rapide, pertinente et fluide

La rapidité, l'intelligence contextuelle et la fluidité sont trois critères obligatoires d'acceptation pour **chaque évolution** du système de communication Vitalis, quelle que soit la version (V1, V2 ou V3) ou le point de contact concerné.

### 1. Rapide
- Répondre sans délai perceptible aux gestes de l'utilisateur lorsque l'application connaît déjà le résultat local.
- Ne pas faire attendre l'affichage ou la navigation pour préparer un message non essentiel.
- Réutiliser le contexte déjà chargé et privilégier les règles locales ; aucun appel réseau dédié à une salutation ou à une suggestion de routine.
- Tester mobile/PWA et réseau faible. Définir des objectifs de latence mesurables avant chaque évolution et joindre les résultats des tests.

### 2. Intelligent et contextuel
- S'adresser à la bonne personne (invité ou membre), au bon endroit, au bon moment et à propos d'une action ou d'une fonctionnalité réellement disponible.
- Utiliser uniquement des informations dont la source est connue, actuelle et autorisée.
- Adapter l'explication au contexte sans inférer de données sensibles ni attribuer un niveau de confiance non établi.
- Si une information manque ou si une fonctionnalité n'est pas raccordée, rester neutre ou ne rien afficher.
- Ne jamais fabriquer une notification, un compteur, un résultat, une progression, une disponibilité, une relation ou une promesse.

### 3. Fluide
- Garder des messages courts, naturels, cohérents avec le ton humain de Vitalis et adaptés à l'étape du parcours.
- Éviter répétitions, sollicitations simultanées, fenêtres intrusives et changements de contexte inutiles.
- Ne pas interrompre une action ni masquer les commandes essentielles.
- Préserver la continuité entre accueil, onboarding, Flash, Scan, En direct, Radar et centre de communication.
- Réutiliser les catalogues, règles, composants et canaux existants ; aucun système parallèle ne doit être créé pour contourner une limite du système commun.

### Validation avant livraison
Pour chaque évolution, la revue doit apporter des preuves distinctes :
- **Rapidité :** mesures de latence/réactivité et tests sur les parcours et appareils ciblés, avec au moins un scénario réseau dégradé pertinent.
- **Pertinence contextuelle :** tests invité/membre, permissions, états métier réels, contexte absent ou périmé et fonctionnalité indisponible.
- **Fluidité :** vérification du parcours de bout en bout, de l'espacement et de la déduplication, des interruptions, de l'accessibilité et de la cohérence avec les composants existants.

La documentation de livraison doit préciser les scénarios exécutés, les résultats, les limites et le statut de chaque axe. « Non testé » ou « non mesuré » signifie **non vérifié**, et non « validé ». L'échec d'un seul axe bloque l'acceptation de l'évolution jusqu'à correction ou désactivation explicite.

Cette règle est une exigence de gouvernance à appliquer à la suite du chantier. Elle ne certifie pas rétroactivement le code existant : chaque capacité actuelle devra être évaluée à partir de preuves réelles, sans confondre règle documentée et fonctionnalité implémentée.


## Mise en œuvre du Context Resolver — statut contrôlé

La première tranche du Context Resolver est implémentée dans `src/lib/communication/context.ts` et intégrée au runtime partagé. Elle normalise uniquement les faits déjà fournis par l'application : état Auth (chargement/invité/membre), route sans query/fragment, langue active, préférence assistant hydratée et états séparés des permissions découverte/présence.

Le contexte reste explicitement incomplet lorsque l'une des sources obligatoires manque. « Inconnu » n'est jamais équivalent à « autorisé » et « Auth en chargement » n'est jamais équivalent à « invité ». Le runtime expose `updateContext()`, `getContext()` et efface le contexte lors de `resetSession()`.

**Ce qui n'est pas encore fait :** alimentation automatique par le fournisseur applicatif, raccordement des adaptateurs des moteurs, sélection de suggestions et alimentation du centre global. La présence du resolver ne signifie donc pas que les suggestions contextuelles ou les notifications globales sont activées. Les prochains raccordements devront apporter leurs propres preuves de source, de permission, de destination, de fréquence et de tests de bout en bout.


### Mise à jour — contexte applicatif alimenté

Le provider partagé reçoit maintenant les sources disponibles depuis `AppShell` : état Auth, route courante, langue i18n et préférence Assistant après hydratation. Le runtime est réinitialisé quand la session d'identité change ; la clé de comparaison n'est pas conservée dans le contexte de communication.

Les permissions de découverte et de présence restent à `unknown` tant que leurs sources autorisées ne sont pas raccordées. Le Context Resolver est donc utilisable pour distinguer les contextes déjà connus, mais ne doit pas encore autoriser des communications Réel qui exigent une permission confirmée. Le raccordement des sources de permissions et des événements métier reste une étape distincte.


Le runtime applique maintenant également une garde explicite aux demandes marquées `requiresContext` : elles restent supprimées tant que le contexte commun n'est pas prêt. Les erreurs et confirmations inline indépendantes du contexte ne sont pas bloquées par cette garde. Un contexte prêt ne remplace jamais les autorisations ni la validation métier.


### Décision de gouvernance — opt-in Assistant indépendant

Le contexte commun peut être prêt même si les préférences de l'assistant sont encore en cours d'hydratation. Cette préférence est un état séparé : les demandes Assistant doivent déclarer leur dépendance à l'opt-in et restent bloquées tant que l'activation explicite n'est pas confirmée. Une préférence Assistant désactivée ne doit pas empêcher les confirmations ou notifications métier non liées à l'assistant.

### Résultat de l'audit des événements moteurs

Flash, Scan et Radar ne produisent actuellement que des confirmations/erreurs liées à une action locale de la personne pour les parcours examinés. Elles restent affichées dans leur moteur et ne sont pas copiées dans le centre global. Radar ne dispose pas de matching/alertes automatiques actifs.

Réel dispose de bips et relations réellement issus de services/RPC/Realtime pour les membres et de services temporaires pour les invités. Les vues restent dans le moteur Réel tant qu'une projection partagée ne peut pas être extraite sans second abonnement, polling ou requête, et sans exposer des identifiants invités. La prochaine tranche doit d'abord concevoir ce read model partagé et son cycle de vie, puis seulement brancher le centre global.


Les consommateurs du runtime sont réactifs aux changements du contexte : les messages préparés pendant une hydratation incomplète peuvent être réévalués lorsque les sources sont disponibles. Les notices Assistant déclarent explicitement leur dépendance à l'opt-in ; elles ne sont pas affichées avant confirmation de l'activation.
