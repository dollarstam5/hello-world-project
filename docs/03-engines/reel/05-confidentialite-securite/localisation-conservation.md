# Confidentialité, localisation et conservation

## Modes d'accès et identité

Réel propose un mode invité sans compte Vitalis et un mode complet avec compte. Les deux modes disposent des mêmes privilèges fonctionnels.

En mode invité, l'absence de compte permanent ne dispense pas le système de distinguer les sessions et de sécuriser les actions. Un identifiant temporaire de session devra être conçu. Il ne doit pas être confondu avec les coordonnées de localisation ni avec une identité civile. Sa génération, sa durée de vie, son renouvellement, sa révocation et un éventuel rattachement ultérieur à un compte restent à spécifier.

L'avatar personnalisé du mode invité est un élément de représentation ; il ne constitue pas à lui seul une preuve d'identité.

## Présence et localisation

Présence manuelle et volontaire ; partage volontaire de la localisation ; rayon personnalisable jusqu'à 1 km. Les coordonnées de position peuvent contribuer au calcul de proximité et à la représentation des présences, mais ne doivent pas être utilisées comme identifiant unique d'un utilisateur ou d'une session.

À spécifier : permissions, refus, précision, fréquence, protection contre la triangulation, perte de localisation, minimisation des données, durée de conservation et purge. L'interface doit expliquer la permission demandée et permettre à l'utilisateur de comprendre quand sa présence est visible.

## Durées

Présence : 30 min, 1 h, 2 h, 3 h, 6 h, 12 h, 24 h. À expiration, le statut est supprimé.

## Historique selon le mode d'accès

- **Compte Vitalis :** l'historique personnel de Réel conserve les bips, les mises en relation et les interactions passées associées, y compris les événements liés à une mise en relation clôturée.
- **Mode invité :** aucune histoire personnelle persistante. Les données personnelles liées à la session disparaissent à la fin de celle-ci, sous réserve des traces techniques minimales nécessaires et séparées.
- L'historique des comptes Vitalis comprend les événements et les conversations selon les règles de conservation suivantes : une conversation est archivée après 3 mois, ou plus tôt dès que le plafond de 50 conversations conservées est dépassé (la plus ancienne est alors archivée).
- L'utilisateur peut supprimer son historique, mais ne peut pas l'exporter. Une archive est inaccessible à l'utilisateur, sauf accès exceptionnel demandé par celui-ci et autorisé par un administrateur pour 24 heures. Une archive est conservée pendant 6 mois à compter de son archivage, puis supprimée définitivement selon la politique de purge. Les délais d'effacement technique des sauvegardes éventuelles et les obligations légales applicables restent à vérifier.

## Bips non acceptés

Un bip non accepté reste actif pendant 24 h, même après fermeture de Réel, puis expire en tant qu'action. Pour un compte Vitalis, son événement reste consultable dans l'historique après expiration. Le point de départ exact du délai reste à définir.

## Mises en relation acceptées

Accès dans deux emplacements. À la clôture, retrait immédiat des deux espaces pour les deux participants. Ne pas confondre le délai des bips non acceptés avec la durée de vie des mises en relation acceptées.

## Clôture et traces

La clôture retire la mise en relation des espaces actifs des deux participants et désactive la communication. Pour les comptes Vitalis, l'événement et la mise en relation passée restent consultables dans l'historique ; cette conservation ne réactive pas la relation. Le contenu des conversations est soumis à cette durée de conservation et à ces règles d'accès ; il n'est pas conservé indéfiniment.

Les traces techniques minimales (date, statut, événement) restent distinctes de l'historique visible. Leur durée de conservation, les accès autorisés, la pseudonymisation et les modalités de suppression restent à préciser.

## Sécurité à spécifier

Authentification ou validation adaptée à chaque mode, autorisation, contrôle d'accès aux profils et mises en relation, autorité serveur, prévention des abus, blocage/signalement, limitation de débit, validation des intentions et audit des événements sensibles.

Aucune implémentation de sécurité n'est prouvée par ce document.


## Quotas et contrainte économique V1

Chaque espace Vitalis est soumis à un plafond gratuit de stockage. À saturation, l'utilisateur choisit entre supprimer des données ou limiter les nouveaux usages/enregistrements de l'espace concerné. Aucun paiement ou supplément de stockage n'est proposé en V1 ; les micro-paiements et extensions facultatives sont réservés à V2.

Les plafonds individuels par espace doivent respecter un plafond global strict du projet Supabase Cloud. La V1 vise zéro coût récurrent obligatoire ou un coût quasi nul strictement maîtrisé ; les quotas et marges doivent être calculés selon les limites gratuites effectivement disponibles et vérifiés avant lancement. Il ne s'agit pas d'une promesse de stockage illimité ou de gratuité garantie indépendamment des conditions du fournisseur.

L'accès administrateur exceptionnel aux archives doit être limité au strict nécessaire et journalisé.


## Proposition de quotas gratuits V1 — à valider après mesure

Proposition de budget logique par compte, réparti entre les espaces (il ne s'agit pas d'une réservation physique de capacité dans Supabase) :

| Espace | Quota indicatif par compte |
|---|---:|
| Profil et avatar | 2 Mo, dont avatar limité à 500 Ko |
| Réel | 5 Mo |
| Flash | 3 Mo |
| Scan | 1 Mo |
| Radar | 1 Mo |
| Notifications | 1 Mo |
| Données personnelles et préférences communes | 2 Mo |
| **Total indicatif** | **15 Mo** |

Cette répartition est une proposition de départ pour une V1 légère, principalement textuelle. Les médias lourds et les vidéos ne sont pas prévus ; les résultats Scan doivent privilégier les données structurées et métadonnées. Les quotas devront être validés par des mesures de consommation et par les spécifications des autres moteurs. Ils ne garantissent pas que chaque compte pourra consommer la totalité de son quota si le plafond global est atteint.

## Proposition de garde-fous globaux Supabase Cloud — à valider

Sur la base des quotas Free documentés au moment de la rédaction (à revérifier avant lancement), proposition de plafonds internes conservateurs :

| Ressource | Quota Free documenté | Seuil interne proposé |
|---|---:|---:|
| Base de données par projet | 500 Mo | 350 Mo |
| Stockage fichiers | 1 Go | 700 Mo |
| Egress non mis en cache / mois | 5 Go | 3,5 Go |
| Egress mis en cache / mois | 5 Go | 3,5 Go |
| Messages Realtime / mois | 2 millions | 1,4 million |
| Connexions simultanées | 200 | 140 |

Proposition de réaction : à 50 %, avertissement et surveillance renforcée ; à 65 %, limitation des opérations non essentielles ; à 70 %, suspension des nouvelles écritures non indispensables et information de l'utilisateur, sans effacer silencieusement ses données ni perdre les actions hors ligne en attente. Ces seuils sont des garde-fous applicatifs proposés, pas des limites imposées automatiquement par Supabase.

Attention : le plan Free Supabase peut mettre en pause un projet après une semaine d'inactivité et ne doit pas être assimilé à une garantie de disponibilité ou de sauvegarde de production. Le choix de disponibilité V1 doit être validé avant lancement.
