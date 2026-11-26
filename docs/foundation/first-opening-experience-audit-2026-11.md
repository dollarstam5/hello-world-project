# Audit UX — accueil, première découverte et entrées des moteurs

> Statut : premier lot d'audit comparatif. Les constats décrivent le code présent sur `main` et sur `chore/architecture-folder-cleanup-2026-11`. Les orientations proposées ne sont pas toutes des comportements livrés.

## 1. Principe de validation

L'interface doit aider une personne à comprendre Vitalis avant de choisir une action, avec des mots de tous les jours. Elle présente les possibilités, explique ce qu'elles font réellement, donne des exemples concrets, puis laisse la personne choisir librement. Aucun moteur, formulaire, compte ou parcours ne doit être imposé avant d'être nécessaire à l'action demandée.

L'audit distingue :
- **Existant** : comportement retrouvé dans le code.
- **Évaluation** : adéquation avec une expérience moderne, mobile-first et compréhensible.
- **À faire évoluer** : amélioration recommandée, non présentée comme déjà livrée.

## 2. Comparaison accueil et navigation

### Existant vérifié

- La route `/` rend `HomeFoundation` sur les deux branches. Dans la PR, le composant est déplacé vers `src/composition/experiences/home/HomeFoundation.tsx`; le rendu et la structure de l'accueil restent équivalents dans le diff inspecté.
- L'accueil présente un message de bienvenue, une explication du parcours invité/membre, quatre cartes Flash/Scan/En direct/Radar, des exemples de Flash explicitement démonstratifs et une carte vers Vision.
- Les cartes mènent directement aux routes des moteurs. Aucun écran de sélection obligatoire supplémentaire n'est imposé après la découverte initiale.
- `HomeEngineCard` conserve la même structure visuelle et les mêmes interactions entre `main` et la PR ; les imports ont été déplacés vers les composants canoniques et le retour haptique est conservé.
- La carte Vision ouvre une page détaillée, accessible depuis l'accueil sans être une étape obligatoire.
- La page Vision explique la finalité de Vitalis, les quatre moteurs, leurs usages, leurs limites et propose un accès direct à chacun.

### Évaluation

La progression « accueil synthétique → choix libre → explication détaillée à la demande » est une bonne méthode de découverte progressive. Elle évite de demander à chaque personne de lire une longue documentation avant d'utiliser l'application.

Les quatre cartes sont pertinentes, mais leurs exemples doivent rester exacts par rapport aux capacités disponibles. Le libellé Radar de l'accueil disait « Suivre une recherche de garde… », ce qui pouvait faire croire à un suivi automatique alors que Radar conserve actuellement un brouillon privé.

### Correction appliquée

Dans `src/platform/internationalization/messages.ts` :
- FR : « Préparer un brouillon de recherche de garde pour les prochains week-ends. »
- EN : « Prepare a private childcare-search draft for the coming weekends. »

Le descriptif du moteur continue de préciser qu'il s'agit d'une intention de recherche privée enregistrée, et non d'un service de veille actif.

## 3. Première ouverture / onboarding

### Existant vérifié

- `AppShell` hydrate l'onboarding et monte `OnboardingSheet` à la demande.
- Lorsque le marqueur local de complétion n'existe pas, la feuille de découverte s'affiche automatiquement.
- Le parcours comporte cinq étapes : présentation générale, Flash/Scan, En direct/Radar, espaces complémentaires, puis invitation à commencer.
- « Découvrir plus tard » et la fermeture permettent de passer l'introduction. Aucun moteur n'est lancé automatiquement.
- L'état est mémorisé dans le stockage local du navigateur/appareil ; il n'est pas synchronisé au compte.
- Le contenu de la feuille et son fonctionnement sont essentiellement identiques entre `main` et la PR ; la PR a surtout déplacé les points d'entrée et normalisé les imports.

### Évaluation

Le caractère passable est conforme au principe de liberté. En revanche, l'ouverture automatique d'une feuille de cinq étapes peut interrompre une personne qui souhaite simplement regarder l'accueil. Le texte est clair dans l'ensemble, mais l'introduction et les cartes de l'accueil répètent une partie des mêmes explications.

**Orientation recommandée :** conserver une découverte courte proposée au premier lancement, toujours fermable immédiatement, mais faire de l'accueil lui-même le principal support de compréhension. Les explications détaillées doivent rester consultables à la demande. Ne pas ajouter une seconde séquence obligatoire.

## 4. Entrées des quatre moteurs

### Flash

