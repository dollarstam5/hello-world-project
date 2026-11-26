# Front-end et expérience — architecture de référence

**Statut :** référence de mise en œuvre alignée sur la gouvernance actuelle du dépôt.  
**Périmètre :** organisation du front-end, assemblage des expériences, navigation, tokens, mouvement, accessibilité et validation.  
**Limite :** ce document décrit les responsabilités et les points d'entrée vérifiés dans l'arborescence. Il ne certifie pas à lui seul le comportement de toutes les routes ni de tous les composants.

## Sources de vérité

| Sujet | Source canonique actuelle |
| --- | --- |
| Couches, responsabilités et dépendances | [Gouvernance architecturale](../../ARCHITECTURE.md) |
| Bootstrap et cycle de vie racine | `src/app/bootstrap/` |
| Shell global et providers applicatifs | `src/app/shell/AppShell.tsx`, `src/app/composition/RootAppComposition.tsx` |
| Routage fichier par fichier | `src/routes/` et [conventions des routes](../../src/routes/README.md) |
| Expériences produit assemblant plusieurs modules | `src/composition/experiences/` |
| Widgets et layouts de composition | `src/composition/widgets/`, `src/composition/layouts/` |
| Capacités et règles métier | `src/modules/<module>/` et leurs points d'entrée publics |
| Capacités techniques transversales | `src/platform/` |
| UI, types et utilitaires réellement génériques | `src/shared/` |
| Variables CSS et styles globaux | `src/styles.css` |
| Références de design TypeScript | `src/lib/design/tokens.ts`, `src/lib/design/motion.ts` |
| Performance et critères de release | [Performance PWA](../operations/performance-pwa.md), [Qualité](../operations/QUALITY.md) |
| Intention produit | [Système d'expérience](../product/experience-system.md) |

Les valeurs de design doivent être modifiées dans leur source exécutable appropriée. Cette documentation explique les responsabilités et les contrôles ; elle ne doit pas devenir une copie manuelle des tokens.

## Organisation effective du front-end

La structure canonique du dépôt est :

- **`src/app/`** : bootstrap, shell global, providers/guards applicatifs et intégration du routage. La racine de l'application orchestre les capacités ; elle ne doit pas absorber les règles métier.
- **`src/modules/<name>/`** : capacités métier autonomes. Chaque module possède ses modèles, politiques, services, états et interfaces propres. Les consommateurs externes utilisent son point d'entrée public lorsqu'il existe.
- **`src/platform/`** : adaptateurs et capacités techniques transversales (PWA, appareil, réseau, permissions, offline, realtime, stockage et observabilité).
- **`src/shared/`** : ressources agnostiques du métier, notamment primitives UI, tokens, types et utilitaires purs.
- **`src/composition/`** : expériences produit, layouts et widgets qui assemblent plusieurs modules sans reprendre la propriété de leurs règles métier.
- **`src/routes/`** : points d'entrée TanStack Start, chargement de route et composition minimale requise par le framework.

### Deux usages distincts du mot « composition »

Il existe deux répertoires portant ce terme, avec des responsabilités différentes :

1. **`src/composition/` — composition produit.** Son README définit `experiences/`, `layouts/` et `widgets/`. On y assemble plusieurs capacités pour construire une expérience visible par l'utilisateur.
2. **`src/app/composition/` — composition de la racine applicative.** Il contient actuellement `RootAppComposition.tsx`, qui enveloppe le shell et son contenu avec les providers globaux (`QueryClientProvider` et `AccessModeProvider`). C'est du câblage d'application, pas une expérience métier.

Cette distinction est intentionnelle et cohérente avec le code présent. Il ne faut ni déplacer `RootAppComposition` dans `src/composition/`, ni faire de `src/composition/` le propriétaire du bootstrap ou du shell global.

### Direction des dépendances

La règle générale est que les couches d'orchestration peuvent assembler les couches de capacités, mais les couches basses ne dépendent pas des couches hautes :

- `shared` ne dépend pas de `platform`, `modules`, `composition` ou `app`.
- `platform` peut dépendre de `shared`, pas des modules métier ni de la composition produit.
- Un module peut dépendre de `shared` et `platform`. Une dépendance entre modules doit passer par le point d'entrée public du module consommé et être justifiée.
- `composition` peut assembler des modules et des capacités transversales ; elle ne devient pas propriétaire des règles métier.
- `app` assure le câblage global et peut consommer les points d'entrée de composition et de plateforme.
- Les routes peuvent appeler les points d'entrée nécessaires à l'intégration TanStack, sans devenir le lieu de la logique métier ou de la propriété des données.

Les dossiers historiques peuvent subsister comme façades de compatibilité. Leur présence ne les rend pas propriétaires canoniques ; toute suppression exige une recherche complète des consommateurs et une validation.

## Shell, bootstrap et routes

- `src/app/bootstrap/useExperienceBoot.ts` initialise le thème, l'internationalisation et l'hydratation de l'onboarding.
- `src/app/bootstrap/useRootLifecycle.ts` orchestre l'enregistrement du service worker, la collecte Web Vitals et les mesures d'interaction/navigation, avec nettoyage des services démarrés.
- `src/app/shell/AppShell.tsx` porte le shell global et les couches transversales de l'expérience.
- `src/app/composition/RootAppComposition.tsx` assemble les providers racine autour du shell.
- `src/routes/__root.tsx` conserve la responsabilité du cadre TanStack Start, des métadonnées, du shell HTML et de l'insertion des routes imbriquées via `<Outlet />`.

L'extraction du cycle de vie hors de `__root.tsx` sépare l'orchestration technique du contrat de routage. Elle ne doit pas supprimer le `<Outlet />`, modifier involontairement l'ordre des providers ou changer les règles de chargement des routes.

## Tokens, thèmes et mouvement

- Préférer les variables CSS et classes sémantiques existantes aux couleurs, espacements, rayons, ombres ou couches codés en dur.
- `src/lib/design/tokens.ts` fournit des valeurs TypeScript utilisées par les animations et contextes qui ne consomment pas directement les variables CSS. Toute modification concernée doit vérifier la synchronisation avec les sources CSS.
- Utiliser les clés de couches et les variantes partagées plutôt que des valeurs de profondeur, courbes ou durées arbitraires.
- Les animations doivent expliquer un changement d'état ou attirer l'attention sur une information utile ; elles ne doivent pas être nécessaires à la compréhension.
- Respecter `prefers-reduced-motion` et les politiques de réduction d'effets pour les appareils modestes.
- Le thème sombre est prioritaire dans l'identité actuelle, mais la présence des variables de thème ne suffit pas à prouver que chaque écran fonctionne correctement dans tous les thèmes.

## Interaction, accessibilité et responsive

Tout écran interactif doit être revu, selon sa fonction, sur les points suivants :

1. Intention principale et hiérarchie visuelle évidentes.
2. États normal, chargement, vide, erreur, succès, désactivé et hors connexion traités lorsqu'ils s'appliquent.
3. Navigation clavier, ordre de focus logique et focus visible.
4. Libellés accessibles et sémantique adaptée ; ne pas utiliser la couleur comme seul indicateur.
5. Contraste, zoom, contenu long, tailles tactiles et débordement horizontal.
6. Réduction de mouvement, safe areas et petites largeurs d'écran.
7. Textes localisés selon le mécanisme i18n réellement utilisé.
8. Retours compréhensibles et confirmation proportionnée au risque pour les actions engageantes ou destructrices.

Construire mobile-first et vérifier les viewports contractuels de la documentation de performance. Les variantes responsive ne doivent pas être décrites comme des expériences distinctes tant que leur implémentation effective ne le démontre pas.

Ces règles sont des critères de revue. Leur présence dans cette documentation ne constitue pas une certification WCAG ; la validation exige des tests automatisés et manuels sur les parcours réels.

## Performance et validation

- Ne pas ajouter systématiquement `will-change`, de promotion GPU, de glow ou de backdrop blur : les effets coûteux doivent rester justifiés et pouvoir être réduits.
- Toute optimisation doit être appuyée par une mesure avant/après reproductible et les seuils définis dans le contrat de performance.
- Vérifier les états réseau dégradé et la reprise hors connexion sur les parcours concernés ; la seule présence d'un bandeau ou d'un service worker ne prouve pas qu'un parcours est utilisable sans réseau.
- Pour chaque tranche de migration, examiner les importeurs, imports statiques et dynamiques, barrels, alias, cycles et frontières client/serveur.
- Exécuter typecheck, lint, tests ciblés, suite complète et build selon les gates de [gouvernance](../../ARCHITECTURE.md), puis noter exactement les contrôles réellement exécutés.

## Limites de validation

Les responsabilités et chemins ci-dessus ont été confrontés à l'arborescence et aux fichiers de la branche. Cela ne prouve pas que tous les imports respectent déjà les frontières, que toutes les routes sont accessibles, ni que l'application passe les tests, le typecheck, le lint ou le build. Ces validations restent des contrôles distincts.

## Références liées

- [Gouvernance architecturale](../../ARCHITECTURE.md)
- [Architecture système](./system-architecture.md)
- [Langage de design](../foundation/design-language.md)
- [Système d'expérience produit](../product/experience-system.md)
- [Parcours utilisateurs](../product/user-journeys.md)
- [Performance PWA](../operations/performance-pwa.md)
