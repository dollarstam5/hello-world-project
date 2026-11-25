# En direct — guide complet du moteur

**Nom technique :** Reel / Presence · **Route :** `/reel`  
**Objet :** présence de proximité volontaire, découverte de personnes proches et interactions de contact rapides.  
**État documentaire :** référence autonome consolidée. Les éléments « cible », « ajoutés à la branche » et « validés en production » restent distincts.

## 1. Mission et périmètre

En direct permet à une personne de rendre sa présence temporairement découvrable et de découvrir, dans un périmètre autorisé, d'autres personnes ayant activé leur propre présence. Le profil de l'utilisateur est le point central de l'expérience. Le moteur privilégie la proximité immédiate et les interactions explicites.

En direct ne publie pas une annonce, ne recherche pas une offre, ne suit pas une intention dans le temps et ne crée pas automatiquement une relation durable. Il ne constitue pas une messagerie générale.

## 2. Parcours utilisateur complet

### 2.1 Entrée et modes d'accès
- **Visiteur :** peut consulter la présentation et l'écran calme ; aucune opération métier de proximité.
- **Invité :** peut entrer dans le parcours invité avec une identité éphémère propre à En direct. Cette identité n'est ni un compte Auth, ni un profil membre, ni une preuve d'identité durable.
- **Membre actif :** accède aux opérations permises par son statut, ses consentements et les vérifications serveur.
- **Profil inactif, suspendu ou invérifiable :** les opérations qui exigent un profil actif sont refusées.

L'ouverture de l'écran n'active ni la découverte ni la publication de présence.

### 2.2 Découvrir les personnes proches
1. La personne choisit volontairement d'utiliser la découverte.
2. Le moteur explique et demande le consentement spécifique à la découverte.
3. La localisation est sollicitée uniquement lorsque nécessaire.
4. Le service serveur vérifie le mode d'accès, le consentement, la validité de la session, la zone et les droits.
5. L'interface affiche uniquement la projection de profil autorisée : nom affiché, avatar, description, zone approximative et informations utiles autorisées.
6. La sélection d'une personne ouvre sa fiche ; aucune coordonnée exacte, donnée privée ou clé de session invitée n'est exposée.

Refuser la localisation ou le consentement conserve l'écran calme et les parties de l'expérience qui n'en dépendent pas.

### 2.3 Publier sa propre présence
La publication de présence est une action distincte de la découverte. La personne la déclenche explicitement, accepte le consentement dédié, choisit les paramètres disponibles (notamment rayon et durée), puis confirme. Le serveur vérifie le profil ou la session autorisée, le consentement, la propriété, les paramètres et l'expiration. La présence est temporaire et peut être arrêtée par son propriétaire.

Les durées documentées dans l'état V1 sont 30 min, 1 h, 2 h, 3 h, 6 h, 12 h ou 24 h ; les rayons enregistrables documentés sont 10 m, 25 m, 50 m, 100 m ou 1 km. Ces valeurs ne signifient pas que le calcul spatial métrique est déjà validé en production.

### 2.4 Envoyer un bip et créer une relation
- Un bip est une demande courte sans message libre.
- Une seule demande en attente est autorisée par paire de personnes.
- Le destinataire peut accepter ou refuser ; l'auteur peut retirer sa demande.
- L'acceptation crée une relation unique. Elle ne doit pas être dupliquée par des renvois réseau.
- La fermeture d'une relation par l'un des participants la ferme pour les deux, après confirmation, et informe l'autre partie.
- Un bip accepté disparaît de la liste des demandes ; les bips non acceptés sont temporaires et ne deviennent pas un historique permanent.

Les conversations générales, le partage de zone et les autres interactions non raccordées ne doivent pas être présentés comme disponibles.

## 3. Règles métier et invariants

- Consentement de découverte ≠ consentement de publication de présence.
- Une autorisation accordée à un autre moteur ne vaut pas autorisation pour En direct.
- Une session invitée ne confère aucun droit de membre et n'est jamais exposée au navigateur comme identifiant métier.
- Les coordonnées exactes et les secrets de session restent côté serveur.
- La découverte ne révèle que les personnes ayant une présence valide et une projection autorisée.
- La fermeture d'une relation ne doit pas dépendre d'une nouvelle autorisation de localisation.
- Les actions sont idempotentes et vérifiées côté serveur ; le contrôle UI seul n'accorde aucun droit.

## 4. Cycle de vie et données

Les objets principaux sont : présence temporaire, session invitée éphémère, bip, relation et projection de profil. Une présence est créée après consentement et contrôle serveur, reste active jusqu'à son arrêt ou son échéance, puis est nettoyée. Les bips expirent selon les règles temporelles de leur présence ; une relation acceptée a un cycle distinct et durable.

Les sessions invitées utilisent un secret opaque aléatoire transmis dans un cookie HttpOnly/Secure/SameSite approprié ; seule son empreinte est stockée côté serveur. Les données temporaires liées à la session doivent être révoquées et nettoyées à sa fermeture ou expiration.

## 5. Architecture et responsabilités

- Route : `src/routes/reel.tsx`.
- Présentation : `src/modules/reel/ui/` et composants de l'écran.
- Contrôleur : `src/modules/reel/model/useReelProximityController.ts`.
- Politique d'accès : `src/modules/reel/policy/reel-access-policy.ts`.
- API/Server Functions : `src/modules/reel/api/`.
- Services temps réel : `src/modules/reel/services/`.
- Serveur, migrations et RLS : autorité finale pour identité, consentement, propriété, rayon, expiration et permissions.

La présentation ne contacte pas directement Supabase. Le contrôleur coordonne les actions sans contenir de JSX ni accéder directement au client Supabase. Le service Realtime gère ses abonnements et demande le rechargement d'une projection autorisée.

## 6. État d'implémentation connu

La documentation de branche décrit la présence et la découverte membre comme raccordées au code. Une session invitée serveur éphémère est ajoutée, mais les opérations métier invitées restent bloquées tant que leurs RPC et tests ne sont pas validés. Le rayon est enregistré, mais le calcul spatial exact et le temps réel multi-appareils sont indiqués comme incomplets dans l'état V1. Les bips et relations doivent être considérés comme non validés en production tant que les migrations, tests SQL, CI et essais multi-appareils ne le prouvent pas.

## 7. Vérifications obligatoires avant toute déclaration de disponibilité

Tester les modes visiteur/invité/membre, les consentements séparés, l'isolation inter-comptes, la propriété, les rayons et limites spatiales, l'expiration, la révocation, l'idempotence des bips, les rôles émetteur/destinataire, l'absence de fuite d'identifiants temporaires et la reprise Realtime. Vérifier les migrations et politiques RLS sur l'environnement cible.

## 8. Sources conservées

Les documents détaillés de politique d'accès, d'architecture UI, de session invitée, de visibilité et de traçabilité restent des annexes spécialisées. Le présent guide rassemble le parcours et les règles nécessaires à la compréhension du moteur sans obliger le lecteur à les consulter.