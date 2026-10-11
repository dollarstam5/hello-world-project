# API de synchronisation

**Statut :** référence canonique basée sur les contrats et handlers actuellement présents.  
**Routes vérifiées :** `POST /api/sync/push` et `POST /api/sync/pull`.  
**Protocole partagé :** version 2 dans `packages/core-contracts/src/sync.ts`.

Cette page décrit le contrat visible dans le dépôt. Elle ne certifie pas la disponibilité d'une table, d'une politique RLS ou d'un service sur la base hébergée.

## Transport et authentification

Les deux routes exigent une session de synchronisation valide et un jeton Bearer. Les requêtes sont traitées avec un client Supabase lié à l'appelant, de sorte que les grants et politiques RLS de cet utilisateur s'appliquent. Le corps doit être du JSON et ne pas dépasser 256 KiB.

Erreurs HTTP observées dans les handlers :
- `401` : session absente ou invalide ;
- `415` : type de contenu autre que JSON ;
- `413` : corps trop volumineux ;
- `400` : JSON ou contrat invalide ;
- `503` : synchronisation indisponible à la suite d'une erreur inattendue.

Les réponses sont marquées `no-store`. Le contrat partagé applique également des limites et validations plus précises sur les champs, les identifiants, les opérations, les curseurs et les résultats.

## Push — mutations locales vers le serveur

**Requête :** `POST /api/sync/push`

Le corps contient :
- `protocolVersion` : version du contrat ;
- `entries` : liste ordonnée de mutations locales, jusqu'à 50 par requête.

Chaque mutation comprend un identifiant de mutation, son propriétaire local, la table logique, l'identifiant de l'enregistrement, le type `create`, `update` ou `delete`, un patch de champs modifiés et les métadonnées de tentative.

Le serveur vérifie le propriétaire, la politique d'écriture de la table et les champs modifiables. Les écritures sont traduites du modèle logique camelCase vers les tables et colonnes PostgreSQL. Les champs serveur tels que la révision ne sont pas contrôlables par le client.

**Réponse :**
- `accepted` : identifiants des mutations acceptées ;
- `rejected` : mutations refusées avec code et caractère réessayable ;
- `records` : enregistrements autoritaires renvoyés après fusion.

Le transport utilise `sync_mutation_receipts` pour tenter de rejouer une réponse correspondant à une mutation déjà traitée. La table et ses garanties doivent être vérifiées dans la base déployée : voir [TECH-001 et TECH-003](../06-operations/technical-issues.md).

## Pull — changements distants vers le client

**Requête :** `POST /api/sync/pull`

Le corps contient :
- `protocolVersion` ;
- `cursors` : un couple table/révision par table synchronisée ;
- `limit` : nombre maximal de lignes pour la page, jusqu'à 100.

Le serveur lit les lignes dont la révision est supérieure au curseur demandé et les ordonne par révision croissante. La réponse contient :
- `records` : enveloppes avec table logique, révision, indicateur de suppression et données ;
- `cursors` : curseurs résultants par table ;
- `hasMore` : indique si d'autres pages doivent être demandées.

Le moteur local limite un passage à vingt pages. Les enregistrements et les curseurs d'une page sont appliqués dans une même transaction IndexedDB pour éviter de progresser dans le curseur sans avoir persisté les données correspondantes.

## Ordre, reprise et conflits

Le moteur pousse d'abord les mutations en attente, applique les enregistrements confirmés, puis tire les changements distants. L'outbox conserve les mutations non acceptées ; les erreurs temporaires sont réessayées avec backoff. Les refus permanents et les mutations ayant épuisé leurs tentatives sont déplacés vers une file locale de mutations en échec.

La fusion locale préserve les champs modifiés encore présents dans l'outbox lorsque le record local est plus récent selon `updatedAt`, et adopte la version distante pour les autres champs. Ce comportement n'est pas un CRDT et ne remplace pas les règles métier spécifiques. Les détails sont dans [Architecture de synchronisation, hors ligne et temps réel](../02-architecture/synchronization-offline-realtime.md).

## Écart documentaire historique

`docs/SYNC_PROTOCOL.md` indique encore `GET /api/sync/pull?cursor=…`. Le contrat et le handler actuels utilisent `POST` avec un corps JSON. Les appels et références historiques doivent être inventoriés avant toute clôture de cet écart. Voir [TECH-002](../06-operations/technical-issues.md).

## Temps réel

Le bus actuel dans `src/lib/platform/realtime.ts` est une abstraction en mémoire, sans transport distant câblé. Les mises à jour de l'interface par Dexie live queries ne signifient pas que des événements distants arrivent instantanément. Voir [l'architecture de synchronisation](../02-architecture/synchronization-offline-realtime.md#temps-réel--capacité-actuelle).

## Sources de vérité

- `packages/core-contracts/src/sync.ts`
- `packages/core-contracts/src/sync-validation.ts`
- `packages/core-sync/src/transport.ts`
- `packages/core-sync/src/engine.ts`
- `packages/core-db/src/outbox.ts`
- `packages/core-db/src/apply-remote.ts`
- `src/platform/offline/sync-controller.ts`
- `src/platform/offline/sync.worker.ts`
- `src/lib/sync/transport.server.ts`
- `src/routes/api/sync/push.ts`
- `src/routes/api/sync/pull.ts`
- [Registre des problèmes techniques](../06-operations/technical-issues.md)

## Legacy references

- `docs/15. Sync API.md`
- `docs/SYNC_PROTOCOL.md`
