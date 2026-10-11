# Langage de design Vitala

**Statut :** référence active  
**Périmètre :** principes visuels, tokens, mouvement, responsive, accessibilité et langage d'interface.

Ce document décrit les conventions de design vérifiables dans le dépôt. Les valeurs concrètes restent définies dans le code : ce texte ne remplace ni les tokens ni les composants.

## Principes

- **Clarté avant décoration.** Un effet visuel doit aider à comprendre la hiérarchie, l'état ou l'action.
- **Sombre en priorité, sans exclusivité.** L'identité actuelle privilégie les surfaces charcoal et les accents lumineux ; le thème clair existe aussi dans le système de styles.
- **Mobile-first.** Concevoir à partir des petits écrans et préserver l'usage jusqu'aux grandes largeurs.
- **Cohérence sémantique.** Une couleur, un niveau de surface ou une animation doit conserver le même sens d'un écran à l'autre.
- **Accessibilité par défaut.** Le contraste, le clavier, les états de focus, les zones tactiles et la réduction des mouvements font partie de la conception, pas d'une étape finale.

## Sources de vérité dans le code

| Domaine | Source à consulter |
| --- | --- |
| Variables CSS, couleurs, surfaces, ombres, rayons et typographie | `src/styles.css` |
| Tokens TypeScript (mouvement, espacement, typographie, couches, icônes) | `src/lib/design/tokens.ts` |
| Point d'entrée partagé des tokens | `src/shared/tokens/index.ts` |
| Principes d'expérience et intentions produit | [Experience System](../01-product/experience-system.md) |

Ne pas recopier ici la totalité des valeurs déjà définies dans le code : documenter leur intention et renvoyer vers leur source exécutable.

## Tokens et implémentation

- Utiliser les variables CSS et utilitaires sémantiques déjà définis ; ne pas introduire de valeurs visuelles arbitraires lorsqu'un token convient.
- Les tokens TypeScript sont un miroir destiné aux contextes qui ne peuvent pas consommer directement les variables CSS. Maintenir les deux sources synchronisées.
- La palette comprend des surfaces hiérarchisées, des accents sémantiques (principal, chaleur, confiance, intelligence), des états et une hiérarchie de glow. Le glow est réservé aux éléments qui ont besoin d'attirer l'attention.
- L'échelle d'espacement est basée sur 4 px ; les tailles de texte et les largeurs de conteneur suivent des échelles sémantiques.
- Pour les couches superposées, préférer les clés de `zLayer` aux nombres arbitraires.

## Mouvement

Les tokens TypeScript exposent des durées, des courbes d'accélération et des transitions communes. Toute animation doit expliquer un changement d'état, confirmer une action ou guider l'attention.

- Respecter `prefers-reduced-motion` et les mécanismes de réduction de mouvement effectivement implémentés.
- Éviter les animations continues, les transitions longues et les effets qui ralentissent l'accès au contenu.
- Ne pas affirmer qu'une classe ou un comportement de performance existe sans le vérifier dans le code courant.

## Responsive et ergonomie

- Tester au minimum une largeur de 320 px et les viewports mobiles de référence définis dans [Performance PWA](../06-operations/performance-pwa.md).
- Prévenir le débordement horizontal et garder les actions principales accessibles au pouce.
- Prendre en compte les safe areas et les différentes tailles d'écran lorsque le composant les utilise.
- Les règles de navigation doivent être documentées par les composants et routes actuels ; ne pas présumer que chaque écran partage exactement le même habillage.

## Contenu et internationalisation

- Écrire des libellés courts, humains et orientés vers l'action ou le besoin de la personne.
- Tout texte d'interface doit suivre la convention d'internationalisation réellement utilisée par le domaine ou le composant ; ne pas ajouter de chaînes visibles en dur si le projet impose une clé i18n.
- Vérifier les versions française et anglaise lorsqu'elles sont prises en charge.

## Checklist de revue

- [ ] L'intention principale de l'écran est évidente.
- [ ] Les couleurs, espacements, rayons, ombres et couches réutilisent les tokens appropriés.
- [ ] Les états normal, hover, focus, actif, désactivé, erreur et chargement sont cohérents.
- [ ] Le clavier et le focus sont utilisables.
- [ ] Le contraste et les zones tactiles sont vérifiés.
- [ ] Le mouvement respecte les préférences de réduction.
- [ ] Les textes et leur traduction sont complets.
- [ ] Le rendu est vérifié sur petits écrans, grand écran et en cas de contenu long.

## Limites

Ce document ne certifie pas à lui seul la conformité WCAG de l'interface. Une conformité exige des vérifications automatisées et manuelles sur les parcours réels.
