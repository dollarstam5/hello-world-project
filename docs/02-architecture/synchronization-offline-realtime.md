# Synchronisation, mode hors ligne et temps réel

**Statut :** référence canonique fondée sur le code du dépôt.  
**Périmètre :** stockage local, outbox, worker, protocole HTTP, curseurs, reprises, conflits et abstraction temps réel.  
**Limite :** ce document décrit le code présent ; il ne certifie ni la configuration de la base distante ni la disponibilité d'un service temps réel en production.

## Vue d'ensemble

```text
Interface
  └─ useLocalQuery (Dexie live query)
       └─ IndexedDB isolée par utilisateur ou appareil invité
            ├─ tables locales
            ├─ outbox des mutations en attente
            ├─ curseurs de révision
            └─ mutations refusées conservées localement
                    ↕
             Web Worker de synchronisation
                    ↕ HTTP POST + Bearer
             /api/sync/push et /api/sync/pull
                    ↕
             handlers serveur + client Supabase de l'appelant
                    ↕ RLS et grants effectifs
             PostgreSQL
```

Les principaux points d'entrée sont `packages/core-db/src/schema.ts`, `packages/core-db/src/outbox.ts`, `packages/core-sync/src/engine.ts`, `src/platform/offline/sync-controller.ts`, `src/platform/offline/sync.worker.ts` et `src/lib/sync/transport.server.ts`.

## Stockage local et séparation des données

- L'interface lit les données métier locales via `useLocalQuery` et Dexie. Le hook évite d'interroger IndexedDB pendant le rendu serveur et réagit aux changements de périmètre local.
- `resolveLocalDataScope` construit un nom de base distinct pour un compte authentifié ou un appareil invité. Le changement de session ferme la base précédente et configure le nouveau périmètre.
- L'outbox stocke l'identifiant de mutation, le propriétaire, la table logique, l'identifiant de l'enregistrement, l'opération, le patch des champs modifiés, l'heure locale et les tentatives.
- Les refus permanents et les mutations ayant dépassé le nombre maximal de tentatives sont placés dans `failedMutations` au lieu de rester dans la file active. Le code actuel utilise huit tentatives par défaut.
- Les diagnostics hors ligne exposent des agrégats (volume en attente, âge de la plus ancienne mutation, éléments mis en quarantaine), pas le contenu des mutations.

La conservation locale rend possible le travail sans réseau, mais n'est pas une garantie de sauvegarde absolue : la suppression des données du navigateur, la perte de l'appareil ou les politiques de stockage du navigateur restent hors de la portée du protocole.

## Déclenchement et cycle de synchronisation

Le contrôleur démarre un Web Worker pour le périmètre local actif. Le worker est le point de passage entre IndexedDB et le réseau. Le cycle observé est :

1. **Push** : envoie un lot de mutations en attente à `POST /api/sync/push`.
2. **Réconciliation des mutations acceptées** : supprime les identifiants acceptés de l'outbox et applique localement les enregistrements autoritaires renvoyés par le serveur.
3. **Pull** : appelle `POST /api/sync/pull` avec la version du protocole, un curseur par table et une limite de page.
4. **Application atomique d'une page** : écrit les enregistrements distants et les curseurs correspondants dans une transaction IndexedDB.
5. **Publication du statut** : met à jour le statut de synchronisation et notifie les tables modifiées.

Le push précède le pull. Le moteur planifie des passages périodiques, réagit à la reconnexion et au retour de l'onglet au premier plan. Il empêche deux passages concurrents dans la même instance. Les échecs ordinaires augmentent le délai de reprise jusqu'à un plafond ; une erreur d'authentification n'est pas réessayée en boucle.

Le moteur limite un pull à vingt pages par passage. Si d'autres pages restent, le passage est signalé en erreur plutôt que de tourner sans limite.

## Contrat HTTP et curseurs

Les deux routes de synchronisation utilisent **POST avec un corps JSON** et un jeton Bearer. Le transport HTTP envoie le corps du contrat partagé et valide les réponses reçues.

- Le contrat partagé est versionné ; la version observée dans `packages/core-contracts/src/sync.ts` est `2`.
- Le pull porte un curseur de révision par table synchronisée. Le serveur sélectionne les lignes dont `revision` est supérieure au curseur demandé et ordonne les résultats par révision croissante.
- Le client vérifie la forme des requêtes et réponses, les identifiants de mutations, les tables autorisées et la monotonie des curseurs.
- Les lignes reçues et les curseurs d'une page sont enregistrés dans la même transaction locale : un crash ne doit pas faire avancer le curseur sans enregistrer les données de cette page.
- Les handlers limitent le corps JSON à 256 KiB ; les contrats bornent notamment le nombre de mutations push à 50 et la limite d'une page pull à 100.
- Le serveur utilise le client Supabase lié à la session de l'appelant. Les permissions et RLS de PostgreSQL restent la frontière d'accès.

