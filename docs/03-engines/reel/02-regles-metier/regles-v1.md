# Règles métier V1 — Réel

Les règles ci-dessous reflètent les décisions produit retrouvées. VALIDÉ signifie que la décision fonctionnelle a été acceptée ; cela ne prouve pas son implémentation.

| ID | Règle | Statut |
|---|---|---|
| ACC-001 | Réel propose un mode rapide sans compte Vitalis et un mode complet avec compte Vitalis. | VALIDÉ |
| ACC-002 | Le mode rapide vise un parcours de deux ou trois étapes au maximum, incluant les permissions nécessaires et le choix/la création d'un avatar personnalisé. | VALIDÉ — objectif UX |
| ACC-003 | Le mode invité et le mode avec compte Vitalis disposent des mêmes privilèges fonctionnels dans Réel. | VALIDÉ |
| ACC-004 | Les deux modes permettent les interactions essentielles : publier une intention, découvrir les présences proches, consulter les profils accessibles, envoyer/recevoir des bips, accepter une mise en relation et choisir de poursuivre la communication associée. | VALIDÉ |
| ACC-005 | La différence entre les modes concerne l'identification et la continuité liées au compte, et non les privilèges d'interaction dans Réel. | VALIDÉ |
| ACC-006 | Le mode invité ne doit pas être assimilé à une identité permanente ou à un compte Vitalis. Le mécanisme de session temporaire reste à concevoir. | À CONCEVOIR |
| PRE-001 | La présence est activée et désactivée manuellement par l'utilisateur. | VALIDÉ |
| PRE-002 | Le partage de la localisation est volontaire. | VALIDÉ |
| PRE-003 | Le rayon est personnalisable, dans une limite maximale de 1 km. | VALIDÉ |
| PRE-004 | Les petits rayons proposés comprennent 10 m, 25 m, 50 m et 100 m. | VALIDÉ |
| PRE-005 | Un utilisateur ne peut avoir qu'un seul statut/intention actif à la fois. | VALIDÉ |
| PRE-006 | Les durées prédéfinies sont 30 min, 1 h, 2 h, 3 h, 6 h, 12 h et 24 h. | VALIDÉ |
| PRE-007 | Aucune durée personnalisée n'est prévue dans le périmètre actuellement retenu. | VALIDÉ |
| PRE-008 | À expiration, le statut est supprimé. | VALIDÉ |
| PRE-009 | Le profil détaillé associé à une présence est facultatif. | VALIDÉ |
| INT-001 | Le statut exprime une intention immédiate et contextualisée. | VALIDÉ |
| DEC-001 | Réel est un moteur de présence locale, pas un flux de publications. | VALIDÉ |
| DEC-002 | Le profil de l'utilisateur actif est représenté au centre de l'écran Réel. | VALIDÉ |
| DEC-003 | Les profils proches apparaissent autour du profil central et sont cliquables. | VALIDÉ |
| DEC-004 | Les profils situés dans une même zone peuvent être regroupés avec un indicateur numérique. | VALIDÉ |
| BIP-001 | Les bips sont consultables uniquement lorsque l'utilisateur est actif dans Réel. | VALIDÉ |
| BIP-002 | L'auteur d'une intention peut consulter le profil de l'émetteur avant sa décision. | VALIDÉ |
| BIP-003 | L'auteur peut accepter directement depuis la liste, sans renvoyer de bip. | VALIDÉ |
| BIP-004 | Un bip non accepté est conservé 24 h, même après fermeture de Réel, puis expire. | VALIDÉ |
| MRL-001 | L'acceptation d'un bip crée une mise en relation. | VALIDÉ |
| MRL-002 | Les mises en relation acceptées sont accessibles dans le compteur de Réel et dans Notifications. | VALIDÉ |
| MRL-003 | Aucun espace autonome supplémentaire « Temps réel » n'est prévu. | VALIDÉ |
| MRL-004 | La poursuite du contact après acceptation relève d'un choix ; elle n'est pas assimilée à une messagerie libre automatique. | VALIDÉ |
| MRL-005 | La durée maximale d'une mise en relation acceptée non clôturée n'est pas encore fixée. | À CONFIRMER |
| MRL-006 | La clôture par un participant s'applique aux deux participants. | VALIDÉ |
| MRL-007 | Une confirmation est demandée avant la clôture. | VALIDÉ |
| MRL-008 | La mise en relation disparaît immédiatement des deux emplacements pour les deux participants après clôture confirmée. | VALIDÉ |
| MRL-009 | L'autre participant est informé de la clôture. | VALIDÉ |
| COM-001 | La communication est de type texte dans le périmètre actuellement retenu. | VALIDÉ |
| COM-002 | La communication est rattachée à une mise en relation ou à une action autorisée. | VALIDÉ |
| COM-003 | Il n'existe pas de messagerie libre indépendante. | VALIDÉ |
| COM-004 | La communication associée est désactivée à la clôture. | VALIDÉ |
| HIST-001 | Pour un compte Vitalis, l'historique Réel conserve les bips, les mises en relation et les interactions passées associées. | VALIDÉ |
| HIST-002 | L'historique d'un compte reste distinct des espaces actifs : une mise en relation clôturée disparaît du compteur Réel et de Notifications, mais son entrée historique reste consultable. | VALIDÉ |
| HIST-003 | En mode invité, aucune histoire personnelle persistante n'est conservée ; les données personnelles liées à la session disparaissent à la fin de celle-ci. | VALIDÉ |
| HIST-004 | L'historique validé porte sur les événements et statuts ; la conservation du contenu des conversations n'est pas autorisée par cette décision et reste exclue en l'état. | VALIDÉ — périmètre actuel |
| TRC-001 | Les traces techniques minimales nécessaires à la sécurité et à la cohérence sont distinctes de l'historique visible. | VALIDÉ |
| TRC-002 | La trace technique minimale comprend au moins la date, le statut et l'événement. | VALIDÉ |
| NET-001 | Les actions en attente sont préservées pendant les perturbations réseau et synchronisées au retour de la connexion. | VALIDÉ — principe produit |
| NET-002 | La synchronisation doit éviter doublons et incohérences ; une action locale en attente n'est pas une confirmation serveur. | VALIDÉ — principe produit |

