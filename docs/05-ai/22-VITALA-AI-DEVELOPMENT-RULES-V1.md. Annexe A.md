# Annexe A — Workflow officiel des assistants IA

Cette annexe complète le document **22-VITALA-AI-DEVELOPMENT-RULES-V1.md**. Elle décrit le processus obligatoire que tout assistant IA doit suivre avant, pendant et après une intervention sur le projet Vitala.

# Étape 1 — Comprendre la demande

Avant toute génération de code, l'IA doit :

- identifier le besoin réel;
- déterminer le domaine métier concerné;
- identifier les documents VPS impactés;
- vérifier si une fonctionnalité similaire existe déjà.
Aucune implémentation ne doit commencer sans cette analyse.

# Étape 2 — Vérifier l'architecture

L'IA doit ensuite vérifier :

- le Domain Model;
- les contrats API;
- la structure du projet;
- les dépendances existantes.
Elle ne doit jamais proposer une solution qui contourne l'architecture officielle.

# Étape 3 — Concevoir la solution

Avant d'écrire du code, l'IA doit définir :

- les composants concernés;
- les services concernés;
- les modèles concernés;
- les événements concernés;
- les impacts sur la synchronisation Offline First;
- les impacts sur les autres domaines.
Lorsque plusieurs solutions existent, l'IA doit expliquer les compromis.

# Étape 4 — Implémenter

Le code généré doit être :

- modulaire;
- lisible;
- documenté lorsque nécessaire;
- conforme aux conventions du projet;
- limité au périmètre demandé.
L'IA doit éviter toute modification inutile.

# Étape 5 — Vérifier

Avant de considérer la tâche terminée, l'IA vérifie :

- les règles métier;
- les contrats API;
- les performances;
- la sécurité;
- la compatibilité avec l'Offline First;
- l'absence de régression fonctionnelle.
# Étape 6 — Documenter

Si une modification impacte l'architecture, les API ou le comportement fonctionnel, l'IA doit proposer la mise à jour des documents concernés. La documentation fait partie intégrante du développement.

# Étape 7 — Préparer l'évolution

Toute solution proposée doit rester compatible avec :

- l'ajout de nouveaux domaines;
- l'ajout de nouvelles API;
- les futures applications Flutter;
- les futures évolutions de l'architecture.
L'IA doit privilégier les solutions extensibles plutôt que les solutions spécifiques à un cas isolé.

# Principe final

Une IA intervenant sur Vitala n'est pas un simple générateur de code. Elle agit comme un ingénieur logiciel participant à un projet à long terme. Chaque décision doit préserver :

- la cohérence de l'architecture;
- la qualité du code;
- la stabilité des contrats;
- la vision globale du projet.