# Réel — spécification fonctionnelle V1

**Statut :** spécification fonctionnelle en cours de consolidation.  
**Périmètre :** présence, découverte de personnes à très courte distance, profils, demandes de connexion et interactions Réel.  
**Référence produit :** Vitalis. Les anciennes sources peuvent encore employer le nom « Vitala ».  
**Portée de validation :** les règles marquées « Validée » sont des décisions fonctionnelles prises. Elles ne prouvent pas que le comportement est déjà implémenté ou testé.

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

Les détails de présentation de ces états dans l'interface seront complétés dans C-04.

## 9. Conversation après acceptation — C-03

**À arbitrer.** Les règles de base déjà validées concernant la lecture seule et la conservation de l'historique restent applicables en cas de blocage ou de fin de connexion.

Les points suivants restent à définir avant de considérer C-03 comme complet :
- accès initial à la conversation après acceptation ;
- types de messages autorisés ;
- pièces jointes, médias et limites éventuelles ;
- indicateurs d'envoi, de réception et de lecture ;
- modification ou suppression des messages ;
- notifications de nouveaux messages ;
- comportement hors ligne et synchronisation ;
- règles anti-abus et signalement depuis la conversation.

Aucune de ces options ouvertes ne doit être considérée comme approuvée ou implémentée.

## 10. Fin d'interaction et états de l'interface — C-04

**À compléter.** Les effets métier de la fin de connexion et du blocage énumérés à la section 8 sont déjà validés. C-04 précisera leur traduction dans l'interface, les confirmations, les messages d'état et les actions restantes.

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
| Conversation | Détails du fonctionnement | À arbitrer (C-03) |
| Fin d'interaction | Effets métier de base validés ; détails d'interface restants | Partiellement défini (C-04) |
| Implémentation et tests | À confronter au code, aux contrats, aux politiques et aux tests | Non vérifiés ici |

## 13. Historique des décisions

- **Groupe A :** règles de présence, statuts, demandes, connexions, blocage et fin de connexion ; décisions fonctionnelles clôturées.
- **Groupe B :** rayon de découverte, profil, visibilité et localisation ; décisions fonctionnelles clôturées.
- **C-01 :** consultation du profil ; règle de fiche intermédiaire déjà établie.
- **C-02.1 :** demande simple sans message d'accompagnement.
- **C-02.2 :** profil visible, statut et distance approximative accessibles au destinataire avant acceptation.
- **C-02.3 :** notification in-app et push si autorisée ; pas de rappel automatique.
- **C-02.4 :** aucune notification explicite de refus à l'expéditeur.
- **C-03 et C-04 :** détails à compléter avant clôture du Groupe C.
