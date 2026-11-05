# Réel — spécification fonctionnelle V1

**Statut :** spécification fonctionnelle V1 consolidée au niveau des décisions produit ; conformité runtime et tests non vérifiés.  
**Périmètre :** présence, découverte de personnes à très courte distance, profils, demandes de connexion et interactions Réel.  
**Référence produit :** Vitalis. Les anciennes sources peuvent encore employer le nom « Vitala ».  
**Portée de validation :** les règles marquées « Validée » sont des décisions fonctionnelles prises. Elles ne prouvent pas que le comportement est déjà implémenté ou testé.  
**Continuité :** [Navigation principale V1](../../01-product/navigation.md) · [Matrice de traçabilité Réel V1](./reel-traceability-matrix.md) · [Roadmap Réel V1–V3](./roadmap.md) · [Cartographie documentaire](../../07-annexes/reel-navigation-documentation-map.md)

> **Règle de lecture importante :** ce document décrit le comportement attendu de Réel V1. Les contrats API, le schéma de données, les politiques RLS, les permissions mobiles, les tests et le runtime doivent être vérifiés séparément avant toute affirmation d'implémentation.

## 1. Mission et limites de Réel

Réel permet de découvrir des personnes présentes à proximité physique immédiate, par exemple dans une même salle, autour d'un événement, sur un terrain de football ou dans un espace de rassemblement.

Réel n'est pas une recherche à l'échelle d'une ville ou d'une région. Il ne doit pas être confondu avec les recherches de proximité plus larges éventuellement proposées par ScanNearby.

### Principes V1

- Découverte fondée sur une présence active, un statut visible et une position suffisamment récente.
- Rayon court, plafonné à 1 km.
- Contrôle utilisateur de la présence et de la visibilité.
- Profil simple et informations facultatives contrôlées individuellement.
- Aucune exposition du numéro de téléphone ni des coordonnées GPS exactes.
- Prise de contact par demande explicite ; pas de message direct avant acceptation.
- Règles appliquées côté serveur, et non uniquement par l'interface.
- Minimisation des données, des requêtes et des coûts récurrents.

## 2. Présence et statut

### 2.1 Présence

**Règles validées**

- La présence est indépendante du statut.
- La présence reste active jusqu'à désactivation manuelle par l'utilisateur, y compris si l'application est fermée ou si l'utilisateur reste inactif longtemps.
- Une présence active sans statut visible ne rend pas le profil découvrable dans Réel.
- Si l'utilisateur désactive ou refuse la localisation, sa présence peut rester active, mais son profil disparaît de la découverte.
- La visibilité reprend lorsque les conditions de localisation précise et fiable sont à nouveau réunies.

### 2.2 Durée des statuts

Les durées disponibles sont fixes : **30 minutes, 1 heure, 2 heures, 3 heures, 6 heures, 12 heures et 24 heures**.

- Aucune durée personnalisée.
- À expiration, le statut est supprimé ; il n'est pas conservé dans un historique visible par l'utilisateur.
- Modifier un statut actif ne renouvelle pas son échéance initiale.
- Un seul statut actif par utilisateur.
- La publication d'un nouveau statut à la place d'un statut existant exige une confirmation explicite.
- La confirmation doit être vérifiée côté serveur : propriété du statut et absence de changement concurrent depuis la confirmation.
- Si le statut a changé entre-temps, l'opération est rejetée et l'utilisateur doit actualiser.
- Le remplacement du statut est atomique : création du nouveau statut et suppression de l'ancien dans une même transaction. En cas d'échec, l'ancien statut est conservé.

## 3. Découverte à proximité — B-01

### 3.1 Rayons disponibles

| Rayon | Règle |
| --- | --- |
| 10 m | Disponible |
| 25 m | Disponible |
| 50 m | Valeur initiale par défaut |
| 100 m | Disponible |
| 250 m | Disponible |
| 500 m | Disponible |
| 1 km | Maximum autorisé |

- Aucun élargissement automatique du rayon.
- L'utilisateur peut changer le rayon à tout moment.
- Le dernier rayon sélectionné est mémorisé et réutilisé lors d'une prochaine utilisation.

