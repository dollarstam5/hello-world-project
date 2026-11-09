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
- L'historique visible porte sur les événements et statuts. Les conversations des comptes Vitalis sont conservées jusqu'à leur archivage : après 3 mois, ou plus tôt dès que le plafond de 50 conversations est dépassé (la plus ancienne est alors archivée).
- L'utilisateur peut supprimer son historique, mais ne peut pas l'exporter. Une archive est inaccessible à l'utilisateur, sauf accès exceptionnel demandé par celui-ci et autorisé par un administrateur pour 24 heures. La durée de conservation des archives après archivage et les délais d'effacement définitif restent à définir.

## Bips non acceptés

Un bip non accepté reste actif pendant 24 h, même après fermeture de Réel, puis expire en tant qu'action. Pour un compte Vitalis, son événement reste consultable dans l'historique après expiration. Le point de départ exact du délai reste à définir.

## Mises en relation acceptées

Accès dans deux emplacements. À la clôture, retrait immédiat des deux espaces pour les deux participants. Ne pas confondre le délai des bips non acceptés avec la durée de vie des mises en relation acceptées.

## Clôture et traces

La clôture retire la mise en relation des espaces actifs des deux participants et désactive la communication. Pour les comptes Vitalis, l'événement et la mise en relation passée restent consultables dans l'historique ; cette conservation ne réactive pas la relation. Le contenu des conversations n'est pas inclus dans l'historique validé.

Les traces techniques minimales (date, statut, événement) restent distinctes de l'historique visible. Leur durée de conservation, les accès autorisés, la pseudonymisation et les modalités de suppression restent à préciser.

## Sécurité à spécifier

Authentification ou validation adaptée à chaque mode, autorisation, contrôle d'accès aux profils et mises en relation, autorité serveur, prévention des abus, blocage/signalement, limitation de débit, validation des intentions et audit des événements sensibles.

Aucune implémentation de sécurité n'est prouvée par ce document.


## Quotas et contrainte économique V1

Chaque espace Vitalis est soumis à un plafond gratuit de stockage. À saturation, l'utilisateur choisit entre supprimer des données ou limiter les nouveaux usages/enregistrements de l'espace concerné. Aucun paiement ou supplément de stockage n'est proposé en V1 ; les micro-paiements et extensions facultatives sont réservés à V2.

Les plafonds individuels par espace doivent respecter un plafond global strict du projet Supabase Cloud. La V1 vise zéro coût récurrent obligatoire ou un coût quasi nul strictement maîtrisé ; les quotas et marges doivent être calculés selon les limites gratuites effectivement disponibles et vérifiés avant lancement. Il ne s'agit pas d'une promesse de stockage illimité ou de gratuité garantie indépendamment des conditions du fournisseur.

L'accès administrateur exceptionnel aux archives doit être limité au strict nécessaire et journalisé.
