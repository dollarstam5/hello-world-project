# Réconciliation des chemins Foundation — Lot A

**Périmètre :** scripts de contrôle du Lot 12 (#27), comparés à l'arborescence de `main`.  
**Commit de référence main :** `86f4f43cbd6942a8e7df95d3ce53c3db9634a7fb`.  
**Branche de travail :** `reconcile/lot-a-2026-11`.  
**Nature :** audit de chemins et de références ; aucune preuve d'exécution ou de déploiement n'est revendiquée.

## Résultat vérifié

| Contrôle | Chemins requis | Chemins présents | Chemins absents |
|---|---:|---:|---:|
| `src/scripts/check-foundation.mjs` | 145 | 51 | 94 |
| `scripts/check-global-audit.ts` | 10 | 10 | 0 |
| `scripts/check-go-no-go.ts` | 13 | 13 | 0 |

Sur le même arbre de référence, la version de `main` avant correction avait 32 chemins présents et 113 absents. Après les 19 remplacements de #27, la version auditée en compte 51 présents et 94 absents. Les **19 remplacements de chemins** apportés par #27 ont tous une cible présente dans l'arborescence actuelle ; aucun chemin de remplacement ajouté n'est absent.

Les contrôles Global Audit et Go/No-Go pointent désormais vers les emplacements documentaires existants. Les noms de scripts déclarés dans `package.json` ont été vérifiés séparément :
- Global Audit : 4/4 présents.
- Go/No-Go : 5/5 présents.

## Chemins Foundation encore absents

Les 94 chemins ci-dessous ne sont pas présents sous leur nom exact dans l'arbre de référence. **Cela ne prouve pas automatiquement que la fonctionnalité correspondante est absente** : un équivalent peut exister sous une autre architecture, ou l'exigence peut être obsolète. Aucune référence n'est supprimée de la liste par ce rapport.

- `SECURITY.md`
- `CHANGELOG.md`
- `scripts/check-release-readiness.mjs`
- `tests/smoke/release-readiness.test.ts`
- `packages/core-contracts/src/profile.ts`
- `packages/core-logic/src/profile.ts`
- `src/domains/profile/model/profile.schema.ts`
- `src/domains/profile/api/profile.server.ts`
- `src/domains/profile/api/profile.functions.ts`
- `src/domains/profile/hooks/useProfile.ts`
- `src/domains/profile/ui/ProfileView.tsx`
- `src/routes/_authenticated/profil.tsx`
- `supabase/migrations/20260912005000_profile_preferences.sql`
- `supabase/tests/database/70_profile_preferences_rls.test.sql`
- `tests/profile/profile-contract.test.ts`
- `docs/PROFILE_IDENTITY.md`
- `packages/core-contracts/src/auth.ts`
- `packages/core-contracts/src/onboarding.ts`
- `packages/core-logic/src/onboarding.ts`
- `src/domains/auth/model/auth.schema.ts`
- `src/domains/auth/ui/AuthView.tsx`
- `src/domains/auth/ui/AuthCallbackView.tsx`
- `src/domains/auth/ui/PasswordRecoveryView.tsx`
- `src/routes/auth.callback.tsx`
- `src/routes/auth.recovery.tsx`
- `src/features/onboarding/MemberOnboarding.tsx`
- `src/features/onboarding/useMemberOnboarding.ts`
- `supabase/migrations/20260912006000_member_onboarding.sql`
- `supabase/tests/database/80_member_onboarding_rls.test.sql`
- `tests/auth/auth-contract.test.ts`
- `tests/onboarding/onboarding-flow.test.ts`
- `docs/AUTH_ONBOARDING.md`
- `src/domains/flash/model/flash.schema.ts`
- `src/domains/flash/model/flash.mapper.ts`
- `src/domains/flash/hooks/useFlashComposer.ts`
- `src/domains/flash/ui/FlashView.tsx`
- `src/routes/_authenticated/flash.new.tsx`
- `supabase/migrations/20260912007000_secure_flash_lifecycle.sql`
- `supabase/tests/database/90_flash_lifecycle_rls.test.sql`
- `tests/flash/flash-contract.test.ts`
- `tests/flash/flash-mapping.test.ts`
- `docs/FLASH_MODULE.md`
- `src/domains/scan/model/scan.schema.ts`
- `src/domains/scan/services/geolocation.service.ts`
- `src/domains/scan/ui/ScanView.tsx`
- `src/routes/_authenticated/scan.tsx`
- `supabase/migrations/20260912008000_private_flash_locations_scan.sql`
- `supabase/tests/database/100_scan_location_privacy.test.sql`
- `tests/scan/geolocation-privacy.test.ts`
- `supabase/migrations/20260912011000_radar_offline_sync.sql`
- `supabase/tests/database/130_radar_offline_sync.test.sql`
- `src/domains/radar/api/radar.server.ts`
- `src/domains/radar/api/radar.functions.ts`
- `src/domains/radar/hooks/useRadarComposer.ts`
- `src/domains/radar/hooks/useRadars.ts`
- `src/domains/radar/ui/RadarComposer.tsx`
- `src/domains/radar/ui/RadarList.tsx`
- `src/domains/radar/ui/RadarView.tsx`
- `src/routes/_authenticated/radar.new.tsx`
- `tests/radar/radar-offline.test.ts`
- `tests/radar/radar-sync-validation.test.ts`
- `tests/radar/radar-composer.test.ts`
- `supabase/migrations/20260912012000_radar_matches_notifications.sql`
- `supabase/tests/database/140_radar_matches_notifications_rls.test.sql`
- `src/domains/radar/api/radar-matches.server.ts`
- `src/domains/radar/hooks/useRadarMatches.ts`
- `src/lib/radar-maintenance.server.ts`
- `src/platform/notifications/NotificationsTab.tsx`
- `tests/radar/radar-matching.test.ts`
- `tests/radar/radar-maintenance.test.ts`
- `tests/notifications/radar-notifications.test.ts`
- `src/lib/health.server.ts`
- `src/routes/api/health/live.ts`
- `src/routes/api/health/ready.ts`
- `public/offline.html`
- `public/favicon.svg`
- `scripts/check-pwa.mjs`
- `performance-budget.json`
- `scripts/check-performance-budget.mjs`
- `playwright.config.ts`
- `tests/e2e/mobile-foundation.spec.ts`
- `src/lib/maintenance.server.ts`
- `src/routes/api/cron/maintenance.ts`
- `supabase/tests/database/00_schema_contract.test.sql`
- `supabase/tests/database/10_profiles_identity_rls.test.sql`
- `supabase/tests/database/20_content_isolation_rls.test.sql`
- `supabase/tests/database/30_mission_transitions_rls.test.sql`
- `supabase/tests/database/40_sync_receipts_rls.test.sql`
- `supabase/tests/database/50_assistant_rls.test.sql`
- `tests/sync/offline-reconnect.e2e.test.ts`
- `tests/sync/conflict-recovery.e2e.test.ts`
- `tests/offline/local-database-isolation.e2e.test.ts`
- `tests/observability/maintenance-config.test.ts`
- `supabase/migrations/20260912004000_operational_retention.sql`

## Décisions obligatoires avant correction supplémentaire

1. Pour chaque chemin absent, identifier le propriétaire fonctionnel et le besoin initial.
2. Rechercher un équivalent réel dans le code, les contrats, les migrations et les tests.
3. Comparer responsabilités, exports, schémas, consommateurs et couverture avant de déclarer deux fichiers équivalents.
4. Si l'exigence reste valide mais que l'artefact manque, créer un ticket technique distinct ; ne pas neutraliser le contrôle.
5. Si l'exigence est obsolète ou remplacée, documenter la décision et son approbateur avant de modifier la liste.
6. Ne pas créer de fichiers vides ou de faux alias uniquement pour faire passer Foundation.

## État de validation

- Les 19 remplacements de chemins de #27 sont confirmés par l'arborescence.
- 94 références Foundation restent à arbitrer ; le script doit donc rester considéré comme non validé.
- Les chemins de Global Audit et Go/No-Go sont présents, mais leurs scripts n'ont pas été exécutés dans cette étape.
- Aucun contrôle CI n'a été relancé sur cette branche.
- TECH-001 à TECH-006 restent ouverts.
- Ce rapport ne vaut pas autorisation de fusion et ne ferme aucun problème technique.


## Première vague de réconciliation fonctionnelle — preuves consultées sur main

Cette première passe porte sur les fichiers candidats les plus directement liés aux chemins absents. Elle ne prétend pas clôturer l'audit des 94 chemins.

### Profil et identité

| Chemin attendu | Élément observé | Décision provisoire |
|---|---|---|
| `packages/core-contracts/src/profile.ts` et `packages/core-logic/src/profile.ts` | Les index des packages exportent des modules génériques (`records`, `modules`, `roles`, etc.), mais aucun module de contrat ou logique de profil dédié n'a été confirmé. | Équivalence non prouvée |
| `src/domains/profile/model/profile.schema.ts`, API, hooks et vue | `src/domains/profile/index.ts` ne fait qu'exporter `src/lib/experience/identity.ts`. Ce dernier contient un store Zustand minimal (tier et nom d'affichage) et indique explicitement que le branchement backend viendra ultérieurement. | Pas d'équivalent fonctionnel complet |
| Route profil, migration préférences et test RLS dédiés | Aucun candidat complet correspondant n'a été confirmé dans cette passe. | À investiguer |

