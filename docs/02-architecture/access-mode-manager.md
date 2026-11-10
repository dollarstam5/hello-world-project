# Gestionnaire central des modes d'accès

**Statut :** première fondation front-end — à raccorder aux politiques métier et aux services invités avant activation des moteurs.

## Objectif

Donner à tous les moteurs une source commune pour distinguer :

| Mode | Signification |
| --- | --- |
| Visiteur | Personne sans compte connecté et sans session invitée démarrée |
| Invité | Personne ayant démarré une session temporaire, sans profil Vitalis durable |
| Membre | Personne disposant d'une session Supabase Auth valide |

Le gestionnaire décrit le mode d'accès. Il ne remplace ni l'authentification, ni les règles d'autorisation serveur, ni les règles propres à chaque moteur.

## Contrat central

Le domaine `src/domains/access-mode/` expose `AccessModeProvider` et `useAccessMode()`.

- `mode` : `visitor`, `guest` ou `member`.
- `loading` : indique que la session d'authentification n'est pas encore résolue.
- `memberId` : identifiant Auth uniquement pour un membre connecté.
- `guest` : identité provisoire et date de début, uniquement pour une session invitée en mémoire.
- `startGuestSession()` : démarre une session invitée locale temporaire.
- `endGuestSession()` : met fin à cette identité temporaire.

## Protection des données invitées

- L'identifiant invité est aléatoire et conservé uniquement en mémoire dans l'application.
- Aucune écriture dans `localStorage`, `sessionStorage`, Supabase Auth ou la table durable `profiles`.
- L'identité est réinitialisée à la fin de la session de page (`pagehide`), à la déconnexion/connexion d'un compte et lors de l'appel explicite à `endGuestSession()`.
- Aucun transfert automatique vers un compte membre.
- Les données temps réel nécessaires à une visibilité entre appareils ne peuvent pas être autorisées par ce seul identifiant local : elles nécessitent un service serveur éphémère, des jetons limités, une expiration et un nettoyage vérifiables.

## Règles d'autorisation

Le gestionnaire ne déclare pas qu'un moteur est accessible simplement parce qu'un mode existe. Chaque moteur doit fournir sa propre politique serveur et vérifier les droits à chaque opération. Le client peut adapter l'interface, mais ne constitue jamais une frontière de sécurité.

- Visiteur : peut consulter les parcours d'accueil et choisir de commencer un parcours invité ou de se connecter.
- Invité : accès uniquement aux actions explicitement ouvertes aux invités par le moteur concerné.
- Membre : accès selon l'état réel du compte, du profil et les autorisations serveur. Une session Auth ne prouve pas à elle seule qu'un profil métier est complet ou actif.

## Limites connues de cette première fondation

1. Le gestionnaire distingue les sessions Auth des sessions invitées locales, mais ne vérifie pas encore l'existence ni l'état du profil métier.
2. L'identité invitée en mémoire ne permet pas à elle seule une présence multi-appareils ni une reprise après rechargement.
3. Aucun moteur ne doit activer des opérations invitées tant que le service serveur temporaire, les règles de sécurité, les quotas et le nettoyage ne sont pas livrés et testés.
4. La création d'une session invitée ne donne aucun droit par défaut sur Réel, Flash, Scan, Radar ou 2x2.

## Étapes suivantes

- Définir le contrat serveur de session invitée éphémère sans création d'utilisateur Auth ni de profil durable.
- Définir une politique d'accès par moteur et par action, vérifiée côté serveur.
- Ajouter expiration, révocation, limites d'abus et nettoyage.
- Vérifier les transitions visiteur → invité, invité → membre (uniquement après action explicite), membre → déconnexion.
- Ajouter des tests unitaires et d'intégration ainsi que des tests sur deux appareils avant activation utilisateur.
