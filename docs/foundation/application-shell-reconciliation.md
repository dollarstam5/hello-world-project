# Réconciliation du shell applicatif avec la PR #89

Date : 25 novembre 2026  
Branche : `chore/architecture-folder-cleanup-2026-11`

## Objectif

Comparer les évolutions de la PR #89 sur le shell, la navigation, l'en-tête, l'accueil et l'introduction, puis ne reprendre que les changements compatibles avec l'architecture et les décisions produit déjà validées sur la branche #90.

Aucun redesign de l'accueil ou de la première ouverture n'est entrepris dans cette étape.

## Résultats de comparaison

### Shell applicatif

- La PR #89 conserve un montage direct de `ReelCommunicationBridge` dans le shell.
- La branche #90 utilise déjà un import dynamique avec `lazy()` et `Suspense`. Cette optimisation est conservée : le pont temps réel ne doit pas alourdir le bundle initial.
- Le shell garde les routes Auth/Admin sans chrome applicatif, la gestion des bannières, le fournisseur de communication, le reset de projection lors d'un changement d'identité, le menu, la communication et l'introduction.
- Le shell distingue les routes En direct et Flash qui possèdent leur propre en-tête. Les règles de navigation basse sont conservées.

### En-tête global

- La structure, le badge de notifications, l'accès au profil, les cibles tactiles de 48 px et les zones sûres sont équivalents.
- La PR #89 ne justifie pas de remplacer le rendu visuel de l'en-tête.
- Différence utile reprise : le composant différé `ProfileQuickPreview` n'est désormais monté que lorsque `profileOpen` est vrai. Sur #90, il était rendu même fermé, ce qui pouvait charger son module dès le montage de l'en-tête.
- Les imports de #90 restent alignés sur les modules réorganisés de cette branche.

### Navigation principale

- Les cinq destinations sont conservées : Flash, Scan, En direct, Radar et Menu.
- En direct reste au centre de la barre.
- Les états actifs, les libellés accessibles, les actions tactiles et les retours haptiques sont conservés.
- Le code de navigation de #89 et #90 est fonctionnellement équivalent après prise en compte des chemins déplacés. Aucun remplacement global n'est utile.

### Menu

- Le menu garde les entrées Espace et Talents, leurs descriptions, les liens et le panneau inférieur adapté au mobile.
- Aucun changement de #89 ne justifie de remplacer le panneau actuel.

### Accueil et cartes des moteurs

- La page d'accueil de #90 est déjà déplacée dans `src/composition/experiences/home` et conserve son contenu, ses exemples de démonstration explicitement identifiés, les états invité/membre et les quatre entrées moteurs.
- La séparation `HomeEngineCard` est déjà présente sur #90. Elle est conservée, sans recopier la version de #89 qui contenait une définition interne redondante de carte.
- Les quatre destinations Flash, Scan, En direct et Radar restent visibles et indépendantes.
- Les textes et exemples éditoriaux validés dans le référentiel Vitalis ne sont pas remplacés par les textes plus anciens de #89.

### Première ouverture

- Les cinq étapes, le passage précédent/suivant, le changement de langue, la fermeture et le saut restent présents.
- La dernière étape laisse la personne revenir à l'accueil : aucun moteur n'est lancé automatiquement.
- Le contenu n'a pas été réécrit dans ce chantier de réconciliation. Les textes du produit doivent suivre le document éditorial validé, pas être remplacés par une copie mécanique de #89.

## Décisions produit validées à préserver

Cette réconciliation ne transforme pas en fonctionnalités existantes les décisions produit validées précédemment :

1. La découverte initiale doit être proposée automatiquement, rester facultative et pouvoir être ignorée.
2. La persistance invitée reste locale dans l'état actuel ; la synchronisation du parcours pour les comptes connectés est une évolution future.
3. Un accès permanent « Découvrir/Comprendre Vitalis » doit être prévu dans le menu ou les paramètres ; cet accès n'est pas encore livré dans le shell actuel.
4. La fin de l'introduction ne doit pas imposer un moteur ; la personne choisit librement entre Flash, Scan, En direct et Radar.

Les points 2 et 3 ne sont donc pas présentés comme déjà implémentés. Leur mise en œuvre fera l'objet d'une étape produit/UX dédiée et d'une validation avant changement d'interface.

## Contrat de non-régression ajouté

`tests/application-shell-reconciliation.test.ts` protège :
- le chargement différé du pont de communication En direct ;
- le chargement différé de l'aperçu du profil jusqu'à son ouverture ;
- les cinq destinations de navigation et la position centrale d'En direct ;
- les quatre entrées moteurs de l'accueil ;
- le parcours en cinq étapes, son option de sortie et l'absence de redirection automatique vers un moteur.

Ces assertions sont des tests de contrat source. Elles ne prouvent pas le rendu réel, la navigation au clavier, les zones sûres ou la compatibilité Android/iOS.

## Validation restante

- Exécuter le workflow CI sur le commit courant.
- Vérifier l'en-tête, la navigation et le menu sur des écrans de 320, 360 et 390 px, avec zones sûres et clavier virtuel.
- Vérifier le panneau de profil et l'introduction sur Android et iOS.
- Valider visuellement les textes réels en français et en anglais avant toute modernisation de l'accueil.

Aucun changement de comportement métier, de destination de navigation ou de contenu éditorial n'est inclus dans cette étape, hormis le montage différé de l'aperçu du profil.
