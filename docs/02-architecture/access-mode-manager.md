# Gestionnaire central et moteur de décision Vitalis

**Statut :** moteur de décision partagé ajouté côté client, avec règles prudentes et tests unitaires écrits. Il reste indicatif : les autorisations métier doivent être appliquées et vérifiées côté serveur.

## 1. Rôle du système central

Le gestionnaire central fournit un contexte d'accès commun. Le moteur de décision évalue une demande avant que l'interface ne propose une action.

Il couvre les cinq espaces Vitalis :

- Réel ;
- Flash ;
- Scan ;
- Radar ;
- 2×2.

Il évite que chaque moteur réinvente les règles d'identité, de compte, de consentement, de disponibilité ou de sécurité. Les règles métier propres à chaque moteur restent dans leur domaine ; le centre applique les contrôles transversaux.

## 2. Modes reconnus

| Mode     | Signification                                              |
| -------- | ---------------------------------------------------------- |
| Visiteur | Personne sans compte connecté ni session invitée           |
| Invité   | Personne avec une identité temporaire, sans profil durable |
| Membre   | Personne disposant d'une session Supabase Auth             |

Le mode décrit l'identité de la session, pas à lui seul les droits d'une personne.

Pour un membre authentifié, le gestionnaire lit uniquement `status` et `deleted_at` dans son profil. Les états inconnus, absents ou impossibles à vérifier sont refusés par prudence.

## 3. Point de décision commun

API principale : `evaluateVitalisDecision(context, engine, action)`.

Moteurs : `reel`, `flash`, `scan`, `radar`, `grid` (2×2).

Actions génériques reconnues :

- `view_intro`, `read_public` : présentation ou information publique ;
- `enter` : ouvrir l'espace d'un moteur ;
- `discover` : demander une découverte/recherche ;
- `create`, `update`, `delete` : gérer un élément ;
- `publish` : rendre un contenu visible ;
- `contact` : initier une mise en relation ;
- `manage` : gérer un espace ou ses paramètres ;
- `sync` : synchroniser une demande ;
- `export` : exporter des données ;
- `operate` : opération métier générique conservée pour compatibilité.

Le résultat comporte quatre états :

| État           | Signification                                                                                |
| -------------- | -------------------------------------------------------------------------------------------- |
| `allow`        | L'interface peut poursuivre l'étape non protégée indiquée                                    |
| `deny`         | L'action doit être bloquée                                                                   |
| `server_check` | Le serveur doit autoriser explicitement l'opération                                          |
| `defer`        | Seule une action explicitement compatible avec l'outbox hors ligne peut être mise en attente |

**Important :** `allow` ne donne jamais accès à une donnée protégée et ne remplace pas une autorisation serveur.

## 4. Contrôles transversaux

Le contexte de décision peut recevoir les éléments suivants, lorsqu'ils sont connus et vérifiés :

1. **Identité et compte** : visiteur, invité, membre ; profil actif, incomplet, suspendu, fermé ou invérifiable.
2. **Moteur et action** : l'espace et le type d'opération demandés.
3. **Consentement** : accord associé à un objectif précis, par exemple le partage de localisation. Un consentement général ne remplace pas un accord spécifique.
4. **Disponibilité** : fonctionnalité réellement livrée et activée.
5. **Propriété** : confirmation que la ressource appartient bien à la personne qui veut la modifier.
6. **Quota** : limite applicable à l'action et au compte.
7. **Connexion** : une action hors ligne n'est mise en attente que si le domaine l'a explicitement déclarée compatible.
8. **Serveur** : toute opération protégée est soumise à une nouvelle vérification côté serveur.

Les informations non fournies ne sont pas inventées. Les contrôles métier absents doivent rester bloqués côté serveur.

## 5. Politique d'accès actuelle

