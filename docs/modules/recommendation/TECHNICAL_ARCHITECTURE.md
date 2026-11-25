# Recommendation — architecture technique et état d'implémentation

## 1. Statut constaté sur la branche

L'inventaire récursif de la branche documentaire ne révèle aucun fichier applicatif ou package runtime nommé Recommendation, aucun type de contrat Recommendation, aucun repository, aucune migration SQL, aucun test dédié ni job de calcul. Les fichiers présents dans `docs/modules/recommendation/` sont le guide autonome, l'index et le contrat API historique.

**Conclusion :** Recommendation est documenté comme intention produit/architecture, mais le moteur runtime n'est pas démontré par les sources de cette branche. Les composants de ce document décrivent une architecture cible à construire, pas des modules existants.

## 2. Responsabilité du domaine

Recommendation doit être propriétaire de :
- la production et le classement des propositions ;
- l'explication et la provenance de chaque proposition ;
- la validité et le retrait des propositions ;
- les réactions du destinataire ;
- les règles de fréquence, diversité, déduplication et qualité.

Il ne doit pas être propriétaire des missions, Flash, profils, données Trust ou opportunités des domaines sources.

## 3. Architecture cible indépendante

```text
Sources autorisées
    | projections / événements versionnés
    v
Ingestion et normalisation
    v
Eligibility + permission re-check
    v
Candidate generation
    v
Deduplication + freshness
    v
Ranking + diversity + frequency caps
    v
Explanation + provenance
    v
Recommendation Store
    |                         |
    v                         v
Recommendation API       Evaluation / audit
    |
    v
Feed personnel + détail + réactions
```

Chaque composant doit être isolable et testable. Le pipeline ne doit pas appeler directement les bases privées d'un domaine source ni modifier ses données.

## 4. Contrats à définir

Avant d'écrire le moteur, formaliser les objets suivants :

### Recommendation (proposition de modèle)

- identifiant stable ;
- destinataire ;
- type de cible et référence opaque vers la ressource source ;
- texte/clé de titre et d'explication ;
- preuves/provenance minimisées ;
- priorité et score éventuel avec version de calcul ;
- dates de génération, disponibilité et expiration ;
- état de retrait ;
- version de règle/modèle.

Le score ne doit pas être ajouté tant que son échelle, son interprétation, sa calibration et ses limites ne sont pas documentées.

### RecommendationReaction (proposition de modèle)

- identifiant ;
- destinataire ;
- recommendationId ;
- action parmi viewed/saved/accepted/dismissed/reported ;
- date ;
- motif/catégorie facultatif pour le signalement ;
- clé d'idempotence.

Une table d'événements append-only est préférable à un simple champ mutable si l'historique des réactions doit être analysé. Les données conservées doivent être minimisées.

### SourceProjection (contrat à définir)

Chaque connecteur doit documenter :
- domaine propriétaire ;
- événements ou endpoint réellement disponibles ;
- champs autorisés ;
- règles d'accès et révocation ;
- fraîcheur/SLA ;
- version du schéma ;
- gestion de suppression et expiration ;
- quotas et erreurs.

## 5. Pipeline de calcul cible

1. **Ingestion :** recevoir des projections explicites et versionnées.
2. **Validation :** rejeter les événements invalides, incomplets ou anciens.
3. **Éligibilité :** vérifier le destinataire, la cible, la finalité et les permissions.
4. **Candidats :** construire les propositions possibles sans exposer les données brutes.
5. **Déduplication :** éviter qu'une même ressource soit répétée par plusieurs signaux.
6. **Classement :** appliquer des règles explicables et versionnées.
7. **Diversité :** limiter la concentration par type/source/thème.
8. **Fréquence :** respecter les plafonds et les périodes de silence.
9. **Explication :** associer une justification fidèle aux signaux utilisés.
10. **Persistance :** enregistrer le résultat et son expiration.
11. **Revalidation :** vérifier la ressource source avant affichage et action.
12. **Évaluation :** mesurer qualité et biais sans réutilisation non autorisée des données.

Aucun de ces jobs ou services n'est identifié comme implémenté dans la branche.

## 6. API cible

Le contrat historique propose les routes :
- `GET /recommendations`
- `GET /recommendations/{id}`
- `POST /recommendations/{id}/save`
- `POST /recommendations/{id}/dismiss`
- `POST /recommendations/{id}/accept`
- `POST /recommendations/{id}/report`

Elles sont à considérer comme proposition de façade. La spécification complète devra définir pagination/cursor, filtres, statut, codes d'erreur, idempotence, version de réponse, contrôle d'accès et comportement face à une ressource source retirée. Aucune route active n'a été confirmée.

## 7. Dépendances et limites de couplage

Les domaines cités comme sources potentielles dans le contrat sont Trust, Radar, Veille, Flash et Mission. Ils sont des producteurs potentiels de signaux, pas des dépendances nécessaires à la compréhension de Recommendation.

Le moteur doit fonctionner avec zéro connecteur actif : il doit alors retourner un état vide explicite et non inventer des propositions. L'activation d'un connecteur doit être indépendante et accompagnée de tests de contrat.

## 8. Sécurité

- Authentification obligatoire pour toute lecture/réaction personnelle.
- Filtrage par destinataire côté serveur.
- Revalidation des permissions de la ressource source à chaque lecture sensible.
- Pas d'accès direct à des colonnes privées ou signaux Trust non autorisés.
- Explications sans fuite de données sur les tiers.
- Contrôle des accès opérateurs et audit des consultations privilégiées.
- Protection contre l'injection de contenu provenant des signaux sources.
- Limitation de fréquence et prévention du scraping.
- Rétention et suppression conformes à une politique écrite.

## 9. Observabilité et qualité

Mesurer au minimum : taux de candidats admissibles, doublons éliminés, taux de retrait pour permission, latence par étape, taux d'expiration, réactions par cohorte, signalements, erreurs de connecteurs, diversité et fréquence d'exposition. Ne pas optimiser uniquement le clic ou l'acceptation : ces mesures peuvent encourager des recommandations intrusives.

## 10. Critères d'achèvement technique

Recommendation ne pourra être déclaré implémenté qu'après présence et validation de :
- contrats de données et migrations ;
- pipeline de production et tâches de reprise ;
- connecteurs explicitement autorisés ;
- service de classement déterministe ou modèle versionné ;
- persistance destinataire/réaction ;
- API avec RLS/contrôles d'accès ;
- UI de liste, détail et réactions ;
- tests de permissions, fraîcheur, révocation, idempotence et anti-fuite ;
- documentation des métriques et de la gouvernance.
