# Plan de remédiation SQL — fichier par fichier

**Projet :** Vitalis  
**Lot :** A — réconciliation SQL approfondie  
**Branche de préparation :** `reconcile/lot-a-2026-11`  
**État :** plan documentaire, aucune remédiation SQL exécutée  
**Référence de l'audit :** Vague 7 du document `foundation-required-path-reconciliation.md`

---

## 1. Objectif et règles de sécurité

Ce plan transforme les constats de l'audit en tâches vérifiables, sans présumer de l'état des bases déjà déployées.

Règles impératives :

1. Ne pas déplacer, renommer, supprimer ou rejouer une migration avant d'avoir récupéré l'historique réel des bases staging/production et les journaux de déploiement.
2. Ne pas considérer le dossier Git comme une preuve de ce qui est déjà appliqué sur une base.
3. Ne pas exécuter simultanément les chaînes Supabase et Drizzle sur une même base avant d'avoir établi leurs responsabilités et leur ordre.
4. Ne pas modifier une migration déjà appliquée sur un environnement partagé. Préparer une migration corrective additive, avec procédure de déploiement et de retour arrière adaptée.
5. Ne pas affaiblir une politique RLS ni supprimer une assertion pour obtenir un résultat vert.
6. Chaque correction doit être livrée dans une branche/PR, avec tests et preuves, puis soumise à validation avant fusion dans `main`.
7. Les migrations doivent être testées sur une base locale vierge et sur une base de mise à niveau représentative. Une réussite sur base vierge ne prouve pas la sûreté d'une mise à niveau.

## 2. Ordre général des travaux

| Ordre | Priorité | Chantier | Condition de démarrage |
|---:|---|---|---|
| 0 | P0 | Inventaire des environnements et migrations appliquées | Accès lecture seule aux historiques staging/production et journaux |
| 1 | P0 | Décision de chaîne canonique et responsabilités Supabase/Drizzle | Inventaire terminé |
| 2 | P0 | Réparation contrôlée de la migration Missions mal formée | Version SQL source authentifiée et historique vérifié |
| 3 | P0 | Résolution de la double définition Radar | Chaîne canonique décidée |
| 4 | P1 | Convergence des reçus de synchronisation Radar | Contrat sync et chaîne canonique décidés |
| 5 | P1 | Dépendances Flash/Scan et ordre des migrations | Inventaire du schéma de base confirmé |
| 6 | P1 | Alignement des politiques Profile/UDI/Missions | Schéma final et règles métier approuvés |
| 7 | P1 | Tests SQL dédiés Scan, sync et assistant | Contrats de sécurité approuvés |
| 8 | P2 | Raccordement des tests SQL à la CI | Chemins canoniques et suites identifiés |
| 9 | P2 | Vérification vierge + mise à niveau + preuve CI | Chantiers précédents terminés |

**Dépendance majeure :** les chantiers 2 à 8 ne doivent pas fabriquer une seconde chaîne concurrente. Le choix de la source de vérité précède les déplacements ou réécritures de fichiers.

---

## 3. Inventaire et gouvernance — fichiers de configuration

### 3.1 `supabase/config.toml`

**Constat :** le fichier ne déclare que `project_id`. Aucun chemin personnalisé vers `src/supabase/migrations` ou `src/supabase/tests/database` n'a été observé.

**Remédiation proposée :**
- Décider si Supabase CLI doit utiliser les emplacements standards `supabase/migrations` et `supabase/tests/database`.
- Si oui, conserver ces emplacements comme source d'exécution et organiser les autres sources comme archives/documentation ou les migrer de façon contrôlée après vérification.
- Si un chemin personnalisé est réellement souhaité, vérifier qu'il est supporté par la version de CLI utilisée, le déclarer explicitement et tester la découverte des migrations et tests.
- Documenter la règle dans une page de gouvernance SQL.

**Tests / preuves :**
- Afficher la configuration effective de la CLI dans CI.
- Vérifier la liste exacte des migrations détectées.
- Vérifier la liste exacte des tests SQL exécutés.
- Une base locale neuve doit recevoir la chaîne attendue, dans l'ordre attendu.

