# Registre de conformité — expérience native Vitalis

**Statut :** audit documentaire initial, non certification.  
**Version :** 1.1 — 26 novembre 2026.  
**Référentiel :** [Référentiel de l'expérience native](../00-foundation/native-experience-standard.md).  
**Branche auditée :** `feat/vitalis-warm-editorial-glass`.  
**Base de comparaison :** `main`.  
**PR :** [#96](https://github.com/dollarstam5/hello-world-project/pull/96), ouverte et non fusionnée.  
**Règle :** ce registre décrit les preuves trouvées et les preuves manquantes. Il n'autorise aucune correction implicite et ne vaut pas validation appareil réel.

---

## 1. Objet et méthode

Ce registre transforme les exigences du référentiel directeur en contrôles traçables. Il couvre le code, les tests automatisés, les documents d'architecture et les validations manuelles nécessaires. Il doit être mis à jour à chaque correction et chaque preuve doit être liée à un commit, un test, un rapport ou une fiche d'essai.

### 1.1 Périmètre et photographie Git

Photographie GitHub au 26 novembre 2026 :

- PR #96 : état `open`, `merged = false`.
- Branche : 29 commits en avance sur `main`, 0 commit en retard.
- Fichiers modifiés par rapport à `main` : 16 (dont le présent registre). Ils concernent trois documents de fondation/navigation et des composants de présentation Home, Flash, Scan, En direct et Radar.
- Les fichiers techniques de plateforme examinés — `AppShell.tsx`, `BottomNav.tsx`, `ReelBottomNav.tsx`, `install.ts`, `update.ts`, `haptics.ts`, `sw.js` et `manifest.webmanifest` — sont identiques entre `main` et la branche au moment de l'audit.
- En conséquence, les écarts P0/P1 décrits ci-dessous sont des écarts de la base commune, et non des régressions de plateforme propres à PR #96. Les changements d'interface de la branche restent soumis à leur propre validation visuelle et lint.

La comparaison est effectuée sur les références GitHub au moment de l'audit. Tout déplacement de branche invalide cette photographie : les SHA doivent être réactualisés avant de conclure une correction.

### 1.2 Légende des états

| État | Signification |
| --- | --- |
| **CODE** | Mécanisme repéré dans le code ; le comportement complet n'est pas encore démontré. |
| **TEST** | Test automatisé existant et pertinent ; sa portée reste celle du test. |
| **MANUEL** | Essai manuel sur appareil ou navigateur réel requis ; preuve non fournie. |
| **ÉCART** | Défaut ou risque observable dans le code par rapport au référentiel. |
| **À ÉTABLIR** | Preuve ou comparaison de référence absente ; ne pas attribuer la cause. |
| **N/A** | Non applicable au niveau de plateforme indiqué, avec justification. |

Un contrôle peut porter plusieurs états, par exemple **CODE + TEST + MANUEL** : les tests unitaires existent, mais l'expérience réelle n'est pas certifiée.

### 1.3 Gravité

- **Bloquante** : risque de perte de travail, intégrité, sécurité, faux état de réussite ou impossibilité d'utiliser un parcours essentiel.
- **Majeure** : convention système, accessibilité ou parcours principal non respecté / non prouvé.
- **Modérée** : incohérence ou limitation qui dégrade l'expérience sans bloquer le parcours essentiel.
- **Mineure** : finition et cohérence perceptible.

La gravité indique le risque de l'écart, pas une preuve qu'un incident s'est déjà produit.

---

## 2. Synthèse de conformité

| Priorité | Domaine | État initial | Décision de sortie |
| --- | --- | --- | --- |
| P0 | CI et référence de qualité | **CONTRÔLE CI CLOS POUR LE SHA VALIDÉ** — les erreurs Prettier introduites ont été corrigées ; Quality, Réel Validation et Dependency Review passent sur `d243928` | Réouvrir si un nouveau commit fait échouer un contrôle ; cela ne clôt pas les autres P0 de fiabilité |
| P0 | Brouillons et navigation | **CODE + TEST + MANUEL** — clé de remount supprimée et test de contrat ajouté ; conservation réelle des brouillons/scroll à vérifier sur appareils | Démontrer sauvegarde, restauration et navigation sans perte |
| P0 | Mise à jour Service Worker | **CODE + TEST + ÉCART RÉSIDUEL** — rechargement de secours supprimé ; timeout désormais non destructif ; coordination avec brouillons/outbox/sync encore à établir | Démontrer mise à jour sans perte avec travail local et synchronisation en cours |
| P0 | Offline et reprise de sync | **CODE + TEST** — outbox et moteur testés ; intégration bout en bout non prouvée | Démontrer création hors ligne, persistance, reprise, résolution et états réels |
| P1 | Retour et historique | **CODE + MANUEL** — router Web présent ; retour système non démontré | Essais Android, iOS et navigateur |
| P1 | Insets, clavier, orientation, cibles | **CODE + TEST + MANUEL** — safe areas et viewport couverts par contrats | Mesures et parcours appareil réel, revoir orientation portrait |
| P1 | Accessibilité | **CODE + MANUEL** — focus et sémantique présents sur des contrôles | Audit complet clavier, VoiceOver, TalkBack, zoom, contraste |
| P1 | Installation et relance PWA | **CODE + TEST + MANUEL** — manifeste et instructions | Installer et relancer sur Android/iOS réels |
| P2 | Tablette et fenêtres | **CODE + MANUEL** — responsive et détection appareil existent | Navigation et composition adaptatives démontrées |
| P2 | Deux navigations inférieures | **ÉCART** — deux composants distincts pour un modèle commun | Unifier ou documenter une exception avec tests |
| P2 | Performance réelle | **CODE + TEST + MANUEL** — budgets et instrumentation ; p75 de production absent | Mesures reproductibles sur appareils modestes |
| P2 | Haptique et mouvement | **CODE + ÉCART** — Vibration API uniquement ; parité iOS non garantie | Repli cohérent et essais reduced-motion / haptique |
| P3 | Finition visuelle | **CODE** — composants Warm Editorial Glass en branche | Ne reprendre qu'après sortie P0/P1 et preuves P2 |
| P3 | États pressés et transitions | **CODE + MANUEL** — classes et animations partagées ; couverture globale inconnue | Matrice d'états et essais de cohérence par moteur |

---

## 3. P0 — Fiabilité et conservation du travail

### P0.1 — Référence CI saine et attribution des erreurs

| Champ | Constat |
| --- | --- |
| ID | **P0-CI-01** |
| Exigence | Disposer d'une baseline reproductible ; distinguer les défauts de main des régressions introduites par la branche ; ne pas masquer le lint. |
| Fichiers / composants | `.github/workflows/*`, `package.json`, `eslint.config.*`, `.prettierrc*`, fichiers modifiés de la PR et `scripts/check-reproducibility.ts`. |
| main | Commit `55f2408969c7da6367f06f0fc096cb2018807a9e` : Quality [#45670065729](https://github.com/dollarstam5/hello-world-project/actions/runs/45670065729) réussi. Job `139402604002` ; lint : **0 erreur, 71 avertissements**. |
| Branche — écart initial | Commit `c1922e80228723b4459ea8c716735d2d968a8510` : Quality [#45804569220](https://github.com/dollarstam5/hello-world-project/actions/runs/45804569220) échoué avec **56 erreurs Prettier / 71 avertissements**. Les 56 erreurs étaient localisées dans six fichiers modifiés. Elles ont été corrigées de manière ciblée, sans désactiver Prettier ni modifier la configuration de lint. |
| Branche — preuve finale historique et réouverture | Les workflows Quality, Réel Validation et Dependency Review ont réussi sur le commit `d243928f234629e588fefc88c699ee73b6b3f340`. Cette preuve historique ne couvre pas les commits ultérieurs. Sur le commit `e527d60a2b9e8cedb6e3cac46141bb2248153e53`, le workflow Quality [#45828214650](https://github.com/dollarstam5/hello-world-project/actions/runs/45828214650) a échoué dans `check:reproducibility` : les deux builds ont produit 141 fichiers publics différents (140 JavaScript et le manifeste). Le script ne nettoyait que `.output` et réutilisait les caches de génération entre deux builds censés être indépendants. Une isolation des builds froids a été ajoutée dans `scripts/check-reproducibility.ts` : nettoyage de `.tanstack`, `.vinxi`, `.nitro`, `node_modules/.nitro` et restauration de `src/routeTree.gen.ts` avant chaque build. Cette correction est en attente de validation CI sur le nouveau HEAD. |
| Preuve | Baseline historique complète sur `d243928...`. Sur `e483a482...`, Réel Validation et Dependency Review ont réussi ; Quality était encore en cours. Le correctif d’isolation est sur `b52204f...` et ses workflows sont en attente/en cours. Aucune exclusion de fichier ni neutralisation de règle n’a été appliquée. |
| Plateforme | Toutes ; pipeline CI. |
| Gravité | **Bloquante pour la fusion — réouverte** jusqu’à réussite du contrôle de reproductibilité et des workflows Quality, Réel Validation et Dependency Review sur le même HEAD. |
| Acceptation | Non satisfaite sur le HEAD actuel. Exiger un contrôle `check:reproducibility` réussi, Quality complet, Réel Validation et Dependency Review réussis sur un même SHA, avec rendu mobile et aucune neutralisation de règle. |
| Correction appliquée | Corrections de formatage ciblées dans `HomeEngineCard.tsx`, `HomeFoundation.tsx`, `FlashExperienceScreen.tsx`, `ReelProximityScreen.tsx`, `ScanPanel.tsx`, `radar.lazy.tsx`, puis isolation des builds froids dans `scripts/check-reproducibility.ts` pour éviter de comparer un build avec caches réchauffés à un build avec caches persistants. Aucune règle de lint n'a été désactivée. |


### P0.2 — Persistance et restauration des brouillons

| Champ | Constat |
| --- | --- |
| ID | **P0-DRAFT-01** |
| Exigence | Un brouillon doit survivre à un changement de moteur, un changement de route, un rafraîchissement, une suspension et une fermeture/reprise raisonnablement attendue. Le statut « sauvegardé localement » ne doit pas être confondu avec « publié ». |
| Fichiers / composants | `src/domains/flash/ui/useFlashComposer.ts`, `FlashComposer.tsx`, `FlashComposerDialog.tsx`, `src/domains/flash/ui/dashboard/*`, stockage local/Dexie et tests `tests/flash/*`. |
| main | Code de composition et stockage local présents ; la matrice de scénarios de restauration n'est pas démontrée par les preuves consultées. |
| Branche | Identique à main pour le code plateforme ; PR ajoute des ancres et ajustements de présentation Flash, sans preuve supplémentaire de cycle de vie du brouillon. |
| Preuve | Architecture locale et tests domaine existent ; aucun résultat E2E documenté couvrant toutes les interruptions n'a été fourni. |
| Plateforme | Web, PWA Android, PWA iOS ; sessions membre et invité selon règles métier. |
| Gravité | **Bloquante** si perte d'un brouillon confirmé sauvegardé. |
| Acceptation | Saisir un brouillon ; attendre la confirmation de sauvegarde locale ; naviguer vers chaque moteur ; revenir ; rafraîchir ; fermer/réouvrir l'application ; activer le mode avion ; redémarrer le navigateur. Le contenu sauvegardé doit être identique. Un brouillon non confirmé doit être annoncé comme tel. |
| Correction proposée | Formaliser l'état du brouillon (dirty/saving/saved/error), son propriétaire/session, sa durée de vie et son stockage ; éviter les sauvegardes silencieuses qui ne sont pas confirmées ; ajouter des tests intégration et E2E sur les interruptions. |

### P0.3 — Conservation d'état pendant la navigation

| Champ | Constat |
| --- | --- |
| ID | **P0-NAV-01** |
| Exigence | Préserver l'état utile d'un moteur : brouillon, filtres, recherche, onglet, sous-route et position de défilement, sous réserve des règles de session et de sécurité. |
| Fichiers / composants | `src/components/app/AppShell.tsx`, `src/components/app/BottomNav.tsx`, routes TanStack, écrans Flash/Scan/Radar/En direct. |
| main | `AppShell` enveloppe le contenu avec `<div key={pathname}>`, ce qui remonte l'arbre de route lorsque le pathname change. |
| Branche | `src/components/app/AppShell.tsx` ne force plus le remount par `key={pathname}` ; le menu global reste fermé après navigation. |
| Preuve | Test de contrat ajouté dans `tests/app-shell-navigation-contract.test.ts`. Quality, Réel Validation et Dependency Review ont tous réussi sur le commit `c9fa44258c38be6301dc9d2d1cde6bc088e9d844`. Les essais réels de conservation du brouillon, des filtres et du scroll restent à réaliser. |
| Plateforme | Toutes. |
| Gravité | **Bloquante** pour un travail non sauvegardé ; majeure pour filtres et position perdus. |
| Acceptation | Depuis chaque moteur, modifier un filtre et une position ; changer de destination ; revenir par barre, retour système et historique navigateur ; vérifier restauration exacte et absence de doublons d'historique. |
| Correction proposée | Définir une stratégie de persistance par moteur (URL, état route, stockage local ou état mémoire conservé). Ne pas simplement supprimer la clé de remount sans vérifier les contraintes de session et d'isolation. |

### P0.4 — Mise à jour du Service Worker sans perte de travail

| Champ | Constat |
| --- | --- |
| ID | **P0-PWA-UPDATE-01** |
| Exigence | Une mise à jour ne doit pas forcer un rechargement tant que le travail local ou une mutation est en cours, ni interrompre une sauvegarde/synchronisation. |
| Fichiers / composants | `src/platform/pwa/update.ts`, `src/components/experience/UpdateBanner.tsx`, `src/platform/internationalization/messages.ts`, `tests/pwa.test.ts`, `public/sw.js`. |
| main | Le hook propose une action explicite et envoie `SKIP_WAITING`; un rechargement de secours est déclenché après 3 secondes si `controllerchange` n'arrive pas. |
| Branche | Le rechargement de secours a été supprimé. La page ne se recharge que si l'événement `controllerchange` confirme la prise de contrôle. Un timeout de 10 secondes ou une erreur de `postMessage` rétablit l'action et affiche une possibilité de réessayer. Le Service Worker conserve son protocole `SKIP_WAITING` / `clients.claim()` ; aucun changement de `public/sw.js` n'a été nécessaire pour cette correction. |
| Preuve | Trois tests ajoutés dans `tests/pwa.test.ts` : prise de contrôle confirmée, timeout sans succès et échec de `postMessage`, plus test de la règle idle/outbox vide. `UpdateBanner.tsx` relit `countPending()` immédiatement avant activation. Tests CI et essais appareils réels encore requis sur le HEAD courant. |
| Plateforme | PWA Android/iOS et navigateurs desktop avec Service Worker. |
| Gravité | **Bloquante tant que la coordination avec le travail non sauvegardé n'est pas démontrée**. |
| Acceptation | Déclencher une nouvelle version pendant un brouillon en cours, une mutation outbox et une synchronisation active ; vérifier que l'interface empêche ou diffère la prise de contrôle tant que la sauvegarde n'est pas confirmée. Tester aussi le timeout, l'échec du worker et la reprise utilisateur. |
| Correction appliquée / limite restante | Le rechargement temporisé non conditionnel est supprimé et les échecs sont récupérables. Cette correction évite le rechargement aveugle après 3 secondes, mais elle ne prouve pas encore que le travail métier est sauvegardé avant un clic volontaire sur « Recharger maintenant ». Il reste à relier le parcours d'update aux états dirty, outbox et synchronisation, ou à fournir une confirmation de sauvegarde fiable avant `SKIP_WAITING`. |

### P0.5 — Cache de navigation et route offline

| Champ | Constat |
| --- | --- |
| ID | **P0-PWA-OFFLINE-01** |
| Exigence | Les routes connues doivent être restaurées hors ligne ; les routes inconnues ne doivent pas être présentées silencieusement comme si la destination demandée était Home. Les API et Server Functions ne doivent pas être mises en cache par la règle de navigation. |
| Fichiers / composants | `public/sw.js`, `public/offline.html`, `tests/mobile-viewport-contract.test.ts`. |
| main | Service Worker réseau d'abord pour les navigations ; routes non répertoriées normalisées vers `/` via `navigationKey()`. Les API et `/_serverFn/` sont explicitement exclues. |
| Branche | `navigationKey()` renvoie maintenant `null` pour toute route non répertoriée. Seules les routes connues sont écrites dans le cache shell ; en cas de panne réseau, une route connue tente sa copie exacte, tandis qu’une route inconnue reçoit `/offline.html` au lieu de Home. Les exclusions `/api/` et `/_serverFn/` sont conservées. |
| Preuve | `tests/mobile-viewport-contract.test.ts` vérifie le mapping exact, l’absence de fallback Home, la mise en cache conditionnée à une route connue et les exclusions API/Server Functions. Pas encore de test navigateur avec réseau réellement coupé. |
| Plateforme | PWA installée et navigateur contrôlé par SW. |
| Gravité | **Majeure**, bloquante si une action semble aboutie alors qu'elle ne l'est pas. |
| Acceptation | Mettre en cache une route connue ; charger chaque route connue en mode avion ; charger une route inconnue ; vérifier que la page indique clairement l'indisponibilité au lieu de substituer Home ; vérifier qu'aucune réponse API/Server Function n'est servie depuis le cache de navigation. |
| Correction appliquée / limite restante | Clé exacte et fallback offline explicite appliqués. Reste à tester le fetch handler dans un navigateur avec caches simulés et à réaliser un E2E réseau coupé/rétabli sur PWA installée. |

### P0.6 — Création offline, outbox et reprise de synchronisation

| Champ | Constat |
| --- | --- |
| ID | **P0-SYNC-01** |
| Exigence | Une mutation autorisée hors ligne doit être persistée localement, rester en attente sans faux succès distant, puis être envoyée et confirmée après reconnexion. |
| Fichiers / composants | `src/platform/device/useNetworkStatus.ts`, `src/components/app/SyncEngineLoader.tsx`, `src/domains/*`, packages `core-sync` / stockage Dexie, `tests/sync/engine.test.ts`, `tests/offline/*`. |
| main | Moteur de synchronisation, outbox et diagnostics présents ; le moteur évite le transport lorsque `isOnline() === false`. |
| Branche | Même socle que main ; PR #96 ne modifie pas le protocole de synchronisation. |
| Preuve | `tests/sync/engine.test.ts` couvre push avant pull, absence de transport offline et limite de pagination ; tests offline vérifient les diagnostics. Ils ne prouvent pas le parcours complet dans un navigateur installé. |
| Plateforme | Web/PWA, stockage local navigateur ; Android/iOS selon quotas et cycle de vie navigateur. |
| Gravité | **Bloquante** pour perte ou fausse confirmation ; majeure pour une reprise qui ne se déclenche pas. |
| Acceptation | En mode avion, créer une mutation autorisée ; vérifier son stockage Dexie et son état « en attente » ; fermer/réouvrir ; rétablir le réseau ; vérifier push, pull, confirmation, retrait de l'outbox et absence de doublon. Tester perte réseau pendant push et pull. |
| Correction proposée | Ajouter un E2E réel réseau coupé/rétabli et instrumenter les transitions d'état sans exposer de données privées. Définir les déclencheurs de reprise foreground, online, visibilité et reprise d'application. |

### P0.7 — Conflits, mutations rejetées et récupération

| Champ | Constat |
| --- | --- |
| ID | **P0-SYNC-02** |
| Exigence | Les conflits et refus définitifs doivent être distingués des erreurs réessayables ; les mutations mises en quarantaine doivent être visibles et récupérables selon les règles métier. |
| Fichiers / composants | `packages/*core-sync*`, `src/platform/offline/*`, `tests/sync/merge.test.ts`, `tests/sync/engine.test.ts`, `tests/offline/diagnostics.test.ts`. |
| main | Fusion sélective basée sur timestamps/outbox et quarantaine existent selon la documentation d'architecture. Ce n'est pas un CRDT ni une résolution métier universelle. |
| Branche | Identique à main sur le protocole. |
| Preuve | Tests unitaires de fusion, ordre push/pull et diagnostics ; aucune preuve de récupération utilisateur bout en bout. Le document d'architecture signale également que la table `sync_mutation_receipts` n'apparaît pas dans la chaîne standard de migrations inventoriée. |
| Plateforme | Toutes les plateformes avec stockage local. |
| Gravité | **Bloquante** pour mutation perdue, doublonnée ou silencieusement rejetée. |
| Acceptation | Simuler conflit concurrent, refus permission/validation, erreur serveur réessayable, épuisement des tentatives et quarantaine ; vérifier message utilisateur, données conservées, action de récupération et idempotence côté base déployée. |
| Correction proposée | Vérifier la table de reçus, grants, RLS et migrations standard avant d'affirmer l'idempotence en production ; ajouter un parcours opérable de consultation/récupération des mutations en quarantaine. |

### P0.8 — Distinguer temps réel et synchronisation périodique

| Champ | Constat |
| --- | --- |
| ID | **P0-REALTIME-01** |
| Exigence | Ne pas présenter une mise à jour locale ou un pull périodique comme présence ou événement instantané multi-appareils. |
| Fichiers / composants | `src/lib/platform/realtime.ts`, `src/domains/presence/services/*`, `src/domains/presence/model/*`, `docs/02-architecture/synchronization-offline-realtime.md`. |
| main | La documentation d'architecture décrit le bus commun comme un mock mémoire local ; la publication DB Realtime ne prouve pas que le client y est abonné. |
| Branche | Même architecture que main ; aucun changement de transport temps réel dans PR #96. |
| Preuve | Documentation d'architecture et code source à revalider avant toute promesse d'instantanéité. |
| Plateforme | Toutes ; particulièrement En direct et Radar. |
| Gravité | **Bloquante** en cas de fausse présence, fausse disponibilité ou faux bip. |
| Acceptation | Deux appareils distincts, deux comptes de test, événements autorisés, perte/reprise réseau, désabonnement, changement de compte et fermeture écran ; vérifier latence et absence de présence fantôme. |
| Correction proposée | Tant qu'un transport distant n'est pas réellement connecté et autorisé, libeller les états comme locaux ou synchronisés, jamais temps réel. Décider séparément du transport, de la sécurité des canaux et de la reprise. |

---

## 4. P1 — Conventions natives et accessibilité

### P1.1 — Retour Android, iOS et historique Web

| Champ | Constat |
| --- | --- |
| ID | **P1-NAV-BACK-01** |
| Exigence | Le retour ferme d'abord les dialogues/panneaux ouverts, puis remonte dans la pile ; préserver le geste iOS depuis le bord et l'historique précédent/suivant du navigateur. |
| Fichiers / composants | `src/components/app/AppShell.tsx`, `MenuSheet.tsx`, dialogues Radix, TanStack Router, routes. |
| main | Router et états de menus présents ; aucun gestionnaire global démontrant une pile de retour système dédiée n'a été identifié dans les points d'entrée consultés. |
| Branche | Identique à main sur le shell et la navigation. |
| Preuve | Tests d'interaction mesurent les transitions ; aucune preuve appareil Android/iOS fournie. |
| Plateforme | Android (geste et trois boutons), iOS/iPadOS (geste bord), Web/PWA (précédent/suivant). |
| Gravité | **Majeure**. |
| Acceptation | Ouvrir menu, dialogue et sous-route ; tester retour système dans chaque état ; vérifier fermeture du niveau supérieur avant navigation ; tester URL directe, refresh, back/forward et liens partagés. |
| Correction proposée | Définir un contrat de pile navigation/overlays, puis ajouter des tests navigateur et appareils physiques. Ne pas intercepter le geste de bord iOS par un swipe horizontal applicatif concurrent. |

### P1.2 — Safe areas, edge-to-edge et barres système

| Champ | Constat |
| --- | --- |
| ID | **P1-VIEWPORT-01** |
| Exigence | Les commandes essentielles restent hors encoche, barre système, indicateur Home et zones de gestes ; le contenu peut s'étendre edge-to-edge sans masquer les contrôles. |
| Fichiers / composants | `src/routes/__root.tsx`, `src/styles.css`, `src/components/app/BottomNav.tsx`, `src/domains/presence/ui/reel-proximity.css`. |
| main | `viewport-fit=cover`, variables safe-area et unités viewport dynamiques présentes. |
| Branche | Même implémentation. |
| Preuve | `tests/mobile-viewport-contract.test.ts` vérifie les déclarations CSS et le contrat statique ; mesure appareil non fournie. |
| Plateforme | Android edge-to-edge, iPhone avec encoche/Dynamic Island, iPad. |
| Gravité | **Majeure**. |
| Acceptation | Tester iPhone avec indicateur Home et encoche, Android gestuel et trois boutons, orientation paysage, barre basse, sheets, clavier et scroll final ; aucune cible ni texte ne doit être masqué. |
| Correction proposée | Mesurer les insets en contexte installé et navigateur ; documenter les exceptions par écran et compléter les E2E avec captures/mesures. |

### P1.3 — Clavier virtuel et formulaires

| Champ | Constat |
| --- | --- |
| ID | **P1-KEYBOARD-01** |
| Exigence | À l'ouverture du clavier, le champ actif, ses erreurs et l'action principale restent visibles ; le scroll et la fermeture du clavier ne doivent pas perdre la saisie. |
| Fichiers / composants | `src/styles.css`, formulaires Flash/Scan/Radar, dialogues et sheets, `src/components/app/FormField.tsx`. |
| main | Unités `dvh` et safe areas présentes ; comportement clavier par formulaire non certifié. |
| Branche | Aucun changement global de gestion clavier dans la PR. |
| Preuve | Contrat viewport statique uniquement ; pas de parcours clavier iOS/Android fourni. |
| Plateforme | Android Chrome/WebView, iOS Safari/PWA installée, clavier physique tablette. |
| Gravité | **Majeure**. |
| Acceptation | Ouvrir chaque formulaire principal ; focus champ bas d'écran ; afficher clavier, suggestions, erreurs et bouton submit ; changer de champ, fermer clavier, naviguer et revenir ; aucune saisie perdue ni contrôle masqué. |
| Correction proposée | Tester les visualViewport et scrollIntoView uniquement si nécessaire ; établir une stratégie commune de formulaire/sheet et éviter les hauteurs fixes. |

### P1.4 — Orientation et adaptation du manifeste

| Champ | Constat |
| --- | --- |
| ID | **P1-ORIENTATION-01** |
| Exigence | L'interface doit supporter les orientations utiles et ne verrouiller portrait que sur justification produit explicite. |
| Fichiers / composants | `public/manifest.webmanifest`, `src/lib/platform/useResponsive.ts`, `src/platform/device/useDevice.ts`, CSS. |
| main | Le manifeste déclare `orientation: portrait`. Le hook device mesure largeur/hauteur et orientation. |
| Branche | Identique à main. |
| Preuve | Tests de viewport statiques ; aucun essai paysage tablette/téléphone fourni. |
| Plateforme | PWA Android et navigateurs ; iOS selon comportement du navigateur et de l'écran. |
| Gravité | **Majeure** pour tablette ; modérée pour téléphone si le verrouillage est intentionnel. |
| Acceptation | Vérifier rotation téléphone, tablette portrait/paysage, split view et fenêtre redimensionnée ; aucun contenu essentiel coupé ; confirmer si le verrouillage manifeste est conservé ou retiré. |
| Correction proposée | Décider le besoin produit avant modification du manifeste ; tester les layouts dans les deux orientations et ne pas confondre détection d'orientation et capacité à la verrouiller. |

### P1.5 — Dimensions des cibles tactiles et WCAG

| Champ | Constat |
| --- | --- |
| ID | **P1-TARGET-01** |
| Exigence | Cibles principales ≥48×48 dp Android et ≥44×44 pt iOS ; WCAG 2.2 SC 2.5.8 évalué séparément en CSS px et avec ses exceptions. |
| Fichiers / composants | `src/components/app/BottomNav.tsx`, `src/domains/presence/ui/ReelBottomNav.tsx`, boutons partagés et CSS. |
| main | Plusieurs contrôles utilisent `min-h-12 min-w-12` ; cela ne prouve pas 48 dp ou 44 pt sur appareil. |
| Branche | Identique à main pour la navigation. |
| Preuve | Contrat documentaire et classes CSS ; aucune mesure effective de toutes les zones cliquables. |
| Plateforme | Android, iOS, Web WCAG. |
| Gravité | **Majeure**. |
| Acceptation | Mesurer le rectangle interactif complet, l'espacement et les exceptions WCAG ; tester au doigt sur appareils réels et vérifier absence de chevauchement. |
| Correction proposée | Ajouter une procédure de mesure automatisée des bounding boxes CSS et une fiche de mesures dp/pt sur appareils physiques. |

### P1.6 — Accessibilité clavier, focus et sémantique

| Champ | Constat |
| --- | --- |
| ID | **P1-A11Y-01** |
| Exigence | Tous les parcours essentiels doivent être utilisables au clavier ; ordre de focus logique ; dialogues piègent puis restituent le focus ; liens et boutons ont rôles et noms adaptés. |
| Fichiers / composants | `src/components/app/*`, `src/components/experience/*`, composants Radix, routes principales. |
| main | Des noms accessibles, états ARIA et focus visibles sont présents sur plusieurs contrôles. |
| Branche | PR améliore notamment focus/ancres sur plusieurs écrans, mais n'établit pas une couverture globale. |
| Preuve | Vérification du code et tests ciblés ; audit complet clavier non fourni. |
| Plateforme | Web, Android avec clavier externe, iPad avec clavier externe. |
| Gravité | **Majeure**. |
| Acceptation | Parcours complet Home → quatre moteurs → menu → profil → formulaires, clavier seul ; focus visible et logique ; aucun piège ; retour au déclencheur après fermeture. |
| Correction proposée | Audit par parcours avec checklist WCAG 2.2 AA ; ajouter tests de focus et de dialogue ; corriger les composants communs avant les pages individuelles. |

### P1.7 — VoiceOver et TalkBack

| Champ | Constat |
| --- | --- |
| ID | **P1-A11Y-SR-01** |
| Exigence | Le contenu, la navigation, les états de chargement, erreurs, succès, offline et sélection doivent être annoncés correctement par les lecteurs d'écran. |
| Fichiers / composants | Navigation, composants d'état, Flash, Scan, En direct, Radar, i18n. |
| main | Des labels ARIA et sémantique existent ; la qualité des annonces dynamiques n'est pas prouvée. |
| Branche | Quelques améliorations d'accessibilité de composants ; aucun audit lecteur d'écran ajouté dans la PR. |
| Preuve | Aucun enregistrement de session VoiceOver/TalkBack ou rapport d'audit fourni. |
| Plateforme | iOS VoiceOver, Android TalkBack. |
| Gravité | **Majeure**. |
| Acceptation | Réaliser les parcours principaux avec VoiceOver et TalkBack ; contrôler ordre, intitulés, rôles, annonces de changements, zones masquées et actions modales. |
| Correction proposée | Créer des scripts d'essai reproductibles par OS et joindre les preuves à la PR ; ne pas conclure sur la seule présence d'attributs ARIA. |

### P1.8 — Contraste, zoom, reflow et texte agrandi

| Champ | Constat |
| --- | --- |
| ID | **P1-A11Y-VISUAL-01** |
| Exigence | Contraste suffisant dans les thèmes et surfaces, zoom texte sans troncature, reflow sans perte fonctionnelle, états non distingués par la seule couleur. |
| Fichiers / composants | `src/styles.css`, tokens design, composants glass et pages moteurs. |
| main | Tokens sémantiques et thèmes existent ; les surfaces composites ne sont pas certifiées par mesures. |
| Branche | Plusieurs surfaces et cartes sont modifiées visuellement ; elles doivent être remesurées, pas présumées conformes. |
| Preuve | Aucune feuille de mesure contraste/zoom complète fournie. |
| Plateforme | Web, Android, iOS. |
| Gravité | **Majeure**. |
| Acceptation | Mesurer contrastes texte/icône/bordure/état dans thèmes clair et sombre ; zoom texte 200 % et 400 % ; largeur 320 CSS px ; vérifier formulaires et navigation. |
| Correction proposée | Ajouter un rapport de contraste des tokens et une campagne de reflow ; revoir les transparences si le fond réduit le contraste. |

### P1.9 — Installation et relance Android

| Champ | Constat |
| --- | --- |
| ID | **P1-PWA-ANDROID-01** |
| Exigence | Installer depuis un navigateur compatible, lancer depuis l'icône, reconnaître le mode standalone, reprendre l'état et gérer les mises à jour. |
| Fichiers / composants | `public/manifest.webmanifest`, `public/sw.js`, `src/platform/pwa/install.ts`, `UpdateBanner.tsx`. |
| main | Manifeste standalone, icônes, shortcuts, enregistrement SW en production et gestion événementielle `beforeinstallprompt`. |
| Branche | Identique à main. |
| Preuve | Tests unitaires d'instructions et contrat de manifeste ; aucune installation réelle documentée. |
| Plateforme | Android Chrome et navigateurs Android compatibles. |
| Gravité | **Majeure**. |
| Acceptation | Installer sur au moins un Android réel pris en charge ; vérifier icône, nom, URL, mode autonome, retour, réseau coupé, relance et mise à jour. |
| Correction proposée | Tenir une matrice navigateur/version et joindre capture/vidéo, console et résultat de chaque scénario. |

### P1.10 — Installation et relance iOS/iPadOS

| Champ | Constat |
| --- | --- |
| ID | **P1-PWA-IOS-01** |
| Exigence | Ajouter à l'écran d'accueil via le parcours iOS supporté, démarrer en mode autonome lorsque disponible, préserver l'état et communiquer les limites. |
| Fichiers / composants | `src/platform/pwa/install.ts`, `src/platform/device/capabilities.ts`, `src/routes/__root.tsx`, manifeste et métadonnées Apple. |
| main | Instructions manuelles iOS si contexte sécurisé ; détection `navigator.standalone` et métadonnées Apple. |
| Branche | Identique à main. |
| Preuve | Test unitaire des instructions manuelles et du flag standalone ; aucun essai iPhone/iPad réel fourni. |
| Plateforme | iOS Safari / PWA ajoutée à l'écran d'accueil, iPadOS. |
| Gravité | **Majeure**. |
| Acceptation | Ajouter à l'écran d'accueil sur iPhone et iPad ; lancer via icône ; vérifier chrome, safe areas, état, permissions, reprise et limites de notifications/installation. |
| Correction proposée | Documenter les différences iOS par version et ne pas afficher un prompt Android inexistant sur iOS ; joindre preuve appareil réel. |

---

## 5. P2 — Adaptation, performance et fluidité

### P2.1 — Navigation tablette et espace large

| Champ | Constat |
| --- | --- |
| ID | **P2-ADAPT-01** |
| Exigence | Adapter la navigation et la densité à l'espace réellement disponible ; envisager rail ou navigation latérale sur tablette ; éviter l'étirement d'une interface téléphone. |
| Fichiers / composants | `src/lib/platform/useResponsive.ts`, `src/platform/device/useResponsive.ts`, `AppShell.tsx`, navigation et layouts des moteurs. |
| main | Classes responsive et classes device existent ; AppShell utilise un conteneur principal `max-w-screen-md` et une navigation inférieure. |
| Branche | Même architecture de shell ; les changements PR ciblent la présentation, pas une navigation tablette. |
| Preuve | Tests viewport de contrat et smoke de route ; aucune preuve d'un rail/tablette ou d'un pliable. |
| Plateforme | Tablette Android/iPadOS, desktop, fenêtres redimensionnées et pliables. |
| Gravité | **Majeure**. |
| Acceptation | Tester 768×1024, 1024×768, 1280 px+, split-screen et resize continu ; décider navigation rail/latérale et nombre de colonnes ; aucune fonction ne doit être perdue. |
| Correction proposée | Concevoir les layouts selon largeur disponible et classes de fenêtre ; séparer breakpoint visuel et identité matérielle. |

### P2.2 — Deux navigations inférieures cohérentes

| Champ | Constat |
| --- | --- |
| ID | **P2-NAV-DUP-01** |
| Exigence | Un seul contrat de navigation principale, même ordre, même état actif, mêmes labels, cibles, interactions et accès au menu sur toutes les routes. |
| Fichiers / composants | `src/components/app/BottomNav.tsx`, `src/domains/presence/ui/ReelBottomNav.tsx`, `src/components/app/reel-bottom-nav.css`, `src/domains/presence/ui/reel-bottom-nav.css`, `AppShell.tsx`. |
| main | Deux composants distincts ; AppShell masque BottomNav sur /reel et monte ReelBottomNav séparément. |
| Branche | Identique à main. |
| Preuve | Code vérifié ; aucun test comparatif de parité des deux barres n'a été identifié. |
| Plateforme | Toutes. |
| Gravité | **Majeure** pour incohérence de navigation et d'accessibilité. |
| Acceptation | Comparer ordre, labels, aria-current, ouverture menu, focus, taille, safe area et état pressé sur /flash, /scan, /reel, /radar ; tester sous-routes. |
| Correction proposée | Extraire une configuration et un composant communs ; conserver une variante de présentation uniquement si justifiée et testée. |

### P2.3 — Redimensionnement et orientation en continu

| Champ | Constat |
| --- | --- |
| ID | **P2-RESIZE-01** |
| Exigence | Recomposer l'interface lors d'un changement de taille, rotation, multi-fenêtre ou clavier sans état incohérent. |
| Fichiers / composants | `useDevice.ts`, `useResponsive.ts`, `src/styles.css`, layouts des moteurs. |
| main | Les hooks suivent resize, orientation, pointeur et reduced-motion ; classes CSS adaptatives. |
| Branche | Identique à main. |
| Preuve | Tests de compatibilité media query et contrats statiques ; aucune séquence de resize réel documentée. |
| Plateforme | Tablette, desktop, pliables et fenêtres Android/iPadOS. |
| Gravité | **Modérée à majeure** selon contenu masqué. |
| Acceptation | Redimensionner lentement, tourner, ouvrir/fermer clavier, passer split-view ; vérifier scroll, menus, position active et aucune superposition. |
| Correction proposée | Ajouter tests E2E multi-viewports et scénarios de rotation ; recalculer uniquement les états dépendants et éviter les dimensions figées. |

### P2.4 — Performance sur appareils modestes

| Champ | Constat |
| --- | --- |
| ID | **P2-PERF-01** |
| Exigence | Mesurer LCP, INP, CLS et navigation sur appareils modestes, réseau défini et routes essentielles ; conserver p75 de terrain lorsque possible. |
| Fichiers / composants | `src/lib/performance/web-vitals.ts`, `interaction-navigation.ts`, `performance-policy.ts`, `scripts/check-performance-budgets.ts`, `docs/06-operations/performance-pwa.md`. |
| main | Instrumentation et budgets build existent. Le collecteur conserve les dernières observations en mémoire ; il ne constitue pas une agrégation p75 de production. |
| Branche | Même couche de performance que main ; modifications visuelles des pages peuvent modifier le coût rendu. |
| Preuve | Tests et budgets de build déclarés ; le pipeline Quality actuel s'arrête avant les étapes build/release. Aucun rapport p75 terrain fourni. |
| Plateforme | Android entrée de gamme, iPhone supporté, Web desktop. |
| Gravité | **Majeure** si budgets critiques dépassés ; sinon modérée. |
| Acceptation | Appareil et navigateur identifiés ; réseau et CPU documentés ; mesurer cold/warm start, LCP/INP/CLS, navigation et scroll sur Home/Flash/Scan/En direct/Radar ; comparer p75 sur fenêtre définie. |
| Correction proposée | Séparer budget de build, mesures laboratoire et données terrain ; établir baseline et seuils par classe d'appareil avant d'ajouter effets et blur. |

### P2.5 — Haptique et repli plateforme

| Champ | Constat |
| --- | --- |
| ID | **P2-HAPTIC-01** |
| Exigence | Le retour haptique est facultatif, déclenché par action utilisateur réelle, non bloquant et compatible avec les capacités de l'appareil ; ne jamais supposer la parité Android/iOS. |
| Fichiers / composants | `src/platform/device/haptics.ts`, navigation, boutons et contrôles. |
| main | Implémentation basée uniquement sur `navigator.vibrate()`, avec repli silencieux si API absente. |
| Branche | Identique à main. |
| Preuve | Code ; pas de test haptique physique ni de matrice navigateur/appareil fournie. |
| Plateforme | Android navigateur compatible ; iOS PWA généralement sans garantie de Vibration API ; autres plateformes en repli. |
| Gravité | **Modérée**. |
| Acceptation | Tester appareil supporté et non supporté ; confirmer absence de vibration sur capacité absente sans erreur ni perte de feedback visuel/sonore ; vérifier préférences système et répétition raisonnable. |
| Correction proposée | Modéliser la capacité haptique comme facultative ; maintenir un retour visuel accessible ; ne pas afficher de promesse haptique sur iOS sans API native validée. |

### P2.6 — Réduction du mouvement et animations de feedback

| Champ | Constat |
| --- | --- |
| ID | **P2-MOTION-01** |
| Exigence | Toutes les animations CSS et Framer Motion doivent respecter `prefers-reduced-motion`; l'action reste compréhensible sans mouvement. |
| Fichiers / composants | `src/lib/design/motion.ts`, `useReducedMotion.ts`, `src/styles.css`, `FloatingButton`, composants des moteurs. |
| main | Préférence détectée par useDevice et utilisée dans plusieurs composants ; charte signale un point d'audit sur `FloatingButton` et `whileTap`. |
| Branche | Plusieurs composants modifiés réduisent/suppriment les animations ; couverture globale non démontrée. |
| Preuve | Tests media query et revue de code ciblée ; aucun audit exhaustif animation par animation. |
| Plateforme | Web, Android, iOS. |
| Gravité | **Majeure** pour accessibilité, modérée ailleurs. |
| Acceptation | Activer réduction du mouvement OS avant lancement ; parcourir tous les moteurs et dialogs ; vérifier absence de mouvement non essentiel, aucun clignotement et feedback d'état toujours visible. |
| Correction proposée | Centraliser les variants réduits et auditer CSS, Framer Motion et animations de tap ; ajouter test de non-régression par composant partagé. |

### P2.7 — Scroll, listes et navigation vers le contenu

| Champ | Constat |
| --- | --- |
| ID | **P2-SCROLL-01** |
| Exigence | Défilement fluide, restauration de position, ancrages non masqués par le chrome fixe, pas de scroll horizontal involontaire ni de rebond bloqué. |
| Fichiers / composants | `src/styles.css`, `AppShell.tsx`, CSS de navigation, pages moteurs et tests mobile scroll. |
| main | Tests de scroll bas de page ciblent Flash et Scan ; scroll des autres routes et restauration globale non démontrés. |
| Branche | PR ajoute des ancres guide/exemple sur les quatre moteurs ; cela améliore l'accès mais ne prouve pas le scroll global. |
| Preuve | `tests/mobile-e2e-contract.test.ts` et script de scroll ciblé ; couverture partielle. |
| Plateforme | Téléphone et tablette. |
| Gravité | **Modérée**. |
| Acceptation | Parcourir chaque page, atteindre dernier élément, utiliser ancre, revenir, ouvrir clavier et naviguer ; aucun élément masqué par barre fixe ni scroll horizontal parasite. |
| Correction proposée | Étendre le test de scroll aux quatre moteurs, Home, menus et formulaires ; définir la restauration de scroll par destination. |

---

## 6. P3 — Finition de l'expérience

### P3.1 — Harmonisation visuelle sans sacrifier lisibilité et performance

| Champ | Constat |
| --- | --- |
| ID | **P3-VISUAL-01** |
| Exigence | Harmoniser surfaces, rayons, typographie, densité, accents des moteurs et états, sans faire passer le glass pour une capacité native. |
| Fichiers / composants | `src/styles.css`, tokens, `HomeFoundation.tsx`, `HomeEngineCard.tsx`, `PersonalDashboard.tsx`, pages moteurs. |
| main | Système de design existant ; langage Warm Editorial Glass moins appliqué. |
| Branche | Plusieurs composants Home, profil, paramètres et moteurs adoptent les surfaces glass et rayons harmonisés. |
| Preuve | Diff visuel de la PR ; pas de validation appareil ni mesures de contraste/performance finale. |
| Plateforme | Toutes tailles, thèmes clair/sombre. |
| Gravité | **Mineure à modérée** ; devient majeure si contraste ou performance régressent. |
| Acceptation | Comparer tous les écrans et états ; mesurer contraste, scroll, rendu et lisibilité sur 320 px, téléphone standard et tablette ; vérifier FR/EN. |
| Correction proposée | Poursuivre l'harmonisation après P0/P1 ; privilégier tokens sémantiques et surfaces sobres, limiter blur et grands overlays. |

### P3.2 — États pressés, sélection et réponse immédiate

| Champ | Constat |
| --- | --- |
| ID | **P3-PRESS-01** |
| Exigence | Chaque contrôle fournit un retour immédiat, visible et cohérent ; états pressé/actif/désactivé/chargement ne reposent pas uniquement sur la couleur. |
| Fichiers / composants | `BottomNav.tsx`, `ReelBottomNav.tsx`, composants partagés, CSS `.native-press`. |
| main | Classes press et haptique appelées sur navigation ; parité des états entre deux barres non démontrée. |
| Branche | Changements de présentation sans consolidation de tous les contrôles interactifs. |
| Preuve | Code ; aucune matrice de tests interaction complète. |
| Plateforme | Tactile, souris, clavier et lecteur d'écran. |
| Gravité | **Modérée**. |
| Acceptation | Vérifier pression tactile, focus clavier, disabled, loading, succès/erreur sur chaque type de contrôle ; aucune action ne doit dépendre d'une animation. |
| Correction proposée | Créer des variants de contrôle partagés et tester états visuels, ARIA et reduced-motion. |

### P3.3 — Transitions cohérentes et véridiques

| Champ | Constat |
| --- | --- |
| ID | **P3-MOTION-02** |
| Exigence | Les transitions expriment un changement réel d'état, restent rapides, ne bloquent aucune action et ne simulent jamais publication, présence, détection ou synchronisation. |
| Fichiers / composants | `src/lib/design/motion.ts`, animations partagées, Flash, Scan, En direct, Radar. |
| main | Charte de mouvement définit les durées, la vérité produit et les règles de réduction ; application exhaustive non prouvée. |
| Branche | Quelques pages et cartes adoptent des transitions réduites ; couverture par domaine à mesurer. |
| Preuve | Charte et revue de composants ; aucun rapport complet de tests visuels. |
| Plateforme | Toutes. |
| Gravité | **Majeure** si faux état ; modérée pour incohérence esthétique. |
| Acceptation | Vérifier chargement, erreur, succès, vide, offline et état inactif dans les quatre moteurs ; toute animation doit s'arrêter lorsque l'opération s'arrête ou échoue. |
| Correction proposée | Auditer les animations à partir des états domaine confirmés ; supprimer les animations décoratives sans information utile. |

### P3.4 — Finition propre à chaque plateforme

| Champ | Constat |
| --- | --- |
| ID | **P3-PLATFORM-01** |
| Exigence | Affiner les comportements spécifiques au navigateur/OS uniquement lorsque la capacité est vérifiée et qu'un bénéfice utilisateur est démontré. |
| Fichiers / composants | `src/platform/device/*`, `src/platform/pwa/*`, composants d'interaction et CSS. |
| main | Détection de capacités et replis présents ; pas d'enveloppe native dédiée identifiée dans l'arborescence examinée. |
| Branche | Même couche plateforme. |
| Preuve | Tests de détection ; pas de matrice de validation de toutes les capacités réelles. |
| Plateforme | Android, iOS/iPadOS, Web ; enveloppe native N/A actuellement. |
| Gravité | **Modérée**. |
| Acceptation | Pour chaque adaptation, consigner OS/version, navigateur, contexte standalone, capacité détectée, résultat et repli ; tester au moins un appareil réel par plateforme ciblée. |
| Correction proposée | Ne pas introduire de code spécifique OS avant un test de capacité et une preuve d'utilité ; toute enveloppe native doit faire l'objet d'une décision architecture distincte. |

---

## 7. Plan d'essais manuels obligatoire

Les essais ci-dessous complètent les tests unitaires et E2E. Chaque ligne doit être accompagnée de la date, du SHA, du modèle appareil, version OS, navigateur/version, mode navigateur ou installé, réseau, étapes, résultat, capture ou vidéo et anomalies.

| ID essai | Profil | Parcours | Résultat attendu |
| --- | --- | --- | --- |
| DEV-01 | Android téléphone, navigation gestuelle | Home → Flash → retour → menu → fermer → retour | Retour ferme d'abord l'overlay puis remonte dans la navigation |
| DEV-02 | Android téléphone, trois boutons | mêmes parcours | Pas de double navigation ni sortie inattendue |
| DEV-03 | iPhone Safari | sous-route → geste depuis bord → panneau ouvert | Geste système conservé ; panneau géré explicitement |
| DEV-04 | iPhone PWA installée | lancer depuis icône, verrouiller, reprendre | état et destination utiles conservés |
| DEV-05 | Android PWA installée | installation, lancement, update disponible | standalone reconnu ; update ne perd pas le travail |
| DEV-06 | iPhone avec encoche | Home, navigation basse, sheet, formulaire | Aucun contrôle dans la zone système |
| DEV-07 | Android avec clavier virtuel | formulaire bas d'écran | champ, erreurs et CTA visibles ; saisie conservée |
| DEV-08 | iPad/tablette Android | portrait, paysage, split-view | layout et navigation adaptés à l'espace |
| DEV-09 | TalkBack | parcours principal complet | noms, rôles, états et changements annoncés |
| DEV-10 | VoiceOver | parcours principal complet | ordre, labels, annonces et focus cohérents |
| DEV-11 | Tous profils mobiles | texte agrandi/zoom et contraste | contenu lisible, sans perte fonctionnelle |
| DEV-12 | Téléphone Android modeste | Home et quatre moteurs | scroll, interactions et transitions restent réactifs |
| DEV-13 | PWA offline | création brouillon/mutation, fermer/réouvrir | données locales conservées et état offline honnête |
| DEV-14 | PWA online après offline | reconnexion, reprise sync | mutations acceptées une fois, conflits visibles, outbox nettoyée |
| DEV-15 | Update en cours de saisie | nouveau worker pendant brouillon | pas de rechargement avant sauvegarde confirmée |
| DEV-16 | Navigateur Web | URL directe, refresh, précédent/suivant | routes et historique cohérents |
| DEV-17 | Reduced motion | tous les moteurs et sheets | animations non essentielles supprimées, feedback conservé |
| DEV-18 | Capacité haptique absente | navigation et actions | aucune erreur, feedback visuel toujours disponible |

---

## 8. Conditions de clôture par priorité

### P0 — Gate de fiabilité

- [ ] Baseline lint/typecheck/tests/build sur main et branche avec même environnement.
- [ ] Toutes les erreurs introduites par la branche identifiées et corrigées ; aucune erreur masquée.
- [ ] Brouillons testés sur navigation, refresh, fermeture et reprise.
- [ ] Update Service Worker sans perte démontrée.
- [ ] Parcours offline → reprise → sync démontré sur navigateur réel.
- [ ] Conflits, mutations rejetées et quarantaine vérifiés.
- [ ] Aucune fausse présence ou fausse confirmation distante.

### P1 — Gate des conventions système

- [ ] Retour Android geste + trois boutons.
- [ ] Retour iOS depuis le bord.
- [ ] Historique Web précédent/suivant, URL directe et refresh.
- [ ] Safe areas, clavier, orientation et cibles mesurés.
- [ ] Clavier, VoiceOver, TalkBack, contraste, zoom et reflow vérifiés.
- [ ] Installation et relance PWA Android/iOS documentées.

### P2 — Gate d'adaptation

- [ ] Tablette portrait/paysage et fenêtres redimensionnées.
- [ ] Parité de navigation entre Home/moteurs et En direct.
- [ ] Mesures performance sur appareil modeste.
- [ ] Reduced motion et haptique facultative validés.

### P3 — Gate de finition

- [ ] Harmonisation visuelle après les gates précédents.
- [ ] États pressés, actifs, désactivés, chargement et erreurs cohérents.
- [ ] Transitions vraies, utiles et non bloquantes.
- [ ] Aucun recul de contraste, performance ou accessibilité.

---

## 9. Registre des limites et décisions ouvertes

1. **Baseline CI :** la baseline main est confirmée par Quality #45670065729 (0 erreur lint, 71 avertissements). Les 56 erreurs Prettier initiales de la branche ont été corrigées dans les fichiers concernés ; les contrôles complets sur `d243928...` sont verts. Cette clôture porte uniquement sur le SHA testé et ne constitue pas une certification sur appareils physiques.
2. **PWA ≠ application native :** aucune enveloppe native Capacitor ou projet Android/iOS dédié n'a été identifié dans l'arborescence auditée. Les APIs Web et les tests navigateur ne prouvent pas les fonctions natives.
3. **Installation :** un manifeste, des icônes et un service worker sont des prérequis, pas une preuve d'installation réussie sur un appareil.
4. **Performance :** les budgets du bundle et les observations Web Vitals en mémoire ne constituent pas une mesure p75 de production.
5. **Synchronisation :** les tests du moteur ne prouvent pas les migrations, permissions, transport distant et état de la base déployée.
6. **Temps réel :** la documentation d'architecture signale que le bus commun reste local/mock ; ne pas présenter ce mécanisme comme une présence multi-appareils instantanée.
7. **PR #96 :** les fichiers plateforme centraux sont identiques entre main et branche ; les changements actuels de PR sont principalement visuels et documentaires. Ils ne corrigent donc pas les écarts P0/P1 décrits ici.

## 10. Références de preuve

- Référentiel directeur : [native-experience-standard.md](../00-foundation/native-experience-standard.md)
- PWA : [pwa-platform-adaptation.md](../00-foundation/pwa-platform-adaptation.md)
- Navigation : [mobile-navigation-standards.md](../02-architecture/mobile-navigation-standards.md)
- Synchronisation : [synchronization-offline-realtime.md](../02-architecture/synchronization-offline-realtime.md)
- Mouvement : [micro-interactions-motion-charter-v1.md](../02-architecture/micro-interactions-motion-charter-v1.md)
- Performance : [performance-pwa.md](../06-operations/performance-pwa.md)
- Qualité : [QUALITY.md](../06-operations/QUALITY.md)
- Matrice navigation existante : [navigation-compliance-matrix.md](./navigation-compliance-matrix.md)
- CI branche — validation finale : [Quality #45819114220](https://github.com/dollarstam5/hello-world-project/actions/runs/45819114220), [Réel Validation #45819114283](https://github.com/dollarstam5/hello-world-project/actions/runs/45819114283), [Dependency Review #45819114203](https://github.com/dollarstam5/hello-world-project/actions/runs/45819114203)
- PR : [#96](https://github.com/dollarstam5/hello-world-project/pull/96)

---

**Règle de clôture :** une ligne ne passe à **CONFORME** que lorsque sa preuve est jointe, reproductible et limitée aux plateformes réellement testées. Une case vide ou un document qui décrit une intention ne constitue jamais une preuve.