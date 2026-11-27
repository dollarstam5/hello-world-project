# Référentiel de l'expérience native — Vitalis

**Statut :** référentiel directeur proposé — à appliquer progressivement et à valider par preuves.  
**Version :** 1.0  
**Portée :** Vitalis sur téléphone, tablette et espace large ; Android, iOS/iPadOS, PWA installée et éventuelle enveloppe native.  
**Branche de rédaction :** `feat/vitalis-warm-editorial-glass`.  
**Principe :** concevoir une expérience qui respecte les conventions du système et donne une sensation de continuité, de réactivité et de fiabilité comparable à une application native, sans prétendre qu'une PWA possède toutes les capacités d'une application native.

---

## 1. Rôle de ce référentiel

Ce document est le **point d'entrée commun** pour les décisions qui cherchent à renforcer la sensation native de Vitalis. Il rassemble les dimensions à examiner avant toute modification d'interface, de navigation, de plateforme ou d'architecture.

Il complète les documents spécialisés ; il ne les remplace pas et ne duplique pas leurs détails :

| Référence spécialisée | Responsabilité conservée |
| --- | --- |
| [Adaptation PWA et capacités des plateformes](./pwa-platform-adaptation.md) | Détection de capacités, installation, permissions, solutions de repli |
| [Standards de navigation mobile](../02-architecture/mobile-navigation-standards.md) | Architecture des destinations, navigation Android/iOS/Web, règles et cibles |
| [Charte des micro-interactions et du mouvement](../02-architecture/micro-interactions-motion-charter-v1.md) | Mouvement, durées indicatives, réduction des animations et vérité des états |
| [Matrice de conformité de navigation](../07-annexes/navigation-compliance-matrix.md) | Contrôles, statuts, preuves et tests de navigation |
| [Performance PWA](../06-operations/performance-pwa.md) | Budgets, Web Vitals, performance et hors connexion |
| [Vitalis Experience System](../01-product/experience-system.md) | Personnalité, principes d'expérience et langage humain |
| [Langage de design](./design-language.md) | Tokens, surfaces, couleurs, typographie et règles visuelles |

En cas de contradiction : les exigences de sécurité, d'accessibilité et les contraintes réelles de plateforme priment ; les décisions produit Vitalis priment sur une préférence visuelle locale ; toute exception doit être documentée.

### 1.1 Ce que signifie « sensation native »

Une expérience paraît native lorsque la personne :
- comprend immédiatement où elle se trouve et comment revenir ;
- retrouve des gestes, réactions et conventions cohérents avec son appareil ;
- ressent une réponse immédiate à chaque action ;
- ne perd pas son travail lorsqu'elle change d'application, verrouille l'écran ou perd le réseau ;
- retrouve une interface adaptée au clavier, aux zones système, à l'orientation et à la taille du texte ;
- voit les capacités du téléphone proposées au bon moment, avec des permissions compréhensibles ;
- reçoit des états honnêtes : rien n'est présenté comme envoyé, publié, détecté ou synchronisé avant confirmation réelle ;
- peut utiliser l'application avec les technologies d'assistance du système.

Le rendu visuel seul ne suffit pas. Une interface qui imite iOS ou Android mais ignore le retour système, le clavier, l'accessibilité ou le cycle de vie ne constitue pas une bonne expérience native.

## 2. Niveaux de conformité à distinguer

Chaque exigence doit être qualifiée afin d'éviter les promesses impossibles :

1. **Socle Web :** fonctionne dans un navigateur classique, sans installation.
2. **PWA installée :** fenêtre autonome, icône, manifeste, cache et capacités réellement disponibles dans le navigateur.
3. **Intégration système via API Web :** partage, notifications, fichiers, position, presse-papiers, etc., selon support et permission.
4. **Enveloppe native éventuelle :** capacités supplémentaires fournies par un conteneur natif (par exemple Capacitor) et ses plugins validés.
5. **Application native dédiée :** implémentation spécifique Android/iOS avec SDK et cycle de publication des stores.

Ne jamais écrire « natif » comme synonyme de « disponible partout ». Pour chaque fonction, consigner : plateforme, version minimale testée, contexte (navigateur/standalone/enveloppe), API, permission, limite, solution de repli et preuve.

