# Règles métier V1 — Réel

| ID | Règle | Statut |
|---|---|---|
| PRE-001 | Présence activée manuellement et volontairement. | VALIDÉ |
| PRE-002 | Localisation partagée volontairement. | VALIDÉ |
| PRE-003 | Rayon personnalisable, maximum 1 km. | VALIDÉ |
| PRE-004 | Petits rayons : 10, 25, 50 et 100 m. | VALIDÉ |
| PRE-005 | Un seul statut actif. | VALIDÉ |
| PRE-006 | Durées : 30 min, 1 h, 2 h, 3 h, 6 h, 12 h, 24 h. | VALIDÉ |
| PRE-007 | À expiration, le statut est supprimé. | VALIDÉ |
| DEC-001 | Réel est un moteur de présence locale, pas un flux de publications. | VALIDÉ |
| DEC-002 | Profil utilisateur central et profils proches autour, cliquables. | VALIDÉ |
| DEC-003 | Indicateurs numériques pour les regroupements. | VALIDÉ |
| BIP-001 | Bips accessibles uniquement lorsque l'utilisateur est actif dans Réel. | VALIDÉ |
| BIP-002 | Consultation du profil possible avant décision. | VALIDÉ |
| BIP-003 | Acceptation directe depuis la liste, sans renvoi de bip. | VALIDÉ |
| BIP-004 | Bip non accepté conservé 24 h, même après fermeture, puis expiré. | VALIDÉ |
| MRL-001 | Une mise en relation est créée après acceptation. | VALIDÉ |
| MRL-002 | Deux emplacements : compteur Réel et Notifications. | VALIDÉ |
| MRL-003 | Pas de quatrième espace autonome « Temps réel ». | VALIDÉ |
| MRL-004 | Clôture par un participant = clôture pour les deux. | VALIDÉ |
| MRL-005 | Confirmation demandée avant clôture. | VALIDÉ |
| MRL-006 | Disparition immédiate des deux emplacements pour les deux participants. | VALIDÉ |
| MRL-007 | L'autre participant est informé de la clôture. | VALIDÉ |
| COM-001 | Communication rattachée à une mise en relation/action autorisée. | VALIDÉ |
| COM-002 | Pas de messagerie libre indépendante. | VALIDÉ |
| COM-003 | Communication désactivée à la clôture. | VALIDÉ |
| TRC-001 | Trace minimale : date, statut, événement. | VALIDÉ |
| TRC-002 | Pas d'historique de conversation après clôture. | VALIDÉ |
| TRC-003 | Pas d'historique visible de mise en relation clôturée. | VALIDÉ |

## Garde-fous d'interprétation
- Les 24 h concernent les bips non acceptés, pas automatiquement les mises en relation acceptées.
- La durée d'une mise en relation acceptée avant clôture n'est pas fixée.
- La trace minimale n'autorise pas à conserver le contenu des conversations.
- La clôture est bilatérale, jamais un simple retrait local.