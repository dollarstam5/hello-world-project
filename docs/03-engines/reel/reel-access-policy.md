# Instant — politique d’accès aux opérations V1

**Statut :** contrat d'accès produit et applicatif à maintenir aligné sur les services réellement raccordés. Les contrôles SQL et serveur restent l'autorité finale ; une règle côté interface ne constitue pas une preuve d'autorisation.

## Modes d'accès
- **Visiteur** : peut consulter la présentation publique, mais ne réalise aucune opération métier de proximité.
- **Invité** : utilise une session temporaire propre à Instant, distincte d'un compte membre. Cette session ne crée ni faux compte Auth, ni faux profil membre, ni droits membre.
- **Membre actif** : utilise les opérations permises par son profil, ses consentements et les contrôles serveur.
- **Profil membre non actif ou invérifiable** : aucune opération métier nécessitant un profil actif n'est autorisée.

## Matrice des opérations
| Opération | Membre actif | Invité | Visiteur | Conditions essentielles |
| --- | --- | --- | --- | --- |
| Entrer dans Instant | Oui | Oui | Présentation seulement | L'entrée ne vaut aucun consentement métier |
| Demander la localisation / découvrir les présences | Après consentement de découverte propre à Instant | Après validation de session invitée et consentement de découverte | Non | La découverte n'active pas la présence personnelle |
| Publier sa propre présence | Après consentement distinct `reel_presence` et contrôle serveur | Parcours de publication invité à confirmer dans l'interface ; session temporaire dédiée requise | Non | La session invitée seule ne suffit pas |
| Arrêter sa propre présence | Oui, après contrôle de propriété | Oui si une présence invitée est effectivement créée et rattachée à sa session | Non | L'arrêt ne doit pas exiger une nouvelle autorisation de découverte |
| Consulter les profils proches | Selon projection Instant autorisée | Selon projection invitée sûre retournée par le serveur | Non | Pas d'identifiant temporaire ni de coordonnées précises exposés |
| Envoyer / recevoir un bip | Oui, selon présence et contrôles serveur | Capacités croisées ajoutées dans la branche ; validation technique encore requise | Non | Présences valides, destinataire autorisé, rayon et idempotence contrôlés |
| Accepter / refuser un bip | Oui, si participant et destinataire | Capacités croisées ajoutées dans la branche ; validation technique encore requise | Non | Destinataire uniquement, état et expiration vérifiés |
| Consulter / fermer une relation | Oui, selon participation | Relations temporaires invitées ajoutées dans la branche ; validation technique encore requise | Non | Un participant peut fermer ; révocation/expiration invitée doit nettoyer la relation |
| Conversation ou messagerie générale | Non disponible tant que non implémentée | Non disponible | Non | Ne pas afficher de faux accès |
| Partage de zone ou signalement | Non disponible tant que non implémenté | Non disponible | Non | Contrat et contrôles dédiés requis |

## Consentements distincts
Les permissions ne sont pas interchangeables :
- `discoveryConsent` autorise uniquement l'observation des présences proches.
- `presenceConsent` et le consentement précis `reel_presence` autorisent la demande de publication de sa propre présence.
- Découvrir ne publie jamais la personne.
- Publier sa présence ne crée pas automatiquement une session de découverte.
- Le consentement de localisation donné à un autre moteur ne vaut pas consentement pour Instant.
- Les bips et commandes associées nécessitent les conditions de présence et les contrôles serveur applicables aux deux participants.

## Localisation et rayon
- La demande de localisation est déclenchée après une action volontaire dans Instant.
- Ignorer ou refuser la demande conserve l'accès à une page calme ; les opérations nécessitant la proximité restent indisponibles.
- Le rayon métrique est conçu pour être appliqué côté serveur avec PostGIS. Le calcul dépend toutefois de la qualité de la position GPS fournie et ne garantit pas une précision physique exacte.
- Les coordonnées exactes et les identifiants internes de session invitée ne sont pas exposés dans les projections destinées au navigateur.
- La fermeture d'une relation existante ne doit pas être bloquée par l'absence de localisation.

## Règles côté serveur
Chaque opération doit être revérifiée côté serveur : mode d'accès, identité ou session invitée, profil actif si requis, consentement, propriété, rôle des participants, présence active, état, expiration, rayon et unicité/idempotence.

La session invitée est opaque, temporaire et vérifiée côté serveur à partir du cookie HttpOnly. Les données invitées sont stockées séparément des données membre. La révocation ou l'expiration doit rendre la session inutilisable et nettoyer les présences, bips et relations temporaires qui en dépendent.

Les identifiants de session invités ne doivent jamais être renvoyés à l'interface, utilisés comme identifiants de membre ou présentés comme des preuves d'identité persistantes.

## État de preuve et limites
Les documents d'état Instant décrivent des éléments ajoutés à la branche : session invitée serveur, présence invitée temporaire, découverte réciproque et premières intégrations de bips/relations croisées. Ils indiquent également que les migrations et tests pgTAP associés, les contrôles CI complets, le build et les essais multi-appareils restent à valider.

En conséquence :
- Les fonctions invitées décrites comme ajoutées ne doivent pas être présentées comme validées en production.
- La publication d'une présence invitée depuis l'écran reste à confirmer dans le parcours utilisateur.
- Les notifications générales et les sources des suggestions globales ne sont pas déclarées raccordées.
- Les conversations et fonctions non livrées restent indisponibles.
- Le rayon enregistré ou affiché ne doit être annoncé comme appliqué que lorsque la migration PostGIS et les tests correspondants ont été exécutés avec succès dans l'environnement cible.

## Tests attendus
Les tests doivent couvrir les modes visiteur/invité/membre, les consentements indépendants, la propriété, les rôles émetteur/destinataire, les contrôles géographiques, l'absence de fuite d'identifiants temporaires, la révocation/expiration, l'idempotence, les accès inter-comptes et l'absence de mise en file hors ligne simulant une présence ou un bip.
