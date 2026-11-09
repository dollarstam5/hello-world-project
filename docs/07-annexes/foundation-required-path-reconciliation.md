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


## Quatrième vague — Auth, identité, onboarding, moteurs, synchronisation et notifications

### Auth et identité

- `src/domains/auth/services/auth.service.ts` implémente connexion par mot de passe, inscription, demande de réinitialisation et mise à jour du mot de passe via Supabase Auth.
- `src/domains/auth/model/useAuth.ts` observe la session Supabase et expose utilisateur/chargement. Le chemin réel est `model/useAuth.ts`, pas `hooks/useAuth.ts`.
- `src/routes/auth.tsx` rend `SignInView`. La récupération utilise une redirection vers `/reset-password`, mais aucune route dédiée de callback ou de récupération nommée comme dans Foundation n'a été trouvée. Le fichier `ResetPasswordView.tsx` existe ; il faut encore vérifier l'intégration de la route et le traitement complet des liens PKCE avant de conclure.
- Les contrats Auth attendus (`packages/core-contracts/src/auth.ts`), le schéma Zod dédié et les tests `tests/auth/auth-contract.test.ts` ne sont pas présents sous les chemins attendus.
- `src/lib/experience/identity.ts` décrit explicitement une fondation locale provisoire : tiers guest/identified/trusted, état Zustand en mémoire, raccordement backend annoncé pour une phase ultérieure. Ce n'est pas un profil persistant ni une preuve de vérification d'identité.
- Le store de session Auth et le store d'identité progressive sont donc deux mécanismes distincts ; ne pas les considérer comme une identité métier complète.

**Classement :** Auth de base présente ; callback/récupération complète, contrats et tests dédiés non démontrés ; identité/profil complet absent au niveau des preuves consultées.

### Onboarding

- `src/lib/experience/onboarding.ts` conserve un seul indicateur `eco.onboarding.v1` dans localStorage.
- `OnboardingSheet.tsx` est explicitement qualifié de shell minimal, affiché une fois par appareil, avec étapes métier à venir.
- Aucun contrat d'onboarding, parcours membre, migration SQL dédiée, politique RLS ou test de flux membre n'a été trouvé dans les chemins attendus.
- Ce comportement local ne satisfait pas à lui seul l'exigence d'onboarding membre synchronisé entre appareils ou attaché à un compte.

**Classement :** accueil d'orientation minimal présent ; onboarding membre V1 complet non démontré.

### Flash

- Le flux réel est composé de `FlashComposer`, `createFlash`, `useFlashFeed`, `getPublicFlashFeed`, `commandFlash` et `saveFlashLocation`.
- Le compositeur crée localement et s'appuie sur le worker de synchronisation pour publier lorsque le réseau revient. Le feed combine les lignes locales et la projection distante.
- Les contrats partagés `packages/core-contracts/src/flash.ts`, la logique `packages/core-logic/src/flash.ts`, le feed et le test de flux public existent.
- Plusieurs chemins Foundation demandent des schémas/mappers/hooks/UI/routes séparés qui ne correspondent pas à la structure actuelle. Leur absence exacte ne signifie donc pas que Flash est absent.
- La migration Drizzle Flash/Scan et la migration Supabase de projection publique ont des périmètres différents ; les tests actuels couvrent le feed public, pas toutes les transitions de cycle de vie et les écritures privées.

**Classement :** fondation Flash réelle et utilisable dans le dépôt ; équivalence partielle aux exigences Foundation concernant le cycle protégé, la séparation des couches et les tests dédiés.

### Scan

- Le contrat `packages/core-contracts/src/scan.ts`, la logique `packages/core-logic/src/scan.ts`, `scanNearby`, `useScan`, `ScanPanel` et la souscription Realtime existent.
- L'API valide latitude/longitude, rayon et limite ; elle délègue à une projection publique. Le hook classe les résultats et relance la recherche à la réception de changements Flash.
- La migration Drizzle `0000_flash_scan_public_functions.sql` contient les fonctions de recherche de proximité et d'écriture de position privée ; la migration Supabase `20260912009000_secure_public_flash_feed.sql` ne couvre que la projection publique Flash.
- Aucun service de géolocalisation dédié ni test SQL dédié de confidentialité Scan n'a été trouvé aux chemins Foundation. La capture/permission de position côté client et le traitement des refus doivent être vérifiés comme parcours utilisateur avant certification.
- Le schéma actuel autorise un rayon de 1 à 50 km dans l'API ; ce choix doit être comparé à la règle produit V1 décidée pour Vitalis avant toute validation fonctionnelle.

**Classement :** moteur Scan présent avec proximité et Realtime ; géolocalisation utilisateur, confidentialité de bout en bout, intégration migration Supabase et tests dédiés à compléter/arbriter.

