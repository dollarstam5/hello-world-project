# Gestionnaire central des modes d'accès

**Statut :** fondation front-end intégrée ; moteur de décision indicatif ajouté. Les autorisations serveur et le service invité sécurisé restent à construire.

## 1. Modes reconnus

| Mode | Signification |
| --- | --- |
| Visiteur | Personne sans compte connecté ni session invitée |
| Invité | Personne avec une identité temporaire en mémoire, sans profil durable |
| Membre | Personne disposant d'une session Supabase Auth |

Le mode décrit l'identité de la session, pas à lui seul les droits d'une personne.

## 2. État du profil membre

Pour un membre authentifié, le gestionnaire lit uniquement `status` et `deleted_at` dans son profil :

- `active` : profil actif ;
- `invited` ou `missing` : profil à compléter ou absent ;
- `suspended` : compte suspendu ;
- `closed` ou profil supprimé : compte fermé ;
- `error` : état impossible à vérifier, donc accès protégé refusé ;
- `loading` : vérification en cours.

Aucune donnée de profil complète n'est copiée dans le contexte partagé. La lecture est limitée aux deux champs nécessaires à la décision d'accès.

## 3. Moteur de décision commun

Le domaine expose `evaluateEngineAccess(access, engine, action)`.

Moteurs reconnus : `reel`, `flash`, `scan`, `radar`, `grid`.

Actions d'interface :
- `view_intro` : consulter la présentation publique ;
- `enter` : ouvrir l'espace du moteur ;
- `operate` : demander une opération métier protégée.

La décision renvoie l'un des états suivants :

- `allow` : l'interface correspondante peut s'ouvrir ;
- `deny` : l'accès à cette interface est refusé avec une raison ;
- `server_check` : l'action doit être vérifiée par le serveur. Ce statut n'est pas une autorisation.

## 4. Règles actuelles, volontairement prudentes

| Situation | Présentation | Entrée moteur | Opération métier |
| --- | --- | --- | --- |
| Visiteur | Autorisée | Refusée | Refusée |
| Invité | Autorisée | Réel uniquement | Vérification serveur obligatoire pour Réel |
| Membre actif | Autorisée | Espaces des moteurs | Vérification serveur obligatoire |
| Profil invité/incomplet | Autorisée | Refusée | Refusée |
| Profil suspendu/fermé/invérifiable | Autorisée | Refusée | Refusée |

L'entrée invité dans Réel ouvre uniquement le parcours d'accueil invité. Elle ne prouve pas que la présence, les bips ou les échanges temps réel sont disponibles côté serveur.

## 5. Sécurité : règle non négociable

Le résultat du navigateur est une aide à l'interface, jamais une frontière de sécurité. Chaque lecture ou écriture protégée doit être contrôlée côté serveur par l'identité réelle, l'état du compte, le moteur, l'action, les consentements et les limites applicables.

Le statut `server_check` signifie précisément que le client ne doit pas exécuter l'opération sans passer par le service métier protégé. Les règles inconnues sont refusées par défaut.

## 6. Données invitées

- Identifiant aléatoire uniquement en mémoire.
- Aucune ligne dans `auth.users` ou `public.profiles`.
- Aucune écriture dans `localStorage` ou `sessionStorage`.
- Effacement à la fin de la session de page, lors de la connexion membre ou par fermeture explicite.
- Pas de transfert automatique vers un compte membre.
- La présence multi-appareils nécessite un service serveur éphémère avec jeton limité, expiration, révocation, quotas et purge.

## 7. Limites et prochaines étapes

1. Construire le service serveur de session invitée sans créer de compte Auth ni de profil durable.
2. Établir les droits précis par moteur et par opération avec les responsables de chaque domaine.
3. Ajouter les contrôles serveur correspondants et des tests négatifs (invité non autorisé, profil suspendu, session expirée, jeton révoqué).
4. Ajouter les tests de transitions et de nettoyage, y compris entre deux appareils.
5. N'activer aucune opération invitée réelle avant validation des contrôles et des migrations sur une base de test.
