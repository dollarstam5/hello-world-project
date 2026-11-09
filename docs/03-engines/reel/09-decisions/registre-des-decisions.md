# Registre des décisions — Réel

| ID | Décision | Statut |
|---|---|---|
| DEC-001 | Présence locale « la maintenant et tout de suite ». | VALIDÉ |
| DEC-002 | Réel est distinct du flux de publications Flash. | VALIDÉ |
| DEC-003 | Présence manuelle et volontaire. | VALIDÉ |
| DEC-004 | Rayon personnalisable, maximum 1 km. | VALIDÉ |
| DEC-005 | Petits rayons : 10, 25, 50 et 100 m. | VALIDÉ |
| DEC-006 | Un seul statut actif. | VALIDÉ |
| DEC-007 | Durées : 30 min, 1 h, 2 h, 3 h, 6 h, 12 h et 24 h. | VALIDÉ |
| DEC-008 | Pas de durée personnalisée ; suppression du statut à expiration. | VALIDÉ |
| DEC-009 | Profil central, profils proches autour et profils cliquables. | VALIDÉ |
| DEC-010 | Compteurs numériques pour les regroupements de profils. | VALIDÉ |
| DEC-011 | Consultation du profil de l'émetteur avant décision sur un bip. | VALIDÉ |
| DEC-012 | Acceptation directe du bip, sans renvoi. | VALIDÉ |
| DEC-013 | Bips consultables lorsque Réel est actif. | VALIDÉ |
| DEC-014 | Bips non acceptés conservés 24 h, même après fermeture, puis expirés. | VALIDÉ |
| DEC-015 | Mises en relation acceptées accessibles dans deux emplacements. | VALIDÉ |
| DEC-016 | Les deux emplacements sont le compteur Réel et Notifications ; pas d'espace autonome « Temps réel ». | VALIDÉ |
| DEC-017 | Clôture par un participant = clôture pour les deux. | VALIDÉ |
| DEC-018 | Confirmation avant clôture. | VALIDÉ |
| DEC-019 | Retrait immédiat des deux espaces pour les deux participants après clôture confirmée. | VALIDÉ |
| DEC-020 | L'autre participant est informé de la clôture. | VALIDÉ |
| DEC-021 | Communication désactivée après clôture. | VALIDÉ |
| DEC-022 | Trace technique minimale : date, statut, événement. | VALIDÉ |
| DEC-023 | Aucun historique de conversation après clôture. | REMPLACÉE par DEC-037 à DEC-043 |
| DEC-024 | Aucun historique visible de mise en relation clôturée. | VALIDÉ |
| DEC-025 | Le profil détaillé associé à une présence est facultatif. | VALIDÉ |
| DEC-026 | La poursuite du contact après acceptation relève d'un choix distinct de l'acceptation du bip. | VALIDÉ |
| DEC-027 | La communication associée à une mise en relation est de type texte dans le périmètre retenu. | VALIDÉ |
| DEC-028 | Les actions en attente doivent être préservées pendant les perturbations réseau puis synchronisées au retour de la connexion. | VALIDÉ — principe produit |
| DEC-029 | Réel propose deux modes d'accès : mode rapide sans compte Vitalis et mode complet avec compte Vitalis. | VALIDÉ |
| DEC-030 | Les deux modes d'accès disposent des mêmes privilèges fonctionnels dans le moteur Réel. | VALIDÉ |
| DEC-031 | Le mode rapide vise un parcours d'accès en deux ou trois étapes, avec validation des permissions nécessaires et choix/création d'un avatar personnalisé. | VALIDÉ — objectif UX |
| DEC-032 | Les coordonnées de localisation servent au calcul de proximité et non d'identifiant unique d'un utilisateur. | VALIDÉ — garde-fou de conception |


| DEC-033 | Pour un compte Vitalis, l'historique Réel conserve les bips, les mises en relation et les interactions passées associées au moteur. | VALIDÉ |
| DEC-034 | Une mise en relation clôturée disparaît des espaces actifs des deux participants, mais son événement reste consultable dans l'historique de leur compte. | VALIDÉ |
| DEC-035 | En mode invité, aucune histoire personnelle persistante n'est conservée ; les données personnelles liées à la session disparaissent à sa fin. | VALIDÉ |
| DEC-036 | L'historique validé conserve les événements et statuts, pas le contenu des conversations ; ce dernier reste exclu en l'état. | REMPLACÉE par DEC-037 à DEC-043 |

## Historique et distinction des données

L'historique des comptes Vitalis est une chronologie rétrospective des bips, mises en relation et interactions passées. Il ne maintient pas les mises en relation clôturées dans les espaces actifs. Les bips non acceptés expirent comme actions après 24 h, mais leur événement reste dans l'historique du compte. En mode invité, les données personnelles de session ne persistent pas après la fin de la session. Les traces techniques minimales sont séparées de cet historique. La conservation du contenu des conversations n'est pas incluse.

