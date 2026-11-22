# Réconciliation des fondations — moteur Réel

**Version :** 0.2 — 9 novembre 2026  
**Périmètre :** comparaison des 14 documents initiaux avec les décisions et précisions déjà formulées dans les échanges produit.  
**Statut :** audit documentaire en cours ; ce document ne vaut ni validation technique ni preuve d'implémentation.

## 1. Objectif et méthode

Cette réconciliation vise à éviter la perte de décisions, les contradictions entre fichiers et la transformation involontaire d'une proposition en règle validée.

Les statuts employés :
- **COUVERT** : le document existant représente correctement la décision.
- **À COMPLÉTER** : la décision existe, mais sa formulation ou ses conséquences sont insuffisamment décrites.
- **À CLARIFIER** : un élément a été évoqué, mais sa portée exacte ne doit pas être déduite.
- **NON ARBITRÉ** : aucune décision suffisamment explicite n'a été retrouvée.

Une règle fonctionnelle validée ne signifie pas que son implémentation est réalisée.

## 2. Réconciliation des décisions produit

| Domaine | Décision ou précision retrouvée | État dans la base v0.1 | Action documentaire |
|---|---|---|---|
| Vision | Réel signifie « la maintenant et tout de suite » ; présence locale et intention immédiate. | COUVERT | Conserver. |
| Positionnement | Réel est distinct de Flash et n'est pas un fil de publications. | COUVERT | Conserver. |
| Présence | Activation manuelle et volontaire. | COUVERT | Conserver. |
| Localisation | La position actuelle est partagée volontairement. | COUVERT | Préciser les états de permission et de perte de localisation. |
| Statut | Un seul statut/intention actif à la fois. | COUVERT | Conserver. |
| Durée du statut | Choix parmi 30 min, 1 h, 2 h, 3 h, 6 h, 12 h ou 24 h ; pas de durée personnalisée ; suppression à expiration. | COUVERT en partie | Ajouter explicitement l'absence de durée personnalisée. |
| Rayon | Rayon choisi par l'utilisateur, jusqu'à 1 km ; paliers courts 10, 25, 50 et 100 m ; des distances supérieures sont possibles. | COUVERT | Les paliers au-delà de 100 m et le rayon initial restent à arbitrer. |
| Intention | Expression simple, contextualisée et immédiate. | À COMPLÉTER | Définir les champs, limites et validations sans inventer de format. |
| Profil | Le profil associé à la présence est facultatif ; le profil de l'émetteur d'un bip peut être consulté avant décision. | À COMPLÉTER | Distinguer profil facultatif dans la présence et consultation d'un profil existant. |
| Écran Réel | Profil de l'utilisateur au centre ; zone représentée autour de lui ; profils proches visibles autour et cliquables. | À COMPLÉTER | Décrire le centre, les rayons/repères visuels et les profils. |
| Regroupement | Plusieurs profils au même endroit peuvent être regroupés avec un indicateur numérique (ex. 5 ou 6). | COUVERT en partie | Préciser le comportement d'ouverture du groupe et les limites d'affichage. |
| Bips | Réception/consultation des bips uniquement lorsque l'utilisateur est actif dans Réel. | COUVERT | Conserver cette règle sans l'étendre à la présence inactive. |
| Décision sur un bip | L'auteur peut consulter le profil de l'émetteur puis accepter directement depuis la liste, sans renvoyer de bip. | COUVERT | Conserver. |
| Expiration des bips | Un bip non accepté est conservé 24 h, même si Réel est fermé, puis expire. | COUVERT | Le point de départ exact des 24 h reste NON ARBITRÉ. |
| Mise en relation | Une acceptation crée la mise en relation. | COUVERT | Détailler les états et les cas concurrents. |
| Accès | Les mises en relation acceptées sont accessibles dans deux emplacements : compteur de Réel et Notifications ; pas d'espace autonome supplémentaire « Temps réel ». | COUVERT | Conserver exactement ces deux emplacements. |
| Contact après acceptation | La possibilité de poursuivre le contact après acceptation est un choix, et non une messagerie libre automatique. | À CLARIFIER | Préciser qui choisit, à quel moment et quelle action active la communication. |
| Communication | Communication de type texte ; elle reste rattachée à une mise en relation/action autorisée ; pas de messagerie libre indépendante. | À COMPLÉTER | Porter le texte comme format retenu dans le périmètre de travail V1, sous réserve de préciser les limites (pièces jointes, modération, etc.). |
| Clôture | Confirmation obligatoire ; la clôture demandée par un participant s'applique aux deux. | COUVERT | Conserver. |
| Effets de clôture | Communication désactivée, retrait immédiat des deux emplacements pour les deux participants, information de l'autre participant. | COUVERT | Conserver et tester comme une seule transition cohérente. |
| Historique | Pas d'historique de conversation ni d'historique visible de mise en relation clôturée. | COUVERT | Conserver. |
| Trace | Métadonnées minimales : date, statut, événement ; pas de contenu de conversation. | COUVERT | Durée de conservation et droits d'accès restent à arbitrer. |
| Réseau | Préserver les actions en attente puis synchroniser au retour du réseau ; éviter doublons et incohérences. | COUVERT en partie | Définir les états locaux/serveur et les règles de reprise. |

