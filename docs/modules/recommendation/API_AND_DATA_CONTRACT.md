# Recommendation — contrat API et données

## 1. Statut

Aucun contrat TypeScript Recommendation, repository, table, migration ou endpoint implémenté n'a été identifié dans l'arborescence de la branche. Ce document sépare donc :
- les opérations proposées par le document historique ;
- les champs et règles à définir avant implémentation.

Il ne faut pas générer un client HTTP ni un schéma SQL à partir de cette seule proposition sans validation produit/technique.

## 2. Opérations REST historiques

| Méthode | Route proposée | Intention |
|---|---|---|
| GET | `/recommendations` | Lister les recommandations du membre connecté |
| GET | `/recommendations/{id}` | Lire le détail d'une recommandation |
| POST | `/recommendations/{id}/save` | Enregistrer |
| POST | `/recommendations/{id}/dismiss` | Ignorer/masquer |
| POST | `/recommendations/{id}/accept` | Indiquer que la piste est suivie |
| POST | `/recommendations/{id}/report` | Signaler |

Ce sont des routes cibles historiques, non des endpoints actifs confirmés. Le destinataire doit toujours être dérivé du contexte d'authentification, jamais d'un userId arbitraire fourni par le client.

## 3. Schéma conceptuel proposé

### Recommendation

| Champ | Type conceptuel | Règle |
|---|---|---|
| id | UUID | stable |
| recipient_id | UUID | destinataire unique |
| target_type | enum versionné | type de ressource source |
| target_ref | référence opaque | ne donne pas de droit d'accès |
| title / explanation | texte ou clés i18n | justification sans fuite |
| evidence | JSON minimisé | provenance et signaux autorisés |
| priority | enum | sémantique définie |
| score | numérique nullable | uniquement si échelle calibrée/versionnée |
| algorithm_version | texte | version de règle/modèle |
| generated_at | timestamp | date de calcul |
| available_at | timestamp | début d'affichage |
| expires_at | timestamp | expiration |
| withdrawn_at | timestamp nullable | retrait/révocation |

Ce schéma est une proposition de conception, pas un type ou une table existante.

### RecommendationReaction

| Champ | Type conceptuel | Règle |
|---|---|---|
| id | UUID | identifiant événement |
| recommendation_id | UUID | référence à la proposition |
| recipient_id | UUID | doit correspondre au destinataire |
| action | enum | viewed, saved, accepted, dismissed, reported |
| reason_code | texte nullable | requis/optionnel selon report |
| idempotency_key | texte | éviter les doublons de commande |
| created_at | timestamp | horodatage serveur |

Décider si `viewed` est une télémétrie nécessaire, si les réactions sont append-only, et comment l'utilisateur peut annuler save/accept/dismiss.

## 4. Contrat de lecture proposé

La liste doit :
- retourner uniquement le destinataire courant ;
- exclure les propositions expirées/retirées ;
- revérifier la permission de la ressource source ;
- paginer par curseur stable ;
- exposer explication, fraîcheur et période de validité ;
- ne pas exposer les signaux privés bruts ni les identités tierces non autorisées.

Le détail applique les mêmes contrôles que la liste. Connaître un identifiant de recommandation ne doit pas permettre de lire celle d'un autre utilisateur.

## 5. Contrat de réaction proposé

Les commandes save, accept, dismiss et report doivent être authentifiées, idempotentes, limitées au destinataire, auditées et protégées contre le rejeu. Une action répétée ne doit pas créer de multiples réactions identiques.

`accept` ne doit pas exécuter une action métier source. Si la suite du parcours nécessite une mutation, l'API retourne une intention ou un lien de navigation et le domaine source exige sa propre commande authentifiée.

## 6. Codes d'erreur à formaliser

Prévoir au minimum : non authentifié, non destinataire, recommandation inconnue, expirée, retirée, source inaccessible, action invalide, signalement incomplet, conflit d'idempotence, quota dépassé et source temporairement indisponible.

Les réponses ne doivent pas distinguer inutilement « identifiant inexistant » de « identifiant appartenant à un autre utilisateur » si cette distinction permet l'énumération.

## 7. Événements proposés

Le contrat historique nomme :
- `RecommendationViewed`
- `RecommendationAccepted`
- `RecommendationDismissed`
- `RecommendationSaved`
- `RecommendationReported`

Avant émission, définir enveloppe commune (eventId, occurredAt, schemaVersion, actor/recipient, recommendationId, action, correlationId), règles de livraison, idempotence, rétention et consommateurs autorisés.

## 8. Versionnement et compatibilité

Versionner séparément :
- le schéma de proposition ;
- le contrat de réaction ;
- chaque projection source ;
- les règles de classement ;
- les explications ;
- l'API publique.

Une projection source inconnue ou invalide doit être rejetée ou mise en quarantaine, pas interprétée de manière permissive. Une ancienne recommandation doit être revalidée contre la permission et le statut courant de sa ressource.
