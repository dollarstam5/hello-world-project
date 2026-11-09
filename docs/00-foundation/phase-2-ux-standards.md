# Phase 2 — Standards UX et accessibilité

**Statut :** en cours de consolidation  
**Périmètre :** fondations transversales V1 — mobile-first, responsive, accessibilité, préférences système et internationalisation.

Ce document fixe les règles vérifiables de la phase 2. Il ne certifie pas les écrans métier qui n'ont pas encore été audités et ne remplace pas les critères de validation automatisés ou manuels.

## 1. Principes transversaux

- Concevoir d'abord pour les petits écrans, puis enrichir progressivement tablette et desktop.
- Garder une navigation et des actions principales immédiatement compréhensibles, sans multiplier les choix simultanés.
- Respecter les préférences système, notamment la réduction des animations.
- Ne jamais dépendre uniquement de la couleur, d'une animation ou d'une icône pour transmettre une information ou une action.
- Préserver l'accès aux fonctions essentielles lorsque le réseau est lent ou indisponible.
- Toutes les chaînes visibles doivent passer par le catalogue i18n FR/EN ; aucun libellé d'interface ne doit être codé en dur dans un composant métier.
- Les états de lecture et les actions requises restent distincts dans le centre de communication.

## 2. Responsive et capacités de l'appareil

- Les seuils de mise en page proviennent des tokens de design ; ne pas recréer des breakpoints concurrents dans les composants.
- `useResponsive` agrège la classe d'appareil, la taille du viewport, l'orientation, le réseau et la réduction des effets.
- `useDevice` est la source commune pour les informations appareil/pointeur/préférence de mouvement.
- Les composants ne doivent pas implémenter leur propre détection d'appareil lorsqu'une fondation commune répond au besoin.
- Les adaptations de performance ne doivent pas supprimer une information ou une fonction essentielle.

## 3. Accessibilité et mouvement

- Les zones de navigation utilisent les éléments sémantiques de navigation et des liens/boutons natifs ; les rôles d'onglets sont réservés à de véritables interfaces à onglets.
- Les contrôles icon-only disposent d'un nom accessible.
- L'état courant d'une destination est exposé avec `aria-current="page"`.
- Les contrôles interactifs doivent conserver un focus clavier visible.
- Les animations décoratives respectent `prefers-reduced-motion` et ne doivent pas être nécessaires à la compréhension.
- Les feuilles et dialogues partagés neutralisent aussi leurs animations et transitions lorsque `prefers-reduced-motion` est actif.
- Les préférences de réduction du mouvement et de pointeur sont réévaluées lorsque les préférences système changent, sans exiger un redimensionnement de fenêtre.

## 4. Navigation et langue

- La navigation principale mobile présente exactement cinq icônes, dans cet ordre : Flash, Scan, Réel, Radar, 2x2.
- Réel occupe la position centrale et utilise une icône d’antenne ; son point d’entrée est `/reel`.
- Le centre 2x2 ouvre le menu ; il ne constitue pas une destination métier supplémentaire.
- L’accueil reste hors de la barre basse : l’icône/identité de l’application ouvre `/`, et le lancement depuis l’icône installée ouvre également l’accueil.
- Le changement FR/EN est accessible depuis l'en-tête principal et conserve la langue choisie via le mécanisme i18n existant.
- Le centre de communication conserve quatre espaces indépendants : Notifications, Assistant, Messages et Réel.
- Aucun compteur ne doit être simulé ; les indicateurs ne seront activés qu'une fois raccordés à des événements métier fiables.

## 5. Réseau et états d'interface

Les composants concernés doivent prévoir les états utiles suivants, selon le contexte : chargement, contenu, vide, erreur récupérable, hors ligne, synchronisation en attente et retour au réseau. L'état hors ligne ne doit pas laisser croire qu'une action a été envoyée au serveur si elle est seulement conservée localement. Le bandeau transversal reflète uniquement l'état du réseau et les états réellement émis par le worker de synchronisation ; il n'invente ni compteur ni confirmation.

## 6. Corrections déjà appliquées dans la branche Phase 2

