# Mission — architecture technique V1

## 1. Vue d'ensemble

Mission est un domaine métier stocké localement puis synchronisé. Le chemin d'écriture démontré par le dépôt est :

```text
Interface / consumer
       |
       v
packages/core-db/src/mission-repository.ts
       |  règles préalables via @eco/core-logic
       v
IndexedDB (Dexie) <---- transaction atomique ----> Outbox
       |                                             |
       +---------------- Sync worker ----------------+
                                                     |
                                                     v
                                           Supabase / PostgreSQL
                                                     |
                                      RLS + trigger + constraints
                                                     |
                                                     v
                                            public.audit
```

L'interface lit la base locale ; `packages/core-db/src/schema.ts` précise que le sync worker est le seul pont réseau. Cette architecture n'est pas une API HTTP Mission dédiée.

## 2. Contrats de domaine

### Type canonique

Le type est défini dans `packages/core-contracts/src/records.ts` :

- `MissionStatus` : `open | assigned | in_progress | pending_validation | completed | disputed | cancelled` ;
- `MissionAction` : `assign(assigneeId)`, `decline`, `start`, `submit_result`, `validate_result`, `dispute`, `cancel` ;
- `MissionRecord` : auteur, assigné, titre, brief, état, montant/devise, échéance et enveloppe `BaseRecord`.

Les identifiants métier sont typés via `MissionId` et `UserId`. L'enveloppe commune porte identifiant, horodatages, révision distante et suppression logique.

### Propriétaire des règles

`packages/core-logic/src/missions.ts` calcule les transitions autorisées et expose aussi :

- `canEditMissionDetails` : auteur + statut `open` + aucun assigné ;
- `canRemoveMission` : auteur + statut `open` ;
- `isMissionOverdue` : compare `dueAt` à l'horloge fournie ou à `Date.now()`, hors états terminaux ;
- `sortMissionsByUrgency` : échéance la plus proche d'abord, les échéances nulles à la fin.

La logique client est une projection pratique, pas une frontière de sécurité. PostgreSQL réplique les contrôles et constitue l'autorité distante.

## 3. Repository et transactions locales

`packages/core-db/src/mission-repository.ts` exporte `missionsRepository` :

| Méthode | Comportement |
|---|---|
| `get(id)`, `list()` | Lecture du dépôt générique, exclusion des enregistrements supprimés |
| `create(input)` | Auteur dérivé du scope local authentifié, état `open`, assigné nul, devise par défaut XAF |
| `editDetails(id, patch)` | Vérifie `canEditMissionDetails`, puis délègue à update |
| `assign(id, assigneeId)` | Commande de transition `assign` |
| `decline(id)` | Commande `decline` |
| `start(id)` | Commande `start` |
| `submitResult(id)` | Commande `submit_result` |
| `validateResult(id)` | Commande `validate_result` |
| `dispute(id)` | Commande `dispute` |
| `cancel(id)` | Commande `cancel` |
| `remove(id)` | Vérifie la règle locale puis suppression logique |

Pour les transitions, le repository lit l'enregistrement, calcule un patch avec `missionTransition`, met à jour l'enregistrement et ajoute la mutation outbox dans une transaction Dexie `rw` commune. La suppression et la mise à jour générique suivent aussi le repository partagé.

Le scope de base locale est isolé par propriétaire. `actorId()` rejette un scope dont l'identifiant commence par `guest:`. Le code de repository ne doit jamais accepter un auteur fourni par l'interface.

## 4. Contrôle des écritures et synchronisation

`packages/core-contracts/src/write-policy.ts` définit pour `missions` :

- création autorisée ;
- mise à jour directe : `title, brief, rewardAmount, rewardCurrency, dueAt` ;
- champs de commande : `status, assigneeId` ;
- suppression logique locale autorisée.

Les champs de commande ne sont pas des champs d'édition ordinaire. `repository.update` rejette les champs hors allowlist. Les actions de cycle de vie passent par les commandes du repository.

`packages/core-db/src/outbox.ts` conserve les mutations par propriétaire, les lit dans l'ordre temporel, suit les tentatives et met en quarantaine les refus permanents ou les mutations ayant épuisé leurs tentatives. L'outbox permet le travail hors ligne ; elle ne garantit pas que toute mutation sera acceptée à la synchronisation.

Les conflits et refus doivent être exposés à l'utilisateur/au support : ne pas confondre une écriture optimiste locale avec une confirmation distante.

## 5. Sécurité PostgreSQL

La migration de référence actuelle est `supabase/migrations/20261113004000_secure_mission_transitions.sql`.

Elle :

1. exécute un préflight non destructif sur les valeurs historiques incompatibles ;
2. ajoute des contraintes de statut, récompense non négative, devise XAF, longueur du titre et du brief ;
3. retire les droits génériques UPDATE/DELETE et accorde seulement les colonnes nécessaires ;
4. crée une policy INSERT où `author_id = auth.uid()` ;
5. crée une policy UPDATE limitée aux lignes dont l'utilisateur est auteur ou assigné ;
6. installe `protect_mission_transition()` en trigger BEFORE INSERT OR UPDATE, SECURITY INVOKER ;
7. refuse les rôles non authentifiés, protège les champs immuables et applique les transitions OLD/NEW ;
8. journalise les changements de statut avec `audit_mission_transition()`, SECURITY DEFINER avec search_path borné ;
9. ajoute des index partiels auteur/statut et assigné/statut sur les missions non supprimées.

La migration laisse passer le rôle `service_role` explicitement. Cet accès doit rester réservé aux opérations serveur de confiance.

### Attention à la migration historique

`src/supabase/migrations/20260912001000_secure_mission_transitions.sql` contient une ancienne variante : elle normalise des lignes existantes par UPDATE et traite différemment les rôles non authentifiés. La migration plus récente sous `supabase/migrations/` utilise un préflight et un refus explicite. Pour décrire le comportement cible actuel, se référer à la migration datée 20261113 ; vérifier l'historique réellement appliqué à chaque environnement avant toute opération de déploiement.

## 6. Limites techniques constatées

- Aucun module d'API REST Mission dédié n'apparaît dans l'inventaire du dépôt.
- Aucun écran/route Mission dédiée n'a été identifié dans l'inventaire de fichiers de cette branche.
- Le modèle ne possède pas d'historique métier détaillé des commentaires ou du contenu de résultat ; l'audit SQL consigne les transitions de statut.
- La migration ajoute des contraintes de schéma, mais l'existence du fichier ne prouve pas qu'elle est appliquée sur un projet Supabase distant.
- Le test SQL vérifie la structure et les privilèges ; il ne remplace pas des tests d'intégration complets sous plusieurs identités.

## 7. Points d'extension contrôlés

Toute évolution doit mettre à jour ensemble : `MissionRecord`, `MissionAction`, logique de transition, write policy, repository, migration SQL, validation sync et tests. Ne pas ajouter un état uniquement dans l'UI ou le type TypeScript. Les évolutions de candidatures multiples ou d'équipes nécessitent une table relationnelle dédiée plutôt que de surcharger `assigneeId`.
