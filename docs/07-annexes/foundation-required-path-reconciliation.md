# Réconciliation des chemins requis par Foundation

**Branche de travail :** `fix/lot12-script-documentation-paths`  
**Contrôle :** `src/scripts/check-foundation.mjs` comparé à l'arborescence Git de la tête de branche `781b224250955ea3b52d755a1d0954c2b7effa31`.  
**But :** distinguer les déplacements certains des exigences qui nécessitent une décision métier/technique. Ce document ne certifie pas l'exécution des tests.

## Résultat quantifié

- Références déclarées dans `requiredFiles` : **145**.
- Chemins initialement non résolus avant les corrections de préfixe : **112**.
- Déplacements de préfixe vérifiés et corrigés dans le script : **13**.
- Chemins restant non résolus après ces corrections : **99**.
- Les 99 chemins restants ne sont pas automatiquement déclarés « fonctionnalités absentes » : cela signifie que la cible exacte n'existe pas et que son équivalent n'est pas établi.

> Correction du compte rendu précédent : le chiffre annoncé précédemment de 106 était incomplet. Le recalcul reproductible sur les 145 références du script et l'arborescence de la tête de PR donne 112 avant corrections, puis 99 après les 13 déplacements confirmés.

## A. Déplacements confirmés appliqués

| Ancienne référence | Cible présente dans le dépôt |
|---|---|
| `supabase/migrations/20260912009000_secure_public_flash_feed.sql` | `src/supabase/migrations/20260912009000_secure_public_flash_feed.sql` |
| `supabase/tests/database/110_public_flash_feed_security.test.sql` | `src/supabase/tests/database/110_public_flash_feed_security.test.sql` |
| `tests/flash/public-flash-feed.test.ts` | `src/tests/flash/public-flash-feed.test.ts` |
| `tests/scan/scan-realtime-stability.test.ts` | `src/tests/scan/scan-realtime-stability.test.ts` |
| `supabase/migrations/20260912010000_secure_radar_lifecycle.sql` | `src/supabase/migrations/20260912010000_secure_radar_lifecycle.sql` |
| `supabase/tests/database/120_radar_lifecycle_rls.test.sql` | `src/supabase/tests/database/120_radar_lifecycle_rls.test.sql` |
| `tests/radar/radar-contract.test.ts` | `src/tests/radar/radar-contract.test.ts` |
| `tests/radar/radar-lifecycle.test.ts` | `src/tests/radar/radar-lifecycle.test.ts` |
| `scripts/check-supabase-tests.mjs` | `src/scripts/check-supabase-tests.mjs` |
| `supabase/migrations/20260912000000_protect_identity_trust_system_fields.sql` | `src/supabase/migrations/20260912000000_protect_identity_trust_system_fields.sql` |
| `supabase/migrations/20260912001000_secure_mission_transitions.sql` | `src/supabase/migrations/20260912001000_secure_mission_transitions.sql` |
| `supabase/migrations/20260912002000_harden_sync_protocol.sql` | `src/supabase/migrations/20260912002000_harden_sync_protocol.sql` |
| `supabase/migrations/20260912003000_secure_hybrid_assistant.sql` | `src/supabase/migrations/20260912003000_secure_hybrid_assistant.sql` |

Ces changements ne font que réaligner le contrôle sur les fichiers existants. Ils ne modifient ni le contenu des migrations, ni les tests, ni le comportement applicatif.

## B. Chemins non résolus après correction