**Décision d'architecture :** aucune migration vers une enveloppe native n'est décidée par ce document. Elle devra faire l'objet d'une étude séparée (capacités manquantes, coûts, sécurité, maintenance, distribution, mises à jour et bénéfice utilisateur).

## 3. Identité visuelle et chrome de l'application

### 3.1 Cadre d'application cohérent
- Lancement sur une destination stable, avec icône, nom, thème et écran de démarrage cohérents.
- Pas de barre d'adresse ni de chrome navigateur lorsque le mode autonome le permet.
- En-tête, navigation principale, menus, feuilles et dialogues suivent une grammaire visuelle constante.
- L'interface ne doit pas copier artificiellement les éléments système (barre d'état, indicateurs de batterie, clavier, alertes OS).
- Les couleurs système et le thème clair/sombre doivent conserver le contraste et la lisibilité.
- Les surfaces translucides restent un choix esthétique secondaire : elles ne doivent pas réduire les performances, le contraste ou la lisibilité.

### 3.2 Icône, lancement et identité
- Icônes adaptatives et variantes appropriées aux plateformes, sans contenu rogné.
- Manifeste cohérent : `name`, `short_name`, `start_url`, `scope`, `display`, couleurs, orientation si justifiée, icônes et raccourcis.
- Vérifier les icônes réellement utilisées par Android, iOS/iPadOS et les navigateurs ; ne pas supposer qu'un seul fichier couvre toutes les conventions.
- L'écran de lancement doit être rapide, sobre et cohérent avec le premier écran réel. Ne pas afficher un faux état de chargement ni une animation qui retarde l'accès.

### 3.3 Typographie et densité
- Respecter l'agrandissement du texte et le zoom ; éviter les hauteurs fixes qui coupent les libellés.
- Préserver une longueur de ligne lisible et une hiérarchie stable.
- Ne pas réduire les cibles ou le texte pour faire entrer artificiellement plus d'éléments.
- Les libellés importants restent visibles ; les icônes seules doivent avoir un nom accessible et un contexte compréhensible.

## 4. Navigation et architecture de l'information

### 4.1 Règles communes
- Distinguer destinations de premier niveau, sous-écrans, actions, menus et dialogues.
- Une destination principale ne doit pas être cachée derrière une action ambiguë.
- Garder une navigation persistante et cohérente là où le modèle produit le prévoit.
- Préserver l'état utile par destination : position de défilement, filtres, recherche, brouillon et sous-route, sous réserve de session, permissions et sécurité.
- Les liens internes doivent rester de vrais liens navigables : URL directe, partage, ouverture dans un nouvel onglet lorsque le contexte le permet, historique et restauration.
- Le changement d'onglet ne doit pas créer de doublons dans l'historique ni perdre un travail non enregistré.

### 4.2 Décisions Vitalis à préserver
- Home reste l'entrée produit et n'est pas confondue avec En direct.
- Les quatre moteurs restent distincts : Flash, Scan, En direct et Radar.
- La navigation mobile principale suit l'ordre validé dans les standards mobiles : Flash, Scan, En direct, Radar, 2×2.
- 2×2 ouvre les espaces secondaires ; ce n'est pas un cinquième moteur.
- Les destinations transversales (notifications, communication, profil, Vita) conservent une place claire.
- Ne pas créer une deuxième barre de navigation concurrente sur une route particulière ; toute exception doit être justifiée et testée.

### 4.3 Retour et historique
- Android : le bouton/gestuelle Retour ferme d'abord le dialogue, le panneau ou le menu ouvert, puis remonte dans la pile de navigation.
- iOS : préserver le geste système de retour depuis le bord ; ne pas le détourner avec un swipe horizontal concurrent.
- Web/PWA : respecter précédent/suivant, URL directe, rafraîchissement et liens profonds.
- Une action de retour ne doit pas supprimer un brouillon ou une transaction en cours sans avertissement proportionné.
- Éviter les boutons Retour redondants lorsque le système ou le modèle de navigation fournit déjà ce comportement ; les sous-écrans doivent toutefois garder un moyen de retour compréhensible.
- Tester aussi le bouton physique, la navigation à trois boutons Android et le clavier externe lorsque présents.

## 5. Gestes et interactions tactiles

