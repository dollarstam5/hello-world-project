# Réel — cycle de vie immédiat V1

**Statut :** règles fonctionnelles consolidées à partir des décisions produit validées.  
**Principe directeur :** « La maintenant et tout de suite. »  
**Portée :** présence, découverte, bips, mises en relation, communication, clôture et reprise réseau.  
**Référence complémentaire :** [Spécification fonctionnelle Réel](./reel-engine.md) · [Matrice de traçabilité](./reel-traceability-matrix.md)

> Ce document précise les règles de temporalité et de cycle de vie. En cas de contradiction avec une ancienne formulation de la spécification ou de la matrice, les règles présentes ici prévalent pour le cycle de vie des bips et des mises en relation. Cela ne constitue pas une preuve d'implémentation.

## 1. Règle fondamentale : aucune attente artificielle

Réel est un moteur de présence et d'interaction immédiates. Toute action disponible doit être déclenchée sans délai artificiel et traitée dès que les conditions techniques le permettent.

- L'interface déclenche l'action dès le geste de l'utilisateur.
- Lorsque le réseau est disponible, la transmission et le traitement commencent immédiatement.
- Aucun délai de temporisation, de validation différée ou de traitement par lot ne doit être ajouté au parcours utilisateur sans nécessité technique démontrée.
- L'horodatage serveur sert à garantir la cohérence des délais et des états ; il ne doit jamais être présenté comme une période d'attente.
- L'interface distingue clairement une action en cours de synchronisation d'une action confirmée par le serveur.

## 2. Présence et découverte

- La présence est volontaire et activée/désactivée manuellement.
- Les profils éligibles apparaissent dans l'espace Réel autour de l'utilisateur, selon le rayon choisi et les règles de confidentialité.
- La zone visuelle est centrée sur le profil de l'utilisateur ; les profils proches sont représentés autour de lui.
- Plusieurs personnes situées dans un même lieu peuvent être regroupées avec un indicateur numérique. Le groupe et les profils restent consultables.
- Les profils et les groupes sont interactifs : l'utilisateur peut ouvrir une fiche intermédiaire sans quitter inutilement le parcours.
- La découverte doit refléter les changements d'état aussi rapidement que le permettent le réseau, le système mobile et les autorisations. Aucune promesse de GPS ou de connexion continue ininterrompue ne doit être faite.

## 3. Bips — envoi, réception et expiration

Un **bip** est une demande de prise de contact immédiate adressée à une personne présente dans Réel. Il est distinct de la présence, du statut et de la mise en relation.

### 3.1 Envoi et réception

- L'utilisateur peut envoyer un bip depuis le profil ou l'action prévue dans Réel.
- L'envoi ne comporte pas de message libre d'accompagnement.
- Dès que le réseau est disponible, le bip est transmis et traité sans attente artificielle.
- Le destinataire peut accepter directement depuis la liste des bips ou consulter le profil de l'expéditeur avant de décider.
- Il n'est pas nécessaire d'envoyer un second bip pour accepter le premier.
- Un bip en attente n'ouvre pas de conversation et ne donne pas accès à une communication libre.

### 3.2 Conservation pendant 24 heures

- Un bip non accepté est conservé pendant **24 heures** afin de résister aux fermetures de l'application, coupures réseau et perturbations techniques.
- Le délai de 24 heures commence à l'enregistrement du bip par le serveur. Cette référence temporelle évite les divergences d'horloge des appareils et les ambiguïtés dues aux transmissions retardées.
- Ce délai ne retarde jamais l'envoi : il définit uniquement la durée de validité du bip après sa réception par le serveur.
- À l'expiration, le bip en attente devient invalide et disparaît des éléments actifs. Il n'est pas conservé comme historique utilisateur.
- Un bip accepté cesse d'être un bip en attente et donne naissance à une mise en relation.

### 3.3 Accès et absence d'archive

- Les bips relèvent de l'espace Réel ; ils ne créent pas une boîte d'archives ou un historique autonome.
- Après une interruption réseau, les états nécessaires sont resynchronisés lorsque la connexion revient.
- Les bips expirés ou refusés ne constituent pas un historique de mises en relation.
- Les emplacements réservés aux mises en relation acceptées sont décrits à la section 4.

## 4. Mises en relation acceptées

Une **mise en relation** existe uniquement après acceptation du bip.

- L'acceptation crée immédiatement la mise en relation et active les fonctions de communication prévues pour cette action.
- Les mises en relation acceptées sont accessibles depuis deux emplacements seulement :
  1. le compteur / accès des mises en relation dans Réel ;
  2. l'espace Notifications.
- Les deux accès représentent la même mise en relation ; ils ne créent pas deux copies métier indépendantes.
- La communication est attachée à la mise en relation et à son objectif. Réel n'autorise pas la messagerie libre entre personnes sans action ou mise en relation acceptée.
- Les mises en relation actives restent accessibles dans ces deux emplacements jusqu'à leur clôture.
- Aucun troisième espace d'archives ou historique de Réel ne doit être ajouté pour contourner cette règle.

## 5. Communication liée à la mise en relation

- La communication devient disponible après acceptation, jamais avant.
- Elle reste rattachée à la mise en relation concernée.
- Les règles de format, de partage volontaire et de sécurité de la communication restent celles de la spécification V1.
- La communication ne peut plus être utilisée dès que la mise en relation est clôturée.
- Aucune conversation indépendante ne subsiste après clôture.

