# Vitalis Scan — référence produit, UX et technique V1

**Statut :** référence de conception V1 consolidée à partir des décisions produit validées ; les paramètres encore ouverts sont identifiés séparément. Toute implémentation reste soumise à une autorisation distincte.  
**Périmètre :** rôle métier, parcours, UI/UX, sources, règles de recherche, confidentialité, architecture, coûts et validation.  
**Sources consolidées :** document historique `12-VITALA-UJ-09-SCAN-ENGINE.md`, fiche actuelle `engine-charter.md`, état technique `SCAN_MODULE.md`, code Scan et règles transversales Vitalis.  
**Règle de lecture :** une intention historique n'est pas une fonctionnalité livrée. Les statuts « présent », « partiel », « cible » et « à décider » sont volontairement séparés.

---

## 1. Résumé exécutif

Scan est le **scanner intelligent d'environnement** de Vitalis. Il explore ponctuellement les lieux, activités, services, ressources et informations utiles dans un périmètre limité et explicite. Il comprend une demande formulée librement, sélectionne les découvertes pertinentes et organise les résultats pour que l'utilisateur puisse explorer sans être submergé.

La vision historique apporte l'ambition : comprendre une intention, explorer plusieurs familles de possibilités, comparer les résultats, expliquer les correspondances et proposer une suite utile lorsqu'aucun résultat exact n'existe.

La conception actuelle apporte les garde-fous nécessaires : recherche déclenchée par l'utilisateur, paramètres réellement appliqués, sources identifiées, données minimales, règles de visibilité propres à chaque moteur, coûts maîtrisés et séparation stricte entre capacité cible et capacité disponible.

**Promesse produit proposée :** « Dites ce que vous cherchez. Scan explore les sources disponibles maintenant, vous montre ce qui correspond et vous explique pourquoi. »

Scan ne doit jamais prétendre avoir exploré une source qui n'est pas raccordée. Il ne surveille pas continuellement une demande et ne crée pas automatiquement une mission, une publication ou une mise en relation.

## 2. Positionnement et frontières

| Moteur | Question à laquelle il répond | Comportement |
|---|---|---|
| Flash | « Qu'est-ce que je souhaite signaler ou proposer ? » | Publier une information courte, locale et temporaire. |
| Scan | « Qu'est-ce qui peut répondre à mon besoin maintenant ? » | Exploration ponctuelle déclenchée par l'utilisateur ; signalement temporaire facultatif après le Scan, sous autorisation distincte. |
| En direct | « Qui est présent ici, maintenant, et souhaite être visible ? » | Découverte de présence avec consentements distincts. |
| Radar | « Peux-tu suivre cette recherche dans le temps ? » | Mission persistante, paramètres validés et suivi planifié lorsqu'il est réellement disponible. |
| Veille | « Que se passe-t-il à l'échelle de mes activités ou d'un ensemble de signaux ? » | Supervision et analyses agrégées autorisées. |

Scan vise à explorer les lieux, activités, services, ressources et informations publiques utiles dans l'environnement. Les données peuvent provenir de sources métier, de fiches de lieux ou de publications explicitement exposées par leurs propriétaires, selon les connecteurs réellement disponibles. Une proximité géographique ne signifie pas qu'une personne est disponible, visible ou joignable : Scan ne transforme pas la présence En direct en résultat de recherche. La taxonomie cible ne prouve pas que toutes ses catégories disposent déjà d'une source raccordée.

Un résultat Scan ne vaut ni validation de confiance, ni réservation, ni engagement, ni mise en relation.

## 3. Principes non négociables

1. **L'utilisateur garde l'initiative.** Aucun scan silencieux, aucune surveillance continue et aucune publication automatique.
2. **La recherche est honnête.** Une source non connectée est indiquée comme indisponible ou hors périmètre, jamais comme consultée.
3. **Les paramètres sont effectifs.** Rayon, zone, période, catégories et filtres affichés doivent être transmis et appliqués côté service.
4. **Les résultats sont explicables.** Chaque résultat indique sa source, sa fraîcheur connue et les critères de correspondance disponibles.
5. **La confidentialité est indépendante par moteur.** Scan n'hérite pas des autorisations Flash, En direct ou du profil complet.
6. **La minimisation est la règle.** Pas de coordonnées précises dans les réponses publiques, pas de profil complet par défaut, pas de collecte non nécessaire.
7. **V1 reste déterministe et économique.** La recherche libre en langage naturel est prévue en V1, avec une interprétation structurée et explicable ; pas de dépendance obligatoire à un LLM, à une recherche vectorielle coûteuse ou à un fournisseur externe pour le parcours central.
8. **L'expérience reste humaine.** Textes courts, chaleureux, directs ; éviter le jargon technique et les longs formulaires.
9. **Aucune fausse capacité.** Un état d'interface, un abonnement Realtime ou une entrée en base ne prouve pas à lui seul que le parcours complet fonctionne.
10. **Présentation hybride des résultats.** Exact d'abord, proches dans une section distincte et alternatives moins proches dans une section secondaire. L'absence d'exact est signalée. Aucun critère strict, rayon ou période n'est assoupli sans confirmation.

