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
