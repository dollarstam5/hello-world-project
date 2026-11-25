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


### 4.6 Audit des boutons — module Flash

**Périmètre vérifié :** lecture statique des composants du module Flash présents dans la branche `chore/architecture-folder-cleanup-2026-11` : découverte (`FlashExperienceScreen`, `FlashFeed`), composition (`FlashComposerWriteStep`, `FlashComposerReviewStep`) et tableau de bord (`FlashDashboardHeader`, `FlashDashboardFilters`, `FlashDashboardRecordCard`, `FlashDashboardDetailDialog`, `FlashDashboardDeleteDialog`). Le composant partagé `src/components/ui/button.tsx` a également été relu pour distinguer les classes locales des dimensions héritées. Cet audit est statique ; il ne certifie pas le rendu sur appareils.

| Zone / commande | Constat dans le code de la branche | Évaluation mobile |
|---|---|---|
| En-tête Flash — retour accueil | Lien icône seule de 44 × 44 px (`size-11`), avec `aria-label` et `title` | Sous la cible 48 × 48 px ; augmenter la zone interactive ou garantir un conteneur tactile équivalent |
| Action principale « créer un Flash » | Bouton pleine largeur, `min-h-12`, libellé et icône 20 px | Conforme à la cible de hauteur ; bonne hiérarchie d’action |
| Onglets Découvrir / Mes Flashs | Boutons natifs avec `min-h-11` (44 px), rôles `tab` et état `aria-selected` | Sémantique de sélection présente ; hauteur sous la cible 48 px |
| Découverte — demander la position / réessayer | Boutons avec `min-h-12`, désactivés pendant le chargement | Hauteur conforme ; vérifier le retour de progression et l’annonce du résultat |
| Découverte — actualiser | Bouton avec `min-h-11` (44 px), désactivé pendant le chargement | Sous la cible 48 px |
| Composition — dictée vocale | Bouton `min-h-11` (44 px) ; désactivé si la reconnaissance vocale n’est pas prise en charge | Sous la cible ; état d’indisponibilité présent, mais l’explication est affichée séparément |
| Composition — continuer | Bouton pleine largeur `min-h-12`, désactivé sans texte et intention analysée | Conforme en dimension ; désactivation cohérente avec les prérequis visibles du parcours |
| Relecture — modifier le message | Bouton HTML natif sans dimension tactile explicite | Risque de cible trop petite ; fixer une zone d’au moins 48 px |
| Relecture — détecter / actualiser la position | Bouton `min-h-11` (44 px), désactivé pendant localisation ou publication | Sous la cible ; libellé de progression présent pendant la localisation |
| Relecture — choix de portée | Boutons natifs `min-h-12` et `aria-pressed` | Hauteur conforme et état sélectionné exposé |
| Relecture — choix d’urgence | Boutons natifs `min-h-10` (40 px) et `aria-pressed` | Sous la cible de 8 px ; à porter à 48 px minimum |
| Relecture — annuler / enregistrer le brouillon | Boutons `min-h-12`; enregistrement désactivé selon authentification, chargement et contenu ; libellé de chargement prévu | Hauteur conforme ; le verrouillage pendant publication est présent |
| Tableau de bord — créer un Flash | Bouton `min-h-11` (44 px) | Sous la cible ; porter à 48 px |
| Filtres — effacer la recherche | Bouton HTML natif positionné dans le champ, sans dimension minimale explicite | Risque élevé de cible étroite ; prévoir une zone de 48 × 48 px sans masquer la saisie |
| Filtres — statut | Boutons `min-h-9` (36 px), sélection exposée avec `aria-pressed`, rangée défilante horizontalement | Sous la cible ; conserver le défilement mais agrandir les cibles |
| Filtres — période et réinitialisation | Boutons `min-h-8` (32 px) | Sous la cible ; agrandir les cibles et préserver la lisibilité de la rangée |
| Carte — afficher les détails | Bouton `min-h-11` (44 px) | Sous la cible ; libellé textuel masqué sous le breakpoint `sm`, mais l’action est accompagnée d’une icône |
| Carte — modifier / supprimer | Boutons `min-h-11` (44 px), avec `aria-label` et `title` | Sous la cible ; noms accessibles explicites |
| Carte — archiver | Bouton `min-h-9` (36 px), avec `aria-label` et `title` | Sous la cible ; agrandir la cible |
| Carte — enregistrer / annuler une modification | Classes locales `h-9 min-h-9` (36 px), malgré la taille partagée `sm` qui prévoit normalement 48 px | Dérogation locale explicite au minimum partagé ; non conforme au standard tactile |
| Dialogue de détail — modifier / archiver / supprimer | Boutons partagés `size="sm"`, sans réduction locale de hauteur | La base partagée conserve `min-h-12` (48 px) ; vérifier l’espacement et le retour visuel dans le dialogue |
| Dialogue de suppression — annuler / confirmer | Primitives `AlertDialogCancel` et `AlertDialogAction`, sans dimension locale visible dans ce composant | Hauteur réelle à confirmer dans les primitives partagées et sur appareil ; ne pas conclure à la conformité sur ce seul fichier |

**Constats transversaux :**

- Le composant partagé `Button` définit bien une hauteur minimale de 48 px, y compris pour `size="sm"`. Plusieurs écrans contournent toutefois cette base avec des classes locales `min-h-11`, `min-h-10`, `min-h-9` ou `min-h-8`. Les boutons natifs HTML ne bénéficient pas automatiquement de la base du composant partagé.
- Les choix de portée, d’urgence, de statut et de période exposent leur état avec `aria-pressed`. Les onglets utilisent `role="tab"` et `aria-selected`. La présence de ces attributs est positive, mais le comportement clavier complet du modèle d’onglets doit encore être testé.
- Plusieurs actions asynchrones sont désactivées pendant l’opération et certains libellés indiquent le chargement. Il reste à vérifier l’annonce accessible de progression, la prévention effective du double déclenchement et le message de résultat dans les scénarios réseau réels.
- Les actions icône seule de la carte et le lien de retour ont un nom accessible explicite. Le bouton d’effacement de recherche possède également un `aria-label`, mais sa zone tactile n’est pas dimensionnée.
- Le contrôle « modifier le message » est un bouton natif sans dimension explicite ; il ne faut pas déduire sa conformité des boutons partagés utilisés ailleurs dans le même écran.

