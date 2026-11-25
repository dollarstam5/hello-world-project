# Recommendation — guide autonome du moteur

**Mission :** proposer à un utilisateur des actions personnalisées, pertinentes, explicables et limitées dans le temps, sans décider ni agir à sa place.  
**Statut constaté :** contrats de domaine TypeScript V1 définis dans `@eco/core-contracts` ; aucun moteur runtime (repository, migration appliquée, API, job ou UI) n'est encore démontré dans cette branche.

## 1. Rôle et périmètre

Recommendation transforme des signaux autorisés en propositions personnelles. Une proposition peut porter sur une mission, un Flash, une opportunité, une personne, une compétence, un contenu ou une action. Recommendation est propriétaire de la proposition, de son classement, de sa justification, de sa validité et des réactions du destinataire. La ressource proposée reste la propriété du domaine source.

Le moteur ne doit jamais exécuter automatiquement l'action suggérée, modifier directement la ressource source ou présenter un score comme une vérité objective. Le contrat V1 ne publie pas de score numérique ; il utilise une priorité explicable.

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

Aucun algorithme, poids, seuil, modèle IA ou score opérationnel n'est défini. Le contrat V1 n'expose donc aucun score numérique.

### 2.3 Consulter et réagir

Le destinataire consulte sa liste et le détail d'une proposition. Il peut l'enregistrer, indiquer qu'il souhaite la suivre/accepter, l'ignorer/la masquer ou la signaler. Ces réactions sont des événements distincts, append-only, rattachés au destinataire. Elles ne modifient jamais l'objet source.

Une acceptation indique une intention ; elle ne signifie pas que l'utilisateur a rejoint une mission, contacté une personne ou réalisé une action. La mutation effective doit passer par le domaine qui possède la ressource et demander sa propre autorisation.

### 2.4 Retirer une proposition

Une proposition expire ou est retirée lorsque sa période est écoulée, que la ressource source devient indisponible ou que le destinataire perd le droit d'y accéder. La permission doit être revérifiée à la lecture et avant l'action, pas seulement au moment du calcul.

## 3. Contrats de domaine V1

Le contrat est défini dans `packages/core-contracts/src/recommendation.ts` et exporté par `@eco/core-contracts`.

- `RecommendationRecord` : destinataire, cible opaque, explication, provenance, priorité, état de disponibilité, version de règle et dates.
- `RecommendationCandidate` : candidat transitoire issu des projections autorisées.
- `RecommendationSourceProjection` : projection minimisée, versionnée et limitée à la finalité `recommendation`.
- `RecommendationReaction` : événement append-only `viewed/saved/accepted/dismissed/reported`.
- Les commandes client ne portent pas de `recipientId` ; le serveur doit le dériver de l'identité authentifiée.
- Les identifiants Recommendation et Reaction sont typés.
- Les timestamps sont des millisecondes Unix.
- Les statuts système sont `generated`, `available`, `expired`, `withdrawn`. Les réactions ne sont pas des statuts système.
- Aucun score numérique n'est exposé tant qu'une formule calibrée et versionnée n'est pas approuvée.

Voir [contrat API et données](API_AND_DATA_CONTRACT.md) pour les décisions détaillées.

## 4. Architecture cible et état réel

Architecture cible : projections sources versionnées → ingestion/validation → contrôle de permission → génération de candidats → déduplication/fraîcheur → classement/diversité/fréquence → explication/provenance → stockage → API et réactions.

À ce stade, seuls les contrats de domaine TypeScript sont ajoutés. Aucun repository, migration SQL, test RLS, job de calcul, endpoint ou écran Recommendation n'est confirmé comme livré.

## 5. API et événements historiques

Le contrat `11._Recommendation_API.md` propose :

- `GET /recommendations`
- `GET /recommendations/{id}`
- `POST /recommendations/{id}/save`
- `POST /recommendations/{id}/dismiss`
- `POST /recommendations/{id}/accept`
- `POST /recommendations/{id}/report`

Ces routes et événements ne sont pas confirmés comme implémentés. Le destinataire devra toujours être dérivé de l'identité authentifiée.

## 6. Sécurité et gouvernance

L'API future devra appliquer l'isolation stricte par destinataire, la revalidation des ressources sources, l'idempotence des réactions, la limitation de fréquence, l'audit des accès privilégiés et une politique de rétention. Les explications ne doivent pas exposer des attributs privés ou des signaux Trust non autorisés.

Le classement doit être versionné, calibré et contrôlé contre les biais et les effets d'exclusion. Il ne doit pas être optimisé uniquement sur les clics ou acceptations.

## 7. Validation et limites

Les contrats TypeScript sont écrits mais leur compilation dans l'environnement du dépôt n'a pas encore été exécutée. Le schéma SQL, les contraintes, les index, les politiques RLS et les tests multi-utilisateurs restent à faire sur une base de test active. La politique de rétention/suppression doit aussi être validée avant persistance des réactions.

## 8. Sources autonomes

- [Spécification fonctionnelle](FUNCTIONAL_SPEC.md)
- [Architecture technique](TECHNICAL_ARCHITECTURE.md)
- [Contrat API et données](API_AND_DATA_CONTRACT.md)
- [Tests et gouvernance](TESTING_AND_GOVERNANCE.md)
- [Contrat API historique conservé](11._Recommendation_API.md)

Ce guide contient la vue d'ensemble de Recommendation sans nécessiter la lecture de la documentation d'un autre moteur.