### Radar

- Les contrats et la logique Radar partagés existent ; le schéma Zod et le mapper existent.
- La migration Supabase crée `radars`, active RLS, protège les champs et expose une fonction de commande ; le test pgTAP couvre brouillon privé, interdiction de mutation directe, activation autorisée, isolation entre membres et durée minimale.
- La route `/radar` actuelle rend une fondation de section avec emplacements « near » et « area » ; elle n'utilise pas un véritable composeur/liste/détail Radar.
- Aucun API server/functions, hooks de composition/liste, UI RadarComposer/RadarList/RadarView, route de création ou test de composition n'a été trouvé sous les chemins Foundation.
- Les tables/contrats sync incluent le type `radars`, mais les migrations de reçus divergent : Drizzle autorise `radars`, la migration Supabase de protocole ne l'autorise pas. Les tests de synchronisation génériques ne prouvent donc pas l'intégration offline Radar de bout en bout.
- Aucun service de matching, hook de correspondances, maintenance Radar ou notification Radar dédiée n'a été identifié ; le module notifications actuel est seulement une interface `NotificationSink` noop (canal in-app/push annoncé comme futur).

**Classement :** contrat, modèle, migration de cycle de vie et test RLS présents ; expérience Radar complète, création/liste, sync offline propre à Radar, matching et notifications non démontrés.

### Synchronisation offline

- `packages/core-sync/src/engine.ts` implémente push avant pull, outbox, reprises avec backoff, quarantaine, pagination plafonnée à 20 pages et statut offline.
- `packages/core-sync/src/transport.ts` valide les réponses de transport et distingue erreurs d'authentification, réseau et protocole.
- `src/platform/offline/sync-controller.ts` relie session Supabase, worker, scope local par propriétaire, reprise à l'événement online et au retour au premier plan.
- `tests/sync/engine.test.ts`, `tests/sync/protocol.test.ts` et `tests/sync-validation.test.ts` couvrent des invariants importants : push avant pull, aucune requête transport hors ligne, plafond de pagination, validation stricte et refus des champs protégés.
- Les tests E2E de reconnexion, récupération de conflit et isolation de base locale attendus par Foundation ne sont pas présents aux chemins demandés. La divergence des migrations et l'absence d'une preuve d'exécution sur base Supabase empêchent de conclure à une chaîne serveur complète et cohérente.

**Classement :** moteur de synchronisation client et tests unitaires présents ; tests E2E, résolution de conflits en conditions réelles, isolation multi-compte et cohérence des migrations serveur à prouver.

### Notifications

- `src/platform/notifications/index.ts` expose un contrat `NotificationSink` et une implémentation noop. Le commentaire indique que les canaux in-app et push sont à venir.
- Le composant `NotificationsTab.tsx`, les tests de notifications Radar et les services de correspondance ne sont pas présents dans l'arbre.
- Les notifications figurent dans le protocole de synchronisation et dans le test SQL RLS transversal, mais cela ne démontre ni centre de notifications utilisable, ni compteur non-lu, ni préférences, ni livraison push.
- Cette fondation ne couvre pas non plus le centre de communication Vitalis validé : cloche unique avec parcours notifications, messages liés à une action/mise en relation et communication avec l'assistance.

**Classement :** contrat technique noop seulement ; centre de notifications et parcours de cloche V1 non implémentés dans les preuves examinées.

### Synthèse de cette vague

| Domaine | Classement |
|---|---|
| Auth | Partiel — authentification de base présente, callback/récupération complète et contrats dédiés non démontrés |
| Identité / profil | Insuffisant — store local explicitement provisoire, pas de profil persistant démontré |
| Onboarding | Insuffisant — simple flag local et feuille d'accueil minimale |
| Flash | Partiel avancé — flux local/distant et contrats présents, migrations/tests lifecycle incomplets |
| Scan | Partiel avancé — recherche de proximité et Realtime présents, géolocalisation/confidentialité/chaîne DB à compléter |
| Radar | Partiel — contrat et cycle de vie SQL testable présents, UX et sync/matching absents |
| Synchronisation | Partiel avancé — moteur client et tests unitaires présents, E2E et cohérence serveur à prouver |
| Notifications | Insuffisant — interface noop, pas de centre fonctionnel ni de tests de livraison |

**Précaution de périmètre produit :** les chemins et comportements ci-dessus sont ceux du dépôt historique `main` examiné. Ils ne doivent pas être confondus avec les spécifications Vitalis validées plus récemment dans la conversation (navigation Réel/Flash/Scan/Radar/2x2, profil, cloche à trois parcours, onboarding progressif). Une matrice de conformité Vitalis doit comparer explicitement ces décisions produit aux fondations techniques avant toute proposition de code.