**Priorités documentaires de mise en conformité :**

1. Relever à 48 px minimum toutes les commandes explicitement sous-dimensionnées : onglets, dictée, localisation, actualisation, choix d’urgence, filtres, actions de carte et action de création du tableau de bord.
2. Définir une zone de 48 × 48 px pour les boutons natifs « modifier le message », « effacer la recherche » et retour accueil.
3. Supprimer les réductions locales à 36 px des actions enregistrer / annuler dans la carte.
4. Vérifier le modèle clavier des onglets, l’annonce des états asynchrones, le double déclenchement et les dialogues destructifs sur Android et iOS.
5. Contrôler les espacements et le défilement horizontal des filtres après agrandissement, sans réduire les cibles tactiles pour faire tenir la rangée.

**Conclusion de l’audit statique :** le module Flash comporte plusieurs écarts explicites au standard de cible tactile 48 × 48 px, principalement dans les commandes secondaires, les filtres et les actions de cartes. Il s’agit de constats sur les classes et composants déclarés, pas d’une mesure physique du rendu. Les dimensions effectives, l’espacement, le focus, les annonces de lecteur d’écran et les comportements tactiles doivent être validés sur appareils avant de clore l’audit. Aucun code applicatif n’a été modifié dans le cadre de cette étape.


### 4.7 Audit des boutons — module Scan

**Périmètre vérifié :** lecture statique des composants d’interface Scan présents dans la branche `chore/architecture-folder-cleanup-2026-11` : `ScanPanel.tsx`, `ScanPreferences.tsx`, `ScanHistory.tsx`, `ScanNeedInterpretation.tsx` et `ScanResults.tsx`. L’audit couvre les commandes déclarées dans ces fichiers. Le composant partagé `PublicProfilePreview`, rendu à l’intérieur des résultats, n’a pas été audité ici : ses propres commandes restent hors périmètre. Aucun rendu sur appareil n’a été mesuré.

| Zone / commande | Constat dans le code de la branche | Évaluation mobile |
|---|---|---|
| Saisie du besoin — démarrer / arrêter la dictée | Bouton `min-h-11` (44 px), avec `aria-pressed` lié à l’état d’enregistrement et désactivation pendant une opération Scan | Sous la cible tactile de 48 px ; porter à 48 px minimum. L’état activé est exposé sémantiquement |
| Saisie du besoin — continuer | Bouton pleine largeur `min-h-12` (48 px), désactivé si le texte est vide ou si Scan travaille | Conforme en dimension ; prérequis et état désactivé cohérents |
| Confirmation — confirmer le besoin | Bouton `min-h-12` (48 px), action principale | Conforme en dimension |
| Confirmation — modifier le besoin | Bouton `min-h-12` (48 px), action secondaire | Conforme en dimension |
| Critères — continuer | Bouton `min-h-12` (48 px), action principale | Conforme en dimension |
| Critères — revenir modifier le besoin | Bouton `min-h-12` (48 px) | Conforme en dimension |
| Lancement — lancer Scan | Bouton `min-h-14` (56 px), désactivé pendant localisation ou traitement, avec `aria-busy` et libellé de progression | Conforme ; bon retour d’état déclaré. Vérifier l’annonce effective et la prévention du double déclenchement |
| Lancement — modifier les critères | Bouton `min-h-12` (48 px), désactivé pendant une opération | Conforme en dimension |
| Préférences — ouvrir / fermer les critères de distance | Élément `summary` de divulgation avec `min-h-10` (40 px) sur petit écran et `sm:min-h-11` (44 px) à partir du breakpoint | Sous la cible sur toutes les tailles ; porter à 48 px minimum, y compris sur téléphone |
| Préférences — choisir un rayon | Boutons `min-h-12` (48 px), avec `aria-pressed` et désactivation possible | Conforme en dimension et état sélectionné exposé |
| Historique — ouvrir / fermer l’historique | Élément `summary` de divulgation avec `min-h-11` (44 px) | Sous la cible ; porter à 48 px minimum |
| Historique — effacer l’historique | Bouton `min-h-11` (44 px), affiché uniquement si des entrées existent | Sous la cible ; porter à 48 px. Vérifier également que l’action destructive est confirmée ou annulable selon son comportement réel |
| Résultats — cartes de candidats | Aucun bouton d’action local n’est déclaré dans `ScanResults.tsx` ; le composant affiche des informations et peut intégrer `PublicProfilePreview` | Pas de conclusion sur les commandes du profil embarqué, qui nécessitent un audit séparé du composant partagé |

**Constats transversaux :**

- Les actions principales du parcours (continuer, confirmer, lancer) respectent la hauteur minimale de 48 px ; le lancement dispose même de 56 px.
- Les écarts de dimension observés concernent surtout les commandes secondaires et les contrôles de divulgation : dictée vocale à 44 px, ouverture des préférences à 40/44 px, ouverture de l’historique à 44 px et effacement de l’historique à 44 px.
- Les choix de rayon exposent correctement leur sélection avec `aria-pressed`. La dictée expose son état d’enregistrement avec le même attribut.
- Les états de chargement et de désactivation sont explicitement gérés sur plusieurs actions du parcours. Le lancement expose `aria-busy` ; la vérification du rendu et des annonces avec TalkBack / VoiceOver reste nécessaire.
- Les contrôles de progression du parcours sont des indicateurs visuels non interactifs ; ils ne doivent pas être confondus avec des boutons ou des étapes directement sélectionnables.
- Les éléments `summary` natifs assurent l’ouverture des sections, mais leurs dimensions tactiles doivent respecter le même standard que les boutons.

