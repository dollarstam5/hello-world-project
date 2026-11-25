# Recommendation — contrat API et données

## 1. Décisions R1 retenues

Le contrat TypeScript V1 est défini dans `packages/core-contracts/src/recommendation.ts` et exporté par `@eco/core-contracts`.

| Sujet | Décision V1 |
|---|---|
| Version | `RECOMMENDATION_CONTRACT_VERSION = 1` |
| Identité | UUID typés `RecommendationId` et `RecommendationReactionId` ; destinataire `UserId` |
| Cible | Référence opaque `domain + type + ref`, qui ne confère aucun droit d'accès |
| Types de cible | mission, flash, opportunity, person, skill, content, action |
| Statut système | generated, available, expired, withdrawn |
| Réactions | événements distincts : viewed, saved, accepted, dismissed, reported |
| Réversibilité | les réactions sont des événements append-only ; une annulation future sera un nouvel événement/contrat explicite, pas une réécriture de l'historique |
| Explication | résumé et codes de raison, sans données privées de tiers |
| Provenance | domaine source, version de projection, date d'observation et date de mise à jour source |
| Temps | timestamps Unix en millisecondes, cohérents avec les records du monorepo |
| Classement | priorité low/normal/high ; aucun score numérique exposé en V1 |
| Destinataire | absent des commandes client ; toujours dérivé de l'identité authentifiée côté serveur |

Les projections sources sont des entrées minimisées et versionnées, avec finalité explicite `recommendation`. Elles ne sont pas des lignes brutes des tables d'un autre domaine. Le candidat est un artefact de génération en mémoire, distinct du record persistant.

## 2. Statut d'implémentation R1

- [x] Contrats TypeScript versionnés et exportés.
- [x] Identifiants de domaine typés.
- [x] Cycle de vie séparant l'état de disponibilité et les réactions utilisateur.
- [x] Score numérique exclu du contrat V1 tant qu'une formule/calibration versionnée n'est pas approuvée.
- [ ] Schéma SQL, contraintes et index.
- [ ] Politiques RLS et tests multi-destinataires.
- [ ] Tests de compilation et de contrat exécutés dans l'environnement du dépôt.
- [ ] Politique de rétention/suppression validée et implémentée.

La migration et les tests RLS restent volontairement non déclarés comme livrés : ils doivent être ajoutés et exécutés contre une base de test active. Le projet Supabase associé n'a pas pu être utilisé comme environnement de validation lors de cette étape. Aucun schéma de production n'est présumé.

## 3. Opérations REST historiques

| Méthode | Route proposée | Intention |
|---|---|---|
| GET | `/recommendations` | Lister les recommandations du membre connecté |
| GET | `/recommendations/{id}` | Lire le détail d'une recommandation |
| POST | `/recommendations/{id}/save` | Enregistrer |
| POST | `/recommendations/{id}/dismiss` | Ignorer/masquer |
| POST | `/recommendations/{id}/accept` | Indiquer que la piste est suivie |
| POST | `/recommendations/{id}/report` | Signaler |

Ce sont des routes cibles historiques, non des endpoints actifs confirmés. Le destinataire doit toujours être dérivé du contexte d'authentification, jamais d'un userId arbitraire fourni par le client.

## 4. Modèle métier

### RecommendationRecord

| Champ | Type | Règle |
|---|---|---|
| contractVersion | literal 1 | version du contrat |
| id | RecommendationId | identifiant stable |
| recipientId | UserId | destinataire unique |
| target | RecommendationTargetReference | domaine, type et référence opaque |
| title / explanation | texte et codes de raison | justification sans fuite |
| provenance | RecommendationProvenance | projection autorisée et fraîcheur |
| priority | low/normal/high | ordre explicable V1 |
| status | generated/available/expired/withdrawn | état de disponibilité |
| ruleVersion | string | version des règles ayant produit le résultat |
| generatedAt / availableAt / expiresAt | number | millisecondes Unix |
| withdrawnAt | number nullable | retrait/révocation |

