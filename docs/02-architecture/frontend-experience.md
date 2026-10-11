# Front-end et expérience — architecture de référence

**Statut :** référence canonique de consolidation.  
**Périmètre :** organisation du front-end, composition des écrans, tokens visuels, mouvement, accessibilité et règles de revue.  
**Limite :** l'inventaire ci-dessous décrit les fichiers examinés sur `main` pendant le Lot 4 ; il ne certifie pas à lui seul la conformité de toutes les routes ni de tous les composants.

## Sources de vérité

| Sujet | Source de vérité actuelle |
| --- | --- |
| Règles de dépendance et responsabilité des couches | [Architecture du dépôt](../../ARCHITECTURE.md) |
| Routage fichier par fichier | [Conventions des routes](../../src/routes/README.md) et `src/routes/` |
| Variables CSS, couleurs, surfaces, typographie et utilitaires | `src/styles.css` |
| Tokens TypeScript utilisés par les animations et contextes sans CSS | `src/lib/design/tokens.ts` |
| Point d'entrée de compatibilité des tokens | `src/shared/tokens/index.ts` |
| Variantes de mouvement | `src/lib/design/motion.ts` |
| Réduction de mouvement côté React | `src/lib/design/useReducedMotion.ts` |
| Composition d'expérience réutilisable | `src/components/experience/` |
| Composants UI génériques | `src/components/ui/` |
| Shell global et point d'insertion des routes | `src/routes/__root.tsx` et `src/components/app/AppShell` |
| Intention produit et principes d'interaction | [Vitala Experience System](../01-product/experience-system.md) |
| Budgets et validation de performance | [Performance PWA](../06-operations/performance-pwa.md) |

Les valeurs de design doivent être modifiées dans leur source exécutable appropriée. Cette documentation explique les responsabilités et les contrôles ; elle ne doit pas devenir une copie manuelle des tokens.

## Organisation et direction des dépendances

La règle architecturale du dépôt fixe l'ordre suivant, du plus bas au plus haut :

`shared → platform → features → domains → widgets → routes`

- **shared** : primitives génériques, utilitaires et types transverses ; aucune règle métier propre à un domaine.
- **platform** : capacités transverses comme PWA, réseau, hors connexion, accessibilité, notifications et intégrations.
- **features** : parcours réutilisables partagés, par exemple onboarding, recherche, paramètres et internationalisation.
- **domains** : composants, hooks, types, services et état appartenant à un domaine métier.
- **widgets** : composition de plusieurs domaines ; ne doit pas devenir propriétaire de la logique métier.
- **routes** : points d'entrée et composition de la page ; elles ne doivent pas absorber les appels API, la logique métier ou un état métier lourd.

Les imports doivent aller uniquement vers des couches de niveau inférieur. Pour créer un composant, choisir la couche la plus restrictive qui possède réellement la responsabilité. Ne pas créer une deuxième convention `pages/` : le projet utilise le routage fichier par fichier de TanStack Start sous `src/routes/`, avec `src/routes/__root.tsx` comme racine.

## Shell et composition d'expérience

Le fichier `src/routes/__root.tsx` configure les métadonnées HTML, les feuilles de style, le manifeste PWA, le client de requêtes, la surveillance Web Vitals et le shell applicatif. Le composant `<Outlet />` est nécessaire pour afficher les routes imbriquées : il ne doit pas être supprimé.

Les éléments de `src/components/experience/` servent à assembler des primitives en une expérience cohérente (accueil, en-tête, onboarding, communication, états intelligents et indications hors ligne). Leur rôle déclaré est l'orchestration UX, pas l'implémentation des domaines métier.

`src/layouts/AdaptiveLayout.tsx` choisit un shell mobile, tablette ou desktop selon `useResponsive`. Le code examiné indique que ces variantes délèguent actuellement à `AppShell` ; ce mécanisme ne prouve donc pas, à lui seul, que chaque format dispose d'une composition distincte.

## Tokens, thèmes et mouvement

- Préférer les variables CSS et classes sémantiques existantes aux couleurs, espacements, rayons, ombres ou couches codés en dur.
- `src/lib/design/tokens.ts` est un miroir TypeScript des valeurs CSS nécessaires aux animations et aux contextes qui ne consomment pas directement les variables CSS. Toute modification concernée doit vérifier la synchronisation des deux sources.
- Utiliser les clés `zLayer` plutôt que des valeurs de profondeur arbitraires.
- Utiliser les transitions et variantes partagées de `src/lib/design/motion.ts` plutôt que recréer des courbes ou durées locales.
- Les animations doivent expliquer un changement d'état ou attirer l'attention sur une information utile. Les boucles décoratives ne doivent pas être nécessaires à la compréhension.
- Respecter `prefers-reduced-motion`. Les styles globaux arrêtent certaines animations continues ; les animations Framer Motion doivent également tenir compte de `useReducedMotion` ou d'une politique partagée équivalente.
- Le thème sombre est prioritaire dans l'identité actuelle, mais la présence des variables de thème ne suffit pas à prouver que chaque écran fonctionne correctement dans les deux thèmes.

