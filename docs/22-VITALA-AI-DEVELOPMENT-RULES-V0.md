# 22-VITALA-AI-DEVELOPMENT-RULES-V1.md

## Version : V1

Statut : Référence officielle pour les assistants IA

# 1. Objectif

Ce document définit les règles que tout assistant d'intelligence artificielle intervenant sur le projet Vitala doit respecter.

Il garantit que les contributions produites par les IA restent cohérentes avec l'architecture, les principes métier et les standards de qualité définis dans le VPS.

Ces règles s'appliquent notamment à ChatGPT, Lovable, Cursor, Codex et à tout autre assistant de développement utilisé sur le projet.

# 2. Mission de l'IA

Une IA participant au développement de Vitala doit :

- produire un code correct et maintenable;
- respecter les décisions d'architecture existantes;
- préserver la modularité du projet;
- limiter la dette technique;
- proposer des améliorations compatibles avec le VPS.
Son rôle est d'assister les développeurs, jamais de modifier arbitrairement la vision du projet.

# 3. Principes fondamentaux

Toute IA doit respecter les principes suivants :

- Domain First
- Identity First
- API First
- Offline First
- Single Source of Truth
- Zero Cross Domain Ownership
- Security by Design
- Event Ready
Aucune proposition ne doit entrer en contradiction avec ces principes.

# 4. Règles absolues

## Une IA ne doit jamais :

- modifier l'architecture sans justification explicite;
- casser un contrat API existant;
- dupliquer une logique métier;
- créer des dépendances circulaires;
- accéder directement aux données d'un autre domaine;
- contourner les règles de sécurité;
- supprimer une fonctionnalité sans validation.
# 5. Génération de code

Le code produit par une IA doit :

- être modulaire;
- être lisible;
- être documenté lorsque nécessaire;
- être testable;
- respecter les conventions du projet;
- éviter les duplications.
Les composants d'interface, la logique métier et l'accès aux données doivent rester clairement séparés.

# 6. Modification du code existant

## Avant toute modification, l'IA doit :

- comprendre le domaine concerné;
- identifier les impacts potentiels;
- préserver les contrats publics;
- éviter les effets de bord.
Les modifications doivent être les plus ciblées possible.

# 7. Refactoring

Une IA peut proposer un refactoring uniquement si celui-ci :

- améliore la lisibilité;
- réduit la complexité;
- améliore les performances;

- respecte l'architecture existante.
Un refactoring ne doit jamais modifier le comportement fonctionnel sans validation.

# 8. Documentation

Toute évolution importante doit être accompagnée de la mise à jour de la documentation concernée :

- Domain Model;
- API Contracts;
- Database;
- Architecture;
- Guides de développement.
La documentation est considérée comme une partie intégrante du projet.

# 9. Qualité attendue

## Chaque contribution doit viser :

- simplicité;
- cohérence;
- performances;
- sécurité;
- maintenabilité;
- évolutivité.
L'IA doit privilégier des solutions robustes plutôt que des optimisations prématurées.

# 10. Checklist obligatoire

Avant de considérer une tâche comme terminée, l'IA vérifie que :

- l'architecture est respectée;
- le domaine reste propriétaire de ses données;
- les contrats API sont préservés;
- les principes Offline First sont pris en compte lorsque nécessaire;
- aucune dépendance circulaire n'a été introduite;
- le code est lisible et modulaire;
- les tests nécessaires sont prévus ou mis à jour;
- la documentation a été vérifiée.

# 11. Collaboration avec les développeurs

## L'IA doit :

- expliquer ses choix lorsqu'ils ne sont pas évidents;
- signaler les impacts importants;
- proposer plusieurs solutions lorsque des compromis existent;
- distinguer clairement les faits, les recommandations et les hypothèses.
La décision finale appartient toujours aux responsables du projet.

# 12. Évolutions futures

Ce document pourra évoluer afin d'intégrer :

- de nouveaux assistants IA;
- des outils de génération automatique;
- des agents spécialisés;
- des workflows multi-agents.
Les principes fondamentaux définis dans le VPS demeurent la référence.

# 13. Documents associés

- 14 — Domain Model
- 16 — API
- 18 — Architecture
- 20 — Deployment Guide
- 21 — Development Guide
Le présent document constitue la charte officielle des assistants IA de Vitala. Son objectif est d'assurer que toute contribution automatisée reste conforme à la vision, à l'architecture et aux standards de qualité du projet.