| Situation                          | Présentation publique   | Entrée moteur       | Action métier                                                 |
| ---------------------------------- | ----------------------- | ------------------- | ------------------------------------------------------------- |
| Visiteur                           | Autorisée               | Refusée             | Refusée                                                       |
| Invité                             | Autorisée               | Réel uniquement     | Vérification serveur obligatoire, sans autorisation implicite |
| Membre actif                       | Autorisée               | Espaces des moteurs | Vérification serveur obligatoire                              |
| Profil invité/incomplet            | Présentation uniquement | Refusée             | Refusée                                                       |
| Profil suspendu/fermé/invérifiable | Présentation uniquement | Refusée             | Refusée                                                       |

L'entrée invité dans Réel ouvre uniquement le parcours d'accueil invité. Les opérations Réel pour invités ne sont pas encore activées par ce moteur central.

## 6. Hors ligne et données

Le statut `defer` n'est pas une permission générale de stocker des actions. Il est réservé aux commandes déclarées compatibles avec le protocole offline-first du moteur concerné. Les actions sensibles (présence, contact, publication, droits, suppression ou accès à des données protégées) ne doivent pas être mises en attente par défaut.

Une commande hors ligne doit rester minimale, être rattachée à son propriétaire, être revalidée à la synchronisation et pouvoir être annulée. Le moteur central ne crée ni ne synchronise lui-même ces commandes.

## 7. Sécurité non négociable

- Le navigateur ne constitue jamais une frontière de sécurité.
- Le serveur vérifie l'identité réelle, l'état du compte, le moteur, l'action, les droits sur la ressource, les consentements, les quotas et les limites anti-abus.
- Les règles inconnues échouent en refus.
- Un invité ne devient jamais membre automatiquement et ses données temporaires ne sont pas transférées sans action explicite.
- Aucun moteur ne doit afficher de faux résultats, profils, présences, compteurs ou alertes pour contourner une fonctionnalité indisponible.

## 8. Données invitées

- Identifiant temporaire en mémoire côté interface et session serveur éphémère séparée.
- Aucune ligne dans `auth.users` ou `public.profiles`.
- Aucun stockage durable de l'identité invitée dans `localStorage` ou `sessionStorage`.
- Fin de session, révocation et expiration doivent effacer l'accès temporaire.
- Le service de session invité existe dans `src/domains/presence/api/`, mais n'autorise encore aucune opération métier Réel.
- Durée d'une heure provisoire ; protections anti-abus et purge effective à vérifier avant exposition publique.

Voir [Architecture de session invitée éphémère](../03-engines/reel/reel-guest-session-architecture.md).

## 9. Matrice des droits par moteur

La matrice de référence pour Réel, Flash, Scan, Radar et 2×2 est maintenue dans [Matrice centrale des droits et décisions Vitalis](./vitalis-engine-decision-matrix.md). Elle distingue les règles déjà connues des décisions encore à spécifier ; une capacité non confirmée reste désactivée.

## 10. Tests et limites actuelles

Les tests unitaires couvrent les cinq moteurs, les modes visiteur/invité/membre, les profils bloqués, les consentements, les quotas, la propriété des ressources, la disponibilité et la mise en attente hors ligne. Ils sont écrits mais leur exécution n'est pas encore confirmée.

À compléter avant activation réelle :

1. Ajouter les politiques métier détaillées et les droits par action dans chaque moteur.
2. Répliquer les contrôles sensibles dans les fonctions serveur/RPC et les politiques RLS.
3. Définir les consentements précis et leurs preuves, durées et révocations.
4. Raccorder les quotas réels et les contrôles anti-abus côté serveur.
5. Tester les scénarios négatifs, les transitions de compte, l'expiration et la synchronisation.
6. Exécuter lint, tests, build et tests de base de données sur le commit final.
7. Vérifier les parcours sur appareils Android et iOS.

Le moteur central est un point de décision commun, pas une nouvelle couche qui remplace les responsabilités des moteurs. Chaque domaine reste responsable de ses données, de ses règles métier et de ses services.
