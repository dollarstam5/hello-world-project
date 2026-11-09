# Règles métier V1 — Réel

Les règles ci-dessous reflètent les décisions produit retrouvées. VALIDÉ signifie que la décision fonctionnelle a été acceptée ; cela ne prouve pas son implémentation.

| ID | Règle | Statut |
|---|---|---|
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
| TRC-001 | Après clôture, la trace technique minimale comprend la date, le statut et l'événement. | VALIDÉ |
| TRC-002 | Aucun historique de conversation n'est conservé après clôture. | VALIDÉ |
| TRC-003 | Aucun historique visible de mise en relation clôturée n'est conservé. | VALIDÉ |
| NET-001 | Les actions en attente sont préservées pendant les perturbations réseau et synchronisées au retour de la connexion. | VALIDÉ — principe produit |
| NET-002 | La synchronisation doit éviter doublons et incohérences ; une action locale en attente n'est pas une confirmation serveur. | VALIDÉ — principe produit |

## Garde-fous d'interprétation

- Les 24 h concernent les bips non acceptés, pas automatiquement les mises en relation acceptées.
- La durée d'une mise en relation acceptée avant clôture n'est pas fixée.
- Le profil détaillé associé à une présence est facultatif ; cela n'empêche pas la consultation du profil de l'émetteur d'un bip.
- L'acceptation d'un bip et le choix de poursuivre le contact sont deux étapes distinctes.
- La communication est textuelle dans le périmètre retenu, mais ses limites détaillées restent à spécifier.
- La trace minimale n'autorise pas à conserver le contenu des conversations.
- La clôture est bilatérale, jamais un simple retrait local.
- Les principes réseau sont des exigences produit ; l'architecture et les preuves de leur réalisation restent à établir.