### 3.2 Éligibilité à la découverte

Un profil n'est découvrable que si les conditions de présence, de statut visible et de localisation fiable sont satisfaites. Une présence active ne suffit pas à elle seule.

## 4. Profil et confidentialité — B-02

### 4.1 Informations du profil

**Informations principales**
- Nom affiché ou prénom.
- Photo ou avatar, au choix de l'utilisateur.
- Statut ou intention actuelle.

**Informations facultatives**
- Âge.
- Courte présentation.
- Centres d'intérêt.
- Distance approximative, selon les règles de visibilité.

**Informations privées**
- Numéro de téléphone.
- Coordonnées GPS exactes.

### 4.2 Contrôle de visibilité

Chaque champ facultatif possède son propre réglage de visibilité. L'utilisateur peut, par exemple, afficher son âge tout en masquant sa présentation.

### 4.3 Distance affichée

La distance est approximative, avec des indications par plages (par exemple « à moins de 25 m », « environ 50 m », « environ 100 m » ou « environ 250 m »).

- La distance exacte n'est jamais exposée.
- Les coordonnées exactes ne sont jamais exposées.
- Les indications successives ne doivent pas permettre de trianguler ou de reconstruire la position exacte d'une personne.

## 5. Localisation — B-03

### 5.1 Acquisition et usage

- Le GPS fournit automatiquement une position de référence lorsque la présence est active et que les permissions nécessaires sont accordées.
- La position exacte est utilisée temporairement pour le calcul de proximité.
- Aucune conservation durable des coordonnées exactes et aucun historique de déplacement ne sont prévus.
- Aucune coordonnée exacte n'est partagée avec les autres utilisateurs.

### 5.2 Permissions et fonctionnement en arrière-plan

- La localisation précise est nécessaire pour être visible dans Réel.
- Une permission de localisation approximative seule ne rend pas le profil visible.
- L'utilisateur a choisi un fonctionnement adapté aux possibilités du système : actualisation au premier plan et actualisation en arrière-plan lorsque l'OS et les permissions le permettent.
- La permission d'arrière-plan n'est pas obligatoire pour utiliser Réel.
- Le comportement réel doit respecter les restrictions Android et iOS ; aucune actualisation continue ininterrompue ne doit être promise.

### 5.3 Perte temporaire du signal

- En cas de perte temporaire du GPS, la dernière position fiable peut être utilisée pendant une tolérance maximale de **2 minutes**.
- Si aucune nouvelle position fiable n'est obtenue dans ce délai, le profil est masqué de la découverte.
- La présence reste active.
- La visibilité revient dès qu'une nouvelle position fiable est disponible.
- La tolérance de 2 minutes repose uniquement sur une donnée éphémère ou un cache à durée strictement limitée ; elle ne constitue pas un historique de localisation.

## 6. Consultation d'un profil — C-01

**Décision fonctionnelle déjà établie**

La fiche Réel est intermédiaire et simple, et non un dossier personnel détaillé.

Elle peut présenter :
- le nom affiché ou le prénom ;
- la photo ou l'avatar ;
- le statut ou l'intention actuelle ;
- l'âge, la présentation courte et les centres d'intérêt uniquement si ces champs sont renseignés et visibles ;
- la distance approximative selon les règles de confidentialité.

Avant connexion :
- aucune conversation directe ;
- aucun accès au numéro de téléphone ;
- aucun accès aux coordonnées GPS exactes ;
- aucun accès aux champs masqués ou privés.

Les actions de signalement et de blocage doivent respecter les règles de sécurité et les autorisations applicables. La prise de contact suit le parcours C-02.

## 7. Prise de contact — C-02

### 7.1 Envoi de la demande — C-02.1

**Validé : demande simple, sans message d'accompagnement.**

- L'action est déclenchée par le bouton **« Ça m'intéresse »**.
- Aucun texte libre n'est joint à la demande.
- Le destinataire peut accepter ou refuser.
- Aucun message direct n'est possible avant acceptation.

### 7.2 Informations visibles par le destinataire — C-02.2

