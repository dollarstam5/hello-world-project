# Registre des problèmes de performance

**Statut :** registre de triage ; les constats doivent être confirmés avant toute modification technique.  
**Source historique :** `docs/PERFORMANCE_ISSUES.md`.

## Règle de preuve

Les affirmations de l'ancien document (tailles de bundles, nombre de composants, coûts de dépendances et gains attendus) ne sont pas des mesures actuelles tant qu'elles n'ont pas été reproduites sur le commit évalué. Les estimations et propositions de correctifs ne constituent pas des décisions d'architecture.

Les budgets contractuels et les commandes de mesure sont décrits dans [Performance PWA](./performance-pwa.md). Toute action doit comparer une mesure de référence et une mesure après changement, sur le même environnement.

## Éléments hérités à revalider

| Sujet historique | Statut documentaire | Vérification nécessaire avant action |
| --- | --- | --- |
| Volume et usage des composants Radix | Non confirmé par l'ancien document seul | Inventorier les imports réellement utilisés, inspecter le bundle de production et confirmer le tree-shaking. |
| Coût de Framer Motion | Non confirmé par l'ancien document seul | Mesurer la contribution au bundle et recenser les usages réels avant toute substitution. |
| Taille et découpage CSS | Mesure historique non datée | Mesurer les CSS réellement référencés par le HTML initial et analyser le découpage par route. |
| Duplication des workspaces | Hypothèse à mesurer | Examiner le graphe de dépendances et les artefacts de build avant de fusionner ou supprimer des packages. |
| Chargement des images | Hypothèse à vérifier par parcours | Auditer les images réellement chargées, leur format, leurs dimensions et leur priorité. |
| Multiplicité des systèmes d'état | Proposition architecturale non validée | Inventorier les usages et les frontières d'état ; ne pas migrer un système sur la seule base d'un nombre de références. |
| Web Vitals et tests de performance | Le dépôt contient déjà des implémentations de mesure et de budget à évaluer | Vérifier les scripts, tests, intégration CI et qualité des mesures avant de déclarer une lacune. |
| Session/authentification | Hors périmètre de ce lot documentaire | Ne pas appliquer les recommandations historiques d'authentification dans cette migration. |

## Méthode de triage

Pour chaque problème retenu, consigner :

- le commit et l'environnement testés ;
- le parcours et l'appareil ciblés ;
- la commande ou l'outil de mesure ;
- la valeur de référence et le seuil applicable ;
- la preuve reproductible (rapport ou artefact) ;
- la cause démontrée, distincte de l'hypothèse ;
- le correctif minimal proposé ;
- le résultat après changement et les risques de régression.

## Priorisation

- **P0 :** régression reproductible qui dépasse un seuil critique ou empêche un parcours essentiel.
- **P1 :** problème mesuré qui dégrade nettement un parcours important sans bloquer son usage.
- **P2 :** optimisation démontrable, sans impact utilisateur critique immédiat.
- **À mesurer :** aucune priorité de correction ne doit être attribuée avant collecte de preuves suffisantes.

## Interdictions

- Ne pas présenter des gains estimés comme des résultats obtenus.
- Ne pas supprimer une dépendance, fusionner des packages ou changer la gestion d'état sans tests et mesure avant/après.
- Ne pas dupliquer les seuils : [Performance PWA](./performance-pwa.md) reste la source contractuelle.
- Ne pas considérer ce registre comme une preuve que tous les éléments listés sont des défauts actifs.
