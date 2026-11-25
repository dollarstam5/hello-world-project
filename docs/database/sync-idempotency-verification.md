# Vérification de l'idempotence du transport Sync — anomalie 1

**Statut au 13 novembre 2026 :** correction du dépôt intégrée et tests applicatifs ciblés intégrés dans `main`. La validation des garanties RLS et du schéma sur les bases hébergées reste en attente d'une preuve en lecture seule.

## 1. Périmètre

Cette vérification porte sur `runPush` dans `src/lib/sync/transport.server.ts`, en particulier le cycle écriture métier / reçu `sync_mutation_receipts` / rejeu d'une mutation, ainsi que l'accept-list SQL des tables logiques autorisées.

Aucune modification du transport de production n'a été effectuée dans les PR de tests #68 et #69. Aucun accès SQL distant, changement de schéma hébergé ou déploiement n'a été effectué.

## 2. Correction SQL intégrée

La PR #61 a ajouté `supabase/migrations/20261113001000_allow_radar_sync_receipts.sql`. Cette migration remplace la contrainte `sync_mutation_receipts_logical_table_check` afin d'inclure `radars`, cohérent avec le contrat de synchronisation et la politique d'écriture du dépôt.

Le test PostgreSQL dédié `supabase/tests/database/40_sync_mutation_receipts_rls.test.sql` couvre notamment l'insertion d'un reçu Radar et les contrôles d'accès. La PR #61 a exécuté la suite PostgreSQL locale CI (13 fichiers, 164 tests) avec succès. Ce résultat concerne la base locale éphémère du workflow, pas une base hébergée.

## 3. Tests applicatifs de transport intégrés

### PR #68 — scénarios fonctionnels de reçu

Fichier : `tests/sync/transport.server.test.ts`

Les cinq scénarios ajoutés vérifient :
1. création Radar suivie de l'enregistrement du reçu autoritaire ;
2. mise à jour Radar et contenu résultant du reçu ;
3. suppression logique Radar et reçu de suppression ;
4. rejeu d'un même identifiant de mutation sans seconde écriture métier ;
5. récupération après écriture métier réussie mais échec simulé d'enregistrement du reçu, puis retry sans duplicata.

La PR #68 a été fusionnée après succès des contrôles Quality, Dependency review et du workflow « Security, tests and build ». Le fichier est présent dans `main`.

### PR #69 — isolation propriétaire et concurrence

Fichier : `tests/sync/transport.server.isolation-concurrency.test.ts`

Les quatre scénarios ajoutés vérifient :
1. séparation des Radars et reçus de deux propriétaires ;
2. impossibilité pour un propriétaire de modifier le Radar d'un autre ;
3. rejet d'une entrée outbox dont le propriétaire déclaré diffère de l'utilisateur authentifié ;
4. deux appels concurrents de la même mutation sans duplication du Radar ni du reçu.

**Limite explicite :** ces scénarios utilisent `IsolationDatabase` et `IsolationQuery`, des doubles de test qui simulent les prédicats de propriété. Le commentaire du test précise qu'il s'agit d'un test d'isolation au niveau transport, et non d'un substitut aux tests RLS PostgreSQL. Ils ne prouvent donc pas à eux seuls l'isolation réelle de Postgres/Supabase sous concurrence.

La PR #69 a été fusionnée après succès de Quality, Dependency review et du workflow « Security, tests and build ». Le fichier est présent dans `main`.

## 4. État vérifié et limites restantes

| Élément | État | Preuve / limite |
|---|---|---|
| Autorisation SQL du reçu Radar | Intégrée | Migration de la PR #61 présente dans `main` |
| Reçu Radar et contrôles DB locaux | Vérifiés en CI | Test pgTAP dédié et suite PostgreSQL locale réussis dans la PR #61 |
| Scénarios fonctionnels `runPush` | Intégrés et CI verte | PR #68, cinq scénarios |
| Isolation et concurrence au niveau transport simulé | Intégrées et CI verte | PR #69, quatre scénarios ; doubles de test |
| RLS réelle sur base hébergée | Non vérifiée | Aucun accès distant en lecture seule ni export de catalogue fourni |
| Schéma et migration réellement appliqués sur chaque environnement | Non vérifiés | Git et CI locale ne prouvent pas l'état des bases hébergées |

## 5. Conclusion

**Anomalie 1 — volet dépôt/code et tests ciblés : traité et intégré dans `main`.** La correction SQL Radar, les cinq scénarios fonctionnels et les quatre scénarios d'isolation/concurrence simulée sont versionnés et leurs contrôles CI respectifs ont réussi.

**Anomalie 1 — volet environnement hébergé : reste non certifié.** Ne pas annoncer une garantie exactement-une-fois ou une conformité RLS de production tant que le schéma, les contraintes, les grants et les politiques réellement déployés n'ont pas été vérifiés en lecture seule. Cette réserve rejoint TECH-001 et TECH-003.

## 6. Références

- PR #61 — correction SQL et test PostgreSQL : https://github.com/dollarstam5/hello-world-project/pull/61
- PR #68 — scénarios `runPush` : https://github.com/dollarstam5/hello-world-project/pull/68
- PR #69 — isolation et concurrence : https://github.com/dollarstam5/hello-world-project/pull/69
- Migration : `supabase/migrations/20261113001000_allow_radar_sync_receipts.sql`
- Test PostgreSQL : `supabase/tests/database/40_sync_mutation_receipts_rls.test.sql`
- Tests applicatifs : `tests/sync/transport.server.test.ts` et `tests/sync/transport.server.isolation-concurrency.test.ts`
