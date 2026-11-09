# Matrice de conformité — Navigation Vitalis V1

**Statut :** matrice de contrôle documentaire ; aucune certification n'est revendiquée.  
**Références :** [Navigation produit](../01-product/navigation.md) · [Standards mobiles](../02-architecture/mobile-navigation-standards.md).  
**Base initiale :** revue de la branche PR #31, 6 novembre 2026. Les constats sont à revalider sur le commit retenu.

## Légende

- **CONFORME** : comportement vérifié par preuve reproductible.
- **À CORRIGER** : écart identifié.
- **À TESTER** : preuve insuffisante ou test non exécuté.
- **DOCUMENTÉ** : intention écrite, implémentation non prouvée.
- **NON APPLICABLE** : sans objet, justification enregistrée.

## Matrice

| ID | Exigence | Référence | Constat initial | Statut | Preuve requise |
| --- | --- | --- | --- | --- | --- |
| NAV-01 | Home distincte de Réel | Produit | Routes décrites dans PR #31 ; manifeste et parcours à vérifier | À TESTER | Test icône PWA, en-tête, route directe |
| NAV-02 | Quatre moteurs principaux | Produit | Configuration centralisée repérée | DOCUMENTÉ | Tests routes, libellés, état actif |
| NAV-03 | 2×2 secondaire | Apple Tab bars | Bouton encore dans BottomNav | À CORRIGER | Revue UI et test du menu |
| NAV-04 | Libellés visibles | Apple Tab bars | Libellés présents dans le composant | À TESTER | Lisibilité, troncature, texte agrandi |
| NAV-05 | Cibles ≥48×48 dp | Android | Sélecteur FR/EN à 40 px CSS dans le code inspecté | À CORRIGER | Mesure réelle sur Android |
| NAV-06 | Cibles ≥44×44 pt | Apple | Même sélecteur ; taille active iOS non établie | À CORRIGER | Mesure réelle sur iOS |
| NAV-07 | WCAG 2.2 SC 2.5.8 | W3C | Audit complet absent | À TESTER | Mesures CSS px et exceptions d'espacement |
| NAV-08 | Safe areas/insets | Android/Apple | Inset bas repéré ; couverture complète non démontrée | À TESTER | Encoche, barres système, clavier, rotation |
| NAV-09 | Retour Android | Android | Non vérifié sur appareil | À TESTER | Geste, trois boutons, panneaux, pile |
| NAV-10 | Geste retour iOS | Apple | Non vérifié sur appareil | À TESTER | Geste bord, sous-routes, panneaux |
| NAV-11 | Historique Web/PWA | Web | Non vérifié | À TESTER | Retour/avance, URL directe, refresh |
| NAV-12 | Navigation adaptative tablette | Android/Apple | Variantes AdaptiveLayout délèguent à AppShell | À CORRIGER | Classes de fenêtre, rail/sidebar, multi-panneaux |
| NAV-13 | Conservation d'état moteur | Apple | Aucune preuve fournie | À TESTER | Changer/revenir avec recherche, filtres, sous-route |
| NAV-14 | État actif sous-routes | Web | Comparaison exacte du chemin repérée | À TESTER | Tests route parent/enfant |
| NAV-15 | Noms et états accessibles | WCAG | Attributs présents sur plusieurs contrôles ; audit absent | À TESTER | Lecteurs d'écran, annonces, états |
| NAV-16 | Clavier et focus | WCAG | Focus visible sur certains contrôles | À TESTER | Parcours complet clavier |
| NAV-17 | Contraste, zoom, taille texte | WCAG/Apple | Rapport absent | À TESTER | Contraste, zoom, reflow, Dynamic Type |
| NAV-18 | Réduction mouvement | Système | useReducedMotion repéré | À TESTER | Préférence activée sur tous les écrans |
| NAV-19 | FR/EN | Vitalis | Sélecteur et mise à jour de lang document repérés | À TESTER | Routes, panneaux, erreurs, annonces |
| NAV-20 | PWA Android | Android/PWA | Manifest et SW présents ; test installé absent | À TESTER | Installation, relance, offline/reprise |
| NAV-21 | PWA iOS | Apple/Web | Test appareil réel absent | À TESTER | Écran d'accueil, mode autonome, safe areas |
| NAV-22 | Focus des panneaux | WCAG/Apple | Panneaux présents ; audit comportemental absent | À TESTER | Focus initial, Échap/retour, restitution |
| NAV-23 | États vides/indisponibles | Produit | Espaces placeholders signalés | À TESTER | Message clair et destination accessible |
| NAV-24 | Frontières métier des moteurs | Architecture | Routes séparées ne prouvent pas l'autonomie métier | DOCUMENTÉ | Contrats, données, permissions, services, tests |

