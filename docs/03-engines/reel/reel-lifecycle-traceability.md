# Réel — traçabilité du cycle de vie immédiat V1

**Statut :** scénarios d'acceptation attendus, non déclarés exécutés.  
**Référence normative :** [Cycle de vie immédiat Réel V1](./reel-lifecycle-v1.md).  
**Spécification générale :** [Réel — spécification fonctionnelle V1](./reel-engine.md).

| ID règle | Exigence | Scénarios attendus | Preuve requise |
| --- | --- | --- | --- |
| RL-01 | Toute action Réel est déclenchée immédiatement, sans attente artificielle | RL-LIFE-01 | Test UX/API de latence et absence de temporisation ajoutée |
| RL-02 | Bip sans message libre ; acceptation directe ou après consultation du profil | RL-LIFE-02, RL-LIFE-03 | Test de parcours destinataire |
| RL-03 | Bip non accepté conservé 24 h après enregistrement serveur | RL-LIFE-04, RL-LIFE-05 | Test horodatage serveur, expiration et absence d'historique utilisateur |
| RL-04 | Le délai de 24 h est une durée de validité, pas un délai de livraison | RL-LIFE-01, RL-LIFE-04 | Vérification du flux réseau et des timestamps |
| RL-05 | Action hors ligne conservée puis synchronisée sans doublon | RL-LIFE-06, RL-LIFE-15 | Tests offline, reprise et idempotence |
| RL-06 | Mise en relation créée uniquement après acceptation | RL-LIFE-02, RL-LIFE-07 | Test de transition et contrôle d'accès |
| RL-07 | Deux emplacements d'accès uniquement : Réel et Notifications | RL-LIFE-07, RL-LIFE-11 | Tests UI et cohérence des deux vues |
| RL-08 | Communication liée à une mise en relation acceptée ; aucune messagerie libre | RL-LIFE-08 | Tests d'autorisation avant/après acceptation |
| RL-09 | Clôture confirmée, commune et immédiate | RL-LIFE-09, RL-LIFE-10 | Test de confirmation et transition atomique |
| RL-10 | Retrait de la mise en relation dans Réel et Notifications pour les deux personnes | RL-LIFE-11 | Tests multi-utilisateurs et synchronisation |
| RL-11 | Communication désactivée et historique non consultable après clôture | RL-LIFE-12 | Tests API/RLS/UI et vérification de rétention |
| RL-12 | Second participant informé | RL-LIFE-13 | Test notification in-app/push selon autorisation |
| RL-13 | Trace technique minimale seulement après clôture | RL-LIFE-14 | Inspection données, logs et politique de rétention |
| RL-14 | Transitions concurrentes produisent un seul état final | RL-LIFE-16 | Tests de concurrence et d'idempotence |

## Règles de preuve

- Les identifiants ci-dessus décrivent les scénarios à exécuter ; ils ne prouvent pas l'existence d'un test automatisé.
- Pour chaque scénario exécuté, renseigner le chemin du test, la commande, le résultat CI et le commit contrôlé.
- Les horodatages serveur déterminent les échéances ; l'interface ne doit pas transformer cette contrainte en attente utilisateur.
- Aucun endpoint, nom de table, schéma ou fournisseur n'est présumé.
- La durée de rétention de la trace technique minimale reste à spécifier dans la politique de conservation ; le contenu de conversation ne doit pas être conservé comme historique après clôture.