**Critère d'acceptation :** un seul chemin d'exécution documenté et démontré ; aucun fichier SQL actif n'est ignoré silencieusement.

### 3.2 `drizzle.config.ts`

**Constat :** Drizzle pointe sur `drizzle/schema.ts` et écrit ses migrations dans `drizzle/migrations`. Le fichier utilise `LOVABLE_DB_MIGRATION_URL`.

**Remédiation proposée :**
- Clarifier si Drizzle est propriétaire du schéma/génération, de l'application des migrations, ou uniquement d'une partie du modèle.
- Documenter la séparation de responsabilité avec Supabase CLI.
- Si Drizzle reste un générateur, documenter comment les SQL générés sont revus puis intégrés à la chaîne canonique.
- Interdire qu'une même table soit créée indépendamment dans les deux chaînes sans mécanisme explicite de convergence.

**Tests / preuves :**
- Commandes de génération et de vérification déterministes.
- Comparaison du schéma Drizzle avec le schéma SQL canonique.
- Contrôle CI signalant une dérive non approuvée.

**Critère d'acceptation :** un développeur sait quelle commande génère, quelle commande applique, et quel outil fait autorité.

### 3.3 `drizzle/migrations/meta/_journal.json`

**Constat :** le journal Drizzle déclare les entrées 0000, 0001 et 0002. Ce journal ne constitue pas le registre des migrations Supabase.

**Remédiation proposée :**
- Conserver le journal correspondant aux migrations Drizzle tant que la chaîne Drizzle reste utilisée.
- Vérifier que chaque entrée référence un fichier présent et que l'ordre est cohérent.
- Déterminer si les migrations ont déjà été appliquées sur une base réelle.
- Ne jamais supprimer une entrée pour masquer une migration divergente.

**Tests / preuves :** contrôle automatique journal/fichiers, ordre, doublons, migration manquante et état d'application sur base de test.

**Critère d'acceptation :** aucune entrée orpheline, aucun fichier non enregistré et historique d'application documenté.

### 3.4 `package.json`

**Constat :** `test:db` exécute `supabase test db`; `check:db-tests` ne vérifie que la présence d'au moins un `*.test.sql` sous `supabase/tests/database`.

**Remédiation proposée :**
- Remplacer le contrôle de présence minimale par un contrôle de découverte de l'ensemble des suites SQL canoniques.
- Vérifier que les migrations actives et les tests ciblés sont situés dans les chemins réellement lus par la CLI.
- Ajouter des scripts explicites pour lint/validation SQL, tests RLS, tests d'intégration de migrations et vérification du journal.
- Éviter les commandes qui donnent un statut vert sans exécuter les tests concernés.

**Tests / preuves :** exécution locale des scripts, journal de commandes CI et échec volontaire sur migration mal formée ou test manquant.

**Critère d'acceptation :** les scripts de contrôle reflètent les tests réellement exécutés, pas uniquement la présence de fichiers.

### 3.5 `.github/workflows/quality.yml`

**Constat :** le workflow démarre Supabase, exécute `check:db-tests` et `test:db`, puis arrête Supabase. Les suites SQL sous `src/supabase/tests/database` ne sont pas démontrées comme découvertes par cette commande.

**Remédiation proposée :**
- Faire échouer le job si une migration canonique est invalide ou non enregistrée.
- Exécuter toutes les suites pgTAP canoniques.
- Séparer les étapes : démarrage, application des migrations, vérification de l'état, exécution des tests, collecte des journaux, arrêt garanti même en cas d'échec.
- Publier les versions Supabase CLI/PostgreSQL et la liste des migrations appliquées.
- Ajouter un job de mise à niveau depuis un schéma de départ représentatif, en plus du test base vierge.

**Tests / preuves :** run CI vert avec liste des migrations, liste des suites, assertions exécutées et version des outils.

**Critère d'acceptation :** aucun test RLS requis n'est omis et les logs permettent de reproduire le résultat.

---

## 4. Migrations SQL — traitement fichier par fichier

### 4.1 Migrations Supabase historiques sous `supabase/migrations/`

#### `20260826014443_34be03fd-4919-4cb4-9e11-76cf1df6bc73.sql`