**Priorités documentaires de mise en conformité :**

1. Porter à 48 px minimum les commandes de dictée, les deux contrôles `summary` (préférences et historique) et le bouton d’effacement de l’historique.
2. Vérifier le traitement de l’effacement de l’historique : confirmation, possibilité d’annulation ou retour de succès explicite, selon la réversibilité réelle de l’action.
3. Tester la dictée sur Android et iOS : permission microphone, indisponibilité, démarrage / arrêt, état annoncé et conservation du texte déjà saisi.
4. Tester le parcours complet au clavier et avec lecteur d’écran, en particulier les divulgations, les états de chargement et les changements d’étape.
5. Auditer séparément `PublicProfilePreview` avant de déclarer les interactions des résultats Scan conformes.

**Conclusion de l’audit statique :** le parcours principal Scan est globalement aligné sur la cible de hauteur tactile de 48 px. Quatre commandes présentent un écart explicite : dictée, ouverture des préférences, ouverture de l’historique et effacement de l’historique. Les résultats ne déclarent pas de bouton local, mais peuvent contenir des commandes provenant d’un composant partagé non audité ici. Les dimensions effectives, l’espacement, les annonces accessibles et les comportements tactiles doivent être validés sur appareils avant clôture. Aucun code applicatif n’a été modifié dans cette étape.


### 4.8 Audit des boutons — module Réel

**Périmètre vérifié :** lecture statique des composants d’interface Réel présents dans la branche `chore/architecture-folder-cleanup-2026-11` : `ReelProximityScreen.tsx`, `ReelBottomNav.tsx`, `ReelActivityPanel.tsx`, `ReelAtmospherePill.tsx`, `ReelDiscoveryPrompt.tsx`, `ReelDiscoverySettings.tsx`, `ReelGuidedTour.tsx`, `ReelHeader.tsx`, `ReelNearbyPreview.tsx`, `ReelPeoplePanel.tsx`, `ReelProfileSheet.tsx`, `ReelRadarIdentity.tsx`, `ReelSettingsHelp.tsx` et `ReelSettingsPanel.tsx`, ainsi que les règles CSS associées dans `reel-proximity.css` et `reel-bottom-nav.css`. Les dimensions ci-dessous proviennent des règles CSS déclarées ; elles ne constituent pas une mesure sur appareil.

| Zone / commande | Constat dans le code et les styles de la branche | Évaluation mobile |
|---|---|---|
| En-tête — accueil, alertes, préférences, découverte, aide et Bluetooth | Classe commune de 40 × 40 px ; à 360 px et moins, largeur ramenée à 35,2 px. D’autres règles responsives la ramènent à 36 px | Sous la cible de 48 × 48 px dans tous les cas ; agrandir les cibles sans laisser les six commandes comprimer le titre ou déborder |
| Navigation inférieure — destinations Flash, Scan, Réel, Radar et menu | Liens et bouton de menu avec `min-height: 3.35rem` (53,6 px) ; commande centrale de 3,65 rem (58,4 px) | Conforme en hauteur déclarée ; vérifier l’espace horizontal, la zone sûre inférieure et l’état de destination active |
| Pastille d’ambiance | Bouton `min-height: 2.65rem` (42,4 px), désactivé lorsqu’aucune action n’est fournie | Sous la cible ; porter à 48 px minimum. Le libellé dynamique est annoncé avec `aria-live="polite"` |
| Radar — commande « ma présence » | Le bouton remplit le noyau central du radar ; nom accessible dynamique, `aria-pressed` et désactivation pendant le chargement | La surface semble largement supérieure à 48 px ; confirmer la zone réelle au rendu et vérifier l’annonce de l’état |
| Radar — sélection d’une personne | Le bouton contient un avatar dont la taille est définie par une variable CSS de 48 à 56 px selon la largeur | Dimension de l’avatar compatible avec la cible minimale ; vérifier que le bouton réel conserve cette zone et que le menu rapide ne la recouvre pas |
| Aperçu rapide — envoyer un Bip | Bouton avec seulement un padding vertical de 0,4 rem (6,4 px), texte et icône de 13 px ; aucune hauteur minimale | Cible probablement inférieure à 48 px ; fixer explicitement une zone tactile minimale |
| Aperçu rapide — ouvrir le profil complet | Bouton icône de 32 × 32 px | Écart important ; porter à 48 × 48 px |
| Carte de localisation — voir les personnes proches / réessayer / continuer en invité / pas maintenant | Boutons primaire et secondaire avec `min-height: 2.65rem` (42,4 px) | Sous la cible ; porter à 48 px minimum |
| Raccourcis de l’écran calme — découverte globale / activité passée | Boutons de carte avec `min-height: 4.25rem` (68 px) | Conforme en hauteur ; conserver cette cible confortable |
| Aperçu des personnes proches — afficher toute la liste | Bouton avec `min-height: 2.25rem` (36 px) | Sous la cible ; porter à 48 px |
| Aperçu des personnes proches — ouvrir une personne | Carte entière interactive, sans `min-height` explicite ; padding et avatar déterminent la hauteur intrinsèque | Pas de garantie explicite du minimum ; vérifier la hauteur réelle sur téléphone étroit et définir une cible minimale |
| Panneau personnes — ouvrir un profil | Bouton de ligne avec padding de 0,6 rem et avatar interne ; pas de `min-height` explicite | La hauteur intrinsèque peut dépasser 48 px, mais le minimum n’est pas contractualisé ; vérifier la zone réelle |
| Panneau activité — onglets Alertes / Bips / Connexions | Les règles CSS finales donnent `min-height: 2.75rem` (44 px) | Sous la cible ; porter à 48 px. `aria-selected` est présent ; vérifier navigation clavier et gestion du focus dans le tablist |
| Panneau activité — accepter / refuser un Bip | Boutons natifs dans une ligne, sans classe dédiée ni hauteur minimale visible dans le composant ou la règle CSS de la ligne | Zone tactile non garantie et probablement trop petite ; définir 48 px minimum et un espacement suffisant entre accepter et refuser |
| Panneau activité — terminer une connexion | Bouton natif dans une ligne, sans dimension tactile explicite | Zone tactile non garantie ; fixer 48 px minimum et prévenir les activations répétées pendant la terminaison |
| Panneau principal — fermer | Bouton icône de 40 × 40 px | Sous la cible ; porter à 48 × 48 px |
| Panneau de réglages — ouvrir l’aide | Bouton `min-height: 2.75rem` (44 px) | Sous la cible ; porter à 48 px |
| Réglages — activer / désactiver la découverte | Boutons primaire et secondaire avec `min-height: 3rem` (48 px) | Conforme en hauteur ; l’activation est désactivée si l’accès n’est pas autorisé |
| Réglages — choisir le rayon | Boutons radio personnalisés sans `min-height` ; padding vertical de 0,55 rem (8,8 px) | Hauteur tactile non garantie ; porter chaque option à 48 px minimum tout en conservant le rôle radio et l’état `aria-checked` |
| Réglages — choisir la durée | Cartes-boutons sans `min-height`, avec padding vertical de 0,65 rem (10,4 px) | Hauteur tactile non garantie ; fixer 48 px minimum et conserver l’état sélectionné exposé par `aria-pressed` |
| Réglages — arrêter une présence | Bouton secondaire avec `min-height: 3rem` (48 px), désactivé pendant le chargement | Conforme en hauteur ; vérifier le retour de progression et la prévention des doubles activations |
| Réglages — activer une présence | Bouton primaire avec `min-height: 3rem` (48 px), désactivé selon consentement, champs requis et chargement ; libellé de progression prévu | Conforme en hauteur ; vérifier l’annonce du chargement et le résultat de l’opération |
| Feuille profil — fermer | Bouton icône de 2,25 rem (36 px) | Sous la cible ; porter à 48 × 48 px |
| Feuille profil — envoyer un Bip | Bouton pleine largeur avec `min-height: 3.25rem` (52 px) | Conforme en hauteur |
| Aide des réglages — fermer | Bouton icône de 40 × 40 px | Sous la cible ; porter à 48 × 48 px |
| Aide des réglages — terminer | Bouton primaire partagé du panneau, `min-height: 3rem` (48 px) | Conforme en hauteur |
| Visite guidée — fermer | Bouton icône de 32 × 32 px | Écart important ; porter à 48 × 48 px |
| Visite guidée — ignorer / précédent / suivant / terminer | Boutons avec `min-height: 2.5rem` (40 px) | Sous la cible ; porter à 48 px minimum et maintenir l’empilement sur petit écran |
| Dialogue de fin de connexion — conserver / terminer | Boutons utilisant les classes primaire et secondaire du panneau, hauteur minimale de 48 px | Conforme en hauteur déclarée ; vérifier l’espacement et l’état pendant la confirmation |

