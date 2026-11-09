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
| DEC-023 | Aucun historique de conversation après clôture. | VALIDÉ |
| DEC-024 | Aucun historique visible de mise en relation clôturée. | VALIDÉ |
| DEC-025 | Le profil détaillé associé à une présence est facultatif. | VALIDÉ |
| DEC-026 | La poursuite du contact après acceptation relève d'un choix distinct de l'acceptation du bip. | VALIDÉ |
| DEC-027 | La communication associée à une mise en relation est de type texte dans le périmètre retenu. | VALIDÉ |
| DEC-028 | Les actions en attente doivent être préservées pendant les perturbations réseau puis synchronisées au retour de la connexion. | VALIDÉ — principe produit |

## Clarification temporelle

Une discussion a évoqué une conservation de 12 h ou 24 h pour absorber les perturbations réseau. Les clarifications ultérieures distinguent :
- les bips non acceptés, conservés 24 h ;
- les mises en relation acceptées, accessibles dans le compteur Réel et Notifications jusqu'à leur clôture ;
- les traces minimales après clôture.

La durée de vie d'une mise en relation acceptée non clôturée reste à arbitrer. Ne pas appliquer automatiquement le délai de 24 h à cet objet.

## Décisions et détails encore à préciser

Les décisions validées ci-dessus ne déterminent pas à elles seules les détails UX, les cas limites ni l'architecture. Le point de départ des 24 h, les règles de refus/annulation, la durée maximale d'une mise en relation active, les modalités du choix de contact, les limites du texte et les mécanismes techniques de synchronisation restent documentés dans les questions ouvertes.
