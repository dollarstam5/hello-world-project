# Registre des problèmes techniques

**Statut :** registre de triage des écarts observés dans le dépôt.  
**Règle :** une entrée décrit une observation reproductible ou une incertitude à lever ; elle ne prouve pas à elle seule qu'un incident existe en production. Aucun correctif applicatif, SQL ou déploiement n'est autorisé par la seule présence dans ce registre.

## TECH-001 — Divergence des sources de migration PostgreSQL

- **Priorité :** à confirmer avant toute modification de schéma ou release de base.
- **Constat confirmé dans le dépôt :** `supabase/config.toml` ne redéfinit pas le chemin standard Supabase ; la chaîne déclarée par le dépôt est donc `supabase/migrations/`. Le dossier `docs/04-database/legacy-sql-artifacts/src-supabase-migrations/` contient six artefacts supplémentaires non chargés par cette configuration ; `20260912001000_secure_mission_transitions.sql` est un document Markdown contenant un bloc SQL, pas un script SQL brut.
- **Troisième ensemble identifié :** `drizzle.config.ts` configure Drizzle Kit avec `schema: ./drizzle/schema.ts`, `out: ./drizzle/migrations` et une URL `LOVABLE_DB_MIGRATION_URL`. Le journal Drizzle référence trois scripts (`0000_flash_scan_public_functions`, `0001_create_radars_table`, `0002_create_sync_mutation_receipts`). Le schéma Drizzle est actuellement vide et aucun script `drizzle-kit migrate` ni autre appel explicite à ce runner n'a été retrouvé dans les scripts npm examinés. Son rôle d'exécution réel reste donc non démontré.
- **Chevauchements confirmés :** la table `radars` apparaît dans le script Drizzle `0001` et dans l'artefact `docs/04-database/legacy-sql-artifacts/src-supabase-migrations/20260912010000_secure_radar_lifecycle.sql`. `sync_mutation_receipts` apparaît dans le script Drizzle `0002` et dans `docs/04-database/legacy-sql-artifacts/src-supabase-migrations/20260912002000_harden_sync_protocol.sql`. Ces définitions ne doivent pas être rejouées ou fusionnées sans comparaison complète des contraintes, grants, politiques et fonctions.
- **Divergence Flash/Scan à risque de confidentialité :** Drizzle `0000_flash_scan_public_functions.sql` ajoute les coordonnées précises à `public.flashes` et les utilise directement dans ses RPC. La chaîne Supabase actuelle les isole dans `flash_private_locations`, car le pull Sync utilise `.select("*")` sur `flashes`. Les migrations Supabase `20261113002000` et `20261113003000`, ainsi que les tests `121` et `122`, établissent ce modèle séparé. Ne pas rejouer la migration Drizzle `0000` ; voir [le statut TECH-011](../04-database/tech-011-drizzle-chain-status.md).- **Limite de transition à vérifier :** la migration Supabase `20261113002000` crée `flash_private_locations` mais ne supprime pas d'éventuelles anciennes colonnes de coordonnées dans `public.flashes`. Le test `121` ne couvre pas le passage depuis une base où Drizzle `0000` aurait déjà été appliquée. Vérifier les colonnes existantes en lecture seule avant de conclure que les coordonnées sont absentes des lignes Sync.
- **Risque :** trois mécanismes de versionnement coexistent dans le dépôt, mais seul le chemin Supabase est explicitement sélectionné par `supabase/config.toml`. La présence d'un fichier dans Git, d'un journal Drizzle ou d'un test ne prouve pas son application sur une base hébergée.
- **Limite de vérification :** l'état de la base distante n'a pas pu être interrogé depuis les accès disponibles ; le statut de base Lovable pour le projet référencé a retourné `project_not_found`. Aucune connexion SQL ni preuve d'historique des migrations appliquées n'est disponible dans cette revue.
- **Vérification requise :** conserver l'inventaire détaillé dans [le rapport de réconciliation TECH-001](../04-database/migration-chain-reconciliation.md), établir l'origine et l'usage de chaque chaîne, obtenir l'historique des migrations de chaque environnement et comparer le schéma réel avant de choisir un plan d'adoption.
- **Garde-fou :** aucun fichier SQL n'a été déplacé, supprimé, converti ou exécuté. Ne pas fusionner les trois ensembles ni affirmer qu'un objet est déployé sans preuve issue de l'environnement concerné.

## TECH-002 — Contrat documentaire du pull non aligné sur l'implémentation

