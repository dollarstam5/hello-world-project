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
Vérifier rattachement à la mise en relation et désactivation après clôture ; vérifier les règles de rétention des conversations, l'archivage et la suppression des archives après 6 mois ; distinguer l'historique visible du compte et les traces techniques minimales (date/statut/événement). Vérifier la disparition des données personnelles de session invitée à la fin de celle-ci.

## Réseau
Perdre le réseau pendant une action ; restaurer ; vérifier synchronisation et absence de doublons ; simuler actions concurrentes et clôture pendant que l'autre participant est hors ligne.

## Preuve attendue par scénario
ID, préconditions, étapes, résultat attendu/observé, environnement/version, preuve (journal/capture/rapport) et statut : non exécuté, réussi, échoué ou bloqué. Une règle écrite ou un scénario attendu n'est pas une preuve d'exécution.

## Scénarios — archivage, suppression et quotas

- Vérifier qu'une conversation sans nouveau message est archivée après 3 mois calculés depuis son dernier message échangé.\n- Vérifier qu'un nouveau message relance le délai de 3 mois et empêche l'archivage fondé uniquement sur la date de création.
- Vérifier qu'au-delà de 50 conversations conservées, la plus ancienne est archivée immédiatement, même si elle a moins de 3 mois.
- Vérifier qu'une archive est inaccessible par défaut.
- Vérifier qu'une demande de l'utilisateur nécessite une autorisation administrateur et que l'accès cesse exactement après 24 heures.
- Vérifier que l'utilisateur peut supprimer son historique et qu'aucune fonction d'export n'est proposée.
- Vérifier les plafonds par espace, les avertissements avant saturation et le choix entre suppression de données et limitation des nouveaux usages/enregistrements.
- Vérifier qu'aucune option payante n'est proposée en V1 et que les opérations refusées au plafond ne provoquent ni dépassement ni perte silencieuse de données.

Les valeurs chiffrées des quotas et seuils devront être testées après leur arbitrage.


## Scénarios attendus — rétention et maîtrise des coûts

- Vérifier qu'une conversation est archivée après 3 mois sans nouveau message, calculés depuis le dernier message échangé, ou dès que le plafond de 50 est dépassé.\n- Vérifier qu'un nouveau message réinitialise le point de départ du délai.
- Vérifier que l'archive reste conservée 6 mois à compter de son archivage, puis que la purge définitive est exécutée selon la politique définie.
- Vérifier qu'un accès exceptionnel administrateur expire après 24 heures.
- Vérifier les compteurs logiques par espace et les quotas proposés une fois validés.
- Simuler l'atteinte des seuils globaux à 50 %, 65 % et 70 % et vérifier les réactions attendues.
- Vérifier qu'aucune écriture refusée ne provoque de perte silencieuse et que les actions hors ligne restent en attente.
- Vérifier qu'aucune option de paiement ou d'extension payante n'est proposée en V1.

Les quotas et seuils ci-dessus sont des propositions de conception, pas des résultats de tests exécutés.
