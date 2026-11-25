# Recommendation

Documentation autonome du moteur Recommendation.

## Lire dans cet ordre

1. [Guide complet](ENGINE_GUIDE.md) — finalité, contrats V1, parcours, architecture cible et statut réel.
2. [Spécification fonctionnelle](FUNCTIONAL_SPEC.md) — acteurs, production, consultation, réactions et critères d'acceptation.
3. [Architecture technique](TECHNICAL_ARCHITECTURE.md) — pipeline cible, responsabilités, sécurité et composants à construire.
4. [Contrat API et données](API_AND_DATA_CONTRACT.md) — décisions R1, modèles, routes historiques, réactions et versionnement.
5. [Tests et gouvernance](TESTING_AND_GOVERNANCE.md) — sécurité, qualité du classement, métriques et checklist d'activation.
6. [API historique](11._Recommendation_API.md) — source de l'intention V1, conservée sans la présenter comme une API déployée.

## Statut en bref

Les contrats TypeScript V1 sont désormais définis dans `packages/core-contracts/src/recommendation.ts` et exportés par `@eco/core-contracts`. Le contrat sépare l'état de disponibilité des réactions utilisateur, utilise des références sources opaques, impose une provenance minimisée et n'expose aucun score numérique non calibré.

Le moteur runtime n'est pas encore opérationnel : repository, migration SQL, RLS, tests multi-utilisateurs, API, jobs et UI restent à construire et à valider sur une base de test active. La documentation distingue les contrats livrés des capacités non encore démontrées.

## Backlog d'implémentation

- [Issue #91 — implémenter Recommendation de bout en bout](https://github.com/dollarstam5/hello-world-project/issues/91) : contrats, RLS, ingestion, classement, API/UI, gouvernance et tests d'acceptation.