**Aucune migration, route, fonctionnalité ou référence Foundation n'a été supprimée ou modifiée durant cette vague.** Les conclusions sont documentaires ; aucun test ni workflow n'a été exécuté.


---

## Vague 5 — réconciliation produit Vitalis / implémentation actuelle

**Référence technique :** arbre Git de `main` à `86f4f43cbd6942a8e7df95d3ce53c3db9634a7fb`, fichiers sources relus dans cette référence.  
**Référence produit :** décisions validées dans les échanges Vitalis, notamment navigation Réel/Flash/Scan/Radar/2x2, onboarding progressif, profil et cloche de communication.

### 1. Navigation principale

| Décision produit validée | Preuve actuelle dans le dépôt | État |
|---|---|---|
| Barre principale Réel, Flash, Scan, Radar, 2x2 | `src/components/app/BottomNav.tsx` contient bien cinq entrées : Réel (clé i18n, route `/`), Flash, Scan, Radar et menu 2x2 | Partiel |
| Chaque moteur ouvre son propre espace | Flash et Scan ont leurs routes dédiées ; Radar a une route mais seulement deux sections Foundation vides ; Réel renvoie vers la Home Foundation | Partiel |
| 2x2 ouvre un espace de catégories | Le bouton ouvre `MenuSheet`, qui ne propose actuellement que Espace et Talents | Partiel |
| Profil accessible depuis l'en-tête | `AppHeader.tsx` relie l'icône profil à `/espace` | Présent comme point d'entrée, profil fonctionnel non démontré |
| Langue visible dès le premier écran | Aucun sélecteur de langue visible dans `AppHeader.tsx` ni `BottomNav.tsx` | Non démontré / écart |

**Constat important :** le libellé de l'onglet d'accueil est « Réel », mais sa destination est `/` et son composant est `HomeFoundation`. Cela ne démontre pas encore une page Réel opérationnelle séparée de la Home explicative et de la Home interactive attendues dans le parcours produit.

### 2. Home et première utilisation

| Décision produit validée | Preuve actuelle | État |
|---|---|---|
| Première utilisation : onboarding avant la Home explicative | `AppShell` monte `OnboardingSheet` globalement ; le store `onboarding.ts` hydrate un seul flag localStorage | Partiel |
| Onboarding explique le fonctionnement de Vitalis | `OnboardingSheet.tsx` affiche trois intitulés Flash/Radar/Découverte et deux actions ignorer/démarrer ; le commentaire précise que les étapes réelles viendront plus tard | Insuffisant |
| Après explication, l'utilisateur déclenche une demande d'identification | Aucun déclenchement ni formulaire de demande d'identification démontré dans les fichiers examinés | Non démontré |
| Après saisie, arrivée sur la Home d'interaction | `HomeFoundation.tsx` affiche des sections Flash/Radar/Feed/Découverte, avec états vides ; aucun état de parcours conditionnel identifié | Non conforme à la séquence validée / à construire |
| Distinguer Home explicative et espace Réel actif | Une seule route racine et un seul composant `HomeFoundation` observés | Non démontré |

Le flag d'onboarding est local au navigateur/appareil ; il ne constitue ni un état de compte synchronisé ni une preuve d'identification.

### 3. Cloche et communication

| Décision produit validée | Preuve actuelle | État |
|---|---|---|
| Une seule cloche ouvre une fenêtre regroupant trois parcours | `AppHeader` ouvre `CommunicationSheet`, monté dans `AppShell` | Présent |
| Parcours notifications | Onglet présent, contenu actuellement vide | Structure seulement |
| Parcours messages / conversations | Onglet présent, contenu actuellement vide | Structure seulement |
| Parcours assistance | Onglet actuellement nommé Assistant ; il monte `AssistantTab` | Partiel, équivalence avec assistance à valider |
| Pas de messagerie libre ; conversation liée à une action / mise en relation | Le composant ne démontre ni règles d'ouverture de conversation ni rattachement à une action | Non démontré |
| Compteur, état non lu, préférences et livraison des notifications | `src/platform/notifications/index.ts` n'expose qu'un contrat `NotificationSink` et `noopNotifications` | Non démontré |

L'ordre technique actuel des onglets est Notifications / Assistant / Conversations. La décision produit parle des parcours notifications / messages / assistance ; l'ordre et les libellés finaux doivent rester alignés sur la spécification canonique avant implémentation.

### 4. Profil et identité

- `AppHeader.tsx` donne accès à `/espace`, mais les fichiers examinés ne prouvent pas un profil persistant complet.
- `src/domains/profile/index.ts` réexporte le store d'identité.
- `src/lib/experience/identity.ts` décrit explicitement un placeholder Zustand local, sans branchement backend réel.
- L'authentification Supabase existante ne doit pas être assimilée à une identité vérifiée ou à un profil membre complet.

