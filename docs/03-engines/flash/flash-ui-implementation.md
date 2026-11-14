# Flash — expérience d'interface V1

**Statut :** parcours brouillon-first implémenté ; clôture de la phase A en cours de vérification  
**Domaine :** `src/domains/flash/`  
**Route :** `/flash`  
**Référence de travail :** branche `feat/flash-engine-experience-reconciled` ; contrôles à confirmer sur le dernier commit

## Intention de l'écran

Flash aide une personne à exprimer rapidement un besoin ou une proposition, à vérifier et corriger les informations proposées, puis à enregistrer un brouillon local. L'enregistrement local ne constitue jamais une publication. La publication distante reste désactivée tant que le contrat serveur atomique et le filtrage géographique ne sont pas validés.

## Organisation de la page

1. **En-tête Flash** : identité du moteur et retour vers l'accueil.
2. **Action centrale** : bouton « Démarrer un Flash » qui ouvre le parcours de création.
3. **Deux espaces** : « Découvrir » pour les Flash accessibles et les exemples explicitement identifiés ; « Mes Flashs » pour les enregistrements locaux du compte connecté.
4. **Navigation** : la navigation principale de l'application reste celle du shell courant.

## Parcours de création actuellement implémenté

### Étape 1 — Exprimer

- Saisie libre, limitée à 600 caractères ; aucun formulaire long.
- Dictée vocale si le navigateur expose Web Speech Recognition. Si cette capacité manque ou si la permission est refusée, la saisie texte reste disponible.
- Le texte est analysé localement par `parseFlashIntent`. L'analyse est déterministe et fondée sur des règles ; elle ne dépend pas d'un service IA distant.
- Des exemples reconnus incluent notamment la garde d'enfants, le déménagement, le transport et des repères temporels.
- Le parseur fournit toujours une proposition à partir de trois caractères. Pour un texte ambigu, il peut retomber sur « offre », « autre » et « aujourd'hui ». Ce résultat doit être compris comme une suggestion modifiable, pas comme une certitude. L'interface doit rendre cette distinction suffisamment claire avant clôture de la phase A.

### Étape 2 — Vérifier et enregistrer

La personne peut corriger séparément :
- le type (besoin ou offre) ;
- la catégorie ;
- le moment ;
- la portée ;
- l'urgence ;
- le libellé de zone, lorsqu'il est fourni.

La portée et l'urgence sont actuellement requises pour enregistrer le brouillon. Le texte doit être non vide et un compte connecté est nécessaire. La zone et la géolocalisation sont facultatives pour cette sauvegarde.

Le bouton final appelle `createFlash`, qui écrit un enregistrement local avec le statut `draft`. Le message de confirmation indique qu'un brouillon a été enregistré ; il ne dit pas que le Flash est publié. Après succès, l'écran bascule vers « Mes Flashs ».

## Localisation — facultative pour un brouillon

- La personne peut demander explicitement la détection de sa position depuis l'étape de vérification.
- La demande utilise l'API de géolocalisation du navigateur ; le géocodage inverse n'est appelé qu'après cette action et transmet explicitement `consent: true`.
- Le libellé obtenu peut être corrigé dans le champ de confirmation.
- En cas d'échec GPS ou Geoapify, l'enregistrement du brouillon reste possible sans libellé de zone.
- Les coordonnées précises ne sont pas ajoutées au contenu du brouillon par `createFlash`.

La localisation facultative de ce parcours ne doit pas être confondue avec le futur parcours de publication géographique de la phase B.

## « Mes Flashs »

