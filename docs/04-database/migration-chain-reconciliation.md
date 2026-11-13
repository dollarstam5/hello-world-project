# TECH-001 — Rapport de réconciliation des chaînes de migration

**État de la revue :** inventaire du dépôt effectué ; réconciliation de la base distante non vérifiable à ce stade.  
**Référence examinée :** branche `main`, après fusion de la PR #70, commit `8cb601309fe089d2c742140a95d564d45c50e63c`.  
**Périmètre :** configuration, fichiers versionnés, journal Drizzle, scripts de projet et code consommateur. Aucun SQL n'a été exécuté.

## 1. Conclusion opérationnelle

Le dépôt contient trois ensembles de migrations distincts :

1. **Supabase CLI :** `supabase/migrations/`, seul dossier de migration explicitement configuré par `supabase/config.toml`.
2. **Artefacts hors chemin CLI :** `src/supabase/migrations/`, six fichiers supplémentaires dont un document Markdown avec SQL clôturé.
3. **Drizzle :** `drizzle/migrations/`, trois scripts enregistrés dans `drizzle/migrations/meta/_journal.json`, avec une configuration séparée dans `drizzle.config.ts`.

La décision sûre à ce stade est de conserver le chemin Supabase comme référence de migration pour le CLI, sans considérer que les deux autres ensembles sont automatiquement appliqués ou abandonnés. Il est impossible de déterminer depuis Git seul si l'un ou l'autre a été exécuté manuellement ou par un pipeline externe.

## 2. Éléments vérifiés

### Supabase CLI

- `supabase/config.toml` contient uniquement `project_id` et ne définit aucun chemin alternatif.
- Le dossier `supabase/migrations/` contient la migration initiale de schéma, des migrations de stockage et les migrations des moteurs.
- Le cycle de vie Radar est désormais intégré par `20261113000000_radar_lifecycle.sql`, avec son test `supabase/tests/database/120_radar_lifecycle_rls.test.sql`.
- La PR #49 historique a été fermée sans fusion ; son remplacement, la PR #60, a été fusionné dans `main` (commit `750968aa1ee693c9edb3b50c418b2c4f886f5188`). Le workflow Quality de cette PR a exécuté le test Radar avec succès (`120_radar_lifecycle_rls.test.sql ... ok`).
- Les documents d'architecture et de schéma confirment que `supabase/migrations/` est le chemin standard du dépôt. La réussite des tests locaux CI ne prouve toutefois pas que la migration a été appliquée à une base hébergée.

### Artefacts sous `src/supabase/migrations/`

Les six artefacts repérés sont :

| Fichier | Sujet | Observation |
|---|---|---|
| `20260912000000_protect_identity_trust_system_fields.sql` | Protection des champs système profil/UDI | SQL brut ; modifie contraintes, privilèges, politiques et fonctions |
| `20260912001000_secure_mission_transitions.sql` | Transitions Mission | Fichier Markdown contenant un bloc SQL ; non exécutable tel quel par le CLI |
| `20260912002000_harden_sync_protocol.sql` | Reçus d'idempotence Sync | Crée notamment `sync_mutation_receipts` |
| `20260912003000_secure_hybrid_assistant.sql` | Quotas et cache Assistant | Crée `ai_requests`, `ai_cache`, `ai_cache_hits` et des RPC |
| `20260912004000_flash_public_projection.sql` | Projection publique Flash | Colonnes et fonctions de projection/recherche Flash |
| `20260912010000_secure_radar_lifecycle.sql` | Cycle de vie Radar | Crée `radars`, politiques et fonction `command_radar` |

Le fichier Mission contient un chemin de migration proposé dans son propre texte, mais cela ne constitue pas une preuve qu'il a été intégré ou exécuté.

### Drizzle

