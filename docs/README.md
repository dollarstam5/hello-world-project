# Vitala

Vitala est une application d’entraide locale mobile-first et offline-first. Cette fondation TanStack Start, React et Supabase protège les données par utilisateur, valide les transitions métier et synchronise les changements de façon explicite et idempotente.

## Développement local

Prérequis : Node.js 22+ et Bun 1.2+.

```sh
git clone <this-repository-url>
cd hello-world-project
cp .env.example .env.local
bun install
bun run dev
```

Les variables `VITE_*` sont publiques. Une clé service role, un jeton Cloudflare ou un secret cron doit rester exclusivement dans le coffre-fort du serveur.

## Contrôles

```sh
bun run security:secrets
bun run lint
bun run test:run
bun run build
```

`bun run check` enchaîne tous les contrôles bloquants. Consulter [`docs/QUALITY.md`](docs/QUALITY.md) pour la matrice P0, la CI et les règles de merge. L’application conserve un mode dégradé local lorsque l’IA externe n’est pas configurée.

La certification complète de la fondation s’exécute avec :

```sh
bun run certify:p0
```

La checklist Go/No-Go, le procès-verbal de préproduction et la frontière avec les modules P1 sont décrits dans [`docs/RELEASE_READINESS.md`](docs/RELEASE_READINESS.md).

Les tests multi-utilisateurs Supabase/RLS et les parcours de reconnexion sont documentés dans [`docs/INTEGRATION_TESTING.md`](docs/INTEGRATION_TESTING.md).

Les health checks, objectifs de service et procédures d’incident sont documentés dans [`docs/OPERATIONS.md`](docs/OPERATIONS.md).

Les budgets Web Vitals, contrôles PWA et scénarios mobile-first sont documentés dans [`docs/PERFORMANCE_PWA.md`](docs/PERFORMANCE_PWA.md).

Le premier module métier P1 fournit un profil membre protégé, une progression d’identité en quatre niveaux et des préférences rural/urbain et d’accompagnement. Son contrat est documenté dans [`docs/PROFILE_IDENTITY.md`](docs/PROFILE_IDENTITY.md).

L’authentification membre utilise Supabase PKCE, une récupération non énumérable et un onboarding progressif synchronisé. Voir [`docs/AUTH_ONBOARDING.md`](docs/AUTH_ONBOARDING.md).

Le module Flash permet de préparer des besoins hors ligne et protège leur publication par une commande serveur. Voir [`docs/FLASH_MODULE.md`](docs/FLASH_MODULE.md).

Le moteur Scan découvre les Flash proches sans exposer de coordonnées précises. Voir [`docs/SCAN_MODULE.md`](docs/SCAN_MODULE.md).

La stabilisation P1.4.1 remplace la vue publique dépendante des RLS par une fonction Supabase bornée qui n’expose que les champs publics. Le flux possède un repli IndexedDB hors ligne et le rafraîchissement Scan temps réel empêche les exécutions concurrentes.

Le moteur Radar dispose maintenant d’un contrat distinct des missions, d’une durée bornée entre 3 et 90 jours, d’une revalidation hebdomadaire et d’un cycle de vie privé protégé par RLS. Voir [`docs/RADAR_MODULE.md`](docs/RADAR_MODULE.md).

## Production

Consulter [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) pour les variables, migrations, vérifications PWA, procédures de rotation et rollback.