- La liste lit les enregistrements de la base locale et filtre par propriétaire connecté.
- L'écoute des événements d'authentification actualise l'identité affichée lors d'une connexion ou déconnexion.
- Les actions d'édition, d'archivage et de suppression existent ; l'archivage exige une confirmation positive de la RPC.
- Les enregistrements sont regroupés par statut résolu : brouillon, actif, expiré et archivé ; chaque groupe affiche son nombre d'éléments.
- Les actions suivent le statut résolu : l'archivage n'est proposé que pour un Flash actif ; l'édition est désactivée pour les éléments expirés ou archivés.
- Le parcours de synchronisation doit être vérifié séparément pour confirmer la reprise réseau et l'absence de doublons.

## Découverte et données d'exemple

- La découverte distante utilise le RPC Scan avec la position du visiteur après une action explicite de sa part.
- Les coordonnées précises ne sont pas recopiées dans la projection `PublicFlash`.
- Les données fictives ne complètent les résultats réels qu'après la fin du chargement ou dans les états hors ligne/échec prévus ; chaque fiche fictive doit rester identifiée comme « Exemple ».
- Aucun compteur de vues, de réponses ou de popularité fictif n'est ajouté.
- Les états de chargement, d'erreur et hors ligne restent visibles.

## Limites fonctionnelles à ne pas masquer

La publication distante reste désactivée. L'interface ne doit pas annoncer un Flash comme publié et ne doit pas permettre de contourner l'opération serveur atomique.

Les règles de visibilité par publication, l'affichage sélectif des champs du profil de l'auteur, l'ouverture du profil complet et le mode « découverte de l'expéditeur uniquement » ne sont pas présentés comme des fonctions garanties tant que le contrat, les API et les règles serveur/RLS ne les appliquent pas.

La reconnaissance vocale dépend du navigateur et de ses permissions ; elle ne constitue pas une promesse de traitement vocal universel hors ligne.

## Vérifications restantes avant clôture de la phase A

- [ ] Tests de parcours d'interface : saisie, correction des propositions, validation, sauvegarde et affichage dans « Mes Flashs ».
- [ ] Cas de texte ambigu : suggestion explicitement modifiable et absence de présentation trompeuse comme certitude.
- [ ] Brouillon sans GPS, sans Geoapify et sans libellé de zone.
- [ ] Brouillon hors ligne, synchronisation après reconnexion et absence de doublons.
- [ ] Isolation propriétaire, changement de compte et suppression.
- [x] Regroupement des statuts brouillon/actif/expiré/archivé et cohérence des actions selon le statut résolu (tests automatisés encore à confirmer sur le dernier commit).
- [ ] Parcours clavier, lecteur d'écran, dictée indisponible et petits/grands écrans.
- [ ] Vérification visuelle réelle sur Android et iOS ; les tests CI seuls ne prouvent pas le rendu sur appareil.
- [ ] Documentation et CI à jour sur le dernier commit.

La phase A ne sera déclarée terminée qu'après la levée de ces points et la vérification des résultats sur le commit exact soumis.

## Préparation de la phase B — localisation et portée

La phase B ne doit commencer qu'après clôture formelle de la phase A. Son ordre de travail est :

1. expliquer simplement pourquoi la localisation est utile, puis demander une autorisation explicite ;
2. distinguer permission de localisation, obtention GPS et transfert des coordonnées au service de géocodage ;
3. permettre la confirmation ou la correction du libellé ; ne jamais inventer une localité ;
4. conserver les coordonnées précises dans l'espace privé prévu, sans les exposer dans les projections publiques ou le Sync générique ;
5. appliquer les portées auteur validées : 500 m, 2 km, 5 km et 15 km ;
6. imposer côté serveur la limite effective `LEAST(rayon visiteur, portée auteur)`, sur la distance brute en mètres ;
7. traiter proprement refus GPS, position indisponible, réseau absent, délai dépassé et fournisseur Geoapify indisponible ;
8. ne réactiver la publication publique qu'après validation de la publication atomique, de l'isolation propriétaire et des tests SQL/concurrence.

Le contrat détaillé reste dans `publication-backend-contract.md`. La préparation documentaire ne vaut ni activation de la publication ni exécution d'une migration distante.