- `drizzle.config.ts` définit PostgreSQL, un schéma `./drizzle/schema.ts`, une sortie `./drizzle/migrations` et la variable `LOVABLE_DB_MIGRATION_URL`.
- `drizzle/schema.ts` est vide et porte un commentaire indiquant qu'il est volontairement vide.
- Le journal Drizzle référence trois entrées : `0000_flash_scan_public_functions`, `0001_create_radars_table`, `0002_create_sync_mutation_receipts`.
- Les scripts projet examinés ne déclarent pas de commande `drizzle-kit migrate` ou de runner Drizzle. Cela ne permet pas d'exclure une exécution manuelle ou externe.

## 3. Chevauchements et risques de double application

| Objet | Définitions repérées | Risque à lever |
|---|---|---|
| `radars` / `command_radar` | `supabase/migrations/20261113000000_radar_lifecycle.sql`, `src/supabase/migrations/20260912010000_secure_radar_lifecycle.sql` et Drizzle `0001_create_radars_table.sql` | La copie `src/supabase` est identique octet pour octet à la migration canonique Supabase (même blob Git `b637685d4044fbad3df11f21e076b40eb65f61fa`). La version Drizzle reprend les mêmes objets, mais n'est pas identique : elle ne comporte pas `BEGIN`/`COMMIT` et place l'activation RLS après les GRANT, alors que la migration Supabase active RLS avant les GRANT. Ne pas supprimer ni rejouer la version Drizzle avant vérification de son historique d'exécution externe. |
| `sync_mutation_receipts` | Drizzle `0002_create_sync_mutation_receipts.sql` et artefact `src/supabase/migrations/20260912002000_harden_sync_protocol.sql` | Deux définitions d'une table consommée par `src/lib/sync/transport.server.ts` ; vérifier contraintes, droits et politiques |
| Projection Flash/Scan | Drizzle `0000_flash_scan_public_functions.sql`, migrations Supabase `20261113002000_flash_schema_columns.sql` et `20261113003000_flash_public_rpcs.sql` | Divergence confirmée : Drizzle ajoute les coordonnées précises à `public.flashes` et les lit/écrit directement ; Supabase les isole dans `flash_private_locations`, utilisée par les RPC. Le pull Sync fait `.select("*")` sur les tables synchronisées. Ne pas rejouer la migration Drizzle ; voir TECH-011. |
| Champs profil/UDI et transitions Mission | Artefacts SQL sous `src/supabase/migrations/` | Les migrations standard initiales et les artefacts ultérieurs expriment des états de sécurité différents ; leur ordre d'application est déterminant |

Une copie directe de tous les fichiers vers `supabase/migrations/` n'est donc pas une correction acceptable. Elle pourrait provoquer des conflits, réappliquer des changements ou rendre les politiques et fonctions incohérentes.


### Détail de la divergence Flash/Scan

La migration Drizzle `0000_flash_scan_public_functions.sql` ajoute les coordonnées précises comme colonnes de `public.flashes`. Elle définit aussi une RPC Scan qui calcule une distance non arrondie à partir de ces colonnes et une RPC de localisation qui met à jour directement la ligne Flash.

Les migrations Supabase actuelles ont remplacé ce modèle par `flash_private_locations`. Les coordonnées sont lues par Scan à l'intérieur d'une fonction contrôlée, la RPC de localisation les écrit dans la table privée, et le résultat public ne renvoie que la distance arrondie à 0,1 km. Le rayon est validé et plafonné à 50 km. Cette séparation est particulièrement importante parce que le pull Sync lit les lignes synchronisées avec `.select("*")` dans `src/lib/sync/transport.server.ts`.

Les tests `121_flash_schema_columns.test.sql` et `122_flash_public_rpcs.test.sql` vérifient l'absence des coordonnées dans `public.flashes`, la protection RLS de la table privée et l'utilisation de celle-ci par les RPC. Il s'agit de preuves de la chaîne locale testée en CI, pas d'une preuve de l'état d'une base hébergée.

**Conséquence :** la migration Drizzle `0000` ne doit pas être rejouée ou réactivée sur un environnement utilisant le modèle Supabase actuel. L'existence éventuelle de colonnes, fonctions ou migrations déjà appliquées dans un environnement externe reste à vérifier en lecture seule.

## 4. Dépendances runtime confirmées