**Conclusion :** le domaine Profile existe comme point d'entrée, mais ne prouve pas l'existence d'une gestion de profil persistée, validée et sécurisée. Ne pas reclasser les chemins Profile comme satisfaits.

### Authentification et onboarding

- Auth : `src/domains/auth/model/useAuth.ts` et `services/auth.service.ts` existent et couvrent session, connexion, inscription, réinitialisation et déconnexion. Les écrans présents sont `SignInView.tsx` et `ResetPasswordView.tsx`. Les chemins de callback et les vues de récupération distinctes demandés par Foundation ne sont pas prouvés.
- Onboarding : `src/features/onboarding/index.ts` réexporte `OnboardingSheet` et `src/lib/experience/onboarding.ts`. Le store conserve un seul indicateur local d'achèvement ; le commentaire le décrit comme une fondation minimale, pas comme un parcours membre complet.
- Le chemin de réinitialisation effectivement utilisé par le service est `/reset-password`, différent de la route recovery dédiée listée dans Foundation.

**Conclusion :** équivalences partielles seulement. Les chemins attendus ne doivent pas être retirés de Foundation sur cette seule base.

### Flash, Scan et Radar

- Flash : contrats partagés, logique métier, API serveur/fonctions, hooks de flux et compositeur existent. En revanche, les chemins de schéma/mapper/compositeur/vue attendus ne sont pas tous présents. La documentation canonique du moteur et le statut des contrats API existent.
- Scan : contrats, logique, API, hook et service Realtime existent. Le hook exécute une requête serveur et réagit aux changements Flash. Le service de géolocalisation dédié et les chemins de vue/route attendus ne sont pas confirmés. Le module de documentation Scan décrit des garanties de confidentialité, mais ne remplace pas les tests spécifiques absents.
- Radar : contrat, logique, schéma Zod, mapper et migrations de cycle de vie existent. Le domaine n'exporte actuellement que le schéma, le mapper et une carte UI. Les API, hooks de composition/liste, vues et routes attendues ne sont pas confirmés.

