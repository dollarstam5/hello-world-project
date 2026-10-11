# Registre des problèmes techniques

**Statut :** registre de triage des écarts observés dans le dépôt.  
**Règle :** une entrée décrit une observation reproductible ou une incertitude à lever ; elle ne prouve pas à elle seule qu'un incident existe en production. Aucun correctif applicatif, SQL ou déploiement n'est autorisé par la seule présence dans ce registre.

## TECH-001 — Divergence des sources de migration PostgreSQL

- **Priorité :** à confirmer avant toute modification de schéma ou release de base.
- **Constat :** le chemin standard Supabase est `supabase/migrations/`. Le dépôt contient aussi six artefacts SQL ou assimilés sous `src/supabase/migrations/`, non configurés comme chemin standard dans `supabase/config.toml`. L'un de ces artefacts est un document Markdown avec du SQL clôturé plutôt qu'une migration SQL brute.
- **Risque :** le schéma, les grants, RLS ou tables auxiliaires présents dans les artefacts hors chemin standard peuvent ne pas être appliqués par le flux normal de migration. Le contenu du dépôt ne prouve pas l'état de la base hébergée.
- **Conséquence notable :** le transport de synchronisation référence `sync_mutation_receipts`, mais cette table n'est pas présente dans la chaîne standard inventoriée. Le fonctionnement des reçus d'idempotence doit être confirmé sur une base représentative.
- **Vérification requise :** inventorier les six artefacts, confirmer leur provenance et leur éventuelle application dans chaque environnement, comparer le schéma distant aux migrations suivies, identifier les migrations manquantes et faire valider un plan de réconciliation.
- **Garde-fou :** ne déplacer, supprimer, exécuter ou convertir aucun de ces fichiers sans revue technique et autorisation explicite. Ne jamais affirmer que les changements sont déployés sans preuve.

## TECH-002 — Contrat documentaire du pull non aligné sur l'implémentation

- **Priorité :** documentation à corriger ; impact runtime à vérifier via les clients.
- **Constat :** `docs/SYNC_PROTOCOL.md` décrit `GET /api/sync/pull?cursor=…`. Le transport partagé et le handler réellement présents utilisent `POST /api/sync/pull` avec un corps JSON contenant la version du protocole, les curseurs par table et la limite.
- **Risque :** un lecteur qui suit l'ancien contrat peut écrire un client incompatible ou diagnostiquer incorrectement les erreurs.
- **Vérification requise :** rechercher tous les appelants, tests et documents qui utilisent GET ; aligner ensuite les références canoniques et historiques sans effacer la traçabilité.

## TECH-003 — Garanties d'idempotence à confirmer

- **Priorité :** à vérifier avant de revendiquer une reprise exactement-une-fois.
- **Constat :** `src/lib/sync/transport.server.ts` lit et écrit des reçus dans `sync_mutation_receipts`, et tente de récupérer une mutation éventuellement appliquée malgré une erreur de réponse. La table n'est pas dans la chaîne standard de migrations actuellement inventoriée.
- **Risque :** si la table, ses contraintes, grants ou politiques manquent dans un environnement, le chemin de reçu échoue et les mutations peuvent rester réessayables sans preuve de la garantie attendue.
- **Vérification requise :** confirmer le schéma, la clé unique, la propriété, les grants/RLS et le comportement en cas de répétition, d'échec entre écriture et reçu, et de requêtes concurrentes.
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