## Constats techniques de départ

Revue de la branche PR #31, sans validation sur appareil :

- `src/components/app/BottomNav.tsx` affiche quatre moteurs et le bouton 2×2 dans la navigation inférieure.
- `src/components/experience/LanguageSwitcher.tsx` définit `min-h-10 min-w-10`, soit 40 px CSS minimum avant mesure du rendu.
- `src/components/experience/AppHeader.tsx` utilise des boutons partagés `size="icon"` ; leurs dimensions rendues restent à mesurer.
- `src/components/app/AppShell.tsx` rend le shell et la navigation inférieure.
- `src/layouts/AdaptiveLayout.tsx` sélectionne des variantes dont le commentaire indique qu'elles délèguent à AppShell.
- `useReducedMotion` et plusieurs attributs d'accessibilité sont présents.
- L'état actif des sous-routes doit être testé.
- PR #31 est un brouillon ouvert ; le dernier Quality connu échoue avant les suites suivantes. Les tests mobile, PWA installée et offline ne sont donc pas considérés comme réussis.

Ces observations ne certifient ni la branche main ni la version déployée.

## Plan de tests d'acceptation

### Automatisés
- [ ] Routes principales et Home/Réel distincts.
- [ ] Menu secondaire sémantiquement distinct des moteurs.
- [ ] Libellés, état courant et correspondance des sous-routes.
- [ ] URL directe, rafraîchissement et historique.
- [ ] Panneaux : ouverture, fermeture et restitution du focus.
- [ ] FR/EN et langue du document.
- [ ] Réduction de mouvement.
- [ ] Mesures des cibles et espacements.

### Android
- [ ] Téléphone compact, portrait et paysage.
- [ ] Navigation gestuelle et trois boutons.
- [ ] Insets, clavier, découpes et zones de gestes.
- [ ] Retour depuis panneau, sous-route et moteur.
- [ ] Texte agrandi et lecteur d'écran.
- [ ] PWA installée, relance, réseau absent puis rétabli.

### iOS
- [ ] iPhone petit et grand format.
- [ ] Safe areas, Dynamic Island et clavier.
- [ ] Geste retour depuis le bord.
- [ ] VoiceOver, Dynamic Type et zoom.
- [ ] PWA ajoutée à l'écran d'accueil, mode autonome et reprise.

### Tablette/espace large
- [ ] Largeurs moyenne/large, portrait/paysage.
- [ ] Rail/sidebar et multi-panneaux.
- [ ] Fenêtre redimensionnée et multi-fenêtre.
- [ ] Aucun contenu ou contrôle masqué.

## Critères de sortie V1

La navigation ne sera déclarée conforme que lorsque les écarts sont corrigés ou explicitement acceptés, les cibles mesurées dans les unités pertinentes, les retours et safe areas testés, l'adaptation tablette décidée, les parcours d'accessibilité validés, les PWA Android/iOS vérifiées séparément et les tests automatisés pertinents exécutés. Tout contrôle ignoré ou bloqué reste signalé.

## Journal des preuves

| Date | ID | Résultat | Preuve | Statut |
| --- | --- | --- | --- | --- |
| 2026-11-06 | INIT | Matrice initiale issue de la revue documentaire PR #31 ; pas de test appareil | PR #31 | DOCUMENTÉ |

## Références

- [PR #31 — Home et navigation des moteurs](https://github.com/dollarstam5/hello-world-project/pull/31)
- [Android Navigation patterns](https://developer.android.com/design/ui/mobile/guides/layout-and-content/layout-and-nav-patterns)
- [Android System bars](https://developer.android.com/design/ui/mobile/guides/foundations/system-bars)
- [Apple Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)
- [Apple Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons)
- [W3C WCAG 2.2 Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)