**Conclusion :** les fondations métier des trois moteurs sont réelles, mais les chemins UI/API/tests absents restent à examiner séparément. Une présence de contrat ou de migration ne valide pas le parcours complet.

### Divergences de migrations — point de vigilance important

Les migrations trouvées dans `drizzle/migrations/` et `src/supabase/migrations/` ne sont pas toutes interchangeables :

1. Radar : `drizzle/migrations/0001_create_radars_table.sql` et `src/supabase/migrations/20260912010000_secure_radar_lifecycle.sql` ont un contenu presque identique, mais la version Drizzle ne comporte pas l'encapsulation transactionnelle explicite de la version Supabase. Candidat proche, mais chaîne d'application et source d'autorité à clarifier avant tout déplacement.
2. Reçus de synchronisation : `drizzle/migrations/0002_create_sync_mutation_receipts.sql` autorise `radars` dans `logical_table`, tandis que `src/supabase/migrations/20260912002000_harden_sync_protocol.sql` ne l'inclut pas. **Divergence fonctionnelle confirmée** : ne pas déclarer ces migrations équivalentes.
3. Flash/Scan : `drizzle/migrations/0000_flash_scan_public_functions.sql` ajoute des colonnes et plusieurs fonctions Flash/Scan. `src/supabase/migrations/20260912009000_secure_public_flash_feed.sql` ne couvre que la projection publique Flash. **Périmètres différents** : pas d'équivalence globale.