- Navigation basse : remplacement de la sémantique de liste d'onglets par une région de navigation nommée ; conservation de `aria-current` sur la destination active.
- Internationalisation : ajout d'un nom accessible FR/EN pour la navigation principale.
- Internationalisation : test de non-régression `tests/i18n.test.ts` vérifiant la parité des clés FR/EN et l'absence de messages vides.
- Langue du document : l'attribut HTML `lang` suit la langue active après détection initiale et lors d'un changement FR/EN ; test de non-régression associé.
- Préférences appareil : écoute des changements de `prefers-reduced-motion` et `pointer: coarse` dans `useDevice`.
- Navigation mobile : cinq destinations dans l'ordre Flash, Scan, Réel (antenne centrale), Radar, 2x2 ; accueil hors barre basse et accessible par l'identité Vitalis et l'icône installée.
- En-tête : accès à l'accueil, bascule FR/EN, bascule clair/sombre, profil et centre de communication ; contrôles icon-only nommés et cibles tactiles minimales de 44 px.
- Réel : point d'entrée `/reel` disponible avec état d'attente explicite ; aucune fonctionnalité moteur n'est simulée avant la phase 3.
- Contrôles partagés : boutons, fermeture des feuilles/dialogues, onglets de communication et actions de reprise utilisent une cible tactile minimale de 44 px ; libellé de fermeture localisé FR/EN.
- Contraste des tokens clairs : bleu primaire et accents sémantiques ajustés en conservant leurs familles de teinte ; les paires de base texte/fond calculées dépassent 4,5:1. Les surfaces translucides et états composés restent à vérifier visuellement.
- Feuilles et dialogues : contenu défilant sur les petits écrans, avec gestion native du focus et fermeture clavier assurée par Radix.
- États réseau : le bandeau reflète les états réseau et synchronisation du worker ; aucun nombre ni succès n’est inventé.
- Premier lancement : fermer ou ignorer l’onboarding est mémorisé ; les trois repères présentent Réel, Flash/Scan et Radar/2x2.
- Les quatre espaces du centre de communication et leurs règles V1 sont spécifiés dans [Centre de communication V1](../01-product/communication-center-v1.md).
- Les vues globales 404 et erreur utilisent également les messages FR/EN et des actions de reprise d'au moins 44 px.

## 7. Vérifications encore requises avant clôture

- Mesurer les cibles tactiles réelles et les espacements sur petits écrans ; corriger les contrôles trop petits ou trop rapprochés.
- Parcours clavier complet, ordre de focus, focus des dialogues et retour du focus après fermeture.
- Contraste WCAG des textes, états, bordures et éléments interactifs sur les thèmes pris en charge.
- Vérification lecteur d'écran des principaux parcours FR et EN.
- Vérifier les états chargement/vide/erreur/hors ligne/récupération dans chaque moteur V1.
- Vérifier la cohérence des écrans invité/compte et la complétude des traductions.
- Relancer les contrôles qualité, tests, build et tests mobile/offline ; aucun de ces contrôles n'est déclaré réussi tant que la CI ne fournit pas de preuve.

## 8. Critère de clôture

La phase 2 ne peut être déclarée terminée qu'après revue des composants partagés et des parcours V1, corrections des anomalies bloquantes, preuves de tests automatisés et validation manuelle responsive/accessibilité. Les sujets non couverts restent explicitement ouverts ; ils ne sont pas réputés conformes par défaut.


## 9. Dialogue guidé et formulaires — périmètre par version

### Principe directeur

Vitalis évite autant que possible les formulaires classiques longs. L'expérience privilégiée consiste à guider l'utilisateur par de petites boîtes de dialogue, avec une question claire, des choix proposés et, lorsque nécessaire, un champ de réponse court.

**Important : ce dialogue guidé de V1 n'est pas un assistant conversationnel intelligent.** Il s'agit d'une interface déterministe, conçue à l'avance selon les parcours et les règles métier. L'intelligence conversationnelle adaptative évoquée pour les évolutions futures ne doit pas être introduite implicitement dans le périmètre V1.

### V1 — Boîtes de dialogue simples et interactives

- Présenter une question ou une consigne à la fois, dans une boîte de dialogue courte et contextualisée.
- Permettre à l'utilisateur de choisir une réponse parmi des options claires ou de saisir une réponse courte lorsque c'est nécessaire.
- Adapter les étapes selon les choix prévus par le parcours, sans prétendre comprendre librement une conversation.
- Éviter les longues séquences de champs et ne demander que les informations nécessaires à l'action en cours.
- Afficher un récapitulatif et demander confirmation lorsque l'action ou les données le nécessitent.
- Transmettre les réponses aux services concernés après validation des règles métier ; afficher le résultat réel de l'opération.
- Prévoir une reprise claire en cas d'interruption ou de perte de réseau, sans perdre silencieusement les réponses déjà saisies.

Les boîtes de dialogue V1 peuvent donc remplacer de nombreux formulaires, mais restent simples, prévisibles, rapides et peu coûteuses à maintenir.

### V2/V3 — Dialogue intelligent adaptatif

À partir d'une version ultérieure, Vitalis pourra évoluer vers un dialogue capable de comprendre des réponses formulées librement, d'adapter ses questions au contexte, de repérer les informations déjà données et de préparer automatiquement des données structurées. Les modalités vocales ou de type appel (« calling ») relèvent également de cette évolution et ne sont pas promises pour la V1.

