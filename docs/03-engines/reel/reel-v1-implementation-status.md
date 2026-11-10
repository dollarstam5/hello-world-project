# Réel — état d'implémentation V1

**État :** socle de persistance et de sécurité ajouté ; intégration de l'interface et du transport client encore ouverte.  
**Migration :** `supabase/migrations/20261110010000_reel_presence_and_bips.sql`  
**Tests :** `supabase/tests/database/130_reel_presence_security.test.sql`

## État de l'interface

- La route `/reel` monte `ReelProximityScreen`, mais lui transmet actuellement une liste vide. Aucun profil réel n'est chargé dans cet écran.
- Les panneaux de préférences, d'activité, de liste des personnes et d'aperçu de profil sont des interfaces interactives locales. Les choix de rayon, durée et autorisations ne sont ni enregistrés ni appliqués au service SQL.
- Les onglets Alertes, Bips reçus et Rencontres affichent des états vides honnêtes ; aucun compteur ou événement n'est simulé.
- La page ne démarre ni n'arrête encore une présence réelle. Les actions Réel ne doivent pas être présentées comme actives avant le raccordement des RPC et la validation de la clé de zone.

## Règle produit confirmée — accès membre et invité

Réel doit accueillir une personne sans lui imposer la création d'un compte Vitalis. Le moteur adapte les possibilités et la conservation au mode d'accès, sans confondre identité provisoire et profil enregistré.

### Membre avec profil enregistré

- Réutiliser uniquement les informations du profil qui sont nécessaires à l'expérience demandée et autorisées par la personne.
- Ne pas recopier automatiquement toutes les données du profil dans chaque présence ou interaction.
- Conserver l'historique uniquement selon les règles validées propres aux comptes et aux éléments concernés.

### Visiteur en mode invité

- Autoriser l'accès aux services Réel prévus pour les invités sans exiger un compte permanent.
- Attribuer une identité provisoire limitée à la session, distincte d'un identifiant de membre et d'un profil Vitalis.
- Ne pas créer ni enregistrer de profil invité dans les tables durables de profils Vitalis.
- Limiter les données à ce qui est indispensable à la session et aux services utilisés. Les éléments temporaires nécessaires au fonctionnement temps réel devront avoir une durée de vie courte, ne pas devenir un historique et être supprimés à la fin de la visite ou à l'expiration de la session.
- À la fin de la visite, réinitialiser l'identité provisoire et les données temporaires associées. Aucun rattachement rétroactif à un compte ne doit être fait sans action et consentement explicites.
- Proposer, sans pression et au bon moment, de créer un compte ou d'enrichir un profil pour retrouver des informations et accéder aux possibilités réservées aux membres.

### Conséquence technique

Le modèle actuel, qui exige un utilisateur Supabase authentifié et un profil actif pour démarrer une présence, **ne satisfait pas encore cette règle**. Il ne faut pas le contourner en créant un faux profil membre. Il faut concevoir un parcours invité séparé, avec identité temporaire, autorisations limitées et mécanisme d'expiration/nettoyage. La présence en direct peut nécessiter un état technique éphémère pour être visible aux autres appareils ; cet état ne doit pas être confondu avec un enregistrement durable dans la base des profils Vitalis. Le choix du transport temporaire et sa politique de suppression restent à spécifier et tester.


## Gestion centrale des modes d'accès — fondation ajoutée

Le domaine partagé `src/domains/access-mode/` est maintenant monté à la racine de l'application via `AccessModeProvider`. Les moteurs peuvent lire `useAccessMode()` pour distinguer visiteur, invité et membre, sans dupliquer la détection de session.

- Le mode membre repose sur la session Supabase Auth existante ; le gestionnaire ne prétend pas encore vérifier l'état du profil métier.
- Le mode invité crée uniquement un identifiant aléatoire conservé en mémoire côté application. Il n'est pas écrit dans Supabase Auth, `profiles`, `localStorage` ou `sessionStorage`.
- L'identité temporaire est effacée à la fin de la session de page, à la connexion d'un membre ou par fermeture explicite.
- Cette fondation ne fournit pas encore de session invitée multi-appareils, de jeton serveur, de transport temps réel ou de droits Réel. Les opérations invitées restent désactivées jusqu'à livraison et test de ces protections.

Document d'architecture : [Gestionnaire central des modes d'accès](../../02-architecture/access-mode-manager.md).

## Ce qui est ajouté

