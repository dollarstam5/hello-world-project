# Architecture IA et intégrations

**Statut :** consolidation documentaire fondée sur les fichiers du dépôt ; configuration de production et usage effectif de chaque voie à confirmer.  
**Périmètre :** assistant Vita, appels aux modèles, connaissances locales, cache, quotas et frontières de sécurité.  
**Garde-fou :** cette référence décrit l'état observé. Elle ne certifie ni la disponibilité d'un fournisseur en production, ni l'application des migrations SQL.

## 1. Vue d'ensemble

L'expérience actuelle expose un assistant conversationnel Vita dans l'interface. Le chemin relié à l'interface principale observée est :

`AILayer` → `AssistantTab` → `useHybridAssistant` → recherche locale → `streamAssistant` → `POST /api/public/assistant` → passerelle IA Lovable → réponse en flux.

Une autre voie serveur existe dans le dépôt :

`askAssistant` → middleware d'authentification Supabase → validation partagée → `runPaidAssistant` → cache promu / quotas Supabase / passerelle Cloudflare AI.

Enfin, `src/lib/ai/assistant.ts` expose une interface `AssistantProvider` dont l'implémentation initiale est un fournisseur mock. Ces voies ne doivent pas être considérées comme un système unique déjà unifié : leur sélection, leur usage et leurs garanties diffèrent. Voir TECH-006 dans le [registre des problèmes techniques](../06-operations/technical-issues.md#tech-006-voies-dintégration-ia-divergentes).

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

### 2.3 Endpoint de streaming observé

`src/domains/assistant/services/assistant-stream.service.ts` appelle `POST /api/public/assistant` avec un jeton Bearer et traite les événements de flux. Malgré le segment `public` du chemin, le handler de `src/routes/api/public/assistant.ts` appelle `readSyncSession` et renvoie `401` si aucune session n'est reconnue.

Le handler :
- valide la structure du corps avec Zod ;
- construit une instruction système en français ou en anglais et ajoute le chemin d'écran transmis ;
- appelle `https://ai.gateway.lovable.dev/v1/responses` avec `LOVABLE_API_KEY` côté serveur ;
- demande le modèle configuré dans le code (`openai/gpt-6-astra`), le streaming et `store: false` ;
- renvoie le flux avec `Content-Type: text/event-stream` et `Cache-Control: no-store`.

Si la clé Lovable manque, le handler renvoie `503`. Le contenu et les erreurs du fournisseur ne doivent pas être considérés comme preuve de disponibilité en production.

**Point de vigilance :** le handler de streaming a ses propres limites de schéma (jusqu'à 12 messages, 1 200 caractères par message) et n'appelle pas directement `validateConversation`, `containsSensitiveSecret` ou le mécanisme de quotas décrit dans la voie serveur alternative. Ne pas lui attribuer ces protections sans vérification spécifique.

## 3. Voie serveur alternative avec quotas et cache

`src/domains/assistant/api/assistant.functions.ts` définit `askAssistant`, protégé par `requireSupabaseAuth`. Il applique un schéma de validation et `validateConversation`, puis délègue à `src/lib/ai/assistant.server.ts`.

Cette voie implémente :
- le refus de certaines demandes détectées comme contenant des secrets sensibles ;
- des limites de conversation et de taille définies dans `src/lib/ai/assistant-policy.ts` ;
- des quotas via les fonctions PostgreSQL `claim_assistant_request`, `complete_assistant_request` et `fail_assistant_request` ;
- une recherche de réponse dans `ai_cache` pour les réponses promues et locales ;
- un appel à la passerelle Cloudflare AI avec modèle principal et modèle de secours configurables, délai maximal et limite de sortie ;
- l'enregistrement de candidats de cache lorsque les critères d'éligibilité sont satisfaits.

La configuration de cette voie est lue côté serveur depuis `src/config/env.server.ts` et `src/lib/config.server.ts`. Les variables Cloudflare ne doivent jamais être exposées au navigateur. Les secrets Supabase privilégiés restent exclusivement côté serveur.

Cette voie et son mécanisme de cache dépendent de fonctions et tables décrites dans `src/supabase/migrations/20260912003000_secure_hybrid_assistant.sql`. Ce fichier se trouve hors du chemin standard `supabase/migrations/` actuellement suivi ; sa présence dans Git ne prouve pas qu'il a été appliqué à la base distante. Cette incertitude est couverte par TECH-001 et ne doit pas être considérée comme résolue ici.

## 4. Fournisseurs et configuration

| Voie | Fournisseur observé dans le code | Configuration | Statut documentaire |
| --- | --- | --- | --- |
| Streaming relié à `AssistantTab` | Passerelle IA Lovable, modèle nommé dans le handler | `LOVABLE_API_KEY` côté serveur | Appel présent dans le handler ; déploiement et disponibilité à vérifier |
| Fonction serveur `askAssistant` | Passerelle Cloudflare AI, modèle principal et secours configurables | `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_AI_API_TOKEN`, options `AI_*` côté serveur | Chemin présent dans le dépôt ; usage effectif à inventorier |
| Abstraction `AssistantProvider` | Fournisseur mock par défaut | `setAssistantProvider` en mémoire | Fondation d'extension, pas preuve d'une intégration distante |

Les noms de fournisseurs et de modèles ci-dessus décrivent le code versionné, pas les paramètres réels des environnements déployés. Ne jamais publier les valeurs des secrets.

## 5. Sécurité, confidentialité et limites

- **Authentification :** l'interface demande une session et l'endpoint de streaming vérifie celle-ci côté serveur. Le nom `/api/public/assistant` ne signifie pas que l'usage est anonyme.
- **Validation :** les deux voies ont des schémas et des limites distincts ; il faut les harmoniser ou documenter leur différence avant de considérer les contrôles équivalents.
- **Données envoyées au fournisseur :** le chemin de streaming envoie les messages soumis et la langue, ainsi qu'un chemin d'écran nettoyé. Le chemin Cloudflare construit une instruction système et transmet les messages après validation. Les contrats de minimisation, rétention et traitement fournisseur doivent être revus avant toute extension de données contextuelles.
- **Secrets :** les clés fournisseurs et clés Supabase privilégiées doivent rester côté serveur, jamais dans le bundle client ni dans les journaux.
- **Sorties :** une réponse de modèle peut être erronée ou inventer une capacité. Le prompt interdit explicitement d'inventer des fonctionnalités et de demander des informations secrètes, mais cette consigne ne remplace pas les validations, les permissions ou la modération côté serveur.
- **Cache :** seules les questions/réponses jugées admissibles par les fonctions de politique peuvent participer au cache partagé dans la voie Cloudflare. Le comportement de la base et les fonctions SQL restent à vérifier sur un environnement réel.
- **Usage et coûts :** les quotas de base de données appartiennent à la voie `askAssistant`. Ne pas supposer que ces quotas couvrent le chemin Lovable tant que le routage et les appels réels ne sont pas unifiés ou prouvés.

## 6. Contrats et tests existants

Les tests présents comprennent notamment :
- `tests/assistant-policy.test.ts` : validation de conversation, secrets, éligibilité au cache et normalisation de routes ;
- `tests/assistant/privacy-isolation.test.ts` : séparation des clés de conversations locales par compte et du périmètre local.

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

**Lot 8 — documentation uniquement :** aucun code applicatif, aucune migration SQL et aucune configuration de déploiement ne sont modifiés.