Le fournisseur, l'architecture, les coûts, les quotas, les règles de confidentialité et les contrôles de cette intelligence devront faire l'objet d'une spécification et d'une validation distinctes avant développement.

### Formulaire classique : recours secondaire

Un formulaire classique peut être proposé dans une seconde étape ou dans un cas particulier, notamment :
- lorsqu'une exigence légale, réglementaire ou technique impose un format précis ;
- lorsqu'un ensemble de données structurées doit être consulté ou corrigé en une seule fois ;
- lorsqu'une donnée complexe nécessite un contrôle visuel précis ;
- lorsque le parcours par boîtes de dialogue ne convient pas ou que l'utilisateur choisit cette solution.

Dans ces situations, le formulaire doit rester court, segmenté en étapes compréhensibles, prérempli avec les informations déjà fournies lorsque cela est permis, et limité aux champs nécessaires.

### Séparation des responsabilités

- **Interface V1** : présente les boîtes de dialogue et recueille les choix ou réponses.
- **Logique de parcours** : détermine les étapes et embranchements prévus, sans intelligence conversationnelle autonome.
- **Validation métier** : vérifie les champs requis, les formats, les règles et les autorisations.
- **Services de données** : assurent l'identification, l'enregistrement et les mises à jour selon leurs contrats et contrôles d'accès.
- **Retour utilisateur** : affiche le résultat réel de l'opération et les éventuelles étapes restantes.

Pour les versions futures intégrant une intelligence, celle-ci pourra préparer et structurer les informations, mais ne devra pas écrire directement en base ni contourner les validations métier, les contrôles de sécurité ou les autorisations.

### Critères d'acceptation V1

- Un parcours courant peut être accompli avec des boîtes de dialogue courtes, sans long formulaire classique.
- Chaque étape présente une question ou une consigne compréhensible et permet une réponse ou un choix.
- Les embranchements sont déterministes, documentés et testables.
- L'utilisateur peut corriger ses réponses et consulter un récapitulatif avant confirmation lorsque nécessaire.
- Les données sont validées par les règles métier avant transmission aux services.
- Les états d'attente, d'échec, de reprise et de succès reflètent le résultat réel des services.
- Un formulaire court de second recours existe pour les exceptions et les besoins de saisie structurée.
- Les parcours et formulaires de secours sont testés en FR/EN, sur mobile, au clavier et avec lecteur d'écran.

Les fonctions de compréhension libre, d'adaptation intelligente et de dialogue vocal ne font pas partie des critères d'acceptation V1.


## 10. Revue des parcours et états — audit en cours

### Flash
- Le flux public affiche les données distantes et peut conserver les éléments locaux en mode hors ligne.
- La création d'un Flash est réservée à une session authentifiée ; un visiteur non connecté reçoit un accès vers l'authentification.
- Correction appliquée dans `FlashFeed` : une erreur de chargement distante reste visible même lorsque la liste locale est vide ; l'état vide ne masque plus l'erreur.
- À vérifier : reprise manuelle après erreur, cohérence du message lorsque le réseau revient et parcours complet invité/compte.

### Scan
- Le parcours demande une position temporaire avant de lancer la recherche de proximité ; le refus de permission est présenté explicitement.
- Corrections appliquées : état d'attente pendant l'obtention de la position, prévention d'un double lancement, état d'erreur visible si le service de scan échoue et messages FR/EN correspondants.
- À vérifier : navigateur sans Geolocation API, permission refusée de façon persistante, délai dépassé, réseau interrompu pendant la recherche et relance utilisateur.

### Réel et Radar
- Les routes actuelles sont des points d'entrée/fondations, pas des moteurs V1 complets. Leurs états métier et parcours invité/compte ne peuvent donc pas être certifiés à cette étape.
- Les contrats UX propres à Réel seront définis dans la phase 3 ; les écrans Radar et ses états métier seront contrôlés lors de l'harmonisation des moteurs en phase 5.
- Ne pas présenter ces espaces comme fonctionnels tant que leurs capacités réelles ne sont pas implémentées.