Aucune migration n'a été déplacée, fusionnée ou supprimée. Il faut d'abord identifier quel outil et quel dossier constituent la chaîne de migration effectivement exécutée dans les environnements ciblés.

### Santé, performance et exploitation

- Un endpoint `/api/health` existe, ainsi qu'une politique de classification de santé. Les chemins distincts `live.ts`, `ready.ts` et `health.server.ts` ne sont pas démontrés par le candidat examiné.
- Le script existant est `scripts/check-performance-budgets.ts`, et non `scripts/check-performance-budget.mjs`. Il mesure les ressources du build et utilise la politique de budget du dépôt : candidat fonctionnel possible, mais le nom et l'interface du contrôle doivent être rapprochés avant modification du script Foundation.
- La politique de rétention existe sous `src/lib/maintenance/retention-policy.ts`. Cela ne prouve pas l'existence d'un exécuteur de maintenance, d'une route cron, ni d'une migration de rétention à l'emplacement exigé.

### Synthèse de cette passe

| Domaine | Résultat |
|---|---|
| Profil | Insuffisant — store d'identité minimal, pas de profil complet prouvé |
| Auth | Partiel — service/session/écrans existants, callback/recovery non prouvés |
| Onboarding | Partiel — indicateur local, parcours membre complet non prouvé |
| Flash | Socle confirmé, parcours et tests Foundation incomplets |
| Scan | Socle confirmé, géolocalisation dédiée et parcours incomplets |
| Radar | Contrat/logique/schéma/migration confirmés, API/UI/sync/matching à vérifier |
| Migrations | Divergences fonctionnelles confirmées entre dossiers |
| Santé/performance/maintenance | Composants partiels, scripts et endpoints attendus non équivalents à ce stade |

**Action :** conserver les 94 chemins absents dans le contrôle. La prochaine passe doit examiner les migrations de profil, onboarding, Flash, Scan, Radar offline/matching et rétention, puis les tests RLS correspondants. Aucun ticket ou retrait d'exigence n'est créé sans rattachement à la décision produit/technique appropriée.


## Deuxième vague — migrations SQL et tests RLS

**Arbre de référence :** `main` (même base de comparaison que cette PR). Les chemins attendus sous `supabase/migrations/` ne sont pas les emplacements effectifs des migrations récentes : celles-ci sont regroupées sous `src/supabase/migrations/`. Les chemins de test correspondants sont majoritairement sous `src/supabase/tests/database/`. Cette différence de racine est importante ; elle ne rend pas pour autant les artefacts manquants équivalents.

### Inventaire des artefacts SQL constatés

