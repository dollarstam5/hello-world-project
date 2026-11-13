# TECH-011 — Statut de la chaîne Drizzle

**État :** configuration et artefacts Drizzle présents ; aucun runner d'exécution versionné identifié ; usage historique, manuel ou externe non vérifié.  
**Référence examinée :** `main`, commit `8cb601309fe089d2c742140a95d564d45c50e63c` (après fusion de la PR #70).  
**Périmètre :** fichiers versionnés, configuration, dépendances, scripts, workflows et références applicatives.  
**Aucune commande Drizzle n'a été exécutée. Aucun SQL n'a été appliqué.**

## 1. Décision

Pour les nouvelles évolutions Vitalis, **Supabase CLI et `supabase/migrations/` constituent la seule chaîne de migration de référence du dépôt**.

La chaîne Drizzle est classée **historique / non confirmée / gelée** :

- ne pas générer de migration avec Drizzle ;
- ne pas lancer `drizzle-kit migrate`, `push` ou toute autre commande Drizzle sur une base ;
- ne pas ajouter de nouveaux objets SQL dans `drizzle/migrations/` ;
- ne pas considérer le journal Drizzle comme une preuve d'application des migrations ;
- ne pas supprimer les anciens fichiers tant que leur historique d'exécution externe ou distant n'a pas été vérifié.

Cette décision clarifie le fonctionnement attendu du dépôt sans prétendre connaître l'état d'une base hébergée.

## 2. Constat vérifié dans le dépôt

| Élément | Constat |
|---|---|
| `drizzle/schema.ts` | Fichier volontairement vide ; commentaire « auto-generated and intentionally left blank » |
| `drizzle.config.ts` | Configure PostgreSQL, le schéma vide, le dossier `drizzle/migrations` et `LOVABLE_DB_MIGRATION_URL` |
| `drizzle/migrations/meta/_journal.json` | Référence trois entrées : Flash/Scan, Radar et reçus Sync |
| `package.json` | `drizzle-kit` et `drizzle-orm` sont dans `devDependencies`, pas dans `dependencies` |
| Scripts npm | Aucun script Drizzle déclaré ; aucun `drizzle-kit migrate` ou runner Drizzle explicite |
| Code applicatif | La recherche des références `drizzle-orm`, `drizzle-kit` et `LOVABLE_DB_MIGRATION_URL` ne révèle aucun import runtime ou appel applicatif ; les occurrences trouvées concernent la configuration, les dépendances et le lockfile |
| GitHub Actions | Le workflow qualité lance Supabase CLI pour les tests DB ; aucune étape Drizzle n'est déclarée |

Le journal contient des métadonnées de migrations. Ces métadonnées décrivent les fichiers connus de Drizzle ; elles ne démontrent ni qu'un runner a été utilisé, ni qu'une migration a été appliquée sur un environnement.

## 3. Pourquoi le schéma vide n'est pas à remplir artificiellement

Le schéma TypeScript vide est explicitement intentionnel. Ajouter des tables uniquement pour faire disparaître ce vide créerait une deuxième représentation du schéma PostgreSQL, alors que :

- les migrations canoniques du dépôt sont gérées par Supabase CLI ;
- les migrations Drizzle historiques recoupent des objets déjà présents dans d'autres sources ;
- aucune utilisation runtime de Drizzle n'a été identifiée ;
- l'état réel des environnements distants n'est pas disponible.

Une génération depuis ce schéma vide pourrait produire un état incomplet ou des opérations destructrices si elle était utilisée avec un outil de synchronisation de schéma. Il ne faut donc pas essayer de « réparer » le fichier en y recopiant les tables du SQL.



### Divergence Flash/Scan : risque de réexposition des coordonnées précises

La migration Drizzle `0000_flash_scan_public_functions.sql` n'est pas une simple copie de la chaîne Supabase actuelle :

- elle ajoute `latitude`, `longitude` et `accuracy_meters` directement à `public.flashes` ;
- sa fonction `set_flash_location` écrit ces coordonnées directement dans cette table ;
- sa fonction `scan_public_flashes` calcule la distance à partir de ces colonnes et retourne une distance non arrondie ; elle ne reprend pas les validations de coordonnées et le plafond de rayon de la version Supabase actuelle ;
- sa projection publique et ses règles de filtrage ne sont pas identiques aux RPC Supabase actuelles.

La chaîne Supabase actuelle a pris une décision de confidentialité différente :

- `20261113002000_flash_schema_columns.sql` crée `public.flash_private_locations`, active RLS et n'accorde aux membres authentifiés qu'un SELECT soumis à la politique propriétaire ; les coordonnées ne sont pas des colonnes de `public.flashes` ;
- `20261113003000_flash_public_rpcs.sql` fait lire/écrire les coordonnées par les RPC via la table privée, valide les coordonnées et le rayon (maximum 50 km), et retourne une distance arrondie à 0,1 km ;
- `src/lib/sync/transport.server.ts` utilise `.select("*")` lors du pull Sync. Des coordonnées ajoutées à `public.flashes` entreraient donc dans les lignes lues par ce transport, sous réserve des privilèges/RLS de l'environnement.

Les tests PostgreSQL versionnés rendent cette frontière explicite : `121_flash_schema_columns.test.sql` vérifie l'absence des trois colonnes précises dans `flashes` et la protection de la table privée ; `122_flash_public_rpcs.test.sql` vérifie que Scan et l'écriture de position utilisent `flash_private_locations` et n'exposent pas les coordonnées.

**Décision de sécurité :** ne jamais rejouer ni réactiver `0000_flash_scan_public_functions.sql` sur un environnement utilisant la chaîne Supabase actuelle. Toute décision sur son historique exige d'abord un relevé en lecture seule du schéma, des fonctions, privilèges, politiques et de l'historique de migration de l'environnement. Cette divergence ne prouve pas que les coordonnées ont été exposées sur une base hébergée ; cet état reste inconnu.

**Limite importante de la migration actuelle :** `20261113002000_flash_schema_columns.sql` crée `flash_private_locations`, mais ne supprime pas explicitement les colonnes `latitude`, `longitude` et `accuracy_meters` si elles existaient déjà dans `public.flashes`. Le test `121_flash_schema_columns.test.sql` vérifie leur absence dans la base locale construite par la chaîne Supabase ; il ne simule pas une base préalablement modifiée par Drizzle `0000`. Si cette ancienne migration a été appliquée sur un environnement, les colonnes peuvent donc y subsister malgré la création de la table privée. Il faut contrôler leur présence en lecture seule dans chaque environnement avant de conclure que la séparation des coordonnées y est effective.

## 4. Artefacts conservés

Les éléments suivants restent volontairement en place :

- `drizzle.config.ts` ;
- `drizzle/schema.ts` ;
- `drizzle/migrations/0000_flash_scan_public_functions.sql` ;
- `drizzle/migrations/0001_create_radars_table.sql` ;
- `drizzle/migrations/0002_create_sync_mutation_receipts.sql` ;
- `drizzle/migrations/meta/_journal.json` ;
- les dépendances Drizzle et leurs entrées dans le lockfile.

Leur présence peut être utile pour reconstituer l'historique d'un environnement ou d'un processus Lovable externe. Les retirer sans cette preuve serait prématuré.

## 5. Conditions avant toute suppression ou réactivation

Une décision ultérieure de suppression ou de réactivation exige les éléments suivants :

1. obtenir l'historique de migration et le catalogue de chaque base concernée, ou une confirmation documentée de l'équipe qui a opéré le déploiement ;
2. vérifier si un pipeline Lovable, une automatisation externe ou une opération manuelle a utilisé `drizzle.config.ts` ou `LOVABLE_DB_MIGRATION_URL` ;
3. comparer les trois migrations Drizzle aux migrations Supabase canoniques et aux objets réellement présents ;
4. vérifier qu'aucun environnement ne dépend encore du journal ou de ces fichiers ;
5. faire approuver séparément toute suppression, réactivation ou modification de schéma.

En l'absence de ces preuves, le gel documentaire reste la seule décision sûre.

## 6. Validation et limites

Cette revue confirme la présence de la configuration, du journal et des trois scripts Drizzle, mais n'identifie aucun runner Drizzle dans les scripts npm ni dans le workflow qualité versionné examiné. Elle ne permet pas d'exclure un usage historique manuel ou un processus externe non versionné. La migration Flash/Scan Drizzle présente en outre une divergence de confidentialité substantielle avec les migrations Supabase actuelles.

- Aucune migration Drizzle n'a été générée ou exécutée.
- Aucun test PostgreSQL n'a été lancé dans le cadre de cette revue.
- Aucune base distante n'a été consultée ou modifiée.
- Aucun artefact Drizzle historique n'a été supprimé.
- La chaîne Supabase CLI reste la référence pour les nouveaux changements.

**Conclusion :** la règle de gouvernance du dépôt est claire pour les nouveaux travaux : Supabase CLI est la chaîne de référence et Drizzle reste gelé. L'usage réel passé de Drizzle et l'état des environnements restent non établis. La migration Flash/Scan Drizzle est incompatible avec la frontière de confidentialité de la chaîne Supabase actuelle et ne doit pas être rejouée. La suppression physique des artefacts et toute conclusion sur leur historique restent conditionnées à une vérification en lecture seule des environnements externes.
