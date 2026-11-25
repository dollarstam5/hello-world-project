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


---

## 9. Audit mobile — Card, Surface et SmartCard

### 9.1 Périmètre inspecté

- `src/components/ui/card.tsx`
- `src/shared/components/Surface.tsx`
- `src/components/app/SmartCard.tsx`
- usages représentatifs : `FlashCard`, `TrustCard`, `RadarCard`, `WalletCard`, `FlashDashboardRecordCard`, `EngineManagementGrid`.
- points d'entrée de domaine `src/modules/trust/index.ts` et `src/modules/wallet/index.ts`.

**Limite de recherche :** aucune utilisation directe de `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent` ou `CardFooter` n'a été trouvée dans le code applicatif indexé. Les observations de cette primitive portent donc sur son API et ses styles par défaut, pas sur un écran consommateur.

### 9.2 Primitive Card — `src/components/ui/card.tsx`

| Zone | Constat statique | Évaluation mobile |
|---|---|---|
| Élément racine | `div` avec bordure, fond, rayon xl et ombre | Conteneur de présentation, sans sémantique interactive ni dimensions imposées |
| En-tête | Colonne avec espacement vertical et padding 24 px | Padding important sur 320 px ; le consommateur peut le réduire |
| Titre | `div` en gras, `leading-none` et tracking serré | Pas de balise de titre sémantique ; le niveau de titre doit être assuré par le consommateur |
| Description | `div` en texte 14 px et couleur atténuée | Taille secondaire conforme à la cible, sous réserve du contraste et de la longueur |
| Contenu | Padding horizontal/vertical 24 px, retrait supérieur nul | Peut réduire la largeur utile sur petit écran ; prévoir des variantes locales si nécessaire |
| Pied | Flex horizontal, alignement centré, padding 24 px | Aucun retour à la ligne ou empilement mobile imposé ; les actions multiples doivent être adaptées par le consommateur |
| Interaction | Tous les éléments sont des `div` ; aucun rôle, tabIndex ou gestionnaire clavier | Ne pas rendre la carte cliquable sans envelopper l'action dans un lien/bouton natif ou définir un contrat interactif explicite |

**Conclusion Card :** primitive neutre et essentiellement visuelle. Elle ne fournit ni adaptation responsive propre, ni structure de titres sémantique, ni contrat d'interaction. Les consommateurs contrôlent la hiérarchie, l'espacement et le comportement des actions.

### 9.3 Surface — `src/shared/components/Surface.tsx`

| Zone | Constat statique | Évaluation mobile |
|---|---|---|
| Élément racine | `div` recevant les attributs HTML standards | Sémantique neutre ; la responsabilité du rôle appartient à l'appelant |
| Variantes | plain, elevated, sunken, glass, glass-strong, glass-soft, assistant | Variété visuelle utile ; contraste et séparation des surfaces à vérifier dans les deux thèmes |
| Padding | none, sm (12 px), md (16 px), lg (24 px) | Échelle simple ; 24 px peut être trop consommateur sur 320 px, 12 px doit rester suffisant pour le confort de lecture |
| Rayon | md à full, défaut 2xl (28 px) | Cohérent avec une interface mobile arrondie ; contrôler l'emboîtement des surfaces |
| Bordure | Option `bordered`, 1 px | La séparation ne doit pas dépendre uniquement de la couleur |
| Interaction | Option `interactive` ajoute les classes `interactive select-none` | N'ajoute ni rôle, ni tabIndex, ni gestionnaire clavier, ni action ; le nom peut laisser croire à un comportement complet alors qu'il s'agit de styles |
| Glow | soft, ambient, focal | Effet décoratif ; vérifier contraste, distraction et performance sur appareils modestes |
| Dimensions | Aucune hauteur, largeur ou cible tactile minimale définie | Les dimensions dépendent entièrement du contenu ; ne pas assimiler une grande surface à une cible d'action accessible |

**Conclusion Surface :** bon conteneur visuel partagé, mais `interactive` ne constitue pas un contrat d'interaction accessible. Une Surface interactive doit être portée par un contrôle natif ou être associée à un comportement clavier et à une sémantique explicitement audités.

### 9.4 SmartCard — `src/components/app/SmartCard.tsx`

