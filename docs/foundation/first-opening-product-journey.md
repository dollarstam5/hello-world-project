# Référentiel produit — première ouverture et découverte de Vitalis

> Statut : audit documentaire de l'existant et cadrage produit. Ce document ne décrit pas une interface future comme si elle était déjà livrée. Les constats ci-dessous proviennent du code et des tests présents sur la branche auditée.

## 1. Objectif et règle de lecture

Décrire ce que voit réellement une personne qui découvre Vitalis, ce qui est déjà pris en charge par l'application et ce qui doit être clarifié avant de concevoir la première interface modernisée.

Chaque point est classé comme suit :

- **Existant vérifié** : comportement ou contenu retrouvé dans le code ou les tests.
- **À clarifier / corriger dans la documentation** : formulation existante incomplète, ambiguë ou non alignée avec le référentiel produit des moteurs.
- **À compléter** : information ou capacité utile à la compréhension qui n'est pas démontrée dans l'implémentation auditée.
- **À décider** : choix produit ou UX qui ne doit pas être présenté comme acquis.

Aucune fonctionnalité absente n'est supposée exister. Aucune modification du code applicatif n'est incluse dans cet audit.

## 2. Déclenchement et persistance

### Existant vérifié

- L'introduction est montée depuis `AppShell` et chargée à la demande avec `React.lazy`.
- Le démarrage de l'expérience initialise le thème, la langue puis hydrate l'état d'onboarding.
- Après hydratation, la feuille d'introduction s'affiche lorsque le marqueur de complétion n'est pas présent.
- L'introduction comporte cinq étapes numérotées de 1 à 5, une progression, Suivant, Retour, Découvrir plus tard et C'est parti.
- La fermeture par le mécanisme de la feuille déclenche également le passage de l'introduction.
- La complétion et le passage écrivent `vitalis.onboarding.v2=1` dans `localStorage`.
- La persistance est locale au navigateur/appareil et au contexte de stockage ; le code audité ne la synchronise pas au compte utilisateur.
- Si la lecture du stockage échoue, l'introduction est affichée. Si l'écriture échoue, la session reste utilisable mais l'introduction pourra réapparaître à la prochaine ouverture.
- Une route de test visuel en développement (`?__vitalis_smoke=1`) marque l'introduction comme terminée.
- Le shell des routes `/auth` et `/admin` retourne une présentation sans l'introduction. L'introduction est donc attachée au shell principal, pas à toutes les pages de l'application.

### À clarifier

- « Affichée une fois » signifie actuellement une fois par stockage local de navigateur/appareil, pas une fois par compte.
- Le passage et la complétion ont le même effet de persistance ; « Découvrir plus tard » ne signifie pas que l'introduction sera reproposée automatiquement.
- Le parcours n'est pas conditionné à l'état membre/invité pour son déclenchement ; le dernier écran adapte toutefois son texte à l'état d'authentification.

## 3. Contenu réel de l'introduction actuelle

| Étape | Contenu implémenté | Observation |
|---|---|---|
| 1 | Présentation générale de Vitalis et invitation à choisir un premier pas | Présentation de valeur, sans démonstration d'expression libre |
| 2 | Flash et Scan | Explique les usages de partage et de recherche de Flashs publics |
| 3 | En direct et Radar | Explique la découverte de personnes et l'enregistrement d'une recherche privée |
| 4 | Menu 2×2 et espaces complémentaires | Repère de navigation |
| 5 | Invitation à commencer ; texte membre ou invité | Aucun moteur n'est lancé automatiquement |

Les textes sont disponibles en français et en anglais. Le contrôle de langue est présent dans l'introduction.

### À clarifier / corriger

- Le texte actuel de Radar présente principalement une « recherche privée » et indique que les correspondances automatiques ne sont pas disponibles. Il ne présente pas encore Radar comme un moteur d'expression libre permettant de formuler naturellement une mission. Le référentiel [des moteurs conversationnels](./conversational-engines-product-reference.md) prévaut : le contenu de découverte devra être aligné avec lui.
- Flash et Scan sont décrits par leur fonction, mais l'introduction ne montre pas concrètement que la personne peut commencer par ses propres mots.
- Aucun exemple de formulation libre, aucun exemple vocal et aucune explication des limites actuelles de l'interprétation ne sont montrés dans les cinq étapes.
- Les descriptions de l'introduction ne détaillent pas toujours les différences entre brouillon, publication, recherche lancée et résultat réellement disponible. Les textes finaux devront respecter les états vérifiés dans le référentiel des moteurs.

## 4. Écran d'accueil après l'introduction

### Existant vérifié

L'accueil (`HomeFoundation`) constitue déjà un second niveau de découverte :

- un message d'accueil et une présentation de Vitalis ;
- un bloc de parcours qui varie selon que la personne est invitée ou connectée ;
- quatre cartes d'accès direct : Flash, Scan, En direct et Radar ;
- une courte description et un exemple pour chaque moteur ;
- des exemples de Flashs explicitement présentés comme démonstrations, pas comme activité réelle ;
- une carte de vision de Vitalis ;
- une indication vers le menu 2×2.