- `src/lib/sync/transport.server.ts` lit et écrit `sync_mutation_receipts` lors du push des mutations. La disponibilité de cette table est donc une dépendance runtime réelle du protocole de synchronisation.
- Le code Radar appelle `command_radar` et utilise la table `radars`. Ces objets sont maintenant définis dans la chaîne Supabase CLI par `20261113000000_radar_lifecycle.sql`, et le test RLS associé passe dans le workflow Quality de la PR #60. Cela valide la chaîne locale du dépôt, pas l'état d'une base distante.
- Le code Flash utilise des projections SQL publiques définies dans les artefacts hors chemin CLI. Leur disponibilité distante n'est pas établie par Git.
- Les voies Assistant documentées dépendent de fonctions et tables définies dans un artefact hors chemin CLI.

Ces dépendances ne doivent pas être présentées comme opérationnelles sur un environnement donné tant que leur schéma et leurs privilèges n'ont pas été vérifiés sur cet environnement.

## 5. Limite d'accès à la base distante

La tentative de lecture du statut de base associée au projet configuré a retourné `project_not_found`. Aucun accès SQL ou historique de migrations appliquées n'a été obtenu dans cette revue. En conséquence, les éléments suivants restent inconnus :

- les versions de migration enregistrées sur la base de développement, préproduction et production ;
- les tables, fonctions, triggers, index, grants et politiques RLS effectivement présents ;
- les éventuelles exécutions manuelles des artefacts Drizzle ou `src/supabase/migrations/` ;
- l'existence de divergences entre les environnements.

Aucune migration n'a été exécutée et aucun déploiement n'a été tenté.

## 6. Plan de réconciliation proposé

1. Obtenir un accès en lecture seule à chaque environnement concerné, ou un export de `supabase_migrations.schema_migrations` et du catalogue PostgreSQL.
2. Inventorier les versions enregistrées dans l'historique Supabase et, si elle existe, dans la table de suivi Drizzle.
3. Comparer le schéma réel aux migrations standard, puis comparer chaque objet candidat (tables, colonnes, fonctions, triggers, grants, RLS, index).
4. Déterminer pour chaque artefact s'il est : déjà appliqué, absent, partiellement appliqué, remplacé, ou obsolète.
5. Préparer uniquement des migrations Supabase additives et ordonnées pour les écarts prouvés. Ne pas rejouer les créations déjà présentes ; prévoir une stratégie explicite pour les fonctions et politiques à remplacer.
6. Extraire proprement le SQL du document Mission dans un fichier de migration seulement après comparaison de son contenu et de son historique.
7. Tester la chaîne complète sur une base locale jetable avec Supabase CLI et pgTAP ; vérifier aussi les parcours runtime concernés.
8. Après validation, mettre à jour les registres et les documents canoniques. La production reste hors périmètre sans autorisation de déploiement distincte.

## 7. Décision de cette étape

**Réconciliation Radar — état du dépôt :** la chaîne Supabase CLI est établie comme source canonique pour les nouveaux changements. La migration Radar et son test sont présents dans les chemins parcourus par le workflow CI. La copie `src/supabase` est strictement identique à la migration canonique ; le fichier Drizzle est un doublon fonctionnel proche, avec les différences de transaction et d'ordre RLS/GRANT décrites ci-dessus.

**Suppression physique du doublon Drizzle — bloquée par manque de preuve :** `drizzle/migrations/meta/_journal.json` référence toujours `0001_create_radars_table`, et `drizzle.config.ts` expose `LOVABLE_DB_MIGRATION_URL`. Aucun runner Drizzle n'a été trouvé dans les scripts npm ou workflows versionnés, mais une exécution manuelle ou un pipeline externe n'est pas exclu. Sans historique de migration et catalogue de la base cible, retirer le fichier ou son entrée de journal pourrait effacer une trace encore nécessaire ou désynchroniser un environnement.

**TECH-001 reste ouvert** pour la réconciliation complète des environnements distants et des autres artefacts. Aucun fichier SQL historique n'a été déplacé, supprimé, converti ou exécuté. Aucun changement de schéma distant n'a été effectué.