- Le tap déclenche une action clairement identifiable ; la cible entière correspond à l'action annoncée.
- Les contrôles tactiles principaux visent au minimum 48×48 dp sur Android et 44×44 pt sur iOS natif, sans confondre ces unités avec CSS px.
- Le minimum WCAG Web est vérifié séparément selon WCAG 2.2 SC 2.5.8 et ses exceptions ; il ne remplace pas les objectifs ergonomiques mobiles.
- Les éléments voisins doivent être suffisamment espacés pour éviter les activations accidentelles.
- Préserver le défilement vertical natif, le zoom par pincement et les gestes système.
- Réserver les gestes personnalisés à des usages compréhensibles et découvrables ; toute action gestuelle importante doit avoir une alternative visible.
- Ne pas détourner le swipe depuis le bord, le geste d'accueil, le sélecteur d'applications ou les gestes d'accessibilité.
- Les actions longues (suppression, publication, mise en relation, partage) doivent donner un retour immédiat et une confirmation adaptée au risque.
- Les états pressés doivent être perceptibles, sans dépendre exclusivement d'un hover qui n'existe pas sur écran tactile.
- Désactiver le double déclenchement et protéger les actions asynchrones contre les taps répétés.

### Retour haptique
- Utiliser un retour haptique uniquement pour renforcer une action ou un état utile : sélection, confirmation, erreur importante, interaction spécifique.
- Le retour haptique est facultatif et dépend de la plateforme ; l'absence d'API ou de permission ne doit jamais bloquer l'action.
- Ne pas utiliser une vibration répétitive ou publicitaire.
- Détecter la capacité réelle ; `navigator.vibrate` n'est pas une garantie d'haptique iOS.
- Toute action doit conserver un retour visuel et/ou sonore accessible lorsque l'haptique est absente.

## 6. Mouvement et transitions

- Les transitions doivent expliquer la continuité spatiale et hiérarchique, pas faire patienter.
- Le retour visuel commence immédiatement ; l'action métier ne doit jamais attendre la fin d'une animation.
- Les panneaux, feuilles, dialogues et changements de destination utilisent des comportements cohérents.
- Les mouvements sont sobres, courts et liés à un changement réel.
- Respecter `prefers-reduced-motion` partout, y compris CSS, bibliothèques d'animation et micro-interactions tactiles.
- Éviter les animations permanentes, les grands flous et les transformations coûteuses sur appareils modestes.
- Ne jamais faire annoncer un succès par une animation avant confirmation du domaine/service.
- Les durées indicatives et conventions spécifiques restent définies dans la charte de mouvement.

## 7. Clavier, saisie et formulaires

- Le clavier virtuel ne doit pas recouvrir le champ actif, son libellé, l'erreur ou l'action principale.
- Le viewport doit s'adapter au clavier et au défilement ; vérifier les comportements de redimensionnement visuel et de mise en page selon navigateur.
- Le focus suit l'ordre logique et reste visible ; après fermeture d'un dialogue, il revient à l'élément déclencheur.
- Les champs utilisent les bons types, `autocomplete`, `inputmode`, contraintes et actions de clavier (`enterkeyhint`) selon la tâche.
- Le bouton Suivant/Terminé du clavier correspond à l'étape attendue ; la validation ne doit pas effacer une saisie.
- Les erreurs sont proches du champ, explicites, localisées et annoncées aux lecteurs d'écran.
- Le collage, le gestionnaire de mots de passe, l'autofill et les commandes de sélection doivent fonctionner ; ne pas neutraliser le menu contextuel sans raison.
- Les formulaires longs conservent les données lors d'une navigation accidentelle, d'une perte réseau ou d'une mise en arrière-plan.
- Les champs sensibles ne doivent pas être persistés en clair sans justification et protection appropriée.

## 8. Défilement, listes et contenus

- Le défilement principal doit rester fluide et prévisible ; éviter les conteneurs imbriqués qui capturent les gestes sans nécessité.
- Les listes longues utilisent pagination, virtualisation ou chargement progressif selon le besoin réel.
- Les mises à jour de contenu ne doivent pas faire sauter la position de lecture.
- Les contenus ajoutés en tête ne doivent pas déplacer brutalement la personne ; préserver l'ancrage lorsque pertinent.
- Les zones horizontales indiquent qu'elles peuvent défiler et ne bloquent pas le scroll vertical.
- Les médias sont adaptés à l'écran, chargés progressivement et dotés d'alternatives textuelles.
- Les états vide, chargement, erreur, fin de liste et actualisation sont distincts et honnêtes.
- Éviter les effets de parallaxe, scroll-jacking et effets de survol qui n'apportent pas de valeur mobile.

