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
| `deleted` | suppression logique |

## Tables

| Domaine | Table | Contenu |
|---|---|---|
| Identité | `profiles` | profil public d'un utilisateur |
| Droits | `user_roles` | rôles séparés du profil |
| Identité | `udi` | identités numériques progressives |
| Flash | `flashes` | publications éphémères |
| Missions | `missions` | missions et leur état |
| Social | `posts` | échanges et fils |
| Médias | `media` | références de fichiers |
| Notifications | `notifications` | messages destinés à une personne |
| Audit | `audit` | journal des actions sensibles |

## Cycle sécurisé d'une mission

```text
open
  → assigned
  → in_progress
  → pending_validation
  → completed