# Réconciliation opérationnelle Foundation — vague 9

**Projet :** Vitalis  
**Lot :** A — réconciliation documentaire et fonctionnelle  
**Branche :** `reconcile/lot-a-2026-11`  
**Référence auditée :** commit `b0a9becfca073bf18c11fccc7a1f3cd16563073f`  
**Méthode :** inspection en lecture seule de l'arborescence, des routes, des politiques, des tests, du manifeste et du service worker.  
**Statut :** constats statiques ; aucun test navigateur, build ou contrôle de production exécuté dans cette passe.

## 1. Santé et disponibilité

| Chemin Foundation attendu | Artefact observé | Résultat |
|---|---|---|
| `src/lib/health.server.ts` | `src/lib/observability/health-policy.ts` | Politique de classification healthy/warning/critical présente, mais pas de vérification serveur des dépendances. |
| `src/routes/api/health/live.ts` et `ready.ts` | `src/routes/api/health.ts` | Une route unique renvoie toujours un statut HTTP 200 avec `status: ok`, le nom du service et un horodatage. Pas de séparation liveness/readiness. |
| Tests health dédiés | `tests/observability/health.test.ts`, `health-policy.test.ts` | Tests unitaires présents : réponse non mise en cache et classification des observations. Ils ne démontrent pas la disponibilité de PostgreSQL, Supabase, du worker ou d'autres dépendances. |

**Décision :** couverture partielle. Ne pas remplacer les chemins Foundation par un alias sans définir le contrat de disponibilité attendu et les dépendances que readiness doit réellement contrôler.

## 2. Performance et Web Vitals

- Le script réel est `scripts/check-performance-budgets.ts`, appelé par le script package `check:performance-budget` et inclus dans `check:release`.
- Les budgets sont centralisés dans `src/lib/performance/performance-policy.ts` et vérifiés par `performance-budget-policy.ts` : JS initial gzip 250 kB, CSS initial gzip 75 kB, ressources critiques gzip 500 kB.
- Les mesures LCP/INP/CLS sont collectées par `src/lib/performance/web-vitals.ts`, mais conservées dans un snapshot mémoire local. Les tests vérifient la classification et le comportement browser-safe, pas une agrégation p75 réelle.
- Le document canonique `docs/06-operations/performance-pwa.md` précise qu'une mesure locale n'est pas une preuve p75 en production. La source historique `PERFORMANCE_PWA.md` contient des jalons plus détaillés ; ne pas la retirer sans comparaison complète et vérification des liens entrants.

**Décision :** le chemin Foundation `performance-budget.json` n'est pas présent ; la politique existe en TypeScript. Équivalence partielle, car il n'existe pas de fichier JSON autonome ni de mesure p75 consolidée. Ne pas créer un fichier JSON vide ou un alias artificiel.

## 3. PWA, service worker et hors connexion

### Éléments présents

- `public/manifest.webmanifest` existe et référence les icônes SVG présentes.
- Les icônes PNG référencées par les métadonnées racine et par le service worker sont également présentes.
- `public/sw.js` existe. Il utilise le réseau en priorité pour les navigations, conserve un shell, met les assets en cache et exclut explicitement les routes `/api/` et `/_serverFn/` de son interception.
- Les routes `/`, `/flash`, `/radar`, `/espace` et `/talents` existent dans l'arborescence.

### Anomalie à vérifier

Le service worker déclare `OFFLINE_URL = "/offline.html"` et ajoute cette URL à `SHELL_URLS`, qui est chargé avec `cache.addAll()` lors de l'installation. **Aucun fichier `public/offline.html` n'existe dans l'arborescence auditée.**

Si le serveur renvoie 404 pour cette URL, `cache.addAll()` rejette et l'installation du service worker échoue. Si une réécriture SPA renvoie une page 200, le cache risque de stocker la page applicative générique au lieu d'une page offline dédiée. Le comportement réel doit être testé sur le serveur de préproduction ; le défaut de l'artefact offline dédié est confirmé.

### Écart avec la navigation produit décidée

Le shell PWA et les raccourcis du manifeste reflètent encore les routes `/espace` et `/talents`. La navigation produit validée pour Vitalis est désormais centrée sur **Réel, Flash, Scan, Radar et 2x2**. Le shell ne préchauffe pas de route Réel ni Scan, et le manifeste ne propose pas encore ces entrées. Il s'agit d'un écart de synchronisation entre décision produit et artefacts PWA, pas d'une raison pour modifier automatiquement les routes ou le service worker dans ce lot documentaire.

### Tests et duplication du point d'entrée

- `tests/pwa.test.ts` vérifie seulement que `registerServiceWorker` est exporté ; il ne teste pas le cache, le fallback offline, le manifeste, les icônes ou les mises à jour.
- Deux points d'entrée coexistent : `src/platform/pwa.ts` et `src/platform/pwa/index.ts`, ce dernier réexportant `install.ts` et `update.ts`. `src/routes/__root.tsx` importe `@/platform/pwa` sans extension. Le résolveur doit être vérifié avant toute consolidation ou suppression, car les deux implémentations exposent des API proches mais pas identiques.
- Aucun contrôle d'installation réelle sur appareil physique n'est démontré par ces seuls tests.

**Décision :** PWA de base présente, mais fallback offline dédié, tests de cycle de vie et alignement sur la navigation Vitalis restent à traiter. Aucune modification runtime n'est effectuée dans ce lot.

## 4. Registre des écarts et priorités proposées

| Priorité | Écart | Action requise |
|---|---|---|
| P0/P1 à confirmer en préproduction | `/offline.html` absent alors que le service worker le pré-cache | Tester la réponse HTTP exacte et ajouter/servir un fallback offline dédié après validation du comportement attendu. |
| P1 | Shell PWA et raccourcis manifestes non alignés sur Réel/Scan | Mettre à jour la matrice des routes PWA après validation des routes canoniques Vitalis. |
| P1 | Health unique et toujours 200, sans readiness des dépendances | Définir un contrat liveness/readiness et ses dépendances avant de créer des endpoints. |
| P1 | Collecte Web Vitals sans agrégation p75 démontrée | Définir la stratégie de mesure/agrégation, confidentialité, fenêtre et population ; ne pas assimiler snapshot mémoire à p75. |
| P2 | Tests PWA superficiels et deux implémentations de module PWA | Confirmer la résolution des imports, choisir un point d'entrée et ajouter des tests de service worker/cache/update. |
| P2 | Budget en TypeScript, pas de `performance-budget.json` | Garder le format TypeScript si c'est le contrat voulu, puis arbitrer explicitement le chemin Foundation. |

## 5. État de validation

- Aucun code, manifeste, service worker, script ou test n'a été modifié.
- Aucun build, test navigateur, audit Lighthouse, test d'installation ou contrôle de préproduction n'a été exécuté dans cette passe.
- Les observations ci-dessus sont des constats statiques, pas une certification PWA, performance, disponibilité ou production.
- Les chemins Foundation absents restent à arbitrer ; aucun chemin n'est supprimé.
- TECH-001 à TECH-006 restent ouverts.

**Prochaine étape recommandée :** compléter la réconciliation des chemins restants en recherchant les équivalences réelles et les liens entrants, puis préparer un lot runtime distinct pour les écarts PWA/health après validation de leurs contrats.
