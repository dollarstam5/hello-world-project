# Backend et architecture des API

**Statut :** référence canonique de l'architecture backend observée.  
**Périmètre :** entrée des requêtes serveur, routes HTTP vérifiées, intégration Supabase, frontières de privilèges et erreurs API.  
**Hors périmètre :** définition complète du modèle PostgreSQL/RLS (Lot Données), spécification exhaustive du protocole offline (Lot Synchronisation) et certification de la logique métier.

Cette référence distingue les comportements observés dans le code des intentions décrites dans les documents historiques. Une route documentée ici est une route repérée dans le dépôt ; une API métier mentionnée dans un ancien document n'est pas considérée comme livrée sans implémentation vérifiable.

## Sources de vérité

| Sujet | Source examinée |
| --- | --- |
| Entrée HTTP et enveloppe des réponses serveur | `src/server.ts` |
| Middleware de démarrage et traitement d'erreurs | `src/start.ts` |
| Déclaration des routes HTTP | `src/routes/api/` |
| Session utilisée par les routes de synchronisation | `src/lib/sync/session.server.ts` |
| Exécution du protocole de synchronisation | `src/lib/sync/transport.server.ts` |
| Validation des messages de synchronisation | `src/lib/sync/validate.ts` et `@eco/core-contracts` |
| Client Supabase privilégié côté serveur | `src/integrations/supabase/client.server.ts` |
| Règles backend existantes | [BACKEND_RULES.md](../BACKEND_RULES.md) |
| Contrats API canoniques | [Répertoire API](../03-api/README.md) |

## Cycle d'une requête

1. `src/server.ts` délègue au serveur TanStack Start, ajoute le contexte de requête et les en-têtes de sécurité, et journalise les erreurs serveur normalisées.
2. `src/start.ts` configure le middleware d'attachement de l'authentification Supabase et le middleware de traitement d'erreurs.
3. Les routes HTTP sont déclarées par fichier sous `src/routes/api/`.
4. Les handlers valident la session et les données d'entrée selon leur responsabilité, puis appellent les fonctions serveur ou services nécessaires.
5. Les réponses d'erreur doivent rester explicites, ne pas exposer de secrets et utiliser des statuts HTTP cohérents.

Cette séquence décrit les points d'entrée présents dans le code ; elle ne garantit pas que toutes les fonctions métier ont déjà une route HTTP dédiée.

## Routes HTTP vérifiées

| Route | Méthode | Comportement constaté |
| --- | --- | --- |
| `/api/health` | `GET` | Renvoie un statut `ok`, le nom de service et un horodatage ISO ; réponse `no-store`. |
| `/api/sync/pull` | `POST` | Valide une session, un corps JSON de taille limitée et la requête de pull, puis lit les changements avec le client Supabase de l'appelant. |
| `/api/sync/push` | `POST` | Valide une session, un corps JSON de taille limitée et les mutations, puis applique les écritures permises avec l'identité de l'appelant. |
| `/api/public/assistant` | `POST` | Malgré le segment `public`, le handler exige une session. Il valide les messages, appelle la passerelle IA côté serveur et transmet le flux de réponse. |

L'inventaire est limité aux handlers repérés sous `src/routes/api/` lors du Lot 5. Il ne constitue pas une preuve d'absence d'autres points d'entrée, par exemple des fonctions serveur TanStack.

## Validation et erreurs HTTP

Les handlers de synchronisation contrôlent le type de contenu JSON et la taille du corps, puis utilisent les validateurs partagés. Les réponses observées incluent :

- `401` lorsque la session de synchronisation est absente ou invalide ;
- `415` lorsque le type de contenu requis n'est pas JSON ;
- `413` lorsque la charge dépasse la limite configurée ;
- `400` lorsque le JSON ou le contrat de synchronisation est invalide ;
- `503` lorsqu'une erreur inattendue rend la synchronisation indisponible.

L'endpoint assistant renvoie notamment `401` sans session, `400` pour une requête invalide, `503` lorsque la clé de passerelle n'est pas configurée, et une erreur de passerelle en cas d'échec amont. Les détails d'erreur amont sont limités dans les logs ; les logs restent un point à contrôler dans la revue opérationnelle.

## Supabase et frontière de privilèges

Deux modes d'accès doivent rester clairement distincts :

- **Client lié à l'appelant :** les routes de synchronisation construisent un client Supabase avec le jeton Bearer vérifié. Les requêtes SQL passent ainsi par les permissions et politiques RLS applicables à cet utilisateur.
- **Client service role :** `src/integrations/supabase/client.server.ts` expose un client serveur privilégié qui contourne les RLS. Il ne doit être chargé que dans un handler serveur de confiance après contrôle explicite de l'autorisation. Il ne doit jamais être importé dans du code client ni servir à décider seul des permissions d'un utilisateur.

La présence de ce client privilégié n'est pas une preuve qu'il est utilisé par chaque handler. Les détails de politiques par table, grants, fonctions `SECURITY DEFINER` et tests RLS doivent être audités dans le lot consacré aux données et à PostgreSQL.

## Synchronisation : frontières actuellement visibles

Les routes `pull` et `push` utilisent `readSyncSession`, les validateurs partagés et le transport serveur. Le transport refuse les mutations de tables en lecture seule ou les opérations non autorisées, contrôle la propriété de la mutation et classe les rejets. Les erreurs de permission et de conflit sont distinguées des erreurs réessayables.

Le protocole complet — curseurs, révisions, outbox locale, reprise après interruption, idempotence et règles de conflit — doit être documenté et vérifié dans le lot dédié à la synchronisation. Ce document n'en remplace pas la spécification.

## Écarts documentaires à vérifier

- **Méthode du pull :** `docs/SYNC_PROTOCOL.md` décrit `GET /api/sync/pull?cursor=…`, alors que le handler actuellement présent expose `POST /api/sync/pull` et valide un corps JSON. Le contrat canonique doit être aligné après vérification des appelants et tests ; aucune modification applicative n'est incluse dans ce lot.
- **APIs métier :** les références canoniques Flash, Radar et Trust sont actuellement des pages de renvoi vers les documents historiques. Leur existence dans la documentation ne prouve pas qu'une route métier correspondante est implémentée.
- **RLS :** ce lot confirme que le transport de synchronisation utilise un client lié à l'appelant ; il ne certifie pas la justesse de chaque politique de base de données.

## Garde-fous de changement

- Garder les clés secrètes côté serveur et ne jamais les exposer aux bundles client.
- Ne pas utiliser le client service role pour les requêtes ordinaires d'un utilisateur.
- Valider le type, la taille et la structure des charges avant traitement.
- Préserver les erreurs HTTP attendues et ne pas renvoyer de traces ou de secrets.
- Pour toute nouvelle route, documenter méthode, schéma d'entrée/sortie, autorisation, erreurs et tests.
- Vérifier le comportement dans le code et les tests avant de marquer une API comme implémentée.

## Références liées

- [Architecture système](./system-architecture.md)
- [Architecture front-end et expérience](./frontend-experience.md)
- [Référence API](../03-api/README.md)
- [Architecture base de données](./database-architecture.md)
- [Protocole de synchronisation historique](../SYNC_PROTOCOL.md)
- [Règles backend](../BACKEND_RULES.md)
