# Recommendation — guide autonome du moteur

**Mission :** proposer à un utilisateur des actions personnalisées, pertinentes, explicables et limitées dans le temps, sans décider ni agir à sa place.  
**Statut constaté :** intention fonctionnelle et contrat API historique documentés ; aucun moteur runtime Recommendation n'est identifié dans l'arborescence de cette branche.

## 1. Rôle et périmètre

Recommendation transforme des signaux autorisés en propositions personnelles. Une proposition peut porter sur une mission, un Flash, une opportunité, une personne, une compétence, un contenu ou une action. Recommendation est propriétaire de la proposition, de son classement, de sa justification, de sa validité et des réactions du destinataire. La ressource proposée reste la propriété du domaine source.

Le moteur ne doit jamais exécuter automatiquement l'action suggérée, modifier directement la ressource source ou présenter un score comme une vérité objective.

## 2. Parcours utilisateur de bout en bout

### 2.1 Préparer les signaux

1. Identifier le destinataire authentifié.
2. Charger uniquement les préférences et projections autorisées pour la finalité de recommandation.
3. Vérifier la fraîcheur, le statut et les droits d'accès de chaque ressource.
4. Exclure les ressources expirées, supprimées, privées ou insuffisamment documentées.
5. Conserver une provenance minimisée et la version des règles utilisées.

La présence d'une source potentielle dans le contrat n'implique pas qu'un connecteur existe ou soit activé.

### 2.2 Produire et qualifier

1. Construire les candidats à partir de projections versionnées.
2. Appliquer les règles d'éligibilité et les permissions.
3. Dédupliquer les propositions équivalentes.
4. Classer selon des règles versionnées, explicables et testables.
5. Appliquer diversité et plafonds de fréquence.
6. Générer une justification fidèle aux signaux utilisés.
7. Fixer une période de validité et persister la proposition.

Aucun algorithme, poids, seuil, modèle IA ou score opérationnel n'est défini dans les sources actuelles.

### 2.3 Consulter et réagir

Le destinataire consulte sa liste et le détail d'une proposition. Il peut l'enregistrer, indiquer qu'il souhaite la suivre/accepter, l'ignorer/la masquer ou la signaler. Ces réactions sont propres à son compte et ne modifient jamais l'objet source.

Une acceptation indique une intention ; elle ne signifie pas que l'utilisateur a rejoint une mission, contacté une personne ou réalisé une action. La mutation effective doit passer par le domaine qui possède la ressource et demander sa propre autorisation.

### 2.4 Retirer une proposition

Une proposition expire ou est retirée lorsque sa période est écoulée, que la ressource source devient indisponible ou que le destinataire perd le droit d'y accéder. La permission doit être revérifiée à la lecture et avant l'action, pas seulement au moment du calcul.

## 3. Objet et données conceptuels

Une proposition devrait contenir un identifiant, un destinataire, une référence opaque vers la cible, une explication, une provenance minimisée, une priorité, éventuellement un score versionné, les dates de génération/disponibilité/expiration et une version de règle.

Une réaction devrait être liée à l'utilisateur et à la recommandation, avec une action, une date, une clé d'idempotence et éventuellement un motif de signalement.

Ces schémas sont des propositions : aucun type TypeScript ni table Recommendation n'a été identifié dans le dépôt.

## 4. Cycle de vie fonctionnel proposé

Le contrat historique ne fixe pas de machine d'état formelle. Le vocabulaire proposé est : `generated`, `available`, `viewed`, `saved`, `accepted`, `dismissed`, `reported`, `expired`, `withdrawn`. Il est préférable de conserver les réactions comme événements séparés plutôt que d'écraser un unique statut.

Ces états sont une cible de conception et non des statuts runtime existants.

## 5. Règles métier et invariants

- Une recommandation a un destinataire précis.
- Une justification doit être reliée à des preuves autorisées.
- Les droits de la ressource source sont revérifiés au moment de l'affichage.
- Les propositions expirées, retirées ou dupliquées sont exclues.
- La fréquence et la diversité sont contrôlées.
- Les signaux sensibles ne sont jamais révélés dans l'explication.
- Les réactions n'altèrent pas la ressource source.
- Aucune action n'est exécutée sans consentement explicite dans le domaine propriétaire.
- Une recommandation n'est ni une garantie, ni une décision automatique, ni une preuve sur une personne.

## 6. Architecture cible et état réel

Architecture cible : projections sources versionnées → ingestion/validation → contrôle de permission → génération de candidats → déduplication/fraîcheur → classement/diversité/fréquence → explication/provenance → stockage → API et réactions.

L'inventaire de la branche ne montre aucun package/module applicatif Recommendation, type de contrat, repository, migration SQL, test dédié, job de calcul ou route API active. L'architecture ci-dessus est donc une cible, pas une description de services déjà présents.

## 7. API et événements historiques

Le contrat `11._Recommendation_API.md` propose :

- `GET /recommendations`
- `GET /recommendations/{id}`
- `POST /recommendations/{id}/save`
- `POST /recommendations/{id}/dismiss`
- `POST /recommendations/{id}/accept`
- `POST /recommendations/{id}/report`

Événements proposés : `RecommendationViewed`, `RecommendationAccepted`, `RecommendationDismissed`, `RecommendationSaved`, `RecommendationReported`.

Ces routes et événements ne sont pas confirmés comme implémentés. Le destinataire devra toujours être dérivé de l'identité authentifiée.

## 8. Sécurité et gouvernance

L'API future devra appliquer l'isolation stricte par destinataire, la revalidation des ressources sources, l'idempotence des réactions, la limitation de fréquence, l'audit des accès privilégiés et une politique de rétention. Les explications ne doivent pas exposer des attributs privés ou des signaux Trust non autorisés.

Le classement doit être versionné, calibré et contrôlé contre les biais et les effets d'exclusion. Il ne doit pas être optimisé uniquement sur les clics ou acceptations.

## 9. Critères de validation

Tester isolation destinataire, retrait après révocation, fraîcheur, provenance, justification, déduplication, stabilité du classement, diversité, plafonds de fréquence, idempotence, signalement, absence de mutation source et absence d'exécution automatique.

Aucun test dédié Recommendation n'a été identifié dans la branche. Les documents de validation décrivent les tests à créer, non des résultats déjà obtenus.

## 10. Sources autonomes

- [Spécification fonctionnelle](FUNCTIONAL_SPEC.md)
- [Architecture technique](TECHNICAL_ARCHITECTURE.md)
- [Contrat API et données](API_AND_DATA_CONTRACT.md)
- [Tests et gouvernance](TESTING_AND_GOVERNANCE.md)
- [Contrat API historique conservé](11._Recommendation_API.md)

Ce guide contient la vue d'ensemble de Recommendation sans nécessiter la lecture de la documentation d'un autre moteur.
