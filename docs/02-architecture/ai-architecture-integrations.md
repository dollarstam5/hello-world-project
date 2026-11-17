# Architecture IA et intégrations

**Statut :** consolidation documentaire fondée sur les fichiers du dépôt ; configuration de production et usage effectif de chaque voie à confirmer.  
**Périmètre :** assistant Vita, appels aux modèles, connaissances locales, cache, quotas et frontières de sécurité.  
**Garde-fou :** cette référence décrit l'état observé. Elle ne certifie ni la disponibilité d'un fournisseur en production, ni l'application des migrations SQL.

## 1. Vue d'ensemble

L'expérience actuelle expose un assistant conversationnel Vita dans l'interface. Le chemin relié à l'interface principale observée est :

`AILayer` → `AssistantTab` → `useHybridAssistant` → recherche locale → `streamAssistant` → `POST /api/public/assistant` → passerelle IA Lovable → réponse en flux.

Une voie serveur alternative subsiste dans le dépôt : `askAssistant` → `runPaidAssistant` → quotas/cache Supabase → passerelle Cloudflare AI. L'inventaire des références montre que son hook (`useAssistantChat`) n'est pas utilisé par l'interface active ; il est donc traité comme voie héritée, pas comme second parcours produit. `src/lib/ai/assistant.ts` reste une abstraction mock indépendante, non raccordée au parcours principal. Le parcours canonique de l'interface est le streaming Lovable, désormais soumis à la même politique de validation et aux fonctions de quotas existantes. Voir TECH-006 dans le [registre des problèmes techniques](../06-operations/technical-issues.md#tech-006-voies-dintégration-ia-divergentes).

## 2. Parcours principal observé dans l'interface

### 2.1 Interface et état conversationnel

- `src/components/experience/AILayer.tsx` expose l'entrée globale et ouvre le panneau de Vita.
- `src/domains/assistant/ui/AssistantTab.tsx` présente les messages, l'état de chargement, les erreurs et le formulaire.
- `src/domains/assistant/model/useHybridAssistant.ts` orchestre la conversation, le réseau, la session, la recherche locale et le streaming.
- `packages/core-contracts/src/assistant.ts` définit les types de messages, de requêtes, de réponses, de sources et d'erreurs.

Les conversations locales sont persistées dans le stockage du navigateur avec une clé propre à l'identifiant du compte. Sans compte, la fonction de clé renvoie `null`. Cela isole les clés applicatives, mais ne constitue ni un chiffrement du stockage du navigateur ni une sauvegarde durable.

### 2.2 Réponses locales et hors ligne

`src/domains/assistant/services/localSearch.service.ts` cherche d'abord dans le jeu de connaissances local (`src/data/knowledge.json`) et dans les réponses promues chargées depuis la base locale. Les correspondances exactes et floues peuvent répondre sans appel à un modèle distant.

Si aucune réponse locale ne convient :

- hors ligne, l'interface affiche une erreur d'indisponibilité réseau ;
- sans jeton de session, l'appel distant est refusé côté client et l'endpoint exige également une session ;
- en ligne et authentifié, le client transmet la conversation au service de streaming.

La recherche locale est un mécanisme de réponse déterministe à partir des entrées connues, pas un modèle IA local généraliste.

### 2.3 Endpoint canonique de streaming

`src/domains/assistant/services/assistant-stream.service.ts` appelle `POST /api/public/assistant` avec un jeton Bearer, un identifiant de requête et un historique borné. Le handler de `src/routes/api/public/assistant.ts` et `src/lib/ai/assistant-personality.ts` :

- authentifie l'appelant avec `readSyncSession` ;
- applique `validateConversation` et les limites partagées : 8 messages maximum, 600 caractères par message et 4 000 caractères cumulés ;
- utilise `buildAssistantSystemPrompt` comme source unique de personnalité FR/EN, partagée avec la voie serveur héritée ; le prompt répond d'abord à la demande, adapte la profondeur, pose au plus une question de clarification, n'infère pas l'état émotionnel et ne prétend jamais effectuer une action non exécutée ;
- limite le contexte transmis à la langue et au chemin d'écran autorisé ; le chemin ne permet pas de déduire l'état réel des composants ni des données privées ;
- n'accepte que les routes de contexte explicitement autorisées via `safeAssistantRoute` ;
- refuse les demandes utilisateur contenant des secrets détectés par `containsSensitiveSecret` ;
- réclame un quota avant l'appel fournisseur via `claim_assistant_request` ;
- conserve le streaming Lovable avec `store: false` ;
- suit la fin du flux pour marquer la requête terminée ou échouée via `complete_assistant_request` / `fail_assistant_request` ; le client n'accepte une réponse que si `response.completed` ou `[DONE]` est reçu, et rejette un flux coupé après des fragments partiels ; `useHybridAssistant` retire aussi la réponse partielle de l'écran et du stockage local lorsqu'un flux échoue.

Les demandes sensibles sont rejetées avant l'appel fournisseur. Les erreurs du fournisseur ne journalisent plus le corps de réponse. Le client normalise l'historique pour éviter que des messages restés sans réponse (hors ligne ou erreur) produisent des rôles consécutifs invalides.

Le nom `/api/public/assistant` ne signifie pas que l'usage est anonyme : une session membre est obligatoire. L'absence de configuration fournisseur renvoie `503`. Si la fonction de quota est indisponible, le parcours distant échoue de manière fermée au lieu d'autoriser un appel non plafonné.


## 3. Voie serveur héritée et cache

`src/domains/assistant/api/assistant.functions.ts`, `src/domains/assistant/model/useAssistantChat.ts` et `src/lib/ai/assistant.server.ts` forment une voie alternative fondée sur Cloudflare AI. Le code contient validation, quotas, cache promu et enregistrement de candidats, mais la recherche des références dans le dépôt ne trouve pas de raccordement de ce hook à l'interface active.

Cette voie n'est donc pas un second parcours de conversation à développer en parallèle. Elle doit être retirée ou réaffectée lors d'un lot de nettoyage dédié après validation du parcours canonique. Les tables et fonctions SQL existantes ne sont pas supprimées par ce lot.

La migration canonique versionnée est `supabase/migrations/20261113005000_secure_hybrid_assistant.sql`. L'ancien fichier `src/supabase/migrations/20260912003000_secure_hybrid_assistant.sql` est une trace historique hors du chemin standard et ne doit pas être traité comme la migration active. La présence d'une migration dans Git ne prouve pas son application sur la base hébergée. Lors du contrôle du 17 novembre 2026, le dépôt indiquait `project_id = "ztsvywxbjdlqsbpkbcka"` dans `supabase/config.toml`. Le seul projet Supabase visible dans la connexion portait le nom « Vitalis » mais utilisait un autre identifiant (`uiubsbpaimhgeqcffnuy`) ; l'accès au projet référencé par le dépôt a été refusé. L'état des migrations et des RPC sur l'environnement réellement ciblé reste donc non vérifié. Le projet visible, qui ne présentait aucune migration ni table `public`, ne peut pas être considéré comme la preuve de l'état du projet cible. Voir TECH-001.


## 4. Fournisseurs et configuration

| Voie                             | Fournisseur observé dans le code                                    | Configuration                                                                   | Statut documentaire                                                     |
| -------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Parcours canonique relié à `AssistantTab` | Passerelle IA Lovable, modèle nommé dans le handler | `LOVABLE_API_KEY` côté serveur | Streaming actif dans le code ; quotas maintenant appelés par la route, base distante à vérifier |
| Voie héritée `askAssistant` | Passerelle Cloudflare AI, modèle principal et secours configurables | `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_AI_API_TOKEN`, options `AI_*` côté serveur | Hook non raccordé à l'interface active ; ne pas développer en parallèle |
| Abstraction `AssistantProvider`  | Fournisseur mock par défaut                                         | `setAssistantProvider` en mémoire                                               | Fondation d'extension, pas preuve d'une intégration distante            |

Les noms de fournisseurs et de modèles ci-dessus décrivent le code versionné, pas les paramètres réels des environnements déployés. Ne jamais publier les valeurs des secrets.

## 5. Sécurité, confidentialité et limites

- **Authentification :** l'interface demande une session et l'endpoint de streaming vérifie celle-ci côté serveur. Le nom `/api/public/assistant` ne signifie pas que l'usage est anonyme.
- **Validation :** le parcours canonique utilise maintenant la validation partagée et les mêmes plafonds que la politique serveur ; la voie Cloudflare héritée reste distincte et n'est pas exposée à l'interface active.
- **Données envoyées au fournisseur :** le chemin de streaming envoie les messages soumis et la langue, ainsi qu'un chemin d'écran nettoyé. Le chemin Cloudflare construit une instruction système et transmet les messages après validation. Les contrats de minimisation, rétention et traitement fournisseur doivent être revus avant toute extension de données contextuelles.
- **Secrets :** les clés fournisseurs et clés Supabase privilégiées doivent rester côté serveur, jamais dans le bundle client ni dans les journaux.
- **Sorties :** une réponse de modèle peut être erronée ou inventer une capacité. Le prompt interdit explicitement d'inventer des fonctionnalités et de demander des informations secrètes, mais cette consigne ne remplace pas les validations, les permissions ou la modération côté serveur.
- **Cache :** le cache et `record_ai_cache_candidate` appartiennent à la voie Cloudflare héritée. Le parcours canonique Lovable ne lit ni n'alimente actuellement ce cache ; ne pas le présenter comme une optimisation active de Vita.
- **Usage et coûts :** le parcours Lovable appelle désormais les RPC de quotas avant chaque génération distante et enregistre le résultat du flux. La migration des RPC reste hors de la chaîne standard ; tant que sa présence sur la base distante n'est pas vérifiée, les quotas de production ne sont pas certifiés. En cas de RPC indisponible, l'appel est refusé (fail closed). Les limites définies par la migration sont de 6 demandes par minute et 40 par 24 heures et par membre.

## 6. Contrats et tests existants

Les tests présents comprennent notamment :

- `tests/assistant-policy.test.ts` : validation de conversation, secrets, éligibilité au cache et normalisation de routes ;
- `tests/assistant/privacy-isolation.test.ts` : séparation des clés de conversations locales par compte et du périmètre local ;
- `tests/assistant-stream-history.test.ts` : normalisation des rôles, 8 messages maximum, 4 000 caractères cumulés, rejet d'un flux interrompu et acceptation des marqueurs de fin ;
- `tests/assistant-personality.test.ts` : cohérence FR/EN, contextualisation limitée, honnêteté sur les capacités et absence d'inférence personnelle ;
- `supabase/tests/database/139_assistant_security.test.sql` : RLS, privilèges des RPC, `search_path` vide et rejet des locales nulles ;
- `tests/assistant-policy.test.ts` : limites de taille, alternance des rôles et détection des secrets.

Ces tests prouvent les propriétés qu'ils exercent dans le code testé. Ils ne prouvent pas à eux seuls :

- que les deux chemins serveur appliquent les mêmes contrôles ;
- que les tables/fonctions IA existent dans la base hébergée ;
- que la rétention fournisseur correspond à la configuration attendue ;
- que le streaming, les quotas et les bascules de fournisseur ont été testés en production.

## 7. Décisions nécessaires avant évolution

1. Inventorier les appelants réels de `askAssistant` et déterminer si cette voie est active, alternative ou héritée.
2. Choisir une voie serveur canonique ou définir explicitement les rôles et contrôles des deux voies.
3. Harmoniser les limites de messages, la validation des secrets, la gestion des erreurs, les quotas et la télémétrie.
4. Vérifier la provenance et l'application de la migration IA, les grants/RLS et les fonctions SQL sur un environnement autorisé.
5. Documenter le traitement des données par le fournisseur choisi, les règles de rétention et le budget d'usage.
6. Ajouter des tests d'intégration qui couvrent authentification, entrées sensibles, limites, déconnexion/annulation du flux, indisponibilité et bascule de fournisseur.

Aucune de ces décisions n'est implicitement approuvée par cette consolidation documentaire.

## 8. Sources historiques et périmètre de ce lot

Cette référence s'appuie notamment sur les règles historiques d'architecture IA, les consignes de développement IA, le modèle UDI et les documents de prompts. Les sources historiques sont conservées ; aucune suppression ni aucun déplacement n'est autorisé par ce lot.

**État après sécurisation du parcours canonique :** le handler Lovable applique la politique partagée et les RPC de quotas, et le client refuse désormais les réponses tronquées. Les fonctions `SECURITY DEFINER` utilisent un `search_path` vide et leurs droits d'exécution sont limités explicitement. La CI doit confirmer les derniers changements. Le projet Supabase référencé par le dépôt n'est pas accessible dans la connexion actuelle ; aucun déploiement de migration n'a été effectué et l'état distant reste à vérifier sur le bon projet.