## 4. Modèle fonctionnel cible

### 4.1 Une recherche ponctuelle

Un Scan suit le cycle :

1. **Préparer** : l'utilisateur saisit ou formule son besoin et vérifie les critères.
2. **Autoriser** : le navigateur demande la position seulement si la recherche « autour de moi » est choisie.
3. **Exécuter** : le serveur interroge uniquement les sources activées et autorisées.
4. **Qualifier** : les résultats sont validés, dédoublonnés et classés.
5. **Présenter** : les cartes indiquent les informations disponibles et les raisons du classement.
6. **Décider** : l'utilisateur ouvre un résultat, ajuste la recherche, recommence ou transmet volontairement sa recherche à Radar.
7. **Terminer** : l'exploration ponctuelle est terminée. Aucun suivi GPS ni nouvelle recherche périodique ne continue automatiquement.
8. **Option facultative après le Scan** : l'utilisateur peut autoriser séparément un signalement temporaire de nouvelles informations correspondant à sa dernière recherche et à son dernier périmètre. Cette autorisation a une durée choisie et plafonnée, expire automatiquement, peut être révoquée et n'actualise jamais la position. Elle est distincte d'une mission Radar et ne doit pas être confondue avec une surveillance géographique continue.

Le mécanisme de signalement temporaire après Scan n'est activé que si un service réel, ses quotas, ses événements, sa livraison de notifications et ses contrôles de confidentialité sont disponibles et vérifiés. Il ne doit pas être simulé par un rafraîchissement continu de la position ou de la recherche.

### 4.2 Intention utilisateur

La recherche libre en langage naturel est le mode de recherche validé en V1 : l'utilisateur peut décrire son besoin avec ses propres mots, sans devoir commencer par une catégorie ou un filtre. Exemples :
- « Je cherche un photographe disponible aujourd'hui. »
- « Une salle pour vingt personnes près de moi. »
- « J'ai besoin d'un coup de main pour déménager ce soir. »

Le moteur peut en extraire des critères structurés :
- intention / type de besoin ;
- catégorie ;
- mots importants ;
- point de référence choisi : position GPS actuelle autorisée, zone approximative prise en charge ou lieu public sélectionné manuellement ;
- période ou échéance ;
- caractéristiques indispensables ;
- préférences facultatives.

**Règle V1 validée :** comprendre la demande, proposer quelques interprétations lorsque plusieurs sens sont possibles et permettre une exploration générale sans bloquer l'utilisateur. Pour une demande trop large, présenter d'abord une sélection pertinente, expliquer brièvement la limite et proposer des moyens simples de préciser. Une question courte est réservée aux informations réellement indispensables.

La compréhension conversationnelle avancée, la dictée vocale intelligente et l'assistant Vita peuvent évoluer en V2/V3. La recherche de base doit rester utilisable sans dépendance obligatoire à un fournisseur d'IA ou à un service payant.

### 4.3 Critères et modes de sélection

Les critères doivent distinguer :
- **Filtres stricts** : indispensables ; un résultat qui échoue est exclu.
- **Préférences** : utiles mais non obligatoires ; elles influencent le classement.
- **Contexte** : rayon, lieu, période et fraîcheur ; ils définissent le périmètre de recherche.

Le mode « priorité » ne doit pas masquer silencieusement des résultats qui satisfont les filtres stricts. Si l'utilisateur choisit un mode strict, son effet doit être explicite.

### 4.4 Fenêtre temporelle

La référence historique propose « maintenant », « aujourd'hui », « demain » et une fenêtre allant jusqu'à 48 heures, puis Radar au-delà.

Cette proposition est conservée comme **hypothèse produit à valider**, pas comme règle technique déjà appliquée. Chaque source doit préciser sa propre sémantique temporelle : date de publication, début de disponibilité, date d'expiration et fuseau horaire. Les résultats expirés ou dont la validité ne peut être établie sont exclus ou clairement signalés.

## 5. Sources de données et intégration progressive

### 5.1 Principe d'adaptateurs de sources