**Constats transversaux :**

- Plusieurs composants Réel utilisent leurs propres classes CSS plutôt que le composant partagé `Button`. Les tailles locales varient donc et plusieurs commandes restent sous le standard même si le composant partagé est conforme.
- Les écarts les plus nets concernent l’en-tête, les boutons icône de fermeture, les commandes de l’aperçu rapide, les onglets d’activité, les sélecteurs de rayon et de durée, les actions des lignes d’activité et les commandes de la visite guidée.
- Les onglets d’activité exposent `role="tab"` et `aria-selected`, et les boutons de rayon utilisent `role="radio"` et `aria-checked`. Le comportement clavier complet (flèches, tabulation et focus actif) reste à tester ; les gestionnaires visibles ne définissent pas un modèle de roving tabindex.
- Plusieurs opérations asynchrones désactivent leurs commandes ou modifient le libellé. Les commandes d’acceptation/refus et de fin de connexion n’exposent pas, dans les composants audités, de verrouillage local visible pendant leur exécution ; vérifier le contrôle anti-double activation dans le contrôleur et au rendu.
- La navigation inférieure respecte la hauteur tactile, mais les actions icône seule de l’en-tête et des fenêtres sont trop petites malgré leurs noms accessibles.
- Les styles de focus explicites existent pour certains contrôles (navigation, radar et feuille profil), mais ne sont pas uniformément visibles dans toutes les classes locales. Vérifier chaque commande au clavier et avec les thèmes clair et sombre.

**Priorités documentaires de mise en conformité :**

1. Uniformiser à 48 × 48 px les commandes d’en-tête et les boutons icône de fermeture des panneaux, feuilles et fenêtres d’aide / visite guidée.
2. Porter à 48 px les actions de la pastille d’ambiance, de la carte de localisation, de l’aperçu « toute la liste », des onglets d’activité et des commandes de visite guidée.
3. Donner une hauteur minimale de 48 px aux choix de rayon et de durée, ainsi qu’aux boutons accepter / refuser / terminer des lignes d’activité.
4. Agrandir les deux actions de l’aperçu rapide, en particulier le bouton icône de 32 px, sans réduire la lisibilité du contenu.
5. Vérifier les zones interactives des cartes de personnes, le comportement clavier des groupes tablist/radiogroup et la prévention des doubles actions asynchrones.
6. Refaire un contrôle des petits écrans (320 et 360 px) après agrandissement des cibles, notamment pour l’en-tête et les groupes de navigation.

**Conclusion de l’audit statique :** Réel dispose d’une navigation inférieure et de plusieurs actions principales correctement dimensionnées, mais son interface comporte de nombreux contrôles secondaires sous les 48 px ou sans minimum explicite. Les priorités sont les commandes compactes de l’en-tête et des fenêtres, les actions des panneaux d’activité et les sélecteurs personnalisés. Les hauteurs CSS déclarées ne remplacent pas la vérification des zones d’appui, des espacements, du focus et des annonces avec TalkBack et VoiceOver sur appareils réels. Aucun code applicatif n’a été modifié dans cette étape.


