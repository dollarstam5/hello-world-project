# Tests et validation — scénarios attendus

**Aucun résultat d'exécution n'est affirmé dans ce document.**

## Présence
Activer volontairement ; refuser permission ; vérifier rayons retenus et plafond 1 km ; tester chaque durée ; vérifier suppression à expiration et unicité du statut.

## Découverte
Afficher profil central et profils proches ; ouvrir un profil ; afficher plusieurs personnes au même lieu ; compteur de regroupement ; vérifier chevauchement, accessibilité et lisibilité.

## Bips et historique
Envoyer et recevoir un bip ; consulter lorsque Réel est actif ; ouvrir le profil ; accepter directement sans renvoi ; vérifier expiration de l'action après 24 h même si Réel est fermé. Pour un compte Vitalis, vérifier que l'événement du bip reste consultable dans l'historique après expiration. Pour un invité, vérifier qu'aucun historique personnel ne persiste après la fin de session.

## Mises en relation et interactions passées
Créer après acceptation ; vérifier compteur Réel et Notifications ; absence d'espace Temps réel supplémentaire ; clôturer depuis un participant ; confirmer ; vérifier clôture des deux côtés, disparition des deux espaces et notification. Pour les comptes Vitalis, vérifier que la mise en relation clôturée et ses événements restent consultables dans l'historique sans réapparaître dans les espaces actifs. Vérifier que les interactions passées sont conservées dans l'historique du compte.

## Communication et conservation
Vérifier rattachement à la mise en relation ; désactivation après clôture ; absence de conservation du contenu des conversations dans l'historique ; distinction entre historique visible du compte et traces techniques minimales (date/statut/événement). Vérifier la disparition des données personnelles de session invitée à la fin de celle-ci.

## Réseau
Perdre le réseau pendant une action ; restaurer ; vérifier synchronisation et absence de doublons ; simuler actions concurrentes et clôture pendant que l'autre participant est hors ligne.

## Preuve attendue par scénario
ID, préconditions, étapes, résultat attendu/observé, environnement/version, preuve (journal/capture/rapport) et statut : non exécuté, réussi, échoué ou bloqué. Une règle écrite ou un scénario attendu n'est pas une preuve d'exécution.