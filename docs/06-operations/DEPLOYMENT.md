# Déploiement de Vitalis

Ce guide décrit une mise en production reproductible. Les secrets ne doivent jamais être stockés dans Git, dans une variable `VITE_*`, ni dans les journaux applicatifs.

## 1. Prérequis

- Node.js 22+ et Bun 1.2+
- un projet Supabase avec sauvegardes et protection de branche activées
- un hébergeur HTTPS compatible avec le serveur TanStack Start
- facultatif : Cloudflare AI Gateway et un fournisseur IA

## 2. Variables d’environnement

Copier `.env.example` vers un fichier local ignoré par Git, puis renseigner les valeurs dans le coffre-fort de l’hébergeur.

| Variable                        | Portée     | Requise     | Usage                                                   |
| ------------------------------- | ---------- | ----------- | ------------------------------------------------------- |
| `VITE_SUPABASE_URL`             | navigateur | oui         | URL publique Supabase                                   |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | navigateur | oui         | clé publiable, jamais une clé secrète                   |
| `SUPABASE_URL`                  | serveur    | oui         | URL Supabase côté serveur                               |
| `SUPABASE_PUBLISHABLE_KEY`      | serveur    | oui         | validation des sessions utilisateur                     |
| `SUPABASE_SERVICE_ROLE_KEY`     | serveur    | oui         | opérations administratives protégées par RLS            |
| `CLOUDFLARE_ACCOUNT_ID`         | serveur    | non         | assistant IA externe                                    |
| `CLOUDFLARE_AI_API_TOKEN`       | serveur    | non         | jeton Cloudflare, toujours avec l’identifiant de compte |
| `CLOUDFLARE_AI_GATEWAY_ID`      | serveur    | non         | passerelle, valeur par défaut `vitala`                  |
| `AI_PRIMARY_MODEL`              | serveur    | non         | modèle principal compatible avec la passerelle          |
| `AI_FALLBACK_MODEL`             | serveur    | non         | modèle de secours                                       |
| `LOVABLE_CRON_SECRET`           | serveur + GitHub Actions | selon usage | authentification des tâches planifiées (32 caractères minimum) |
| `LOVABLE_CRON_SECRET_PREVIOUS`  | serveur    | non         | rotation sans interruption                              |
| `SYNC_RECEIPT_RETENTION_DAYS`   | serveur    | non         | conservation des reçus, 30 jours par défaut             |
| `AI_REQUEST_RETENTION_DAYS`     | serveur    | non         | conservation des métadonnées IA, 30 jours par défaut    |

Sans configuration IA, Vita continue de répondre avec sa connaissance locale hors ligne. Ne préfixer aucun secret avec `VITE_`.

## 3. Base de données

Dans Supabase Auth, limiter `Site URL` au domaine canonique et autoriser explicitement `/auth/callback` et `/auth/recovery` pour chaque environnement. Ne pas utiliser de joker couvrant un domaine tiers en production.

Appliquer **tous les fichiers** de `supabase/migrations/` dans l’ordre lexical de leur nom, sans en omettre ni les réordonner. La chaîne suivie dans ce dépôt contient actuellement 35 migrations. Les premières migrations fondatrices et les jalons de sécurité à repérer sont :

1. `20260826014443_34be03fd-4919-4cb4-9e11-76cf1df6bc73.sql` — tables métier initiales, rôles, profils, identité, médias, Flash, missions, publications, notifications et révisions Sync.
2. `20260827015340_3d7abfad-99ae-4fb5-9c02-60b6d4bd5103.sql` — privilèges d’exécution des fonctions fondatrices.
3. `20260827015418_ae5d6640-be69-4fd8-aed5-7f0d6c1426e4.sql` — politiques Storage pour les buckets avatars et médias.
4. `20260912002000_harden_sync_protocol.sql` — reçus d’idempotence du protocole Sync.
5. `20261113004000_secure_mission_transitions.sql` — sécurisation des transitions de mission.
6. `20261113005000_secure_hybrid_assistant.sql` — quotas IA, journal minimal et cache historique.
7. `20261113007000_protect_identity_trust_fields.sql` — protection des champs système d’identité et de confiance.
8. `20261117140000_operational_retention.sql` — purge des reçus et métadonnées opérationnelles.

Cette liste est un repère de lecture, **pas une sélection de migrations à appliquer** : les migrations intermédiaires et ultérieures sont également requises. Les noms ci-dessus doivent correspondre exactement aux fichiers présents dans `supabase/migrations/` sur le commit déployé. Vérifier ce manifeste avant toute exécution.

Exécuter d’abord la chaîne complète sur une base locale jetable avec Supabase CLI, puis sur une préproduction vierge ou réinitialisable. Tester les parcours d’authentification, de mission, de synchronisation, les politiques RLS, Storage et les fonctions RPC. Ne promouvoir en production que le même commit et le même lot validés en préproduction.

## 4. Vérifications avant publication

```sh
bun install --frozen-lockfile
bun run check:foundation
bun run security:secrets
bun run lint
bun run test:run
bun run check:protocol
supabase start
bun run test:db
supabase stop
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

Le workflow GitHub Actions `.github/workflows/operational-retention.yml` appelle automatiquement `POST /api/cron/maintenance` chaque jour à 03:17 UTC (et peut être lancé manuellement). Configurer les secrets du dépôt `VITALIS_APP_URL` (origine HTTPS de l'application) et `LOVABLE_CRON_SECRET` (32 caractères minimum). La route réutilise l'authentification cron commune et exécute le RPC réservé à `service_role`. Elle purge les reçus de synchronisation, les traces de requêtes IA, les événements de cache et les candidats expirés ; les connaissances promues sont conservées. Les fenêtres sont bornées entre 7 et 365 jours (30 jours par défaut). `LOVABLE_CRON_SECRET_PREVIOUS` permet une rotation temporaire côté hébergeur.

Après publication, vérifier `/api/health/live` puis `/api/health/ready`. Configurer les alertes et procédures selon [opérations](./operations.md).

Vérifier également l’installation, la mise à jour du service worker et les budgets selon [performance PWA](./performance-pwa.md).

## 6. Décision Go/No-Go

Exécuter `bun run check:release`, puis compléter la checklist de [préparation de release](./release-readiness.md). Toute erreur de verrou, de RLS, d’isolation, de sécurité, de build, de budget, de PWA ou de rollback impose un No-Go.

La promotion doit référencer un commit immuable et réutiliser le même artefact validé en préproduction. Conserver l’artefact précédent, vérifier sa compatibilité avec les migrations déjà appliquées et tester le rollback avant l’ouverture aux utilisateurs.

## 7. Rotation et incident

- Révoquer immédiatement toute clé exposée, puis rechercher son empreinte dans tout l’historique Git.
- Faire tourner la clé Supabase service role et le jeton Cloudflare dans leurs consoles respectives.
- Pour le cron, publier le nouveau secret comme `LOVABLE_CRON_SECRET` et conserver brièvement l’ancien dans `LOVABLE_CRON_SECRET_PREVIOUS`, puis supprimer l’ancien.
- Invalider les sessions si un jeton de signature ou d’authentification a pu être compromis.
- En cas de régression applicative, restaurer l’artefact précédent ; ne jamais annuler une migration destructive sans sauvegarde testée.