Avant d'accepter ou de refuser, le destinataire peut consulter le profil visible de l'expéditeur :
- nom affiché ou prénom ;
- photo ou avatar ;
- statut ou intention actuelle ;
- distance approximative ;
- champs facultatifs autorisés par les réglages de visibilité de l'expéditeur.

Les coordonnées GPS exactes et le numéro de téléphone restent privés.

### 7.3 Notifications — C-02.3

**Validé :**
- notification dans l'application ;
- notification push si les notifications sont autorisées par le destinataire ;
- aucun rappel automatique si la demande reste sans réponse.

La demande n'expire pas automatiquement.

### 7.4 Refus — C-02.4

**Validé : absence de notification explicite de refus à l'expéditeur.**

- La demande disparaît simplement de l'interface de l'expéditeur.
- Le refus est enregistré côté système afin d'appliquer la règle de délai.
- Après un refus, le même expéditeur ne peut pas adresser une nouvelle demande au même destinataire pendant 24 heures.
- Le délai commence au moment où le refus est effectivement enregistré côté serveur, et non à la création de la demande.
- Le délai est unidirectionnel : le destinataire peut initier une demande en sens inverse.
- L'heure serveur fait foi, et non l'horloge de l'appareil.

### 7.5 Autres règles de demandes déjà validées dans le Groupe A

- L'auteur peut retirer sa demande tant qu'elle est en attente.
- Le destinataire peut accepter ou refuser une demande en attente.
- Une demande refusée ne crée aucune conversation.
- Une demande en attente n'expire pas automatiquement.
- Une seule demande en attente est autorisée entre deux personnes, quel que soit le sens ; une demande inverse est bloquée tant que la première est en attente.
- Le retrait ou le refus est enregistré côté serveur.
- Après retrait, le délai de 24 heures s'applique également à l'auteur de la demande envers le même destinataire ; le délai commence à l'enregistrement serveur du retrait.
- L'acceptation ne peut pas être annulée rétroactivement par un refus.

## 8. Connexions, blocage et fin d'interaction — règles de base du Groupe A

Les règles métier suivantes sont déjà validées et constituent les contraintes applicables aux parties C-03 et C-04 :

- Une connexion acceptée reste active jusqu'à sa suppression volontaire par l'un des deux utilisateurs ou jusqu'au blocage.
- Chacun peut mettre fin unilatéralement et définitivement à une connexion.
- Après la fin de la connexion, celle-ci est inactive pour les deux utilisateurs ; la conversation devient en lecture seule et l'historique reste consultable par les deux.
- Une nouvelle connexion nécessite une nouvelle demande et une nouvelle acceptation.
- Le blocage interrompt les interactions et empêche toute nouvelle interaction.
- Après blocage, la conversation devient immédiatement en lecture seule ; les deux personnes conservent l'accès à l'historique antérieur.
- Le blocage annule immédiatement toutes les demandes en attente entre les deux personnes ; elles ne peuvent plus être acceptées.
- Après déblocage, les interactions peuvent redevenir possibles, mais l'ancienne connexion n'est pas restaurée. L'ancienne conversation reste en lecture seule et son historique reste consultable par les deux personnes.
- Une nouvelle connexion après déblocage exige une nouvelle demande et une nouvelle acceptation ; tout délai de refus ou de retrait encore applicable continue de s'appliquer.

Les décisions fonctionnelles C-04 détaillent ci-dessous la présentation et les actions de ces états. Les règles restent des exigences produit ; leur implémentation et leurs tests ne sont pas vérifiés par ce document.

## 9. Conversation après acceptation — C-03

**Statut fonctionnel : décisions C-03.1 à C-03.9 validées.** Elles définissent le comportement attendu de la V1, sans certifier l'existence des écrans, API, politiques ou tests correspondants.

### C-03.1 — Création et accès
- Après acceptation de « Ça m'intéresse », une conversation est créée automatiquement et devient accessible aux deux personnes.
- Aucun message automatique n'est envoyé lors de sa création.

### C-03.2 — Premier message
- Chacun peut envoyer le premier message immédiatement ; aucun participant n'a de priorité.

### C-03.3 — Types de messages
- V1 autorise uniquement les messages textuels.
- Photos, vidéos, fichiers, messages vocaux, appels audio et appels vidéo sont exclus du périmètre V1.