- **Priorité :** documentation à corriger ; impact runtime à vérifier via les clients.
- **Constat :** `docs/SYNC_PROTOCOL.md` décrit `GET /api/sync/pull?cursor=…`. Le transport partagé et le handler réellement présents utilisent `POST /api/sync/pull` avec un corps JSON contenant la version du protocole, les curseurs par table et la limite.
- **Risque :** un lecteur qui suit l'ancien contrat peut écrire un client incompatible ou diagnostiquer incorrectement les erreurs.
- **Vérification requise :** rechercher tous les appelants, tests et documents qui utilisent GET ; aligner ensuite les références canoniques et historiques sans effacer la traçabilité.

## TECH-003 — Garanties d'idempotence à confirmer

- **Priorité :** à vérifier avant de revendiquer une reprise exactement-une-fois.
- **Constat :** `src/lib/sync/transport.server.ts` lit et écrit des reçus dans `sync_mutation_receipts`, et tente de récupérer une mutation éventuellement appliquée malgré une erreur de réponse. La table n'est pas dans la chaîne standard de migrations actuellement inventoriée.
- **Travail intégré dans le dépôt (13 novembre 2026) :** la PR #61 a ajouté `supabase/migrations/20261113001000_allow_radar_sync_receipts.sql` pour autoriser `radars` dans la contrainte des tables logiques, avec un test PostgreSQL dédié. Les PR #68 et #69 ont ajouté respectivement cinq scénarios fonctionnels de `runPush` et quatre scénarios d'isolation/concurrence au niveau transport. Les trois PR sont fusionnées dans `main` et les contrôles CI correspondants ont réussi.
- **Limite des tests applicatifs :** le test #69 simule les prédicats de propriété avec des doubles `IsolationDatabase` / `IsolationQuery`. Il ne remplace pas les tests RLS PostgreSQL. La suite PostgreSQL locale CI passée sur #61 ne prouve pas que la migration, les grants ou les politiques sont présents sur les bases hébergées.
- **Risque restant :** si la table, ses contraintes, grants ou politiques manquent dans un environnement, le chemin de reçu échoue et les mutations peuvent rester réessayables sans preuve de la garantie attendue.
- **Vérification requise :** confirmer en lecture seule le schéma, la clé unique, la propriété, les grants/RLS et le comportement en cas de répétition, d'échec entre écriture et reçu, et de requêtes concurrentes sur chaque environnement concerné.
- **Rapport de preuves :** [vérification de l'idempotence du transport Sync](../04-database/sync-idempotency-verification.md).
- **Statut :** volet dépôt/tests ciblés traité ; certification des environnements hébergés toujours ouverte. Ne pas annoncer une garantie exactement-une-fois de production avant cette vérification.
- **Lien :** [Architecture de synchronisation](../02-architecture/synchronization-offline-realtime.md#idempotence-et-reprise-des-mutations).

## TECH-004 — Temps réel distant non câblé

- **Priorité :** selon les besoins produit ; pas de panne démontrée.
- **Constat :** `src/lib/platform/realtime.ts` est un bus événementiel en mémoire ; le code indique que la phase actuelle est mock-only. La mise à jour locale repose sur Dexie live queries et la convergence distante sur le cycle de synchronisation.
- **Risque :** confondre réactivité locale et diffusion instantanée multi-appareils.
- **Vérification requise :** confirmer les exigences produit de latence, choisir le transport, définir les autorisations par canal, la reprise et le nettoyage des abonnements, puis ajouter des tests d'intégration.

## TECH-005 — Limites de la résolution automatique des conflits

- **Priorité :** à évaluer par domaine métier.
- **Constat :** `mergeRecords` préserve les champs présents dans l'outbox si le record local est plus récent selon `updatedAt`; les autres champs suivent la version distante. Les contraintes SQL peuvent produire des refus permanents et les horloges clientes ne sont pas une source de temps fiable.
- **Risque :** une fusion automatique peut ne pas correspondre aux invariants métier, notamment pour les transitions de statut ou les données dépendantes.
- **Vérification requise :** définir des règles par domaine, tester deux appareils modifiant les mêmes champs et les champs distincts, couvrir suppressions et transitions de statut, et définir une récupération visible des mutations en quarantaine.

## TECH-006 — Voies d'intégration IA divergentes

- **Priorité :** suivi jusqu'à la validation de la base distante et du parcours canonique.
- **Constat initial :** l'interface utilisait le streaming Lovable sans appliquer la validation complète ni les quotas SQL. Une voie alternative `askAssistant` / `runPaidAssistant` existait avec Cloudflare AI, cache et quotas, mais son hook n'était pas raccordé à l'interface active.
- **Correction intégrée dans la branche de la PR #84 :** `POST /api/public/assistant` reste la voie canonique afin de préserver le streaming. Elle appelle désormais `validateConversation`, `containsSensitiveSecret`, `safeAssistantRoute` et les RPC `claim_assistant_request`, `complete_assistant_request`, `fail_assistant_request`. Les limites sont alignées sur la politique commune (8 messages, 600 caractères par message, 4 000 caractères cumulés). Les demandes sensibles sont refusées avant l'appel fournisseur ; le quota est réclamé avant chaque génération ; le résultat est marqué terminé ou échoué selon la fin du flux.
- **Protection supplémentaire :** le client réduit les historiques à des rôles alternés et à la taille maximale autorisée, y compris après des tours échoués ou hors ligne. Le corps des erreurs fournisseur n'est plus envoyé dans les journaux applicatifs.
- **Limite de base :** les fonctions RPC et tables nécessaires sont définies dans `docs/04-database/legacy-sql-artifacts/src-supabase-migrations/20260912003000_secure_hybrid_assistant.sql`, hors du chemin standard `supabase/migrations/`. Leur présence sur la base distante n'a pas été vérifiée. Si la fonction de quota est absente ou en erreur, le parcours distant échoue de manière fermée ; il ne doit pas basculer vers un appel non plafonné.
- **Statut :** correction de code intégrée ; tests CI et vérification de l'application de la migration restent requis. Ne pas déclarer les quotas de production actifs avant vérification en lecture seule de la base concernée.
- **Garde-fou :** la voie Cloudflare héritée n'est pas utilisée par l'interface active et ne doit pas être développée en parallèle. Sa suppression éventuelle et la réconciliation de la migration relèvent de lots distincts après validation.
- **Référence :** [Architecture IA et intégrations](../02-architecture/ai-architecture-integrations.md).

## Méthode de triage

Pour chaque entrée, consigner le commit et l'environnement examinés, les fichiers et tests concernés, le comportement attendu et observé, la preuve reproductible, le risque utilisateur, le propriétaire de la décision et les critères de clôture.

Ne marquer un problème comme résolu qu'après vérification du changement et des tests pertinents. La mise à jour de la documentation seule ne clôt pas un écart de runtime ou de base de données.


## Addendum — vérification en lecture seule du 27 novembre 2026

Une base associée au projet Lovable « Hello World Project » a été interrogée en lecture seule ; sa correspondance avec le projet Supabase référencé dans `supabase/config.toml` (`ztsvywxbjdlqsbpkbcka`) n'a pas été établie. La table `drizzle.__drizzle_migrations` contient quatre migrations appliquées (25 octobre, 6 novembre et 16 novembre 2026), correspondant aux quatre entrées de `drizzle/migrations/meta/_journal.json`. L'historique `supabase_migrations.schema_migrations` ne contient que trois versions initiales d'août 2026. Le catalogue public montre encore les colonnes `flashes.latitude`, `flashes.longitude` et `flashes.accuracy_meters`, tandis que `public.flash_private_locations` est absente.

**Conséquence :** la chaîne Drizzle a effectivement été exécutée et ne doit pas être supprimée dans ce lot. Elle est gelée pour les nouvelles évolutions, mais doit rester disponible pour audit et réconciliation. Les artefacts historiques déplacés dans `docs/04-database/legacy-sql-artifacts/src-supabase-migrations/` ne sont pas chargés par Supabase CLI ni référencés par les scripts ou le runtime ; ils sont conservés en archive et ne doivent pas être rejoués. La chaîne officielle pour les nouvelles migrations reste `supabase/migrations/`.

Aucune écriture ni migration distante n'a été effectuée. La présence des anciennes colonnes Flash doit être traitée dans un lot de sécurité distinct avant toute suppression de la chaîne Drizzle.


> Réserve d'identification de l'environnement : le projet Lovable a l'identifiant `c311707c-07cc-4b42-877f-38612d34eb39`, tandis que `supabase/config.toml` référence le projet Supabase `ztsvywxbjdlqsbpkbcka`. Aucun élément disponible ne confirme que la base consultée est celle de cette référence Supabase. Les observations du catalogue et des journaux sont donc provisoires pour le diagnostic de l'environnement cible.