## 9. Cycle de vie, interruption et restauration

Une application mobile est souvent interrompue. Vitalis doit traiter explicitement :
- passage en arrière-plan, retour au premier plan et changement d'application ;
- verrouillage/déverrouillage de l'appareil ;
- perte temporaire de réseau ;
- changement d'orientation, redimensionnement ou ouverture du clavier ;
- suspension ou destruction du processus par le système ;
- mise à jour du service worker ou du conteneur natif ;
- fermeture et relancement après plusieurs heures ou jours.

Règles :
- Sauvegarder les brouillons et états métier selon les règles du domaine, pas uniquement dans l'état mémoire React.
- Restaurer une vue cohérente sans prétendre que toutes les opérations réseau ont réussi.
- Réconcilier les transactions en attente à la reprise, avec idempotence et prévention des doublons.
- Revalider session, autorisations, fraîcheur des données et capacités à la reprise.
- Ne jamais compter sur un timer JavaScript ou une tâche en arrière-plan pour garantir une opération critique.
- Expliquer les conflits de synchronisation et proposer une résolution compréhensible.
- Une mise à jour ne doit pas recharger brutalement une session avec un brouillon non sécurisé.

## 10. Réseau, mode hors connexion et synchronisation

- Distinguer réseau annoncé disponible, requête réussie et service réellement accessible.
- Prévoir les états en ligne, hors ligne, réseau lent, serveur indisponible, synchronisation en attente et synchronisation terminée.
- Définir par domaine quelles données sont accessibles hors connexion et quelles actions peuvent être mises en file.
- Conserver localement uniquement les données et mutations prévues par l'architecture et la politique de sécurité.
- Montrer un état local « enregistré sur cet appareil » distinct de « envoyé », « publié » ou « synchronisé ».
- Réessayer de manière bornée, avec backoff et idempotence ; ne pas lancer de boucle agressive.
- La synchronisation en arrière-plan n'est jamais garantie par le seul fait d'être une PWA.
- Le cache du service worker ne doit pas traiter les API métier comme des documents HTML génériques.
- La page hors connexion doit proposer une action réellement possible et ne pas promettre que toutes les pages restent disponibles.
- Les règles de stockage local, Dexie, worker et synchronisation du projet restent celles des documents d'architecture ; l'UI ne contourne pas ces frontières.

## 11. Notifications, badges et interruptions

- Demander la permission au moment où l'utilisateur comprend la valeur de la notification, jamais au premier affichage sans contexte.
- Expliquer le type d'événement, la fréquence et le contrôle laissé à la personne.
- Respecter les préférences par catégorie et le niveau d'urgence.
- Les notifications doivent être actionnables, ouvrir la destination pertinente et ne pas exposer de contenu sensible sur écran verrouillé sans choix explicite.
- Éviter les notifications redondantes, promotionnelles ou artificiellement urgentes.
- Gérer refus, permission retirée, token expiré, appareil non pris en charge et absence de réseau.
- Différencier notifications système et centre de notifications interne à Vitalis.
- Les badges d'icône ne sont utilisés que si supportés et utiles ; ne pas afficher un nombre fictif ou périmé.
- Vérifier les différences de fonctionnement entre navigateur, PWA installée et enveloppe native.

## 12. Capacités du téléphone et permissions

Chaque fonction système suit le cycle : **expliquer → demander au moment utile → vérifier le résultat → gérer le refus → proposer une alternative**.

| Capacité | Expérience attendue | Repli honnête |
| --- | --- | --- |
| Caméra | Ouverture rapide, permission contextualisée, retour lisible | Choix d'une image ou saisie alternative si le parcours l'autorise |
| Photos/fichiers | Sélection système, formats et taille contrôlés | Import alternatif ou explication de la limite |
| Position | Demande au moment d'une fonction géographique, précision et fraîcheur visibles | Continuer sans position exacte si possible |
| Notifications | Activation volontaire, catégories compréhensibles | Centre interne consultable |
| Partage | Feuille de partage système si disponible | Copier le lien ou proposer une action manuelle |
| Presse-papiers | Copie explicite, confirmation discrète | Sélection manuelle du contenu |
| Microphone/audio | Demande contextualisée et indicateur d'enregistrement | Saisie textuelle ou autre parcours si prévu |
| Contacts | Accès minimal et explicite, jamais implicite | Saisie ou invitation par lien |
| Bluetooth/NFC | Uniquement si une fonction produit le justifie et si API prise en charge | Parcours sans proximité matérielle |
| Biométrie | Uniquement via mécanisme sécurisé de plateforme/enveloppe validé | Authentification standard |
| Fichiers en arrière-plan | Expliquer progression, annulation et reprise réellement supportée | Téléchargement/traitement au premier plan |

