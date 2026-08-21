# Ecosystem Super App — Plan directeur

Objectif : passer la fondation actuelle à une architecture **monorepo production**, avec un dashboard de gestion complet, un offline-first réel (Dexie + worker de sync), un backend séparé (Lovable Cloud), une PWA installable aux standards 2026, et une documentation de gouvernance opposable à tout humain ou IA qui touche au projet.

## Contraintes non négociables (appliquées partout)

- Aucun code temporaire, aucun mock jetable — uniquement du code production.
- Zéro logique métier dans les composants. Les composants reçoivent des props et appellent des hooks de domaine.
- L'UI ne lit ni n'écrit jamais Supabase. **L'UI lit Dexie.** Le worker de sync est le seul pont Dexie ↔ Cloud.
- Backend séparé : tables = données brutes, RLS = qui voit quoi, Edge/server functions = logique lourde, Storage = fichiers.
- Mobile-first, du petit écran (320 px) au très grand écran, langage produit humain (pas de jargon technique visible).

## Structure monorepo cible

```text
apps/
  web/            application TanStack Start (routes, layouts, widgets, shell)
packages/
  ui/             design system pur : tokens, primitives, motion. Zéro métier.
  core-db/        schéma Dexie, migrations, repositories typés, queries live
  core-logic/     règles métier pures, validation Zod, calculs, machines d'état
  core-sync/      worker de sync, file d'attente, résolution de conflits, client Cloud
  core-contracts/ types partagés UI ↔ DB ↔ backend (source unique de vérité)
supabase/         migrations SQL, RLS, edge functions (backend séparé)
docs/             documentation de gouvernance (PROJECT_BIBLE.md et annexes)
```

Sens des dépendances : `core-contracts → core-logic → core-db → core-sync → ui → apps/web`. Jamais l'inverse.

Note technique : la plateforme construit et sert l'app depuis la racine. Le monorepo utilise donc des **workspaces Bun** avec la racine comme workspace root ; `apps/web` reste le point d'entrée buildé. La migration se fait par packages, un par un, sans jamais casser le build.

## Flux de données (règle centrale)

```text
Écran ──lit──> hook de domaine ──lit──> Dexie (live query)
                                   ▲
                                   │ écrit
                          worker de sync (core-sync)
                                   │ ↕ HTTP/Realtime
                              Lovable Cloud (RLS, edge functions, storage)
```

Toute mutation utilisateur écrit d'abord dans Dexie + une file `outbox`, l'écran réagit immédiatement (optimiste), le worker pousse quand le réseau revient et réconcilie.

## Étapes

### Étape 1 — Socle monorepo
Workspaces Bun, création des packages vides mais réels (`ui`, `core-contracts`, `core-logic`, `core-db`, `core-sync`), alias TypeScript `@eco/*`, déplacement de l'app dans `apps/web`, migration du code existant vers `packages/ui` et `apps/web` sans régression. Build et typecheck verts à la fin.

### Étape 2 — Couche données offline-first
Schéma Dexie complet (users, udi, flash, missions, social, trust, media, notifications, audit…), repositories typés, hooks de lecture live, table `outbox` et `sync_state`. L'UI branchée sur Dexie uniquement.

### Étape 3 — Backend séparé
Activation de Lovable Cloud, migrations SQL avec GRANT + RLS par table, rôles utilisateurs dans une table dédiée, storage pour les médias, server functions pour la logique lourde. Aucun accès direct depuis l'UI.

### Étape 4 — Worker de sync
Web Worker dédié : push de l'outbox, pull incrémental par curseur, résolution de conflits (last-write-wins par champ + journal), backoff réseau, état de sync exposé calmement à l'UI (jamais anxiogène).

### Étape 5 — Dashboard de gestion
Shell d'administration + les 20 modules demandés (Home, Users, UDI, Flash, Missions, Social, Trust, Intelligence, Media, Notifications, Sync, Analytics, Security, Audit, Configuration, Database, API, Infrastructure, Support, Administration). Chaque module : route, hook de domaine, vues liste/détail/action, protégé par rôle côté serveur.

### Étape 6 — Responsive + langage humain
Grille adaptative testée de 320 px à ultra-wide, ergonomie pouce, foldables, tablettes, desktop. Passage complet des textes FR/EN en langage humain (« Vos échanges en attente » plutôt que « Sync queue: 3 pending »).

### Étape 7 — PWA installable standards 2026
Manifest complet, icônes maskable, service worker (précache app shell, runtime cache, background sync branché sur l'outbox), prompt d'installation natif, splash, mode standalone, raccourcis, share target. Aucune techno obsolète.

### Étape 8 — Documentation de gouvernance
`docs/PROJECT_BIBLE.md` : mission, architecture, sens des dépendances, règles absolues, flux de données, conventions de nommage, checklist de contribution, ce qui est interdit. Annexes : `DATA_MODEL.md`, `SYNC_PROTOCOL.md`, `DESIGN_LANGUAGE.md`, `BACKEND_RULES.md`, `CONTRIBUTING_AI.md` (instructions destinées aux agents IA). Mémoire projet mise à jour pour que toute future génération applique ces règles automatiquement.

## Ordre d'exécution

On avance étape par étape, une étape par message, avec typecheck et build verts avant de passer à la suivante. Étape 1 démarre dès validation.

## Points à confirmer

- Le dashboard de gestion est-il une section protégée de la même app (`/admin`) ou une seconde app du monorepo (`apps/admin`) ?
- Les 20 modules du dashboard : on livre les 20 coquilles fonctionnelles d'un coup à l'étape 5, ou par vagues (5 modules par message) ?
