# Recommendation — architecture technique et état documentaire

> **Nature du document :** architecture cible et référence de conception. Ce document ne décrit pas un moteur runtime déployé.

## 1. État vérifié et périmètre

Les contrats de domaine TypeScript V1 sont définis dans `packages/core-contracts/src/recommendation.ts` et exportés par `@eco/core-contracts`. Ils constituent le contrat de référence pour les structures métier décrites ci-dessous.

Cela ne signifie pas que le moteur est opérationnel. Aucun repository Recommendation, schéma SQL/migration, politique RLS, job de calcul, endpoint ou interface dédiée n'est confirmé comme implémenté et validé dans cette branche. Aucun test runtime Recommendation n'est identifié comme exécuté.

Recommendation est propriétaire des propositions, de leur explication, provenance, validité, retrait, classement et réactions. Les domaines sources restent propriétaires de leurs ressources et de leurs autorisations.

## 2. Principes d'architecture

1. **Propriété des données :** Recommendation ne modifie jamais directement une mission, un Flash, un profil ou une ressource d'un autre domaine.
2. **Projections minimisées :** les entrées sont des projections versionnées, limitées à la finalité `recommendation`, jamais des lignes brutes importées sans filtre.
3. **Autorisation continue :** la permission de lire la ressource source est vérifiée au calcul, à l'affichage et avant toute navigation/action sensible.
4. **Explicabilité :** chaque proposition porte une explication et une provenance suffisantes pour comprendre pourquoi elle est affichée.
5. **Séparation des états :** le statut de disponibilité de la proposition est distinct des réactions de l'utilisateur.
6. **Contrôle utilisateur :** une recommandation suggère ; elle n'exécute pas l'action métier.
7. **Échec sûr :** une source invalide, inconnue ou non autorisée est rejetée ou mise en quarantaine. Une panne de source ne doit pas être présentée comme une absence certaine d'opportunité.

## 3. Contrats métier V1

Les types de référence sont décrits dans `packages/core-contracts/src/recommendation.ts`.

- **RecommendationRecord :** proposition persistée, destinée à un utilisateur, avec cible opaque, titre, explication, provenance, priorité, statut, version de règle et dates.
- **RecommendationCandidate :** candidat transitoire construit pendant la génération ; il n'est pas encore une proposition affichable.
- **RecommendationSourceProjection :** projection d'entrée minimisée, versionnée et déclarée pour la finalité `recommendation`.
- **RecommendationReaction :** événement append-only rattaché à la recommandation et à son destinataire.
- **RecommendationListQuery / Result :** contrat de pagination et de consultation.

Le statut système V1 est `generated | available | expired | withdrawn`. Les réactions sont `viewed | saved | accepted | dismissed | reported` et ne sont pas des statuts système. Le contrat n'expose aucun score numérique en V1 ; seule une priorité `low | normal | high` est prévue. Tout futur score exigera une formule, une calibration, une version et une politique d'explication approuvées.

Les commandes client ne transportent pas `recipientId`. Le serveur le déduit de l'identité authentifiée. La référence opaque vers une ressource source ne confère aucun droit d'accès.

## 4. Architecture logique cible

```text
Domaines sources autorisés
    | projections minimisées et versionnées
    v
Ingestion / validation / quarantaine
    v
Vérification finalité + destinataire + permissions
    v
Génération des candidats
    v
Déduplication + fraîcheur + éligibilité
    v
Classement par règles versionnées + diversité + fréquence
    v
Explication + provenance
    v
Persistance Recommendation
    |                         |
    v                         v
API personnelle           Audit / évaluation
    |
    v
Liste + détail + réactions utilisateur
```

Chaque étape doit être isolable et testable. Le pipeline doit pouvoir fonctionner sans connecteur actif : dans ce cas, il retourne un état vide ou une couverture indisponible explicitement qualifiée, sans fabriquer de résultat.

## 5. Pipeline cible

