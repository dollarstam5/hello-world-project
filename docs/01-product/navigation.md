# Navigation produit Vitalis

**Statut :** référence produit V1 consolidée dans la PR #37. Elle décrit les décisions validées ; elle ne certifie pas à elle seule l'implémentation.

## Hiérarchie des espaces

- **Home** est le point d'entrée produit, distinct du moteur Réel. L'identité Vitalis dans l'en-tête et l'icône de lancement ouvrent la route d'accueil `/`.
- Les quatre moteurs métier sont **Flash, Scan, Réel et Radar**. Chacun conserve sa route, son périmètre et ses responsabilités.
- **2×2** donne accès au menu des espaces et fonctionnalités complémentaires. Ce n'est pas un cinquième moteur.
- **Espace** et **Talents** sont des destinations secondaires accessibles depuis le menu 2×2.
- Notifications, Assistant, Messages, Réel (contrôle du temps réel), profil et réglages sont des accès transversaux ; ils ne créent pas de nouveaux moteurs.

## Navigation principale mobile

La barre inférieure présente exactement cinq icônes, dans cet ordre :

1. Flash
2. Scan
3. Réel
4. Radar
5. 2×2

Réel occupe la position centrale et utilise l'icône antenne. Les quatre premières icônes ouvrent leurs routes respectives ; 2×2 ouvre le menu secondaire. Le menu 2×2 reste donc visuellement présent dans la barre, sans être présenté comme un moteur ou une destination métier.

Home reste hors de cette barre et demeure accessible depuis l'identité Vitalis dans l'en-tête et depuis l'icône de lancement de l'application.

## Première utilisation et onboarding

Le parcours V1 comporte cinq écrans, affichés une seule fois après la première ouverture :

1. **Vitalis dans son ensemble** : vision, promesse et utilité de l'application.
2. **Flash et Scan** : présentation courte des deux moteurs.
3. **Réel et Radar** : présentation courte des deux moteurs ; Réel est accessible en mode invité, sans compte obligatoire.
4. **2×2 et les espaces complémentaires** : explication du menu et des destinations secondaires.
5. **Entrer dans Vitalis** : invitation finale et action « C'est parti ! ».

L'utilisateur peut avancer, revenir en arrière ou passer la découverte. La fin ou le passage conduit directement à Home. L'onboarding n'est pas une page d'inscription et ne doit pas imposer la création d'un compte.

## Continuité de navigation

- Chaque moteur possède une route et une responsabilité identifiables.
- Les liens et boutons exposent un nom accessible et un état courant pertinent.
- Les sous-routes conservent un état actif cohérent avec leur moteur parent.
- Le retour système ou navigateur ferme d'abord le panneau ou dialogue ouvert, puis remonte dans la pile de navigation.
- Le passage d'un moteur à l'autre préserve le contexte pertinent (recherche, filtres, position, sous-route) lorsque cela reste sûr et compatible avec la session et les permissions.
- Une perte d'état nécessaire doit être explicite.
- Une navigation ne doit pas déclencher une déconnexion ni une demande d'identification sans justification métier.

## Présentation adaptative

- Téléphone : barre inférieure à cinq icônes, avec libellés compréhensibles.
- Fenêtre moyenne : choisir barre ou rail selon l'espace réellement disponible.
- Tablette et espace large : évaluer navigation latérale et multi-panneaux plutôt que d'étirer automatiquement la barre inférieure.
- Les décisions reposent sur la largeur et les capacités réelles de la fenêtre, pas uniquement sur la marque de l'appareil ou l'orientation.

Les seuils exacts doivent provenir du système de design et être validés sur les appareils et navigateurs réellement pris en charge.

## Accessibilité et cibles

- Les icônes ont des noms accessibles et des libellés visibles.
- L'état courant est annoncé sémantiquement.
- Le focus clavier est visible et suit un ordre logique.
- Contraste, zoom, agrandissement du texte, contenu long et lecteurs d'écran sont vérifiés.
- Objectifs tactiles de référence : au moins 48×48 dp sur Android et 44×44 pt sur iOS natif. Le critère WCAG 2.2 SC 2.5.8 est évalué séparément en CSS px et selon ses exceptions. Ces unités ne sont pas interchangeables.
- Safe areas, insets, clavier et zones de gestes sont respectés.
- Les préférences de réduction des animations et les langues FR/EN sont prises en charge.

## Limites et preuves

La présence d'une route, d'un composant ou d'une règle écrite ne prouve pas que le parcours est entièrement opérationnel. Les tests de retour système, conservation du contexte, safe areas, lecteurs d'écran, PWA installée et adaptation tablette doivent être reliés à des preuves reproductibles. Les moteurs incomplets ne doivent pas être présentés comme fonctionnels.

Voir la [matrice de conformité de la navigation](../07-annexes/navigation-compliance-matrix.md) et les [standards de navigation mobile](../02-architecture/mobile-navigation-standards.md).
