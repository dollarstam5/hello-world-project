# Réconciliation fonctionnelle Foundation — vague 8

**Projet :** Vitalis  
**Lot :** A — réconciliation documentaire et fonctionnelle  
**Branche :** `reconcile/lot-a-2026-11`  
**Référence auditée :** HEAD de la branche au début de cette passe, `68870dc6771220274d368c87bc4b76c7478f236c`  
**Méthode :** lecture seule de l'arborescence, des migrations SQL, des tests, du code de synchronisation et des documents canoniques.  
**Statut :** constats statiques vérifiés ; aucune exécution SQL distante ni validation CI revendiquée.

## 1. Objet et limites

Cette vague poursuit la réconciliation des chemins Foundation absents en vérifiant si des artefacts présents ailleurs couvrent réellement les besoins Profile/UDI, onboarding, Flash/Scan, Radar, synchronisation et rétention.

Une correspondance de nom ou de thème ne suffit pas à déclarer un chemin satisfait. Les conclusions distinguent :
- **présence confirmée** : artefact réel identifié ;
- **couverture partielle** : une partie du besoin est couverte, sans équivalence complète ;
- **divergence** : deux artefacts proches présentent des différences de contrat ou de chaîne ;
- **non démontré** : aucun artefact probant n'a été trouvé dans les emplacements examinés.

Cette passe n'autorise ni suppression de chemin Foundation, ni déplacement/réécriture de migration, ni fermeture d'un problème technique.

## 2. Résultats par domaine