Chaque source est intégrée derrière un contrat explicite et indépendant. Le contrat doit documenter :
- propriétaire et responsabilité des données ;
- types de ressources retournées ;
- filtres réellement pris en charge ;
- zone et précision géographique ;
- période et fraîcheur ;
- champs publics autorisés ;
- règles RLS / autorisations ;
- pagination et plafond ;
- délais, erreurs et disponibilité ;
- coût par recherche et limites d'utilisation ;
- tests contractuels et preuves de fonctionnement.

Le moteur agrège des résultats normalisés, mais chaque ressource conserve son domaine propriétaire. Scan ne copie pas les bases métiers dans une table centrale de résultats.

### 5.2 Matrice des sources

| Famille historique | Rôle potentiel | Statut documentaire / V1 |
|---|---|---|
| Flash actifs | Besoins, offres, informations locales temporaires | Première source identifiée et RPC de proximité présent ; périmètre réellement retourné à vérifier en test. |
| Services / disponibilités | Prestations et créneaux disponibles | Cible ; aucun connecteur générique ne doit être supposé. |
| Produits / ressources | Biens ou ressources proposés | Cible ; nécessite modèle, disponibilité, règles de publication et source propriétaire. |
| Événements | Événements actifs et informations pratiques | Cible ; source et fraîcheur à définir. |
| Opportunités / partenariats | Propositions structurées | Cible ; contrat métier à définir. |
| Alertes / informations utiles | Informations temporaires validées | Cible ; provenance et modération indispensables. |
| Présence En direct | Personnes à proximité | Exclue de la découverte Scan par défaut ; relève du consentement En direct. |
| Missions privées Radar | Recherches individuelles en cours | Exclues ; aucune fuite entre moteurs. |

L'énumération historique constitue une carte des possibilités futures, pas une promesse que toutes ces sources existent aujourd'hui.

### 5.3 Contrat normalisé d'un résultat

Chaque adaptateur devrait fournir, lorsque ces données existent et sont autorisées :
- identifiant public opaque et type de ressource ;
- source d'origine ;
- titre et résumé public ;
- catégorie ;
- point ou zone de référence suffisamment grossier pour l'affichage ;
- distance calculée côté service, sans coordonnées exactes ;
- dates de création, début, expiration ou dernière vérification ;
- critères satisfaits et manquants ;
- projection publique de l'auteur, uniquement avec consentement ;
- actions autorisées.

Les champs inconnus restent inconnus : ne pas les fabriquer, les déduire sans preuve ou afficher un statut « vérifié » par défaut.

## 6. Géographie, position et permissions

### 6.1 Point de recherche de Scan

- **Point de référence explicite** : chaque exploration utilise l'un des modes autorisés et clairement affichés : position GPS actuelle avec permission, zone approximative si elle est réellement prise en charge, ou lieu public sélectionné manuellement.
- **Après un déplacement ou un changement de lieu** : l'utilisateur peut lancer une nouvelle exploration autour de sa nouvelle position ou du nouveau lieu public choisi. Chaque exploration conserve son propre point de référence et ses résultats séparés.
- **Recherche ponctuelle** : un scan ne suit pas l'utilisateur en continu et ne surveille pas automatiquement un lieu après sa fin.
- **Précision transparente** : le mode choisi et son niveau de précision sont indiqués. Une zone approximative n'est jamais présentée comme un point GPS précis.
- **Frontière avec Radar** : Scan permet des explorations ponctuelles de plusieurs lieux au cours d'une session ; Radar reste le moteur destiné à surveiller durablement une ou plusieurs zones indépendantes de la position actuelle.

Le refus GPS ne doit pas être contourné. Si l'utilisateur choisit « autour de moi » et qu'aucun mode approximatif utilisable n'est disponible, Scan explique que cette recherche nécessite l'autorisation de position ; la sélection manuelle d'un lieu public reste une autre voie uniquement si elle est effectivement disponible.

### 6.2 Traitement des coordonnées

- La position du demandeur est transmise temporairement au service nécessaire à la recherche.
- Elle n'est pas ajoutée à l'historique Scan V1.
- Les coordonnées exactes d'une ressource ne sont jamais exposées dans une projection publique.
- La distance est calculée côté service sur la valeur réelle ; l'arrondi ne sert qu'à l'affichage.
- Le périmètre de publication choisi par l'auteur est appliqué en plus du rayon demandé par le chercheur.
- Les validations latitude / longitude, précision et rayon sont réalisées côté serveur.
- La politique de journalisation ne doit pas enregistrer les coordonnées brutes.

### 6.3 Rayon

Le runtime observé accepte actuellement une plage technique de 1 à 50 km et le RPC applique le filtre de distance. Cette plage n'est pas une décision d'interface.