| Besoin Foundation | Artefact réel examiné | Constat |
|---|---|---|
| Profil / préférences (migration 050 + test 70) | `src/supabase/migrations/20260912000000_protect_identity_trust_system_fields.sql` | Protège les champs système de `profiles`, limite les colonnes modifiables, sécurise UDI et provisionne une identité initiale. Ce n'est pas une migration de préférences de profil dédiée ; aucun test dédié de préférences n'a été trouvé. |
| Onboarding membre (migration 060 + test 80) | Aucun candidat SQL dédié dans les arbres `supabase/migrations`, `src/supabase/migrations` ou `drizzle/migrations` | Non démontré au niveau base/RLS. Le store local d'onboarding déjà décrit dans la première passe ne remplace pas une persistance serveur. |
| Cycle de vie Flash (migration 070 + test 90) | `drizzle/migrations/0000_flash_scan_public_functions.sql`, `src/supabase/migrations/20260912009000_secure_public_flash_feed.sql`, test `110_public_flash_feed_security.test.sql` | La migration Drizzle ajoute des champs et fonctions Flash/Scan, dont transition et écriture de position privée ; la migration Supabase ne fournit que la projection publique Flash. Le test 110 vérifie le fil public et ses privilèges, pas le cycle de vie complet. Pas d'équivalent global. |
| Confidentialité de position Scan (migration 080 + test 100) | Fonction `scan_public_flashes` dans `drizzle/migrations/0000_flash_scan_public_functions.sql`, plus `set_flash_location` | Un candidat fonctionnel existe dans Drizzle : la projection renvoie distance/zone sans coordonnées et la fonction d'écriture est limitée à l'auteur. Mais aucun test SQL spécifique de confidentialité Scan n'est présent dans l'arbre ; la migration Supabase 090 ne contient pas ces fonctions. Équivalence partielle, chaîne d'application non établie. |
| Radar offline sync (migration 110 + test 130) | `drizzle/migrations/0002_create_sync_mutation_receipts.sql`, `src/supabase/migrations/20260912002000_harden_sync_protocol.sql`, migration Radar 100 | Le schéma de reçus est présent, mais divergence confirmée : Drizzle autorise `radars` dans `logical_table`, la migration Supabase ne l'autorise pas. Le test Radar 120 couvre le cycle de vie/RLS, pas l'idempotence ou la synchronisation offline Radar. Pas d'équivalent validé. |
| Radar matching / notifications (migration 120 + test 140) | Migration Radar 100 et test 120 | La migration crée la table, les politiques RLS, les transitions de cycle de vie, les index et la fonction `command_radar`. Aucun mécanisme de matching, de correspondance ou de notification Radar n'est démontré dans cette migration ni dans le test 120. |
| Rétention opérationnelle (migration 040) | `src/lib/maintenance/retention-policy.ts` | Politique applicative repérée, mais aucune migration SQL de rétention, aucun exécuteur cron ni test d'exécution correspondant dans l'arbre. |

### Couverture des tests SQL existants

- `src/supabase/tests/database/110_public_flash_feed_security.test.sql` : 8 assertions planifiées. Vérifie la projection Flash publique, la visibilité des éléments actifs/non expirés, les droits d'exécution et le plafonnement des limites. Ne teste pas la confidentialité géographique Scan ni toutes les transitions Flash.
- `src/supabase/tests/database/120_radar_lifecycle_rls.test.sql` : 10 assertions planifiées. Vérifie la création d'un brouillon privé, le refus d'une transition directe, l'activation par la fonction autorisée, l'isolation entre membres, les privilèges et une contrainte de durée. Ne teste pas le sync offline ni le matching/notifications.
- `supabase/tests/database/rls_core.test.sql` : 40 assertions planifiées couvrant plusieurs tables centrales (dont profils, UDI, Flash, notifications, missions et reçus de synchronisation). C'est un test transversal utile, mais il ne remplace pas les suites dédiées Profile preferences, Onboarding, Flash lifecycle, Scan location privacy, Radar offline ou Radar matches.
- Les migrations `src/supabase/migrations/20260912000000...` à `...03000...` sont présentes. Leurs responsabilités sont identité/protection des champs, transitions de missions, protocole de synchronisation et assistant hybride ; aucune ne fournit les migrations dédiées 040/050/060/070/080/110/120 attendues.