**Classement :** accès profil présent ; identité progressive locale provisoire ; profil persistant, préférences et preuve de confiance non démontrés.

### 5. Réconciliation des totaux Foundation — correction de méthode

Le script `src/scripts/check-foundation.mjs` contient une liste explicite de **145 chemins uniques** dans `requiredFiles`. La comparaison exacte de ces chemins avec l'arbre Git de référence `86f4f43cbd6942a8e7df95d3ce53c3db9634a7fb` donne :

- **32 chemins présents exactement** ;
- **113 chemins absents à l'emplacement attendu** ;
- **145 chemins distincts contrôlés**.

Le total de 146 obtenu lors d'une extraction antérieure incluait à tort la chaîne d'import `node:fs/promises`, qui n'est pas un chemin Foundation. Le total de 51 présents / 94 absents mentionné dans une synthèse précédente n'est pas reproductible par la comparaison exacte de la liste du script à l'arbre Git. Il ne doit donc plus être utilisé comme total de présence exacte. Des fichiers équivalents peuvent exister à d'autres chemins : ils doivent être comptabilisés séparément comme « candidat équivalent », avec revue de contenu et de responsabilité, jamais comme « présent exact ».

**Limite :** ce comptage vérifie l'existence des chemins dans l'arbre Git ; il ne lance pas le script dans un checkout local et ne valide ni les tests, ni la qualité fonctionnelle, ni la chaîne de migrations.

### 6. Conclusion de cette vague

Les éléments de navigation et les surfaces de communication sont partiellement amorcés, mais plusieurs décisions Vitalis validées ne sont pas encore prouvées dans le code : page Réel distincte, Home à deux états et parcours d'identification, séquence d'onboarding explicative, sélecteur de langue visible, contenu réel des trois parcours de la cloche, et règles de conversations attachées à une action.

**Aucune correction de code, migration, suppression ou modification de `main` n'a été effectuée.** Cette vague ajoute uniquement des constats documentaires à la branche de réconciliation.


---

## Vague 6 — classification des candidats équivalents

**Méthode :** recherche dans l'arbre Git de référence `86f4f43cbd6942a8e7df95d3ce53c3db9634a7fb`. La présence d'un candidat sous un autre chemin ne vaut pas équivalence validée sans comparaison de contenu, couverture de tests et responsabilité.

| Groupe de chemins Foundation absents | Candidats repérés ailleurs | Classement provisoire | Écart restant / preuve requise |
|---|---|---|---|
| Profil : contrats, schéma, API, hooks, UI, route, migration préférences, RLS, tests | `src/domains/profile/index.ts`, `src/lib/experience/identity.ts`, migrations identité/trust, documentation `identity-model.md` et UDI | Équivalent partiel | Store identité explicitement local/provisoire ; pas de profil persistant, préférences ni tests RLS dédiés démontrés |
| Auth : contrats, schéma, hooks, vues, callback/recovery, tests | `src/domains/auth/services/auth.service.ts`, `src/domains/auth/model/useAuth.ts`, `SignInView.tsx`, `ResetPasswordView.tsx`, `src/routes/auth.tsx`, tests auth existants | Équivalent partiel | Authentification présente, mais chemins callback/recovery dédiés et contrat central absent ; vérifier le traitement PKCE / recovery de bout en bout |
| Onboarding membre : contrat, logique, composant, hook, migration, RLS, tests | `OnboardingSheet.tsx`, `src/lib/experience/onboarding.ts`, `src/features/onboarding/index.ts` | Non équivalent pour le parcours membre | Flag local mono-appareil et feuille d'accueil minimale ; pas de persistance serveur, étapes métier ou tests de parcours |
| Flash : schéma, mapper, hook composer, vue, route création, migration lifecycle, tests | contrats et logique `flash.ts`, API server/functions, `FlashComposer.tsx`, `FlashFeed.tsx`, route `/flash`, migration feed public, tests feed/intention | Équivalent partiel substantiel | Les contrats et l'interface existent sous une autre organisation ; le cycle de vie complet, les transitions privées et la couverture RLS dédiée restent à prouver |
| Scan : schéma, service géolocalisation, vue, route, migration confidentialité, tests privacy | contrats/logique `scan.ts`, API server/functions, `useScan.ts`, `ScanPanel.tsx`, service realtime, fonctions SQL Drizzle `0000_flash_scan_public_functions.sql` | Équivalent partiel | Pas de service géolocalisation dédié au chemin attendu ; la migration Supabase publique ne remplace pas les fonctions privées Drizzle ; test SQL de confidentialité dédié absent |
| Radar : contrats, lifecycle, offline sync, API, hooks, composer/list/view, matching, notifications, maintenance | contrats/logique Radar, schema/mapper, route `/radar`, migration Supabase lifecycle, test RLS lifecycle | Équivalent partiel limité | Pas de parcours composer/list/detail, matching, notifications Radar, maintenance ni sync offline complet démontré ; la page actuelle reste Foundation |
| Santé / observabilité | `src/routes/api/health.ts`, `src/lib/observability/health-policy.ts`, tests health et policy | Équivalent partiel | Endpoint health simple présent ; routes live/ready distinctes et tests correspondants absents |
| Rétention / maintenance | `src/lib/maintenance/retention-policy.ts`, tests de politique | Équivalent partiel | Politique et tests présents, mais pas d'exécuteur serveur, cron, migration de rétention ni test d'exécution |
| Performance / Web Vitals | `scripts/check-performance-budgets.ts`, politiques performance, `src/lib/performance/web-vitals.ts`, tests associés | Équivalent partiel | Budgets et instrumentation présents sous d'autres chemins ; pas de preuve de données p75 réelles en production ni de contrôle E2E Foundation |
| PWA / offline | `src/platform/pwa.ts`, `src/platform/pwa/*`, `src/platform/offline/*`, tests PWA et offline | Équivalent partiel | Enregistrement et fonctions PWA présents ; tests existants limités, pas de preuve E2E mobile complète ni page offline dédiée |
| Migrations SQL attendues sous `supabase/migrations` | Plusieurs migrations sous `src/supabase/migrations`, migrations historiques sous `drizzle/migrations` | Divergence de source/emplacement | Ne pas déplacer ni dupliquer avant décision sur la chaîne canonique. Les migrations Drizzle et Supabase ne sont pas toutes équivalentes ; divergences sync receipts déjà identifiées |
| Tests SQL attendus sous `supabase/tests/database` | Tests existants sous `src/supabase/tests/database` et `supabase/tests/database` | Équivalent partiel / divergence | Quelques tests RLS ciblés existent, mais les chemins attendus et la couverture complète ne correspondent pas ; exécution effective non prouvée |