**Écart à traiter :** `docs/SYNC_PROTOCOL.md` décrit encore un pull GET avec paramètre `cursor`, contrairement au code, aux contrats partagés et au transport qui utilisent POST et un corps JSON. Voir le [registre des problèmes techniques](../06-operations/technical-issues.md).

## Idempotence et reprise des mutations

Le transport serveur consulte `sync_mutation_receipts` avec l'identifiant de mutation et le propriétaire avant d'appliquer une écriture. Il enregistre un reçu contenant la réponse, puis le rejoue lors d'une répétition connue. Lorsqu'une erreur d'écriture survient, il tente aussi de détecter si l'écriture attendue a déjà été appliquée.

Ce mécanisme est une intention d'idempotence visible dans le code, mais son fonctionnement effectif dépend de l'existence, des grants et des politiques de la table `sync_mutation_receipts` dans la base déployée. Cette table n'apparaît pas dans la chaîne standard de migrations actuellement inventoriée. **Ne pas considérer l'idempotence en production comme certifiée tant que cet écart n'est pas résolu et vérifié.**

Les erreurs de validation et de permission sont généralement définitives ; les erreurs de serveur restent réessayables. Une mutation rejetée définitivement ou épuisée est mise en quarantaine et ne bloque plus les mutations suivantes. Une vérification utilisateur et un chemin de récupération des mutations en quarantaine doivent rester possibles dans les parcours opérationnels.

## Résolution des conflits

La fusion locale est implémentée par `mergeRecords` :

- sans enregistrement local, la version distante est adoptée ;
- si la version locale n'est pas plus récente selon `updatedAt`, la version distante gagne, tout en préservant le maximum des horodatages ;
- si la version locale est plus récente et que des champs sont encore modifiés dans l'outbox, les valeurs locales de ces champs sont préservées et les autres champs viennent du serveur ;
- la révision reste celle du serveur, pas une révision inventée par le client.

Il s'agit d'une fusion sélective fondée sur les champs en attente et les horodatages, pas d'un CRDT ni d'une résolution sémantique pour chaque domaine. L'horloge du client peut être incorrecte ; les conflits de contrainte SQL sont classés séparément et certains refus sont permanents. Les règles métier doivent donc définir, domaine par domaine, si une résolution automatique est acceptable ou si une intervention humaine est nécessaire.

## Temps réel : capacité actuelle

`src/lib/platform/realtime.ts` fournit un bus en mémoire avec abonnement par canal, diffusion et fonction de désabonnement. Le commentaire du code indique explicitement que la phase actuelle est un mock local ; aucun transport WebSocket/SSE ni abonnement Supabase Realtime n'est câblé dans cette abstraction.

Il faut distinguer :
- **mise à jour réactive locale** : Dexie live queries reflètent les changements écrits dans la base locale, y compris ceux appliqués par le worker ;
- **synchronisation distante** : le worker récupère les changements lors de ses cycles pull ;
- **événements temps réel distants** : non établis par le bus mock actuel.

Ne pas présenter le bus en mémoire comme une synchronisation multi-appareils instantanée. L'activation d'un transport distant exige une décision d'architecture, une vérification des autorisations par canal, le nettoyage des abonnements, la reprise après reconnexion et des tests d'intégration.

## Contrôles et limites connus

Les tests présents couvrent notamment l'ordre push-avant-pull, l'absence d'appels réseau hors ligne, la limite de pages, les contrats invalides, les curseurs qui reculent et les identifiants de mutation inattendus. Ces tests démontrent des propriétés ciblées du code testé, pas l'état de la base hébergée ni le bon fonctionnement multi-appareils en production.

Avant toute modification du protocole :
- garder le contrat partagé et les validateurs alignés avec les deux handlers ;
- vérifier les tests du moteur, du transport, du stockage local et de l'API ;
- conserver l'isolation des données par propriétaire ;
- ne pas avancer un curseur sans persister la page correspondante ;
- vérifier la table de reçus et la chaîne de migrations standard ;
- préserver l'outbox et documenter le traitement des mutations en quarantaine ;
- séparer clairement les changements documentaires des changements applicatifs ou SQL.

## Références

- [Référence API de synchronisation](../03-api/sync-api.md)
- [Architecture backend et API](./backend-api.md)
- [Architecture de la base de données](./database-architecture.md)
- [Dictionnaire de données](../04-database/data-dictionary.md)
- [Registre des problèmes techniques](../06-operations/technical-issues.md)
- `docs/SYNC_PROTOCOL.md` (source historique conservée en attente d'alignement)