### Conclusions provisoires de la deuxième passe

1. **Profile preferences :** sécurité de profil et UDI existante, mais préférences persistées et tests dédiés non prouvés.
2. **Onboarding :** absence d'artefact SQL dédié dans l'arbre inspecté ; exigence serveur/RLS non couverte par une preuve disponible.
3. **Flash :** plusieurs fonctions existent dans Drizzle, mais périmètres divergents avec la migration Supabase et couverture de test partielle.
4. **Scan :** logique SQL de proximité et protection de position existe uniquement dans la migration Drizzle examinée ; test dédié et intégration à la chaîne Supabase non prouvés.
5. **Radar offline :** divergence de schéma des reçus confirmée ; pas de preuve de test d'idempotence Radar.
6. **Radar matching/notifications :** cycle de vie Radar est testé, mais matching et notifications ne sont pas démontrés.
7. **Rétention :** politique applicative seulement ; exécution opérationnelle et migration SQL non démontrées.

**Limites de preuve :** l'inspection porte sur l'arbre Git et le contenu des fichiers. Aucun SQL n'a été appliqué à une base, aucun test pgTAP n'a été exécuté et aucune chaîne de déploiement/migration n'a été vérifiée. Il serait donc incorrect de qualifier les politiques SQL de « testées en environnement ».

**Action conservatoire :** ne déplacer, fusionner ou supprimer aucune migration. Ne pas retirer de référence Foundation. Clarifier d'abord la source d'autorité entre Drizzle et Supabase, puis arbitrer les exigences fonctionnelles et les tests manquants avec les responsables produit/technique.


## Troisième vague — sécurité, release, performance, PWA et observabilité

### Références racine et release readiness

| Chemin Foundation | Résultat sur main | Élément voisin / portée |
|---|---|---|
| `SECURITY.md` | Absent | Des règles de sécurité existent dans `docs/05-ai/security-rules.md`, `docs/05-ai/13-AI-SECURITY-RULES.md`, les en-têtes serveur et les tests de sécurité. Ce n'est pas automatiquement un substitut à une politique de sécurité racine pour les contributeurs et signalements. |
| `CHANGELOG.md` | Absent | Aucun journal de versions racine n'a été identifié dans l'arbre. Les notes de release sont mentionnées par la procédure, mais cela ne prouve pas un historique de versions publié. |
| `scripts/check-release-readiness.mjs` | Absent | `docs/06-operations/release-readiness.md` existe et décrit la procédure. `package.json` expose un contrôle `check:release` qui enchaîne des commandes, mais aucun script portant ce nom précis n'a été trouvé. |
| `tests/smoke/release-readiness.test.ts` | Absent | `tests/foundation.smoke.test.ts` existe, mais couvre la normalisation d'une question et l'autorisation de routes de l'assistant. Il ne valide pas la préparation d'une release. |

**Conclusion :** le document de procédure release existe ; les deux artefacts automatisés attendus et les deux documents racine ne sont pas démontrés. Le smoke test présent n'est pas équivalent au smoke test release attendu.

### Performance et Web Vitals

- `scripts/check-performance-budgets.ts` mesure les ressources du build client et appelle `assertPerformanceBudgets`. C'est un candidat réel pour le contrôle de budget, mais son chemin/extension diffère du chemin Foundation.
- `tests/performance-budgets.test.ts` vérifie les budgets JS/CSS/ressources critiques et une régression JavaScript.
- `tests/performance-policy.test.ts` vérifie les seuils de classification LCP, INP et CLS.
- `src/lib/performance/web-vitals.ts` collecte LCP, INP et CLS via PerformanceObserver ; `tests/web-vitals.test.ts` couvre l'absence de PerformanceObserver et le comportement des observers simulés.
- Le chemin `src/platform/performance/web-vitals.ts` n'est donc pas le chemin réel : le code est dans `src/lib/performance/web-vitals.ts`.
- Ces tests démontrent des fonctions et politiques unitaires, pas des mesures terrain p75 en production, ni un rapport complet d'expérience réelle sur appareils Android/iOS.

