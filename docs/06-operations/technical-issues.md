# Registre des problèmes techniques

**Statut :** registre de triage des écarts observés dans le dépôt.  
**Règle :** une entrée décrit une observation reproductible ou une incertitude à lever ; elle ne prouve pas à elle seule qu'un incident existe en production. Aucun correctif applicatif, SQL ou déploiement n'est autorisé par la seule présence dans ce registre.

## TECH-001 — Divergence des sources de migration PostgreSQL

- **Priorité :** à confirmer avant toute modification de schéma ou release de base.
- **Constat confirmé dans le dépôt :** `supabase/config.toml` ne redéfinit pas le chemin standard Supabase ; la chaîne déclarée par le dépôt est donc `supabase/migrations/`. Le dossier `src/supabase/migrations/` contient six artefacts supplémentaires non chargés par cette configuration ; `20260912001000_secure_mission_transitions.sql` est un document Markdown contenant un bloc SQL, pas un script SQL brut.
- **Troisième ensemble identifié :** `drizzle.config.ts` configure Drizzle Kit avec `schema: ./drizzle/schema.ts`, `out: ./drizzle/migrations` et une URL `LOVABLE_DB_MIGRATION_URL`. Le journal Drizzle référence trois scripts (`0000_flash_scan_public_functions`, `0001_create_radars_table`, `0002_create_sync_mutation_receipts`). Le schéma Drizzle est actuellement vide et aucun script `drizzle-kit migrate` ni autre appel explicite à ce runner n'a été retrouvé dans les scripts npm examinés. Son rôle d'exécution réel reste donc non démontré.
- **Chevauchements confirmés :** la table `radars` apparaît dans le script Drizzle `0001` et dans l'artefact `src/supabase/migrations/20260912010000_secure_radar_lifecycle.sql`. `sync_mutation_receipts` apparaît dans le script Drizzle `0002` et dans `src/supabase/migrations/20260912002000_harden_sync_protocol.sql`. Ces définitions ne doivent pas être rejouées ou fusionnées sans comparaison complète des contraintes, grants, politiques et fonctions.
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

- **Priorité :** à clarifier avant toute évolution fonctionnelle, coût ou sécurité de l'assistant.
- **Constat :** le chemin relié à `AssistantTab` passe par `useHybridAssistant` et `POST /api/public/assistant`, dont le handler appelle la passerelle Lovable. Le dépôt contient aussi `askAssistant` / `runPaidAssistant`, qui utilisent la validation partagée, les quotas SQL, le cache promu et la passerelle Cloudflare AI, ainsi qu'une abstraction `AssistantProvider` mock.
- **Risque :** les limites de conversation, les filtres de contenu sensible, les quotas, la gestion des erreurs et les paramètres fournisseur ne sont pas identiques par construction. La présence d'un chemin dans le dépôt ne prouve pas qu'il est actif ni qu'il est utilisé par l'interface.
- **Vérification requise :** inventorier les appelants de chaque voie, confirmer le chemin réellement déployé, choisir une voie canonique ou définir leurs responsabilités, comparer les protections et les budgets, puis ajouter des tests d'intégration.
- **Garde-fou :** ce constat ne justifie pas une modification de code, de fournisseur, de secrets ou de base de données dans le lot documentaire. Vérifier également TECH-001 avant de s'appuyer sur les tables/fonctions IA.
- **Référence :** [Architecture IA et intégrations](../02-architecture/ai-architecture-integrations.md).

## Méthode de triage

Pour chaque entrée, consigner le commit et l'environnement examinés, les fichiers et tests concernés, le comportement attendu et observé, la preuve reproductible, le risque utilisateur, le propriétaire de la décision et les critères de clôture.

Ne marquer un problème comme résolu qu'après vérification du changement et des tests pertinents. La mise à jour de la documentation seule ne clôt pas un écart de runtime ou de base de données.
