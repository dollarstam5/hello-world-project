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


---

## 10. Audit mobile — Toasts, notifications et bannières d'état

### 10.1 Périmètre inspecté

- Toast : `src/components/ui/sonner.tsx` et recherche des montages `Toaster` / appels `toast.*`.
- Bannière générique : `src/shared/components/StatusBanner.tsx`.
- Réseau et synchronisation : `src/platform/offline/ui/OfflineBanner.tsx`, `src/shared/components/SyncIndicator.tsx`, `src/platform/network/useNetworkStatus.ts`, `src/platform/offline/sync-status.ts`.
- PWA : `src/platform/pwa/ui/InstallBanner.tsx`, `src/platform/pwa/ui/UpdateBanner.tsx`.
- Notice transitoire : `src/components/experience/AssistantNoticeLayer.tsx`, `src/lib/app/assistant-notices.ts`.
- Centre de communication et badge : `src/components/experience/AppHeader.tsx`, `src/components/experience/CommunicationSheet.tsx`, `src/lib/communication/runtime.ts`, `dispatch.ts`, `gate.ts` et `delivery-session.ts`.
- Intégration globale : `src/app/shell/AppShell.tsx`.

### 10.2 Toast — wrapper Sonner

| Zone | Constat statique | Évaluation mobile |
|---|---|---|
| Primitive | `src/components/ui/sonner.tsx` encapsule Sonner et applique les classes de thème, bordure, ombre, description et boutons d'action/annulation | Le style est centralisé, mais le contrat fonctionnel et les options restent ceux de Sonner |
| Position | Aucune position n'est fixée dans le wrapper | La position effective dépend des props ou des valeurs par défaut du fournisseur ; elle n'est pas contractualisée pour téléphone/PWA |
| Durée | Aucun délai par défaut n'est défini dans ce wrapper | La durée, les exceptions pour erreurs et la possibilité de pause doivent être décidées explicitement |
| Fermeture | Aucune option de bouton de fermeture n'est fixée ici | Impossible de garantir une fermeture manuelle cohérente pour les messages longs ou urgents |
| Annonce | Aucun rôle ARIA n'est ajouté localement ; il est délégué à Sonner | Vérifier le rôle live, la priorité, l'annonce des actions et l'absence de doublon avec les annonces inline |
| Utilisation | La recherche du code indexé n'a pas identifié de montage `<Toaster>` ni d'appel `toast.*` | Ne pas considérer le système toast comme effectivement disponible dans l'application sur la seule présence du wrapper |

**Conclusion Toast :** le wrapper de style existe, mais aucun montage ni usage applicatif n'a été retrouvé dans l'index inspecté. La position, la durée, la fermeture et le contrat d'annonce ne sont donc pas confirmés. Il faut éviter d'introduire des toasts concurrents aux retours locaux tant qu'une politique unique n'est pas définie.

### 10.3 StatusBanner — bannière générique

| Zone | Constat statique | Évaluation mobile |
|---|---|---|
| Sémantique | `role="alert"` pour `error` et `warning`, `role="status"` pour `info`, `success` et `intelligence` | Priorité d'annonce cohérente avec une erreur/alerte, et annonce non urgente pour les états ordinaires |
| Contenu | Titre et description facultatifs, fournis par l'appelant | Un message sans titre reste possible ; le sens doit être compréhensible hors contexte |
| Action | Slot `action` libre dans un conteneur `shrink-0` | Aucune taille minimale ni sémantique imposée ; l'appelant doit garantir un bouton/lien natif et une cible de 48 × 48 px |
| Présentation | Padding horizontal 14 px, vertical 12 px, texte 14 px, description 13 px | Format compact ; contrôler les chaînes longues, la traduction et la largeur utile sur 320 px |
| Couleur | Variantes info/success/warning/error/intelligence avec icône correspondante | L'icône accompagne la couleur ; conserver un libellé explicite et ne jamais coder le sens par la couleur seule |
| Fermeture | Aucun mécanisme de fermeture intégré | Adapté aux états persistants tant qu'ils sont vrais ; pour une bannière fermable, le consommateur doit ajouter une commande accessible |

**Conclusion StatusBanner :** bonne primitive inline pour les états non bloquants. Le rôle ARIA dépend du type, mais les dimensions et le contrat d'action ne sont pas garantis par le composant.

### 10.4 Réseau et synchronisation

#### OfflineBanner — `src/platform/offline/ui/OfflineBanner.tsx`