1. **Ingestion :** recevoir uniquement les projections autorisées et versionnées.
2. **Validation :** contrôler schéma, finalité, version, horodatage et intégrité ; rejeter ou mettre en quarantaine les entrées invalides.
3. **Autorisation :** vérifier que le destinataire est habilité à recevoir la proposition et que la cible est consultable.
4. **Génération :** construire des candidats à partir des seuls champs nécessaires.
5. **Déduplication :** fusionner ou éliminer les candidats équivalents selon une règle documentée.
6. **Fraîcheur :** écarter les signaux trop anciens et fixer une période de validité.
7. **Classement :** appliquer des règles déterministes et versionnées. Les poids, seuils et formules ne sont pas encore décidés.
8. **Diversité/fréquence :** éviter la concentration sur une seule source, catégorie ou cible et respecter les plafonds d'exposition.
9. **Explication :** générer une justification fidèle aux signaux réellement utilisés, sans révéler de données privées de tiers.
10. **Persistance :** enregistrer la proposition, sa provenance et sa version de règle.
11. **Revalidation :** contrôler à nouveau la visibilité de la source à la lecture et avant toute action.
12. **Évaluation :** mesurer qualité, biais, erreurs et dérive selon une politique documentée.

Aucun de ces composants runtime n'est déclaré livré par le présent document.

## 6. Données et persistance — conception à réaliser

Le contrat TypeScript ne remplace pas le schéma relationnel. La future persistance devra au minimum représenter :
- la proposition et son destinataire ;
- sa cible opaque, son explication et sa provenance ;
- son statut de disponibilité et ses dates ;
- la version de règle ayant généré la proposition ;
- les événements de réaction et leur clé d'idempotence.

Les contraintes devront garantir la cohérence des identifiants, la validité temporelle, l'unicité/idempotence des événements et l'association d'une réaction au destinataire propriétaire de la proposition. Les index devront couvrir la consultation paginée par destinataire, statut et date. Les choix exacts de schéma, rétention, suppression et stratégie d'archivage restent à documenter avant migration.

## 7. API cible — non déployée

Le contrat historique propose les opérations suivantes, qui restent des routes cibles et non des endpoints actifs confirmés :

- `GET /recommendations` — liste personnelle paginée ;
- `GET /recommendations/{id}` — détail ;
- `POST /recommendations/{id}/save` — enregistrer ;
- `POST /recommendations/{id}/dismiss` — masquer ;
- `POST /recommendations/{id}/accept` — indiquer une intention de suivi ;
- `POST /recommendations/{id}/report` — signaler.

Le détail des paramètres, formats de réponse, curseurs, codes d'erreur, quotas et garanties de livraison reste à finaliser. Toute opération est authentifiée ; le destinataire vient du contexte d'authentification et n'est jamais choisi par le client. `accept` ne réalise pas la mutation dans le domaine source.

## 8. Sécurité et confidentialité

- authentification obligatoire pour les lectures et réactions personnelles ;
- isolation stricte par destinataire au niveau API et base ;
- RLS à définir et tester avec plusieurs utilisateurs ;
- revalidation des droits sur la ressource source ;
- minimisation des projections et des explications ;
- exclusion des signaux sensibles non autorisés ;
- audit des accès opérateurs ;
- idempotence et protection contre le rejeu ;
- quotas, limitation de fréquence et prévention du scraping ;
- politique documentée de conservation, suppression et accès aux données ;
- traitement des contenus sources comme données non fiables.

## 9. Observabilité et qualité

Mesurer notamment le volume de candidats, le taux d'éligibilité, les rejets de permission, les doublons, les erreurs et retards de connecteurs, la latence par étape, les expirations, les retraits, la diversité et la fréquence d'exposition, ainsi que les réactions et signalements.

Les métriques doivent être agrégées et minimisées. Les clics et acceptations ne sont pas des mesures suffisantes de qualité et ne doivent pas être les seuls objectifs d'optimisation.

## 10. Critères d'achèvement technique

Le moteur ne pourra être qualifié d'implémenté qu'après validation de tous les éléments suivants : schéma SQL et migrations ; RLS ; ingestion et reprise ; connecteurs autorisés ; génération et classement versionnés ; persistance des propositions/réactions ; API ; interface ; tests d'autorisation, fraîcheur, révocation, idempotence et absence de fuite ; supervision ; gouvernance et politique de rétention.

## 11. Références documentaires

- [Guide autonome](ENGINE_GUIDE.md)
- [Spécification fonctionnelle](FUNCTIONAL_SPEC.md)
- [Contrat API et données](API_AND_DATA_CONTRACT.md)
- [Tests et gouvernance](TESTING_AND_GOVERNANCE.md)
- [Contrat API historique — non normatif](11._Recommendation_API.md)
