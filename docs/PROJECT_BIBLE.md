# PROJECT BIBLE — Écosystème

Document de référence **opposable**. Toute personne ou IA qui touche à ce projet applique ces règles sans exception. En cas de doute : on ne devine pas, on relit ce document.

## 1. Mission

Une application unique, vivante, utilisable **même sans connexion**, installable comme une application native, avec un langage humain de bout en bout et un tableau de bord de gestion complet pour l'équipe.

## 2. Règles absolues

1. **Pas de code temporaire.** Aucun mock jetable, aucun `TODO` laissé en place, uniquement du code de production.
2. **Zéro logique métier dans les composants.** Un composant reçoit des props, affiche, et appelle un hook de domaine.
3. **L'UI ne parle jamais au backend.** L'UI lit et écrit **Dexie**. Le worker de synchronisation est le seul pont Dexie ↔ Cloud.
4. **Backend séparé.** Tables = données brutes · RLS = qui voit quoi · server functions = logique lourde · Storage = fichiers.
5. **Mobile-first**, de 320 px à ultra-wide, ergonomie pouce.
6. **Langage humain.** Aucun jargon visible ; tous les textes passent par `useI18n` (FR/EN).
7. **Aucune valeur visuelle en dur.** Couleurs, espacements, typographies : uniquement des tokens.
8. **Sens des dépendances respecté** (section 4). Une entorse = un refus de revue.

## 3. Architecture

```text
packages/
  core-contracts/  types partagés (source unique de vérité)
  core-logic/      règles métier pures (validation, fusion, calculs)
  core-db/         schéma Dexie, repositories, outbox
  core-sync/       moteur de synchronisation pur (store + transport injectés)
src/
  shared/          primitives génériques, zéro métier
  platform/        infra transverse (offline, pwa, realtime, device, a11y…)
  features/        parcours réutilisables (onboarding, recherche, réglages)
  domains/<nom>/   métier : ui, hooks, model, api, types
  widgets/         composition de plusieurs domaines
  routes/          entrées de route + composition uniquement
supabase/          migrations SQL, RLS, storage
docs/              cette documentation
```

Sens des dépendances (bas → haut) :

```text
core-contracts → core-logic → core-db → core-sync
shared → platform → features → domains → widgets → routes
```

Le haut importe le bas. **Jamais l'inverse.**

## 4. Flux de données

```text
Écran ──lit──> hook de domaine ──lit──> Dexie (live query)
                                   ▲
                                   │ écrit
                        worker de sync (@eco/core-sync)
                                   │ ↕ HTTP (/api/sync/pull, /api/sync/push)
                              Backend (RLS, storage)
```

Toute mutation : écriture locale Dexie + entrée `outbox` → l'écran réagit immédiatement → le worker pousse dès que le réseau revient et réconcilie.

## 5. Checklist de contribution

- [ ] Le fichier est-il dans la bonne couche ? (voir arbre de décision `ARCHITECTURE.md`)
- [ ] Le composant est-il exempt de logique métier et d'appel réseau ?
- [ ] Les textes passent-ils par `useI18n` en FR **et** EN ?
- [ ] Les valeurs visuelles viennent-elles de tokens ?
- [ ] Les écritures passent-elles par un repository `@eco/core-db` (jamais Supabase directement) ?
- [ ] Toute nouvelle table a-t-elle `GRANT` + RLS + politiques dans la même migration ?
- [ ] Chaque route a-t-elle son `head()` propre (titre, description, og) ?
- [ ] Fichier < 200 lignes (alerte > 300, refonte > 500) ?
- [ ] Typecheck et build verts ?

## 6. Interdit

- `react-router-dom` ou tout autre routeur.
- Import de `@supabase/*` depuis un composant, un widget ou une route.
- Couleurs/tailles en dur (`text-white`, `#0b0d11`, `p-[13px]`).
- Chaînes de caractères visibles écrites en dur.
- Logique métier dans `shared/` ou `platform/`.
- Édition de `src/routeTree.gen.ts` et des fichiers générés d'intégration.
- Table publique créée sans `GRANT` ni RLS.

## Annexes

- [DATA_MODEL.md](./DATA_MODEL.md)
- [SYNC_PROTOCOL.md](./SYNC_PROTOCOL.md)
- [DESIGN_LANGUAGE.md](./DESIGN_LANGUAGE.md)
- [BACKEND_RULES.md](./BACKEND_RULES.md)
- [CONTRIBUTING_AI.md](./CONTRIBUTING_AI.md)