- L'écran commence par une question simple (« Un besoin à faire connaître ? »), explique que la personne peut dire ce qu'il lui faut ou proposer, et offre une action claire pour commencer.
- L'écriture libre est centrale ; la dictée est proposée comme option.
- Le parcours actuel prépare et enregistre un brouillon local. La publication publique n'est pas activée dans ce parcours.
- **Évaluation :** entrée claire, humaine et orientée vers l'intention. Maintenir la distinction très visible entre brouillon enregistré et publication.

### Scan

- L'écran commence par « Qu'est-ce qui pourrait vous aider aujourd'hui ? » et invite à décrire la recherche avec ses propres mots.
- Le parcours comprend quatre étapes : besoin, confirmation de l'interprétation, critères/rayon, puis lancement.
- La recherche porte sur les Flashs publics disponibles ; ce n'est pas encore une recherche universelle de lieux, services et activités.
- Certains éléments interprétés sont informatifs et ne deviennent pas tous des filtres effectifs.
- **Évaluation :** langage d'entrée naturel et saisie libre présents. Le parcours en quatre étapes est compréhensible mais assez guidé ; il faudra vérifier sur mobile que chaque confirmation apporte une valeur réelle et ne ressemble pas à un formulaire imposé.

### En direct

- L'écran présente le radar de proximité, l'avatar central, les personnes réellement disponibles et des panneaux de réglage/activité.
- La visibilité de sa propre présence est distincte de la simple découverte ; l'utilisateur garde le choix d'activer ou non sa présence.
- Un guide de quatre étapes s'ouvre automatiquement lors de la première visite de cet écran, avec possibilité de le fermer ou de le passer. Son état est mémorisé séparément de l'onboarding général.
- **Évaluation :** l'explication contextuelle peut être utile pour une interface visuelle moins familière. Cependant, une deuxième visite guidée automatique après l'introduction générale risque de créer une impression de tutoriels successifs. À examiner pour la suite : accès permanent au guide depuis l'en-tête, sans réouverture automatique qui surprend.

### Radar

- L'écran explique que l'intention de recherche est conservée comme brouillon privé ; les correspondances et alertes automatiques ne sont pas actives.
- Le formulaire commence par une zone de texte libre, puis propose une zone facultative, un rayon et une durée avec valeurs par défaut modifiables.
- L'enregistrement crée un brouillon privé ; aucun suivi automatique n'est exécuté.
- **Évaluation :** la saisie libre est un bon point de départ. Les critères doivent rester présentés comme des réglages modifiables, pas comme des informations supposées. Éviter les formulations qui promettent de « suivre » ou d'alerter tant que cette capacité n'est pas livrée.

## 5. Vision et rôle dans la découverte

Vision est une explication approfondie et non un passage obligatoire. Sa présence sur l'accueil est pertinente : une personne peut comprendre rapidement les quatre moteurs sur les cartes, puis ouvrir Vision si elle souhaite approfondir. La longueur de la page convient à une consultation volontaire, mais elle ne doit pas remplacer les explications courtes au moment d'agir.

## 6. Principes UX à retenir pour les prochains lots

1. Dire d'abord le besoin humain auquel le moteur répond, avant son vocabulaire technique.
2. Donner un exemple concret et bref, explicitement marqué comme exemple.
3. Dire ce qui va réellement se passer après l'action : brouillon, recherche ponctuelle, présence activée ou résultat disponible.
4. Garder la saisie libre en langage naturel comme point de départ ; ne demander des critères que lorsqu'ils sont nécessaires.
5. Garder les explications consultables sans forcer un parcours complet.
6. Éviter les tutoriels automatiques successifs ; privilégier une aide contextuelle réouvrable.
7. Respecter le mobile-first, les zones tactiles, la lisibilité et les préférences de réduction des animations.

## 7. Tests et limites de validation

- Ajout de `tests/home-engine-copy.test.ts` pour éviter que l'exemple Radar de l'accueil suggère à nouveau un suivi automatique, en français comme en anglais.
- Le test a été ajouté mais n'a pas été exécuté dans cette session.
- Aucun test Vitest, lint, typecheck, build, test mobile ni inspection visuelle sur appareil n'a été exécuté dans cette session.
- Cette revue est une comparaison statique du code et des textes ; elle ne constitue pas une validation visuelle complète.

## 8. Modifications de ce lot

- `src/platform/internationalization/messages.ts` : correction de l'exemple Radar FR/EN.
- `tests/home-engine-copy.test.ts` : test de non-régression FR/EN.
- Aucun changement sur `main`, aucun merge effectué.
- PR #90 toujours ouverte et non fusionnée ; son état de fusion est toujours bloqué (`mergeable: false`) au moment de la vérification.
