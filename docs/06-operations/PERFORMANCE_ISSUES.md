# Performance — état vérifié et suivi

Ce document remplace les anciennes estimations et recommandations non vérifiées. Les chiffres ci-dessous ne sont pas des mesures de production : les tailles réelles doivent être lues dans le rapport du build et les seuils sont des garde-fous CI.

## Contrôles actuellement intégrés

- Core Web Vitals : LCP, INP et CLS sont observés côté navigateur (voir `src/lib/performance/web-vitals.ts`).
- Interactions et navigations : mesures locales côté navigateur (voir `src/lib/performance/interaction-navigation.ts`).
- Budgets du build : le script `scripts/check-performance-budgets.ts` calcule les tailles gzip des ressources initiales repérées dans les documents HTML générés.
- Release : `check:release` exécute `check:performance-budget`; la CI Quality exécute le contrôle de release.

## Seuils de référence

Les budgets sont définis dans `src/lib/performance/performance-policy.ts`.

| Mesure | Seuil |
| --- | ---: |
| JavaScript initial gzip | 250 kB |
| CSS initial gzip | 75 kB |
| Ressources critiques gzip | 500 kB |
| LCP sain | 2 500 ms |
| LCP critique | 4 000 ms |
| INP sain | 200 ms |
| INP critique | 500 ms |
| CLS sain | 0,10 |
| CLS critique | 0,25 |

Les tailles gzip utilisent le niveau de compression 9. Les seuils sont des limites de régression, pas des mesures de taille actuelle ni des garanties de performance perçue.

## Méthode et limites de mesure

- Le contrôle s'appuie sur les fichiers HTML du build client et déduplique les ressources par chemin.
- Les scripts d'entrée et les modules préchargés sont comptés dans le JavaScript initial.
- Les feuilles de style déclarées et les ressources préchargées reconnues sont comptées dans les ressources critiques.
- Une référence locale absente, un document HTML absent ou une entrée JavaScript introuvable fait échouer le contrôle afin d'éviter un résultat artificiellement bas.
- Les ressources chargées plus tard par navigation, import dynamique ou interaction ne font pas partie du budget initial.
- Le contrôle gzip mesure le poids transférable compressé, pas le coût d'exécution JavaScript, le TTFB ou le LCP.

## Exécution locale

```bash
bun run build
bun run check:performance-budget
```

La commande affiche un rapport JSON avec le répertoire contrôlé et les trois mesures gzip. Elle échoue si une limite est dépassée ou si les entrées nécessaires au calcul sont absentes.

## Suivi restant

- Conserver les rapports de build des versions candidates pour comparer les régressions.
- Examiner les ressources les plus lourdes avant toute optimisation ciblée.
- Ajouter une mesure Lighthouse reproductible seulement si elle peut tourner de manière stable et à coût raisonnable dans la CI.
- Ne pas appliquer les anciennes affirmations sur Radix, Framer Motion, CSS, Zustand ou l'authentification sans audit et mesures actuelles.

## Historique

- PERF-001 : collecte locale des Web Vitals.
- PERF-002 : calcul de l'INP par interaction groupée.
- PERF-003 : mesures locales des interactions et navigations.
- PERF-004 : fiabilisation des budgets de build et de leur contrôle CI.
