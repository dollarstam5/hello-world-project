# Recommendation — guide complet du moteur

**Objet :** proposer à un utilisateur des actions personnalisées, pertinentes et explicables, sans prendre la décision à sa place.  
**État :** contrat API historique consolidé ; aucun moteur de recommandation runtime complet n'est confirmé par les sources disponibles.

## 1. Mission et périmètre

Recommendation transforme des signaux autorisés du produit en propositions adaptées au contexte d'un utilisateur. Une recommandation peut concerner une mission, un Flash, une opportunité, une personne, une compétence, un contenu ou une action à réaliser. Elle aide à décider, mais ne remplace jamais le choix de la personne et ne réalise pas automatiquement l'action proposée.

Chaque recommandation devrait porter un identifiant, un destinataire, une ressource source, une justification, une priorité ou pertinence, une période de validité et un état de réaction. Les scores doivent être explicables et ne doivent pas être inventés lorsque les preuves manquent.

## 2. Parcours utilisateur complet

### 2.1 Préparer les signaux
Le moteur ne consomme que des données et événements autorisés. Les domaines sources restent propriétaires de leurs objets : Recommendation ne copie pas leur autorité métier et ne modifie pas directement les missions, Flash, profils ou preuves de confiance. Les données doivent être minimisées, fraîches, contextualisées et filtrées par les permissions du destinataire.

### 2.2 Produire et qualifier
1. Les signaux admissibles sont collectés selon un contrat versionné.
2. Le moteur évalue leur pertinence pour l'utilisateur et le contexte.
3. Il élimine les éléments non autorisés, expirés, dupliqués ou insuffisamment étayés.
4. Il produit une recommandation avec une explication traçable à des données réelles.
5. La recommandation est présentée pendant sa période de validité.

Les critères, pondérations, seuils, règles de diversité, déduplication et fréquence doivent être documentés et testés avant activation. Aucun score numérique ni modèle d'IA n'est présumé dans cette référence.

### 2.3 Consulter et agir
L'utilisateur consulte la liste ou le détail, puis peut enregistrer, accepter/suivre, ignorer/masquer ou signaler une recommandation non pertinente. Chaque réaction est persistée et rattachée à l'utilisateur et à la recommandation. L'acceptation n'exécute pas automatiquement une action métier ; elle exprime une décision ou déclenche une navigation/étape explicitement définie.

Une recommandation expirée ou retirée ne doit pas être présentée comme disponible. Une action déjà effectuée doit être distinguée d'une simple consultation.

### 2.4 Améliorer la pertinence
Les réactions peuvent alimenter l'évaluation future de la qualité, sous réserve de transparence, de minimisation, de protection des données et d'une gouvernance documentée. Une réaction isolée ne doit pas être interprétée comme un consentement général ni comme une vérité durable sur la personne.

## 3. Cycle de vie de référence

Le contrat historique distingue implicitement la production, la disponibilité, la consultation et la réaction. Pour une implémentation, formaliser au minimum : générée, disponible, consultée, enregistrée, acceptée/suivie, ignorée/masquée, signalée, expirée ou retirée. Les transitions exactes et la conservation des réactions restent à spécifier dans un contrat versionné ; elles ne sont pas déclarées comme états runtime existants.

## 4. Règles métier et invariants

- Seul le Recommendation Engine produit les recommandations.
- Une recommandation est destinée à un utilisateur précis.
- Toute proposition doit avoir une raison vérifiable ; sinon elle est retirée ou présentée comme incertaine.
- Les permissions du contenu source sont revérifiées au moment de l'affichage et de l'action.
- Le domaine source reste propriétaire de ses données et de leur cycle de vie.
- Les réactions de l'utilisateur ne modifient pas l'objet métier source sans commande explicite vers ce domaine.
- Une recommandation n'est ni une promesse, ni une décision automatique, ni une action exécutée.
- La durée de validité et la fraîcheur des signaux sont prises en compte.

## 5. Confidentialité et sécurité

Les opérations nécessitent une authentification et un contrôle d'accès au destinataire. Les préférences personnelles et les signaux utilisés ne sont pas exposés à d'autres utilisateurs. Les champs sensibles provenant de Trust ou d'autres domaines ne sont pas transmis en clair ni utilisés hors de leur finalité autorisée. Les explications doivent éviter de révéler des informations privées sur des tiers.

## 6. API et événements proposés

Le contrat historique propose `GET /recommendations`, `GET /recommendations/{id}`, et des commandes `save`, `dismiss`, `accept`, `report`. Il propose les événements `RecommendationViewed`, `RecommendationAccepted`, `RecommendationDismissed`, `RecommendationSaved`, `RecommendationReported`. Ce sont des contrats cibles historiques, pas la preuve de routes actives.

Les sources potentielles citées sont Trust, Radar, Veille, Flash et Mission. Elles ne peuvent être connectées qu'au moyen de contrats d'événements et de projections autorisées ; Recommendation ne devient propriétaire d'aucune donnée source.

## 7. Architecture et état d'implémentation

Le contrat situe l'interface au-dessus de Recommendation API, Recommendation Domain, Recommendation Engine et du stockage. Les sources disponibles dans cette branche ne montrent pas de module applicatif Recommendation autonome ni de pipeline de production confirmé. Les endpoints, scores, modèles, jobs et règles de personnalisation doivent donc être considérés comme à spécifier/implémenter, sauf preuve indépendante sur le commit courant.

## 8. Critères de validation

Tester l'isolation des destinataires, la révocation d'une ressource source, la fraîcheur et l'expiration, la justification de chaque recommandation, la déduplication, la stabilité du classement, la protection des données sensibles, les réactions idempotentes, le signalement, le retrait et l'absence d'exécution automatique d'une action métier.

## 9. Sources conservées

Le contrat historique `11._Recommendation_API.md` reste la source des opérations et événements proposés. Le présent guide explique à lui seul le rôle, les parcours, les règles et les limites du moteur.