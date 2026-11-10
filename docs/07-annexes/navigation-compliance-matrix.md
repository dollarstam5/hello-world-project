# Matrice de conformité — Navigation Vitalis V1

**Statut :** matrice de contrôle, non certification.  
**Référence d'implémentation examinée :** branche `fix/phase2-pwa-web-vitals`, commit de consolidation à vérifier après intégration.  
**Sources de règles :** [Navigation produit](../01-product/navigation.md) · [Standards mobiles](../02-architecture/mobile-navigation-standards.md).

## Légende

- **DOCUMENTÉ** : règle et intention explicites ; implémentation non entièrement prouvée.
- **À TESTER** : code repéré, mais preuve comportementale ou appareil réel manquante.
- **À CORRIGER** : écart confirmé par rapport à une décision validée.
- **CONFORME** : vérifié par preuve reproductible, sur le périmètre indiqué.
- **NON APPLICABLE** : sans objet, avec justification.

## Matrice de contrôle

| ID     | Exigence                     | État de départ sur PR #37                                                                                                  | Statut    | Preuve requise                                     |
| ------ | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------- | --------- | -------------------------------------------------- |
| NAV-01 | Home distincte de Réel       | Identité d'en-tête vers `/`, route `/reel`                                                                                 | À TESTER  | Navigation depuis icône installée et en-tête       |
| NAV-02 | Quatre moteurs séparés       | Routes Flash, Scan, Réel et Radar présentes ; complétude métier variable                                                   | DOCUMENTÉ | Tests de routes et frontières métier               |
| NAV-03 | Cinq icônes, ordre validé    | BottomNav définit Flash, Scan, Réel, Radar, 2×2                                                                            | À TESTER  | Test rendu, ordre, libellés et navigation          |
| NAV-04 | Réel central, icône antenne  | RadioTower au centre                                                                                                       | À TESTER  | Vérification visuelle et clavier/lecteur d'écran   |
| NAV-05 | 2×2 ouvre le menu secondaire | Bouton menu dans BottomNav avec dialogue                                                                                   | À TESTER  | Ouverture, fermeture, retour système et focus      |
| NAV-06 | État actif sémantique        | `aria-current` sur route active                                                                                            | À TESTER  | Routes parentes/sous-routes et lecteur d'écran     |
| NAV-07 | Cibles tactiles Android      | Les principaux contrôles partagés visent 48 CSS px minimum ; la mesure en dp réels reste à établir                         | À TESTER  | Mesure ≥48 dp sur appareils Android                |
| NAV-08 | Cibles tactiles iOS          | Les principaux contrôles partagés visent 48 CSS px minimum ; la mesure en pt réels reste à établir                         | À TESTER  | Mesure ≥44 pt sur appareils iOS                    |
| NAV-09 | WCAG 2.2 SC 2.5.8            | Mesure globale non fournie                                                                                                 | À TESTER  | Audit en CSS px et vérification des exceptions     |
| NAV-10 | Safe areas et insets         | Barre basse utilise safe-area-inset-bottom ; couverture complète inconnue                                                  | À TESTER  | Encoche, barres système, clavier, rotation         |
| NAV-11 | Retour Android               | Pas de preuve appareil réel                                                                                                | À TESTER  | Geste, trois boutons, panneaux et pile             |
| NAV-12 | Geste retour iOS             | Pas de preuve appareil réel                                                                                                | À TESTER  | Geste depuis bord, sous-routes et panneaux         |
| NAV-13 | Historique Web/PWA           | Routes TanStack présentes ; parcours complet non prouvé                                                                    | À TESTER  | Retour/avance, URL directe, refresh                |
| NAV-14 | Adaptation tablette          | useResponsive et useDevice existent ; navigation rail/latérale non démontrée                                               | À TESTER  | Largeurs, fenêtres redimensionnées, multi-panneaux |
| NAV-15 | Conservation du contexte     | Pas de preuve de conservation globale                                                                                      | À TESTER  | Filtres, recherche, position et sous-route         |
| NAV-16 | Langue FR/EN                 | Détection automatique FR/EN et choix manuel dans l'onboarding ; lang document géré par i18n, sans sélecteur dans le header | À TESTER  | Parcours complet, annonces et textes longs         |
| NAV-17 | Focus et clavier             | Focus visibles présents sur plusieurs contrôles                                                                            | À TESTER  | Parcours clavier et restitution après dialogue     |
| NAV-18 | Lecteurs d'écran             | Noms et rôles présents sur plusieurs contrôles                                                                             | À TESTER  | TalkBack et VoiceOver sur parcours principaux      |
| NAV-19 | Contraste et zoom            | Tokens et règles documentés ; surfaces composites non certifiées                                                           | À TESTER  | Mesures sur thèmes clair/sombre, zoom et reflow    |
| NAV-20 | Réduction du mouvement       | Préférence prise en compte dans plusieurs composants et hooks                                                              | À TESTER  | Tous les écrans et transitions                     |
| NAV-21 | PWA Android installée        | Manifest et service worker présents                                                                                        | À TESTER  | Installation, relance, mise à jour et offline réel |
| NAV-22 | PWA iOS installée            | Pas de preuve appareil réel                                                                                                | À TESTER  | Ajout écran d'accueil, mode autonome et reprise    |
| NAV-23 | Onboarding V1                | Parcours guidé présent ; le contenu doit suivre les cinq écrans validés                                                    | À TESTER  | Passage, retour, persistance et FR/EN              |
| NAV-24 | États des moteurs            | Flash/Scan partiellement implémentés ; Réel/Radar non complets                                                             | DOCUMENTÉ | États vide/erreur/offline et parcours métier réels |