**Distinction produit à préserver :** le rayon de Scan doit rester un rayon de proximité plus limité que les possibilités géographiques de Radar. Toutefois, le plafond technique actuellement accepté par l'API Scan (50 km) ne garantit pas à lui seul cette distinction. Les valeurs réellement proposées dans l'interface et la limite effective côté serveur devront être alignées et vérifiées avant de considérer cette règle comme appliquée. La référence d'implémentation de Scan indique des choix d'interface de 1, 5, 10 et 20 km ; ils ne doivent pas être confondus avec le plafond API.

Les rayons proposés en V1 doivent être confirmés après validation produit et tests de pertinence, de précision GPS, de densité des résultats et de coût. Ne pas réutiliser les valeurs d'En direct ou Radar par simple cohérence visuelle.

## 7. Classement, confiance et explications

### 7.1 Approche V1 recommandée

V1 doit utiliser un classement déterministe, testable et compréhensible. Ordre de traitement proposé :

1. éliminer les ressources expirées, privées, hors périmètre ou incompatibles avec les filtres stricts ;
2. vérifier que la source est autorisée et examiner sa fraîcheur et sa fiabilité connues ;
3. évaluer la pertinence par rapport à la demande explicite et la satisfaction des préférences ;
4. classer selon l'ordre produit validé : **pertinence par rapport à la demande > proximité > actualité/fraîcheur > fiabilité** ;
5. appliquer un départage stable et documenté lorsque les critères précédents sont équivalents.

La proximité ne doit jamais promouvoir à elle seule un résultat qui répond moins bien à la demande. Les critères stricts et l'exclusion des résultats privés ou expirés restent éliminatoires avant ce classement. Les préférences n'annulent jamais une exigence stricte.

Une formule pondérée pourra être introduite seulement lorsque chaque facteur est défini, normalisé, mesurable et testé. Les pondérations ne doivent pas être choisies arbitrairement ni masquer les critères éliminatoires.

### 7.2 Confiance

Ne pas confondre :
- identité confirmée ;
- ressource vérifiée ;
- fiabilité historique ;
- complétude de l'annonce ;
- compatibilité avec la demande.

Un niveau de confiance ne doit être affiché que s'il provient d'une règle ou d'une preuve définie par le système Trust. La proximité ou la présence d'un compte ne constitue pas une preuve de confiance.

### 7.3 Explication

Chaque résultat doit pouvoir répondre simplement à « Pourquoi je vois ceci ? », avec des faits vérifiables :
- correspond à la catégorie demandée ;
- se trouve dans le rayon appliqué ;
- est annoncé disponible pendant la période choisie ;
- correspond à certaines caractéristiques ;
- a été publié ou actualisé à telle date.

Ne jamais générer une explication qui affirme un critère absent des données source.

## 8. Aucun résultat exact et alternatives

Un résultat vide doit être accompagné d'une explication honnête : aucun résultat correspondant aux critères dans les sources consultées et dans le périmètre appliqué.

Les statuts « correspondance exacte », « correspondance proche » et « alternative » restent distincts. La présentation hybride est validée : les résultats proches sont présentés dans une section distincte, les alternatives moins proches dans une section secondaire, et l'absence d'exact est signalée. Ces pistes proviennent uniquement des résultats déjà obtenus ; aucun critère strict ou périmètre n'est assoupli sans confirmation.

Toute modification du rayon, de la période ou d'un filtre strict doit être présentée à l'utilisateur et confirmée avant une nouvelle recherche. Un déplacement conduit à une nouvelle exploration autour du nouveau point de référence ; les résultats des deux zones restent séparés.

Le passage vers Radar est une action distincte, proposée seulement si l'utilisateur souhaite une recherche suivie dans le temps sur une ou plusieurs zones indépendantes. La préparation transmet uniquement les critères confirmés, affiche un récapitulatif et exige une validation explicite. Aucun Radar n'est créé en arrière-plan.

Le signalement temporaire facultatif après Scan, décrit à la section 4.1 et dans les décisions produit, ne constitue pas un transfert vers Radar : il porte sur la dernière recherche et son périmètre, expire automatiquement et n'actualise pas la position.

## 9. UI — structure cible

L'écran doit rester léger, lisible et centré sur une seule action.

### 9.1 Écran de préparation