## Règles d'interaction et d'accessibilité

Tout écran ou composant interactif doit être revu pour les éléments suivants, selon sa fonction :

1. Intention principale et hiérarchie visuelle évidentes.
2. États normal, chargement, vide, erreur, succès, désactivé et hors connexion explicités lorsqu'ils s'appliquent.
3. Navigation clavier, ordre de focus logique et focus visible.
4. Libellés accessibles et sémantique adaptée ; ne pas utiliser la couleur comme seul indicateur.
5. Contraste, zoom, contenu long, tailles tactiles et débordement horizontal.
6. Réduction de mouvement, safe areas et petites largeurs d'écran.
7. Textes localisés selon le mécanisme i18n réellement utilisé.
8. Retours compréhensibles et confirmation proportionnée au risque pour les actions engageantes ou destructrices.

Ces règles sont des critères de revue. Leur présence dans cette documentation ne constitue pas une certification WCAG ; la validation exige des tests automatisés et manuels sur les parcours réels.

## Responsive et performance

- Construire mobile-first et vérifier au minimum les viewports contractuels de [Performance PWA](../06-operations/performance-pwa.md).
- Réutiliser les utilitaires de conteneur, rythme, safe area et grille lorsqu'ils répondent au besoin.
- Ne pas ajouter systématiquement `will-change`, de promotion GPU, de glow ou de backdrop blur : les effets coûteux doivent rester justifiés et pouvoir être réduits sur les appareils modestes.
- Les utilitaires CSS de performance ne remplacent pas une mesure. Toute optimisation doit être appuyée par une mesure avant/après reproductible et les seuils définis dans le contrat de performance.
- Vérifier les états réseau dégradé et la reprise hors connexion sur les parcours concernés ; la seule présence d'un bandeau hors ligne ou d'un service worker ne prouve pas qu'un parcours est utilisable sans réseau.

## Écarts observés à vérifier

Ces points sont des observations sur les fichiers consultés, pas des conclusions générales sur l'ensemble de l'application :

- **Internationalisation :** la règle de `ARCHITECTURE.md` demande que toutes les chaînes visibles passent par `useI18n`, alors que `src/routes/__root.tsx` contient actuellement des libellés anglais en dur dans les vues 404 et erreur. Confirmer la convention effective et aligner ces libellés lors d'un changement front-end.
- **Shell adaptatif :** `AdaptiveLayout` sélectionne trois variantes, mais son commentaire indique qu'elles délèguent actuellement à `AppShell`. Ne pas documenter des interfaces distinctes mobile/tablette/desktop comme déjà livrées sans preuve supplémentaire.
- **Exports de la fondation d'expérience :** `src/components/experience/index.ts` n'exporte qu'une partie des fichiers présents dans le répertoire. Avant de considérer un composant comme disponible via l'API publique du barrel, vérifier ses exports et ses usages réels.
- **Synchronisation des tokens :** CSS et TypeScript décrivent des valeurs miroir. Aucun contrôle automatique de synchronisation n'a été confirmé pendant ce lot ; ne pas supposer que les écarts sont détectés par CI.
- **Accessibilité :** les conventions et primitives sont présentes, mais cette lecture documentaire ne fournit pas de rapport d'audit complet de toutes les routes.

Les constats doivent être vérifiés avant toute correction de code. Ce lot est documentaire et n'autorise pas à lui seul une refonte, la suppression de composants ou le changement de comportement applicatif.

## Checklist de revue front-end

- [ ] Le composant est placé dans la couche qui en possède la responsabilité.
- [ ] Les imports respectent la direction des dépendances.
- [ ] Les tokens et primitives existants sont réutilisés.
- [ ] Les états de chargement, vide, erreur, succès et hors connexion sont traités selon le besoin.
- [ ] Les textes suivent la convention i18n applicable.
- [ ] Le clavier, le focus, les libellés, le contraste et les zones tactiles ont été vérifiés.
- [ ] Le mouvement respecte les préférences système.
- [ ] Les tailles mobiles, le contenu long et les safe areas ont été vérifiés.
- [ ] Les effets et budgets de performance ont été mesurés si le changement peut les affecter.
- [ ] Les comportements annoncés comme implémentés sont confirmés dans le code et les tests.

## Références liées

- [Langage de design](../00-foundation/design-language.md)
- [Vitala Experience System](../01-product/experience-system.md)
- [Parcours utilisateurs](../01-product/user-journeys.md)
- [Architecture système](./system-architecture.md)
- [Performance PWA](../06-operations/performance-pwa.md)
