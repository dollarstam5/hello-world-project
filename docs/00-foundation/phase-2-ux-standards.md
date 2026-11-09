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


## 9. Dialogue intelligent et formulaires

### Principe directeur

Vitalis privilégie un parcours conversationnel guidé par l'intelligence plutôt qu'un formulaire classique long. L'utilisateur exprime son intention avec ses propres mots ; Vitalis recueille progressivement les seules informations nécessaires, dans un dialogue simple, contextualisé et compréhensible.

Le dialogue intelligent est le mode d'interaction privilégié pour l'identification, l'enregistrement, la création ou la mise à jour d'informations et les autres démarches compatibles. Il doit réduire l'effort demandé à l'utilisateur, pas simplement reproduire un formulaire champ par champ sous forme de questions.

### Parcours de référence

1. **Comprendre l'intention** : identifier ce que la personne souhaite accomplir et le contexte utile.
2. **Questionner progressivement** : poser une seule question claire à la fois, éviter de redemander une information déjà connue et adapter la prochaine question aux réponses précédentes.
3. **Structurer et vérifier** : convertir les réponses en données structurées, détecter les éléments manquants ou incohérents et demander une précision lorsque c'est nécessaire.
4. **Présenter un récapitulatif** : rendre les informations importantes lisibles et permettre leur correction avant une opération engageante.
5. **Obtenir la confirmation proportionnée** : demander une confirmation explicite avant une création, une transmission ou une modification sensible.
6. **Transmettre aux services concernés** : envoyer uniquement les données nécessaires aux systèmes d'identification, d'enregistrement ou de traitement concernés, selon leurs contrats.
7. **Confirmer le résultat** : indiquer clairement si l'opération a réussi, est en attente, nécessite une action ou a échoué.

### Règles d'expérience

- Ne pas afficher d'emblée une longue liste de champs lorsque le dialogue peut recueillir les mêmes informations plus simplement.
- Ne poser que les questions utiles à l'objectif en cours ; les questions facultatives restent facultatives.
- Autoriser les réponses naturelles et les corrections sans obliger l'utilisateur à recommencer le parcours.
- Réutiliser, lorsque cela est autorisé et pertinent, les informations déjà fournies ; expliquer toute demande de confirmation ou de mise à jour.
- Ne jamais inventer, déduire silencieusement ou enregistrer comme certaine une information incertaine.
- Distinguer clairement les données proposées par l'intelligence, celles confirmées par l'utilisateur et celles effectivement enregistrées.
- Ne jamais laisser croire qu'une donnée a été enregistrée ou transmise tant que le service concerné n'a pas confirmé le résultat.
- Prévoir les interruptions, la reprise du dialogue et les pertes de réseau sans perdre silencieusement les réponses déjà saisies.
- Le dialogue doit rester accessible, utilisable au clavier et compatible avec les lecteurs d'écran ; les réponses ne doivent pas dépendre d'une animation ou d'une couleur.
- Le choix du canal (texte, voix ou autre interaction) ne doit pas modifier les règles de validation, de consentement et de confirmation.

### Formulaire classique : recours secondaire

Un formulaire classique reste disponible lorsqu'il est réellement plus adapté, notamment :
- lorsqu'une exigence légale, réglementaire ou technique impose un format précis ;
- lorsqu'un grand nombre de champs structurés doit être consulté ou corrigé en une seule fois ;
- lorsqu'une donnée complexe nécessite un contrôle visuel précis ;
- lorsque le dialogue intelligent est indisponible, inadapté ou explicitement refusé par l'utilisateur.

Dans ces situations, le formulaire doit être court, segmenté en étapes compréhensibles, prérempli avec les informations déjà confirmées lorsque cela est permis, et limité aux champs nécessaires. Il peut apparaître dans une seconde période du parcours ou être proposé comme solution de remplacement clairement expliquée.

### Séparation des responsabilités

- **Interface conversationnelle** : présente les échanges et recueille les réponses.
- **Orchestration intelligente** : détermine les questions utiles et prépare une proposition de données structurées ; elle ne décide pas seule d'une opération sensible.
- **Validation métier** : vérifie les règles, les champs requis, les formats et les autorisations.
- **Services de données** : assurent l'identification, l'enregistrement et les mises à jour selon leurs contrats et contrôles d'accès.
- **Retour utilisateur** : affiche le résultat réel de l'opération et les éventuelles étapes restantes.

L'intelligence ne remplace donc ni les validations métier, ni les contrôles de sécurité, ni les autorisations d'accès à la base de données. Les données ne doivent pas être écrites directement en base depuis le seul texte généré par le modèle.

### Critères d'acceptation

- Un parcours courant peut être accompli sans ouvrir un long formulaire classique.
- Chaque question est justifiée par l'objectif et le contexte.
- L'utilisateur peut corriger ses réponses et consulter un récapitulatif avant confirmation.
- Les données structurées sont validées par les règles métier avant transmission.
- Les états en attente, échec, reprise et succès sont explicites et fondés sur le résultat réel des services.
- Un formulaire court de second recours existe pour les exceptions et les besoins de saisie structurée.
- Les parcours conversationnels et les formulaires de secours sont testés en FR/EN, sur mobile, avec clavier et lecteur d'écran.

Cette référence définit le principe UX et la séparation des responsabilités. Le choix du fournisseur d'intelligence, les coûts, les quotas, les contrats de données et les règles détaillées de chaque parcours restent à spécifier avant leur implémentation.