- En-tête propre au moteur Scan : identité du moteur et commandes propres à Scan.
- Phrase courte qui explique ce que Scan peut chercher.
- Champ de recherche libre en langage naturel, utilisable sans sélection préalable de catégorie.
- Suggestions d'interprétation non bloquantes si la demande est ambiguë ; possibilité de lancer une exploration générale.
- Catégories prioritaires adaptées à l'environnement et à la demande, avec accès à toutes les catégories disponibles.
- Résumé compact des critères détectés / choisis.
- Réglages essentiels accessibles : rayon de proximité, zone de référence, catégories et période ; le point de référence est explicite pour chaque exploration.
- Si un mode de zone approximative est réellement disponible, l'interface doit l'identifier séparément et afficher son niveau de précision.
- Action centrale claire : « Lancer le Scan ».
- Mention de confidentialité liée à la position, sans promesse absolue.

Les paramètres avancés peuvent être repliés. Ne pas transformer l'écran en formulaire long. Les préférences par défaut sont distinctes des paramètres de la recherche en cours.

### 9.2 Écran de progression

La progression ne doit montrer que des étapes réelles et exécutées. Exemple de libellés possibles :
- « Vérification de votre zone… »
- « Recherche dans les sources disponibles… »
- « Comparaison avec votre demande… »
- « Préparation des résultats… »

Ne pas afficher une étape « vérification de confiance » si aucune vérification n'a été appelée. Ne pas inventer de pourcentage si le service ne fournit pas une progression mesurable. Prévoir annulation et délai maximum.

### 9.3 Résultats

Les résultats suivent une présentation mixte : une sélection prioritaire toutes catégories confondues, puis des sections par catégorie et un accès progressif aux autres résultats. L'ouverture d'une catégorie présente une sélection pertinente, des filtres généraux et spécifiques à cette catégorie, puis un chargement progressif.

Chaque carte devrait présenter selon disponibilité :
- titre et résumé ;
- catégorie et source ;
- distance arrondie et zone approximative ;
- date / fraîcheur et disponibilité ;
- raisons principales de correspondance ;
- projection publique facultative de l'auteur, seulement si autorisée ;
- action utile et explicite.

Les cartes doivent distinguer clairement les données confirmées, déclarées par l'auteur et non renseignées.

### 9.4 États obligatoires

- première visite / aucune recherche ;
- demande de position avant lancement ;
- permission refusée ;
- position indisponible ou trop imprécise ;
- recherche en cours ;
- résultats disponibles ;
- aucun résultat ;
- source indisponible ;
- recherche partiellement réussie ;
- perte réseau / retour réseau ;
- limitation de quota ;
- erreur récupérable ;
- résultat expiré ou devenu indisponible ;
- confirmation de passage vers Radar.

Un échec d'une source ne doit pas être présenté comme une recherche complète. Si certaines sources ont répondu et d'autres non, afficher un état partiel avec les sources effectivement consultées.

## 10. UX et langage

- Utiliser un langage humain, chaleureux et direct.
- Expliquer pourquoi une permission est nécessaire juste avant de la demander.
- Ne pas culpabiliser en cas de refus.
- Préserver les critères lors d'une correction ou d'un retour en arrière.
- Demander une clarification à la fois.
- Éviter les animations longues ; respecter la réduction des animations.
- Ne pas surcharger les résultats de badges ou de métadonnées.
- Ne pas utiliser « intelligence artificielle » comme argument d'interface.
- Ne jamais afficher « aucun résultat » sans préciser le périmètre et les sources consultées.

## 11. Historique et données locales

**État runtime observé lors de l'audit :** l'écran Scan conserve localement jusqu'à dix entrées sommaires (date et nombre de résultats), sans texte recherché, catégorie, rayon, position ni détails. Cet historique n'est pas synchronisé. Il s'agit de l'implémentation observée, pas de la cible produit validée.

**Cible produit V1 validée :**
- membre connecté : retrouver ses recherches, consulter les critères et le rayon, relancer une recherche et supprimer chaque entrée individuellement ;
- invité : historique temporaire limité à la session, sans conservation après celle-ci ;
- ne pas conserver de coordonnées précises inutiles.

La durée de conservation, le nombre maximal d'entrées et les champs exacts à conserver restent à définir. L'implémentation actuelle n'est donc pas encore alignée sur l'historique cible. Toute évolution doit respecter minimisation, consentement, sécurité, suppression et coûts V1.

## 12. Architecture technique recommandée

### 12.1 Séparation des responsabilités

- **UI** : saisie, choix, états et présentation ; aucune règle d'accès sensible.
- **Orchestration Scan** : validation du parcours, exécution bornée, agrégation et statut partiel.
- **Parseur / qualification** : conversion d'une demande en critères explicites, sans autorité sur les permissions.
- **Adaptateurs de sources** : appels propres à chaque domaine et contrats documentés.
- **Normalisation** : projection minimale commune sans déplacer la propriété des données.
- **Classement** : règles déterministes versionnées et testées.
- **Explication** : justification à partir des champs réellement retournés.
- **Sécurité** : validations serveur, autorisations, RLS et projection publique.
- **Observabilité** : latence, taux d'erreur, sources sollicitées et coût, sans coordonnées ni texte sensible en clair.