- Présences éphémères liées à un compte authentifié actif.
- Consentement explicite obligatoire pour démarrer une présence.
- Durées autorisées : 30 min, 1 h, 2 h, 3 h, 6 h, 12 h ou 24 h.
- Rayons enregistrables : 10 m, 25 m, 50 m, 100 m ou 1 km.
- Un seul état de présence active par compte.
- Aucune colonne de latitude, longitude ou coordonnées GPS dans le modèle Réel.
- Lecture des présences limitée au propriétaire actif et aux personnes ayant une présence active dans la même zone opaque.
- Projection de découverte limitée au nom affiché, à l'identifiant d'avatar, à la description, à l'intitulé de zone et aux horaires utiles. Aucun téléphone, GPS exact ou distance précise n'est retourné.
- Bips privés aux deux participants, sans message libre, avec identifiant de requête client pour rendre les renvois réseau idempotents.
- Un seul bip en attente par paire de personnes, quel que soit le sens.
- Acceptation réservée au destinataire ; elle crée une mise en relation unique. Refus et retrait sont également contrôlés côté serveur.
- Les bips en attente expirent 24 h après la première fin ou échéance des deux présences associées. Un bip accepté est retiré de la liste et sa trace technique temporaire expire au plus tard 24 h après l'acceptation ; la relation créée reste durable. Aucun bip n'est ajouté à la table Notifications.
- Nettoyage des bips expirés et des anciennes présences via fonction serveur, avec planification pg_cron si l'extension est disponible et nettoyage différé lors des appels Réel sinon.
- Publication Postgres Changes activée pour les trois tables si la publication Supabase `supabase_realtime` existe ; les événements restent soumis aux règles RLS.

## Limites à ne pas masquer

1. **La zone est une clé opaque fournie au serveur, pas un GPS.** La précision géographique et l'algorithme de création de cette clé restent à définir et à valider sur appareil.
2. **Le rayon est enregistré mais le calcul spatial n'est pas encore appliqué.** La découverte actuelle est limitée à la même clé de zone ; elle ne doit afficher ni distance ni prétendre respecter exactement un rayon métrique.
3. **La publication serveur ne suffit pas à rendre l'interface temps réel.** `src/lib/platform/realtime.ts` reste un bus local en mémoire. Le client Supabase Realtime, les abonnements privés, la reprise après reconnexion et le nettoyage des abonnements restent à raccorder.
4. **L'outbox locale n'est pas encore branchée aux commandes Réel.** Les RPC de bip sont idempotentes si le client réessaie avec le même `client_request_id`, mais l'enregistrement local et la reprise automatique après coupure restent à intégrer.
5. **La mise en relation est créée à l'acceptation, mais la conversation Réel n'est pas encore créée.** Les messages, les états envoyé/reçu/lu, le partage de zone ponctuel, la fermeture de relation et la conversation en lecture seule après fermeture restent à livrer.
6. **Le parcours invité n'est pas encore validé de bout en bout.** Les commandes actuelles exigent un utilisateur Supabase authentifié avec un profil actif ; il faut confirmer le comportement du mode invité sur une session anonyme réelle.

## Contrat de sécurité

- Les clients ne peuvent pas insérer, modifier ou supprimer directement les présences, bips ou relations.
- Les écritures passent par des fonctions SQL contrôlant l'identité, le consentement, l'état des présences et le rôle de chaque participant.
- Les présences ne sont lisibles que tant qu'elles sont actives et dans la même clé de zone.
- Les bips ne sont lisibles que par leurs deux participants, tant qu'ils sont en attente et non expirés.
- Les relations ne sont lisibles que par leurs deux participants.
- Les fonctions exposées refusent les visiteurs anonymes.
- Les bips acceptés disparaissent de la liste des bips en attente ; la relation correspondante est conservée séparément.

## Vérifications requises avant activation utilisateur

- Exécuter la migration sur une base Supabase de test issue de la chaîne standard.
- Faire passer le test pgTAP 130 et les tests RLS existants.
- Vérifier la publication et les abonnements Postgres Changes sur deux appareils.
- Tester les coupures réseau et les reprises avec un même identifiant de requête.
- Valider la précision de la zone opaque et les règles de voisinage avant d'afficher une proximité.
- Raccorder les conversations uniquement après validation de leur autorisation et de leur cycle de vie.

**Le socle SQL n'est pas une preuve que le parcours Réel est déjà disponible dans l'application.**