### 4.9 Audit des boutons — module Radar

**Périmètre vérifié :** lecture statique, sur la branche `chore/architecture-folder-cleanup-2026-11`, de `RadarDraftForm.tsx` et `RadarManagement.tsx`, seuls composants d’interface présents dans `src/modules/radar/ui/`. L’audit couvre les commandes du formulaire de création / modification, les actions sur les intentions enregistrées et la boîte de confirmation d’annulation. Les dimensions sont celles déclarées dans le code ; aucun rendu sur appareil n’a été mesuré.

| Zone / commande | Constat dans le code de la branche | Évaluation mobile |
|---|---|---|
| Formulaire — rayon et durée | Deux éléments `select` natifs avec `min-h-12` (48 px), largeur pleine, état désactivé pendant l’enregistrement et focus visible | Conforme en hauteur déclarée ; tester l’ouverture et la sélection avec les sélecteurs natifs Android et iOS |
| Formulaire — annuler la modification | Composant partagé `Button`, variante ghost, sans surcharge locale de taille | Le composant partagé définit une hauteur minimale de 48 px ; confirmer le rendu réel de la variante ghost et son contraste |
| Formulaire — créer / enregistrer les modifications | Composant partagé `Button`, action de soumission ; désactivé si le texte est trop court ou si une opération est en cours ; libellé de chargement prévu | Conforme selon le contrat du composant partagé (48 px minimum) ; vérifier que le changement de libellé et l’état désactivé sont annoncés |
| Liste — modifier une intention | Composant partagé `Button`, taille `sm`, variante ghost ; icône 16 px ; désactivé pendant une opération ou lorsqu’une autre édition est active | La taille `sm` conserve le minimum tactile du composant partagé ; contrôler que l’icône et le libellé restent lisibles sur petit écran |
| Liste — demander l’annulation d’une intention | Composant partagé `Button`, taille `sm`, variante ghost ; désactivé pendant les opérations | Même conformité attendue à 48 px ; vérifier la distinction visuelle de l’action et l’espacement avec « modifier » |
| Dialogue — conserver / confirmer l’annulation | `AlertDialogCancel` et `AlertDialogAction` sans dimension locale déclarée | Hauteur tactile non démontrée par les deux composants métier ; inspecter les primitives partagées et mesurer le rendu avant de conclure à la conformité |
| Dialogue — fermeture / annulation | Fermeture contrôlée par `onOpenChange` ; le dialogue ne se ferme pas par cette voie pendant l’opération (`busyId` non nul) | Comportement de verrouillage visible dans le composant ; vérifier le focus initial, le retour du focus au déclencheur et l’activation clavier / lecteur d’écran |

**Constats transversaux :**

- Les commandes du formulaire et de la liste réutilisent le composant partagé `Button`, dont le contrat documenté dans cet audit prévoit une hauteur minimale de 48 px, y compris pour les tailles compactes. Aucune classe locale ne réduit explicitement cette hauteur dans les deux fichiers Radar examinés.
- Les sélecteurs natifs de rayon et de durée déclarent explicitement 48 px minimum et un anneau de focus visible. Leur ergonomie finale dépend néanmoins du rendu natif de chaque plateforme.
- Les opérations de création et de modification désactivent le formulaire pendant le traitement et remplacent le libellé du bouton par un état de chargement. Les commandes de liste sont également désactivées selon `busy`, `busyId` et `editingId`.
- Les messages d’erreur et de succès utilisent respectivement `role="alert"` et `role="status"`. Le formulaire associe ses champs à des libellés et conserve les contraintes de saisie requises.
- La boîte de confirmation s’appuie sur les primitives partagées AlertDialog ; leur hauteur, leurs états de focus et leur comportement tactile ne peuvent pas être établis à partir des seuls composants métier audités.
- Aucun bouton compact de moins de 48 px n’a été identifié dans les deux composants examinés. L’audit ne couvre pas les éventuelles commandes rendues par des composants partagés internes au dialogue.

**Priorités documentaires de validation :**

1. Vérifier dans les primitives partagées `AlertDialogAction` et `AlertDialogCancel` que les deux actions atteignent au moins 48 × 48 px, avec un espacement suffisant.
2. Tester les sélecteurs rayon / durée sur Android et iOS, notamment l’ouverture du menu natif, le focus, la lisibilité et le comportement lorsque le formulaire est désactivé.
3. Tester les états de création, modification et annulation : double activation, progression annoncée, erreur, succès et réactivation des commandes.
4. Vérifier le dialogue avec TalkBack et VoiceOver : annonce du titre et de la description, ordre de focus, fermeture au clavier et restitution du focus au bouton déclencheur.
5. Contrôler les groupes d’actions sur une largeur de 320 px afin de confirmer qu’ils se replient sans chevauchement ni réduction des cibles.

**Conclusion de l’audit statique :** les commandes directement déclarées dans les composants métier Radar sont globalement alignées sur la cible tactile de 48 px : boutons issus du composant partagé et sélecteurs natifs ont une hauteur minimale explicite ou héritée. Le seul point non vérifié concerne les dimensions et le comportement des actions de la boîte AlertDialog, définis dans des primitives partagées. Les tests sur appareils et lecteurs d’écran restent nécessaires avant de clôturer l’audit. Aucun code applicatif n’a été modifié dans cette étape.


### 4.10 Audit des boutons — module Profile

**Périmètre vérifié :** lecture statique, sur la branche `chore/architecture-folder-cleanup-2026-11`, de `ProfileFieldRow.tsx`, `ProfileManagementPage.tsx`, `ProfileVisibilitySettingsPage.tsx` et `PublicProfilePreviewPage.tsx`. L’audit couvre les commandes d’édition des champs d’identité, la suppression du handle, les retours de navigation et les pages d’aperçu / visibilité. Les composants partagés AlertDialog sont évalués uniquement à partir de leur usage dans le module ; leurs dimensions internes ne sont pas déduites.