- N'apparaît qu'après montage et lorsqu'une perte réseau ou une activité de synchronisation réelle existe.
- S'appuie sur StatusBanner : avertissement lorsque le réseau est absent ou que la synchronisation est en erreur/hors ligne ; information pour les autres phases actives.
- Le nombre d'éléments en attente n'est montré que s'il est fourni par le statut de synchronisation ; le texte distingue un élément de plusieurs éléments.
- Le composant ne fournit ni bouton ni fermeture : l'état disparaît lorsque la condition disparaît.
- La bannière est dans le flux du shell (padding 16 px), pas dans une couche flottante ; elle ne masque donc pas directement la navigation.
- Le statut de synchronisation peut évoluer pendant une opération. Il faut vérifier que les annonces successives ne deviennent pas trop fréquentes.

#### SyncIndicator — `src/shared/components/SyncIndicator.tsx`

- Utilise `role="status"` et `aria-live="polite"`, avec une phrase traduite et un compteur d'attente facultatif.
- L'icône est décorative pour le lecteur d'écran ; le texte porte l'information.
- Le texte et le compteur sont en 12 px (`text-xs`) : taille réservée à une information secondaire et courte, à ne pas utiliser comme seul retour essentiel sur la sécurité d'une sauvegarde.
- L'icône tourne lorsque le travail n'est pas stabilisé ; aucune adaptation locale à `prefers-reduced-motion` n'est visible dans ce composant.
- À tester : annonces lors des transitions rapides, lecteur d'écran, réduction du mouvement et distinction claire entre « en attente », « hors ligne », « erreur » et « enregistré ».

### 10.5 Bannières PWA

#### InstallBanner — `src/platform/pwa/ui/InstallBanner.tsx`

- Utilise `role="region"` avec un nom accessible localisé ; ce rôle n'annonce pas automatiquement l'apparition comme un statut live.
- La fermeture est mémorisée dans localStorage et la bannière est masquée par défaut pendant l'hydratation de cette préférence.
- La bannière est flottante en bas, à `6rem + safe-bottom`, au-dessus du contenu ; elle n'a pas de gestionnaire commun d'empilement.
- Le texte secondaire est en 11 px, avec troncature sur une ligne : il faut s'assurer que l'information ou les instructions iOS/Android ne sont pas tronquées au point de devenir inutilisables.
- Le bouton Installer n'a pas de hauteur minimale explicite ni de nom accessible complémentaire au texte visible ; sa taille dépend du padding vertical de 6 px et du texte 12 px.
- Le bouton de fermeture fait 32 × 32 px : cible inférieure au standard mobile 48 × 48 px.
- L'action d'installation est asynchrone, mais le composant ne montre pas localement d'état occupé ni de prévention explicite des doubles activations.
- À tester : safe area, clavier, chevauchement avec la navigation basse, petit écran, zoom texte et instructions manuelles.

#### UpdateBanner — `src/platform/pwa/ui/UpdateBanner.tsx`

- Utilise `role="status"` ; le rôle implique une annonce polie même sans attribut `aria-live` explicite.
- La bannière est fixe en bas à `6.5rem + safe-bottom`, avec `z-50`. Elle est placée à seulement 0,5 rem de la position de la bannière d'installation (`z-40`) : en l'absence de gestionnaire de pile, un chevauchement est possible si les deux sont visibles simultanément.
- L'action de mise à jour et la fermeture ont une cible minimale de 48 × 48 px et un focus visible.
- L'action est désactivée pendant `applying`, avec icône animée ; le libellé ne change pas localement pour annoncer explicitement la progression.
- La fermeture masque la bannière dans l'état local du composant, jusqu'à son prochain remontage ; aucune persistance durable n'est définie.
- À tester : annonce du statut, mise à jour en cours, échec/reprise, fermeture, coexistence avec InstallBanner et navigation basse.

### 10.6 Notice temporaire Assistant

- `AssistantNoticeLayer` n'affiche une notice que si l'assistant est explicitement activé et qu'un message a été publié.
- La notice passe par le runtime de communication, est marquée présentée après rendu, et le message de bienvenue n'est marqué comme présenté qu'à ce moment-là.
- Le conteneur utilise `role="status"` et `aria-live="polite"`, avec un message en 14 px.
- La disparition automatique est fixée à 9 secondes ; la fermeture manuelle est disponible.
- Le bouton de fermeture est explicitement ramené à 32 × 32 px par `h-8 w-8`, malgré l'usage de la primitive Button : écart concret au minimum tactile de 48 px.
- La notice est positionnée en haut, avec prise en compte de `--safe-top` et `z-[70]`. Le wrapper extérieur ignore les interactions, tandis que la carte interne les réactive.
- Le délai de neuf secondes peut être trop court pour une phrase longue, une traduction plus longue ou une personne utilisant un lecteur d'écran ; aucune pause au survol/focus ni préférence de durée n'est visible.
- Le remplacement d'une notice par une autre et la gestion de plusieurs notices simultanées ne sont pas exposés : le store conserve une seule notice courante.
- À tester : lecture complète avant retrait, annonce unique, fermeture clavier/tactile, changement de langue et interruption par une autre notice.