### C-03.4 — Partage de localisation
- Le partage est volontaire, ponctuel et déclenché explicitement par l'utilisateur.
- Une confirmation explicite est requise avant l'envoi.
- La localisation transmise est une **zone ou position approximative**, jamais le point GPS exact.
- Aucun suivi en direct ni actualisation automatique en arrière-plan n'est déclenché.
- Les coordonnées GPS brutes ne sont pas exposées dans l'interface du destinataire.

### C-03.5 — Notifications
- Une notification in-app est prévue à la réception d'un nouveau message.
- Une notification push est envoyée uniquement si le destinataire l'autorise.
- Aucun rappel automatique de conversation n'est prévu.

### C-03.6 — États des messages
- **Envoyé** : message transmis au serveur.
- **Reçu** : message disponible dans la conversation du destinataire.
- **Lu** : le destinataire ouvre la conversation et le message est affiché.
- Aucun indicateur de saisie n'est prévu en V1.

### C-03.7 — Modification et retrait d'affichage
- Un message envoyé n'est pas modifiable.
- Son auteur peut le retirer de son propre affichage.
- Cette action ne supprime pas la copie déjà reçue par le destinataire.
- Aucun effacement « pour tout le monde » n'est prévu.
- La rétention technique côté serveur reste à définir ; masquer un message dans l'interface ne prouve pas son effacement serveur.

### C-03.8 — Limite et cadence
- Un message est limité à **1 000 caractères**.
- Plusieurs messages successifs sont autorisés.
- Des protections anti-spam et limites de cadence sont nécessaires ; leurs seuils exacts restent ouverts et doivent être spécifiés avant implémentation.

### C-03.9 — Signalement
- Un utilisateur peut signaler un message ou un comportement depuis la conversation.
- Le signalement utilise des catégories prédéfinies et est transmis pour examen.
- Un signalement ne déclenche pas automatiquement un blocage ; le blocage reste une action distincte.
- Les détails du signalement ne sont pas communiqués à la personne signalée.

## 10. Fin d'interaction et états de l'interface — C-04

**Statut fonctionnel : décisions C-04.1 à C-04.5 validées.** Les règles métier et l'expérience attendue sont définies ; le runtime et les contrôles restent à vérifier.

### C-04.1 — Conversation en lecture seule
Après fin de connexion ou blocage :
- la conversation reste accessible aux deux personnes ;
- les messages antérieurs restent consultables ;
- la zone de saisie est supprimée ou désactivée ;
- un texte informatif indique que l'envoi n'est plus disponible ;
- aucune nouvelle prise de contact ne peut être initiée depuis cette ancienne conversation.

### C-04.2 — Fin volontaire d'une connexion
- L'utilisateur doit confirmer la fin de connexion.
- La confirmation explique que la connexion prend fin définitivement et que la conversation passe en lecture seule.
- Après confirmation, l'ancienne connexion ne peut pas être réactivée.
- Une nouvelle connexion exige une nouvelle demande et une nouvelle acceptation.

### C-04.3 — Blocage
- Le blocage demande une confirmation.
- Il annule immédiatement les demandes en attente entre les deux personnes.
- La conversation passe immédiatement en lecture seule et l'historique reste consultable.
- Aucun nouveau message ni aucune nouvelle interaction ne sont permis.
- La personne bloquée ne reçoit pas de notification explicite indiquant qu'elle a été bloquée.

### C-04.4 — Déblocage
- Le déblocage est effectué depuis la liste des personnes bloquées.
- Il ne restaure pas l'ancienne connexion.
- L'ancienne conversation reste en lecture seule et son historique consultable.
- Une nouvelle demande puis une acceptation sont nécessaires pour recréer une connexion.
- Tout délai de refus ou de retrait encore applicable continue de s'appliquer.

### C-04.5 — Découverte après fin ou blocage
- Après fin de connexion ou blocage, les personnes ne figurent plus dans les connexions actives l'une de l'autre ; l'historique reste consultable.
- L'ancienne connexion ne donne plus accès au statut ou à la présence Réel de l'autre.
- Une simple fin de connexion n'interdit pas une redécouverte fortuite dans Réel si les deux profils sont de nouveau visibles et éligibles.
- Un blocage empêche la découverte réciproque et toute interaction tant qu'il reste actif.

