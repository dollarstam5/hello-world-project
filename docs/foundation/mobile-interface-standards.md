# Standards d’interface mobile Vitalis — V1

**Statut :** référentiel normatif V1 à appliquer et à vérifier  
**Priorité :** Android et iOS sur téléphone (P0), tablette (P1), desktop (P2)  
**Portée :** PWA mobile installée et expérience mobile dans le navigateur  
**Sources d’implémentation :** \`src/styles.css\`, \`src/lib/design/tokens.ts\`, composants partagés et fondations de plateforme.

Ce document définit le standard d’interface attendu pour Vitalis V1. Il complète le document [Standards UX et accessibilité Phase 2](./phase-2-ux-standards.md) et le [Langage de design Vitalis](./design-language.md). Il ne certifie pas automatiquement les écrans existants : chaque règle doit être appliquée puis vérifiée sur les parcours réels.

Les dimensions indiquées sont des objectifs de conception Vitalis exprimés en pixels CSS, sauf mention contraire. Elles ne doivent pas être présentées comme des exigences identiques des systèmes natifs Android et iOS. Les composants doivent réutiliser les tokens existants ; toute divergence entre ce référentiel et les valeurs réellement implémentées doit être traitée explicitement, pas masquée.

## 1. Le modèle d’expérience Vitalis

Vitalis V1 est une **PWA conçue avec les réflexes d’une application mobile** :

- L’interface est pensée d’abord pour le toucher, le pouce, les petits écrans et les usages en mobilité.
- Les parcours sont courts, les actions sont explicites et les retours sont immédiats.
- La navigation, les feuilles, les dialogues et les commandes privilégient des comportements familiers sur téléphone.
- Les capacités natives ne sont utilisées que lorsqu’elles sont réellement disponibles et autorisées.
- L’interface ne doit jamais faire croire qu’une capacité native, une opération serveur ou une synchronisation a eu lieu si ce n’est pas le cas.

### 1.1 Différences à respecter

| Sujet | Application native | Web dans le navigateur | PWA Vitalis V1 |
|---|---|---|---|
| Installation | Installée via store ou mécanisme système | Pas d’installation nécessaire | Installation proposée si le navigateur le permet ; parcours web toujours disponible |
| Cadre système | Contrôles et navigation propres à Android/iOS | Barre et commandes du navigateur visibles | Mode installé possible, mais dépend du navigateur et de l’OS |
| Zones sûres | Insets fournis par le système | Viewport et barres du navigateur variables | Respect des safe areas et des variations de viewport |
| Navigation retour | Retour système et gestes natifs | Historique navigateur | Historique navigateur et retour système quand disponibles ; commandes visibles indispensables |
| Notifications | APIs natives et permissions système | Notifications Web selon navigateur et permission | Notifications Web uniquement si prises en charge, autorisées et configurées |
| Caméra, position, fichiers | APIs natives dédiées | APIs Web autorisées par navigateur | APIs Web et capacités réelles ; prévoir refus et indisponibilité |
| Stockage et hors ligne | Services natifs | Cache et stockage navigateur selon politiques | Service Worker et stockage Web, soumis aux quotas et politiques du navigateur |
| Haptique | Retour haptique natif | Généralement non garanti | Ne jamais le promettre ; utiliser un retour visuel et textuel équivalent |
| Tâches en arrière-plan | Capacités système plus larges | Très limitées | Limitées par le navigateur et l’OS ; aucune tâche critique ne doit dépendre d’une exécution garantie en arrière-plan |

Une PWA ne doit pas imiter artificiellement une application native au point de cacher les commandes du navigateur, les limites de permissions ou les échecs de capacités. Toute fonctionnalité doit avoir un état de repli utilisable.

## 2. Grille mobile et composition des écrans

- Concevoir en premier pour une largeur de **320 à 390 px**, puis vérifier les largeurs supérieures. 320 px est un scénario de robustesse, pas une largeur minimale garantissant tous les contenus.
- Utiliser une colonne par défaut. Une grille de deux colonnes n’est autorisée que si chaque carte conserve une largeur lisible et des actions confortables.
- Garder une largeur de lecture maîtrisée ; ne pas étirer les paragraphes sur tablette ou desktop.
- Utiliser des marges latérales cohérentes, définies par les tokens d’espacement. Éviter les marges fixes qui provoquent un débordement.
- Ne jamais réduire la typographie, les icônes ou les cibles tactiles simplement pour faire tenir une composition.
- Prévoir les textes longs, les traductions anglaises, le zoom, l’agrandissement du texte et les petits écrans.
- Les éléments fixes (navigation, barre d’action, bannière) ne doivent pas masquer le contenu ni les champs actifs.
- Les zones sûres hautes et basses doivent être respectées, notamment avec la navigation flottante et le clavier virtuel.
- L’orientation paysage doit rester utilisable ; aucun parcours essentiel ne doit être bloqué en portrait uniquement sans raison métier documentée.

### 2.1 Structure d’un écran mobile

Ordre recommandé, à adapter au contexte :

1. En-tête compact avec identité et actions globales réellement utiles.
2. Titre d’écran explicite, éventuellement accompagné d’une courte phrase de contexte.
3. Contenu principal, en sections courtes et hiérarchisées.
4. Action principale clairement identifiable, placée près du contenu qu’elle valide.
5. Navigation principale persistante lorsque la destination l’exige.

Éviter les en-têtes volumineux, les doubles barres de navigation, les rangées d’actions concurrentes et les éléments décoratifs qui repoussent le contenu utile sous la ligne de flottaison.

## 3. Typographie et textes

### 3.1 Échelle de référence

Utiliser les rôles typographiques et les tokens existants. La taille de base actuelle est de 15 px (\`fontSize.base\`) et le niveau \`md\` correspond à 16 px.

| Usage | Cible Vitalis | Règle |
|---|---:|---|
| Texte courant et saisie | 16 px recommandé | Lisible sans zoom ; éviter le texte courant en 13 px |
| Texte secondaire | 13–14 px | Métadonnées courtes seulement |
| Légende / aide brève | 12–13 px | Jamais pour une instruction essentielle ou une erreur |
| Titre de section | 20–24 px | Hiérarchie claire, longueur maîtrisée |
| Titre d’écran | 24–28 px | Une idée principale, retour à la ligne autorisé |
| Titre très important | Selon token display | Réservé à l’accueil et aux moments éditoriaux |

Ces valeurs sont des objectifs de rendu, pas une autorisation de créer des tailles arbitraires. Si un token existant ne correspond pas, proposer une évolution du système de tokens avant de multiplier les exceptions.

### 3.2 Règles de rédaction

- Un écran présente une intention principale et un titre qui la nomme.
- Écrire des phrases courtes, concrètes, humaines et orientées vers l’action.
- Préférer les verbes explicites : « Enregistrer », « Réessayer », « Autoriser l’accès », « Voir le profil ».
- Éviter le jargon technique, les formulations culpabilisantes et les messages vagues comme « Une erreur est survenue » sans explication ni solution.
- Ne pas utiliser les majuscules intégrales pour attirer l’attention.
- Ne pas tronquer une instruction, un nom d’action, une erreur ou un contenu utile avec des points de suspension.
- Les textes doivent être localisés FR/EN, avec gestion des pluriels, dates, nombres et variantes régionales selon les capacités i18n du projet.
- Prévoir que l’anglais peut être plus long que le français ; ne pas fixer une hauteur de texte qui coupe le contenu.

## 4. Boutons et commandes

### 4.1 Hiérarchie

Chaque zone d’action doit avoir une action principale au maximum.

- **Primaire :** action qui termine ou fait avancer le parcours. Une par zone fonctionnelle.
- **Secondaire :** alternative utile, visuellement moins forte.
- **Tertiaire / lien :** navigation ou action de faible priorité.
- **Destructif :** suppression, révocation ou action difficilement réversible ; style distinct et confirmation adaptée au risque.
- **Icône seule :** uniquement pour une action universellement reconnaissable dans son contexte ; nom accessible obligatoire et infobulle éventuelle sur pointeur précis.

### 4.2 Dimensions et présentation

- Cible interactive mobile : **48 × 48 px minimum** pour les boutons compacts et contrôles tactiles.
- Bouton principal : hauteur visuelle cible de **48 à 56 px**, largeur adaptée au libellé ; pleine largeur sur les formulaires mobiles lorsque cela améliore l’action.
- Boutons secondaires dans une rangée : conserver 48 px de hauteur et permettre le retour à la ligne ou l’empilement si nécessaire.
- Espacement entre deux cibles indépendantes : viser **8 px minimum**, davantage lorsque les actions sont opposées (ex. valider / supprimer).
- Icône d’action principale : généralement 20–24 px ; l’icône ne remplace jamais le libellé si l’action n’est pas évidente.
- Les boutons ne doivent pas être uniquement différenciés par la couleur ; le texte, la forme ou un pictogramme explicite complète le sens.
- Le libellé décrit le résultat (« Publier le Flash ») plutôt qu’un geste imprécis (« OK »).

### 4.3 États obligatoires

Tout bouton doit définir, selon son contexte :

- repos ;
- appui / activation ;
- focus visible pour clavier ;
- désactivé avec une raison compréhensible lorsque cela n’est pas évident ;
- chargement avec prévention du double envoi ;
- succès ou échec via un retour distinct.

Pendant une opération, conserver un libellé compréhensible et ne pas laisser croire qu’une action est terminée avant confirmation réelle. Si l’action est mise en attente localement, le dire explicitement.


### 4.4 Audit initial du composant partagé `Button`

**Périmètre vérifié :** `src/components/ui/button.tsx`, lecture statique du composant partagé. Cet audit ne constitue pas une validation visuelle sur appareil et ne couvre pas encore les usages propres à chaque écran.

| Point contrôlé | Constat dans le composant | Évaluation par rapport au standard |
|---|---|---|
| Hauteur tactile | Les tailles `default`, `sm`, `lg` utilisent `min-h-12` ; `icon` utilise 48 × 48 px minimum | Conforme à la cible de hauteur minimale de 48 px |
| Icônes | Les SVG enfants reçoivent `size-5` (20 px) | Conforme au bas de la plage recommandée de 20–24 px |
| Hiérarchie visuelle | Variantes `default`, `secondary`, `outline`, `ghost`, `link` et `destructive` | Les variantes existent ; leur affectation aux rôles primaire, secondaire, tertiaire et destructif doit être cohérente dans les écrans |
| Libellé compact | La taille `sm` applique `text-xs` (12 px) | Point de vigilance : ne pas utiliser cette taille pour une action principale ou un libellé nécessitant une lecture confortable ; vérifier les usages |
| Focus clavier | Classes `focus-visible:outline-none` et `focus-visible:ring-1` | Présence technique détectée ; contraste, épaisseur perceptible et absence de masquage restent à valider visuellement |
| Désactivation | `disabled:pointer-events-none` et `disabled:opacity-50` | État prévu ; vérifier que la raison de désactivation est compréhensible lorsque nécessaire |
| Appui | Transition de couleur générique | Un style d’activation tactile explicite n’est pas identifiable dans les classes de base ; à vérifier et harmoniser lors d’un audit d’implémentation |
| Chargement et double envoi | Aucun contrat de propriété `loading` dans `ButtonProps` | Non garanti par le composant partagé ; chaque parcours doit actuellement être vérifié pour son retour de progression et la prévention du double envoi |
| Nom accessible | Les attributs natifs sont transmis via `props` | Le composant ne garantit pas à lui seul un nom accessible ; chaque appel doit fournir un texte ou un nom accessible pertinent, notamment pour les boutons icône seule |

**Conclusion de l’audit initial :** le socle de dimension tactile et la taille des icônes sont alignés avec les cibles V1. La conformité complète n’est pas démontrée : les états d’activation et de chargement, le contraste du focus, les libellés compacts et les noms accessibles demandent une vérification ciblée des usages et des rendus réels.

**Règle documentaire immédiate :** tant qu’un audit des écrans n’a pas confirmé le contraire, ne pas considérer `size="sm"` comme le choix par défaut d’une action mobile importante. Ne pas considérer la présence d’un `disabled` natif comme une preuve suffisante de prévention des doubles soumissions ou de gestion du chargement.

### 4.5 Audit d’échantillon des usages mobiles

**Périmètre :** lecture statique de quelques usages représentatifs du composant partagé, notamment l’en-tête global (`src/components/experience/AppHeader.tsx`) et l’onboarding (`src/components/experience/OnboardingSheet.tsx`). Cet échantillon sert à repérer des risques concrets ; il ne représente pas l’ensemble des écrans Vitalis et ne remplace pas une validation sur appareils Android et iOS.

| Usage observé | Constat | Action de conformité / vérification |
|---|---|---|
| Actions icône seule de l’en-tête | Les commandes communication et profil utilisent `size="icon"`, des dimensions 48 × 48 px et un `aria-label` explicite | Bon exemple à conserver ; vérifier au rendu que le badge de notification ne réduit pas la cible et que le focus reste visible |
| Icône de notification | L’icône est agrandie à 24 px, dans la plage recommandée ; le compteur est masqué aux lecteurs d’écran tandis que le nom accessible porte le nombre | Vérifier que le nombre annoncé correspond toujours au nombre d’événements réellement pertinents |
| Changement de langue dans l’onboarding | Le bouton compact conserve une cible minimale de 48 px, mais son libellé est en 12 px (`text-xs`) | Tolérable pour un contrôle court et secondaire ; ne pas réutiliser cette combinaison pour une action principale ou une instruction |
| Navigation précédent / suivant / ignorer | Les actions utilisent les variantes ghost ou primaire et héritent de la hauteur minimale de 48 px | Vérifier sur petit écran que les libellés longs ne provoquent ni chevauchement ni débordement ; autoriser l’empilement si nécessaire |
| Action de fin d’onboarding | L’action « entrer » déclenche une navigation après complétion locale | Vérifier le comportement en cas de double activation et s’assurer que l’état de complétion n’est pas annoncé comme une opération distante |
| États asynchrones | Dans les usages examinés, aucune propriété de chargement standardisée n’est visible sur le composant partagé | Pour chaque action réseau, vérifier la désactivation temporaire, l’indicateur de progression, le maintien du libellé accessible et le message de résultat |

**Constats de l’échantillon :**
- Les commandes principales de l’en-tête et les commandes de navigation de l’onboarding respectent la hauteur tactile minimale héritée du composant partagé.
- Les boutons icône seule de l’en-tête disposent d’un nom accessible explicite ; cette pratique doit être systématique dans tous les modules.
- Le style compact à 12 px apparaît sur le changement de langue, qui est une commande secondaire courte. Cela ne justifie pas son emploi pour des actions importantes.
- La conformité du focus, du contraste, des zones d’appui réelles, du comportement en orientation paysage et de la prévention du double appui ne peut pas être conclue à partir du JSX seul.

**Décision d’audit :** aucun défaut bloquant n’est établi dans cet échantillon statique. Les vérifications visuelles et tactiles sur appareils restent ouvertes. Étendre l’audit écran par écran avant de déclarer la bibliothèque de boutons conforme.

## 5. Cartes, listes et contenus

### 5.1 Cartes

Une carte doit avoir une fonction claire : aperçu, accès, contenu ou regroupement. Ne pas transformer chaque bloc de contenu en carte.

- Une carte cliquable entière doit se comporter comme une seule cible et ne pas contenir d’autres boutons imbriqués ambigus.
- Si elle contient plusieurs actions, rendre les actions distinctes et indépendantes ; ne pas faire de toute la carte une zone cliquable.
- Hiérarchie recommandée : titre, information essentielle, métadonnée facultative, action éventuelle.
- Utiliser les surfaces, rayons, bordures et ombres sémantiques des tokens ; ne pas inventer un style par module.
- Préserver une marge interne confortable et une séparation visible entre cartes voisines.
- Les cartes d’accueil des moteurs restent courtes, facilement identifiables et ne simulent ni contenu ni disponibilité.
- Les cartes de contenu doivent gérer les titres longs, images absentes, chargement, erreur et contenu indisponible.
- Ne pas utiliser une ombre ou un glow comme seul indice d’interactivité.

### 5.2 Listes

- Préférer une liste verticale aux grilles denses pour les contenus textuels ou les actions répétées.
- Aligner les titres et descriptions ; les métadonnées restent secondaires.
- Toute ligne activable présente une cible suffisante, un état actif éventuel et un nom accessible.
- Les séparateurs ne doivent pas être le seul moyen de distinguer les éléments.
- Les listes longues doivent prévoir chargement progressif ou pagination cohérente, sans perdre la position de lecture inutilement.

## 6. Champs, saisie et formulaires

- Un champ possède un libellé persistant ; le placeholder n’est jamais son seul nom.
- Les champs tactiles visent au moins 48 px de hauteur, avec une zone de saisie confortable.
- Utiliser le type de clavier adapté (email, nombre, téléphone, recherche) sans dépendre de lui pour valider les données.
- Les erreurs apparaissent près du champ concerné, expliquent le problème et indiquent comment le corriger.
- Préserver les valeurs déjà saisies après une erreur ou une interruption récupérable.
- Ne pas effacer silencieusement un formulaire lorsque le réseau disparaît.
- Le clavier virtuel ne doit pas masquer le champ actif, l’erreur ou l’action de validation ; le contenu doit pouvoir défiler.
- Ne demander que les données nécessaires à l’étape en cours.
- Pour les parcours guidés V1, poser une question à la fois ; le dialogue reste déterministe et ne doit pas être présenté comme une IA conversationnelle.

## 7. Messages, notifications et retours d’état

### 7.1 Types de messages

| Type | Usage | Comportement |
|---|---|---|
| Information | Contexte ou explication non bloquante | Visible dans le contenu, sans urgence artificielle |
| Succès | Opération réellement confirmée | Décrire le résultat réellement obtenu |
| Avertissement | Risque ou condition à connaître | Expliquer la conséquence et l’action possible |
| Erreur | Opération échouée ou impossible | Dire ce qui a échoué, ce qui est préservé et comment reprendre |
| Hors ligne | Réseau indisponible | Distinguer données locales, actions en attente et opérations non réalisables |
| Synchronisation | Transmission en attente ou en cours | Ne pas afficher « publié » ou « synchronisé » avant confirmation |
| Permission | Accès système requis ou refusé | Expliquer pourquoi, proposer une solution de repli et un accès aux réglages si pertinent |

### 7.2 Règles de contenu

Chaque message utile répond autant que possible à trois questions :

1. Que se passe-t-il ?
2. Quelle conséquence pour l’utilisateur ou ses données ?
3. Que peut-il faire maintenant ?

Exemples de formulation :

- Succès confirmé : « Votre Flash a été publié. »
- En attente hors ligne : « Votre Flash est enregistré sur cet appareil. Il sera envoyé lorsque la connexion sera rétablie. »
- Échec : « Le Flash n’a pas pu être envoyé. Votre texte est conservé. Réessayez. »
- Permission : « Vitalis a besoin de votre position pour rechercher les lieux proches. Vous pouvez aussi continuer sans cette recherche. »

N’utiliser ces formulations que si elles correspondent exactement au comportement réel du service.

### 7.3 Toast, bannière, dialogue

- **Toast :** retour bref, non critique, qui disparaît automatiquement ; ne pas y placer une décision ou une erreur nécessitant une lecture prolongée.
- **Bannière :** état persistant ou global (hors ligne, mise à jour disponible, avertissement) ; ne pas multiplier les bannières simultanées.
- **Dialogue :** décision importante, confirmation destructive, permission expliquée ou interruption nécessaire ; une question principale et des actions clairement nommées.
- **Feuille (bottom sheet) :** choix contextuels, filtres ou parcours courts ; contenu défilant, fermeture explicite et focus correctement géré.
- **Centre de communication :** notifications, messages et éléments d’assistant restent distingués selon leur nature ; aucun compteur fictif.

Les messages critiques ne disparaissent pas automatiquement avant que la personne ait pu les lire. Les annonces destinées aux technologies d’assistance utilisent les rôles ARIA adaptés, sans annoncer chaque mise à jour mineure de manière intrusive.

## 8. Navigation et gestes

- Les destinations principales restent visibles et cohérentes ; la navigation mobile V1 conserve l’ordre produit documenté.
- Toute action disponible par geste doit aussi avoir une commande visible accessible.
- Ne jamais dépendre uniquement d’un swipe, d’un glissement, d’un appui long ou d’un geste à plusieurs doigts.
- Les gestes doivent être tolérants, ne pas provoquer d’action destructive accidentelle et ne pas entrer en conflit avec le retour système ou les gestes du navigateur.
- Le retour doit préserver le contexte lorsque cela est raisonnable : position de liste, filtres et saisie non soumise.
- Les liens externes et ouvertures de documents doivent être identifiables ; ne pas détourner silencieusement la navigation.
- L’état actif de navigation doit être perceptible visuellement et annoncé sémantiquement.

## 9. Interaction tactile et retour immédiat

- Réagir visuellement à l’appui sans délai perceptible : état pressé, progression ou confirmation.
- Prévenir les doubles soumissions lors des opérations asynchrones.
- Ne pas déclencher une action métier au simple survol ; le survol n’est pas disponible sur tous les appareils.
- Ne pas exiger de précision extrême du doigt ; les cibles doivent être suffisamment grandes et espacées.
- Le retour haptique est facultatif et non garanti en PWA ; tout signal utile doit aussi exister visuellement et textuellement.
- Les animations sont courtes, fonctionnelles et respectent la réduction du mouvement.
- Les interactions doivent rester utilisables avec clavier, lecteur d’écran, souris et commandes d’assistance.

## 10. États réseau, chargement et résilience

Chaque écran métier prévoit les états applicables :

- initial / chargement ;
- contenu disponible ;
- contenu vide avec explication et prochaine action utile ;
- erreur récupérable avec action de reprise ;
- hors ligne ;
- opération enregistrée localement et en attente ;
- synchronisation en cours ;
- synchronisation confirmée ou échouée ;
- capacité ou permission indisponible.

Les états ne doivent pas se contredire. Une liste vide ne doit pas masquer une erreur de chargement. Un état hors ligne ne doit pas prétendre qu’une opération distante a réussi. Les données locales et distantes doivent être identifiables lorsque leur différence importe.

## 11. Permissions et capacités de l’appareil

- Demander une permission au moment où la fonction en a besoin, après une explication courte et contextualisée.
- Ne pas demander toutes les permissions au premier lancement.
- Respecter le refus ; ne pas bloquer toute l’application si une fonction secondaire peut être utilisée sans cette permission.
- Distinguer refus, refus persistant, indisponibilité de l’API, délai dépassé et erreur inconnue lorsque le navigateur permet de les différencier.
- Proposer une alternative lorsque cela est possible.
- Ne pas promettre caméra, géolocalisation, notifications, partage, installation, haptique ou exécution en arrière-plan avant détection de la capacité.
- Ne pas demander à l’utilisateur de désactiver les protections du navigateur ou du système pour contourner une limitation.

## 12. Zones système, clavier et mode installé

- Utiliser les safe areas CSS lorsque disponibles et prévoir un repli sans ces valeurs.
- Tester le viewport dynamique avec les barres du navigateur visibles/masquées.
- Le contenu principal reste défilable sous le clavier virtuel ; l’action principale ne doit pas devenir inaccessible.
- Les barres fixes doivent tenir compte de la zone sûre inférieure.
- L’état installé ne doit pas être supposé à partir du seul user-agent ; utiliser la détection de mode réellement disponible.
- Les consignes d’installation sont spécifiques au navigateur et au système ; si l’installation n’est pas disponible, l’application reste pleinement navigable dans le navigateur.
- Les mises à jour doivent être annoncées honnêtement ; ne jamais interrompre une saisie sans stratégie de conservation.

## 13. Accessibilité et confort d’utilisation

- Contraste du texte courant : cible WCAG 2.2 AA, soit 4,5:1 ; grand texte : 3:1. Les composants et états graphiques essentiels doivent atteindre 3:1 avec les couleurs adjacentes.
- Ne pas transmettre une information uniquement par couleur, position, animation ou icône.
- Chaque contrôle possède un nom, un rôle, un état et un ordre de lecture corrects.
- Le focus clavier est visible, logique et n’est jamais masqué par une barre fixe ou une feuille.
- À l’ouverture d’un dialogue, le focus entre dans le dialogue ; à sa fermeture, il revient au déclencheur lorsque celui-ci existe encore.
- Les textes restent utilisables avec zoom et agrandissement ; éviter les hauteurs fixes et les ellipses sur les informations essentielles.
- Respecter \`prefers-reduced-motion\`.
- Vérifier les parcours avec TalkBack et VoiceOver, en français et en anglais.

## 14. Thèmes, couleurs et cohérence visuelle

- Le thème sombre est prioritaire dans l’identité actuelle ; le thème clair reste pris en charge et doit recevoir le même niveau de qualité.
- Utiliser les couleurs sémantiques et surfaces des tokens, jamais une couleur choisie uniquement pour un écran.
- Les couleurs de succès, erreur, avertissement et information gardent le même sens dans tous les modules.
- Les états sélectionné, désactivé, focus, erreur et chargement doivent être définis dans les composants partagés.
- Les glows, transparences et flous sont décoratifs : ils ne doivent pas réduire le contraste ni ralentir les appareils.
- Ne pas inventer un troisième thème ou une variante locale sans décision produit.

## 15. Différences desktop — règle de compatibilité V1

Le desktop n’est pas la référence de conception V1. Il doit néanmoins conserver les fonctions déjà utilisables.

- Ne pas supprimer ou dégrader une fonction desktop existante pour imposer une apparence mobile.
- Corriger les défauts qui empêchent l’accès, la navigation, la saisie, la sécurité ou l’accessibilité.
- Les adaptations de densité ou de survol sont secondaires ; le contenu et les fonctions restent cohérents.
- La refonte dédiée en sidebar, panneaux multiples et interactions desktop avancées relève de Vitalis V2.

## 16. Matrice de validation par composant

| Composant | Contrôles visuels | Contrôles d’interaction | Accessibilité |
|---|---|---|---|
| Texte et titres | tailles, retours à la ligne, contraste FR/EN | zoom, texte long | hiérarchie et lecture |
| Boutons | hauteur, largeur, états, espacement | appui, double appui, chargement, erreur | nom, focus, état |
| Cartes | surface, contenu long, image absente | zone cliquable, actions internes | rôle et nom cohérents |
| Champs | libellé, erreur, clavier, petits écrans | saisie, correction, perte réseau | label, description, annonce erreur |
| Toast/bannière | position, durée, superposition | fermeture, action, persistance | annonce non intrusive |
| Dialogue/feuille | hauteur, scroll, safe area | ouverture, fermeture, clavier, retour | focus piégé/restauré, titre |
| Navigation | état actif, safe area, petits écrans | changement de route, retour | région nommée, destination courante |
| États réseau | vide, erreur, attente, reprise | hors ligne/en ligne, répétition | annonce exacte de l’état |

### Viewports minimums

Valider au minimum 320×, 360×, 390×, 412× et 768 px de largeur, en portrait et lorsque pertinent en paysage. Les captures visuelles ne suffisent pas : compléter par des tests tactiles, clavier, zoom et lecteur d’écran sur appareils ou environnements réels.

## 17. Critères de conformité V1

Un écran ne peut être déclaré conforme au standard mobile Vitalis que si :

- sa structure est utilisable à partir de 320 px sans perte de contenu ou action essentielle ;
- les textes sont lisibles, localisés et ne sont pas tronqués de manière nuisible ;
- les actions tactiles respectent les dimensions et espacements cibles ;
- les cartes, boutons, champs et messages utilisent les conventions partagées ;
- les états chargement, vide, erreur, hors ligne et reprise sont corrects pour le contexte ;
- aucune interaction essentielle ne dépend uniquement d’un geste ou d’une capacité native ;
- le clavier virtuel, les safe areas et les barres fixes ne masquent pas l’action ;
- le contraste, le focus et les noms accessibles sont vérifiés ;
- les thèmes clair et sombre restent lisibles ;
- les comportements réels de la PWA sont décrits sans promesse de fonctionnalité native non disponible.

**Règle de gouvernance :** toute exception doit être motivée dans la revue UX ou la spécification du module. Les valeurs doivent être harmonisées dans les tokens et composants partagés avant d’être copiées dans les écrans. Ce référentiel définit la cible ; il ne transforme pas les composants existants en composants conformes sans audit et preuve.