## 6. Clôture d'une mise en relation

La clôture est une transition définitive et commune aux deux participants.

### 6.1 Déclenchement

- Chacun des deux participants peut demander la clôture.
- Une confirmation explicite est obligatoire avant l'exécution.
- La confirmation indique clairement que la mise en relation prendra fin pour les deux personnes et que la communication sera désactivée.

### 6.2 Effets immédiats et réciproques

Dès que la clôture est confirmée et enregistrée :

- la mise en relation est clôturée pour les deux participants ;
- elle disparaît immédiatement des deux emplacements : Réel et Notifications ;
- la communication associée est désactivée pour les deux ;
- aucun nouveau message ou échange ne peut être envoyé ;
- aucun historique de conversation n'est conservé ou rendu consultable après la clôture ;
- aucune connexion active n'est maintenue entre les deux participants ;
- l'autre participant est informé de la clôture, sans ambiguïté sur l'indisponibilité de la mise en relation.

La clôture ne doit pas laisser une ancienne conversation en lecture seule dans les deux espaces : la mise en relation et son historique utilisateur sont terminés.

### 6.3 Trace technique minimale

Une trace technique minimale peut être conservée uniquement pour la cohérence, la sécurité et la traçabilité du système :

- identifiant technique de l'événement ou de la mise en relation ;
- date/heure serveur de clôture ;
- statut final ;
- type d'événement (clôture).

Cette trace ne contient pas le contenu de la conversation, ne constitue pas un historique utilisateur et ne maintient aucune connexion active. Sa durée de conservation doit être définie dans la politique technique de rétention et de protection des données.

## 7. Réseau dégradé et synchronisation

La résilience technique ne doit pas transformer Réel en expérience différée.

- Une action initiée hors ligne est conservée localement dans une file d'attente jusqu'au retour du réseau, conformément au socle offline Vitalis.
- À la reconnexion, les actions en attente sont synchronisées automatiquement, sans demander à l'utilisateur de recommencer.
- Les opérations doivent être idempotentes afin qu'une reprise réseau ne crée pas de bip ou de mise en relation en double.
- L'interface indique l'état réel : en attente de synchronisation, transmis, accepté, expiré ou clôturé.
- Une action non confirmée par le serveur ne doit pas être présentée comme définitivement reçue ou acceptée par l'autre personne.
- Les transitions concurrentes (acceptation, expiration, clôture) doivent être arbitrées côté serveur avec un état final cohérent.
- Les horodatages serveur déterminent l'expiration et l'ordre des transitions ; ils ne créent aucun délai supplémentaire dans le parcours.

## 8. Scénarios d'acceptation essentiels

| ID | Scénario attendu | Résultat attendu |
| --- | --- | --- |
| RL-LIFE-01 | Envoi d'un bip avec réseau disponible | Transmission immédiate, sans temporisation artificielle |
| RL-LIFE-02 | Bip reçu, destinataire accepte depuis la liste | Mise en relation créée sans second bip |
| RL-LIFE-03 | Destinataire ouvre le profil avant d'accepter | Consultation possible puis décision directe |
| RL-LIFE-04 | Bip non accepté et application fermée | Bip conservé jusqu'à son expiration de 24 h |
| RL-LIFE-05 | Bip non accepté après 24 h | Bip expiré, absent des éléments actifs, sans historique utilisateur |
| RL-LIFE-06 | Bip envoyé hors ligne | Action conservée localement puis synchronisée au retour du réseau |
| RL-LIFE-07 | Mise en relation acceptée | Visible dans Réel et Notifications, pas dans un troisième espace |
| RL-LIFE-08 | Utilisateur tente de communiquer avant acceptation | Communication indisponible |
| RL-LIFE-09 | Un participant demande la clôture puis annule la confirmation | Mise en relation et communication restent actives |
| RL-LIFE-10 | Un participant confirme la clôture | Clôture commune et immédiate pour les deux |
| RL-LIFE-11 | Clôture confirmée | Retrait immédiat de Réel et Notifications pour les deux |
| RL-LIFE-12 | Clôture confirmée | Communication désactivée et historique de conversation non consultable |
| RL-LIFE-13 | Clôture confirmée | Autre participant informé |
| RL-LIFE-14 | Clôture confirmée | Seule une trace technique minimale est conservée |
| RL-LIFE-15 | Reprise réseau après une action en attente | Synchronisation idempotente, sans doublon |
| RL-LIFE-16 | Acceptation et expiration concurrentes | Une seule transition finale cohérente est retenue côté serveur |

## 9. Points techniques à vérifier, sans inventer l'architecture

- Contrat serveur pour l'envoi, l'acceptation, le refus, l'expiration et la clôture des bips/mises en relation.
- Horodatage serveur et expiration effective à 24 heures.
- Synchronisation offline, idempotence et résolution des transitions concurrentes.
- Cohérence des deux emplacements d'accès aux mises en relation acceptées.
- Retrait des données de conversation après clôture et séparation stricte de la trace technique minimale.
- Notification du second participant après clôture.
- Tests de sécurité garantissant qu'aucun des deux participants ne peut réactiver ou consulter l'ancienne mise en relation.
- Politique de rétention de la trace technique minimale.

Aucun endpoint, table, schéma ou fournisseur n'est présumé par ce document. Les preuves d'implémentation doivent être ajoutées après inspection du code et des environnements.