### 10.7 Notifications du centre de communication

- Le bouton cloche de `AppHeader` utilise une cible de 48 × 48 px et un nom accessible qui inclut le nombre d'éléments nécessitant une attention. Le badge visuel est masqué aux lecteurs d'écran pour éviter la répétition du compteur.
- Le calcul évite de compter deux fois les bips reçus représentés à la fois par l'événement serveur et la projection En direct.
- `CommunicationSheet` sépare Notifications, Assistant (uniquement après opt-in), Messages et En direct ; les compteurs d'onglets sont inclus dans les noms accessibles.
- Les événements sont triés du plus récent au plus ancien et les actions renvoient vers le moteur propriétaire. Le marquage comme lu est disponible.
- Les actions « ouvrir » et « marquer comme lu » ont des hauteurs minimales de 40 px dans les cartes de notification, sous la cible recommandée de 48 px.
- Les badges visuels sont compacts (minimum 16 px) mais masqués aux lecteurs d'écran ; le compteur est exposé via le nom de l'onglet.
- Les états vides, hors ligne et chargement sont exposés avec `role="status"` ou `aria-live="polite"` selon les cas.
- Le runtime documenté en code est en mémoire de session : les événements du centre ne constituent pas un historique persistant et sont effacés au changement de session/rechargement.
- Les notifications sont des éléments de liste et ne sont pas annoncées automatiquement à chaque publication par un conteneur live global ; l'utilisateur les consulte en ouvrant le centre.
- À tester : navigation des onglets au clavier, mise à jour du compteur, marquage lu, ordre de lecture, événements ajoutés pendant que la feuille est ouverte et absence de doublons.

### 10.8 Empilement, durée et priorités transversales

1. **P0 — Cibles tactiles :** porter à 48 × 48 px le bouton de fermeture Assistant (32 px), la fermeture Install (32 px) et les actions de notification actuellement à 40 px ; vérifier aussi le bouton Installer.
2. **P0 — Empilement mobile :** définir une règle unique de pile pour InstallBanner, UpdateBanner, AssistantNoticeLayer et les futurs toasts. Les deux bannières PWA occupent presque la même position basse et les couches ont des z-index différents sans coordination de hauteur.
3. **P0 — Annonces live :** fixer une politique par type : `alert` assertif uniquement pour les erreurs nécessitant une attention immédiate ; `status` poli pour les confirmations et progressions ; pas de doublon toast + message inline + lecteur d'écran.
4. **P1 — Durées :** formaliser les délais par gravité et longueur, permettre la fermeture manuelle, ne pas retirer une information critique automatiquement et suspendre le délai lorsque la notice reçoit le focus si le fournisseur le permet.
5. **P1 — Réduction du mouvement :** vérifier les animations de progression/toast et respecter `prefers-reduced-motion`, notamment SyncIndicator.
6. **P1 — Progression asynchrone :** annoncer les transitions importantes sans répéter chaque changement de compteur ou chaque mise à jour fréquente.
7. **P1 — Texte et localisation :** tester les messages longs en français/anglais, les tailles de texte agrandies et les largeurs 320/360/390 px ; éviter les troncatures qui retirent une instruction utile.
8. **P1 — Persistance et vérité métier :** distinguer les événements de session des notifications distantes/persistantes ; ne pas promettre une notification push ou un historique durable qui n'est pas implémenté.
9. **P2 — Toast :** avant d'activer le wrapper Sonner, documenter son point de montage, sa position mobile, ses durées, ses actions, son comportement hors ligne et sa relation avec les messages inline.

### 10.9 Matrice de validation sur appareils

| Scénario | Android téléphone | iPhone | Tablette |
|---|---|---|---|
| StatusBanner info/success/warning/error avec texte long | À tester | À tester | À tester |
| OfflineBanner lors des transitions réseau/synchronisation | À tester | À tester | À tester |
| SyncIndicator avec lecteur d'écran et réduction du mouvement | À tester | À tester | À tester |
| InstallBanner avec instruction iOS/Android et stockage bloqué | À tester | À tester | À tester |
| Fermeture Install et Assistant à 48 × 48 px minimum | À tester | À tester | À tester |
| InstallBanner et UpdateBanner visibles simultanément | À tester | À tester | À tester |
| UpdateBanner pendant application, échec et reprise | À tester | À tester | À tester |
| Notice Assistant lue intégralement avant expiration | À tester | À tester | À tester |
| Cloche, compteurs, onglets et marquage comme lu | À tester | À tester | À tester |
| Toast si/une fois monté : position, durée, fermeture, annonces | À tester | À tester | À tester |
| Safe areas, navigation basse, clavier et orientation | À tester | À tester | À tester |

