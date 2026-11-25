# Architecture de l'interface En direct 

## Objectif

En direct reste un moteur autonome de Vitalis. Son écran ne porte pas les règles métier, ne contacte pas directement Supabase et ne connaît pas les détails internes des sessions invitées. Il compose uniquement les fonctions publiques du domaine En direct et les services partagés strictement nécessaires.

## Couches et responsabilités

| Couche | Emplacement | Responsabilité |
| --- | --- | --- |
| Route | `src/routes/reel.tsx` | Monter l'écran En direct et définir les métadonnées de la route. |
| Présentation | `src/domains/presence/ui/` | Afficher le radar, les profils, les panneaux, les états et la navigation visuelle de En direct. Aucun appel direct aux API métier ou à Supabase. |
| Contrôleur d'écran | `src/domains/presence/model/useReelProximityController.ts` | Coordonner les états de l'écran, les actions utilisateur et les cas membre/invité. Il ne contient ni JSX ni styles et délègue les accès externes aux API/services. |
| Politique | `src/domains/presence/policy/reel-access-policy.ts` | Décider localement si une action peut être proposée. La base et les RPC restent l'autorité finale. |
| API métier | `src/domains/presence/api/` | Encapsuler les RPC, Server Functions, la localisation et la résolution de zone. |
| Services techniques | `src/domains/presence/services/` | Gérer les connexions techniques transverses du moteur, notamment les abonnements Realtime privés. |
| Serveur et base | `src/domains/presence/api/*.server.ts`, Server Functions et migrations SQL | Vérifier l'identité, les consentements, le rayon, l'expiration, les rôles et les droits réels. Garder les coordonnées et identifiants internes privés. |

## Règles de dépendance

- Une route ne connaît que l'écran qu'elle monte.
- L'interface importe le contrôleur et des types d'affichage ; elle n'importe pas les RPC, les fonctions serveur, les règles d'accès ni le client Supabase.
- Le contrôleur ne dépend pas de composants visuels, d'icônes, de CSS ou du client Supabase.
- Le service Realtime est le seul propriétaire du canal privé membre. Son callback ne reçoit pas de données métier : il demande au contrôleur de recharger une projection autorisée.
- Les fonctions serveur et SQL vérifient chaque action. Une décision favorable côté interface n'accorde jamais un droit.
- Les moteurs Flash, Scan, Radar et En direct ne partagent pas leurs services métier. Seuls les services de fondation explicitement communs (accès, langue, plateforme) peuvent être réutilisés.

## Confidentialité des invités

- Le cookie HttpOnly vérifié côté serveur est la preuve de session invitée.
- Aucun identifiant de session invité n'est placé dans l'état React, les URLs, les canaux Realtime ou les payloads envoyés au navigateur.
- Les opérations invitées passent par les Server Functions dédiées ; elles ne réutilisent pas les RPC réservées aux membres.
- Les projections visibles ne renvoient que les champs d'affichage autorisés.

## Interface mobile-first

- La page reste une surface d'application mobile : zone de contenu maîtrisée, radar central, fiches tactiles, panneaux en feuille basse et navigation fixe.
- Le contenu doit rester défilable avec les zones sûres Android/iOS ; aucune hauteur rigide ne doit couper le radar ou les actions.
- La barre propre à En direct est montée par `AppShell`, une seule fois, et conserve les cinq entrées Vitalis avec En direct au centre.
- Les actions destructives utilisent une confirmation intégrée à l'interface, pas une boîte de dialogue native du navigateur.
- Les animations respectent la préférence de réduction du mouvement.
- Le bouton Bluetooth reste visible dans l'interface existante et son fonctionnement demeure réservé à la V3 ; il ne doit pas être supprimé ni présenté comme actif en V1.

## Périmètre UI/UX V1 — En direct

En direct est le nom affiché du moteur historiquement nommé En direct. Les routes, dossiers, clés de traduction et contrats techniques `reel` restent inchangés pour éviter une migration purement cosmétique.

### Composition commune des moteurs