| Zone / commande | Constat dans le code de la branche | Évaluation mobile |
|---|---|---|
| Profil — modifier un champ (nom / handle) | Bouton icône partagé `Button`, avec `h-11 w-11` (44 × 44 px) et libellé accessible explicite | La largeur locale est inférieure à la cible 48 px ; vérifier l’effet du style partagé et garantir 48 × 48 px sans ambiguïté |
| Édition — enregistrer / annuler un champ | Deux boutons icône avec `h-11 w-11` (44 × 44 px), état désactivé pendant l’enregistrement et noms accessibles | Largeur déclarée sous la cible ; porter explicitement les deux dimensions à 48 px. L’état désactivé est prévu |
| Profil — supprimer le handle | Bouton partagé `Button`, taille `sm`, avec surcharge locale `h-10` (40 px) et padding horizontal réduit | Hauteur CSS locale sous la cible ; le minimum du composant partagé peut la contraindre, mais ne pas compter sur une règle héritée : déclarer une cible explicite de 48 px |
| Navigation — retour vers l’espace | Bouton partagé ghost enveloppant un lien, largeur ajustée au contenu ; aucune réduction locale de hauteur | Le composant partagé apporte le minimum tactile de 48 px ; vérifier le rendu du lien et le focus visible |
| Accès à la connexion depuis un profil déconnecté | Bouton partagé avec classe explicite `h-12` (48 px) | Conforme en hauteur déclarée ; vérifier la largeur et le focus sur téléphone |
| Dialogue — annuler / confirmer la suppression du handle | `AlertDialogCancel` et `AlertDialogAction`, sans dimension locale déclarée ; confirmation avant suppression | Hauteur tactile non démontrée par les composants métier ; contrôler les primitives partagées et mesurer les deux actions |
| Page de visibilité du profil | Aucun bouton de réglage : la fonctionnalité est signalée « bientôt » ; seul le retour est interactif | Pas de commande de visibilité active à auditer dans cette version |
| Aperçu du profil public | Aucun bouton d’aperçu : le contenu indique que la fonctionnalité n’est pas disponible ; seul le retour est interactif | Pas de commande d’aperçu active à auditer dans cette version |

**Constats transversaux :**

- Le module réutilise le composant partagé `Button`, mais plusieurs boutons icône du composant `ProfileFieldRow` réduisent localement largeur et hauteur à 44 px. Ces dimensions doivent être normalisées explicitement à 48 × 48 px.
- Le bouton de suppression du handle applique une hauteur locale de 40 px. Même si une contrainte minimale héritée peut influencer le rendu final, cette surcharge rend le contrat tactile moins lisible et doit être remplacée par une dimension explicite de 48 px.
- Les commandes d’enregistrement et d’annulation d’un champ portent un nom accessible via `aria-label`, et sont désactivées pendant l’enregistrement. Le formulaire de profil expose des retours de succès via `role="status"` et des erreurs via `role="alert"`.
- La suppression du handle est précédée d’un dialogue de confirmation. Le bouton de confirmation est désactivé pendant l’opération ; le focus, les dimensions tactiles et l’annonce de la progression restent à valider.
- Les pages de visibilité et d’aperçu public sont des écrans d’information non encore actifs : ne pas interpréter leurs indicateurs « bientôt » comme des commandes fonctionnelles.
- Les libellés de champs et les noms accessibles des boutons icône sont présents. Il reste à vérifier la navigation au clavier, la restitution du focus après dialogue et le comportement avec TalkBack / VoiceOver.

**Priorités documentaires de mise en conformité :**

1. Porter les boutons icône Modifier / Enregistrer / Annuler à 48 × 48 px, y compris leur largeur effective.
2. Remplacer la hauteur locale de 40 px du bouton de suppression du handle par une cible explicite d’au moins 48 px.
3. Vérifier les dimensions de `AlertDialogCancel` et `AlertDialogAction` dans les primitives partagées et sur appareils.
4. Tester la suppression du handle : confirmation, désactivation pendant l’opération, annonce du résultat, gestion d’erreur et absence de double activation.
5. Valider le focus clavier et lecteur d’écran sur les commandes d’édition, le dialogue et le retour de navigation.
6. Refaire un contrôle sur largeur 320 px : la rangée de champ en édition contient un champ et deux boutons icône ; vérifier qu’elle se replie sans écraser la saisie ni réduire les cibles.

**Conclusion de l’audit statique :** Profile présente des écarts explicites sur les boutons icône d’édition (44 × 44 px) et une surcharge locale de 40 px sur la suppression du handle. Les retours de navigation et l’accès à la connexion reposent sur le bouton partagé et disposent d’une hauteur minimale attendue de 48 px. Les actions de dialogue nécessitent une vérification des primitives partagées. Les écrans de visibilité et d’aperçu public ne proposent pas encore de commandes actives. Aucun code applicatif n’a été modifié dans cette étape.


### 4.11 Audit des boutons et formulaires — module Auth

**Périmètre vérifié :** lecture statique, sur la branche `chore/architecture-folder-cleanup-2026-11`, de `SignInView.tsx`, `ResetPasswordView.tsx` et `pages/AccountInformationPage.tsx`, seuls écrans d’interface présents dans `src/modules/auth/ui/`. L’audit couvre connexion, inscription, demande et réinitialisation du mot de passe, changement de langue / thème et consultation des informations du compte. Il ne constitue pas un test de parcours réel ni une validation sur appareil.

