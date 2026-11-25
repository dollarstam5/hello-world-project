# Audit mobile des composants UI partagés

## 1. Objet et périmètre

Ce document consigne des audits statiques successifs des composants UI partagés de Vitalis. Il complète `mobile-interface-standards.md` sans remplacer les règles normatives de ce document.

**Priorités produit :** Android et iOS sur téléphone (P0), tablette (P1), desktop (P2). L'audit de code ne vaut pas validation visuelle ou fonctionnelle sur appareil réel.

**Périmètre de cette étape :**
- `src/components/ui/dialog.tsx`
- `src/components/ui/alert-dialog.tsx`
- `src/components/ui/sheet.tsx`
- `src/components/app/Modal.tsx`
- `src/components/app/Sheet.tsx`
- usages échantillonnés : composition Flash, détail/suppression Flash, annulation Radar et panneau Communication.

Les composants `Drawer`, `Popover` et les autres primitives superposées ne font pas l'objet d'un audit complet dans cette étape.

## 2. Contrat mobile de référence

Pour toute surface modale ou feuille mobile :
- le contenu doit rester dans la zone visible, y compris avec clavier virtuel, zoom et grandes tailles de texte ;
- le contenu long doit pouvoir défiler sans rendre les actions principales inaccessibles ;
- les zones de fermeture et commandes doivent viser au moins 48 × 48 px ;
- le titre doit être programmatique et le contenu descriptif associé lorsque cela apporte un contexte utile ;
- l'ouverture doit placer le focus dans la surface, le conserver pendant l'interaction et le restituer au déclencheur à la fermeture ;
- Échap, retour système et fermeture explicite doivent avoir un comportement cohérent avec la criticité de l'action ;
- les opérations en cours doivent empêcher une fermeture accidentelle seulement lorsque cela protège réellement une opération non annulable ; l'état bloqué doit rester compréhensible ;
- les animations doivent respecter la préférence de réduction des mouvements ;
- les zones proches des bords doivent respecter les safe areas iOS et Android.

## 3. Audit statique des primitives

### 3.1 Dialog — `src/components/ui/dialog.tsx`

| Zone | Constat statique | Évaluation mobile |
|---|---|---|
| Primitive et accessibilité | Basé sur Radix Dialog Root, Trigger, Portal, Overlay, Content, Title et Description | S'appuie sur les comportements accessibles de Radix ; valider focus initial, confinement et restitution sur appareils et lecteurs d'écran |
| Superposition | Overlay fixe plein écran, fond noir à 80 %, animation d'opacité | Structure adaptée à une modale ; contraste et intensité à vérifier en thèmes clair/sombre |
| Dimensions du contenu | `w-full max-w-lg`, centré verticalement et horizontalement, `max-h-[calc(100dvh-2rem)]`, défilement vertical et overscroll contenu | Bonne borne de hauteur générale ; le centrage peut être moins confortable avec le clavier ouvert ou un contenu très haut |
| Espacement | Padding par défaut 24 px | Lisible mais potentiellement coûteux sur 320 px ; les usages mobiles peuvent réduire le padding sans supprimer les marges de sécurité |
| Fermeture | Bouton interne traduit, `min-h-12 min-w-12`, focus ring, icône décorative masquée et libellé SR | Cible 48 × 48 px conforme ; vérifier qu'il ne recouvre ni titre ni contenu sur les petites largeurs |
| En-tête et pied | Header centré sur mobile ; Footer en colonne inversée puis ligne à partir de `sm` | Ordre mobile favorable aux actions ; contrôler l'ordre de lecture et l'ordre visuel pour les actions destructrices |
| Mouvement | Classes `motion-reduce` sur overlay et contenu | Bonne prise en compte déclarative de la réduction des mouvements |
| Fermeture pendant une opération | Le composant laisse le contrôle à `onOpenChange` et aux appelants | Chaque parcours doit expliciter sa politique de fermeture pendant une sauvegarde ou publication |

**Conclusion Dialog :** la primitive possède une hauteur maximale, un défilement interne et une fermeture de 48 px. Le principal point à valider est l'expérience clavier virtuel / contenu haut, ainsi que la collision du bouton de fermeture avec les titres.

### 3.2 AlertDialog — `src/components/ui/alert-dialog.tsx`