Ne jamais demander une permission simplement parce qu'une API existe. Une permission refusée ne doit pas entraîner une boucle de demandes.

## 13. Sécurité, confidentialité et confiance

- Demander le minimum de données et de permissions nécessaire à l'action.
- Ne pas afficher de données privées dans notifications, aperçus, journaux ou captures sans politique explicite.
- Ne pas stocker secrets, jetons ou données sensibles dans un stockage Web non adapté.
- Protéger les opérations sensibles contre répétition, rejeu, perte de session et changement d'identité.
- Utiliser les mécanismes d'authentification et de stockage sécurisé recommandés par la plateforme lorsqu'une enveloppe native est envisagée.
- Expliquer les conséquences avant une suppression, publication ou transmission irréversible.
- Respecter les contrôles de confidentialité du système et la révocation des permissions.
- Les indicateurs de présence, localisation et activité ne doivent jamais être simulés.
- Les erreurs techniques sont traduites en langage humain sans masquer les informations nécessaires à la résolution.

## 14. Accessibilité système

- Sémantique correcte : boutons, liens, titres, listes, champs, dialogues et états.
- Noms accessibles localisés pour les contrôles iconographiques.
- Compatibilité VoiceOver et TalkBack ; ordre de lecture logique et annonces utiles.
- Focus clavier visible et restauration du focus après dialogue/feuille.
- Contraste vérifié, y compris sur verre, transparence, images et thèmes clair/sombre.
- Respect de Dynamic Type, taille de texte Android, zoom navigateur et reflow.
- Cibles tactiles et espacement conformes aux règles mobiles et WCAG.
- Réduction du mouvement et absence de clignotements dangereux.
- Ne pas communiquer un état par la couleur seule, le son seul ou l'animation seule.
- Les gestes complexes ont une alternative par contrôle visible.
- Les tests automatiques sont complétés par des essais VoiceOver/TalkBack sur appareils physiques.

## 15. Adaptation aux appareils et aux modes d'entrée

- Concevoir mobile-first, puis adapter selon l'espace de fenêtre disponible, pas uniquement le nom du périphérique.
- Téléphone : navigation accessible au pouce, contenu hiérarchisé et actions principales à portée.
- Tablette : considérer navigation latérale, panneaux multiples et espace de lecture élargi.
- Pliable/fenêtre redimensionnée : réagir aux changements de dimensions et de posture ; éviter les ruptures de mise en page.
- Desktop : clavier, souris, focus, hover facultatif, raccourcis seulement s'ils sont documentés.
- Paysage : ne pas supposer qu'il s'agit d'un grand écran ; vérifier hauteur utile, clavier et commandes.
- Prendre en charge pointeur grossier/fin, clavier, lecteur d'écran et commandes d'assistance.
- Tester au minimum les plages de largeur documentées dans les standards de navigation et performance.

## 16. Performance et sensation de réactivité

La sensation native dépend fortement de la latence perçue :
- afficher un retour immédiat à l'action ;
- utiliser des états optimistes uniquement si l'annulation/erreur est correctement gérée ;
- charger progressivement les contenus non essentiels ;
- éviter les recalculs, grands flous, animations coûteuses et re-rendus inutiles ;
- préserver la fluidité du scroll et des interactions ;
- respecter les budgets Web Vitals et bundle du document Performance PWA ;
- vérifier appareils modestes, réseau lent, mémoire limitée et batterie ;
- éviter les écrans blancs, flashes de thème et sauts de layout ;
- afficher une progression réelle pour les opérations longues, avec possibilité d'annuler lorsque c'est sûr.

Les objectifs chiffrés de performance restent ceux du contrat Performance PWA. Une impression de fluidité ne remplace pas les mesures.