Les quatre cartes donnent accès directement aux routes des moteurs. L'accueil n'impose pas de terminer une visite guidée supplémentaire avant de naviguer.

### À clarifier / corriger

- L'exemple Radar de l'accueil parle de suivre une recherche de garde. Il doit être relu avec la définition de Radar comme moteur d'expression libre d'une mission, sans suggérer un suivi automatique qui n'est pas livré.
- Les exemples d'accueil sont des illustrations ; ils ne doivent pas être confondus avec des missions, des publications ou des résultats réels.

## 5. Langue et préférences

### Existant vérifié

- Vitalis prend en charge le français et l'anglais dans le catalogue de messages audité.
- Au démarrage, l'application utilise la préférence enregistrée si elle est valide ; sinon elle détecte la langue du navigateur/système et applique la langue par défaut en dernier recours.
- Le choix explicite est enregistré sous `eco.locale`.
- Le choix de langue est modifiable dans l'introduction et dans les paramètres de l'application.
- Les paramètres actuels permettent aussi de régler le thème et l'activation de l'assistant.

### À compléter / décider

- Les paramètres de l'application ne proposent pas actuellement de rubrique permettant de relancer ou consulter l'introduction complète.
- **Décision validée — accès durable aux explications :** prévoir une entrée permanente « Découvrir Vitalis » (ou « Comprendre Vitalis ») permettant de retrouver les explications après la première ouverture. Son emplacement précis — menu ou paramètres — reste à arbitrer lors de la conception. Cet accès n'existe pas encore dans l'implémentation auditée.

## 6. Accès aux moteurs et navigation

### Existant vérifié

- La navigation principale expose Flash, Scan, En direct et Radar.
- Le menu inférieur ouvre une feuille donnant accès à Espace et Talents.
- Espace présente des liens vers profil, informations, paramètres, aperçu et les quatre moteurs.
- Les écrans d'introduction et d'accueil donnent donc plusieurs chemins d'accès aux moteurs et espaces.

### À clarifier

- L'introduction dit que le menu 2×2 ouvre les espaces complémentaires. L'accueil et les composants de navigation doivent rester cohérents dans leur vocabulaire et leurs repères.
- Le parcours d'accueil ne montre pas encore, dans l'introduction, comment revenir à une explication précise d'un moteur après l'avoir découvert.

## 7. Expression libre et première action

### Existant vérifié

- Les moteurs Flash, Scan et Radar disposent déjà de capacités de saisie textuelle et/ou d'interprétation décrites dans le référentiel produit des moteurs.
- La dictée vocale dépend de la disponibilité de l'API de reconnaissance vocale du navigateur ; elle ne peut pas être promise comme disponible sur tous les appareils.
- Le parcours d'introduction actuel ne contient pas de champ de saisie et ne demande pas à la personne de remplir un formulaire.
- L'accueil permet de choisir un moteur, mais l'introduction n'accompagne pas encore la première expression dans ce moteur.

### À compléter

- Une explication courte et concrète doit indiquer que la personne peut commencer par écrire naturellement ce qu'elle cherche, propose ou souhaite transmettre, selon le moteur.
- La voix doit être présentée comme une possibilité conditionnelle, jamais comme une capacité garantie.
- La personne doit comprendre que l'application peut interpréter une partie de son expression, demander une précision lorsqu'elle est indispensable et laisser les informations inconnues comme inconnues. Les valeurs techniques par défaut ne doivent pas être présentées comme des faits qu'elle aurait fournis.
- Le premier usage doit rester une vraie action dans le moteur choisi, et non une simulation qui laisserait croire qu'une mission a été publiée, qu'une recherche a été lancée ou qu'une correspondance existe.

## 8. Parcours cible à documenter avant la conception

Ce parcours est une orientation de travail, pas une fonctionnalité actuellement livrée :

1. **Comprendre en quelques secondes** : dire clairement ce qu'est Vitalis et ce qu'il permet de faire.
2. **Choisir son intention** : présenter les moteurs par le besoin humain auquel ils répondent, sans jargon.
3. **Voir l'expression libre** : donner un exemple de formulation naturelle et expliquer que les précisions facultatives peuvent venir ensuite.
4. **Choisir son premier pas** : accéder au moteur concerné sans compte ou permission prématurés ; ne demander une authentification, une permission ou une précision qu'au moment où l'action réelle l'exige.
5. **Comprendre le résultat** : distinguer clairement brouillon, action confirmée, recherche effectuée, présence activée, résultat et fonctionnalité non disponible.
6. **Retrouver les repères** : permettre de revoir les explications sans devoir réinitialiser le stockage ou effacer les données du navigateur.

### Principes UX à respecter

- Mobile-first : Android/iOS téléphone P0, tablette P1, bureau P2.
- Introduction courte, lisible et fractionnable ; ne pas transformer la découverte en long tutoriel obligatoire.
- Ne pas remplacer l'expression naturelle par un formulaire classique.
- Ne pas demander à l'avance les permissions qui ne sont pas nécessaires à l'action choisie.
- Laisser la personne passer l'introduction et commencer à utiliser Vitalis.
- Présenter clairement l'état réel des capacités ; ne jamais promettre un matching Radar automatique tant qu'il n'est pas implémenté.
- Prévoir des explications consultables à nouveau, sans supposer leur emplacement avant décision produit.

