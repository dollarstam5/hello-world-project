# Lot 5 — Audit profond de src/ (pré-migration)

Date: 2026-11-23
Branch: chore/architecture-folder-cleanup-2026-11
Statut: audit initial de structure et responsabilités; **aucun déplacement de code exécuté**.

## Inventaire observé
| Zone | Fichiers | Observation |
|---|---:|---|
| `src/domains/` | 135 | Domaine métier historique; présence de moteurs Flash, Scan, Radar, presence et domaines transversaux |
| `src/features/` | 5 | Façade/reexports discovery, presence, search, settings; documentation indique onboarding déplacé ou absent |
| `src/lib/` | 60 | Infrastructure et services transversaux mélangés (AI, API, app, communication, design, experience, i18n, maintenance, observability, performance, platform, sync, utilitaires) |
| `src/components/` | 104 | `app` (26), `experience` (24), `ui` (54); mélange composants génériques et composants métier |
| `src/widgets/` | 7 | Entrées de composition/facades sur smart-feed, AI layer, offline banner, smart state, section foundation, activity strip |
| `src/layouts/` | 7 | Adaptation et layouts mobile/tablette/desktop/ecosystem/modal |
| `src/app/` | 11 | Bootstrap, composition, providers, guards, shell et router; présence d'un dossier `app-shell` legacy |
| `src/platform/` | 24 | Façades systèmes: AI, realtime, offline, PWA, trust, monetization, analytics, i18n, notifications, permissions, device, accessibility |
| `src/shared/` | 12 | UI, components, utils, tokens, animations, constants, types, mocks, validators |
| `src/integrations/supabase/` | 7 | Adaptateurs Supabase présents sous intégrations |
| `src/routes/` | routes générées/manuelles | Répertoire TanStack Start obligatoire, à garder |
| `src/hooks/`, `src/services/`, `src/stores/` | 2, 2, 1 fichiers | Façades ou points de transition vers `lib`; ownership à confirmer |
| `src/supabase/`, `src/tests/` | présents | Zones de duplication/ownership à inventorier avant déplacement |

## Conflits et écarts prioritaires
1. **Deux gouvernances d'architecture** : `ARCHITECTURE.md` décrit shared → platform → features → domains → widgets → routes; le manifest cible shared → platform → modules → composition → app. Il faut décider et harmoniser la règle avant de migrer.
2. **Domains/features overlap** : `src/domains/presence` et `src/features/presence`, `discovery`, `search`, `settings`; les features sont des façades/entrypoints et leurs responsabilités doivent être confirmées avant fusion.
3. **Composants métier sous composants/app** : l'index exporte FlashCard, RadarCard, WalletCard, TrustCard ainsi que des primitives génériques. Les cartes métier doivent rejoindre leur module; les primitives restent shared.
4. **Platform façade vs lib** : `src/platform/index.ts` présente une façade, tandis que de nombreuses capacités restent `src/lib/*`. Distinguer infrastructure, services métier et orchestration; migrer progressivement sans déplacer la logique en bloc.
5. **Composition/widgets/layouts overlap** : `components/experience`, `widgets` et `layouts` décrivent des niveaux d'assemblage qui se chevauchent. Définir un owner et des frontières de dépendances avant déplacement.
6. **Legacy app-shell** : `src/app/app-shell` coexiste avec `src/app/shell`; inventorier exports/imports et supprimer la façade seulement après vérification.
7. **Platform namespaces** : `internationalization` (vs i18n dans lib) et `trust` (vs security/trust cible) sont des noms transitoires à normaliser après recherche d'import.
8. **Supabase et services/stores** : `integrations/supabase`, `src/supabase`, `src/services`, `src/stores`, `src/lib/api` et `src/lib/sync` nécessitent un mapping par responsabilité et une validation des alias/workspaces.

## Ordre de migration recommandé
- **5A — Dépendances et exports** : établir l'inventaire import/export (alias, relative, dynamic imports, barrels) et classer chaque fichier avec owner actuel/cible.
- **5B — Fondations partagées** : déplacer seulement les composants/constantes/types sans dépendance métier, valider le sens des imports.
- **5C — Platform** : migrer les systèmes transversaux depuis `lib` et `integrations`, en gardant compat exports.
- **5D — Modules métier** : domaines vers `src/modules`, regrouper presence/features après comparaison de contenu, traiter chaque moteur séparément.
- **5E — Composition** : widgets, layouts, composants expérience vers `src/composition`, puis aligner app/shell.
- **5F — Configuration/tests/services** : décider de l'ownership des hooks, stores, services, config, data, assets, tests et `src/supabase`; ne déplacer qu'après validation des chemins runtime.

## Garde-fous
- Aucun déplacement ni suppression dans ce Lot 5 audit initial.
- Ne pas renommer `src/routes/` ni modifier `routeTree.gen.ts`.
- Conserver les imports de compatibilité tant qu'ils ont des consommateurs.
- Migration atomique avec mises à jour imports, alias, tests et scripts.
- Lint, tests, typecheck, build et checks Supabase requis après chaque sous-lot; indisponibles dans cet environnement.

## Verdict
La nouvelle architecture a déjà une couche app/platform/shared, mais elle reste **une façade partielle** au-dessus de l'architecture legacy. Le prochain travail doit produire l'inventaire fichier-par-fichier des imports/exports et de l'ownership, puis un plan de migration atomique; les migrations de masse sont prématurées.