## 17. États d'interface et qualité de finition

Chaque parcours doit définir les états pertinents :
- initial / prêt ;
- pressé / sélectionné ;
- chargement ;
- succès confirmé ;
- vide ;
- erreur récupérable / erreur bloquante ;
- hors ligne ;
- permission refusée ;
- session expirée ;
- synchronisation en attente / conflit ;
- contenu obsolète ;
- reprise après interruption.

Chaque état indique ce qui s'est réellement passé, ce qui est encore possible et quelle est la prochaine action utile. Les skeletons ne doivent pas imiter un contenu réel au point de tromper. Les toasts ne doivent pas être le seul endroit où une information critique est disponible.

## 18. Critères de test et preuve obligatoire

### 18.1 Matrice de contextes
Tester, selon pertinence :
- Android récent : Chrome navigateur et PWA installée ; Samsung Internet si supporté.
- Android modeste/ancien : performance, mémoire, réseau et reprise.
- iPhone récent et génération antérieure : Safari et PWA ajoutée à l'écran d'accueil.
- iPad : portrait/paysage, clavier, multitâche et Dynamic Type.
- Tablette Android : navigation, fenêtre redimensionnée et clavier.
- Desktop : clavier/souris, zoom et redimensionnement.
- Réseau : stable, lent, perte, retour et serveur inaccessible.
- Permissions : non demandée, accordée, refusée, retirée.
- Accessibilité : VoiceOver, TalkBack, texte agrandi, réduction du mouvement.

### 18.2 Scénarios obligatoires
1. Installation, premier lancement, fermeture et relancement depuis l'icône.
2. Navigation entre Home et les quatre moteurs, puis vers les espaces secondaires.
3. Retour système depuis chaque sous-écran, panneau, dialogue et menu.
4. Ouverture d'un lien profond et rafraîchissement d'une route.
5. Ouverture/fermeture du clavier dans chaque formulaire représentatif.
6. Passage en arrière-plan pendant une saisie, un envoi ou une synchronisation.
7. Perte de réseau pendant une action puis retour réseau.
8. Permission refusée puis activation depuis les réglages.
9. Rotation, changement de taille et reprise de scroll.
10. Activation de VoiceOver/TalkBack et agrandissement du texte.
11. Mise à jour disponible alors qu'un brouillon ou une opération est en cours.
12. Partage, sélection de fichier et caméra lorsque le parcours les utilise.

### 18.3 Fiche de preuve
Pour chaque scénario, consigner :
- ID et version de l'application/commit ;
- modèle exact de l'appareil, version OS et navigateur ;
- mode navigateur, PWA installée ou enveloppe native ;
- état réseau et permissions ;
- étapes, résultat attendu et résultat observé ;
- capture/vidéo ou rapport utile ;
- statut : CONFORME, À TESTER, À CORRIGER, BLOQUÉ, NON APPLICABLE ;
- ticket et responsable si anomalie.

Une capture d'écran prouve l'apparence à un instant donné ; elle ne prouve ni le geste, ni le cycle de vie, ni l'accessibilité, ni le fonctionnement d'une API.

## 19. Grille de maturité de l'expérience native

| Niveau | Description | Conditions de sortie |
| --- | --- | --- |
| N0 — Web cohérent | Parcours Web utilisable et accessible | Routes, clavier, responsive et états fiables |
| N1 — PWA installable | Identité installée et mode autonome | Manifeste, icônes, lancement et service worker vérifiés |
| N2 — Mobile fluide | Interactions et navigation adaptées | Retour, gestes, safe areas, clavier, scroll et restauration testés |
| N3 — Intégration système | Capacités du téléphone intégrées | Permissions, partage, notifications, fichiers et replis testés |
| N4 — Résilience | Reprise et continuité robustes | Offline, synchronisation, interruptions et mises à jour prouvés |
| N5 — Parité native ciblée | Expérience native approfondie sur plateformes définies | Écarts restants identifiés ; enveloppe/native évaluée si nécessaire |

Un niveau ne peut être déclaré atteint que pour les plateformes et versions explicitement testées. Il est possible d'être N3 sur Android et N2 sur iOS ; la maturité doit être rapportée par plateforme, jamais moyennée pour masquer un écart.

## 20. Règles de contribution pour les agents et développeurs

