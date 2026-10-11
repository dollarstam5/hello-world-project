# Performance PWA

**Statut :** contrat actif de mesure et de validation.  
**Principe :** les seuils sont des objectifs de contrôle, pas une preuve de performance réelle ni une autorisation automatique de mise en production.

## Web Vitals

Les valeurs sont évaluées au **p75** sur une fenêtre et une population documentées. Une mesure locale isolée ne suffit pas à déclarer un Go.

| Signal | Healthy | Warning | Critical |
| --- | ---: | ---: | ---: |
| LCP p75 | < 2,5 s | 2,5–4,0 s | > 4,0 s |
| INP p75 | < 200 ms | 200–500 ms | > 500 ms |
| CLS p75 | < 0,10 | 0,10–0,25 | > 0,25 |

Le dépôt contient une collecte navigateur LCP/INP/CLS dans `src/lib/performance/web-vitals.ts`. Elle utilise `PerformanceObserver` lorsque disponible et conserve les dernières observations en mémoire. La collecte de ces observations ne constitue pas, à elle seule, une agrégation p75 représentative en production.

## Budgets du build initial

| Mesure | Limite |
| --- | ---: |
| JavaScript initial gzip | ≤ 250 kB |
| CSS initial gzip | ≤ 75 kB |
| Ressources critiques initiales gzip | ≤ 500 kB |

Le contrôle est implémenté dans `scripts/check-performance-budgets.ts`, avec les seuils partagés par `src/lib/performance/performance-policy.ts` et `src/lib/performance/performance-budget-policy.ts`.

Le script mesure les fichiers JS/CSS référencés par le HTML du build et certaines ressources préchargées. Il ne mesure pas la totalité du coût d'exécution, le réseau réel, le p75 des Web Vitals ou toutes les ressources téléchargées après interaction. Vérifier la commande réellement câblée dans les scripts du dépôt avant d'affirmer qu'un contrôle est exécuté dans chaque pipeline.

## Matrice mobile minimale

| Profil | Viewport de référence | Priorité |
| --- | --- | --- |
| Petit téléphone | 360×800 | P0 |
| Téléphone standard | 390×844 | P0 |
| Grand téléphone | 412×915 | P1 |
| Tablette portrait | 768×1024 | P1 |

Les tests E2E décrits dans le dépôt couvrent le rendu initial de routes principales à ces viewports. Ce smoke test ne remplace pas les vérifications manuelles des zones tactiles, du débordement horizontal, de la lisibilité, des transitions offline/online ni l'essai sur appareils physiques.

## PWA et hors connexion

Le comportement PWA doit être vérifié séparément de la taille du bundle :

- contrôler le manifeste, les icônes et l'enregistrement du service worker ;
- vérifier le chargement initial et les mises à jour ;
- confirmer que les API et Server Functions ne sont pas interceptées par des règles de cache de navigation ;
- tester les états hors connexion et la reprise réseau sur les parcours essentiels ;
- ne pas considérer l'installabilité réelle comme validée par la seule présence d'un manifeste ou d'un service worker.

La structure de base des parcours P0/P1 doit rester compréhensible même si le réseau est indisponible, selon les capacités et données locales prévues pour chaque parcours.

## Règles de décision

- **Healthy :** les indicateurs mesurés respectent leurs budgets dans un environnement et une fenêtre documentés.
- **Warning :** au moins un indicateur dépasse la cible Healthy sans atteindre Critical.
- **Critical :** un indicateur atteint le seuil critique ou un budget de chargement bloquant est dépassé.
- Toute régression critique bloque le Go tant que la cause n'est pas corrigée ou qu'une exception explicite, limitée et approuvée n'est pas documentée.
- Une validation automatique verte signifie « candidat Go » ; la préproduction, le rollback et la validation humaine restent requis.

## Procédure de vérification

1. Installer les dépendances et utiliser les scripts déclarés dans le dépôt.
2. Construire le client de production.
3. Exécuter le contrôle de budget de performance et conserver sa sortie.
4. Exécuter les tests E2E et les tests de Web Vitals pertinents.
5. Pour les mesures réelles, documenter appareil, navigateur, réseau, routes, échantillon et fenêtre de calcul du p75.
6. Comparer aux mesures précédentes et joindre les preuves à la revue.

## Problèmes historiques et limites

Les hypothèses de l'ancien fichier `docs/PERFORMANCE_ISSUES.md` ne doivent pas être traitées comme des défauts actifs sans mesure reproductible. Voir le [registre des problèmes](./performance-issues.md) pour leur statut et les preuves attendues.

## Sources techniques

- `src/lib/performance/performance-policy.ts`
- `src/lib/performance/performance-budget-policy.ts`
- `src/lib/performance/web-vitals.ts`
- `scripts/check-performance-budgets.ts`
- tests E2E et de performance associés

## Historique de migration

Les références historiques `docs/PERFORMANCE_PWA.md` et `docs/ANNEXE E — Performance Budget PostgreSQL.md` sont conservées jusqu'à validation technique et autorisation explicite de migration. Elles ne doivent plus être enrichies comme sources actives.