## Garde-fous d'interprétation

- Les deux modes d'accès ont les mêmes privilèges fonctionnels ; ne pas ajouter de restriction de bips, d'acceptation ou de communication au seul mode invité.
- Les 24 h définissent la durée d'action d'un bip non accepté ; pour un compte Vitalis, l'événement du bip reste consultable dans l'historique après expiration.
- L'historique visible d'un compte ne doit pas être confondu avec les espaces actifs : clôturer une mise en relation la retire des espaces actifs, sans effacer son entrée historique.
- Le profil détaillé associé à une présence est facultatif ; cela n'empêche pas la consultation du profil de l'émetteur d'un bip.
- L'acceptation d'un bip et le choix de poursuivre le contact sont deux étapes distinctes.
- La communication est textuelle dans le périmètre retenu, mais ses limites détaillées restent à spécifier.
- L'historique des interactions conserve les événements et statuts, pas le contenu des conversations. Les règles détaillées de contenu, de rétention et de suppression restent à spécifier.
- La clôture est bilatérale, jamais un simple retrait local.
- Les principes réseau sont des exigences produit ; l'architecture et les preuves de leur réalisation restent à établir.


## Règles complémentaires — historique et maîtrise des coûts V1

| ID | Règle | Statut |
|---|---|---|
| HIST-005 | Une conversation d'un compte Vitalis est archivée après 3 mois ; le plafond est de 50 conversations conservées et, dès son dépassement, la plus ancienne est archivée même avant 3 mois. | VALIDÉ |
| HIST-006 | Une conversation archivée est inaccessible à l'utilisateur, sauf demande de celui-ci autorisée par un administrateur pour 24 heures ; après ce délai, elle redevient inaccessible. | VALIDÉ |
| HIST-007 | L'utilisateur peut supprimer son historique, mais ne peut pas l'exporter. | VALIDÉ |
| STO-001 | Chaque espace Vitalis dispose d'un plafond gratuit de stockage en V1 ; les valeurs chiffrées restent à définir. | VALIDÉ — chiffres à définir |
| STO-002 | À saturation, l'utilisateur choisit entre supprimer des données ou limiter les nouveaux usages/enregistrements de l'espace concerné. | VALIDÉ |
| STO-003 | Aucun paiement, abonnement ou supplément de stockage n'est proposé en V1 ; les micro-paiements et extensions facultatives sont réservés à V2. | VALIDÉ |
| STO-004 | Les plafonds individuels doivent respecter les limites globales gratuites réellement disponibles sur Supabase Cloud ; aucune consommation illimitée ni dépense récurrente obligatoire n'est admise comme hypothèse V1. | VALIDÉ — contrainte d'architecture |

La règle antérieure excluant le contenu des conversations de l'historique est remplacée par HIST-005 à HIST-007. La durée de conservation des archives après archivage reste à définir.
