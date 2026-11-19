# Flash — règle de déverrouillage du Dashboard V1

**Statut :** Décision produit validée, mise en œuvre et validation à suivre  
**Branche :** `scan-phase-a-interpreter`

## Règle

Un nouvel utilisateur, utilisateur non reconnu ou utilisateur non inscrit ne doit pas accéder au Dashboard de gestion Flash avant d'avoir créé et enregistré avec succès ou publié avec succès au moins un Flash. L'entrée initiale Flash doit inviter à créer un Flash; le dashboard n'est pas un écran vide à explorer en premier.

## Parcours

1. Entrée dans Flash : expérience Découvrir et invitation à créer; pas de dashboard.
2. L'utilisateur lance le composer, exprime son besoin ou son offre, puis vérifie et ajuste les informations.
3. Avant publication, les exigences de publication sont contrôlées. Les champs requis pour publier sont distincts des champs facultatifs du brouillon.
4. Deux choix de fin de parcours sont prévus :
   - **Publier** : seulement si les validations nécessaires sont remplies et si le serveur accepte et confirme la publication. Le dashboard s'ouvre sur ce Flash avec statut actif confirmé.
   - **Enregistrer dans mon espace** : enregistrer le brouillon de manière persistante. Le dashboard s'ouvre sur ce Flash avec statut brouillon/non publié.
5. Les deux résultats confirmés débloquent le dashboard. Il gère ensuite l'ensemble des Flashs de l'utilisateur : tri chronologique, états, détails, médias/fichiers, interactions, événements et actions — uniquement lorsqu'ils sont réellement disponibles et connectés.

## Conditions de sécurité et d'expérience

- Aucun dashboard accessible par navigation directe ou onglet avant la création réussie du premier Flash.
- Ne pas accorder de droits de membre à un invité ou à un utilisateur non reconnu. Ne pas exposer d'identifiant temporaire d'invité.
- Le droit d'accès au dashboard après reconnexion se déduit de Flashs persistés appartenant au compte autorisé, pas d'un état UI temporaire.
- Une sauvegarde échouée, une erreur, un timeout ou un enregistrement non persistant ne débloque pas l'espace.
- Un brouillon sauvegardé n'est pas publié, n'est pas visible dans Découvrir et n'affiche pas de métriques de diffusion.
- Le dashboard est l'espace de gestion, pas une deuxième interface de composition. Il peut proposer la création d'un autre Flash après déverrouillage.
- La première utilisation reste vivante, claire et pédagogique; si le dashboard est déverrouillé mais sans données disponibles (p. ex. changement d'appareil avant synchronisation), expliquer le contexte et les actions possibles, jamais afficher une page morte.

## État technique actuel / limitation

La création et la sauvegarde locale de brouillons existent. Le composer ne réalise pas encore la publication distante : ne pas ajouter de faux bouton « Publier » ni faire croire à un Flash actif. Le verrou d'accès et la restauration depuis les Flashs persistés sont désormais implémentés sur la branche. La validation complète reste en attente des tests du workflow Quality et des tests de parcours. La publication distante reste non disponible.

## Tests d'acceptation

- [ ] Nouveau compte sans Flash : Dashboard inaccessible; expérience de création proposée.
- [ ] Utilisateur non connecté/non reconnu : aucune vue de gestion membre ni droits de membre.
- [ ] Brouillon sauvegardé avec succès : dashboard déverrouillé et Flash visible avec statut brouillon.
- [ ] Sauvegarde en échec/offline : aucun déverrouillage faux; message humain et action de reprise.
- [ ] Compte existant avec Flashs persistés : accès Dashboard restauré au chargement.
- [ ] Publication : aucun déverrouillage ou statut actif avant confirmation serveur; lorsqu'elle sera activée, ouvre dashboard sur Flash actif.
- [ ] Accès direct à la route/onglet Dashboard avant première création : bloqué ou redirigé vers la création.
- [ ] Pas de données d'exemple présentées comme Flashs réels ni de droits invités assimilés à des membres.

## Statuts et regroupement chronologique à ne pas confondre

Le contrat Flash actuel définit les états `draft`, `live`, `expired` et `archived`. Il n'existe pas de statut canonique `disabled` distinct. Le dashboard ne doit donc pas inventer un badge « désactivé » ni assimiler « archivé » à « désactivé »; un véritable état désactivé nécessitera une décision de cycle de vie et des contrats métier.

Le regroupement temporel utilise les jours locaux (aujourd'hui, hier, il y a deux jours), puis la semaine civile en cours, la semaine civile précédente et les plus anciens. Les limites de semaines sont lundi–dimanche; ne pas étiqueter un intervalle roulant de 3 à 6 jours comme « semaine dernière ».

Les catégories temporelles sont exclusives : les groupes relatifs « aujourd'hui », « hier » et « il y a deux jours » priment, et les Flashs de ces dates sont exclus des groupes de semaines même lorsque ces dates tombent sur la semaine précédente. Un Flash ne doit apparaître que dans une seule section.

## Audit des pièces jointes — état de l'accès réel

- Le Flash conserve `mediaIds` et le contrat `MediaRecord` contient `kind`, `state`, `remotePath`, `mimeType`, `byteSize`, `width` et `height`.
- Le dashboard lit les métadonnées locales du repository média et présente le type, le MIME et l'état (`local`, `uploading`, `remote`, `failed`) des références associées à un Flash. Les métadonnées manquantes sont signalées sans inventer de fichier.
- L'audit du code Sync (engine, transport, worker), de la configuration Supabase et des migrations ne révèle pas de pipeline de transfert de médias, de bucket Storage configuré, ni de mécanisme de téléchargement/URL de preview relié au Flash. Le `remotePath` contractuel seul ne prouve pas qu'un fichier a été envoyé ni que l'utilisateur peut le consulter.
- **L'ouverture réelle des médias n'est donc pas activée.** Aucun bouton Preview/Open factice n'est ajouté. Pour rendre cette fonction complète, une prochaine phase doit établir le pipeline upload sécurisé, la validation MIME/taille, les règles de propriété/accès, et un flux de téléchargement/preview autorisé, puis couvrir ces parcours avec tests.