| Zone / commande | Constat dans le code de la branche | Évaluation mobile |
|---|---|---|
| Connexion / inscription / mot de passe oublié — champs | Champs email, mot de passe et nom avec `min-h-12` (48 px), libellés persistants, types et attributs `autocomplete` adaptés | Conforme en hauteur déclarée et association label/champ ; vérifier la taille de texte réellement rendue (cible 16 px), le clavier mobile et l’affichage avec zoom |
| Connexion / inscription — soumission | Bouton partagé `Button` avec `min-h-12`, désactivé pendant la requête et libellé de chargement | Conforme selon le contrat du composant partagé ; tester le double appui, l’annonce de progression et la reprise après erreur |
| Changement de langue | Bouton partagé avec `min-h-12 min-w-12`, libellé court en `text-xs` et `aria-label` | Cible 48 × 48 px déclarée ; 12 px reste acceptable uniquement pour ce libellé secondaire court |
| Changement de thème | Bouton partagé icône seule avec `h-12 w-12`, `aria-label` et `title` contextualisés | Conforme en dimension et nom accessible ; vérifier le focus, le contraste et l’icône dans les thèmes clair / sombre |
| Liens d’actions secondaires — mot de passe oublié / bascule connexion-inscription | Boutons natifs avec `min-h-12`, focus visible et libellés explicites | Conforme en hauteur déclarée ; contrôler l’espacement vertical et le retour à la ligne sur 320 px |
| Messages connexion / inscription | Les erreurs utilisent `role="alert"`, les confirmations utilisent `role="status"` | Sémantique adaptée ; vérifier l’annonce sans déplacement inattendu du focus et la compréhension des messages localisés |
| Réinitialisation — champs nouveau mot de passe / confirmation | Champs avec `min-h-12`, `required`, `minLength=8` et `autocomplete="new-password"` | Conforme en hauteur déclarée ; vérifier la taille 16 px, le clavier, la visibilité des erreurs et la conservation des valeurs |
| Réinitialisation — soumission | Bouton natif pleine largeur avec `min-h-12`, désactivé pendant l’opération et libellé de chargement | Conforme en hauteur ; contrairement à l’écran de connexion, le message de résultat n’a pas de `role="alert"` ou `role="status"` explicite |
| Réinitialisation — erreur de confirmation / retour serveur | Message rendu dans un paragraphe simple ; le traitement asynchrone ne protège pas l’appel par `try/catch/finally` | Annonce lecteur d’écran non garantie ; une exception inattendue peut laisser `busy` actif. À vérifier et traiter dans un chantier d’implémentation séparé, sans modification ici |
| Informations du compte — retour | Bouton partagé ghost enveloppant un lien, sans réduction locale de hauteur | Minimum tactile de 48 px attendu par le composant partagé ; vérifier le rendu du lien et le focus |
| Informations du compte — chargement / erreur | États textuels avec `role="status"` et `role="alert"` ; aucune autre action active sur cet écran | Sémantique adaptée ; tester les annonces et l’état d’erreur avec connexion expirée ou réseau indisponible |

**Constats transversaux :**

- Les commandes d’action des trois écrans atteignent ou héritent d’une cible tactile minimale de 48 px dans les classes observées. Aucun bouton sous 48 px n’a été identifié dans ce périmètre.
- Les champs de saisie déclarent 48 px minimum et utilisent des libellés persistants. Leur classe ne fixe toutefois pas explicitement une taille de police de 16 px ; la conformité typographique doit être mesurée dans le navigateur mobile, notamment pour éviter le zoom automatique de certains navigateurs lors du focus.
- L’écran de connexion / inscription présente une gestion explicite des états asynchrones, avec désactivation, libellé de chargement et rôles d’annonce des messages. L’écran de réinitialisation est moins robuste sur les annonces et la gestion des exceptions.
- Les actions de langue et de thème restent accessibles depuis l’écran public de connexion ; leurs noms accessibles sont présents. Vérifier que leur position absolue en haut à droite ne chevauche jamais le titre ou le formulaire sur petit écran et avec une traduction longue.
- L’écran d’informations du compte est essentiellement consultatif : son seul contrôle est le retour vers l’espace. Les états de chargement et d’erreur sont sémantisés.
- L’audit statique ne valide ni la navigation réelle entre les trois états d’authentification, ni les liens reçus par email, ni la restitution du focus, ni les annonces TalkBack / VoiceOver.

**Priorités documentaires de validation :**

1. Mesurer la taille effective des textes saisis sur Android et iOS ; viser 16 px pour les champs, sans réduire la cible tactile de 48 px.
2. Vérifier sur 320 et 360 px que les commandes de langue / thème ne chevauchent pas le titre, et que les formulaires restent défilables lorsque le clavier virtuel est ouvert.
3. Ajouter aux critères de recette de la réinitialisation l’annonce accessible des erreurs et confirmations, ainsi que la remise à zéro de l’état de chargement après toute exception.
4. Tester connexion, inscription et récupération : double activation, réseau lent / absent, erreurs serveur, confirmation email, lien de récupération expiré et retour après changement de mot de passe.
5. Vérifier les annonces et le focus avec TalkBack et VoiceOver, notamment lors du changement de mode connexion / inscription / mot de passe oublié.
6. Contrôler le focus visible et les contrastes des commandes langue / thème en mode clair et sombre.

**Conclusion de l’audit statique :** le module Auth présente de bonnes bases tactiles : champs et commandes atteignent la cible déclarée de 48 px, les libellés de champs sont persistants et les messages de connexion sont sémantisés. Les points de vigilance sont la taille réelle du texte des champs, le placement des commandes globales sur petit écran et surtout la gestion / l’annonce des erreurs dans la réinitialisation du mot de passe. Les tests sur appareils et lecteurs d’écran restent nécessaires avant clôture. Aucun code applicatif n’a été modifié dans cette étape.


### 4.12 Audit des commandes et de la navigation — module Admin

**Périmètre vérifié :** lecture statique, sur la branche `chore/architecture-folder-cleanup-2026-11`, de `AdminAccessGate.tsx`, `AdminOverviewView.tsx`, `AdminRecordsView.tsx`, `AdminShell.tsx`, `AdminSystemView.tsx`, `ModuleHeader.tsx`, `StatCard.tsx` et `StateBlock.tsx`. L’audit couvre la navigation mobile du tableau de bord, les états d’accès, la recherche et la pagination des données, ainsi que les vues de synthèse et système. Les composants purement visuels ne sont pas considérés comme des commandes. Aucun rendu sur appareil n’a été mesuré.