## 9. Décisions produit validées

Les quatre décisions ci-dessous ont été validées. Elles définissent la direction du parcours cible ; elles ne signifient pas que les évolutions décrites sont déjà présentes dans l'application.

### 9.1 Découverte proposée automatiquement, jamais imposée

**Décision :** à la première ouverture, Vitalis propose automatiquement une courte découverte. La personne peut la passer ou la fermer et accéder à l'application sans devoir terminer le parcours.

**Existant vérifié :** l'introduction actuelle apparaît lorsque le marqueur local de complétion est absent ; les commandes « Découvrir plus tard » et de fermeture permettent déjà de la passer. Le passage et la complétion écrivent le même marqueur local.

**À faire évoluer :** conserver cette liberté dans l'interface modernisée, clarifier le caractère facultatif et éviter tout blocage d'accès. La formulation et le comportement de fermeture devront être vérifiés sur téléphone.

### 9.2 Persistance adaptée à l'état invité ou membre

**Décision :**
- Pour une personne invitée, l'état de découverte reste mémorisé localement sur l'appareil.
- Pour une personne connectée, la cible produit est d'associer cet état au compte afin de le retrouver sur ses autres appareils.
- Lorsqu'une évolution importante de Vitalis justifie une nouvelle explication, proposer uniquement la découverte des nouveautés pertinentes plutôt que rejouer systématiquement tout le parcours initial.

**Existant vérifié :** le code audité utilise `localStorage` (`vitalis.onboarding.v2=1`) sans synchronisation au compte. L'état local peut donc être conservé sur le même navigateur/appareil, sous réserve de la disponibilité du stockage.

**Évolution à développer :** synchronisation de l'état pour les membres, gestion des versions de découverte et présentation ciblée des nouveautés. Aucune synchronisation ni redécouverte versionnée n'est actuellement démontrée. La stratégie de résolution des états entre appareils reste à préciser techniquement.

### 9.3 Accès permanent aux explications

**Décision :** rendre les explications de Vitalis consultables à tout moment via une entrée durable intitulée « Découvrir Vitalis » ou « Comprendre Vitalis ».

**Existant vérifié :** les paramètres actuels permettent notamment de modifier la langue et le thème, mais ne proposent pas de relancer ou consulter l'introduction.

**Évolution à développer :** créer cet accès permanent et permettre de revoir les explications sans effacer les données du navigateur ni réinitialiser l'onboarding. L'emplacement exact (menu ou paramètres) sera fixé pendant la conception de l'interface.

### 9.4 Aucun moteur imposé à la fin de la découverte

**Décision :** la découverte ne force pas le lancement d'un moteur particulier. Elle présente les quatre intentions et laisse la personne choisir celle qui correspond à son besoin.

- **Flash :** transmettre un besoin ou une proposition.
- **Scan :** rechercher des Flashs publics dans une zone choisie.
- **En direct :** découvrir des personnes à proximité et choisir séparément si l'on souhaite rendre sa présence visible.
- **Radar :** exprimer librement une mission ou une recherche que l'on souhaite conserver.

**Existant vérifié :** l'accueil présente déjà quatre accès aux moteurs ; l'introduction actuelle ne lance aucun moteur automatiquement.

**À faire évoluer :** aligner les textes de découverte et les exemples avec ces définitions, notamment Radar comme moteur d'expression libre. La personne doit pouvoir choisir son premier pas sans que l'introduction transforme ce choix en formulaire de critères.

### 9.5 Points restant à préciser

Les quatre orientations produit précédentes sont validées. Les points suivants restent ouverts pour la conception et la réalisation :

1. Emplacement précis de l'entrée permanente « Découvrir Vitalis ».
2. Règles techniques de synchronisation et de résolution des états de découverte entre appareils pour les membres.
3. Critères permettant de qualifier une évolution comme suffisamment importante pour proposer une découverte des nouveautés.
4. Répartition du contenu commun à tous les moteurs et des explications contextuelles propres à chaque moteur.

Ces précisions ne remettent pas en cause les quatre décisions validées.

## 10. Fichiers et tests inspectés

- `src/components/experience/OnboardingSheet.tsx`
- `src/lib/experience/onboarding.ts`
- `src/lib/experience/orchestrator.ts`
- `src/app/shell/AppShell.tsx`
- `src/composition/experiences/home/HomeFoundation.tsx`
- `src/platform/internationalization/messages.ts`
- `src/platform/internationalization/useI18n.ts`
- `src/app/settings/ApplicationSettingsPage.tsx`
- `src/app/navigation/BottomNav.tsx`
- `src/app/navigation/MenuSheet.tsx`
- `tests/onboarding.test.ts`

Audit statique du code et lecture des tests ; aucun test sur appareil réel n'a été exécuté dans le cadre de ce document.

## 11. Périmètre des modifications

Documentation uniquement. Aucun composant, route, store, texte d'interface ou comportement applicatif n'a été modifié.
