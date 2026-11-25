# Mission — contrat d'accès, mutations et synchronisation

## 1. Statut du contrat

Il existe deux niveaux distincts :

1. **Contrat réellement présent dans le code :** package de contrats TypeScript, repository local Dexie et transport générique de synchronisation.
2. **Contrat REST historique :** `7. Mission API.md`, qui propose des routes `/missions`. Aucune implémentation de ces routes n'a été trouvée dans l'inventaire de code de la branche.

Les routes historiques ne doivent pas être utilisées comme preuve d'une API HTTP disponible.

## 2. Modèle TypeScript

Source : `packages/core-contracts/src/records.ts`.

```ts
type MissionStatus =
  | "open"
  | "assigned"
  | "in_progress"
  | "pending_validation"
  | "completed"
  | "disputed"
  | "cancelled";

interface MissionRecord {
  id: MissionId;
  authorId: UserId;
  assigneeId: UserId | null;
  title: string;
  brief: string;
  status: MissionStatus;
  rewardAmount: number;
  rewardCurrency: string;
  dueAt: number | null;
  createdAt: number;
  updatedAt: number;
  revision: number | null;
  deletedAt: number | null;
}
```

La forme ci-dessus est abrégée : `MissionRecord` étend `BaseRecord`. Les dates sont des millisecondes epoch dans les contrats locaux.

## 3. Surface du repository disponible

Importer `missionsRepository` depuis `@eco/core-db` (selon les exports du package).

| Appel | Entrée | Résultat / effet |
|---|---|---|
| `get(id)` | MissionId | Mission locale active ou undefined |
| `list()` | aucun | Missions locales actives |
| `create({ title, brief, rewardAmount, rewardCurrency?, dueAt, id? })` | données de création | Crée une mission `open`, auteur issu du scope, assignee null |
| `editDetails(id, patch)` | détails éditables | Modifie si auteur, `open`, sans assigné |
| `assign(id, assigneeId)` | UserId cible | `open → assigned` |
| `decline(id)` | aucun | `assigned → open`, assigné null |
| `start(id)` | aucun | `assigned → in_progress` |
| `submitResult(id)` | aucun | `in_progress → pending_validation` |
| `validateResult(id)` | aucun | `pending_validation → completed` |
| `dispute(id)` | aucun | `in_progress/pending_validation → disputed` |
| `cancel(id)` | aucun | `open/assigned → cancelled` |
| `remove(id)` | MissionId | Soft delete local si règle autorisée |

Les erreurs de règles sont levées sous forme d'`Error`. Les consommateurs UI doivent intercepter ces erreurs et ne pas annoncer la mutation comme réussie.

## 4. Contrat de création et de modification

Le repository impose :

- auteur = utilisateur du scope local courant ; jamais fourni par l'appelant ;
- assignee = `null` à la création ;
- statut = `open` à la création ;
- devise par défaut = `XAF` ;
- pas d'action Mission pour un scope invité ;
- détails modifiables seulement tant que la mission est ouverte et non affectée.

La politique d'écriture commune autorise en mutation directe les seuls champs `title`, `brief`, `rewardAmount`, `rewardCurrency`, `dueAt`. `status` et `assigneeId` sont réservés aux commandes métier.

## 5. Matrice des transitions

| Action | État source | Acteur | État cible | Conditions |
|---|---|---|---|---|
| assign | open | auteur | assigned | aucun assigné ; cible différente de l'auteur |
| decline | assigned | assigné | open | efface assigneeId |
| start | assigned | assigné | in_progress | conserve assigneeId |
| submit_result | in_progress | assigné | pending_validation | conserve assigneeId |
| validate_result | pending_validation | auteur | completed | conserve assigneeId |
| dispute | in_progress ou pending_validation | auteur ou assigné | disputed | conserve assigneeId |
| cancel | open ou assigned | auteur | cancelled | conserve assigneeId |

Toutes les transitions non listées sont refusées par la logique métier et par le trigger SQL.

## 6. Outbox et sync

Chaque mutation locale est associée à :

- table : `missions` ;
- identifiant stable du record ;
- type `create`, `update` ou `delete` ;
- patch de champs ;
- date de mutation ;
- propriétaire du scope ;
- compteurs et informations de tentative.

L'écriture du record local et l'ajout de la mutation outbox sont transactionnels. Les mutations en attente sont lues par propriétaire et dans l'ordre de mutation. Les refus permanents sont déplacés vers `failedMutations` au lieu d'être rejoués indéfiniment.

La révision distante est un curseur de synchronisation ; le code exposé ici ne définit pas à lui seul une stratégie de résolution de conflit spécifique à Mission. La résolution réelle dépend du worker et du backend sync communs.

## 7. Contraintes backend

Migration : `supabase/migrations/20261113004000_secure_mission_transitions.sql`.

- statuts autorisés limités à la liste V1 ;
- reward_amount >= 0 ;
- reward_currency = XAF ;
- titre 1–160 caractères trimés ;
- brief 1–4 000 caractères trimés ;
- auteur et created_at immuables ;
- insert par auteur authentifié, statut open, sans assigné et non supprimé ;
- update limité aux auteur/assigné par RLS et transitions contrôlées par trigger ;
- suppression physique refusée au rôle authenticated ;
- soft delete auteur uniquement depuis open, sans assigné ;
- audit de chaque changement de statut.

Le trigger SQL est la référence de sécurité ; une validation client peut être contournée.

## 8. REST historique — non implémenté confirmé

Le document `7. Mission API.md` propose notamment :

- `POST /missions`
- `GET /missions/{id}`
- `PATCH /missions/{id}`
- `DELETE /missions/{id}`
- `GET /missions/me`
- `GET /missions`
- commandes `publish`, `join`, `leave`, `complete`, `archive`.

Cette proposition ne correspond pas au modèle de statut actuellement implémenté (`open/assigned/in_progress/pending_validation/completed/disputed/cancelled`) et ne doit pas être exposée comme contrat courant. Les commandes REST, si elles sont créées plus tard, devront mapper explicitement les actions du repository et la machine SQL, sans permettre de patcher librement `status` ou `assigneeId`.

## 9. Erreurs fonctionnelles à traduire dans l'interface

Les messages actuels comprennent notamment :

- `Authentication is required for mission actions.`
- `No local mission {id}.`
- `Mission details can no longer be edited.`
- `Only an open, unassigned mission can be removed.`
- `Mission action is not allowed: {action}.`

Les erreurs SQL utilisent des codes de refus explicites, par exemple `mission_actor_not_authenticated`, `mission_assignment_not_allowed`, `mission_submission_not_allowed`, `mission_validation_not_allowed`, `mission_dispute_not_allowed` et `invalid_mission_transition`. Le consommateur peut les convertir en messages localisés sans masquer le refus.

## 10. Compatibilité

Toute modification du contrat doit être coordonnée entre types partagés, write policy, repository, outbox/sync, migration SQL, tests TypeScript et tests PostgreSQL. Un état inconnu doit être rejeté, jamais normalisé silencieusement côté client.
