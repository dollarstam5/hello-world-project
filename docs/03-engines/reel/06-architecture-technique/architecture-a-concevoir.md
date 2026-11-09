# Architecture technique — cadrage à concevoir

**Statut :** architecture détaillée non validée.

## Objets métier à distinguer
Utilisateur/profil ; présence active ; zone/rayon ; statut/intention ; bip ; mise en relation acceptée ; communication associée ; notification ; événement/trace technique. Cette liste est un cadrage, pas un schéma SQL approuvé.

## Cycles de vie
- Présence : inactive → activation volontaire → active → expiration/désactivation.
- Bip : créé → en attente → accepté ou autres états à définir. Le bip non accepté expire après 24 h ; origine du délai à définir.
- Mise en relation : créée après acceptation → active → demande de clôture → confirmation → clôturée pour les deux.
- Après clôture : communication désactivée, retrait des deux espaces, trace minimale.

## Responsabilités à concevoir
Gestion présence/expiration, découverte de proximité, intentions, bips, acceptation, mise en relation, communication, notifications, clôture réciproque, synchronisation, contrôle d'accès et audit.

## Résilience réseau
Conserver les actions en attente côté client, synchroniser au retour du réseau, éviter les doublons, gérer les conflits et garantir qu'une clôture confirmée ne laisse pas une communication active chez l'autre participant. Une action locale en attente ne doit jamais être présentée comme acceptée par le serveur.

## Cohérence distribuée
La clôture est une transition bilatérale faisant autorité côté serveur, propagée aux deux participants. Transaction, idempotence, événements et reprise restent à concevoir.

## Livrables techniques futurs
Modèle de données/migrations, contrats API, états et transitions, règles d'accès/RLS si applicable, événements, idempotence, politique de purge, tests de concurrence et synchronisation.

## Maîtrise des coûts et quotas — exigences à concevoir

- Mettre en place un compteur logique par compte et par espace, sans réserver physiquement tout le quota annoncé à chaque compte.
- Mesurer séparément base de données, fichiers, transfert sortant, Realtime et fonctions ; les quotas Supabase sont globaux au projet ou à l'organisation selon la ressource.
- Appliquer des seuils globaux et un mécanisme de protection avant saturation ; les quotas applicatifs ne remplacent pas les limites fournisseur.
- À saturation individuelle, proposer le choix validé : supprimer des données ou limiter les nouveaux enregistrements/usages dans l'espace concerné.
- À saturation globale, protéger les données existantes, différer ou refuser les écritures non essentielles, conserver les actions hors ligne en attente et informer clairement l'utilisateur.
- Automatiser la purge à l'expiration des 6 mois d'archive, avec idempotence, journalisation minimale et tests.
- Ne pas supposer que le plan gratuit fournit une disponibilité continue, des sauvegardes automatiques ou un SLA ; évaluer le risque de pause pour inactivité avant lancement.
