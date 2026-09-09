# Modèle de données

Deux représentations d'une même vérité : **Dexie** (local, ce que l'écran lit) et **le backend** (source distante, protégée par RLS). Les types partagés vivent dans `@eco/core-contracts`.

## Enregistrement synchronisable

Tout enregistrement partage la même enveloppe :

| Champ | Rôle |
|---|---|
| `id` | identifiant stable (UUID), généré côté client |
| `owner_id` | propriétaire (utilisateur) |
| `revision` | numéro de révision globale attribué par le backend |
| `updated_at` | horodatage de dernière écriture |
| `deleted` | suppression logique (jamais de suppression physique en sync) |

## Tables (Dexie ↔ backend)

| Domaine | Table | Contenu |
|---|---|---|
| Identité | `profiles` | profil public d'un utilisateur |
| Droits | `user_roles` | rôles (`admin`, `moderator`, `user`) — table dédiée, jamais sur le profil |
| Identité | `udi` | identités numériques progressives |
| Flash | `flashes` | publications éphémères |
| Missions | `missions` | missions et leur état |
| Social | `posts` | échanges et fils |
| Médias | `media` | références de fichiers (le binaire vit dans Storage) |
| Notifications | `notifications` | messages destinés à une personne |
| Audit | `audit` | journal des actions sensibles |

## Tables locales uniquement

| Table | Rôle |
|---|---|
| `outbox` | file des mutations en attente d'envoi |
| `sync_state` | curseurs de synchronisation par table |

## Règles

- L'écriture locale et l'entrée `outbox` se font **dans la même transaction Dexie**.
- Le backend est seul à attribuer `revision` (trigger `assign_sync_revision`).
- Une donnée reçue du serveur n'écrase jamais une mutation locale encore en attente.
- Les fichiers ne transitent jamais par la sync : Storage privé + référence dans `media`.