### 12.2 Contrat d'exécution

Une requête devrait transporter uniquement :
- critères validés ;
- position actuelle autorisée au lancement du scan, ou zone approximative explicitement prise en charge et identifiée comme telle ;
- rayon validé ;
- période ;
- filtres stricts et préférences ;
- limite de résultats bornée ;
- identifiant de corrélation non sensible.

Le serveur revalide toutes les valeurs. Il ne fait pas confiance aux filtres calculés uniquement dans le navigateur. Chaque adaptateur renvoie ses résultats et son état (succès, vide, indisponible, timeout, partiel). L'orchestrateur ne transforme pas une erreur de source en résultat vide trompeur.

### 12.3 Realtime et cache

La recherche ponctuelle peut s'appuyer sur une requête serveur bornée. Un abonnement Realtime n'est justifié que si l'expérience l'exige et si son périmètre, sa durée et sa politique de nettoyage sont prouvés.

Les résultats contenant des critères personnels ou une position ne doivent pas être mis dans un cache partagé. La politique de cache doit être définie par endpoint ; l'exclusion actuelle du cache PWA est à préserver tant qu'une analyse de sécurité n'autorise pas autre chose. Le cache local de consultation hors connexion, les explorations multi-zones et l'historique membre/invité sont des capacités cibles distinctes ; leurs durées, quotas et champs restent ceux spécifiés dans les décisions produit. Le signalement temporaire après Scan ne doit pas utiliser le cache comme substitut à un mécanisme de notification vérifié.

## 13. Performance et maîtrise des coûts

V1 doit privilégier :
- une seule requête bornée par source activée ;
- pagination et plafond stricts ;
- index géospatiaux adaptés si le volume le justifie ;
- sélection des seuls champs utiles ;
- délais maximum et annulation ;
- limitation de fréquence et quotas transparents ;
- absence d'appels IA systématiques ;
- pas de recherche continue après fermeture ou sortie de Scan.

Les objectifs de latence doivent être mesurés par environnement et par source. Le seuil produit ne sera fixé qu'après mesure sur réseau mobile réel. Les coûts doivent être suivis par scan, source et utilisateur/session, sans stocker de données personnelles inutiles.

## 14. Sécurité et confidentialité

- Toutes les entrées sont validées côté serveur.
- Les fonctions RPC publiques retournent une projection étroite et explicite.
- Les permissions SQL sont minimales ; RLS et privilèges RPC sont testés avec rôles anon et authenticated.
- Le rayon du chercheur et la portée de publication de l'auteur sont deux limites distinctes ; les deux s'appliquent.
- Les coordonnées exactes et identifiants internes ne sont pas exposés.
- La projection d'auteur est optionnelle, consentie et séparée du contenu public.
- Un visiteur ne reçoit pas de droits réservés à un membre.
- Les logs et traces excluent coordonnées, texte libre sensible, secrets et identifiants privés.
- La suppression et l'expiration des ressources sont respectées par les résultats et les caches.

## 15. V1 / V2 / V3 — proposition de découpage

### V1 — fiable, simple et presque sans coût récurrent

