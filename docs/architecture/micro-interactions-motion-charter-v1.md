# Charte des micro-interactions et du mouvement — V1

**Statut :** principes produit validés pour intégration documentaire ; valeurs indicatives à ajuster lors des tests sur appareils réels.  
**Branche de travail :** `docs/language-audit-v1`.  
**Périmètre :** interactions communes et cinq espaces principaux de Vitalis.

## 1. Intention

Les animations de Vitalis doivent rendre l'application plus claire et agréable, jamais ralentir une action ni détourner l'attention. Chaque mouvement doit aider la personne à comprendre ce qui vient de se passer, ce qu'elle peut faire ensuite ou comment un écran évolue.

## 2. Principes obligatoires

1. **Naturelles :** le mouvement accompagne le geste et respecte les attentes habituelles d'une application mobile.
2. **Rapides :** le retour visuel commence immédiatement ; aucune action ne doit attendre la fin d'une animation pour être prise en compte.
3. **Discrètes :** pas d'effets spectaculaires, de rebonds excessifs ou de mouvement décoratif permanent.
4. **Utiles :** une animation doit confirmer un geste, signaler un changement réel, guider le regard ou rendre une transition compréhensible.
5. **Accessibles :** respecter `prefers-reduced-motion`, préserver la lisibilité et ne jamais faire dépendre la compréhension d'un mouvement seul.
6. **Fiables :** une animation ne doit jamais annoncer une réussite avant la confirmation réelle de l'action.

## 3. Repères de durée

Ces plages sont des repères de conception, pas des délais à appliquer mécaniquement. La sensation sur téléphone réel prime sur la valeur théorique.

| Interaction                           |                         Durée indicative |
| ------------------------------------- | ---------------------------------------: |
| Retour immédiat au toucher            |                                80–120 ms |
| Survol, sélection ou mise en évidence |                               120–180 ms |
| Changement d'état d'un contrôle       |                               150–220 ms |
| Apparition légère d'une carte         |                               200–280 ms |
| Panneau ou feuille inférieure         |                               220–300 ms |
| Transition entre écrans               |                               180–250 ms |
| Mouvement décoratif exceptionnel      | lent, limité et interrompu hors contexte |

Éviter d'enchaîner plusieurs délais qui donnent l'impression que l'interface attend. Les animations longues ne doivent pas retarder la navigation, la validation ou l'accès au contenu.

## 4. Rôle de chaque technologie

Les dépendances nécessaires sont déjà présentes dans le projet ; cette charte ne demande aucune nouvelle bibliothèque.

- **Tailwind CSS :** structure, mise en page, couleurs, états visuels, espacements et styles des composants.
- **Framer Motion :** transitions entre éléments, apparition/disparition, panneaux et interactions nécessitant une orchestration.
- **CSS :** mouvements simples et légers, notamment certains effets décoratifs ou états visuels réutilisables.
- **React et les domaines métier :** déclenchent les changements à partir d'états et d'événements réels ; ils restent la source de vérité.

Une même interaction ne doit pas être animée simultanément par Tailwind, CSS et Framer Motion sans raison claire. Choisir un seul mécanisme principal par effet afin d'éviter les conflits et les comportements difficiles à maintenir.

## 5. Comportement attendu par espace

### Flash

- Faire apparaître les cartes sans déplacement excessif.
- Donner un retour immédiat au toucher et à la sélection.
- Confirmer une publication uniquement après son enregistrement réel.
- Garder le marqueur « Exemple » visible sur les contenus de démonstration ; son animation ne doit pas le rendre temporairement illisible.

### Scan

- Garder le cadre et les indications de lecture sobres et stables.
- Animer une recherche uniquement pendant une opération réellement en cours.
- Distinguer clairement résultat, absence de résultat et erreur.
- Ne jamais faire croire qu'une identification est réussie avant réception et validation du résultat.

### Réel

- Réserver les halos ou pulsations à l'indication d'une présence réellement active.
- N'animer un bip reçu qu'après réception d'un signal réel.
- N'afficher l'animation de mise en relation qu'après acceptation confirmée.
- Ne jamais utiliser un effet animé pour simuler une personne, un bip, une relation ou une activité.

### Radar