**Rôle observé :** fondations des rôles, profils, UDI, médias, Flash et autres objets centraux, avec RLS, triggers et fonctions.

**Remédiation proposée :**
- Ne pas réécrire cette migration si elle a déjà été appliquée.
- Cartographier chaque table, fonction, trigger, privilège et politique qu'elle crée.
- Comparer l'état initial avec les migrations correctives ultérieures, notamment identité et missions.
- Vérifier les politiques permissives et restrictives combinées, les opérations CRUD, les rôles anon/authenticated/service_role et les fonctions SECURITY DEFINER.
- Ajouter des tests positifs et négatifs par table.

**Tests requis :** utilisateur A ne lit/modifie pas les données privées de B ; accès public uniquement aux projections explicitement publiques ; service_role distinct ; champs système non modifiables par le client.

**Critère d'acceptation :** matrice objet × rôle × opération documentée et couverte par tests.

#### `20260827015340_3d7abfad-99ae-4fb5-9c02-60b6d4bd5103.sql`

**Rôle observé :** révocation et attribution de privilèges EXECUTE sur les fonctions `handle_new_user`, `has_role` et `assign_sync_revision`.

**Remédiation proposée :**
- Vérifier les privilèges effectifs après application de toutes les migrations.
- Vérifier les appels légitimes par les triggers et fonctions internes.
- Confirmer qu'aucun rôle public/anon ne peut appeler les fonctions privilégiées directement.
- Vérifier les `search_path` des fonctions SECURITY DEFINER.

**Tests requis :** inspection des privilèges, appels autorisés/refusés par rôle, provisionnement utilisateur et mise à jour de révision.

**Critère d'acceptation :** privilèges minimaux démontrés sans casser les triggers.

#### `20260827015418_ae5d6640-be69-4fd8-aed5-7f0d6c1426e4.sql`

**Rôle observé :** politiques Storage pour les buckets avatars et media.

**Remédiation proposée :**
- Vérifier que les buckets sont créés/configurés dans la chaîne effective.
- Vérifier les chemins de stockage par propriétaire, la lecture des avatars, la confidentialité stricte des médias et les opérations update/delete.
- Tester les noms de dossiers malformés et les accès croisés entre membres.
- Vérifier qu'aucune politique Storage permissive héritée ne contourne ces règles.

**Tests requis :** A peut gérer son média ; A ne peut ni lire ni modifier le média privé de B ; règles avatars conformes au niveau de visibilité approuvé.

**Critère d'acceptation :** matrice Storage propriétaire/non-propriétaire testée.

### 4.2 Migrations sous `src/supabase/migrations/`

> Ces fichiers ne sont pas considérés comme appliqués par Supabase CLI tant que leur raccordement à la chaîne effective n'est pas prouvé.

#### `20260912000000_protect_identity_trust_system_fields.sql`

**Rôle observé :** protection des champs système Profile/UDI et provisionnement d'identité.

**Remédiation proposée :**
- Vérifier le comportement final des politiques Profile/UDI par rapport aux politiques initiales.
- Documenter les champs modifiables par le propriétaire et ceux réservés au serveur.
- Vérifier le rôle administrateur et ses limites.
- Aligner les tests transversaux qui attendent encore les anciens noms de politiques.
- Ajouter des tests sur l'impossibilité de modifier trust score, niveau vérifié, timestamps et autres champs système.

**Tests requis :** lecture autorisée, insert/update autorisés dans les limites prévues, falsification de champs système refusée, accès croisé refusé.

**Critère d'acceptation :** règles d'identité et de confiance cohérentes avec les décisions produit et les contrats.

#### `20260912001000_secure_mission_transitions.sql`

<badge>Blocage P0</badge>

**Anomalie :** le fichier commence par du Markdown et contient le SQL dans un bloc de code. Il n'est pas un fichier SQL brut exécutable dans son état versionné.

**Remédiation proposée :**
1. Retrouver la source approuvée de la migration, son historique et son éventuel équivalent déjà appliqué.
2. Comparer les contenus et vérifier le hash / commit source.
3. Si elle n'a jamais été appliquée, préparer une version SQL brute dans la chaîne canonique.
4. Si elle a déjà été appliquée, ne pas réécrire l'historique ; préparer une migration corrective additive uniquement si nécessaire.
5. Vérifier toutes les transitions, rôles, triggers, privilèges et politiques RLS avant application.

