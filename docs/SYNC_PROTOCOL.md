# Protocole de synchronisation

Le moteur vit dans `@eco/core-sync`. Il est **pur** : on lui injecte un store (Dexie) et un transport (HTTP). Il tourne dans un Web Worker (`src/platform/offline/sync.worker.ts`), piloté par `src/platform/offline/sync-controller.ts`.

## Cycle

```text
1. PUSH   outbox → POST /api/sync/push   (par lots, ordre d'insertion)
2. PULL   GET /api/sync/pull?cursor=…    (incrémental, par curseur de révision)
3. APPLY  écriture locale sans écraser les mutations encore en attente
4. STATE  mise à jour des curseurs + statut exposé à l'UI
```

Le push précède toujours le pull : on ne récupère jamais un état distant qui ignorerait ce qu'on vient de faire.

## Curseurs

`sync_state` garde, par table, la dernière `revision` reçue. Le pull renvoie les enregistrements dont `revision > cursor`, paginés ; on avance le curseur page par page, ce qui rend une interruption réseau sans conséquence.

## Conflits

Fusion **champ par champ, dernière écriture gagnante** (`updated_at`), avec journalisation. Une mutation locale non encore envoyée est prioritaire sur la valeur distante du même champ.

## Réseau

Retour en ligne, réveil de l'onglet et fin d'une mutation déclenchent un cycle. En cas d'échec : nouvelle tentative avec délai croissant (backoff), plafonné. Aucune perte : l'outbox conserve la mutation jusqu'à l'accusé du serveur.

## Sécurité

`/api/sync/pull` et `/api/sync/push` exigent un jeton Bearer valide ; sans jeton, réponse `401`. Chaque requête est exécutée avec l'identité de l'utilisateur : les RLS s'appliquent normalement.

## Statut côté écran

Le statut est calme, jamais anxiogène : « À jour », « Envoi en cours », « En attente de réseau ». Jamais de compteur technique brut.