| Domaine / besoin Foundation | Preuve examinée | Résultat | Décision documentaire |
|---|---|---|---|
| Profile / champs système | `src/supabase/migrations/20260912000000_protect_identity_trust_system_fields.sql` (blob `5c2ed571b80c16035fc1b3cb36a755311b1f3f72`) | Protège plusieurs champs système de `profiles`, limite les colonnes modifiables et sécurise la lecture UDI. Ce n'est pas une migration dédiée aux préférences de profil ni une preuve d'un parcours Profile complet. | Couverture partielle ; conserver les exigences Profile non satisfaites. |
| Onboarding membre persistant | Arbres `supabase/migrations/`, `src/supabase/migrations/`, `drizzle/migrations/` et tests SQL présents | Aucun artefact SQL dédié à la persistance d'un onboarding membre ni test RLS associé n'a été identifié. Le store local `src/lib/experience/onboarding.ts` ne démontre pas une persistance serveur. | Non démontré ; ne pas retirer les chemins Foundation correspondants. |
| Flash public | `drizzle/migrations/0000_flash_scan_public_functions.sql` (blob `724944a27f05ac1bc3a6a4d8cfff55d97f4cb570`), `src/supabase/migrations/20260912009000_secure_public_flash_feed.sql` (blob `0e1ca96a4df004376ffcb5875a8180eadc23cbb6`), test 110 (blob `5be706db30e2c990261adb27aa74c046af9a2578`) | Drizzle définit les colonnes et plusieurs fonctions Flash/Scan. La migration Supabase 09000 ne définit que la projection publique `list_public_flashes`. Le test 110 planifie 8 assertions sur cette projection. | Couverture partielle ; les fonctions et tests Flash/Scan ne sont pas interchangeables. |
| Scan et confidentialité de position | Migration Drizzle 0000 ; `src/domains/scan/services/scan-realtime.service.ts` et tests applicatifs présents | La fonction SQL `scan_public_flashes` renvoie une distance et un libellé de zone, pas les coordonnées. Les fonctions `set_flash_location` et la recherche sont dans la migration Drizzle, mais aucun test SQL dédié de non-divulgation de position n'a été trouvé. Aucun fichier Supabase standard correspondant à la migration Scan attendue n'est présent. | Socle SQL présent dans une chaîne distincte ; sécurité SQL Scan non démontrée par test. |
| Radar lifecycle | `drizzle/migrations/0001_create_radars_table.sql` (blob `7aab522e069f39007e41c8492e92cf4fbf840569`) et `src/supabase/migrations/20260912010000_secure_radar_lifecycle.sql` (blob `b637685d4044fbad3df11f21e076b40eb65f61fa`) ; test 120 (blob `f419e21548db503279935c2930f18dfecdcf88ee`) | Les deux migrations créent la même table et les mêmes objets métier Radar ; les instructions sont très proches, mais l'ordre d'activation RLS/grants diffère et seule la version Supabase enveloppe explicitement le fichier dans BEGIN/COMMIT. Le test 120 planifie 10 assertions de base sur création, activation, isolation et durée. | Collision de chaîne confirmée ; ne pas exécuter les deux versions ni en supprimer une avant arbitrage de la chaîne canonique et historique distant. |
| Synchronisation / reçus idempotents | `src/supabase/migrations/20260912002000_harden_sync_protocol.sql` (blob `2959462ce8398f08737997caa677eb4ea4c10bec`) et `drizzle/migrations/0002_create_sync_mutation_receipts.sql` (blob `fadbf7059ac5f4257c48632580e90ec65d79a214`) | Les deux définissent `sync_mutation_receipts`, mais la contrainte `logical_table` de Drizzle inclut `radars`, contrairement à la version Supabase. Divergence fonctionnelle exacte. | Ne pas déclarer équivalent ; arbitrer le contrat sync Radar avant toute convergence. |
| Radar offline, matching et notifications | Arborescence complète de la branche et migrations SQL recensées | Les chemins de migration Foundation `20260912011000_radar_offline_sync.sql` et `20260912012000_radar_matches_notifications.sql` ne sont pas présents sous `supabase/migrations/`, `src/supabase/migrations/` ou `drizzle/migrations/`. Le test 120 ne couvre pas ces scénarios. | Non démontré au niveau SQL ; exigences à conserver et à rattacher à un ticket technique si confirmées. |
| Missions / machine d'états | `src/supabase/migrations/20260912001000_secure_mission_transitions.sql` (blob `bdc062eb206e790577c0443572027f18ecbc8fec`) | Le fichier commence par un titre Markdown et un bloc de code SQL clôturé : ce n'est pas un fichier SQL brut exécutable tel quel. Le SQL embarqué décrit des règles de transition, mais sa source authentique et son statut d'application restent inconnus. | Anomalie confirmée ; ne pas nettoyer ni appliquer avant authentification de la source et vérification des environnements. |
| Rétention / maintenance | `src/lib/maintenance/retention-policy.ts` (blob `db65091245e3120419b80228f9b46168d8c4689b`) et `tests/offline/retention-policy.test.ts` (blob `9a769da9f322aa61afbf44cf651ff72c436cf56c`) | Le code calcule un seuil et classe des horodatages ; 4 tests couvrent le calcul, la frontière et les entrées invalides. Aucun exécuteur de purge, cron, job serveur ou migration de suppression/rétention n'est démontré par ces deux artefacts. | Politique calculable confirmée ; exécution opérationnelle et preuve de purge non démontrées. |

## 3. Incompatibilités de tests et raccordement CI

### 3.1 Test RLS racine

`supabase/tests/database/rls_core.test.sql` planifie 40 assertions et attend notamment les anciens noms de politiques :
- Profile : `own profile insert` ;
- UDI : `own identity readable`, `own identity insert`, `own identity update` ;
- Missions : `own missions write`, `assignee advances mission`.

Or la migration identité supprime plusieurs de ces politiques et crée `identity readable by owner and administrators`. La migration Missions embarquée supprime les deux politiques historiques et crée `mission author creates` et `mission participants update`. Les attentes du test racine ne décrivent donc pas le même état de politiques que les migrations récentes examinées. Les assertions prévues ne sont pas des assertions réussies.

### 3.2 Tests placés sous src