**Tests requis :** machine d'états complète ; transitions autorisées et interdites ; auteur/assigné/tiers ; champs protégés ; concurrence et double commande ; audit de transition.

**Critère d'acceptation :** migration source authentifiée, chaîne d'application déterminée, tests pgTAP positifs/négatifs passants.

#### `20260912002000_harden_sync_protocol.sql`

**Anomalie :** la contrainte `logical_table` n'inclut pas `radars`, contrairement à Drizzle 0002.

**Remédiation proposée :**
- Confirmer si Radar est bien un objet synchronisé en V1.
- Si oui, préparer une migration additive qui étend la contrainte et vérifie les autorisations de propriétaire.
- Définir l'idempotence des reçus : même mutation rejouée, même résultat, aucune double application.
- Définir la politique de rétention des reçus sans supprimer les garanties anti-rejeu.
- Ne pas modifier directement ce fichier si déjà appliqué.

**Tests requis :** table autorisée/interdite, propriétaire A/B, rejeu même mutation, collision d'identifiant, mutation expirée, payload invalide, type Radar.

**Critère d'acceptation :** contrat client, contrainte SQL, transport et tests utilisent la même liste de tables.

#### `20260912003000_secure_hybrid_assistant.sql`

**Rôle observé :** objets SQL et fonctions de l'assistant hybride.

**Remédiation proposée :**
- Inventorier tables, fonctions, vues, rôles, privilèges et politiques.
- Vérifier que les données conversationnelles et contextuelles sont isolées par utilisateur.
- Vérifier qu'un client ne peut pas appeler directement une fonction privilégiée avec un identifiant tiers.
- Vérifier les limites de volume, taille et fréquence pertinentes pour la cible V1 à coût quasi nul.
- Ajouter une suite pgTAP dédiée.

**Tests requis :** isolation multi-utilisateur, permissions, fonctions SECURITY DEFINER, entrées invalides, limites de taille/volume et accès service_role.

**Critère d'acceptation :** chaque objet assistant dispose d'une matrice RLS et de tests exécutables.

#### `20260912009000_secure_public_flash_feed.sql`

**Anomalie :** la migration sélectionne des colonnes Flash introduites dans Drizzle 0000, alors que l'ordre entre les deux chaînes n'est pas établi.

**Remédiation proposée :**
- Établir la migration canonique qui crée les colonnes nécessaires avant la projection.
- Vérifier la fonction publique, les filtres d'état/expiration, les limites et les privilèges EXECUTE.
- Vérifier qu'aucune coordonnée précise ni donnée privée ne fuit dans la projection publique.
- Séparer les tests feed public des tests lifecycle et des tests Scan.

**Tests requis :** éléments actifs/expirés/supprimés, brouillons invisibles, projection limitée, rôle anon/authenticated selon règle, absence de coordonnées et champs privés.

**Critère d'acceptation :** migration applicable dans l'ordre canonique et projection publique testée indépendamment du cycle de vie complet.

#### `20260912010000_secure_radar_lifecycle.sql`

**Anomalie :** crée `public.radars`, comme Drizzle 0001.

**Remédiation proposée :**
- Comparer les deux définitions colonne par colonne, contraintes, index, triggers, fonctions et politiques.
- Choisir une seule migration propriétaire de la création initiale de la table.
- Si l'une est déjà appliquée, ne pas rejouer l'autre ; établir une migration corrective pour les seules différences approuvées.
- Conserver les protections de brouillon privé, transitions contrôlées, durée et isolation par membre.
- Vérifier les rôles et privilèges de la fonction `command_radar`.

**Tests requis :** 10 assertions existantes à conserver/adapter, plus tests d'accès croisé, mutation directe interdite, commandes invalides, expiration et concurrence.

**Critère d'acceptation :** une seule définition canonique de la table et un test RLS complet du cycle de vie.

### 4.3 Migrations Drizzle

#### `drizzle/migrations/0000_flash_scan_public_functions.sql`