| Chemin requis | Classification | Candidat / décision nécessaire |
|---|---|---|
| `SECURITY.md` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `CHANGELOG.md` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `scripts/check-release-readiness.mjs` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `tests/smoke/release-readiness.test.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `packages/core-contracts/src/profile.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `packages/core-logic/src/profile.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `src/domains/profile/model/profile.schema.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `src/domains/profile/api/profile.server.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `src/domains/profile/api/profile.functions.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `src/domains/profile/hooks/useProfile.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `src/domains/profile/ui/ProfileView.tsx` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `src/routes/_authenticated/profil.tsx` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `supabase/migrations/20260912005000_profile_preferences.sql` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `supabase/tests/database/70_profile_preferences_rls.test.sql` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `tests/profile/profile-contract.test.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `docs/PROFILE_IDENTITY.md` | Documentation scope — decision required | Semantic candidate: `docs/02-architecture/identity-model.md`; compare required scope first |
| `packages/core-contracts/src/auth.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `packages/core-contracts/src/onboarding.ts` | Alternative filename — unconfirmed | Candidate only: `src/lib/experience/onboarding.ts`; not a confirmed equivalent |
| `packages/core-logic/src/onboarding.ts` | Alternative filename — unconfirmed | Candidate only: `src/lib/experience/onboarding.ts`; cannot assume it replaces both package layers |
| `src/domains/auth/model/auth.schema.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `src/domains/auth/hooks/useAuth.ts` | Alternative filename — unconfirmed | Candidate only: `src/domains/auth/model/useAuth.ts`; inspect import/API semantics |
| `src/domains/auth/ui/AuthView.tsx` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `src/domains/auth/ui/AuthCallbackView.tsx` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `src/domains/auth/ui/PasswordRecoveryView.tsx` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `src/routes/auth.callback.tsx` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `src/routes/auth.recovery.tsx` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `src/features/onboarding/MemberOnboarding.tsx` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `src/features/onboarding/useMemberOnboarding.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `supabase/migrations/20260912006000_member_onboarding.sql` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `supabase/tests/database/80_member_onboarding_rls.test.sql` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `tests/auth/auth-contract.test.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `tests/onboarding/onboarding-flow.test.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `docs/AUTH_ONBOARDING.md` | Documentation scope — decision required | Semantic candidates: `docs/03-api/auth-api.md`, `docs/01-product/user-journeys.md`; neither is confirmed as full replacement |
| `src/domains/flash/model/flash.schema.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `src/domains/flash/model/flash.mapper.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `src/domains/flash/hooks/useFlashComposer.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `src/domains/flash/ui/FlashComposer.tsx` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `src/domains/flash/ui/FlashView.tsx` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `src/routes/_authenticated/flash.new.tsx` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `supabase/migrations/20260912007000_secure_flash_lifecycle.sql` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `supabase/tests/database/90_flash_lifecycle_rls.test.sql` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `tests/flash/flash-contract.test.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `tests/flash/flash-mapping.test.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `docs/FLASH_MODULE.md` | Documentation scope — decision required | Semantic candidates: `docs/03-engines/flash/11-VITALA-UJ-08-FLASH-ENGINE.md`, `docs/03-api/flash-api.md`; compare the intended module spec |
| `src/domains/scan/model/scan.schema.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `src/domains/scan/services/geolocation.service.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `src/domains/scan/ui/ScanView.tsx` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `src/routes/_authenticated/scan.tsx` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `supabase/migrations/20260912008000_private_flash_locations_scan.sql` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `supabase/tests/database/100_scan_location_privacy.test.sql` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `tests/scan/geolocation-privacy.test.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `supabase/migrations/20260912011000_radar_offline_sync.sql` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `supabase/tests/database/130_radar_offline_sync.test.sql` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `src/domains/radar/api/radar.server.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `src/domains/radar/api/radar.functions.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `src/domains/radar/hooks/useRadarComposer.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `src/domains/radar/hooks/useRadars.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `src/domains/radar/ui/RadarComposer.tsx` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `src/domains/radar/ui/RadarList.tsx` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `src/domains/radar/ui/RadarView.tsx` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `src/routes/_authenticated/radar.new.tsx` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `tests/radar/radar-offline.test.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `tests/radar/radar-sync-validation.test.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `tests/radar/radar-composer.test.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `supabase/migrations/20260912012000_radar_matches_notifications.sql` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `supabase/tests/database/140_radar_matches_notifications_rls.test.sql` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `src/domains/radar/api/radar-matches.server.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `src/domains/radar/hooks/useRadarMatches.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `src/lib/radar-maintenance.server.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `src/platform/notifications/NotificationsTab.tsx` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `tests/radar/radar-matching.test.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `tests/radar/radar-maintenance.test.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `tests/notifications/radar-notifications.test.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `src/lib/health.server.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `src/routes/api/health/live.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `src/routes/api/health/ready.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `public/offline.html` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `public/favicon.svg` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `scripts/check-pwa.mjs` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `performance-budget.json` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `scripts/check-performance-budget.mjs` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `src/platform/performance/web-vitals.ts` | Alternative filename — unconfirmed | Candidate only: `src/lib/performance/web-vitals.ts`; inspect ownership and imports |
| `playwright.config.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `tests/e2e/mobile-foundation.spec.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `tests/performance/web-vitals.test.ts` | Alternative filename — unconfirmed | Candidate only: `tests/web-vitals.test.ts`; inspect coverage and test scope |
| `src/lib/maintenance.server.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `src/routes/api/cron/maintenance.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `supabase/tests/database/00_schema_contract.test.sql` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `supabase/tests/database/10_profiles_identity_rls.test.sql` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `supabase/tests/database/20_content_isolation_rls.test.sql` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `supabase/tests/database/30_mission_transitions_rls.test.sql` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `supabase/tests/database/40_sync_receipts_rls.test.sql` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `supabase/tests/database/50_assistant_rls.test.sql` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `tests/sync/offline-reconnect.e2e.test.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `tests/sync/conflict-recovery.e2e.test.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `tests/offline/local-database-isolation.e2e.test.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `packages/core-db/src/diagnostics.ts` | Alternative filename — unconfirmed | Candidate only: `src/platform/offline/diagnostics.ts`; inspect package/API boundary |
| `tests/observability/maintenance-config.test.ts` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |
| `supabase/migrations/20260912004000_operational_retention.sql` | Unresolved — no direct equivalent | No direct path/basename equivalent confirmed in the inspected tree. Check intent, architecture, and consumer before changing the requirement. |

## C. Règles de traitement

1. **Ne pas supprimer de référence uniquement pour faire passer Foundation.**
2. **Ne pas pointer deux couches/packages distincts vers un seul fichier** sans vérifier les contrats et les consommateurs.
3. Pour chaque candidat alternatif, comparer exports, responsabilités, imports, assertions et couverture de test avant de décider qu'il s'agit d'un renommage.
4. Pour les documents métier, comparer le contenu section par section ; un document voisin ou un index n'est pas forcément un remplacement complet.
5. Les chemins réellement non présents peuvent signaler un contrôle obsolète, un artefact manquant ou une architecture différente. La décision doit être documentée avant toute modification.
6. Toute évolution de migrations/tests SQL doit rester séparée de ce correctif de chemins et suivre les contrôles techniques dédiés.

## D. État de validation

- Le script a été modifié uniquement pour 13 déplacements de préfixe confirmés, en plus des corrections documentaires déjà préparées.
- **Aucune exécution réussie de Foundation n'est revendiquée ici.**
- Le lint Quality est un blocage indépendant déjà observé ; les étapes aval ne doivent pas être marquées réussies tant qu'elles n'ont pas réellement tourné.
- TECH-001 à TECH-006 restent ouverts.
- PR #27 reste en brouillon et non fusionnée. Ce rapport ne donne aucune autorisation de fusion.