| Zone / commande | Constat dans le code de la branche | Évaluation mobile |
|---|---|---|
| En-tête — ouvrir / fermer la navigation | Bouton icône avec `size-9` (36 × 36 px), visible uniquement sous le breakpoint desktop, nom accessible dynamique via `aria-label` | Nettement sous la cible 48 × 48 px ; agrandir la zone tactile sans augmenter excessivement l’encombrement de l’en-tête |
| Navigation latérale — liens de modules | Liens avec padding vertical `py-2` (8 px par côté), sans hauteur minimale explicite ni indication `aria-current` visible dans le composant | Hauteur intrinsèque probablement sous 48 px selon la police ; définir une cible de 48 px minimum et exposer la page courante de façon sémantique |
| Navigation latérale — fermeture après sélection | Le clic sur un lien appelle `setNavOpen(false)` ; panneau mobile fixe, défilable, sous l’en-tête | Fermeture prévue après navigation ; tester focus, retour arrière, défilement et absence de masquage du contenu |
| Écran d’accès — réessayer | Bouton natif sans hauteur minimale, padding vertical `py-1.5` (6 px) | Cible tactile non garantie et probablement inférieure à 48 px ; appliquer le standard |
| Écran d’accès refusé — retour accueil | Lien avec padding vertical `py-1.5`, sans minimum tactile explicite | Cible tactile non garantie ; porter la zone à 48 px minimum et conserver un focus visible |
| État d’erreur partagé — réessayer | Bouton natif dans `StateBlock`, padding vertical `py-1.5`, sans minimum explicite | Sous le standard probable ; porter à 48 px et garantir un focus visible |
| Registres — champ de recherche | Champ avec padding `py-2`, sans `min-height` ni taille de police explicite ; nom accessible via `aria-label` | Hauteur tactile non garantie ; fixer 48 px minimum et vérifier une police de 16 px pour éviter le zoom mobile |
| Registres — lancer la recherche | Bouton natif avec padding `py-2`, sans hauteur minimale explicite | Cible tactile non garantie ; porter à 48 px minimum, avec focus visible |
| Registres — page précédente / suivante | Boutons natifs avec padding `py-1.5`, sans hauteur minimale ; état `disabled` selon la page | Sous le standard probable ; définir 48 px minimum, vérifier l’espacement et conserver un état désactivé perceptible |
| Synthèse / système — cartes statistiques et lignes d’audit | Éléments de présentation non interactifs dans les composants examinés | Pas de cible tactile à mesurer ; préserver la lisibilité et ne pas leur donner une apparence cliquable |
| Chargement / erreur / vide | Les états de chargement utilisent `aria-busy="true"` ; erreurs et données vides sont présentées sous forme de texte ; le bouton de reprise est audité ci-dessus | Le chargement est signalé au niveau du bloc, mais l’annonce lecteur d’écran du texte d’erreur / vide n’est pas explicitement structurée par `role="alert"` ou `role="status"` dans ces composants |

**Constats transversaux :**

- Le module Admin possède une structure desktop avec navigation latérale et une navigation mobile en panneau fixe. Cette adaptation est fonctionnelle dans son principe, mais plusieurs commandes conservent des dimensions compactes qui ne répondent pas à la cible mobile V1.
- Le bouton d’ouverture du menu est de 36 × 36 px. Les liens de navigation et les commandes de recherche / pagination n’ont pas de hauteur minimale explicite ; leur padding seul ne garantit pas une cible de 48 px.
- Les boutons de reprise des erreurs d’accès et des vues de données utilisent un padding vertical de 6 px sans minimum tactile. Ils constituent un écart récurrent à corriger.
- Les liens de navigation ferment le panneau mobile après sélection, mais le composant ne déclare pas explicitement `aria-current="page"` sur la destination active. Le style visuel seul ne suffit pas à annoncer la position courante à tous les utilisateurs.
- Les vues de synthèse et système sont principalement consultatives. La vue des registres est en lecture seule, avec recherche et pagination ; aucun contrôle d’édition de données n’a été observé dans le périmètre.
- Les composants audités ne montrent pas de contrat de focus clavier uniforme sur les boutons natifs et les liens. Les classes de focus doivent être vérifiées ou explicitées.
- La présence de `aria-busy` sur le squelette de chargement est positive, mais les erreurs, résultats vides et changements de pagination doivent être testés avec les lecteurs d’écran.

**Priorités documentaires de mise en conformité :**

1. Porter le bouton d’ouverture / fermeture de navigation à 48 × 48 px.
2. Donner une hauteur minimale de 48 px aux liens du menu mobile, aux boutons de reprise, au champ et au bouton de recherche, ainsi qu’aux commandes de pagination.
3. Ajouter une indication sémantique de destination courante aux liens du menu, par exemple `aria-current="page"`, en plus du style visuel actif.
4. Garantir un focus visible cohérent pour tous les boutons natifs et liens du module, en thème clair et sombre.
5. Structurer les annonces des états erreur / vide / mise à jour des registres ; tester l’annonce de la recherche et du changement de page sans déplacement forcé du focus.
6. Tester le menu sur 320 et 360 px : hauteur disponible, défilement, superposition avec l’en-tête, fermeture après sélection et navigation retour.
7. Vérifier la lisibilité du tableau sur téléphone : défilement horizontal contrôlable, conservation du contexte de ligne et alternative acceptable pour les colonnes nombreuses.

**Conclusion de l’audit statique :** Admin est majoritairement une interface de consultation, mais sa navigation mobile et ses commandes de recherche / reprise / pagination présentent plusieurs cibles tactiles inférieures ou non garanties à 48 px. Le bouton de menu à 36 px est l’écart le plus explicite. La sémantique de la navigation courante et les annonces d’état méritent également une validation. Aucun code applicatif n’a été modifié dans cette étape.