**Conclusion :** couverture partielle et candidats fonctionnels solides ; ne pas déplacer les fichiers uniquement pour aligner les noms. Il faut arbitrer le chemin canonique du script et la portée du contrôle attendu.

### PWA

- `src/platform/pwa.ts` existe et expose l'enregistrement du service worker, l'invite d'installation et l'application d'une mise à jour.
- `tests/pwa.test.ts` vérifie seulement que l'entrée d'enregistrement est exportée et de type fonction.
- `src/platform/pwa/install.ts`, `src/platform/pwa/update.ts` et `src/platform/pwa/index.ts` existent également dans l'arborescence.
- Aucun `scripts/check-pwa.mjs` ni `playwright.config.ts` n'a été trouvé dans l'arbre inspecté. Le script `scripts/test-mobile-e2e.sh` existe, mais son nom seul ne prouve pas qu'il réalise les scénarios PWA attendus.
- Le test unitaire actuel ne valide pas l'installation réelle, le cycle de mise à jour, le cache offline, ni le comportement sur appareils mobiles.

**Conclusion :** fondation PWA présente, mais vérification automatisée de bout en bout insuffisamment démontrée.

### Santé, maintenance et diagnostic offline

- `src/routes/api/health.ts` et `tests/observability/health.test.ts` existent. Le test contrôle HTTP 200, JSON, no-store, status/service et horodatage.
- `src/lib/observability/health-policy.ts` et `tests/observability/health-policy.test.ts` couvrent les seuils healthy/warning/critical.
- Les chemins distincts `src/routes/api/health/live.ts`, `ready.ts` et `src/lib/health.server.ts` ne sont pas présents.
- `src/platform/offline/diagnostics.ts` et `tests/offline/diagnostics.test.ts` couvrent le nombre de mutations en attente, l'âge de la plus ancienne, la quarantaine et la classification de santé sans exposer le contenu des mutations.
- `src/lib/maintenance/retention-policy.ts` et `tests/offline/retention-policy.test.ts` couvrent le calcul de cutoff et les entrées invalides ; ils ne démontrent pas l'exécution d'une purge, une route cron ou une migration SQL de rétention.
- `src/lib/maintenance.server.ts` et `src/routes/api/cron/maintenance.ts` restent absents dans l'arbre examiné.

**Conclusion :** health et diagnostics offline disposent d'une couverture unitaire utile. La maintenance est limitée à une politique pure, sans preuve d'un exécuteur opérationnel. Les routes live/ready ne sont pas nécessaires par simple convention : leur besoin doit être confirmé avant de les créer.

### Qualité des preuves et limites

Les tests et sources ci-dessus ont été lus dans `main`, mais **n'ont pas été exécutés** pendant cette passe. La présence d'un test ne prouve pas qu'il passe sur le commit de référence, et la présence d'une procédure ne prouve pas que la préproduction ou la production a été validée.

### Arbitrages à conserver ouverts

1. Créer ou non une politique de sécurité racine et un changelog racine : décision de gouvernance documentaire.
2. Choisir le chemin canonique du script de performance et formaliser le contrat du contrôle.
3. Définir le niveau de tests PWA attendu pour V1 : test unitaire seul ou scénario navigateur/mobile reproductible.
4. Décider si l'endpoint health minimal suffit à V1 ou si des endpoints live/ready séparés sont réellement requis.
5. Décider si la rétention est une exigence opérationnelle V1 ; si oui, définir les données, la durée, le mécanisme d'exécution, les permissions, la fréquence et les tests avant d'implémenter.
6. Définir les preuves minimales de release : les documents canoniques existent, mais le script et le smoke test dédiés ne sont pas présents sous les chemins attendus.

**Action conservatoire :** ne pas créer de fichiers vides, ne pas renommer les artefacts existants, ne pas déclarer la release prête et ne pas retirer de référence Foundation avant arbitrage. Les chemins absents restent comptabilisés jusqu'à décision explicite.