**Texte neutre validé après blocage ou fin d'interaction :** « Cette conversation n'est plus disponible pour l'envoi de messages. » Ce texte ne révèle pas explicitement l'existence d'un blocage.

## 11. Exigences techniques à vérifier

Ces exigences découlent des décisions fonctionnelles ; elles ne sont pas une preuve de réalisation.

- Transactions serveur atomiques pour le remplacement de statut.
- Contrôles de concurrence et de propriété lors de la confirmation.
- Horodatage serveur pour les délais de 24 heures.
- Unicité d'une demande en attente par paire d'utilisateurs, indépendamment du sens.
- Application serveur des règles d'acceptation, de refus, de retrait, de blocage et de fin de connexion.
- Autorisations garantissant la lecture seule après blocage ou fin de connexion.
- Protection des coordonnées exactes et absence de stockage durable ou d'historique.
- Expiration effective du cache temporaire de localisation à 2 minutes au maximum.
- Respect des permissions et restrictions Android/iOS pour la localisation en arrière-plan.
- Prévention de la triangulation à partir des distances approximatives.
- Vérification des notifications in-app et push, avec respect des préférences système.
- Tests de concurrence, de sécurité, de confidentialité, de réseau dégradé et de reprise.

## 12. Matrice de statut documentaire

| Domaine | Décision fonctionnelle | Statut |
| --- | --- | --- |
| Présence et statuts | Règles du Groupe A | Validées |
| Rayons de découverte | 10 m à 1 km, défaut 50 m, mémorisation du choix | Validées |
| Profil et visibilité | Profil intermédiaire, champs facultatifs indépendants | Validées |
| Localisation | Position temporaire, tolérance 2 minutes, permissions adaptées à l'OS | Validées |
| Consultation du profil | Fiche simple, données visibles selon confidentialité | Définie antérieurement |
| Prise de contact | Demande simple, « Ça m'intéresse », sans message | Validée |
| Informations avant acceptation | Profil visible, statut et distance approximative | Validées |
| Notifications de demande | In-app et push si autorisée, sans rappel automatique | Validées |
| Refus | Pas de notification explicite à l'expéditeur ; délai de 24 h côté serveur | Validé |
| Conversation | C-03.1 à C-03.9 : création, texte seul, localisation approximative volontaire, états, limites et signalement | Décisions fonctionnelles validées ; seuils anti-spam et rétention technique ouverts |
| Fin d'interaction | C-04.1 à C-04.5 : lecture seule, fin, blocage, déblocage et découverte | Décisions fonctionnelles validées ; implémentation non vérifiée |
| Implémentation et tests | À confronter au code, aux contrats, aux politiques et aux tests | Non vérifiés ici |

## 13. Historique des décisions

- **Groupe A :** règles de présence, statuts, demandes, connexions, blocage et fin de connexion ; décisions fonctionnelles clôturées.
- **Groupe B :** rayon de découverte, profil, visibilité et localisation ; décisions fonctionnelles clôturées.
- **C-01 :** consultation du profil ; règle de fiche intermédiaire déjà établie.
- **C-02.1 :** demande simple sans message d'accompagnement.
- **C-02.2 :** profil visible, statut et distance approximative accessibles au destinataire avant acceptation.
- **C-02.3 :** notification in-app et push si autorisée ; pas de rappel automatique.
- **C-02.4 :** aucune notification explicite de refus à l'expéditeur.
- **C-03.1 à C-03.9 :** conversation textuelle, localisation approximative volontaire, notifications, états, retrait d'affichage, limites et signalement — décisions validées.
- **C-04.1 à C-04.5 :** lecture seule, fin définitive, blocage, déblocage et règles de découverte — décisions validées.
- **P-01 à P-04 :** texte neutre, localisation approximative, retrait d'affichage sans effacement global garanti et expiration du statut sans historique visible — décisions validées.
- **Implémentation et tests :** non vérifiés dans cette spécification.
