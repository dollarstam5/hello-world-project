# Vitala Experience System (VES)

**Statut :** référence produit active  
**Version éditoriale :** consolidée à partir de la Partie 1 historique  
**Périmètre :** philosophie, principes d'interaction et personnalité de l'expérience.

## Objectif

Le Vitala Experience System définit non seulement l'apparence de Vitala, mais aussi la manière dont l'expérience doit être comprise et vécue. Il fournit un vocabulaire partagé au produit, au design, à l'ingénierie et aux agents qui contribuent au projet.

Il exprime des objectifs de conception ; les comportements concrets doivent être validés dans les écrans, composants et tests actuels.

## Vision

Vitala doit aider les personnes à atteindre leur objectif sans les obliger à lutter contre l'interface. La technologie s'efface au profit du besoin réel. L'expérience doit inspirer confiance, simplicité et efficacité.

## Qualités recherchées

- **Confiance :** les informations, les états et les conséquences des actions sont compréhensibles.
- **Simplicité :** chaque écran a une intention claire et évite les choix superflus.
- **Réactivité :** les actions importantes reçoivent un retour perceptible sans délai inutile.
- **Intelligence utile :** les suggestions accompagnent la personne sans imposer ni distraire.
- **Proximité :** le langage reste humain et les interactions respectueuses.

## Principes d'expérience

### Comprendre avant d'agir

La personne doit comprendre où elle se trouve, ce qu'elle peut faire et les conséquences d'une action importante. Les actions destructrices ou engageantes nécessitent un contexte et une confirmation proportionnés au risque.

### Une intention principale par écran

Chaque écran met en évidence son objectif principal. Les actions secondaires restent accessibles sans rivaliser avec l'action dominante.

### Le contenu guide la forme

La hiérarchie visuelle aide à lire, comparer et décider. Les effets ne doivent ni masquer l'information ni diminuer sa lisibilité.

### Le mouvement a un sens

Les animations servent à expliquer une transition, confirmer un changement ou guider l'attention. Elles ne doivent jamais être nécessaires pour comprendre l'information et doivent respecter la réduction des mouvements.

### La confiance se construit

Les états de chargement, succès, erreur, absence de données et mode hors connexion doivent être explicites. Les limites et conséquences importantes ne doivent pas être dissimulées.

### La cohérence est permanente

Des actions équivalentes doivent avoir des comportements équivalents. Les conventions partagées priment sur les solutions locales ad hoc, sauf raison documentée.

### L'accessibilité est native

Le clavier, le focus visible, le contraste, la structure sémantique, les libellés compréhensibles et les zones tactiles doivent être considérés dès la conception. Ce principe ne remplace pas les tests d'accessibilité.

## Personnalité des moteurs

Ces descriptions expriment une intention produit et ne garantissent pas à elles seules une implémentation complète.

| Moteur | Intention d'expérience |
| --- | --- |
| Flash | Rapide, énergique, immédiat : réduire la distance entre intention et action. |
| Scan | Précis et orienté résolution : rendre la progression vers une réponse lisible. |
| Radar | Exploratoire et curieux : favoriser la découverte sans surcharger l'écran. |
| Veille | Calme et prévisionnelle : donner une impression de continuité et d'anticipation. |
| Recommendation | Pertinente et rassurante : présenter des suggestions compréhensibles et utiles. |
| Trust Engine | Stable et transparent : soutenir la confiance sans jugement ni opacité. |

## Ce que Vitala refuse

- Les interfaces surchargées ou sans hiérarchie.
- Les animations décoratives qui ralentissent ou distraient.
- Les notifications excessives.
- Les décisions dont les conséquences restent incompréhensibles.
- Les effets visuels qui diminuent la lisibilité ou la performance.
- Les parcours complexes sans justification par le besoin.

## Application et validation

Pour chaque nouveau parcours ou changement important :

1. Définir le besoin utilisateur et l'intention principale.
2. Décrire les états normaux, d'attente, d'erreur, vides, hors connexion et de reprise pertinents.
3. Appliquer le [langage de design](../00-foundation/design-language.md) et les tokens existants.
4. Vérifier l'accessibilité, les textes localisés et les tailles d'écran ciblées.
5. Valider le parcours par revue et tests appropriés avant de le considérer conforme.

## Relation avec les autres références

- Les règles visuelles concrètes sont dans [Langage de design](../00-foundation/design-language.md).
- Les budgets, tests de chargement et limites PWA sont dans [Performance PWA](../06-operations/performance-pwa.md).
- Ce document remplace la lecture active de la Partie 1 numérotée historique, mais ne donne pas autorisation de supprimer cette source historique.