Les tests SQL 110 et 120 se trouvent dans `src/supabase/tests/database/`. Le script `check:db-tests` dans `package.json` inspecte explicitement uniquement `supabase/tests/database/`. Le workflow `.github/workflows/quality.yml` appelle ce script puis `supabase test db`, sans étape démontrant la découverte ou l'exécution du dossier `src/supabase/tests/database/`.

**Conclusion CI :** le raccordement des tests SQL sous `src/` n'est pas démontré. Aucun run CI ni log d'exécution n'a été consulté dans cette vague ; aucun test n'est déclaré réussi.

### 3.3 Portée réelle des tests spécifiques

- Test 110 : 8 assertions planifiées, centrées sur la projection publique Flash ; il ne valide pas le cycle complet Flash, les fonctions Scan ou la confidentialité des coordonnées.
- Test 120 : 10 assertions planifiées, centrées sur le brouillon Radar, l'activation, l'isolation et une contrainte de durée ; il ne valide pas l'idempotence offline, les conflits, le matching, les notifications ou la rétention.

## 4. Synchronisation : documentation et code

La référence canonique `docs/02-architecture/synchronization-offline-realtime.md` décrit les routes `POST /api/sync/push` et `POST /api/sync/pull`, en accord avec les handlers `src/routes/api/sync/push.ts` et `pull.ts`.

Le document annexe historique `docs/07-annexes/SYNC_PROTOCOL.md` est déjà signalé comme décrivant encore un pull GET avec paramètre `cursor`. Cette divergence documentaire doit être corrigée ou explicitement marquée historique après vérification de ses liens entrants ; ne pas modifier le contrat runtime sur la seule base de cette annexe.

## 5. Actions proposées, sans exécution

| Priorité | Action | Prérequis |
|---|---|---|
| P0 | Décider et documenter la chaîne canonique Supabase / Drizzle | Inventaire des environnements et historiques distants ; chantier 0 toujours partiel |
| P0 | Authentifier le SQL Missions brut et son origine | Source approuvée, hash et historique d'application |
| P0 | Arbitrer la double création Radar | Chaîne canonique et historiques d'application établis |
| P1 | Converger la liste des tables autorisées dans les reçus sync | Contrat partagé et périmètre Radar validés |
| P1 | Définir l'ordre de dépendance Flash/Scan et les tests de confidentialité | Schéma cible, privilèges et chaîne canonique approuvés |
| P1 | Aligner les assertions RLS Profile/UDI/Missions sur le schéma cible | Politiques cibles approuvées ; ne supprimer aucune assertion de sécurité |
| P1 | Ajouter des tests SQL Scan, sync idempotence, Radar offline/matching et assistant | Contrats de sécurité et comportements métier validés |
| P2 | Raccorder explicitement tous les tests SQL canoniques à la CI | Répertoires et chaîne d'exécution décidés |
| P2 | Compléter la rétention par une politique d'exécution, de preuve et de reprise | Durées de conservation approuvées, notamment pour les reçus et traces IA |

## 6. État et critères de sortie

- Aucun fichier SQL n'a été appliqué, réécrit, déplacé ou supprimé.
- Aucun code runtime, test, configuration ou script CI n'a été modifié.
- Les 94 chemins Foundation absents dans la version 51/94 de l'audit précédent doivent être relus à la lumière de cette vague ; cette vague ne les retire pas automatiquement.
- Les historiques distants restent inconnus ; l'inventaire du chantier 0 demeure **PARTIEL**.
- Les tests 40/8/10 sont des plans d'assertions, pas des résultats d'exécution.
- TECH-001 à TECH-006 restent ouverts.
- Aucun contrôle Foundation, Global Audit, Go/No-Go, CI, RLS ou production n'est déclaré validé.

**Prochaine étape recommandée :** poursuivre la réconciliation des artefacts non SQL et des liens entrants pour les chemins Foundation encore absents, puis traiter séparément la mise à jour du registre des décisions et tickets. Toute remédiation SQL reste conditionnée à la collecte d'historiques distants en lecture seule.
