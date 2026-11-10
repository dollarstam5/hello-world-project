# Réel — politique d’accès aux opérations V1

**Statut :** première règle applicative ajoutée à la branche active.  
**Portée :** décision côté interface uniquement ; les fonctions SQL et contrôles serveur restent l’autorité finale.

## Parcours et opérations

| Opération | Membre avec profil actif | Invité | Visiteur | Contrôle requis |
| --- | --- | --- | --- | --- |
| Entrer dans Réel | Autorisé | Autorisé pour découvrir le parcours | Refusé | Le parcours invité ne donne aucun droit métier |
| Démarrer une présence | Vérification serveur | Refusé | Refusé | Consentement explicite `reel_presence`, profil actif, validation des paramètres et absence d’autre présence active |
| Terminer sa présence | Vérification serveur | Refusé | Refusé | Propriété de la présence |
| Découvrir les présences | Vérification serveur | Refusé | Refusé | Présence active dans la même zone opaque ; profil visible actif |
| Voir ses bips en attente | Vérification serveur | Refusé | Refusé | Participant du bip et état encore en attente |
| Envoyer un bip | Vérification serveur | Refusé | Refusé | Présence active de l’émetteur et du destinataire, zone commune, unicité de la demande |
| Accepter / refuser un bip | Vérification serveur | Refusé | Refusé | Destinataire uniquement, bip en attente et non expiré |
| Retirer un bip | Vérification serveur | Refusé | Refusé | Émetteur uniquement, bip en attente et non expiré |
| Fermer une mise en relation | Vérification serveur | Refusé | Refusé | L’un des deux participants, fermeture définitive |
| Conversation, message, partage de zone, signalement | Refusé tant que non implémenté | Refusé | Refusé | Aucun faux accès ni faux écran actif |

## Règles appliquées dans le client

- Les visiteurs ne peuvent pas exécuter d’opération Réel.
- Un invité peut entrer dans le parcours, mais ne peut pas démarrer une présence, découvrir des personnes ou envoyer/recevoir des bips. La session invitée serveur actuelle n’est pas raccordée aux RPC métier.
- Le démarrage d’une présence exige le consentement précis `reel_presence`.
- Les opérations qui concernent une ressource existante vérifient la propriété ou le rôle attendu lorsqu’il est connu du client.
- Les actions Réel ne sont pas mises en file hors connexion dans cette première tranche : aucune reprise automatique ne doit simuler une présence ou un bip. Elles demandent une connexion et une vérification serveur.
- Les opérations non livrées (conversation, messages, partage de zone et signalement) restent refusées.
- Une décision `server_check` ne signifie jamais que l’action est déjà autorisée. Le serveur doit contrôler à nouveau l’identité, le profil, le consentement, la propriété, le rôle des participants, l’état et l’expiration.

## Limites connues

- La politique ne remplace pas les RPC SQL existantes.
- Le rayon métrique n’est pas encore calculé ; la découverte actuelle utilise une clé de zone opaque commune.
- Les invités n’ont pas encore de présence métier éphémère.
- Les conversations et la fermeture de relation côté interface ne sont pas raccordées.
- Les tests Vitest ajoutés à cette tranche n’ont pas encore été exécutés ; les tests pgTAP et la migration ne sont pas déclarés validés.

## Tests automatisés attendus

Le fichier `tests/access-mode/reel-access-policy.test.ts` couvre les modes visiteur/invité/membre, le consentement, la propriété, le rôle émetteur/destinataire, l’absence de mise en file hors ligne, les fonctions non livrées et l’obligation d’une autorisation serveur.