### Décisions de réconciliation à ne pas prendre automatiquement

1. Ne pas créer des fichiers alias uniquement pour satisfaire les chemins Foundation.
2. Ne pas déplacer les migrations Drizzle ou Supabase avant d'avoir déterminé la source de vérité et l'ordre d'exécution.
3. Ne pas considérer un contrat TypeScript comme preuve d'une validation serveur, d'une politique RLS ou d'un parcours utilisateur complet.
4. Ne pas considérer un test unitaire de politique comme preuve d'une exécution cron, d'un test E2E ou d'une mesure p75 en production.
5. Ne pas fermer les TECH-001 à TECH-006 sur la seule base de cette réconciliation documentaire.

### Résultat provisoire

Les 113 chemins absents exacts ne sont pas 113 fonctionnalités inexistantes. Plusieurs groupes disposent d'implémentations alternatives ou partielles ; les lacunes les plus nettes concernent le parcours onboarding membre, le profil persistant, les flux Radar complets, la communication/notifications opérationnelles, les exécuteurs de maintenance et les preuves E2E / exploitation.

**Statut de cette vague :** classification documentaire provisoire. Les équivalences ne sont pas toutes confirmées par une comparaison exhaustive fichier-à-fichier ; aucune suppression, migration, modification de code ou intervention sur `main` n'est autorisée par cette étape.


---

## Vague 7 — audit approfondi de la chaîne SQL, des migrations et des tests RLS

**Référence examinée :** branche `reconcile/lot-a-2026-11`, état consulté pendant cette vague.  
**Périmètre :** configuration Supabase, scripts npm/Bun, workflow CI, migrations Supabase, migrations Drizzle et tests pgTAP.  
**Nature :** audit statique des fichiers et de leur raccordement. Aucun SQL n'a été appliqué et aucun test de base n'a été lancé depuis cette vague.

### 1. Inventaire des chaînes et registres

| Emplacement | Éléments constatés | Rôle / limite |
|---|---|---|
| `supabase/migrations/` | 3 migrations historiques : schéma de base/RLS, privilèges/fonctions, politiques Storage | Seul dossier de migrations Supabase standard présent sous la racine attendue par la configuration examinée |
| `src/supabase/migrations/` | 6 migrations datées : identité, missions, synchronisation, assistant, feed Flash, cycle Radar | Aucun paramètre de configuration Supabase observé ne redirige vers ce dossier ; aucune preuve qu'il soit chargé par la CLI |
| `drizzle/migrations/` | 3 migrations numérotées | Chaîne distincte, suivie par `drizzle/migrations/meta/_journal.json` |
| `supabase/tests/database/` | 1 test SQL transversal : `rls_core.test.sql` | Dossier de tests SQL détecté par le script de contrôle |
| `src/supabase/tests/database/` | 2 tests SQL ciblés : Flash public (8 assertions) et Radar lifecycle (10 assertions) | Dossier non ciblé par le script `check:db-tests` examiné |

