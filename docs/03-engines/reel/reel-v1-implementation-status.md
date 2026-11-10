# Réel — état d'implémentation V1

**État :** socle de persistance et de sécurité ajouté ; intégration de l'interface et du transport client encore ouverte.  
**Migration :** `supabase/migrations/20261110010000_reel_presence_and_bips.sql`  
**Tests :** `supabase/tests/database/130_reel_presence_security.test.sql`

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
- Les bips en attente expirent 24 h après la première fin ou échéance des deux présences associées. Ils ne sont pas ajoutés à la table Notifications.
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
