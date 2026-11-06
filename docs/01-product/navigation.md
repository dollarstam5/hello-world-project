# Navigation produit Vitalis

**Statut :** référence canonique proposée pour V1. Ce document décrit le comportement attendu ; il ne certifie pas l'implémentation.

## Hiérarchie

- **Home** est le point d'entrée stable : l'icône installée et le nom Vitalis dans l'en-tête ouvrent `/`.
- Home est distincte de **Réel**, qui reste un moteur métier.
- Les quatre moteurs principaux sont **Réel, Flash, Scan et Radar**.
- **Espace** et **Talents** sont des espaces secondaires accessibles via le menu 2×2.
- Notifications, communication, profil et Vita sont des accès transversaux ou actions ; ils ne deviennent pas des moteurs supplémentaires.

La barre principale mobile expose les quatre moteurs. Le 2×2 ouvre les espaces secondaires et ne doit pas être présenté comme un cinquième moteur ni comme un onglet d'action dans une tab bar.

## Première utilisation

1. Ouverture de Vitalis depuis l'icône ou le navigateur.
2. Onboarding initial obligatoire, avec choix FR/EN visible.
3. Présentation exacte des quatre moteurs.
4. Validation de l'onboarding puis arrivée explicite sur Home.
5. Home explique Vitalis et oriente vers ses destinations.
6. Une action nécessitant une session conduit au parcours d'identification existant.
7. Après session ouverte ou créée, retour à Home.

Ce parcours n'autorise pas à créer un nouveau mécanisme d'authentification, de collecte d'identité ou de permission. Les règles existantes restent la source d'autorité.

## Navigation et continuité

- Les moteurs ont chacun leur route et leur responsabilité.
- Les liens exposent un libellé accessible et un état courant.
- Les sous-routes conservent un état actif cohérent pour leur moteur parent.
- Le retour système/navigateur ferme d'abord un panneau ou dialogue, puis remonte dans la pile de navigation.
- Le passage d'un moteur à l'autre préserve le contexte pertinent (recherche, filtres, position, sous-route) lorsque cela reste sûr et compatible avec la session et les permissions.
- Toute perte d'état nécessaire doit être explicite.
- Les changements de route ne doivent pas déclencher une déconnexion ni une demande d'identification sans justification.

## Présentation adaptative

- Téléphone compact : barre inférieure, quatre moteurs, libellés visibles.
- Espace moyen : barre ou rail selon la place réellement disponible.
- Tablette et espace large : évaluer navigation latérale/rail et multi-panneaux plutôt que d'étirer la barre inférieure.
- Les décisions se basent sur la largeur disponible et les classes de fenêtre, pas seulement le type d'appareil ou l'orientation.

Les seuils exacts doivent être définis à partir du système de design et validés sur appareils/fenêtres cibles.

## Accessibilité

- Icônes accompagnées de libellés.
- État courant annoncé sémantiquement.
- Focus visible, ordre logique et navigation clavier sur le Web.
- Contraste, zoom, agrandissement du texte et contenu long vérifiés.
- Objectifs tactiles : 48×48 dp Android et 44×44 pt iOS natif ; contrôle WCAG 2.2 SC 2.5.8 distinct à 24×24 CSS px ou exception prévue par le critère. Ces unités ne sont pas interchangeables.
- Safe areas, insets, clavier et zones de gestes respectés.
- Réduction des animations et langues FR/EN prises en charge.

## Limites connues à revalider

La revue de la branche PR #31 repère le 2×2 dans BottomNav, un sélecteur de langue à 40 px, et des variantes AdaptiveLayout qui délèguent encore à AppShell. Les tests de conservation d'état, retours Android/iOS, safe areas complètes et PWA installées sur appareils réels ne sont pas démontrés. Espace, Notifications, Réel et Radar comportent des éléments dont la complétude métier n'est pas prouvée. Ces constats doivent être revalidés sur le commit retenu ; aucune conformité globale n'est revendiquée.

## Références

- [Standards de navigation mobile](../02-architecture/mobile-navigation-standards.md)
- [Matrice de conformité](../07-annexes/navigation-compliance-matrix.md)
- [Parcours utilisateurs](./user-journeys.md)
- [Architecture front-end](../02-architecture/frontend-experience.md)
- [Performance PWA](../06-operations/performance-pwa.md)