Le fichier `supabase/config.toml` ne contient que `project_id`. Aucun chemin personnalisé de migrations ou de tests n'y est déclaré. Le fichier `drizzle.config.ts` déclare explicitement `./drizzle/migrations` comme sortie Drizzle et utilise `drizzle/schema.ts`.

**Conclusion : aucune source de vérité unique n'est établie par la configuration du dépôt.** Il existe au moins deux registres de migrations distincts, plus un dossier Supabase non standard. Il serait dangereux de déplacer ou fusionner ces fichiers sans décider d'abord quelle chaîne a été appliquée sur chaque environnement.

### 2. Raccordement réel des scripts et de la CI

Les scripts examinés dans `package.json` indiquent :

- `test:db` exécute `supabase test db`.
- `check:db-tests` vérifie uniquement l'existence de fichiers `*.test.sql` sous `supabase/tests/database`.
- `check:db-tests` ne vérifie ni `src/supabase/tests/database`, ni le contenu des migrations, ni leur présence dans un registre.
- Le workflow `.github/workflows/quality.yml` démarre Supabase, lance `check:db-tests`, puis `test:db`.

En l'absence d'une configuration de chemin personnalisé, les scripts et la CLI sont raccordés aux dossiers Supabase racine, pas aux dossiers `src/supabase/`. Le workflow contient donc bien une étape de tests RLS, mais **il ne fournit pas de preuve que les deux tests SQL ciblés sous `src/supabase/tests/database/` soient exécutés**.

Le contrôle `check:db-tests` est un contrôle de présence minimale, pas une validation de couverture : un seul fichier SQL racine suffit à le satisfaire. La présence du test `rls_core.test.sql` ne prouve pas que les tests Flash/Radar placés sous `src/` soient lancés.

### 3. Anomalie bloquante dans la migration Missions

Le fichier `src/supabase/migrations/20260912001000_secure_mission_transitions.sql` commence par :

- un titre Markdown (`## 8. Nouvelle migration Supabase`) ;
- une référence textuelle à `supabase/migrations/20260912001000_secure_mission_transitions.sql` ;
- une clôture de bloc Markdown après le SQL.

Le contenu SQL est donc encapsulé dans un bloc de documentation au lieu de constituer un fichier SQL brut. **Ce fichier, tel qu'il est versionné, n'est pas une migration SQL exécutable telle quelle.**

Le SQL inclus définit pourtant des contraintes et une machine d'états de missions, des privilèges, des politiques RLS et des triggers d'audit. Il ne faut donc ni ignorer silencieusement le fichier, ni considérer ces protections comme actives. Il faut retrouver l'origine de la migration et déterminer si une version brute existe dans un autre environnement avant toute correction.

### 4. Dépendances et collisions entre migrations

#### 4.1 Radar — deux créations de la même table

- `drizzle/migrations/0001_create_radars_table.sql` crée `public.radars`.
- `src/supabase/migrations/20260912010000_secure_radar_lifecycle.sql` crée également `public.radars`.

Les définitions sont très proches, mais les fichiers appartiennent à deux chaînes distinctes. Si les deux étaient appliqués sur la même base sans mécanisme de convergence, la seconde création pourrait échouer sur l'existence de la table. La migration Supabase ajoute l'encapsulation transactionnelle explicite ; le journal Drizzle enregistre séparément son propre ordre.

**Décision :** ne pas appliquer les deux chaînes ensemble et ne pas supprimer l'une des deux avant d'avoir établi l'historique réel de chaque base.

#### 4.2 Reçus de synchronisation — divergence fonctionnelle confirmée

| Élément | Drizzle 0002 | Supabase 20260912002000 |
|---|---|---|
| Valeurs autorisées pour `logical_table` | Inclut `radars` | N'inclut pas `radars` |
| RLS | Activée | Activée |
| Lecture / insertion propriétaire | Politiques propriétaire | Politiques propriétaire |

La divergence est fonctionnelle et directement liée à l'intégration offline Radar. Un client qui émet des reçus pour Radar ne peut pas être considéré compatible avec la contrainte SQL Supabase actuelle.

#### 4.3 Flash / Scan — périmètres et dépendances différents

- Drizzle `0000_flash_scan_public_functions.sql` ajoute les colonnes Flash `kind`, `category`, `time_slot`, `area_label`, `latitude`, `longitude`, `accuracy_meters`, puis les fonctions `list_public_flashes`, `scan_public_flashes`, `transition_flash` et `set_flash_location`.
- Supabase `20260912009000_secure_public_flash_feed.sql` ne définit que la projection publique `list_public_flashes` et supprime l'ancienne vue publique.

