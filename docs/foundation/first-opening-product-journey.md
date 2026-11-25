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
- Il faut décider où retrouver durablement les explications : paramètres, aide contextuelle, entrée « Découvrir Vitalis » ou combinaison de ces points. Aucun de ces accès ne doit être présenté comme existant avant implémentation.

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

## 9. Décisions encore ouvertes

1. L'introduction modernisée doit-elle rester obligatoire à la première ouverture, ou devenir une découverte facultative avec un repère très visible ?
2. Quelle est la règle de persistance souhaitée : par appareil, par compte, ou combinaison avec un état de version de l'introduction ?
3. Où et comment la personne pourra-t-elle rouvrir l'aide et les explications ?
4. L'introduction doit-elle se terminer par un choix explicite de premier moteur, ou laisser l'accueil comme point de départ ?
5. Quel contenu doit être commun à tous les moteurs et quel contenu doit être expliqué dans chaque moteur au moment de la première action ?

Ces décisions seront validées avant la conception d'interface. Le présent audit ne les tranche pas.

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
