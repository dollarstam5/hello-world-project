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

### Centre du radar : origine des rayons, sans icône

- Le centre du radar ne présente **aucune icône, aucun avatar, aucune silhouette, aucune initiale et aucun libellé**. Il ne représente pas le profil de la personne.
- Le centre est un point d'origine visuel neutre. Des rayons partent de ce point et s'étendent vers l'extrémité du radar, jusqu'à sa périphérie. Le rayonnement constitue le motif central de l'interface.
- Les rayons doivent rester lisibles, fins et équilibrés ; ils structurent l'espace sans masquer les présences découvertes ni concurrencer les profils affichés autour du centre.
- Les personnes qui ont choisi de partager leur présence restent représentées séparément autour du centre, selon leur position dans le radar. Leur avatar et leur fiche ne sont pas déplacés au centre.
- La suppression de l'avatar central ne doit pas supprimer les fonctions existantes de gestion de sa propre présence. Leur point d'accès visuel et leur interaction devront être conservés dans les commandes ou réglages dédiés, sans réintroduire d'icône au centre.
- Aucun changement de comportement n'est présumé par cette règle graphique : le déplacement précis de l'interaction actuellement portée par le bouton central sera vérifié avant toute modification du code.

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
- Le profil central garde une taille carrée stable ; l’image membre utilise `object-fit: cover`, et le profil invité conserve son avatar temporaire choisi et ses initiales.
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