La migration Supabase 090 sélectionne des colonnes ajoutées par Drizzle 0000, mais aucun ordre commun entre ces deux chaînes n'est établi. Si la migration 090 était exécutée sans que les colonnes soient déjà présentes, elle échouerait. Elle ne remplace pas non plus les fonctions Scan et de gestion de position privée.

### 5. Incompatibilité entre les tests RLS racine et les migrations récentes

Le test racine `supabase/tests/database/rls_core.test.sql` utilise des assertions `policies_are` qui attendent notamment les anciennes politiques :

- profils : `own profile insert` ;
- UDI : `own identity readable`, `own identity insert`, `own identity update` ;
- missions : `own missions write`, `assignee advances mission`.

Or les migrations récentes examinées sous `src/supabase/migrations/` suppriment ou remplacent ces politiques :

- identité : suppression de `own profile insert` et des trois politiques UDI, puis création de `identity readable by owner and administrators` ;
- missions : suppression de `own missions write` et `assignee advances mission`, puis création de `mission author creates` et `mission participants update`.

Si ces migrations récentes étaient ajoutées à la chaîne racine sans adapter les assertions et les données de test, les assertions de noms de politiques du test transversal seraient incompatibles avec l'état final attendu. Ce point doit être résolu par une suite de tests alignée sur la version cible, pas en supprimant les contrôles de sécurité.

### 6. Couverture SQL : ce qui est prouvé et ce qui ne l'est pas

| Contrôle | Couverture constatée | Limite |
|---|---|---|
| RLS transversal | 40 assertions planifiées dans `rls_core.test.sql` | Attend les noms de politiques historiques ; ne couvre pas les nouvelles politiques Profile/UDI/Missions |
| Feed Flash public | 8 assertions planifiées dans le test 110 | Couvre la projection, les rôles et les limites ; ne teste pas le cycle complet Flash ni la confidentialité Scan |
| Cycle Radar | 10 assertions planifiées dans le test 120 | Couvre brouillon, activation, isolation et durée ; ne couvre pas l'idempotence offline, les conflits, le matching ou les notifications |
| Assistant hybride | Tables et fonctions SQL présentes dans la migration 03000 | Aucun test pgTAP dédié identifié dans les deux dossiers de tests examinés |
| Protocole de synchronisation | Table et politiques des reçus présentes dans les deux versions divergentes | Pas de test SQL dédié de propriété, rejeu, unicité/idempotence et prise en charge Radar identifié |
| Transitions Missions | SQL documenté dans un fichier mal formé | Pas de test SQL ciblé de machine d'états associé identifié dans les dossiers examinés |
| Scan / position privée | Fonctions dans la migration Drizzle 0000 | Pas de test SQL dédié de non-divulgation des coordonnées identifié |

Les nombres 40, 8 et 10 sont les plans d'assertions déclarés dans les fichiers, pas des nombres d'assertions réussies. Aucun résultat d'exécution n'a été observé dans cette passe.

### 7. Décisions de remédiation à préparer — sans exécution automatique