Avant toute contribution touchant l'expérience :
1. Identifier le parcours, l'intention utilisateur et les moteurs concernés.
2. Lire ce référentiel et les documents spécialisés pertinents.
3. Déterminer le niveau d'exécution : Web, PWA, API système ou enveloppe native.
4. Vérifier la capacité réelle et la solution de repli ; ne pas se baser uniquement sur le User-Agent.
5. Décrire les états normaux, chargement, erreur, vide, offline, permission et reprise pertinents.
6. Réutiliser les composants, tokens, hooks et services de plateforme existants.
7. Préserver les frontières d'architecture : UI → Dexie/état local prévu ; synchronisation par worker ; aucune logique métier dans les composants ; pas d'accès backend direct depuis l'UI.
8. Localiser tous les textes FR/EN et respecter le langage humain Vitalis.
9. Ajouter tests automatisés et scénarios manuels nécessaires.
10. Documenter les écarts, les preuves et les limites non résolues.

Une contribution ne doit pas :
- ajouter une API ou dépendance native sans besoin produit démontré ;
- simuler une capacité absente ;
- détourner les gestes système ;
- supprimer une alternative accessible ;
- déclarer une conformité appareil réel sans preuve ;
- introduire un faux succès, faux contenu, faux compteur ou fausse présence ;
- changer les règles métier au nom d'une amélioration visuelle ;
- modifier `main` directement pendant une phase de revue de branche.

## 21. Priorités d'application à Vitalis

Ordre de travail recommandé, à affiner par audit du code et preuve :
- **P0 — Fondations :** unifier navigation, retour, états de panneaux, zones sûres, clavier, restauration et accès Home/moteurs.
- **P1 — Réactivité :** états pressés, transitions cohérentes, scroll, performance, haptique facultative et réduction du mouvement.
- **P2 — Capacités système :** partage, caméra/fichiers, position, notifications, liens profonds et préférences.
- **P3 — Résilience :** hors connexion, brouillons, synchronisation, cycle de vie, mises à jour et conflits.
- **P4 — Parité étendue :** tablette, pliables, multi-fenêtre, intégration native éventuelle et distribution stores.

Ce classement est une feuille de route, pas un constat d'implémentation. Chaque chantier doit être audité avant de changer le code.

## 22. Références officielles

- Android Developers — [Core app quality guidelines](https://developer.android.com/develop/adaptive-apps/quality-guidelines/core-app-quality) : navigation Retour, préservation d'état, qualité visuelle et notifications.
- Android Developers — [Gesture navigation compatibility](https://developer.android.com/develop/ui/views/touch-and-input/gestures/gesturenav) : edge-to-edge et conflits de gestes système.
- Android Developers — [Adaptive app quality](https://developer.android.com/docs/quality-guidelines/adaptive-app-quality/tier-2) : adaptation aux tailles, états et fenêtres.
- Apple — [Human Interface Guidelines: Gestures](https://developer.apple.com/design/human-interface-guidelines/gestures) : conventions tactiles et gestes.
- Apple — [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) : principes d'interface, navigation, contrôles et accessibilité.
- MDN — [What is a progressive web app?](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/What_is_a_progressive_web_app) : capacités, installation, fonctionnement hors ligne et amélioration progressive.
- MDN — [Installing and uninstalling web apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Installing) : différences d'installation et limites selon plateforme.
- W3C — [WCAG 2.2](https://www.w3.org/TR/WCAG22/) : exigences d'accessibilité Web.

Les recommandations de plateforme évoluent. Revalider les liens et exigences au début de chaque release majeure. Les références officielles ne remplacent pas les essais sur appareils réels.

## Registre de conformité et suivi des preuves

L'état d'implémentation des exigences est suivi dans le [Registre de conformité — expérience native Vitalis](../07-annexes/native-experience-compliance-register.md). Ce registre compare `main` et la branche auditée, associe chaque exigence à ses fichiers, preuves, gravité et tests d'acceptation, et distingue code présent, test automatisé et validation appareil réel. Il doit être mis à jour avec chaque preuve ; il ne remplace pas les documents spécialisés.

---

**Règle finale :** Vitalis doit se comporter comme une application fiable avant de chercher à en avoir l'apparence. La sensation native est le résultat combiné de la navigation, du toucher, du système, de la continuité, de l'accessibilité, de la performance et de la confiance.
