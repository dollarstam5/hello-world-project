# Phase 2 — Standards UX et accessibilité

**Statut :** en cours de consolidation  
**Périmètre :** fondations transversales V1 — mobile-first, responsive, accessibilité, préférences système et internationalisation.

Ce document fixe les règles vérifiables de la phase 2. Il ne certifie pas les écrans métier qui n'ont pas encore été audités et ne remplace pas les critères de validation automatisés ou manuels.

## 1. Principes transversaux

- Concevoir d'abord pour les petits écrans, puis enrichir progressivement tablette et desktop.
- Garder une navigation et des actions principales immédiatement compréhensibles, sans multiplier les choix simultanés.
- Respecter les préférences système, notamment la réduction des animations.
- Ne jamais dépendre uniquement de la couleur, d'une animation ou d'une icône pour transmettre une information ou une action.
- Préserver l'accès aux fonctions essentielles lorsque le réseau est lent ou indisponible.
- Toutes les chaînes visibles doivent passer par le catalogue i18n FR/EN ; aucun libellé d'interface ne doit être codé en dur dans un composant métier.
- Les états de lecture et les actions requises restent distincts dans le centre de communication.

## 2. Responsive et capacités de l'appareil

- Les seuils de mise en page proviennent des tokens de design ; ne pas recréer des breakpoints concurrents dans les composants.
- `useResponsive` agrège la classe d'appareil, la taille du viewport, l'orientation, le réseau et la réduction des effets.
- `useDevice` est la source commune pour les informations appareil/pointeur/préférence de mouvement.
- Les composants ne doivent pas implémenter leur propre détection d'appareil lorsqu'une fondation commune répond au besoin.
- Les adaptations de performance ne doivent pas supprimer une information ou une fonction essentielle.

## 3. Accessibilité et mouvement

- Les zones de navigation utilisent les éléments sémantiques de navigation et des liens/boutons natifs ; les rôles d'onglets sont réservés à de véritables interfaces à onglets.
- Les contrôles icon-only disposent d'un nom accessible.
- L'état courant d'une destination est exposé avec `aria-current="page"`.
- Les contrôles interactifs doivent conserver un focus clavier visible.
- Les animations décoratives respectent `prefers-reduced-motion` et ne doivent pas être nécessaires à la compréhension.
- Les préférences de réduction du mouvement et de pointeur sont réévaluées lorsque les préférences système changent, sans exiger un redimensionnement de fenêtre.

## 4. Navigation et langue

- La navigation principale mobile présente exactement cinq icônes, dans cet ordre : Flash, Scan, Réel, Radar, 2x2.
- Réel occupe la position centrale et utilise une icône d’antenne ; son point d’entrée est `/reel`.
- Le centre 2x2 ouvre le menu ; il ne constitue pas une destination métier supplémentaire.
- L’accueil reste hors de la barre basse : l’icône/identité de l’application ouvre `/`, et le lancement depuis l’icône installée ouvre également l’accueil.
- Le changement FR/EN est accessible depuis l'en-tête principal et conserve la langue choisie via le mécanisme i18n existant.
- Le centre de communication conserve quatre espaces indépendants : Notifications, Assistant, Messages et Réel.
- Aucun compteur ne doit être simulé ; les indicateurs ne seront activés qu'une fois raccordés à des événements métier fiables.

## 5. Réseau et états d'interface

Les composants concernés doivent prévoir les états utiles suivants, selon le contexte : chargement, contenu, vide, erreur récupérable, hors ligne, synchronisation en attente et retour au réseau. L'état hors ligne ne doit pas laisser croire qu'une action a été envoyée au serveur si elle est seulement conservée localement. Le bandeau transversal reflète uniquement l'état du réseau et les états réellement émis par le worker de synchronisation ; il n'invente ni compteur ni confirmation.

## 6. Corrections déjà appliquées dans la branche Phase 2

- Navigation basse : remplacement de la sémantique de liste d'onglets par une région de navigation nommée ; conservation de `aria-current` sur la destination active.
- Internationalisation : ajout d'un nom accessible FR/EN pour la navigation principale.
- Préférences appareil : écoute des changements de `prefers-reduced-motion` et `pointer: coarse` dans `useDevice`.
- Navigation mobile : cinq destinations dans l'ordre Flash, Scan, Réel (antenne centrale), Radar, 2x2 ; accueil hors barre basse et accessible par l'identité Vitalis et l'icône installée.
- En-tête : accès à l'accueil, bascule FR/EN, bascule clair/sombre, profil et centre de communication ; contrôles icon-only nommés et cibles tactiles minimales de 44 px.
- Réel : point d'entrée `/reel` disponible avec état d'attente explicite ; aucune fonctionnalité moteur n'est simulée avant la phase 3.
- Contrôles partagés : boutons, fermeture des feuilles/dialogues, onglets de communication et actions de reprise utilisent une cible tactile minimale de 44 px ; libellé de fermeture localisé FR/EN.
- Contraste des tokens clairs : bleu primaire et accents sémantiques ajustés en conservant leurs familles de teinte ; les paires de base texte/fond calculées dépassent 4,5:1. Les surfaces translucides et états composés restent à vérifier visuellement.
- Feuilles et dialogues : contenu défilant sur les petits écrans, avec gestion native du focus et fermeture clavier assurée par Radix.
- États réseau : le bandeau reflète les états réseau et synchronisation du worker ; aucun nombre ni succès n’est inventé.
- Premier lancement : fermer ou ignorer l’onboarding est mémorisé ; les trois repères présentent Réel, Flash/Scan et Radar/2x2.
- Les quatre espaces du centre de communication et leurs règles V1 sont spécifiés dans [Centre de communication V1](../01-product/communication-center-v1.md).

## 7. Vérifications encore requises avant clôture

- Mesurer les cibles tactiles réelles et les espacements sur petits écrans ; corriger les contrôles trop petits ou trop rapprochés.
- Parcours clavier complet, ordre de focus, focus des dialogues et retour du focus après fermeture.
- Contraste WCAG des textes, états, bordures et éléments interactifs sur les thèmes pris en charge.
- Vérification lecteur d'écran des principaux parcours FR et EN.
- Vérifier les états chargement/vide/erreur/hors ligne/récupération dans chaque moteur V1.
- Vérifier la cohérence des écrans invité/compte et la complétude des traductions.
- Relancer les contrôles qualité, tests, build et tests mobile/offline ; aucun de ces contrôles n'est déclaré réussi tant que la CI ne fournit pas de preuve.

## 8. Critère de clôture

La phase 2 ne peut être déclarée terminée qu'après revue des composants partagés et des parcours V1, corrections des anomalies bloquantes, preuves de tests automatisés et validation manuelle responsive/accessibilité. Les sujets non couverts restent explicitement ouverts ; ils ne sont pas réputés conformes par défaut.