1. **Établir l'état des environnements** : récupérer, pour chaque base concernée, l'historique de migrations réellement appliquées (table d'historique Supabase/Drizzle, journaux de déploiement et commit déployé). Ne pas se fier au seul arbre Git.
2. **Choisir une chaîne canonique** : décider explicitement si Supabase CLI devient l'unique autorité, si Drizzle reste générateur/schema tool, ou si une autre séparation est voulue. Documenter la règle et les responsabilités.
3. **Réparer la migration Missions après traçabilité** : récupérer une version SQL brute approuvée, vérifier son hash et ses dépendances, puis préparer un correctif dédié.
4. **Converger les reçus sync** : arbitrer l'inclusion de `radars` en fonction du contrat sync réellement supporté et écrire des tests SQL d'idempotence.
5. **Aligner Flash/Scan** : définir l'ordre des colonnes et fonctions, les privilèges, les politiques et les tests de non-divulgation avant d'intégrer la projection publique.
6. **Aligner les tests RLS sur le schéma final** : assertions de politiques, accès positif/négatif, privilèges, triggers et transitions, avec tests dédiés Missions, Profile/UDI, Flash, Scan, Radar, reçus et assistant.
7. **Rendre la CI explicite** : faire échouer la vérification si une migration SQL attendue est mal formée ou non enregistrée, et garantir que tous les tests SQL canoniques sont exécutés par le workflow.

### 8. Statut de l'audit SQL approfondi

| Sujet | Statut |
|---|---|
| Chaîne Supabase racine identifiée | Confirmée |
| Chaîne Drizzle et journal identifiés | Confirmée |
| Dossier `src/supabase/migrations` non raccordé par la configuration observée | Confirmé statiquement |
| Migration Missions mal formée | Anomalie confirmée |
| Collision potentielle de création Radar | Confirmée au niveau des fichiers ; historique d'application inconnu |
| Divergence des reçus sync Radar | Confirmée |
| Dépendance colonnes Flash/Scan entre chaînes | Confirmée au niveau des fichiers ; ordre d'application inconnu |
| Incompatibilité des noms de politiques avec le test RLS racine | Confirmée statiquement |
| Exécution réelle des tests SQL ciblés sous `src/` | Non démontrée |
| État réel des bases de production/staging | Inconnu |
| Sécurité RLS globale validée | **Non validée** |

**Conclusion :** le dépôt ne permet pas encore de démontrer une chaîne SQL unique, reproductible et intégralement testée. La présence de migrations et de tests utiles est réelle, mais leur raccordement est incomplet et certaines définitions sont incompatibles entre elles. Aucune migration, aucun test, aucun script de CI et aucun fichier de code n'a été modifié dans cette vague ; seule cette annexe d'audit est complétée. Les TECH-001 à TECH-006 restent ouverts.


## Plan de remédiation associé

Le plan opérationnel fichier par fichier est disponible dans [`sql-remediation-plan-file-by-file.md`](./sql-remediation-plan-file-by-file.md). Il détaille les priorités P0/P1/P2, les corrections envisagées, les dépendances, les tests et les critères d'acceptation. Il reste documentaire : aucune remédiation SQL n'est autorisée ou exécutée par ce plan.


## Chantier 0 — inventaire des migrations par environnement

L'inventaire statique du dépôt et le protocole de collecte distant sont consignés dans [`sql-environment-migration-inventory.md`](./sql-environment-migration-inventory.md).

**Résultat à ce stade :** 3 migrations Supabase racine, 6 fichiers sous `src/supabase/migrations/` et 3 migrations Drizzle avec 3 entrées de journal. Le dépôt expose un seul `project_id` Supabase dans `supabase/config.toml`, mais ne permet pas d'identifier s'il correspond à dev, staging ou production. Les valeurs de `.env.example` sont des placeholders. Aucun historique de base distante n'a été consulté.

**Statut du chantier 0 : PARTIEL.** L'inventaire Git est établi. L'état d'application par environnement demeure inconnu et nécessite une collecte en lecture seule (`supabase migration list --linked` et/ou requêtes SELECT sur les historiques existants). Aucune commande d'application, de réparation ou de reset n'a été exécutée.


## Vague 8 — réconciliation fonctionnelle ciblée

La revue ciblée des migrations Profile/UDI, onboarding, Flash/Scan, Radar, reçus de synchronisation, tests RLS/CI et rétention est consignée dans [la réconciliation fonctionnelle — vague 8](./foundation-functional-reconciliation-wave-3.md). Elle confirme plusieurs couvertures partielles et divergences ; aucun chemin Foundation n'est retiré et aucune migration n'est modifiée.


## Vague 9 — santé, performance et PWA

La revue de santé/readiness, budgets de performance, Web Vitals, manifeste, service worker, fallback hors ligne et tests PWA est consignée dans [la réconciliation opérationnelle — vague 9](./foundation-operational-reconciliation-wave-4.md). Elle relève notamment l'absence de `public/offline.html` alors que le service worker le pré-cache, ainsi qu'un décalage des routes PWA avec la navigation Vitalis décidée. Aucun changement runtime n'a été effectué.


## Comparaison CI avec la référence main

**Preuve consultée :** logs GitHub Actions du workflow Quality.

| Référence | Commit / run | Résultat | Étape bloquante |
|---|---|---|---|
| `main` | `86f4f43cbd6942a8e7df95d3ce53c3db9634a7fb` — run `42134782410`, job `127620045713` | Échec | `Verify foundation and secrets`, pendant `bun run lint` |
| PR #34, version précédente | run `42542244158`, job `128919086523`, merge commit `355461e5c9c8ba878d37113884cf261dbdb21f21` | Échec | Même étape `Verify foundation and secrets`, pendant `bun run lint` |

Les deux logs rapportent **615 problèmes : 607 erreurs Prettier et 8 avertissements**, sur les mêmes 21 chemins de code. Aucun de ces chemins ne figure dans la liste des fichiers modifiés par la PR #34. La comparaison confirme que cet échec de lint préexiste à la PR et n'est pas introduit par le Lot A.

Conséquence : les étapes suivantes du workflow Quality (tests SQL, release/build et tests mobiles) ont été ignorées pour ces exécutions. Aucun résultat vert n'est donc disponible pour ces étapes. L'exécution Quality du HEAD actuel doit encore être observée séparément ; ne pas assimiler le diagnostic de référence à une validation de la nouvelle tête.
