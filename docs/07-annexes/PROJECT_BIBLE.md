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
  platform/        infrastructure technique transverse (offline, pwa, realtime, device, a11y…)
  features/        parcours utilisateur composés à partir des domaines et de platform
  domains/<nom>/   propriété métier : règles, données, événements, ui, hooks, model, api
  widgets/         composition de plusieurs domaines/features sans propriété métier
  routes/          entrées de route + composition uniquement
  app/bootstrap/   initialisation et cycle de vie applicatif
supabase/          migrations SQL, RLS, storage
docs/              cette documentation
```

Sens des dépendances (bas → haut) :

```text
core-contracts → core-logic → core-db → core-sync
shared → platform → features → domains → widgets → routes
```

Le haut importe le bas. **Jamais l'inverse.** Les domaines ne dépendent jamais des features, widgets ou routes.

### Propriété des responsabilités

- **shared** : primitives réellement génériques, sans vocabulaire ni règle métier.
- **platform** : infrastructure technique transverse (réseau, realtime, device, offline, permissions, observabilité, i18n), jamais de politique métier.
- **features** : parcours utilisateur qui orchestrent les domaines et platform ; elles ne possèdent pas les faits métier.
- **domains/<nom>** : source de vérité de ses données, invariants, règles, événements, états, services et contrats métier.
- **widgets** : composition de plusieurs capacités sans propriété métier.
- **routes** : entrée de navigation et composition.
- **app/bootstrap** : cycle de vie et composition initiale, sans logique métier.

Le caractère transversal ou réutilisé d'un module ne suffit pas à le classer dans platform ou shared. La propriété des données, des invariants et des décisions détermine son emplacement.

### Migration d'un ancien répertoire

Interdiction de déplacer un ancien dossier en bloc sans audit. Inventorier chaque fichier, responsabilités, imports entrants/sortants, consommateurs, exports, tests et effets de bord ; identifier son propriétaire réel ; scinder les responsabilités mélangées ; vérifier les dépendances ; migrer par lots cohérents ; mettre à jour consommateurs, tests, barrels et documentation ; conserver si nécessaire des façades legacy dépréciées sans logique dupliquée ; vérifier les imports résiduels et rapporter honnêtement les validations. Voir [ARCHITECTURE.md](../../ARCHITECTURE.md) pour la procédure complète.

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

- [ ] Le fichier est-il dans la bonne couche et le bon propriétaire métier ? (voir `ARCHITECTURE.md`)
- [ ] La feature orchestre-t-elle sans posséder les faits métier ?
- [ ] Platform reste-t-il technique, sans politique métier ?
- [ ] Les imports vont-ils uniquement vers les couches inférieures ?
- [ ] En cas de migration, chaque fichier a-t-il été audité individuellement ?
- [ ] Le composant est-il exempt de logique métier et d'appel réseau ?
- [ ] Les textes passent-ils par `useI18n` en FR **et** EN ?
- [ ] Les valeurs visuelles viennent-elles de tokens ?
- [ ] Les écritures passent-elles par un repository `@eco/core-db` (jamais Supabase directement) ?
- [ ] Toute nouvelle table a-t-elle `GRANT` + RLS + politiques dans la même migration ?
- [ ] Chaque route a-t-elle son `head()` propre (titre, description, og) ?
- [ ] Le composant respecte-t-il le plafond strict de 300 lignes maximum (hors lignes vides et commentaires) ?
- [ ] Le composant reste-t-il idéalement sous 200 lignes et est-il découpé par responsabilité avant d'approcher le plafond ?
- [ ] Typecheck et build verts ?

## 6. Règle de taille des composants

- **300 lignes maximum par composant**, sans exception pour les nouveaux composants.
- Viser moins de 200 lignes lorsque cela reste cohérent.
- Dès qu'un composant approche 300 lignes, extraire des sous-composants, hooks ou utilitaires cohérents, chacun avec une responsabilité claire.
- Ne pas déplacer artificiellement du code pour contourner la limite.
- ESLint signale actuellement les fichiers TSX dépassant 300 lignes pendant la réduction progressive de la dette existante.

## 7. Interdit

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
- [Langage de design canonique](./00-foundation/design-language.md)
- [BACKEND_RULES.md](./BACKEND_RULES.md)
- [CONTRIBUTING_AI.md](../05-ai/CONTRIBUTING_AI.md)
- [Gouvernance d'architecture](../../ARCHITECTURE.md)
- [Instructions agents](../../AGENTS.md)