**Rôle observé :** ajoute des colonnes Flash et définit les fonctions publiques Flash, Scan de proximité, transition Flash et écriture de position.

**Remédiation proposée :**
- Déterminer si cette migration est la source canonique des colonnes et fonctions ou si elle doit être intégrée dans la chaîne Supabase.
- Vérifier toutes les dépendances de schéma avant l'application de la projection Flash 090.
- Vérifier que `scan_public_flashes` retourne une zone/distance sans coordonnées exactes.
- Vérifier que `set_flash_location` n'autorise que l'auteur légitime et ne permet pas de falsifier l'identité.
- Comparer les fonctions avec les contrats API actuels et la limite produit Vitalis de 1 km maximum pour Réel/Scan selon la spécification applicable ; ne pas modifier la règle sans arbitrage produit.

**Tests requis :** confidentialité géographique, limites de rayon, utilisateur tiers, flash non public, champs de position invalides, transitions de statut.

**Critère d'acceptation :** fonctions et colonnes enregistrées dans la chaîne canonique, tests privacy dédiés.

#### `drizzle/migrations/0001_create_radars_table.sql`

**Anomalie :** crée la même table Radar que la migration Supabase 100.

**Remédiation proposée :**
- Comparaison SQL normalisée des deux fichiers.
- Choisir l'unique propriétaire de la création initiale.
- Ne pas supprimer le fichier tant que le journal Drizzle et les historiques d'application ne sont pas rapprochés.
- Documenter les différences de transaction et d'objets secondaires.

**Tests requis :** vérification de schéma final, contraintes, index, triggers, RLS et ordre de migration.

**Critère d'acceptation :** aucune double création sur base vierge ou existante.

#### `drizzle/migrations/0002_create_sync_mutation_receipts.sql`

**Anomalie :** autorise `radars` dans `logical_table`, contrairement à la migration Supabase 02000.

**Remédiation proposée :**
- Aligner la liste autorisée sur les domaines réellement synchronisés en V1.
- Aligner les contraintes SQL, le contrat TypeScript, le transport et les validations serveur.
- Tester les garanties anti-rejeu et la propriété des reçus.
- Documenter la rétention et le comportement lors d'un conflit.

**Tests requis :** idempotence, unicité, propriété, rejet d'une table non autorisée, rejeu et reprise offline Radar.

**Critère d'acceptation :** même contrat dans le client, la base et les tests.

---

## 5. Tests pgTAP — fichier par fichier

### 5.1 `supabase/tests/database/rls_core.test.sql`

**Constat :** 40 assertions planifiées, dont certaines attendent des noms de politiques historiques remplacés par les migrations récentes.

**Remédiation proposée :**
- Ne pas supprimer les contrôles de sécurité.
- Réécrire les assertions de catalogue pour vérifier les politiques finales attendues, leurs rôles, opérations et expressions.
- Garder les tests comportementaux : utilisateur A/B, accès anon/authenticated, isolation des données et champs protégés.
- Séparer les assertions par domaine si le fichier devient trop transversal.

**Tests / preuves :** exécution pgTAP sur schéma entièrement migré ; rapport d'assertions réelles.

**Critère d'acceptation :** toutes les protections finales sont vérifiées, sans dépendance aux anciens noms de politiques.

### 5.2 `src/supabase/tests/database/110_public_flash_feed_security.test.sql`

**Constat :** 8 assertions planifiées sur la projection Flash publique et ses privilèges.

**Remédiation proposée :**
- Déplacer ou intégrer le test uniquement après décision sur le chemin canonique.
- Conserver les assertions existantes.
- Ajouter les tests d'absence de coordonnées/données privées et de visibilité des états.
- Ajouter une suite distincte pour les transitions Flash privées.

**Critère d'acceptation :** test découvert par Supabase CLI/CI et exécuté sur la migration canonique.

### 5.3 `src/supabase/tests/database/120_radar_lifecycle_rls.test.sql`

**Constat :** 10 assertions planifiées sur le cycle de vie Radar ; pas de test sync offline.