| Zone | Constat statique | Évaluation mobile |
|---|---|---|
| Composition | Utilise Surface avec padding md, flex colonne et gap 12 px | Espacement interne compact mais régulier |
| En-tête | Slots leading, eyebrow, title, description et trailing | `leading` et `trailing` sont en shrink-0 ; les contenus injectés doivent gérer les dimensions extrêmes |
| Titre | `h3`, texte 16 px, tracking serré et text-balance | Sémantique de titre présente, mais le niveau h3 doit être cohérent avec la hiérarchie réelle de la page |
| Description | Paragraphe 14 px avec interligne relaxé | Conforme au texte secondaire ; vérifier les descriptions longues |
| Pied | Slot footer libre | Les actions, leur ordre et leurs cibles tactiles relèvent de l'appelant |
| Mode interactif | Ajoute cursor-pointer, tap, focus-ring et select-none à Surface | Ces classes ne créent pas à elles seules un rôle, tabIndex, nom accessible ni activation clavier |
| Gestionnaire d'événement | Les attributs HTML reçus sont transmis à Surface ; les usages peuvent passer `onClick` | Un `onClick` sur le div reste insuffisant pour clavier et lecteurs d'écran |
| Mouvement | motion.div avec hover/tap lorsque interactif et mouvement autorisé ; div sinon | Le retour visuel tactile est présent côté animation, mais le fallback reduced-motion ne résout pas la sémantique clavier |
| Enveloppe motion | Wrapper avec classe `contents` autour de Surface | Vérifier le rendu réel, l'ordre de focus et les interactions imbriquées sur navigateurs mobiles |

**Conclusion SmartCard :** le composant organise bien les contenus et propose un retour visuel tactile, mais son mode interactif reste un `div` cliquable sans contrat clavier natif. La préférence de mouvement réduit les animations, pas les exigences d'accessibilité.

### 9.5 Usages représentatifs

#### FlashCard — `src/components/app/FlashCard.tsx`

- Transmet `onOpen` à SmartCard et active le style interactif lorsque le callback existe.
- Le clic porte sur l'ensemble de la carte ; le slot `action` peut contenir d'autres commandes.
- Risque de commandes imbriquées dans une zone cliquable globale : propagation, ordre de tabulation et activation doivent être explicitement conçus.
- Le libellé TTL est injecté dans le slot trailing ; vérifier qu'il ne force pas le titre à une largeur trop faible.
- À tester : activation clavier, lecteurs d'écran, tap sur la commande interne et tap sur le reste de la carte.

#### TrustCard — `src/components/app/TrustCard.tsx`

- Utilise SmartCard et transmet `onOpen` comme FlashCard.
- L'icône est contenue dans une pastille 40 × 40 px ; elle est un repère visuel, pas une commande.
- Score en 14 px ; son interprétation et son échelle restent définies par l'appelant.
- Le statut vérifié comprend un libellé textuel, et ne repose donc pas uniquement sur la couleur.
- À tester : signification accessible du score, activation clavier si `onOpen` est fourni et ordre de lecture du statut.

#### RadarCard — `src/components/app/RadarCard.tsx`

- Utilise également le mode interactif SmartCard lorsque `onOpen` existe.
- Icône de localisation dans une zone 40 × 40 px.
- Distance affichée en 12 px dans le slot trailing ; ne pas y placer une information essentielle à la décision sans assurer une taille et un contraste suffisants.
- À tester : distances longues, titres localisés, petits écrans et navigation clavier.

#### WalletCard — `src/components/app/WalletCard.tsx`

- Utilise Surface directement, sans comportement interactif de carte.
- Padding lg (24 px), rayon 3xl et valeur principale 4xl ; risque de débordement pour les valeurs et devises longues.
- Métadonnées en 12 px ; elles doivent rester secondaires.
- Slot trailing en shrink-0 sans taille minimale ni sémantique imposée ; l'appelant doit fournir un bouton accessible de 48 × 48 px minimum s'il s'agit d'une action.
- Ce constat complète l'audit Wallet déjà consigné dans `mobile-interface-standards.md` ; il ne constitue pas un audit de parcours financier.

#### FlashDashboardRecordCard — `src/modules/flash/ui/dashboard/components/FlashDashboardRecordCard.tsx`

- Utilise Surface elevated, padding sm (12 px) et bordure.
- La carte elle-même n'est pas interactive ; les commandes sont des boutons séparés, ce qui évite de transformer tout le bloc en cible ambiguë.
- Les boutons de consultation, édition et suppression ont généralement 44 px de hauteur ; le bouton d'archivage et les commandes d'édition en cours sont explicitement réduits à 36 px.
- Les actions de 36 px sont inférieures à la cible mobile de 48 px et constituent un écart concret, déjà repéré dans l'audit Flash.
- Les titres et contenus sont limités à deux lignes hors édition ; vérifier que le texte tronqué n'empêche pas de comprendre la décision avant ouverture du détail.
- À tester : largeur 320 px, édition avec clavier, disposition des commandes, focus et annonce des états busy.