## 3. Points de vigilance et ambiguïtés

1. **Deux temporalités différentes :** les 24 h concernent les bips non acceptés. Elles ne doivent pas être appliquées automatiquement aux mises en relation acceptées.
2. **Mise en relation acceptée :** elle reste accessible dans les deux emplacements jusqu'à sa clôture selon la décision actuelle. Sa durée maximale avant clôture n'est pas fixée.
3. **Profil facultatif :** ne pas confondre le caractère facultatif du profil associé à une présence avec la possibilité de consulter le profil d'une personne qui a envoyé un bip.
4. **Contact après acceptation :** le choix de poursuivre le contact doit être explicité dans le parcours ; l'acceptation ne doit pas être interprétée comme l'autorisation d'une messagerie autonome.
5. **Visualisation radiale :** elle doit représenter une zone de proximité et non promettre une précision géographique que le système ne peut garantir.
6. **Hors ligne :** une action en attente localement ne doit jamais être présentée comme acceptée ou confirmée par le serveur.
7. **Clôture hors ligne :** la clôture bilatérale doit rester cohérente même si l'autre participant est momentanément déconnecté.

## 4. Questions à conserver ouvertes

Les éléments suivants ne sont pas tranchés par cette réconciliation :
- origine exacte du délai de 24 h d'un bip ;
- comportement du refus, de l'annulation et des bips répétés ;
- durée de vie d'une mise en relation acceptée non clôturée ;
- effet de la désactivation de présence ou de l'expiration du statut sur une mise en relation active ;
- rayon par défaut et paliers au-delà de 100 m ;
- règles de regroupement, chevauchement et représentation des profils ;
- longueur, catégories et règles de validation/modération d'une intention ;
- moment et acteur du choix de poursuivre le contact après acceptation ;
- périmètre exact du texte en V1 ;
- blocage, signalement, anti-spam et limites de fréquence ;
- catalogue complet des notifications ;
- comportement détaillé des permissions, de la localisation et des reprises réseau ;
- conservation, accès et purge des traces techniques ;
- contrats API, modèle de données, autorisations et stratégie d'idempotence.

La question de la prévisualisation d'un nombre fixe d'avatars ne doit pas être considérée comme validée tant qu'une décision explicite n'est pas retrouvée.

## 5. Ordre de mise à jour recommandé

1. Mettre à jour le vocabulaire et l'inventaire fonctionnel pour refléter les décisions confirmées.
2. Aligner les règles V1 et le registre des décisions sur ces mêmes formulations.
3. Compléter les parcours UX et la communication, notamment le profil facultatif et le choix de contact après acceptation.
4. Aligner confidentialité, architecture et scénarios de test sur les règles de cycle de vie et de reprise réseau.
5. Repasser les questions ouvertes pour supprimer uniquement celles qui ont été explicitement tranchées.

## 6. Critère de sortie de la réconciliation

La fondation sera considérée comme réconciliée lorsque :
- chaque décision confirmée possède une formulation unique et cohérente dans les documents concernés ;
- chaque règle possède un identifiant stable et des scénarios de validation associés ;
- les points non arbitrés restent explicitement ouverts ;
- aucune proposition n'est présentée comme une décision validée ;
- aucune fonctionnalité documentaire n'est présentée comme implémentée sans preuve.

**Aucune modification du code applicatif n'est incluse dans cette étape.**