### 10.10 Conclusion de cette étape

Le socle comporte plusieurs mécanismes distincts : StatusBanner pour les états inline, OfflineBanner/SyncIndicator pour le réseau et la synchronisation, des bannières flottantes dédiées à l'installation et à la mise à jour PWA, une notice temporaire opt-in pour l'Assistant, et un centre de communication en mémoire de session.

Les écarts les plus nets concernent les cibles de fermeture de 32 px (Assistant et installation), les actions de notification à 40 px, l'absence de règle commune d'empilement des bannières PWA, la durée fixe de neuf secondes pour les notices Assistant et l'absence de contrat explicite pour le wrapper Toast. Les rôles live sont présents sur plusieurs composants, mais la fréquence réelle des annonces et leur comportement avec les lecteurs d'écran doivent être testés.

**Limite de l'audit :** inspection statique du code et recherche des usages indexés. Aucun test sur appareil réel, lecteur d'écran, rendu visuel ou mesure de durée n'a été effectué. La recherche n'a pas retrouvé de montage Toaster ni d'appel toast applicatif ; ce constat reste limité au code indexé consulté.

**Aucun code applicatif ou composant runtime n'a été modifié dans cette étape.**


---

## 11. Audit du parcours de collecte en langage humain — et non des formulaires classiques

### 11.1 Intention produit à respecter

Ce périmètre ne doit pas être traité comme un audit générique de champs, de formulaires et de listes déroulantes. Le modèle d'expérience Vitalis est la **collecte progressive en langage humain** : la personne raconte ce qu'elle cherche, ce qu'elle propose ou ce qu'elle veut faire ; Vitalis identifie les informations utiles, conserve le sens de la demande, ne demande que ce qui manque réellement et transforme les éléments compris en données métier.

Le principe fondamental de Vitalis (docs/foundation/vitalis-core-principles.md) impose :
- agir dès que le minimum nécessaire est disponible ;
- ne pas bloquer une action pour une préférence ou un détail facultatif ;
- poser uniquement la question indispensable lorsque l'action ne peut réellement pas avancer ;
- conserver ce qui est déjà compris et ne pas faire recommencer la personne ;
- présenter les informations inconnues comme inconnues, sans les inventer ;
- proposer les enrichissements facultatifs après ou autour de l'action, sans en faire un questionnaire préalable.

La référence éditoriale du produit exige un ton humain, simple, direct et contextualisé. Le langage humain ne signifie toutefois pas que le système V1 comprend déjà une conversation libre illimitée ou qu'il utilise nécessairement un modèle génératif.

### 11.2 Parcours de référence à rendre lisible

Le parcours cible doit être documenté comme une progression conversationnelle, et non comme une suite de pages de formulaire :

1. **Expression libre** — la personne écrit ou dicte naturellement son besoin ou son offre, sans devoir connaître les catégories internes de Vitalis.
2. **Compréhension** — Vitalis extrait les faits et critères réellement présents dans les mots : intention, objet, lieu, temporalité, quantité, contraintes et préférences selon le moteur.
3. **Qualification** — chaque élément est distingué comme confirmé par la personne, détecté avec confiance limitée, inconnu, ou simplement facultatif. Une inférence du parseur ne doit pas être présentée comme une déclaration certaine.
4. **Décision d'avancement** — si le minimum métier, les autorisations et les consentements sont réunis, Vitalis avance avec les données disponibles.
5. **Clarification humaine ciblée** — si une information réellement indispensable manque, Vitalis pose une seule question à la fois, dans des mots naturels, en conservant la demande initiale et les réponses précédentes.
6. **Confirmation proportionnée** — avant une action engageante ou difficilement réversible, Vitalis résume ce qu'il va réellement faire et demande l'accord requis. Une confirmation ne doit pas devenir une reconstitution exhaustive de formulaire.
7. **Action et retour** — Vitalis réalise l'action, puis explique clairement le résultat, les limites et les informations encore inconnues.
8. **Enrichissement facultatif** — les détails utiles mais non nécessaires peuvent être ajoutés plus tard, sans empêcher la première valeur utile.

Les contrôles structurés (choix, date, rayon, autorisation, catégorie) restent légitimes lorsqu'ils sont plus clairs, plus sûrs ou plus fiables qu'une réponse libre. Ils doivent être présentés comme une question contextuelle ponctuelle, pas comme une grille de champs à remplir. Les consentements et confirmations de sécurité ne doivent jamais être inférés à partir du langage naturel.