#### EngineManagementGrid — `src/components/experience/EngineManagementGrid.tsx`

- Utilise Surface comme conteneur de présentation dans une grille à une colonne sur petit écran, deux colonnes à partir de sm.
- Les cartes ne sont pas interactives et affichent un état « bientôt » avec texte.
- Le titre et la description restent dans un bloc min-w-0 ; l'indicateur peut conserver sa largeur.
- À tester : traduction longue, retour à une colonne, contraste de l'indicateur et absence de débordement.

### 9.6 Écarts et priorités documentaires

1. **P0 — SmartCard interactive :** remplacer le modèle de div cliquable par un lien ou bouton natif lorsque la carte représente une action unique ; si plusieurs actions coexistent, conserver des contrôles distincts et ne pas rendre toute la surface cliquable.
2. **P0 — Clavier et lecteur d'écran :** pour chaque carte interactive existante, garantir nom accessible, activation Entrée/Espace selon le rôle, focus visible, ordre de tabulation et restitution correcte du focus.
3. **P0 — Cibles tactiles :** corriger dans les usages les commandes de 36 px et vérifier toutes les actions injectées dans les slots ; cible attendue 48 × 48 px minimum.
4. **P1 — Interactions imbriquées :** documenter le comportement des actions dans les slots footer/trailing lorsque la carte entière est activable, afin d'éviter doubles déclenchements et propagation inattendue.
5. **P1 — Hiérarchie sémantique :** préciser le niveau de titre des SmartCard selon le contexte ; CardTitle en div ne fournit pas de structure de document.
6. **P1 — Responsive :** tester les contenus longs dans leading/trailing, les titres localisés, les valeurs monétaires et les traductions sur 320, 360 et 390 px.
7. **P1 — Contraste :** vérifier les variantes glass/elevated/sunken et les effets glow dans les thèmes clair et sombre, avec texte secondaire.
8. **P2 — API Surface :** clarifier que `interactive` ajoute uniquement des styles visuels et ne rend pas la surface accessible ou activable au clavier.
9. **P2 — Card non consommé :** avant d'en faire une base d'écran, définir les règles d'espacement mobile, de retour à la ligne du footer et de hiérarchie sémantique.

### 9.7 Matrice de validation sur appareils

| Scénario | Android téléphone | iPhone | Tablette |
|---|---|---|---|
| Card avec titre/description longs et padding 24 px | À tester | À tester | À tester |
| Surface plain/elevated/glass/sunken en thèmes clair/sombre | À tester | À tester | À tester |
| SmartCard interactive : activation tactile et clavier externe | À tester | À tester | À tester |
| Focus visible, nom accessible et ordre lecteur d'écran | À tester | À tester | À tester |
| Actions imbriquées dans footer/trailing | À tester | À tester | À tester |
| Slots leading/trailing et contenus localisés longs | À tester | À tester | À tester |
| Boutons de carte à 36/44/48 px et zoom texte | À tester | À tester | À tester |
| Valeurs Wallet longues et absence de débordement horizontal | À tester | À tester | À tester |

### 9.8 Conclusion de cette étape

Card est une primitive visuelle peu contrainte et sans usage applicatif direct identifié. Surface est largement réutilisée et fournit une base de présentation cohérente, mais son option `interactive` n'ajoute pas de sémantique ou de comportement clavier. SmartCard apporte une composition riche et un retour tactile animé, mais le mode interactif repose lui aussi sur un élément div ; c'est le principal risque transversal relevé.

Les usages FlashCard, TrustCard et RadarCard héritent de cette limite lorsqu'un callback `onOpen` est fourni. À l'inverse, FlashDashboardRecordCard sépare la surface des boutons d'action, mais comporte des cibles de 36 px dans certains états. WalletCard et EngineManagementGrid sont des surfaces de présentation et ne doivent pas être considérées comme interactives.

**Limite de l'audit :** inspection statique uniquement. Aucun rendu navigateur, test automatisé, test clavier, lecteur d'écran ou essai sur appareil réel n'a été exécuté.

**Aucun code applicatif ou composant runtime n'a été modifié dans cette étape.**
