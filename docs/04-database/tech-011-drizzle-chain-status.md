# TECH-011 — Statut de la chaîne Drizzle

**État :** chaîne non opérationnelle dans le dépôt, usage historique ou externe non vérifié.  
**Référence examinée :** `main`, commit `e0688fa608bf7dbf81b0a130f9bf44830af135ab`.  
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

Cette revue confirme l'absence de runner Drizzle dans les scripts et workflows versionnés examinés. Elle ne permet pas d'exclure un usage historique manuel ou un processus externe non versionné.

- Aucune migration Drizzle n'a été générée ou exécutée.
- Aucun test PostgreSQL n'a été lancé dans le cadre de cette revue.
- Aucune base distante n'a été consultée ou modifiée.
- Aucun artefact Drizzle historique n'a été supprimé.
- La chaîne Supabase CLI reste la référence pour les nouveaux changements.

**Conclusion :** l'ambiguïté de gouvernance de Drizzle est résolue au niveau du dépôt par une règle explicite de gel et de non-utilisation pour les nouveaux travaux. La suppression physique des artefacts et la confirmation de leur historique restent conditionnées à une vérification des environnements externes.