### 11.3 Ce que le code V1 fait effectivement aujourd'hui

L'inspection du code montre une différence entre l'intention produit et plusieurs parcours UI déjà présents. Il ne faut ni masquer cette différence ni décrire la V1 comme un agent conversationnel complet.

#### Flash — expression libre suivie d'une revue structurée

Fichiers inspectés :
- src/modules/flash/ui/FlashComposerDialog.tsx
- src/modules/flash/ui/FlashComposerWriteStep.tsx
- src/modules/flash/ui/FlashComposerReviewStep.tsx
- src/modules/flash/ui/useFlashComposer.ts
- src/modules/flash/ui/flash-composer-helpers.ts
- packages/core-logic/src/flash.ts

Constats :
- L'étape initiale offre un texte libre (600 caractères) et une dictée vocale lorsque Web Speech Recognition est disponible.
- parseFlashIntent est un parseur local, déterministe et fondé sur des expressions régulières. Il propose le type besoin/offre, une catégorie et un créneau temporel ; il ne comprend pas librement le lieu, la date exacte, la quantité, la durée ou toutes les contraintes.
- Pour un texte d'au moins trois caractères, une proposition est affichée. Le repli peut être « offre », « autre » et « aujourd'hui » même lorsque ces valeurs ne sont pas explicitement exprimées : ce sont des valeurs par défaut techniques, pas des faits déclarés par la personne.
- L'interface affiche ensuite une deuxième étape de revue avec le texte original, un contrôle de localisation, des sélecteurs type/catégorie/date, des choix de portée et d'urgence, puis une action d'enregistrement de brouillon.
- La localisation est facultative pour le brouillon et nécessite une action explicite de détection ; elle ne doit pas être assimilée à une donnée connue simplement parce que le téléphone la possède.
- Le parcours inspecté ne démontre pas une conversation où Vita pose spontanément des questions en langage humain pour compléter chaque donnée manquante.

**Évaluation :** Flash commence bien par une expression libre, mais sa deuxième étape ressemble encore à un formulaire de revue. La collecte conversationnelle annoncée dans la vision Flash (intention, catégorie, lieu, date, contraintes, durée) n'est pas intégralement démontrée par le parseur V1 observé. Il faut présenter les champs préremplis comme des suggestions modifiables et distinguer explicitement les valeurs déduites des valeurs par défaut.

#### Scan — demande libre suivie de quatre étapes guidées

Fichiers inspectés :
- src/modules/scan/ui/ScanPanel.tsx
- src/modules/scan/ui/ScanNeedInterpretation.tsx
- src/modules/scan/ui/ScanPreferences.tsx
- src/modules/scan/hooks/useScanFlow.ts
- packages/core-logic/src/scan-interpreter.ts

Constats :
- La personne saisit une demande libre de 160 caractères ou utilise la dictée vocale si elle est disponible.
- Le parcours impose actuellement quatre étapes : need, confirmation, criteria, final.
- La confirmation affiche le texte original, une intention reconnue et les éléments détectés par le parseur déterministe.
- Le parseur identifie un ensemble limité d'intentions et extrait certains indices de tâche, objet, lieu, distance, quantité, temps, urgence, exigences et préférences. Il conserve le texte d'origine comme demande principale et ne prétend pas le reformuler parfaitement.
- Une étape dédiée permet d'ajuster le rayon, présenté comme préférence facultative.
- Une dernière étape récapitule la demande et le rayon, puis exige un clic explicite pour lancer Scan.
- Le hook ne lance pas la recherche avant l'étape finale. La localisation est demandée au démarrage de la recherche.
- Le code ne met pas en œuvre de dialogue adaptatif posant une question ciblée selon les données manquantes ; les étapes de confirmation et de critères sont fixes.

**Évaluation :** Scan utilise une entrée en langage naturel, mais son parcours actuel est un assistant de préparation à étapes fixes, pas une conversation fluide. La revue et le récapitulatif peuvent être utiles pour garder la maîtrise de la recherche, mais l'étape de critères facultatifs ne doit pas être ressentie comme obligatoire si la recherche peut déjà être lancée utilement. Le parcours doit aussi respecter les décisions produit : explorer avec les informations disponibles, qualifier honnêtement les résultats et ne demander que le minimum réellement nécessaire.

#### Radar — formulaire métier explicite

Fichiers repérés lors des audits précédents :
- src/modules/radar/ui/RadarDraftForm.tsx
- src/modules/radar/ui/RadarManagement.tsx

