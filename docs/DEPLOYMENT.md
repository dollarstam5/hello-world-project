# Déploiement de Vitala

Ce guide décrit une mise en production reproductible. Les secrets ne doivent jamais être stockés dans Git, dans une variable `VITE_*`, ni dans les journaux applicatifs.

## 1. Prérequis

- Node.js 22+ et Bun 1.2+
- un projet Supabase avec sauvegardes et protection de branche activées
- un hébergeur HTTPS compatible avec le serveur TanStack Start
- facultatif : Cloudflare AI Gateway et un fournisseur IA

## 2. Variables d’environnement

Copier `.env.example` vers un fichier local ignoré par Git, puis renseigner les valeurs dans le coffre-fort de l’hébergeur.

| Variable | Portée | Requise | Usage |
| --- | --- | --- | --- |
| `VITE_SUPABASE_URL` | navigateur | oui | URL publique Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | navigateur | oui | clé publiable, jamais une clé secrète |
| `SUPABASE_URL` | serveur | oui | URL Supabase côté serveur |
| `SUPABASE_PUBLISHABLE_KEY` | serveur | oui | validation des sessions utilisateur |
| `SUPABASE_SERVICE_ROLE_KEY` | serveur | oui | opérations administratives protégées par RLS |
| `CLOUDFLARE_ACCOUNT_ID` | serveur | non | assistant IA externe |
| `CLOUDFLARE_AI_API_TOKEN` | serveur | non | jeton Cloudflare, toujours avec l’identifiant de compte |
| `CLOUDFLARE_AI_GATEWAY_ID` | serveur | non | passerelle, valeur par défaut `vitala` |
| `AI_PRIMARY_MODEL` | serveur | non | modèle principal compatible avec la passerelle |
| `AI_FALLBACK_MODEL` | serveur | non | modèle de secours |
| `LOVABLE_CRON_SECRET` | serveur | selon usage | authentification des tâches planifiées |
| `LOVABLE_CRON_SECRET_PREVIOUS` | serveur | non | rotation sans interruption |
| `SYNC_RECEIPT_RETENTION_DAYS` | serveur | non | conservation des reçus, 30 jours par défaut |
| `AI_REQUEST_RETENTION_DAYS` | serveur | non | conservation des métadonnées IA, 30 jours par défaut |

Sans configuration IA, Vita continue de répondre avec sa connaissance locale hors ligne. Ne préfixer aucun secret avec `VITE_`.

## 3. Base de données

Dans Supabase Auth, limiter `Site URL` au domaine canonique et autoriser explicitement `/auth/callback` et `/auth/recovery` pour chaque environnement. Ne pas utiliser de joker couvrant un domaine tiers en production.

Appliquer les migrations Supabase dans l’ordre lexical. Les fondations P0 attendent notamment :

1. `20260912000000_protect_identity_trust_system_fields.sql`
2. `20260912001000_secure_mission_transitions.sql`
3. `20260912002000_harden_sync_protocol.sql`
4. `20260912003000_secure_hybrid_assistant.sql`
5. `20260912004000_operational_retention.sql`

Exécuter les migrations sur une base de préproduction, tester les parcours d’authentification, de mission et de synchronisation, puis promouvoir exactement le même lot en production.

## 4. Vérifications avant publication

```sh
bun install --frozen-lockfile
bun run check:foundation
bun run security:secrets
bun run lint
bun run test:run
bun run test:offline
bun run test:db
bun run build:check
bun run test:e2e
bun run check:release
```

Les workflows GitHub `Quality` et `Dependency review` doivent être requis dans les règles de protection de la branche `main`. Les critères complets sont détaillés dans [`QUALITY.md`](QUALITY.md).

`test:db` exige Supabase CLI et Docker et doit toujours cibler une pile locale ou une base de préproduction jetable, jamais la production.

Le manifeste, le service worker et les icônes doivent être servis par HTTPS. Vérifier l’installation PWA, un démarrage hors ligne après une première visite et l’absence de requête API mise en cache par le service worker.

## 5. Publication et contrôles

1. Déployer d’abord en préproduction avec des clés distinctes.
2. Vérifier `/`, `/flash`, `/radar`, `/espace`, l’assistant local et les routes de synchronisation.
3. Contrôler les en-têtes CSP, HSTS, `nosniff` et `Permissions-Policy`.
4. Publier progressivement et surveiller les taux HTTP 401, 409, 429 et 500 sans journaliser les corps de requête.
5. Conserver l’artefact précédent pour un rollback immédiat.

Planifier un appel `POST /api/cron/maintenance` avec `Authorization: Bearer <LOVABLE_CRON_SECRET>`. Une exécution quotidienne suffit ; la route est idempotente et les fenêtres acceptées sont bornées entre 7 et 365 jours.

Après publication, vérifier `/api/health/live` puis `/api/health/ready`. Configurer les alertes et procédures selon [`OPERATIONS.md`](OPERATIONS.md).

Vérifier également l’installation, la mise à jour du service worker et les budgets selon [`PERFORMANCE_PWA.md`](PERFORMANCE_PWA.md).

## 6. Décision Go/No-Go

Exécuter `bun run certify:p0`, puis compléter la checklist de [`RELEASE_READINESS.md`](RELEASE_READINESS.md). Toute erreur de verrou, de RLS, d’isolation, de sécurité, de build, de budget, de PWA ou de rollback impose un No-Go.

La promotion doit référencer un commit immuable et réutiliser le même artefact validé en préproduction. Conserver l’artefact précédent, vérifier sa compatibilité avec les migrations déjà appliquées et tester le rollback avant l’ouverture aux utilisateurs.

## 7. Rotation et incident

- Révoquer immédiatement toute clé exposée, puis rechercher son empreinte dans tout l’historique Git.
- Faire tourner la clé Supabase service role et le jeton Cloudflare dans leurs consoles respectives.
- Pour le cron, publier le nouveau secret comme `LOVABLE_CRON_SECRET` et conserver brièvement l’ancien dans `LOVABLE_CRON_SECRET_PREVIOUS`, puis supprimer l’ancien.
- Invalider les sessions si un jeton de signature ou d’authentification a pu être compromis.
- En cas de régression applicative, restaurer l’artefact précédent ; ne jamais annuler une migration destructive sans sauvegarde testée.
