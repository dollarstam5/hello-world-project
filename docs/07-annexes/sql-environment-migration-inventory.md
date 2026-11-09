# Inventaire des migrations SQL par environnement

**Projet :** Vitalis  
**Lot :** A — chantier 0  
**Branche :** `reconcile/lot-a-2026-11`  
**Référence Git examinée :** commit `6489bfa335002815d9d653c7e098d78b93813e22`  
**Mode :** lecture seule  
**État :** inventaire statique du dépôt réalisé ; historique des bases distantes non accessible à cette passe.

---

## 1. Résumé exécutif

Le dépôt contient trois ensembles de migrations distincts :

| Chaîne | Chemin | Fichiers SQL | Journal / configuration | Découverte par Supabase CLI démontrée ? |
|---|---|---:|---|---|
| Supabase racine | `supabase/migrations/` | 3 | `supabase/config.toml` | Oui, chemin standard |
| Supabase sous source | `src/supabase/migrations/` | 6 | Aucun journal/config dédiée identifié | Non |
| Drizzle | `drizzle/migrations/` | 3 | `drizzle/migrations/meta/_journal.json`, `drizzle.config.ts` | Non, chaîne Drizzle séparée |

Le journal Drizzle déclare trois entrées, correspondant aux trois fichiers SQL présents. Le schéma Drizzle (`drizzle/schema.ts`) est volontairement vide. Il ne décrit donc pas, à lui seul, le schéma complet de Vitalis.

Le fichier `supabase/config.toml` ne contient que `project_id`. Le dépôt ne fournit pas de configuration explicite qui ferait de `src/supabase/migrations/` le répertoire de migrations Supabase CLI.

Le fichier `.env.example` ne contient que des URL et clés factices / placeholders. Aucun accès effectif aux environnements distants, aucun historique de déploiement et aucune sortie de `supabase migration list --linked` n'ont été fournis ou consultés pendant cette passe.

**Conclusion :** l'inventaire Git est établi ; l'état « appliquée / non appliquée » sur chaque base reste inconnu. Aucun fichier SQL n'a été appliqué ni modifié.

---

## 2. Inventaire exact des fichiers dans Git

### 2.1 Supabase — chemin standard

| Fichier | SHA blob Git | Statut d'application |
|---|---|---|
| `supabase/migrations/20260826014443_34be03fd-4919-4cb4-9e11-76cf1df6bc73.sql` | `7a7ef6c064a930f82b8c5ca1197697d58e5da02e` | Inconnu |
| `supabase/migrations/20260827015340_3d7abfad-99ae-4fb5-9c02-60b6d4bd5103.sql` | `fac811ede1a58cbb4fc5b1847d4f22b9ce232cb8` | Inconnu |
| `supabase/migrations/20260827015418_ae5d6640-be69-4fd8-aed5-7f0d6c1426e4.sql` | `cc2a42681b3a9e0a2d3402d3a6ddb5916a4e150a` | Inconnu |

### 2.2 Supabase — chemin non standard sous src

| Fichier | SHA blob Git | Statut d'application |
|---|---|---|
| `src/supabase/migrations/20260912000000_protect_identity_trust_system_fields.sql` | `5c2ed571b80c16035fc1b3cb36a755311b1f3f72` | Inconnu |
| `src/supabase/migrations/20260912001000_secure_mission_transitions.sql` | `bdc062eb206e790577c0443572027f18ecbc8fec` | Inconnu — fichier mal formé |
| `src/supabase/migrations/20260912002000_harden_sync_protocol.sql` | `2959462ce8398f08737997caa677eb4ea4c10bec` | Inconnu |
| `src/supabase/migrations/20260912003000_secure_hybrid_assistant.sql` | `f2897b2955501cefb3be9e9164c9784fffa38748` | Inconnu |
| `src/supabase/migrations/20260912009000_secure_public_flash_feed.sql` | `0e1ca96a4df004376ffcb5875a8180eadc23cbb6` | Inconnu |
| `src/supabase/migrations/20260912010000_secure_radar_lifecycle.sql` | `b637685d4044fbad3df11f21e076b40eb65f61fa` | Inconnu |

**Attention :** le fichier Missions contient du Markdown autour du SQL. Son existence sous ce chemin ne permet pas de conclure qu'une migration équivalente a été appliquée ailleurs.

### 2.3 Drizzle