- recherche ponctuelle déclenchée par l'utilisateur ;
- source Flash publique réellement raccordée ;
- recherche libre en langage naturel avec extraction déterministe de critères simples et confirmation concise des éléments ambigus ;
- rayon et période limités et explicitement appliqués ;
- classement déterministe ;
- résultats expliqués à partir de données vérifiées ;
- états vides, erreurs, hors ligne et permission ;
- historique membre/invité conforme aux décisions produit (l'historique local minimal actuel n'est qu'un état technique intermédiaire à faire évoluer) ;
- recherche libre en langage naturel avec interprétation déterministe de critères simples ;
- sélection et consultation de plusieurs zones par session, résultats strictement séparés ;
- signalement temporaire facultatif après Scan, uniquement lorsque le mécanisme et ses quotas sont réellement raccordés ;
- transmission manuelle et confirmée vers Radar, si le contrat Radar est prêt ;
- pas de dépendance IA, de recherche continue ni de médias obligatoires.

### V2 — compréhension et sources étendues

- dialogue adaptatif avancé, compréhension conversationnelle plus riche et dictée vocale facultative ;
- dictée vocale facultative ;
- intégration progressive de nouvelles sources métier ;
- comparaison avancée et alternatives contextualisées ;
- préférences utilisateur mieux exploitées ;
- transfert Scan → Radar plus complet ;
- notifications uniquement après consentement et avec quotas définis.

### V3 — assistant avancé

- dialogue adaptatif avec Vita ;
- recherche multimodale si sa valeur et son coût sont justifiés ;
- stratégies de recherche multi-sources plus avancées ;
- personnalisation du classement avec explications et contrôle utilisateur ;
- orchestration plus riche entre moteurs, sans fusionner leurs responsabilités.

Ce découpage est une proposition de planification ; les éléments V2/V3 ne sont pas des engagements de livraison.

## 16. État du dépôt observé — à distinguer de la cible

Cette section est un instantané du code/documentation consultés pendant la consolidation. Elle doit être réactualisée à chaque revue de branche.

| Élément | État observé | Réserve / preuve nécessaire |
|---|---|---|
| Route et écran Scan | Présents | Capture navigateur et parcours mobile à effectuer. |
| Recherche publique de Flash | Raccordée à `scan_public_flashes` | Essais anon/auth sur backend de test. |
| Position GPS | Demandée au lancement | Tester refus, indisponibilité, précision et permissions navigateur. |
| Rayons UI | 1, 5, 10, 20 km | Ce sont les choix actuels de l'écran, non encore une décision produit définitive. |
| Plage serveur | 1 à 50 km | Capacité technique, non choix UX. |
| Catégorie / texte | Contrat serveur présent | Pas encore exposés dans l'interface actuelle examinée. |
| Classement | Proximité, fraîcheur et temps restant | Mesurer et tester la pertinence ; pas de confiance complète. |
| Historique | Dix entrées locales date + nombre | Pas de synchronisation ni détail des recherches. |
| Realtime | Abonnement au changement Flash présent | Prouver RLS, événements, nettoyage et absence de rafales. |
| Aperçu auteur | Composant et champ facultatif côté client | Le RPC observé ne fournit pas encore la projection ; ne pas inventer d'identité. |
| Recherche par zone sans GPS | Mentionnée dans une documentation technique | Le parcours UI examiné s'arrête sur erreur GPS ; fonctionnalité à réconcilier. |
| Sources multiples | Non démontrées | Aucun résultat ne doit prétendre venir d'une source future. |
| Intention naturelle / Vita | Non démontrées dans Scan | Cible historique, pas capacité livrée. |
| Suggestions intelligentes | Non démontrées | À concevoir et tester. |
| Transition Radar | Non démontrée | Exige contrat, préremplissage et validation explicite. |

Les différences entre documents et code sont des points de réconciliation, pas des preuves automatiques de bug. Il faut reproduire chaque parcours avant de décider d'une correction.

## 17. Méthode de validation crédible

Chaque capacité suit le même cycle de preuve :

1. **Spécification** : règle métier, cas limites, données et responsable.
2. **Contrat** : API, schéma, source, permissions, erreurs et coûts.
3. **Test unitaire** : parseur, filtres, classement, expiration et explications.
4. **Test d'intégration** : RPC, adaptateur, RLS et données représentatives.
5. **Test de sécurité** : anon, membre, propriétaire, non-propriétaire, données privées et coordonnées.
6. **Test navigateur** : rendu réel, interactions, permissions, réseau lent et reprise.
7. **Test terrain** : distances réelles, GPS, densité des résultats et qualité des données.
8. **Mesure** : latence, taille des réponses, fréquence d'appels et coût.
9. **Décision** : accepté, corrigé ou reporté, avec preuve liée au commit et à l'environnement.

Un test automatisé vert ne remplace pas un essai terrain. Une capture d'écran ne prouve pas la sécurité serveur. Un RPC réussi sur données de démonstration ne prouve pas la disponibilité de toutes les sources.

## 18. Critères d'acceptation produit

Le Scan V1 peut être considéré prêt lorsque :
- l'utilisateur comprend ce que Scan cherche et ce qu'il ne cherche pas ;
- les critères visibles sont exactement ceux appliqués côté serveur ;
- seules les sources réellement connectées sont annoncées ;
- le refus GPS n'entraîne aucune recherche géolocalisée non autorisée ;
- les résultats respectent rayon, portée de publication, expiration et visibilité ;
- aucune coordonnée précise ni donnée privée ne fuit ;
- chaque résultat expose sa provenance et une explication factuelle suffisante ;
- l'absence de résultat et les pannes partielles sont compréhensibles ;
- la recherche s'arrête réellement et ne crée aucune surveillance implicite ;
- les quotas, limites, latences et coûts sont mesurés ;
- les parcours sont vérifiés sur téléphone et navigateur pris en charge ;
- l'historique membre/invité respecte les règles de critères consultables, de suppression, de durée et de minimisation définies par le produit ;
- plusieurs zones peuvent être explorées dans une session sans mélange de leurs résultats ;
- tout signalement temporaire après Scan respecte consentement, durée, expiration, révocation, quotas et absence de suivi GPS continu.

## 19. Paramètres et contrats restant à spécifier

Les décisions de principe relatives au rôle de scanner d'environnement, à la recherche libre, à la classification évolutive, à la présentation des résultats, aux filtres contextuels, à l'exploration de plusieurs zones et à la distinction exact/proche/alternative sont validées et consignées dans [les décisions produit V1](./SCAN_PRODUCT_DECISIONS_V1.md). La présentation hybride des résultats lorsqu'aucune correspondance exacte n'existe est validée (section 7 des décisions produit).

Restent à spécifier ou vérifier avant implémentation :
- la taxonomie détaillée, les libellés définitifs et la correspondance entre catégories et sources ;
- les rayons exacts, le rayon par défaut adaptatif et le plafond strict V1 côté serveur ;
- les fenêtres temporelles et de fraîcheur propres à chaque type d'information ;
- les seuils mesurables de pertinence, de confiance et les règles de départage ;
- les limites de résultats par section et la taille des lots de chargement progressif ;
- les contrats, permissions, couverture, latence et coûts de chaque source ;
- les méthodes de localisation, le comportement GPS refusé/imprécis et la précision réellement disponible ;
- les champs publics, les actions autorisées et les règles membre/invité ;
- les durées, quotas et mécanismes du signalement temporaire après Scan ;
- les seuils et règles détaillés de qualification exact/proche/alternative (la présentation hybride est validée) ;
- les quotas de contributions et les contrôles anti-abus ;
- les durées, volumes et champs de l'historique et du cache local ;
- les seuils de notification et les mécanismes de livraison ;
- les conditions et la preuve d'un éventuel rafraîchissement Realtime ;
- les critères mesurables de latence, de coût et de validation terrain.

Ces éléments sont des paramètres ou preuves manquants, pas des décisions de principe à réouvrir. La présence d'une capacité dans la cible documentaire ne prouve pas qu'elle est implémentée.

## 20. Références documentaires

- [Fiche de cadrage Scan](./engine-charter.md) — rôle, frontières et garde-fous.
- [Module Scan](./SCAN_MODULE.md) — état technique résumé.
- [Vision historique Scan](./12-VITALA-UJ-09-SCAN-ENGINE.md) — ambition initiale et parcours cible.
- [Historique Scan V1](../../02-architecture/scan-history-v1.md) — conservation locale minimale.
- [Navigation Vitalis](../../01-product/navigation.md) — place du moteur et navigation.
- [Flash — fiche de cadrage](../flash/engine-charter.md) — publication et visibilité.
- [Radar — fiche de cadrage](../radar/engine-charter.md) — recherche suivie dans le temps.
- [Visibilité et confidentialité propres à chaque moteur](../visibility-and-profile-policy.md) — séparation des permissions.

---

**Règle de maintenance :** mettre à jour l'état du dépôt uniquement à partir d'une inspection du code, des migrations et de tests reproductibles. Conserver le document historique comme archive de vision ; toute décision nouvelle est inscrite ici avec son statut (validée, proposée, à décider ou reportée).

## Règles V1 validées — consolidation du 2026-11-18
La décision produit détaillée est maintenue dans [SCAN_PRODUCT_DECISIONS_V1.md](./SCAN_PRODUCT_DECISIONS_V1.md), section 31. Les choix fermés comprennent : fenêtre temporelle adaptée à la demande ; suivi post-Scan à durée intelligente, 3 suivis simultanés ; notifications par pertinence ; historique membre 3 jours ; cache 24 h / 5 Mo ; critères essentiels jamais assouplis sans accord ; présentation par catégories, sélection adaptative et chargement progressif ; contributions 5/jour et confiance progressive avec seuil de 3 signalements indépendants pour corrections ordinaires ; traitement des contradictions par fiabilité/fraîcheur ; provenance discrète ; expiration adaptée aux types ; GPS facultatif avec choix manuel d'un lieu public ; rayon maximal 2 km, rayon initial adaptatif et explication contextuelle.

Ces règles définissent la cible produit, pas l'état runtime. Les valeurs, seuils, contrats sources, limites server-side et comportements doivent être implémentés puis vérifiés avant de les déclarer disponibles. La section 30 de la décision produit est supersédée pour les paramètres désormais validés ; seuls les détails techniques et preuves restent ouverts.
