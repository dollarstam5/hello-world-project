# Recommendation

Documentation autonome du moteur Recommendation.

## Lire dans cet ordre

1. [Guide complet](ENGINE_GUIDE.md) — finalité, parcours, règles, architecture cible et statut réel.
2. [Spécification fonctionnelle](FUNCTIONAL_SPEC.md) — acteurs, production, consultation, réactions et critères d'acceptation.
3. [Architecture technique](TECHNICAL_ARCHITECTURE.md) — pipeline cible, responsabilités, sécurité et composants à construire.
4. [Contrat API et données](API_AND_DATA_CONTRACT.md) — routes historiques, schémas proposés, réactions et versionnement.
5. [Tests et gouvernance](TESTING_AND_GOVERNANCE.md) — sécurité, qualité du classement, métriques et checklist d'activation.
6. [API historique](11._Recommendation_API.md) — source de l'intention V1, conservée sans la présenter comme une API déployée.

## Statut en bref

Aucun code runtime Recommendation (modèle, repository, migration, API, job, UI ou tests dédiés) n'a été identifié dans l'arborescence de la branche. Les documents séparent donc la cible fonctionnelle/technique des capacités réellement démontrées. Les domaines sources éventuels sont décrits comme des producteurs de signaux, jamais comme des prérequis pour comprendre Recommendation.
