# Veille — API, événements et exploitation

## 1. Statut du contrat

Le dépôt contient le document historique 10. Veille API.md, mais aucune route, fonction, migration, table ou job Veille runtime n'a été identifiée dans l'arborescence examinée. Les endpoints ci-dessous sont des propositions historiques, pas des routes déployées confirmées.

## 2. API historique des éléments de veille

| Méthode | Route proposée | Intention |
|---|---|---|
| GET | /veille | Tableau de veille personnel |
| GET | /veille/{id} | Détail d'un élément |
| POST | /veille/{id}/read | Marquer comme lu |
| POST | /veille/{id}/save | Enregistrer |
| POST | /veille/{id}/ignore | Ignorer |
| POST | /veille/{id}/report | Signaler |

Le contrat historique décrit des éléments produits par le moteur et des réactions du destinataire. Il ne couvre pas suffisamment les opérations de création/configuration de surveillance personnelle, les tendances collectives, l'IOV, l'intérêt mutuel ou les consentements de mise en relation. Ces capacités nécessitent des contrats dédiés avant implémentation.

## 3. Séparation d'API cible

### Espace personnel

API privée filtrée par utilisateur authentifié : lister les surveillances personnelles ; lire une surveillance ; créer/configurer selon les sources autorisées ; modifier, suspendre, reprendre, prolonger, arrêter, archiver ; lire les événements personnels ; mettre à jour préférences et dernière consultation.

L'identité du propriétaire est toujours dérivée de l'authentification. Aucun ownerId arbitraire du client ne doit élargir l'accès.

### Espace collectif

API en lecture seule sur des snapshots d'agrégats publiables : lister les tendances ; lire une tendance ; consulter une opportunité latente ; consulter un IOV et son explication ; manifester un intérêt pour une opportunité.

Les routes collectives ne doivent pas exécuter de requête ad hoc sur les tables personnelles. La manifestation d'intérêt est une commande séparée et ne révèle pas les demandeurs.

### Mise en relation

Le contrat doit définir les actions de consentement des deux côtés, expiration, retrait, anti-spam, idempotence et périmètre exact des données révélées. Une mise en relation ne se crée qu'après toutes les acceptations requises.

## 4. Événements historiques

Le contrat nomme VeilleItemViewed, VeilleItemSaved, VeilleItemIgnored et VeilleItemReported.

Les événements futurs devraient utiliser une enveloppe versionnée comprenant eventId, occurredAt, schemaVersion, actor/owner, entityId, action et correlationId. Définir livraison au moins une fois, déduplication, retries, dead-letter et politique de rétention.

Événements supplémentaires à spécifier si le produit les valide : surveillance créée/mise à jour/suspendue/reprise/arrêtée/expirée/archivée, tendance calculée/publiée/retirée, manifestation d'intérêt créée/acceptée/refusée/expirée.

## 5. Jobs cibles

| Job | Déclenchement | Idempotence / contrôle |
|---|---|---|
| Ingestion des signaux | événement ou polling contrôlé | clé événement, schema version, curseur |
| Nettoyage/quarantaine | continu ou planifié | retries bornés, dead-letter |
| Normalisation | après ingestion | version de taxonomie |
| Agrégation | fenêtre planifiée | clé zone/catégorie/fenêtre/version |
| Contrôle confidentialité | avant publication | seuils et tests anti-différence |
| Détection tendances | après agrégat | version de règle |
| Calcul IOV | après données offre/demande valides | version de formule |
| Expiration | planifié | transition atomique, idempotente |
| Propagation suppression | événement source | tombstone/cursor et recalcul |
| Notifications | événement confirmé | outbox, déduplication, opt-in |
| Archivage/purge | politique de rétention | dry-run, audit et reprise |

Les fréquences doivent découler des besoins produit, du volume, de la fraîcheur, des coûts et de la sensibilité. Ne pas annoncer une surveillance temps réel sans SLA et infrastructure démontrés.

## 6. Résilience et observabilité

Chaque job doit fournir nombre de messages lus/acceptés/rejetés, retard du curseur, latence et durée, retries et dead-letter, version de schéma/règle, état des sources, volume agrégé et couverture, raison de non-publication et trace de corrélation sans identifiant personnel inutile.

Une panne de source doit rendre visible la couverture partielle et bloquer les conclusions qui nécessitent cette source. Elle ne doit pas générer artificiellement une opportunité latente.

## 7. Erreurs et états de couverture

Différencier au minimum : données complètes ; données partielles ; source en retard ; source indisponible ; agrégat sous le seuil de publication ; tendance expirée ; ressource retirée ; consentement manquant ; mise en relation expirée.

Un agrégat non publiable n'est pas un zéro de demande. Une source non consultée n'est pas une source sans offre.

## 8. Checklist de déploiement

- [ ] APIs personnelle/collective séparées.
- [ ] RLS et isolation propriétaire testées.
- [ ] Registre des sources et finalités approuvés.
- [ ] Jobs idempotents, observables et reprenables.
- [ ] Contrôles de confidentialité appliqués avant publication.
- [ ] Retraits et suppressions propagés.
- [ ] IOV versionné et calibré.
- [ ] Notifications opt-in et dédupliquées.
- [ ] Consentements bilatéraux testés.
- [ ] Procédure de rollback et purge testée.