| Fichier | SHA blob Git | Entrée du journal | Statut d'application |
|---|---|---|---|
| `drizzle/migrations/0000_flash_scan_public_functions.sql` | `724944a27f05ac1bc3a6a4d8cfff55d97f4cb570` | idx 0 — tag correspondant | Inconnu |
| `drizzle/migrations/0001_create_radars_table.sql` | `7aab522e069f39007e41c8492e92cf4fbf840569` | idx 1 — tag correspondant | Inconnu |
| `drizzle/migrations/0002_create_sync_mutation_receipts.sql` | `fadbf7059ac5f4257c48632580e90ec65d79a214` | idx 2 — tag correspondant | Inconnu |

Journal : `drizzle/migrations/meta/_journal.json`  
Schéma Drizzle : `drizzle/schema.ts` (commentaire indiquant qu'il est volontairement vide).

Les timestamps du journal sont des métadonnées de génération ; ils ne constituent pas une preuve de date d'application sur un environnement.

---

## 3. Configuration et indices d'environnement

| Source | Observation | Ce que cela prouve | Ce que cela ne prouve pas |
|---|---|---|---|
| `supabase/config.toml` | Un seul `project_id` | Le projet Supabase configuré localement dans ce fichier | Que ce projet soit dev, staging ou production ; que les migrations récentes y soient appliquées |
| `.env.example` | URL/clefs placeholders | Les noms de variables attendues par l'application | Une connexion active ou les valeurs des environnements |
| `drizzle.config.ts` | URL lue via `LOVABLE_DB_MIGRATION_URL` | Drizzle utilise une connexion PostgreSQL dédiée à la migration | Quel environnement cette URL cible, ou si elle a été utilisée |
| `README.md` | Instructions génériques Lovable / développement | Mode de développement général | Une procédure de déploiement SQL vérifiable |
| `PRODUCTION_CHECKLIST.md` | Migration DB à tester : case non cochée | La checklist ne déclare pas la validation de migration terminée | Que rien n'ait été déployé en dehors de cette checklist |

Aucune valeur secrète n'a été recherchée, affichée ou demandée. Ne jamais envoyer une clé service_role, un mot de passe DB ou une chaîne de connexion dans une conversation.

---

## 4. CI : ce qu'elle fait et ne fait pas

Fichier : `.github/workflows/quality.yml`

Le workflow :
1. installe Bun et Supabase CLI ;
2. installe les dépendances ;
3. démarre Supabase localement ;
4. lance `bun run check:db-tests` ;
5. lance `bun run test:db` ;
6. arrête Supabase ;
7. poursuit les contrôles release et E2E.

Dans `package.json` :
- `test:db` exécute `supabase test db` ;
- `check:db-tests` ne cherche que sous `supabase/tests/database` ;
- aucun script d'application/inspection Drizzle n'est déclaré dans les scripts examinés.

Ainsi, le workflow CI ne démontre pas l'application des six fichiers `src/supabase/migrations/` ni l'exécution des deux tests SQL sous `src/supabase/tests/database/`. Il démontre uniquement qu'une suite locale Supabase racine est prévue par le workflow. Pour prouver qu'elle a réussi sur un commit donné, il faut le run CI correspondant et ses logs.

---

## 5. Registre d'état par environnement — à compléter avec preuves

À cette date, aucune sortie d'historique distant n'est disponible. Les cases ne doivent pas être interprétées comme « non appliqué ».

| Environnement | Projet / DB identifié ? | Historique Supabase | Historique Drizzle | Commit déployé | Preuve collectée |
|---|---|---|---|---|---|
| Développement local | Non renseigné | Inconnu | Inconnu | Inconnu | Aucune |
| Développement distant | Non renseigné | Inconnu | Inconnu | Inconnu | Aucune |
| Staging / préproduction | Non renseigné | Inconnu | Inconnu | Inconnu | Aucune |
| Production | Non renseigné | Inconnu | Inconnu | Inconnu | Aucune |

Pour chaque environnement, le registre final devra contenir :
- nom d'environnement et identifiant de projet non secret ;
- branche/commit déployé ;
- versions PostgreSQL et Supabase CLI pertinentes ;
- versions exactes de migrations Supabase appliquées ;
- historique Drizzle, si cette chaîne a réellement été utilisée ;
- date et source de la preuve (sortie CLI ou requête SELECT) ;
- anomalies entre historique distant, fichiers Git et journaux de déploiement.

Ne pas fusionner staging et production dans une seule ligne, même si elles partagent actuellement un projet supposé.

---

## 6. Collecte distante recommandée — strictement en lecture seule

### Option A — Supabase CLI

Depuis un environnement déjà authentifié et lié au bon projet, exécuter :

```bash
supabase migration list --linked
```

Cette commande sert à comparer l'historique local et distant. Ne pas exécuter `db push`, `migration up`, `migration repair`, `db reset` ou une commande d'application/réparation pendant le chantier 0.

Collecter séparément la sortie pour chaque projet/environnement. Masquer toute information d'identification sensible avant partage.

### Option B — requête SQL en lecture seule

Dans le SQL Editor Supabase, avec un rôle qui dispose uniquement des droits SELECT nécessaires, commencer par inspecter l'existence et la structure des tables d'historique :

```sql
SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_schema IN ('supabase_migrations', 'drizzle')
ORDER BY table_schema, table_name;
```

Si la table Supabase standard existe, lire son historique :

```sql
SELECT *
FROM supabase_migrations.schema_migrations
ORDER BY version;
```

Si Drizzle a effectivement appliqué ses migrations et que sa table d'historique existe, inspecter d'abord ses colonnes puis lire les métadonnées disponibles :

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'drizzle'
  AND table_name = '__drizzle_migrations'
ORDER BY ordinal_position;
```

Puis, uniquement si la table et les colonnes attendues existent :

```sql
SELECT *
FROM drizzle.__drizzle_migrations
ORDER BY created_at;
```

Ces requêtes ne doivent être lancées qu'après confirmation des noms de schémas/tables et avec un rôle de lecture seule. Si une table n'existe pas, consigner « historique absent/non détecté » et non « aucune migration appliquée » sans corroboration.

### Option C — preuves de déploiement

Compléter les historiques par :
- logs de déploiement Supabase/Lovable ;
- commit/PR associé à chaque livraison ;
- export ou snapshot de schéma, si disponible ;
- tickets de déploiement et dates de release.

Les journaux Git ne prouvent pas l'application effective d'une migration sur une base.

---

## 7. Tableau de rapprochement à produire après collecte

| Version / tag | Fichier Git attendu | Présent dans Supabase distant ? | Présent dans Drizzle distant ? | Hash / contenu rapproché ? | Environnement | Décision |
|---|---|---|---|---|---|---|
| 20260826014443 | Migration Supabase historique 1 | À collecter | Sans objet | À comparer | À préciser | En attente |
| 20260827015340 | Migration Supabase historique 2 | À collecter | Sans objet | À comparer | À préciser | En attente |
| 20260827015418 | Migration Supabase historique 3 | À collecter | Sans objet | À comparer | À préciser | En attente |
| 0000 | Flash/Scan Drizzle | Sans objet | À collecter | À comparer | À préciser | En attente |
| 0001 | Radar Drizzle | Sans objet | À collecter | À comparer | À préciser | En attente |
| 0002 | Sync receipts Drizzle | Sans objet | À collecter | À comparer | À préciser | En attente |
| 20260912000000 | Identity/Trust | À collecter | Sans objet | Source alternative à rechercher | À préciser | En attente |
| 20260912001000 | Missions | À collecter | Sans objet | Source brute à authentifier | À préciser | Bloqué |
| 20260912002000 | Sync protocol | À collecter | Sans objet | À comparer | À préciser | En attente |
| 20260912003000 | Hybrid assistant | À collecter | Sans objet | À comparer | À préciser | En attente |
| 20260912009000 | Public Flash feed | À collecter | Sans objet | À comparer | À préciser | En attente |
| 20260912010000 | Radar lifecycle | À collecter | Sans objet | À comparer | À préciser | En attente |

Ne pas conclure qu'une migration a été appliquée uniquement parce qu'une table ou une fonction qu'elle crée existe : ces objets peuvent provenir d'une autre migration, d'une opération manuelle ou d'un déploiement antérieur.

---

## 8. Critères de sortie du chantier 0

Le chantier 0 ne sera déclaré terminé que lorsque :

- chaque environnement réel est identifié séparément ;
- les historiques Supabase et Drizzle ont été collectés ou leur absence a été démontrée ;
- chaque entrée distante est rapprochée d'un fichier Git et d'un commit ;
- les divergences d'historique, versions manquantes et migrations modifiées après application sont identifiées ;
- les migrations non standard sous `src/` ont un statut vérifié, pas supposé ;
- les résultats sont datés et reproductibles ;
- aucune commande d'application ou de réparation n'a été exécutée pendant la collecte.

**Statut actuel : PARTIEL.** Inventaire statique Git terminé. Inventaire des environnements distants en attente d'un accès de lecture seule ou de sorties de commandes fournies par l'administrateur du projet.

## 9. Prochaine action

Fournir, pour chaque environnement, la sortie expurgée de `supabase migration list --linked` et, si Drizzle a été utilisé, les métadonnées de sa table d'historique. Ne transmettre aucune clé, aucun mot de passe et aucune URL contenant des identifiants. Une fois ces preuves disponibles, compléter le tableau de rapprochement avant toute remédiation.