**Remédiation proposée :**
- Raccorder le fichier à la suite canonique.
- Conserver les contrôles de brouillon privé, transition contrôlée, isolation et durée.
- Ajouter une suite indépendante pour les reçus sync Radar, idempotence et rejeu.
- Ajouter les cas de suppression/expiration et d'accès administrateur selon la politique validée.

**Critère d'acceptation :** lifecycle Radar et sync Radar testés séparément, avec exécution CI démontrée.

### 5.4 Nouveaux tests SQL à créer après validation des contrats

| Fichier proposé | Couverture attendue | Dépendance |
|---|---|---|
| `supabase/tests/database/profile_identity_rls.test.sql` | Profil, UDI, champs système, rôles, accès croisé | Migration identité canonique |
| `supabase/tests/database/mission_transitions.test.sql` | Transitions permises/refusées, acteur, audit | Migration Missions brute validée |
| `supabase/tests/database/sync_receipts_rls.test.sql` | Propriété, idempotence, rejeu, table autorisée | Contrat sync convergé |
| `supabase/tests/database/scan_location_privacy.test.sql` | Projection sans coordonnées, écriture propriétaire, limites | Fonctions Scan canoniques |
| `supabase/tests/database/hybrid_assistant_rls.test.sql` | Isolation, fonctions, permissions, limites | Migration assistant canonique |
| `supabase/tests/database/radar_offline_sync.test.sql` | Reçus Radar, conflits, reprise, rejeu | Sync Radar approuvé |
| `supabase/tests/database/flash_lifecycle_rls.test.sql` | Création, publication, expiration, transitions et accès | Lifecycle Flash canonique |

Les noms ci-dessus sont des propositions de destination, pas des fichiers déjà créés. Les chemins définitifs dépendront de la décision de chaîne canonique.

---

## 6. Matrice de validation finale

| Domaine | Base vierge | Mise à niveau | RLS positif/négatif | CI | Statut initial |
|---|---|---|---|---|---|
| Configuration/chaîne | Requis | Requis | N/A | Requis | À établir |
| Profile/UDI | Requis | Requis | Requis | Requis | Partiel |
| Missions | Requis | Requis | Requis | Requis | Bloqué : migration mal formée |
| Flash | Requis | Requis | Requis | Requis | Partiel |
| Scan | Requis | Requis | Requis | Requis | Partiel |
| Radar lifecycle | Requis | Requis | Requis | Requis | Double définition à résoudre |
| Sync receipts | Requis | Requis | Requis | Requis | Divergence confirmée |
| Assistant | Requis | Requis | Requis | Requis | Tests dédiés absents |
| Storage | Requis | Requis | Requis | Requis | À renforcer |
| Rétention | Requis | Requis | Selon objets | Requis | Exécution SQL non démontrée |

### Preuves obligatoires avant de déclarer SQL/RLS validé

- Inventaire daté des migrations réellement appliquées sur chaque environnement.
- Source canonique et ordre d'application documentés.
- Rapport de migration sur base vierge.
- Rapport de mise à niveau depuis un schéma représentatif.
- Liste des suites SQL effectivement exécutées.
- Résultats pgTAP avec nombre réel d'assertions réussies/échouées.
- Vérification des privilèges, politiques, fonctions SECURITY DEFINER et triggers.
- CI verte sur le commit candidat.
- Revue humaine des changements de sécurité.
- Procédure de déploiement et de récupération documentée.

---

## 7. Hors périmètre de cette préparation

Ce document ne :
- modifie aucune migration SQL ;
- ne déplace aucun fichier ;
- ne modifie pas les scripts ou workflows CI ;
- ne prétend pas connaître l'état des bases staging/production ;
- ne ferme aucun TECH-001 à TECH-006 ;
- n'autorise aucune fusion dans `main`.

## 8. Décision proposée pour la prochaine étape

Commencer par le **chantier 0 — inventaire des environnements**, en lecture seule : récupérer l'historique des migrations appliquées, identifier les bases concernées, comparer les registres Supabase et Drizzle, puis produire une table « migration / fichier Git / environnement / appliquée ? / hash ou version / preuve ».

Tant que cette table n'est pas disponible, les corrections P0 restent en préparation. C'est la mesure la plus sûre pour éviter de casser une base déjà déployée ou de rejouer une migration sur des objets existants.
