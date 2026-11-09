# Standards de navigation mobile — Android, iOS et Web

**Statut :** référence technique canonique proposée pour Vitalis V1.  
**Références officielles vérifiées :** 6 novembre 2026.  
**Limite :** les recommandations natives servent de référence d'expérience ; une PWA ne devient pas pour autant une application native certifiée.

## 1. Règles de lecture

Distinguer exigence normative (ex. WCAG), recommandation de plateforme, décision produit Vitalis et preuve. Une règle écrite n'est pas une preuve d'implémentation. dp, pt et CSS px sont des unités différentes et doivent être mesurées séparément.

## 2. Architecture des destinations

Home est l'entrée produit ; Réel, Flash, Scan et Radar sont les quatre moteurs ; Espace et Talents sont secondaires ; notifications, communication, profil et Vita sont transversaux. La navigation principale mobile présente cinq icônes : Flash, Scan, Réel, Radar et 2×2. Les quatre premières ouvrent les moteurs ; 2×2 ouvre le menu secondaire. Home reste hors de la barre inférieure.

Le changement de moteur doit préserver l'état de navigation pertinent lorsque cela est sûr : sous-route, filtres, recherche et position. Les règles d'expiration, de session et de permissions restent prioritaires.

## 3. Android

Références : [Navigation patterns](https://developer.android.com/design/ui/mobile/guides/layout-and-content/layout-and-nav-patterns), [System bars](https://developer.android.com/design/ui/mobile/guides/foundations/system-bars), [Edge-to-edge](https://developer.android.com/design/ui/mobile/guides/layout-and-content/edge-to-edge).

- Viser des cibles tactiles d'au moins **48×48 dp** ; mesurer la surface activable, pas seulement l'icône.
- Gérer les insets de barre d'état, barre de navigation, découpes d'écran, clavier et zones de gestes.
- Les fonds peuvent être edge-to-edge, mais les commandes essentielles restent dans une zone sûre.
- Ne pas placer de cible interactive dans les zones réservées aux gestes système.
- Tester retour gestuel et navigation à trois boutons. Le retour ferme d'abord le panneau/modal, puis remonte dans la pile.
- Sur espace moyen/large, évaluer navigation rail/latérale et multi-panneaux. Ne pas conserver automatiquement la barre inférieure sur toutes les tailles.
- Décider à partir de l'espace de fenêtre disponible, y compris pliable, multi-fenêtre et fenêtre redimensionnée.

## 4. iOS et iPadOS

Références : [Apple HIG — Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars), [Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons), [Layout](https://developer.apple.com/design/human-interface-guidelines/layout).

- Une tab bar sert aux sections de premier niveau, pas aux actions.
- Garder les destinations accessibles pendant la navigation dans les sous-écrans et préserver le contexte propre à chaque section.
- Fournir des libellés ; éviter les destinations cachées dans des onglets de débordement.
- Apple recommande une zone d'activation d'au moins **44×44 pt** pour un bouton et un état pressé perceptible pour un bouton personnalisé.
- Respecter les safe areas afin que les contrôles ne soient pas masqués par Dynamic Island, barres ou autres éléments.
- Adapter la présentation aux classes de taille, à l'orientation, au multitâche, au redimensionnement et à Dynamic Type.
- Ne pas bloquer le geste système de retour depuis le bord.

## 5. Web mobile et PWA

Références : [WCAG 2.2 SC 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum), [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

WCAG 2.2 AA demande au minimum une cible de **24×24 CSS px**, sous réserve des exceptions du critère, notamment l'espacement. Ce minimum Web n'est pas l'objectif ergonomique recommandé pour les contrôles tactiles principaux de Vitalis.

- Contrôler le critère WCAG dans l'unité CSS px et séparément les objectifs mobiles dp/pt.
- Respecter l'historique du navigateur : retour/avance, URL directe, rafraîchissement et sous-routes.
- Vérifier séparément l'installation PWA Android et iOS : icône, URL de démarrage, mode autonome, safe areas, clavier, orientation, reprise après arrière-plan, retour et réseau.
- Un service worker présent ne prouve pas qu'une navigation hors ligne fonctionne.
- Tester dans les navigateurs et modes installés réellement pris en charge.

## 6. Accessibilité transversale

Vérifier sémantique des liens/boutons/dialogues, noms accessibles, états annoncés, ordre et visibilité du focus, restitution du focus après dialogue, contraste, zoom/reflow, alternatives aux gestes complexes, réduction des animations, langue du document et états vide/chargement/erreur/hors ligne.

Une checklist ne constitue pas une certification WCAG : des tests automatisés et manuels sur les parcours réels sont nécessaires.

## 7. Décisions Vitalis V1

| ID | Décision | Acceptation |
| --- | --- | --- |
| VNS-01 | Home distincte de Réel | Identité Vitalis et icône de lancement ouvrent Home ; Réel a sa route |
| VNS-02 | Quatre moteurs | Réel, Flash, Scan et Radar accessibles et identifiables |
| VNS-03 | Barre mobile à cinq icônes | Flash, Scan, Réel, Radar, 2×2 dans cet ordre |
| VNS-04 | 2×2 secondaire | Le cinquième contrôle ouvre le menu, pas un moteur |
| VNS-05 | Cibles tactiles | ≥48 dp Android et ≥44 pt iOS natif |
| VNS-06 | WCAG | SC 2.5.8 évalué séparément en CSS px et exceptions |
| VNS-07 | Insets | Aucun contrôle essentiel masqué |
| VNS-08 | Adaptation | Layout adapté à l'espace disponible, tablette vérifiée |
| VNS-09 | Retour | Gestes système et historique navigateur préservés |
| VNS-10 | Contexte | État moteur restauré selon session et permissions |
| VNS-11 | Accessibilité | Clavier, lecteurs d'écran, contraste, zoom et mouvement vérifiés |
| VNS-12 | PWA | Installation testée séparément Android/iOS |
| VNS-13 | Langues | FR/EN vérifié dans routes, panneaux et annonces |

## Sources officielles consultées

- Android Developers — [Layouts and navigation patterns](https://developer.android.com/design/ui/mobile/guides/layout-and-content/layout-and-nav-patterns)
- Android Developers — [System bars](https://developer.android.com/design/ui/mobile/guides/foundations/system-bars)
- Android Developers — [Edge-to-edge design](https://developer.android.com/design/ui/mobile/guides/layout-and-content/edge-to-edge)
- Apple — [Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)
- Apple — [Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons)
- Apple — [Layout](https://developer.apple.com/design/human-interface-guidelines/layout)
- W3C — [WCAG 2.2 Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)
- W3C — [WCAG 2.2](https://www.w3.org/TR/WCAG22/)

Recontrôler les versions et la guidance au moment de chaque release majeure.