| Zone | Constat statique | Évaluation mobile |
|---|---|---|
| Primitive et intention | Basé sur Radix AlertDialog | Adapté aux décisions nécessitant une confirmation explicite ; ne pas l'utiliser pour des formulaires longs |
| Dimensions | `w-full max-w-lg`, centré, padding 24 px ; aucune hauteur maximale ni règle de défilement propre | Risque de dépassement en faible hauteur, avec clavier ou texte agrandi |
| Overlay et animation | Overlay fixe ; animations d'entrée/sortie, sans déclaration locale `motion-reduce` | Ajouter une vérification de préférence de mouvement au niveau de la primitive |
| Titre et description | Composants Title et Description dédiés, texte de description en 14 px | Sémantique disponible ; le contenu doit rester bref et explicite |
| Actions | Action et Cancel réutilisent `buttonVariants` ; leurs tailles par défaut ont `min-h-12` | Hauteur minimale 48 px héritée de Button ; le footer passe en colonne sur mobile puis en ligne à partir de `sm` |
| Fermeture | Pas de bouton de fermeture visuel dans le contenu | Cohérent pour une confirmation bloquante ; la possibilité d'annuler doit être explicite sauf décision irréversible clairement expliquée |

**Conclusion AlertDialog :** les actions héritent de cibles de 48 px via Button, mais la surface ne borne pas sa hauteur et ne définit pas de défilement. C'est la lacune structurelle prioritaire de ce périmètre, notamment pour les textes longs ou les traductions.

### 3.3 Sheet — `src/components/ui/sheet.tsx`

| Zone | Constat statique | Évaluation mobile |
|---|---|---|
| Primitive | Basé sur Radix Dialog | Bénéficie du modèle dialog pour le focus et l'isolation ; confirmer le retour système et la restitution du focus |
| Positions | Variantes top, bottom, left, right ; droite par défaut | Le wrapper applicatif choisit bottom par défaut, cohérent mobile-first |
| Feuille latérale | Gauche/droite : hauteur totale, largeur 75 %, max-width sm à partir de `sm` | Convenable pour une navigation latérale sur écran large ; sur téléphone, privilégier bottom ou plein écran selon le contenu |
| Feuille verticale | Top/bottom sans hauteur maximale par défaut ; défilement vertical et overscroll contenu | Le défilement existe, mais la hauteur disponible doit être explicitement bornée par les usages |
| Fermeture | Bouton interne traduit de 48 × 48 px, focus ring | Cible conforme ; contrôler le chevauchement avec le titre et les safe areas |
| Mouvement | Animations de glissement et classes `motion-reduce` | Bonne prise en compte déclarative de la réduction des mouvements |
| Safe areas | Pas de safe area intégrée à la primitive | À traiter dans le wrapper ou le consommateur selon le bord et le système |

**Conclusion Sheet :** les directions sont flexibles et le contenu défile. La primitive ne fixe toutefois pas de limite de hauteur pour les feuilles top/bottom et ne gère pas elle-même les safe areas.

## 4. Wrappers applicatifs

### 4.1 `src/components/app/Modal.tsx`

- Encapsule Dialog pour les décisions ciblées, petits formulaires et tâches courtes ; sa documentation conseille Sheet pour le contenu long.
- Le wrapper ajoute une apparence visuelle, un titre/description optionnels et un footer optionnel.
- Il ne modifie pas la hauteur maximale héritée de Dialog.
- Le footer accepte un ReactNode libre : l'appelant reste responsable de l'ordre, de l'espacement, des libellés et des cibles tactiles.
- Le titre et la description sont optionnels dans l'API. Les usages qui les omettent doivent fournir une alternative accessible pertinente.
- Le padding ajouté et les styles de surface doivent être testés à 320 px avec clavier et texte agrandi.

### 4.2 `src/components/app/Sheet.tsx`

- Encapsule la primitive Sheet avec bottom comme côté par défaut.
- Le côté bottom ajoute des coins supérieurs arrondis et un padding inférieur intégrant `env(safe-area-inset-bottom)`.
- Le côté top arrondit le bas, mais ne définit pas de safe area supérieure.
- Le titre et la description sont optionnels ; l'appelant doit fournir un nom accessible si la feuille en a besoin.
- Le wrapper n'ajoute pas de limite de hauteur générale. Les consommateurs peuvent fournir une classe telle que `max-h-[92dvh]`.
- Le wrapper ajoute une poignée décorative non interactive. Elle ne doit pas être présentée comme une commande de glissement : le composant Sheet n'implémente pas de geste de drag dans cette API.

## 5. Audit d'échantillon des usages

### 5.1 Composition Flash — `FlashComposerDialog.tsx`

- Le dialogue devient une feuille ancrée en bas sur mobile, avec hauteur maximale de 92dvh, défilement et padding inférieur lié à la safe area.
- À partir de `sm`, il revient à une modale centrée.
- Le titre et la description sont fournis ; le titre est augmenté à 20 px.
- La fermeture est ignorée pendant la publication (`publishing`), afin de ne pas interrompre l'opération.
- À tester : ouverture du clavier avec les champs de composition, visibilité des boutons de validation, scroll jusqu'au bas, petits écrans et restitution du focus après publication.

### 5.2 Détail Flash — `FlashDashboardDetailDialog.tsx`

