# Qualité et tests de Vitalis

Les contrôles de ce document sont obligatoires avant fusion vers `main`. Ils protègent les fondations P0 et doivent rester exécutables sans secret de production.

## Installation reproductible

Après toute modification de dépendance, régénérer `bun.lock` sur une machine connectée, l’examiner puis le versionner :

```sh
bun install
bun run check
```

La CI utilise ensuite `bun install --frozen-lockfile`. Elle doit échouer si `package.json` et `bun.lock` divergent.

## Commandes

| Commande | Rôle | Bloquante |
| --- | --- | --- |
| `bun run check:foundation` | Lint et tests Vitest du socle | oui |
| `bun run security:secrets` | Vérifie l'absence de fichier `.env` suivi par le dépôt | oui |
| `bun run test:run` | Exécute une fois tous les tests Vitest | oui |
| `bun run check:release` | Lint, tests, build, budgets, audit documentaire, reproductibilité et Go/No-Go | oui |
| `bun run build:check` | Construit l'application de production | oui |
| `bun run check:protocol` | Vérifie le protocole de synchronisation | selon changement |
| `bun run check:pwa` | Vérifie les exports et comportements PWA couverts | selon changement |
| `bun run check:web-vitals` | Vérifie le collecteur Web Vitals | selon changement |
| `bun run check:mobile-e2e` | Vérifie le contrat du smoke test mobile | selon changement |
| `bun run test:e2e` | Génère les captures Chromium aux viewports et routes de référence | oui en CI |
| `bun run test:db` | Exécute les tests PostgreSQL/pgTAP avec Supabase local | oui pour les changements DB |
| `bun run build` | Construit l'artefact de production | oui |
| `bun run check` | Enchaîne les contrôles bloquants du dépôt | oui |

`test:db` nécessite Supabase CLI et Docker ; démarrer la pile locale avec `supabase start`, puis l'arrêter avec `supabase stop`. Les tests ne doivent jamais cibler la production.

## Matrice P0

| Fondation | Protection vérifiée                                                              | Suite                                                                                                                                                    |
| --------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P0.1      | validation des mutations synchronisées par utilisateur                           | `tests/sync/`                                                                                                                                            |
| P0.2      | refus des champs système et secrets publics                                      | `tests/sync/`, `tests/config/`                                                                                                                           |
| P0.3      | RLS Supabase sur les tables synchronisées + politiques exactes                   | `supabase/tests/database/rls_core.test.sql`                                                                                                              |
| P0.4      | ordre push→pull, offline safety et limite de pagination                          | `tests/sync/engine.test.ts`                                                                                                                              |
| P0.5      | connaissance locale et règles de cache Vita                                      | `tests/assistant/`, `tests/security/`                                                                                                                    |
| P0.6      | environnement et en-têtes HTTP                                                   | `tests/config/`, `tests/security/`                                                                                                                       |
| P0.9      | corrélation, health, rétention et diagnostic offline                             | `tests/observability/`, `tests/offline/`                                                                                                                 |
| P0.10     | PWA, budgets, Web Vitals et écrans mobiles                                       | `tests/pwa.test.ts`, `tests/web-vitals.test.ts`, `tests/performance-policy.test.ts`, `tests/performance-budgets.test.ts`, `tests/mobile-e2e-contract.test.ts`, `scripts/test-mobile-e2e.sh`                                                                                                         |
| P0.11     | certification, reproductibilité, Go/No-Go et passage à P1                        | `tests/smoke/`, `docs/06-operations/release-readiness.md`                                                                                                              |
| P1.1      | profil, préférences, progression UDI et champs protégés                          | `tests/profile/`, `supabase/tests/database/70_profile_preferences_rls.test.sql`                                                                          |
| P1.2      | Auth PKCE, redirections internes et onboarding monotone                          | `tests/auth/`, `tests/onboarding/`, `supabase/tests/database/80_member_onboarding_rls.test.sql`                                                          |
| P1.3      | brouillons Flash, cycle protégé et projection anonyme                            | `tests/flash/`, `supabase/tests/database/90_flash_lifecycle_rls.test.sql`                                                                                |
| P1.4      | proximité privée, résultats anonymisés et Realtime                               | `tests/scan/`, `supabase/tests/database/100_scan_location_privacy.test.sql`                                                                              |
| P1.4.1    | projection publique bornée, limite de réponses uniforme et cycle Realtime stable | `tests/flash/public-flash-feed.test.ts`, `tests/scan/scan-realtime-stability.test.ts`, `supabase/tests/database/110_public_flash_feed_security.test.sql` |
| P1.5.1    | contrat Radar, durée 3–90 jours, cycle de vie privé et commandes protégées       | `tests/radar/`, `supabase/tests/database/120_radar_lifecycle_rls.test.sql`                                                                               |

Les politiques RLS PostgreSQL restent la frontière de sécurité. P0.3 vérifie désormais que les tables synchronisées ont RLS activé et que leur ensemble exact de politiques reste stable via pgTAP et `supabase test db`.

P0.4 couvre les invariants critiques du moteur de synchronisation : push avant pull, conservation des écritures hors ligne et arrêt sur la limite de sécurité de pagination. Les tests restent exécutables sans secret de production.

Les incidents, seuils d’alerte et objectifs de service sont définis dans [opérations](./operations.md).

Les budgets et la matrice mobile sont définis dans [performance PWA](./performance-pwa.md).

La décision finale Go/No-Go et les validations manuelles sont définies dans [préparation de release](./release-readiness.md). Un contrôle automatique vert signifie seulement « candidat Go » : la préproduction, le rollback et la validation humaine restent obligatoires.

## Règles de merge

- Une pull request ne peut pas fusionner si `Quality` ou `Dependency review` échoue.
- Aucun contournement par suppression d’un test, désactivation du scanner ou réduction d’une règle de sécurité sans justification revue.
- Les actions GitHub conservent `contents: read` et ne reçoivent aucun secret pour tester une pull request.
- Les clés utilisées dans le build CI sont des valeurs factices sans accès à Supabase.
- Une modification de migration exige un test de préproduction et une procédure de rollback documentée.

## Ajout d’un test

Placer le fichier sous `tests/<domaine>/` avec le suffixe `.test.ts` ou `.test.tsx`. Tester au minimum un parcours autorisé et un refus métier ou sécurité. Les tests doivent être déterministes : aucune API externe, heure réelle ou donnée personnelle.