Constat :
- Radar expose un formulaire de création/édition de critères, contrairement au parcours d'expression libre de Flash et Scan.
- Ce formulaire n'est pas automatiquement une erreur : certains paramètres d'une veille persistante peuvent nécessiter une sélection explicite et une confirmation durable.
- L'audit de cette étape ne valide pas le détail de chaque champ Radar ni la possibilité d'une entrée libre alternative ; il identifie uniquement une expérience structurée distincte qui doit être confrontée au principe de collecte progressive.

### 11.4 Écart produit / interface à clarifier

| Attendu produit | Réalité observée dans le code V1 | Clarification nécessaire |
|---|---|---|
| La personne parle naturellement | Flash et Scan offrent un champ libre et une dictée conditionnelle | Préciser les capacités réelles du navigateur, la disponibilité de la voix et les limites du parseur |
| Vitalis comprend les données exprimées | Parseurs locaux déterministes, règles et expressions régulières | Ne pas appeler cela compréhension conversationnelle générative ; rendre visibles les limites et la confiance |
| Vitalis demande seulement les informations manquantes | Flash et Scan affichent des étapes de revue fixes ; pas de moteur commun de question adaptative constaté dans ces parcours | Définir les champs minimaux par action et le contrat de question unique |
| Les formulaires ne structurent pas l'expérience | Flash affiche plusieurs sélecteurs après la saisie ; Scan impose quatre étapes ; Radar expose un formulaire dédié | Les contrôles doivent devenir contextuels et facultatifs quand la règle métier le permet, sans supprimer les confirmations de sécurité |
| Les données sont capturées progressivement | Le parseur préremplit quelques propriétés ; le texte source est conservé | Distinguer valeur explicitement dite, valeur détectée, valeur proposée par défaut et valeur confirmée |
| L'action avance sans questionnaire | Scan exige une confirmation et une étape critères avant la recherche ; Flash présente une revue complète avant sauvegarde | Justifier chaque étape par une nécessité métier, une sécurité, une permission ou une confirmation de publication |

### 11.5 Contrat fonctionnel à documenter pour chaque moteur

Pour éviter qu'un futur parcours retombe dans un formulaire classique, chaque moteur doit déclarer :

- **Intention attendue :** ce que la personne peut dire avec ses propres mots.
- **Entrées acceptées :** texte, dictée, conversation ou autres moyens effectivement disponibles dans la version ciblée.
- **Extraction garantie :** champs que le parseur V1 sait réellement identifier, avec exemples de formulations couvertes.
- **Niveau de confiance :** distinction entre expression explicite, détection probable et valeur inconnue.
- **Minimum exécutable :** données, consentements et autorisations sans lesquels l'action ne peut pas être effectuée.
- **Champs facultatifs :** éléments qui améliorent le résultat mais ne bloquent pas la première action.
- **Questions autorisées :** formulation humaine d'une seule clarification à la fois, uniquement pour un manque bloquant.
- **Confirmation nécessaire :** publication, engagement, permission ou action irréversible à confirmer explicitement.
- **Résultat attendu :** action réalisée, brouillon conservé, recherche lancée ou impossibilité expliquée.
- **Reprise :** retour à la demande initiale sans perdre les éléments déjà compris ou confirmés.

Le système ne doit jamais convertir automatiquement une valeur par défaut en fait confirmé. Une catégorie « autre », un créneau « aujourd'hui » ou une portée présélectionnée doit rester une proposition technique tant que la personne ne l'a pas exprimée ou confirmée lorsque cette confirmation est requise.

### 11.6 Règles d'expérience conversationnelle mobile

1. **Une seule zone d'expression principale :** inviter à raconter le besoin ou l'offre en langage naturel, avec un exemple utile et non un inventaire de champs.
2. **Réponse humaine avant contrôle :** afficher ce que Vitalis a compris dans une phrase claire, plutôt qu'une collection initiale de badges techniques.
3. **Question unique :** si un élément est réellement bloquant, demander seulement celui-ci, puis reprendre automatiquement le parcours avec les informations déjà obtenues.
4. **Choix courts si nécessaires :** proposer quelques réponses tactiles quand elles évitent une ambiguïté ; toujours expliquer la question dans le contexte.
5. **Facultatif clairement facultatif :** ne pas rendre une préférence obligatoire par la seule présence d'un contrôle dans l'écran.
6. **Confirmation proportionnée :** confirmer l'action qui engage, pas toutes les données déjà comprises une par une.
7. **Correction naturelle :** permettre de répondre « non, je voulais dire… » ou de corriger un élément sans recommencer toute la saisie.
8. **Voix non obligatoire :** la dictée dépend du support navigateur et des permissions ; le texte reste une voie équivalente et complète.
9. **Accessibilité :** annoncer la question et la réponse comprise une fois, conserver le focus, permettre clavier et lecteur d'écran, respecter les tailles de texte et les cibles tactiles.
10. **Pas de faux dialogue :** tant que la V1 utilise des parseurs déterministes et des étapes fixes, ne pas laisser croire que Vita pose déjà des questions libres adaptatives.

