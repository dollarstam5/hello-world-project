# Architecture de l'interface Instant (anciennement Réel)

## Objectif

Réel reste un moteur autonome de Vitalis. Son écran ne porte pas les règles métier, ne contacte pas directement Supabase et ne connaît pas les détails internes des sessions invitées. Il compose uniquement les fonctions publiques du domaine Réel et les services partagés strictement nécessaires.

## Couches et responsabilités

| Couche | Emplacement | Responsabilité |
| --- | --- | --- |
| Route | `src/routes/reel.tsx` | Monter l'écran Réel et définir les métadonnées de la route. |
| Présentation | `src/domains/presence/ui/` | Afficher le radar, les profils, les panneaux, les états et la navigation visuelle de Réel. Aucun appel direct aux API métier ou à Supabase. |
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
- Les moteurs Flash, Scan, Radar et Réel ne partagent pas leurs services métier. Seuls les services de fondation explicitement communs (accès, langue, plateforme) peuvent être réutilisés.

## Confidentialité des invités

- Le cookie HttpOnly vérifié côté serveur est la preuve de session invitée.
- Aucun identifiant de session invité n'est placé dans l'état React, les URLs, les canaux Realtime ou les payloads envoyés au navigateur.
- Les opérations invitées passent par les Server Functions dédiées ; elles ne réutilisent pas les RPC réservées aux membres.
- Les projections visibles ne renvoient que les champs d'affichage autorisés.

## Interface mobile-first

- La page reste une surface d'application mobile : zone de contenu maîtrisée, radar central, fiches tactiles, panneaux en feuille basse et navigation fixe.
- Le contenu doit rester défilable avec les zones sûres Android/iOS ; aucune hauteur rigide ne doit couper le radar ou les actions.
- La barre propre à Réel est montée par `AppShell`, une seule fois, et conserve les cinq entrées Vitalis avec Réel au centre.
- Les actions destructives utilisent une confirmation intégrée à l'interface, pas une boîte de dialogue native du navigateur.
- Les animations respectent la préférence de réduction du mouvement.
- Le bouton Bluetooth reste visible dans l'interface existante et son fonctionnement demeure réservé à la V3 ; il ne doit pas être supprimé ni présenté comme actif en V1.

## Périmètre UI/UX V1 — Instant

Instant est le nom affiché du moteur historiquement nommé Réel. Les routes, dossiers, clés de traduction et contrats techniques `reel` restent inchangés pour éviter une migration purement cosmétique.

### Composition commune des moteurs

- À gauche de l'en-tête : l'icône et le nom du moteur, réunis dans un seul bloc.
- À droite : les commandes secondaires propres au moteur.
- Le centre de l'en-tête n'accueille aucun titre centré ni élément décoratif. La zone centrale de la page, sous l'en-tête, est réservée à l'action principale du moteur.
- Sous cette composition viennent les informations et panneaux propres au moteur.

### Action principale d'Instant : le profil

- Le centre du radar accueille le profil de la personne qui utilise Instant. Il constitue le point d'ancrage visuel autour duquel apparaissent les profils proches.
- En mode invité, l'avatar visuel et le nom temporaire configurés pour la présence sont affichés. Aucun identifiant technique de session invitée ne doit apparaître.
- En mode membre, le centre affiche « Moi » et charge uniquement l’avatar du compte connecté depuis `profiles.avatar_media_id`, puis `media.remote_path`. Le média doit appartenir au membre, être une image distante non supprimée et utiliser un chemin dans son propre dossier du bucket `avatars`. Une URL signée courte est créée pour cette vue personnelle ; en cas d’absence ou d’échec, l’icône neutre reste affichée. Aucun avatar d’un autre compte n’est chargé dans ce profil central.
- L'activation du profil central ouvre les réglages de présence existants ; elle ne déclenche pas automatiquement la découverte ni la publication de présence.
- Les profils proches restent des éléments distincts autour du profil central. Leur sélection ouvre leur fiche. Les disques superposés donnent accès à la liste complète lorsque le nombre de profils dépasse le seuil prévu.

### Commandes secondaires d'Instant

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
- La matrice de référence couvre 320×720, 360×800, 390×844, 412×915, 768×1024, 1024×768, 1280×800 et 844×390. Le contrat Vitest vérifie les règles responsive ; le script Playwright `bun run test:e2e` produit les captures de contrôle lorsqu’il est exécuté dans un environnement équipé de Chromium.

## Contrôles automatisés

- `tests/presence/reel-architecture.test.ts` protège les frontières entre présentation, contrôleur et service Realtime, la résolution privée de l’avatar membre et les règles responsive de l’en-tête et du profil central.
- `tests/mobile-e2e-contract.test.ts` protège la matrice de huit viewports : 320×720, 360×800, 390×844, 412×915, 768×1024, 1024×768, 1280×800 et 844×390.
- `scripts/test-mobile-e2e.sh` doit produire les captures de la route Réel et vérifier que le composant `.reel-proximity` est monté avant la capture.

## Limite de comparaison visuelle

Le dossier `screenshots/04-reel/` ne contient actuellement aucun fichier de référence, uniquement son fichier de maintien. Les captures automatiques de la page peuvent contrôler le montage et les formats d'écran, mais elles ne constituent pas une comparaison pixel à pixel avec l'image de référence produit. Ne pas déclarer la fidélité exacte validée tant que cette référence n'est pas disponible dans le dépôt ou dans la session de contrôle.
