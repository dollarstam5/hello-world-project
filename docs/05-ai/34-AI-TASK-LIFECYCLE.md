34-AI-TASK-LIFECYCLE.md

Version : V1.0

Statut : ACTIVE

Catégorie : AI Quality Framework

Projet : Vitala

1. Objectif

AI-TASK-LIFECYCLE.md définit le processus officiel de gestion d'une tâche Vitala.

Il décrit les étapes obligatoires entre :

•

une idée ;

•

une tâche du backlog ;

•

une implémentation IA ;

•

une validation ;

•

une mise en production.

2. Principe fondamental

Aucune modification ne doit arriver directement dans le système.

Toute évolution doit suivre un cycle contrôlé.

```text id="b7k2qm" Idée

↓

Analyse

↓

Backlog

↓

Prompt IA

↓

1

Développement

↓

Tests

↓

Review

↓

Validation

↓

Production

↓

Maintenance

---

# 3. Phase 1 — Identification du besoin

Objectif :

Comprendre pourquoi une évolution est nécessaire.

Documenter :

- problème ;

- utilisateur concerné ;

- valeur apportée ;

- impact attendu.

---

# 4. Phase 2 — Analyse technique

Avant création de tâche :

L'IA analyse :

- architecture existante ;

- modules concernés ;

- dépendances ;

- risques.

2

Résultat attendu :

Une compréhension claire du changement.

---

# 5. Phase 3 — Création dans le Backlog

Chaque évolution devient une tâche officielle.

Informations obligatoires :

```text id="p9m4vz"

TASK-ID

Titre

Objectif

Domaine

Priorité

Complexité

Documents associés

Critères validation

6. Phase 4 — Préparation du prompt IA

La tâche est transformée en prompt selon :

AI-PROMPT-STANDARD.md

Le prompt doit contenir :

•

contexte ;

•

objectif ;

•

contraintes ;

•

validation attendue.

7. Phase 5 — Sélection de l'IA

Selon la tâche :

3

IA Architecture

Pour :

•

décisions techniques ;

•

structure système.

IA Développement

Pour :

•

création code ;

•

fonctionnalités.

IA Sécurité

Pour :

•

audit ;

•

protection.

IA Review

Pour :

•

validation.

8. Phase 6 — Développement

Pendant l'exécution :

L'IA doit :

•

respecter l'architecture ;

•

modifier uniquement le périmètre prévu ;

•

documenter ses décisions.

9. Phase 7 — Validation technique

Vérifications :

4

Code

[ ] Qualité validée

[ ] Architecture respectée

Fonctionnel

[ ] Objectif atteint

[ ] Cas utilisateurs vérifiés

Sécurité

[ ] Permissions correctes

[ ] Données protégées

10. Phase 8 — Tests

Les tests doivent couvrir :

•

fonctionnement normal ;

•

erreurs ;

•

sécurité ;

•

performance.

11. Phase 9 — Code Review

Une IA différente analyse :

•

qualité ;

•

risques ;

•

architecture ;

•

sécurité.

Résultat :

```text id="f3q7az" APPROUVÉ

ou

CORRECTIONS NÉCESSAIRES

5

---

# 12. Phase 10 — Documentation

Avant fermeture :

Mettre à jour :

- documentation technique ;

- architecture ;

- API ;

- Database ;

- historique.

---

# 13. Phase 11 — Passage Production

Conditions obligatoires :

[ ] Tests validés

[ ] Review validée

[ ] Sécurité validée

[ ] Documentation terminée

[ ] Rollback possible

---

# 14. Phase 12 — Surveillance

Après déploiement :

Surveiller :

- erreurs ;

- performances ;

- comportement utilisateur.

---

# 15. Gestion des statuts

Une tâche suit :

```text id="z5x8nc"

BACKLOG

6

↓

READY

↓

IN_PROGRESS

↓

TESTING

↓

REVIEW

↓

APPROVED

↓

DEPLOYED

↓

MONITORING

↓

DONE

16. Règle de blocage

Une tâche doit être bloquée si :

•

sécurité non validée ;

•

tests échoués ;

•

documentation absente ;

•

architecture violée.

17. Gestion des tâches urgentes

Une urgence peut accélérer le processus.

7

Elle ne peut jamais supprimer :

•

sécurité ;

•

validation ;

•

traçabilité.

18. Maintenance après livraison

Après production :

La tâche peut générer :

•

corrections ;

•

améliorations ;

•

optimisations.

Ces nouvelles évolutions deviennent de nouvelles tâches.

19. Checklist fermeture tâche

Avant fermeture :

[ ] Objectif atteint

[ ] Code validé

[ ] Tests réussis

[ ] Review terminée

[ ] Documentation mise à jour

[ ] Production stable

20. Règle finale

Le cycle de vie protège Vitala contre le chaos.

Chaque changement doit avoir :

•

une raison ;

•

une méthode ;

•

une validation ;

•

une trace.

8

Historique

Version Modification

V1.0

Création du cycle de vie des tâches IA

Fin de AI/34-AI-TASK-LIFECYCLE.md

9