### État de validation
- Les corrections de cette revue ont été poussées dans la branche de la PR #37.
- Aucune exécution CI n'a encore été retournée pour le dernier commit ; les corrections ne sont donc pas déclarées testées ou validées par CI.
- Les validations manuelles (clavier, lecteur d'écran, contraste réel, petits écrans) restent ouvertes.


## 11. Dernière passe de stabilisation et preuves

### Corrections supplémentaires appliquées
- Flash : l'erreur d'enregistrement local est interceptée et affichée ; le bouton reste réutilisable après échec. Le compositeur attend la fin du chargement de session avant de présenter le parcours invité ou authentifié.
- Flash : le message de confirmation décrit désormais un enregistrement local en attente de transmission, et non une publication serveur déjà garantie.
- Flash : le libellé d'erreur du flux précise que seules les données réellement disponibles localement sont affichées.
- Scan : le navigateur sans API de géolocalisation reçoit un état explicite ; les états de localisation et d'exécution sont distincts ; les échecs sont visibles et relançables.
- Scan : les messages de refus/échec ne présument plus que la permission est forcément la cause de l'indisponibilité.
- FR/EN : les nouveaux messages d'erreur et de repli sont présents dans les deux catalogues ; le test de parité i18n couvre leur présence.

### CI — état vérifiable
- La dernière exécution disponible au moment de cette revue est Quality #504, sur le commit antérieur aux dernières corrections de formatage.
- Cette exécution a échoué pendant `bun run check:foundation`, avant les étapes RLS, release/build et tests mobile/offline.
- Le journal relevait 611 erreurs Prettier. Onze concernaient trois fichiers modifiés dans cette série (`FlashComposer.tsx`, `ScanPanel.tsx`, `messages.ts`) ; ces onze écarts ont été corrigés dans la branche.
- Les autres erreurs relevées concernent des fichiers préexistants hors des corrections Phase 2, notamment des contrats, de la logique Flash, des types Supabase générés, des composants génériques et des fondations de design. Elles ne sont pas masquées ni déclarées résolues.
- Les commits de correction les plus récents n'ont pas encore de résultat CI récupérable. Tests, build, RLS et tests navigateur ne sont donc toujours pas certifiés.

### Conditions restantes pour clôturer la phase 2
- Obtenir une exécution CI exploitable après les derniers commits et résoudre le blocage de qualité restant sans désactiver les contrôles.
- Valider manuellement sur appareils réels les parcours clavier/focus, lecteur d'écran, contrastes composites et tailles mobiles ; les vérifications de code seules ne remplacent pas ces essais.
- Vérifier les états réseau et les parcours invité/compte sur les écrans effectivement implémentés. Réel et Radar restent des fondations d'attente : leurs comportements métier relèvent respectivement des phases 3 et 5, et ne sont pas certifiés par cette phase.

**Statut de sortie : non clôturée.** La phase 2 ne sera déclarée terminée qu'après obtention de preuves CI et validation manuelle des critères transversaux. Aucun passage à la phase 3 n'est autorisé avant ces conditions.


### Reprise Flash et seconde passe de qualité
- Le flux Flash expose maintenant une action explicite de nouvelle tentative après erreur ; elle est désactivée pendant le chargement et réutilise la même opération de récupération que le retour réseau.
- La fonction de reprise reste stable entre les rendus ; les données locales absentes ne créent pas de tableau vide instable et le message d'erreur suit la langue active.
- Quality #514, exécutée après la première correction du lint, a révélé sept écarts de formatage supplémentaires dans les contrats, Surface, les tokens, les traductions et les permissions. Ces sept écarts ont été corrigés dans la branche.
- Les deux avertissements de hooks liés au flux Flash ont également été traités. Les avertissements Fast Refresh restants dans les composants UI partagés sont non bloquants, mais restent à examiner dans le cadre de l'hygiène technique.
- Une nouvelle exécution Quality #521 est en attente sur le commit suivant ; elle doit confirmer les corrections précédentes. Aucun test ou build n'est réputé réussi avant son résultat.


### Authentification — cohérence invité/compte et accès système
- La route de connexion est volontairement sans chrome global ; elle possède maintenant ses propres contrôles FR/EN et clair/sombre afin que ces réglages restent disponibles pendant l'authentification.
- Les champs, le bouton principal et les actions secondaires respectent une cible tactile minimale de 44 px et un focus visible.
- Les erreurs inattendues d'authentification sont interceptées et présentées avec un rôle accessible ; le retour de succès reste distinct.
- Les métadonnées de connexion utilisent désormais le nom Vitalis.
- Le parcours Flash reste réservé à un compte pour publier ; le parcours Scan public ne requiert pas de compte. Le profil et les moteurs Réel/Radar restent des espaces incomplets et ne sont pas déclarés fonctionnels par anticipation.

### Dernière vérification Quality #521
- La seconde tentative de Quality #521 a passé l'installation des dépendances et du Supabase CLI, puis a atteint le lint.
- Le lint a échoué sur un unique écart Prettier dans le callback de reprise Flash ; cet écart a été corrigé dans le commit suivant.
- Six avertissements Fast Refresh restent dans des composants UI génériques partagés. Aucun avertissement n'est bloquant dans la configuration actuelle.
- Les étapes RLS, release/build et tests mobile/offline ont été ignorées après cet échec de lint. Une nouvelle exécution est nécessaire après les dernières corrections Auth/Flash.