### 11.7 Scénarios d'acceptation à couvrir

| Scénario | Résultat attendu |
|---|---|
| Demande claire avec plusieurs détails | Les éléments explicitement dits sont extraits ; aucune question inutile ; l'action avance si le minimum est présent |
| Demande partielle mais exploitable | Le moteur poursuit avec les données disponibles et explique les limites |
| Préférence facultative absente | Aucune étape bloquante ; proposition d'ajout possible plus tard |
| Information indispensable absente | Une seule question courte, liée au contexte ; aucune perte du texte initial |
| Parseur incertain ou valeur par défaut | Le système n'affiche pas l'inférence comme un fait ; correction facile |
| Correction en langage naturel | Les données déjà confirmées sont conservées et seul l'élément concerné est modifié |
| Dictée indisponible ou permission refusée | Saisie texte immédiatement utilisable, sans blocage ni culpabilisation |
| Permission de localisation nécessaire | Explication juste avant la demande système ; refus sans contournement ni fausse localisation |
| Confirmation de publication/action engageante | Résumé compréhensible et consentement explicite avant l'action |
| Réseau absent pendant la collecte | Texte et données préparées conservés selon les capacités réelles du moteur ; état de synchronisation honnête |
| Français/anglais et écran 320 px | Questions et réponses restent naturelles, lisibles, sans formulaire horizontal ni troncature utile |

### 11.8 Priorités de suite

1. **P0 — Référence canonique :** faire des principes fondamentaux et des décisions produit de chaque moteur la source de vérité pour minimum exécutable, données facultatives, questions et confirmations.
2. **P0 — Écart Flash :** clarifier quelles sélections de revue sont réellement nécessaires à la création d'un brouillon, lesquelles sont facultatives et lesquelles sont des suggestions du parseur.
3. **P0 — Écart Scan :** justifier les étapes fixes de confirmation/critères/final au regard de la règle « rechercher avec les informations disponibles » ; ne pas imposer le rayon facultatif comme condition de lancement.
4. **P1 — Contrat d'extraction :** documenter les expressions réellement couvertes par les parseurs déterministes, leurs limites, les valeurs par défaut et la manière de corriger une interprétation.
5. **P1 — Conversation adaptative :** si une évolution produit est approuvée, définir séparément le mécanisme de question unique et la reprise d'état ; ne pas présenter cette capacité comme déjà livrée en V1.
6. **P1 — Radar :** auditer son formulaire à la lumière de la nature persistante d'une veille et identifier les champs indispensables, les préférences et une éventuelle voie d'expression libre.
7. **P2 — Composant partagé :** ne pas créer un nouveau « formulaire universel ». Envisager seulement un contrat partagé de collecte/intention si plusieurs moteurs ont réellement le même besoin, en gardant les règles métier dans chaque domaine.

### 11.9 Limites de cette étape

Il s'agit d'un audit documentaire et statique des parcours Flash et Scan, d'un repérage du formulaire Radar et d'une comparaison avec les principes produit. Il ne s'agit pas d'une validation du comportement sur appareil réel, d'une mesure de précision des parseurs sur des corpus représentatifs, ni d'une validation d'une conversation IA en production.

**Aucun composant runtime, parseur, formulaire, service ou code applicatif n'a été modifié.** La présente étape clarifie l'écart entre la vision de collecte en langage humain et les parcours V1 actuellement visibles ; toute évolution de l'interface ou de la logique nécessitera une décision séparée.


---

## 12. Clarification produit complémentaire — Radar est aussi un moteur d'expression libre

Cette précision complète et remplace toute ambiguïté de la section 11.3/11.8 : **Radar doit commencer par l'expression libre d'une mission, au même titre que Flash et Scan.** Son formulaire actuel décrit seulement l'interface V1 existante ; il ne définit pas à lui seul le parcours produit attendu.

### 12.1 Faits V1 vérifiés dans le code

- `RadarDraftForm` exige un texte de recherche de 3 à 2 000 caractères.
- La zone est facultative ; le rayon initial est de 5 km ; la durée initiale est de 7 jours.
- `RadarManagement` enregistre et gère des brouillons privés en mode offline-first.
- Le commentaire de `RadarManagement` précise que l'appariement automatique et les alertes ne sont pas disponibles tant que le moteur et le traitement planifié ne sont pas connectés.
- Par conséquent, une sauvegarde Radar actuelle ne doit pas être présentée comme l'activation d'une surveillance réelle.

### 12.2 Décision de parcours produit

