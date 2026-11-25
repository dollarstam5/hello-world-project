# Protocole de synchronisation

Le moteur vit dans `@eco/core-sync`. Il est **pur** : on lui injecte un store (Dexie) et un transport (HTTP). Il tourne dans un Web Worker (`src/platform/offline/sync.worker.ts`), piloté par `src/platform/offline/sync-controller.ts`.

## Cycle

```text
1. PUSH   outbox → POST /api/sync/push   (par lots, ordre d'insertion)
2. PULL   POST /api/sync/pull           (JSON : protocolVersion, cursors, limit)
3. APPLY  écriture locale sans écraser les mutations encore en attente
4. STATE  mise à jour des curseurs + statut exposé à l'UI
```

Le push précède toujours le pull : on ne récupère jamais un état distant qui ignorerait ce qu'on vient de faire.

## Curseurs

`sync_state` garde, par table, la dernière `revision` reçue. Le worker envoie un corps JSON conforme à `PullRequest` (`protocolVersion`, `cursors`, `limit`) avec un jeton Bearer. Le endpoint `POST /api/sync/pull` valide le corps, applique les RLS avec la session de l'utilisateur et renvoie les enregistrements dont `revision > cursor`, paginés. On avance le curseur page par page, ce qui rend une interruption réseau sans conséquence.

## Conflits

Fusion **champ par champ, dernière écriture gagnante** (`updated_at`), avec journalisation. Une mutation locale non encore envoyée est prioritaire sur la valeur distante du même champ.

## Réseau

Retour en ligne, réveil de l'onglet et fin d'une mutation déclenchent un cycle. En cas d'échec : nouvelle tentative avec délai croissant (backoff), plafonné. Aucune perte : l'outbox conserve la mutation jusqu'à l'accusé du serveur.

## Sécurité

`POST /api/sync/pull` et `POST /api/sync/push` exigent `Content-Type: application/json` et un jeton Bearer valide ; sans session, réponse `401`. Les deux endpoints valident le corps JSON et appliquent une limite de taille. Chaque requête est exécutée avec le client Supabase lié à la session de l'utilisateur : les RLS s'appliquent normalement.

## Statut côté écran

Le statut est calme, jamais anxiogène : « À jour », « Envoi en cours », « En attente de réseau ». Jamais de compteur technique brut.