- Montrer un balayage uniquement pendant une recherche réellement active.
- Arrêter le mouvement dès que la recherche se termine, échoue ou est mise en pause.
- Ne pas animer de faux résultats, de correspondances ou de disponibilité.

### Espaces communs et menu 2×2

- Garder des transitions cohérentes entre menus, dialogues, panneaux et pages.
- Fournir un retour immédiat à chaque action, même si le contenu détaillé arrive ensuite.
- Ne pas ajouter d'animation à un compteur ou badge lorsqu'aucun événement réel ne le justifie.

## 6. Performance et accessibilité

- Privilégier `transform` et `opacity` lorsque cela suffit ; éviter d'animer en continu les propriétés qui provoquent des recalculs de mise en page.
- Limiter le nombre d'éléments animés simultanément et les grandes surfaces lumineuses ou floues.
- Éviter les boucles permanentes, surtout sur les écrans qui restent ouverts.
- Respecter `prefers-reduced-motion` dans Framer Motion comme dans les animations CSS. En mode réduction, supprimer les mouvements non essentiels ou les remplacer par un changement d'état immédiat et lisible.
- Ne pas supprimer les retours d'état utiles : succès, erreur, sélection et progression doivent rester perceptibles sans mouvement.
- Vérifier le rendu sur appareils Android et iOS réels, y compris appareils modestes, et en conditions de batterie/performance variables.
- Ne jamais bloquer une action métier derrière une animation.

## 7. Règles de vérité produit

- Une animation de chargement signifie qu'un chargement réel est en cours.
- Une animation de balayage signifie qu'une recherche réelle est active.
- Une animation de succès intervient après confirmation de l'action par le domaine ou le service concerné.
- Une animation d'erreur correspond à une erreur réellement détectée.
- Les contenus d'exemple ne déclenchent jamais d'animation laissant croire à une activité réelle.
- Si une action échoue, l'interface arrête l'animation de progression et explique simplement ce qui s'est passé.

## 8. Organisation et cohérence du code

Le projet possède déjà un socle partagé de mouvement dans `src/lib/design/motion.ts`, un hook de réduction du mouvement dans `src/lib/design/useReducedMotion.ts` et des exports partagés dans `src/shared/animations/`.

Conserver ces points d'entrée comme références communes. Avant d'ajouter un nouveau variant ou une nouvelle animation :

1. vérifier si un variant partagé répond déjà au besoin ;
2. réutiliser les conventions existantes lorsque c'est pertinent ;
3. éviter de dupliquer les mêmes transitions dans chaque moteur ;
4. garder les comportements métier dans le domaine, pas dans les composants purement visuels ;
5. documenter toute exception propre à un moteur.

Ne pas créer de nouvelle arborescence d'animations ou de nouvelle dépendance sans besoin démontré.

## 9. Vérifications avant validation d'une interface

- Le mouvement apporte-t-il une information ou un retour utile ?
- Le retour commence-t-il immédiatement ?
- L'action reste-t-elle utilisable si l'animation est désactivée ?
- Le mode réduction du mouvement est-il respecté ?
- L'animation correspond-elle à un état réel et confirmé ?
- Le comportement reste-t-il fluide sur un téléphone Android modeste ?
- L'animation évite-t-elle de gêner la lecture, la caméra, la géolocalisation ou une action principale ?
- Les états succès, erreur, chargement et inactivité sont-ils visuellement distincts sans dépendre uniquement de la couleur ?

## 10. Points d'audit technique

Le socle actuel comporte déjà des animations Framer Motion et CSS. L'audit a notamment repéré un point à vérifier dans `FloatingButton` : le retour `whileTap` doit lui aussi respecter la préférence de réduction du mouvement, et pas seulement l'animation décorative de respiration.

Ce point est consigné comme vérification technique à effectuer dans le code. La présente charte ne prétend pas que toutes les interfaces sont déjà conformes et n'autorise pas à considérer cet audit comme terminé.

---

**Règle de décision :** si une animation embellit l'écran mais n'aide pas la personne, la supprimer. Si elle ralentit, gêne l'accessibilité ou suggère une action qui n'a pas réellement eu lieu, la corriger avant d'ajouter d'autres effets.