- À gauche de l'en-tête : l'icône et le nom du moteur, réunis dans un seul bloc.
- À droite : les commandes secondaires propres au moteur.
- Le centre de l'en-tête n'accueille aucun titre centré ni élément décoratif. La zone centrale de la page, sous l'en-tête, est réservée à l'action principale du moteur.
- Sous cette composition viennent les informations et panneaux propres au moteur.

### Centre du radar : avatar utilisateur et rayons vers la périphérie

- L'avatar de l'utilisateur reste **au centre du radar**. Il représente sa propre présence et conserve son rôle de point de repère visuel.
- Les rayons partent visuellement de cet avatar et s'étendent vers l'extérieur, jusqu'à l'extrémité et à la périphérie du radar. L'avatar est donc l'origine du rayonnement, et non un point neutre ou vide.
- Les rayons doivent rester lisibles, fins et équilibrés ; ils structurent l'espace sans masquer les présences découvertes ni concurrencer les profils affichés autour du centre.
- Les personnes qui ont choisi de partager leur présence restent représentées séparément autour de l'avatar central, selon leur position dans le radar.
- Le bouton central reste associé à l'avatar de l'utilisateur et conserve son rôle actuel dans la gestion de sa propre présence (activation, arrêt ou accès aux réglages selon l'état). Toute évolution de ce comportement devra être décidée explicitement avant modification du code.
- Cette règle précise la représentation visuelle attendue ; elle ne demande pas de supprimer l'avatar ni de déplacer l'interaction centrale.

#### État du code vérifié — point de départ visuel

- Le bouton central existant contient bien `SelfRadarIdentity` : avatar du membre lorsqu'il est disponible, ou représentation/initiales de l'invité. Il reste un bouton interactif.
- Ce bouton conserve actuellement la gestion de sa propre présence : arrêt si elle est active, activation si le consentement et les informations nécessaires sont présents, sinon ouverture des réglages.
- Les réglages restent également accessibles depuis la commande Préférences de l'en-tête. Ils regroupent notamment la découverte, le rayon, la durée et les paramètres de visibilité.
- Le radar actuel est construit avec des halos, des anneaux concentriques, une animation de balayage et une onde périphérique. Le CSS comporte plusieurs couches de surcharges successives ; les anneaux sont masqués puis réactivés plus bas. Aucun faisceau radial dédié ne part actuellement de l'avatar vers le bord.
- La prochaine évolution visuelle devra donc ajouter les rayons comme un calque du radar, avec l'avatar comme origine visuelle, sans remplacer le bouton central, les présences périphériques ni les commandes existantes. Le rendu devra être vérifié en clair/sombre, en mode calme/actif et avec la réduction des animations.


#### Proposition de composition visuelle des rayons

Objectif : rendre le radar immédiatement compréhensible, garder l'avatar central parfaitement identifiable et laisser les profils périphériques respirer.

- **Avatar central prioritaire** : conserver sa taille et son contraste actuels comme point focal. Le halo autour de lui reste fin et discret ; aucun faisceau ni effet lumineux ne doit recouvrir son visage ou réduire sa lisibilité.
- **Faisceaux radiaux** : commencer avec 8 à 12 rayons fins, régulièrement répartis autour de l'avatar et prolongés jusqu'à la périphérie utile du radar. Ils partent visuellement du contour de l'avatar, pas de son visage.
- **Traitement graphique** : opacité faible, épaisseur constante et couleur issue des variables du thème. Éviter les faisceaux épais, les dégradés très lumineux, les particules et les effets cumulés.
- **Hiérarchie des plans** : fond et anneaux discrets en arrière-plan ; rayons sur ce fond ; profils et leurs aperçus au premier plan. Les rayons doivent s'effacer localement derrière les profils afin de ne jamais traverser visuellement les visages, les noms ou les commandes.
- **Anneaux de portée** : conserver au maximum deux repères circulaires très légers. Ils servent à structurer la distance, sans concurrencer les rayons ni les profils.
- **Animation** : privilégier une propagation lente et peu contrastée, ou un léger balayage ponctuel. Pas de clignotement, de rotation rapide ni de pulsation permanente intense. Avec `prefers-reduced-motion` ou en mode calme, les rayons restent statiques.
- **Densité adaptative** : sur petit écran ou lorsque plusieurs profils sont visibles, réduire l'intensité et, si nécessaire, le nombre de rayons plutôt que réduire la taille des profils ou de l'avatar central.
- **États** : conserver une apparence lisible en thème clair/sombre, présence active/inactive, chargement, absence de profils et mode calme. La présence active peut modifier légèrement le halo central, sans transformer tout le radar en source lumineuse.
- **Validation visuelle** : vérifier que l'avatar est identifiable au premier regard, que chaque profil reste distinct et actionnable, que les noms restent lisibles et que le radar ne paraît pas saturé sur les largeurs mobiles courantes.

Ces valeurs (8 à 12 rayons, deux anneaux au maximum) constituent une base de conception à ajuster sur le rendu réel ; elles ne sont pas des exigences rigides si les tests de lisibilité montrent qu'une densité plus faible est préférable.


#### Première implémentation des rayons

- Un calque décoratif `reel-radar__rays` est rendu dans le radar, derrière les profils et sans remplacer le bouton central.
- Le calque dessine dix rayons fins, espacés régulièrement, avec une faible opacité. Un masque elliptique laisse dégagé l'espace occupé par l'avatar et son libellé : les rayons semblent partir de son voisinage immédiat sans passer sur son visage ni son nom.
- Le mouvement de rotation est très lent (72 secondes par tour). Il est arrêté en mode calme et lorsque le système demande une réduction des animations.
- Une nuance légèrement distincte est prévue pour le thème sombre.
- L'avatar, sa commande d'activation/arrêt de présence et les profils périphériques conservent leur structure et leurs interactions.
- Vérification effectuée sur les fichiers de la branche : présence du calque, maintien de `SelfRadarIdentity` et de la liste `visiblePeople`, règles clair/sombre et réduction des animations. Les tests automatisés, le rendu navigateur et les essais sur appareils mobiles restent à effectuer ; cette première intégration n'est pas encore déclarée validée visuellement.

### Commandes secondaires d'En direct

- Accueil : retour à l'accueil Vitalis.
- Activité : notifications, bips reçus et mises en relation.
- Préférences : réglages du rayon, de la durée et des informations de présence.
- Ma présence : activation ou arrêt explicite de sa propre présence, indépendant de l'autorisation de découverte.
- Bluetooth : emplacement visible réservé à la V3, désactivé en V1.

### États et limites à respecter

- Sans autorisation de découverte, le radar ne présente aucune personne à proximité ; l'écran conserve un état calme et explicatif.
- L'autorisation de découverte ne vaut jamais consentement à publier sa propre présence.
- Les modes membre et invité gardent leurs parcours et identités serveur séparés. L'interface ne doit jamais exposer un identifiant invité.
- Les commandes bips et mises en relation restent conditionnées aux droits réellement disponibles côté serveur. Un élément visuel ne doit pas laisser croire qu'une action non raccordée fonctionne.
- L'écran reste mobile-first, clair, aéré, accessible au clavier et compatible avec les zones sûres Android/iOS.
- L’en-tête conserve l’identité du moteur à gauche et ses cinq commandes à droite ; les règles compactes à 420 px et 360 px réduisent les espacements et les commandes sans déplacer un titre au centre.
- L’avatar central garde une taille carrée stable ; l’image membre utilise `object-fit: cover`, et le profil invité conserve son avatar temporaire choisi et ses initiales.
- La matrice de référence couvre 320×720, 360×800, 390×844, 412×915, 768×1024, 1024×768, 1280×800 et 844×390. Le contrat Vitest vérifie que la matrice de huit viewports reste couverte ; le script Playwright `bun run test:e2e` produit les captures de contrôle lorsqu’il est exécuté dans un environnement équipé de Chromium.

## Contrôles automatisés

- `tests/presence/reel-architecture.test.ts` protège les frontières entre présentation, contrôleur et service Realtime, la résolution privée de l’avatar membre et la composition de l’en-tête et du profil central.
- `tests/mobile-e2e-contract.test.ts` protège la matrice de huit viewports : 320×720, 360×800, 390×844, 412×915, 768×1024, 1024×768, 1280×800 et 844×390.
- `scripts/test-mobile-e2e.sh` doit produire les captures de la route En direct et vérifier que le composant `.reel-proximity` est monté avant la capture.

## Limite de comparaison visuelle

Le dossier `screenshots/04-reel/` ne contient actuellement aucun fichier de référence, uniquement son fichier de maintien. Les captures automatiques de la page peuvent contrôler le montage et les formats d'écran, mais elles ne constituent pas une comparaison pixel à pixel avec l'image de référence produit. Ne pas déclarer la fidélité exacte validée tant que cette référence n'est pas disponible dans le dépôt ou dans la session de contrôle.


## Règle de visibilité du profil — priorité produit

Le profil utilisé dans En direct est une projection contextuelle et limitée du profil Vitalis. La règle détaillée et ses critères d'acceptation sont maintenus dans [En direct — périmètre du profil et visibilité](./instant-profile-visibility.md).

- Par défaut, les autres personnes voient uniquement le **nom**, la **photo** et la **description de présence** définie par l'utilisateur pour En direct.
- La description de présence est distincte de la biographie générale du profil.
- Un réglage explicite dans les paramètres d'En direct doit permettre à l'utilisateur d'autoriser la consultation de son profil complet depuis ce moteur.
- Le réglage est recommandé désactivé par défaut. Sans consentement, aucune fiche, route ou réponse API issue d'En direct ne doit exposer les autres champs du profil.
- Le réglage ne vaut que pour En direct. Il ne modifie pas les règles de Flash, Scan ou Radar.
- Le contrôle est appliqué côté serveur/API et doit respecter immédiatement le retrait du consentement pour les consultations suivantes.
- Cette règle est un élément prioritaire du périmètre En direct. Le présent document décrit la cible produit ; l'existence effective du réglage et de son enforcement doit être vérifiée séparément dans le code avant d'être déclarée terminée.


## Vérification technique initiale du radar — 25 novembre 2026

### Contrôles statiques effectués

- Le calque des rayons est décoratif (`aria-hidden`) et ne modifie aucune interaction.
- Le dégradé conique se répète tous les 36 degrés : dix rayons fins répartis sur 360 degrés.
- Le masque elliptique réserve une zone centrale autour de l'avatar et de son libellé.
- Les profils périphériques conservent leur niveau de superposition supérieur (`z-index: 2`). Le bouton central et `SelfRadarIdentity` sont conservés.
- Le mode calme arrête la rotation ; `prefers-reduced-motion: reduce` arrête également l'animation.
- Une nuance dédiée est définie pour le thème applicatif `.dark`.
- Les règles de largeur étroite et de paysage déjà présentes continuent de dimensionner le radar ; le calque ne change pas son gabarit.

### Contrôle CI disponible sur la branche

- Le contrôle ciblé Scan est passé, mais ne couvre pas le moteur En direct.
- Le contrôle Quality a échoué pendant le lint global, avant l'exécution des tests, des tests RLS, des smoke tests mobiles et du build.
- Le journal de cette exécution identifie trois erreurs Prettier dans `packages/core-contracts/src/recommendation.ts`. Aucun problème du fichier Radar n'est signalé dans cet extrait ; les avertissements affichés concernent d'autres fichiers.
- Les étapes mobiles et build sont donc **non exécutées**, et non réussies.

### Vérifications encore nécessaires

- Rendu réel aux largeurs 320, 360, 390 et 430 px, puis sur tablette.
- Thèmes clair et sombre, avec profils nombreux et peu nombreux.
- Mode calme, présence active/inactive, chargement et absence de profils.
- Séparation visuelle des rayons, du visage, du libellé et des noms des profils.
- Essais sur Android et iOS, avec et sans réduction des animations.

Cette vérification est une revue statique du code et des résultats CI disponibles. Elle ne constitue pas une validation visuelle ni une recette sur appareils.


### Ajustements de cohérence avec la composition validée

- La hiérarchie des calques est maintenant explicite : anneaux de fond, rayons (`z-index: 0`), avatar central (`z-index: 1`), profils (`z-index: 2`) et aperçu ouvert au premier plan.
- Le masque des rayons est resserré autour de l'avatar et de son libellé (`ellipse 13.5% 18%`) afin qu'ils paraissent partir du contour du profil central, plutôt que d'un grand vide autour de lui.
- Les dix rayons de la composition standard restent fins et discrets. Sur les écrans de 420 px ou moins, leur densité passe à huit ; leur intensité diminue encore sous 360 px. La taille des avatars et des profils n'est pas réduite.
- Le mode calme n'applique plus d'opacité au conteneur qui contient l'avatar : l'avatar et son libellé restent à pleine visibilité. Seuls les rayons et le halo de fond sont atténués.
- L'état de présence active conserve son indication sur l'avatar, mais ne déclenche plus de rotation lumineuse rapide de quatre secondes ; le halo devient statique et discret.
- Le thème sombre conserve une nuance bleutée dédiée. Le mode calme et `prefers-reduced-motion` arrêtent les animations des rayons.
- Deux tests de contrat ont été ajoutés pour protéger la hiérarchie visuelle, la visibilité de l'avatar en mode calme, l'adaptation mobile et les règles de mouvement.

Ces ajustements sont des améliorations de présentation. Ils ne changent ni la logique de découverte, ni l'activation de la présence, ni les interactions des profils et panneaux.

## Réconciliation du contrôleur avec la PR #89 — 25 novembre 2026

### Comparaison du découpage fonctionnel

Les hooks introduits dans le commit `55f2408` de la PR #89 ont été comparés aux modules de la branche de migration #90. Après normalisation des alias d'import liés au déplacement de `src/domains/presence` vers `src/modules/reel`, les implémentations fonctionnelles sont identiques pour :

- `useReelPresence` : activation et arrêt des présences membre et invité, consentements, localisation, rayon et durée ;
- `useReelDiscovery` : découverte de proximité, cache, actualisation, visibilité de page et état réseau ;
- `useReelBips` : réception, acceptation et refus des Bips, y compris les flux croisés membre/invité ;
- `useReelConnections` : lecture et clôture des connexions ;
- `useReelActivity` : actualisation de l'activité et projection des événements ;
- `useReelMemberProfile`, `useReelLifecycle`, `useReelMemberPresence`, `useReelGuestPresence`, `useReelGuestSession` et `useReelPanelState` ;
- les types, constantes et helpers associés.

Les différences relevées dans les imports correspondent aux chemins cibles de la migration et aux points d'entrée de communication propres à #90. Aucune différence fonctionnelle non expliquée n'a été relevée dans ces modules lors de cette comparaison.

### Adaptation conservée dans #90

Le contrôleur de #90 préfixe l'identité d'activité avec `guest:` ou `member:`. Le contrôleur de #89 utilisait directement l'horodatage de session invité ou l'identifiant membre. Le préfixe évite qu'une valeur provenant de deux modes d'accès différents soit considérée comme la même identité par les mécanismes de rafraîchissement et de projection d'activité. Cette adaptation est conservée.

Le contrôleur de #90 compose les hooks dans `src/modules/reel/model/reel-proximity/` et conserve les services d'API sous `src/modules/reel/api/`. Il ne réintroduit pas l'ancien contrôleur monolithique.

### Interface et radar

La comparaison confirme que la réconciliation du contrôleur ne nécessite pas de remplacer l'écran Réel. La composition actuelle, l'avatar central cliquable, les profils périphériques et le calque de rayons validé restent présents. Les tests de contrat existants couvrent notamment la séparation des responsabilités, les interactions de présence, les Bips, les connexions et la composition du radar.

### Limites de validation

Cette étape est une comparaison statique des sources sur `main` et sur la branche #90. Elle ne prouve pas l'exécution des tests, le bon fonctionnement en temps réel ni le rendu sur appareils. Aucun workflow CI n'est actuellement associé au dernier commit de la branche. Ces contrôles restent requis avant de déclarer la réconciliation complète et la PR fusionnable.
