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