- Le contenu est borné à 85dvh et défilable.
- Le titre autorise les retours à la ligne et réserve un espace au bouton de fermeture.
- Les actions utilisent Button en taille sm ; la primitive Button leur garantit une hauteur minimale de 48 px malgré le texte compact.
- À tester : titre et corps très longs, largeur 320 px, focus dans la liste d'actions et coexistence du bouton de fermeture avec le contenu.

### 5.3 Suppression Flash — `FlashDashboardDeleteDialog.tsx`

- AlertDialog fournit titre, description, annulation et confirmation.
- Les deux actions sont désactivées pendant l'opération.
- L'action intercepte l'événement et empêche la fermeture automatique avant le résultat de l'opération.
- À tester : retour d'erreur, annonce de l'état de progression, comportement de fermeture après échec et hauteur en grande taille de texte.

### 5.4 Annulation Radar — `RadarManagement.tsx`

- AlertDialog est contrôlé par l'existence de l'enregistrement en attente.
- La fermeture est empêchée pendant l'annulation réseau ; les actions sont désactivées pendant l'opération.
- L'action confirme l'annulation puis l'état est fermé après succès.
- À tester : annonce de progression et d'erreur, retour du focus vers le déclencheur et fermeture après échec.

### 5.5 Panneau Communication — `CommunicationSheet.tsx`

- Le wrapper Sheet est utilisé avec titre et limite de hauteur 92dvh.
- Le contenu combine onglets, notifications, liens, assistant chargé à la demande et états réseau.
- La feuille contient plusieurs zones défilables potentielles ; le scroll global et le scroll interne doivent rester compréhensibles.
- Les déclencheurs d'onglets et les commandes de notification ne sont pas audités ici individuellement.
- À tester : clavier virtuel dans l'onglet Assistant, scroll jusqu'aux dernières notifications, navigation par lecteur d'écran et fermeture avec le retour Android.

## 6. Écarts et priorités documentaires

1. **P0 — AlertDialog :** définir une hauteur maximale liée au viewport et un défilement interne pour les cas de contenu long, sans masquer les actions.
2. **P0 — Sheet :** formaliser une hauteur maximale pour les feuilles top/bottom ; garder les actions importantes accessibles lorsque le contenu défile.
3. **P0 — Clavier et safe areas :** valider les Dialog et Sheet avec clavier virtuel ouvert, encoche/barre système, orientation et petites hauteurs.
4. **P1 — Mouvement :** harmoniser la prise en compte de `prefers-reduced-motion` dans AlertDialog avec Dialog et Sheet.
5. **P1 — Contrat de fermeture :** documenter par usage le comportement d'Échap, du retour système, du clic overlay et de la fermeture pendant les opérations asynchrones.
6. **P1 — Accessibilité :** tester focus initial, confinement, restitution au déclencheur, nom accessible, ordre des actions et annonces de progression/erreur.
7. **P1 — Titres et fermeture :** vérifier l'absence de chevauchement entre bouton de fermeture et titres longs ou localisés.
8. **P2 — Cohérence wrapper :** préciser dans les contrats Modal/Sheet quand un titre est obligatoire et quand un contenu long doit basculer vers Sheet.

## 7. Matrice de validation sur appareils

| Scénario | Android téléphone | iPhone | Tablette |
|---|---|---|---|
| Dialog court, titre long et bouton de fermeture | À tester | À tester | À tester |
| Dialog avec formulaire et clavier ouvert | À tester | À tester | À tester |
| AlertDialog avec description longue / texte agrandi | À tester | À tester | À tester |
| Actions AlertDialog avec progression, succès et erreur | À tester | À tester | À tester |
| Sheet bottom proche de 92dvh et contenu long | À tester | À tester | À tester |
| Safe areas haut/bas et orientation paysage | À tester | À tester | À tester |
| Retour système, Échap, overlay et restitution du focus | À tester | À tester | À tester |
| Lecteur d'écran, ordre de lecture et annonces | À tester | À tester | À tester |
| Réduction des animations | À tester | À tester | À tester |

## 8. Conclusion de l'étape

Les primitives Dialog et Sheet possèdent des bases mobiles utiles : contenu défilable, fermeture de 48 × 48 px et réduction des animations. Le wrapper Sheet ajoute la safe area inférieure pour sa variante bottom. Les usages Flash illustrent une adaptation mobile plus poussée avec une présentation en feuille.

Les principaux écarts documentés sont l'absence de borne de hauteur et de défilement explicites dans AlertDialog, l'absence de hauteur maximale par défaut pour Sheet top/bottom, et la validation nécessaire du clavier virtuel, des safe areas et du focus. Les comportements Radix ne sont pas certifiés par inspection statique.

**Limite de l'audit :** aucune exécution sur appareil, mesure de rendu, test de lecteur d'écran ou test automatisé n'a été effectué. Les conclusions décrivent le code inspecté, pas une conformité runtime certifiée.

**Aucun code applicatif ou composant runtime n'a été modifié dans cette étape.**