## Clarification temporelle

Une discussion a évoqué une conservation de 12 h ou 24 h pour absorber les perturbations réseau. Les clarifications ultérieures distinguent :
- les bips non acceptés, actifs pendant 24 h puis expirés comme actions, tandis que leur événement reste dans l'historique du compte Vitalis ;
- les mises en relation acceptées, accessibles dans le compteur Réel et Notifications jusqu'à leur clôture, puis conservées comme événements dans l'historique du compte ;
- les traces techniques minimales après clôture, distinctes de l'historique du compte.

La durée de vie d'une mise en relation acceptée non clôturée reste à arbitrer. Ne pas appliquer automatiquement le délai de 24 h à cet objet.

## Décisions et détails encore à préciser

Les décisions validées ci-dessus ne déterminent pas à elles seules les détails UX, les cas limites ni l'architecture. Le point de départ des 24 h, les règles de refus/annulation, la durée maximale d'une mise en relation active, les modalités du choix de contact, les limites du texte et les mécanismes techniques de synchronisation restent documentés dans les questions ouvertes. Le mécanisme d'identifiant temporaire, la durée de session invitée, le rattachement éventuel à un compte et les règles de validation des permissions restent également à concevoir.


## Décisions complémentaires — archivage et stockage

| ID | Décision | Statut |
|---|---|---|
| DEC-037 | Une conversation d'un compte Vitalis est archivée après 3 mois ; dès que le plafond de 50 conversations conservées est dépassé, la plus ancienne est archivée même avant 3 mois. | VALIDÉ |
| DEC-038 | Une conversation archivée est inaccessible à l'utilisateur, sauf demande de celui-ci autorisée par un administrateur pour 24 heures ; ensuite elle redevient inaccessible. | VALIDÉ |
| DEC-039 | L'utilisateur peut supprimer son historique, mais ne peut pas l'exporter. | VALIDÉ |
| DEC-040 | En V1, des plafonds gratuits de stockage sont appliqués par espace ; à saturation, l'utilisateur choisit entre supprimer des données ou limiter les nouveaux usages/enregistrements. Aucun paiement n'est proposé. | VALIDÉ — quotas chiffrés à définir |
| DEC-041 | Les micro-paiements et extensions facultatives de stockage, de plafonds ou de fonctionnalités sont réservés à V2. | VALIDÉ |
| DEC-042 | La V1 vise zéro coût récurrent obligatoire ou un coût quasi nul strictement maîtrisé, avec plafonds individuels et globaux compatibles avec les limites gratuites effectivement disponibles sur Supabase Cloud. | VALIDÉ — contrainte d'architecture |

| DEC-043 | Une conversation archivée est conservée pendant 6 mois à compter de son archivage, puis supprimée définitivement selon la politique de purge. | VALIDÉ — détails techniques d'effacement à préciser |\n| DEC-046 | Le délai de 3 mois avant archivage commence à la date du dernier message échangé dans la conversation ; chaque nouveau message relance le délai. Le plafond de 50 conversations reste prioritaire et peut provoquer l'archivage anticipé de la plus ancienne. | VALIDÉ |

| DEC-044 | Proposition de quotas logiques gratuits V1 par compte : Profil/avatar 2 Mo (avatar ≤ 500 Ko), Réel 5 Mo, Flash 3 Mo, Scan 1 Mo, Radar 1 Mo, Notifications 1 Mo, données communes 2 Mo, total indicatif 15 Mo. | PROPOSITION À VALIDER |

| DEC-045 | Proposition de garde-fous globaux Supabase Free : DB 350/500 Mo, fichiers 700 Mo/1 Go, egress 3,5/5 Go pour chacun des transferts mis en cache et non mis en cache, Realtime 1,4/2 millions de messages, 140/200 connexions ; alertes à 50 %, limitation à 65 %, arrêt des écritures non essentielles à 70 %. | PROPOSITION À VALIDER |

Les quotas individuels et globaux devront être vérifiés par mesures, tests de charge et confirmation des limites Supabase en vigueur avant lancement.
\n\n## Précision validée — point de départ de l'archivage\n\nLe délai de 3 mois est calculé depuis la date du dernier message échangé dans la conversation. Chaque nouveau message relance le délai. Une conversation active n'est donc pas archivée uniquement en raison de son ancienneté depuis sa création. Le plafond de 50 conversations conservées demeure prioritaire : si ce plafond est dépassé, la plus ancienne est archivée même avant l'expiration de son délai de 3 mois.\n