## Constats techniques à conserver

- `BottomNav` porte les cinq contrôles dans l'ordre validé ; 2×2 est un bouton ouvrant `MenuSheet`, pas une route moteur.
- Réel est central et utilise l'icône `RadioTower`.
- Les liens moteur exposent `aria-current` lorsque la route correspond.
- `AppHeader` fournit Home, Notifications et Profil ; la langue est détectée automatiquement et son choix manuel reste hors du header.
- `useDevice` suit largeur, orientation, pointeur grossier et préférence de mouvement ; cela ne constitue pas encore une couche complète de détection des capacités PWA/natives.
- Les classes de taille CSS ne prouvent pas à elles seules les dimensions dp/pt sur appareil.
- Les captures de smoke test et tests navigateur ne remplacent pas les tests d'interaction sur appareil réel.

## Plan de tests d'acceptation

### Automatisés

- [ ] Routes Home/Réel distinctes et routes des quatre moteurs.
- [ ] Ordre exact des cinq icônes et comportement du menu 2×2.
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
- [ ] Texte agrandi et TalkBack.
- [ ] PWA installée, relance, réseau absent puis rétabli.

### iOS

- [ ] iPhone petit et grand format.
- [ ] Safe areas, Dynamic Island et clavier.
- [ ] Geste retour depuis le bord.
- [ ] VoiceOver, Dynamic Type et zoom.
- [ ] PWA ajoutée à l'écran d'accueil, mode autonome et reprise.

### Tablette et espace large

- [ ] Largeurs moyenne/large, portrait/paysage.
- [ ] Rail/sidebar et multi-panneaux.
- [ ] Fenêtre redimensionnée et multi-fenêtre.
- [ ] Aucun contenu ou contrôle masqué.

## Critères de sortie

La navigation ne sera déclarée conforme que lorsque les écarts seront corrigés ou explicitement acceptés, les cibles mesurées dans les unités pertinentes, les retours et safe areas testés, l'adaptation tablette décidée, les parcours d'accessibilité validés, les PWA Android/iOS vérifiées séparément et les tests automatisés exécutés. Tout contrôle ignoré ou bloqué reste signalé.

## Journal des preuves

| Date       | Référence                               | Résultat                                                 | Statut   |
| ---------- | --------------------------------------- | -------------------------------------------------------- | -------- |
| 2026-11-09 | PR #37 — revue du code et des documents | Fondations repérées ; aucune certification appareil réel | À TESTER |

## Références

- [Android Navigation patterns](https://developer.android.com/design/ui/mobile/guides/layout-and-content/layout-and-nav-patterns)
- [Android System bars](https://developer.android.com/design/ui/mobile/guides/foundations/system-bars)
- [Apple Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)
- [Apple Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons)
- [W3C WCAG 2.2 Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)