Le point de départ attendu est une phrase libre décrivant ce que la personne souhaite surveiller, retrouver ou repérer. Vitalis doit ensuite reformuler la mission à partir des éléments qu'il comprend réellement. Les paramètres comme la zone, le rayon et la durée sont recueillis de façon contextuelle, uniquement lorsqu'ils sont nécessaires à l'étape visée ou utiles comme préférences.

La question d'une information indispensable doit être posée une à la fois. Une préférence facultative ne doit pas bloquer l'enregistrement d'une intention exploitable.

### 12.3 Séparation obligatoire des états

La documentation et les futures interfaces doivent distinguer :
- intention exprimée ;
- brouillon Radar enregistré ;
- mission préparée pour activation ;
- surveillance effectivement active ;
- correspondance réellement trouvée ;
- notification réellement envoyée.

Les états « surveillance active », « correspondance trouvée » et « notification envoyée » ne peuvent être affichés que lorsque les opérations correspondantes existent et ont effectivement eu lieu.

### 12.4 Conséquence sur la priorité documentaire

Le référentiel canonique est désormais [Référentiel produit — collecte en langage humain des moteurs](./conversational-engines-product-reference.md). Il décrit les capacités actuelles et les écarts sans déclarer comme livrée l'expression libre Radar ni l'automatisation de veille.

**Aucun code applicatif, parseur, service ou comportement runtime n'a été modifié par cette clarification.**

## 13. Réconciliation des composants partagés avec la PR #89 — 25 novembre 2026

### Comparaison des implémentations

La PR #89 a déplacé plusieurs primitives vers `src/shared/components` et conservé les anciens chemins comme façades de compatibilité. La branche #90 possédait déjà une partie de cette centralisation, mais son index partagé renvoyait encore trois composants vers leurs anciennes implémentations.

| Composant | État avant réconciliation | Décision appliquée |
|---|---|---|
| `Surface` | Déjà canonique dans `src/shared/components` ; implémentation fonctionnellement équivalente à #89 | Conservé, sans remplacement |
| `FormField` | Déjà canonique ; #90 ajoute `optionalLabel` pour injecter une traduction depuis l'appelant | Amélioration #90 conservée |
| `StatusBanner` | Déjà canonique ; rendu et rôles ARIA équivalents | Conservé |
| `SmartCard` | Implémentation encore située dans `src/components/app` ; index partagé renvoyant vers cet ancien chemin | Implémentation déplacée vers `src/shared/components/SmartCard.tsx` |
| `Modal` | Implémentation encore située dans `src/components/app` | Implémentation déplacée vers `src/shared/components/Modal.tsx` |
| `Sheet` | Implémentation encore située dans `src/components/app` | Implémentation déplacée vers `src/shared/components/Sheet.tsx` |

### Compatibilité et dépendances

- Les chemins historiques `src/components/app/SmartCard.tsx`, `Modal.tsx` et `Sheet.tsx` restent disponibles comme façades de réexport ; les consommateurs existants ne sont donc pas forcés de migrer dans ce lot.
- `src/shared/components/index.ts` exporte désormais les trois implémentations canoniques locales.
- Les imports ont été adaptés aux dépendances réellement présentes sur la branche #90 : animations depuis `@/lib/design`, utilitaires depuis `@/shared/utils`, primitives Radix depuis `@/components/ui`. Le déplacement de #89 vers d'autres chemins internes n'a pas été copié sans vérifier leur existence sur la branche cible.
- `FormField.optionalLabel` est conservé : il permet à l'appelant de fournir le libellé traduit et évite d'introduire du texte applicatif dans un composant partagé.
- Aucune modification de rendu, de navigation ou de règle métier n'a été recherchée dans ce lot.

### Contrat de non-régression ajouté

`tests/shared-components-ownership.test.ts` vérifie :
- les exports canoniques de l'index partagé ;
- le maintien des trois façades de compatibilité ;
- l'absence de dépendance directe des primitives vers les composants d'expérience.

Ces assertions protègent les frontières de fichiers et d'import ; elles ne remplacent pas un test de rendu, d'accessibilité clavier ou de comportement sur appareil.

### Limites restantes

- `FloatingButton`, `SmartTabs`, `AIBubble` et `EmptyState` restent à comparer et, si cela est utile, à centraliser dans un lot distinct.
- L'audit antérieur de `SmartCard` reste valable : le fait de déplacer le composant ne corrige pas à lui seul la sémantique clavier de son mode interactif.
- Les contraintes de hauteur/scroll des Sheet et AlertDialog, les zones sûres et les tests sur petits écrans restent à valider au niveau du rendu.
- Aucun test automatisé n'est déclaré réussi tant que le workflow correspondant n'a pas été exécuté sur le commit courant.
