# Qualité et tests de Vitala

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
| `bun run check:foundation` | vérifie les fichiers P0, migrations et 50 réponses locales minimum | oui |
| `bun run security:secrets` | détecte les signatures de clés et clés privées | oui |
| `bun run lint` | contrôle statique du code | oui |
| `bun run test:run` | exécute une fois les tests Vitest | oui |
| `bun run test` | mode interactif local | non |
| `bun run test:coverage` | produit le rapport de couverture | revue |
| `bun run test:offline` | teste déconnexion, reconnexion et conflits | oui |
| `bun run test:db` | exécute les assertions RLS pgTAP avec Supabase local | oui en CI |
| `bun run check:pwa` | valide manifeste, icônes et stratégie offline | oui |
| `bun run check:release` | vérifie les portes de sortie P0 et la cohérence du verrou | oui |
| `bun run build:check` | construit puis applique les budgets compressés | oui |
| `bun run test:e2e` | valide les écrans mobiles et le parcours offline | oui en CI |
| `bun run build` | construit l’artefact de production | oui |
| `bun run check` | enchaîne tous les contrôles bloquants | oui |
| `bun run certify:p0` | ajoute les parcours offline, RLS et navigateur au contrôle complet | oui avant release |

## Matrice P0

| Fondation | Protection vérifiée | Suite |
| --- | --- | --- |
| P0.1 | validation des mutations synchronisées par utilisateur | `tests/sync/` |
| P0.2 | refus des champs système et secrets publics | `tests/sync/`, `tests/config/` |
| P0.3 | rôles et transitions des missions | `tests/missions/` |
| P0.4 | structure, version et champs stricts du protocole | `tests/sync/` |
| P0.5 | connaissance locale et règles de cache Vita | `tests/assistant/`, `tests/security/` |
| P0.6 | environnement et en-têtes HTTP | `tests/config/`, `tests/security/` |
| P0.9 | corrélation, health, rétention et diagnostic offline | `tests/observability/`, `tests/offline/` |
| P0.10 | PWA, budgets, Web Vitals et écrans mobiles | `tests/pwa/`, `tests/performance/`, `tests/e2e/` |
| P0.11 | certification, reproductibilité, Go/No-Go et passage à P1 | `tests/smoke/`, `docs/RELEASE_READINESS.md` |
| P1.1 | profil, préférences, progression UDI et champs protégés | `tests/profile/`, `supabase/tests/database/70_profile_preferences_rls.test.sql` |
| P1.2 | Auth PKCE, redirections internes et onboarding monotone | `tests/auth/`, `tests/onboarding/`, `supabase/tests/database/80_member_onboarding_rls.test.sql` |
| P1.3 | brouillons Flash, cycle protégé et projection anonyme | `tests/flash/`, `supabase/tests/database/90_flash_lifecycle_rls.test.sql` |
| P1.4 | proximité privée, résultats anonymisés et Realtime | `tests/scan/`, `supabase/tests/database/100_scan_location_privacy.test.sql` |
| P1.4.1 | projection publique bornée, limite de réponses uniforme et cycle Realtime stable | `tests/flash/public-flash-feed.test.ts`, `tests/scan/scan-realtime-stability.test.ts`, `supabase/tests/database/110_public_flash_feed_security.test.sql` |
| P1.5.1 | contrat Radar, durée 3–90 jours, cycle de vie privé et commandes protégées | `tests/radar/`, `supabase/tests/database/120_radar_lifecycle_rls.test.sql` |

Les politiques RLS PostgreSQL restent la frontière de sécurité. Avant production, compléter ces tests unitaires par des tests d’intégration Supabase exécutés avec des utilisateurs distincts sur une base éphémère ou de préproduction.

Les suites correspondantes sont maintenant disponibles. Leur installation et leur modèle d’isolation sont décrits dans [`INTEGRATION_TESTING.md`](INTEGRATION_TESTING.md).

Les incidents, seuils d’alerte et objectifs de service sont définis dans [`OPERATIONS.md`](OPERATIONS.md).

Les budgets et la matrice mobile sont définis dans [`PERFORMANCE_PWA.md`](PERFORMANCE_PWA.md).

La décision finale Go/No-Go et les validations manuelles sont définies dans [`RELEASE_READINESS.md`](RELEASE_READINESS.md). Un contrôle automatique vert signifie seulement « candidat Go » : la préproduction, le rollback et la validation humaine restent obligatoires.

## Règles de merge

- Une pull request ne peut pas fusionner si `Quality` ou `Dependency review` échoue.
- Aucun contournement par suppression d’un test, désactivation du scanner ou réduction d’une règle de sécurité sans justification revue.
- Les actions GitHub conservent `contents: read` et ne reçoivent aucun secret pour tester une pull request.
- Les clés utilisées dans le build CI sont des valeurs factices sans accès à Supabase.
- Une modification de migration exige un test de préproduction et une procédure de rollback documentée.

## Ajout d’un test

Placer le fichier sous `tests/<domaine>/` avec le suffixe `.test.ts` ou `.test.tsx`. Tester au minimum un parcours autorisé et un refus métier ou sécurité. Les tests doivent être déterministes : aucune API externe, heure réelle ou donnée personnelle.