Aucun champ score n'existe dans le contrat V1. L'ordre peut utiliser une priorité explicitement définie, mais ne doit pas afficher de score arbitraire.

### RecommendationSourceProjection

Une projection comporte la version du contrat, le domaine source, un identifiant d'événement, la version de schéma, la finalité `recommendation`, la référence de cible, le destinataire autorisé, les horodatages et un payload minimisé. Une projection inconnue, invalide, hors finalité ou non autorisée est rejetée/mise en quarantaine.

### RecommendationCandidate

Un candidat est une structure transitoire construite à partir de projections autorisées. Il transporte destinataire, cible, explication, provenance, priorité, version de règle et fenêtre de disponibilité. Il ne constitue pas encore une recommandation affichable.

### RecommendationReaction

| Champ | Type | Règle |
|---|---|---|
| id | RecommendationReactionId | identifiant d'événement |
| recommendationId | RecommendationId | recommandation concernée |
| recipientId | UserId | doit correspondre au destinataire |
| action | enum | viewed, saved, accepted, dismissed, reported |
| idempotencyKey | string | déduplication de commande |
| reason | enum nullable | motif normalisé pour report |
| createdAt | number | horodatage serveur en millisecondes |

Les réactions sont append-only. L'état courant (par exemple saved ou dismissed) est une projection calculée à partir de l'historique, et non une mutation du statut de disponibilité de la recommandation. Les règles de réversibilité devront être définies avant d'exposer une commande d'annulation.

## 5. Contrat de lecture proposé

La liste doit :
- retourner uniquement le destinataire courant ;
- exclure les propositions expirées/retirées ;
- revérifier la permission de la ressource source ;
- paginer par curseur stable ;
- exposer explication, fraîcheur et période de validité ;
- ne pas exposer les signaux privés bruts ni les identités tierces non autorisées.

Le détail applique les mêmes contrôles que la liste. Connaître un identifiant de recommandation ne doit pas permettre de lire celle d'un autre utilisateur.

## 6. Contrat de réaction proposé

Les commandes save, accept, dismiss et report doivent être authentifiées, idempotentes, limitées au destinataire, auditées et protégées contre le rejeu. Une action répétée ne doit pas créer de multiples réactions identiques.

`accept` ne doit pas exécuter une action métier source. Si la suite du parcours nécessite une mutation, l'API retourne une intention ou un lien de navigation et le domaine source exige sa propre commande authentifiée.

Les commandes client ne contiennent jamais `recipientId`. La couche serveur l'obtient depuis la session/JWT vérifié.

## 7. Codes d'erreur à formaliser

Prévoir au minimum : non authentifié, non destinataire, recommandation inconnue, expirée, retirée, source inaccessible, action invalide, signalement incomplet, conflit d'idempotence, quota dépassé et source temporairement indisponible.

Les réponses ne doivent pas distinguer inutilement « identifiant inexistant » de « identifiant appartenant à un autre utilisateur » si cette distinction permet l'énumération.

## 8. Événements proposés

Le contrat historique nomme :
- `RecommendationViewed`
- `RecommendationAccepted`
- `RecommendationDismissed`
- `RecommendationSaved`
- `RecommendationReported`

Avant émission, définir enveloppe commune (eventId, occurredAt, schemaVersion, actor/recipient, recommendationId, action, correlationId), règles de livraison, idempotence, rétention et consommateurs autorisés.

## 9. Versionnement et compatibilité

Versionner séparément :
- le schéma de proposition ;
- le contrat de réaction ;
- chaque projection source ;
- les règles de classement ;
- les explications ;
- l'API publique.

Une projection source inconnue ou invalide doit être rejetée ou mise en quarantaine, pas interprétée de manière permissive. Une ancienne recommandation doit être revalidée contre la permission et le statut courant de sa ressource.
