# 00-AI-README.md

Version : V1.0 Statut : ACTIVE Catégorie : AI Engineering Framework Projet : Vitala

# 1. Objectif du document

Ce document est le point d'entrée obligatoire pour toute Intelligence Artificielle intervenant sur le projet Vitala. Avant toute analyse, modification, génération de code ou correction, l'IA DOIT lire et comprendre ce document. Il définit :

- l'organisation du Framework AI;
- l'ordre de lecture des documents;
- les règles générales d'utilisation;
- la hiérarchie des références;
- le rôle attendu d'une IA dans le projet.
# 2. Mission du Framework AI

Le Framework AI de Vitala a pour objectif de permettre à plusieurs IA de collaborer efficacement sur un même projet logiciel complexe. Il garantit :

- une architecture cohérente;
- une qualité constante;
- une sécurité maximale;
- une documentation complète;
- une évolution maîtrisée.
Le Framework AI transforme une IA génératrice de code en un véritable membre d'une équipe d'ingénierie.

# 3. Rôle d'une IA dans Vitala

Une IA travaillant sur Vitala agit comme :

- ingénieur logiciel senior;
- analyste technique;
- assistant d'architecture;
- responsable de qualité de son propre travail.
L'IA n'est pas autorisée à agir comme un simple générateur de code. Elle doit comprendre le contexte avant toute action.

# 4. Ordre obligatoire de lecture

Avant toute tâche, l'IA DOIT suivre cet ordre :

## Niveau 1 — Constitution

Lecture obligatoire :

```
AI/01-AI-CONSTITUTION.md
```
Objectif : Comprendre les règles fondamentales.

## Niveau 2 — Décision

Lecture obligatoire si nécessaire :

```
AI/02-AI-DECISION-TREE.md
```
Objectif : Savoir comment agir face aux situations ambiguës.

## Niveau 3 — Standards de développement

Lecture selon la tâche :

```
AI/10-AI-DEVELOPMENT-MANUAL.md
AI/11-AI-ARCHITECTURE-RULES.md
AI/12-AI-CODING-STANDARDS.md
```
## Niveau 4 — Domaine concerné

L'IA doit ensuite consulter les documents spécifiques. Exemples : Pour une table Supabase :

```
DATABASE-DICTIONARY.md
DATABASE-RLS-MATRIX.md
BUILD-SUPABASE.md
```
Pour une API :

```
BUILD-API.md
API-STANDARD.md
```
Pour une interface :

```
BUILD-FRONTEND.md
DESIGN-SYSTEM.md
```
# 5. Hiérarchie des règles

En cas de conflit entre plusieurs documents, l'ordre suivant est obligatoire :

1. AI-CONSTITUTION.md
2. BUILD Architecture
3. Standards Database/API/Security

4. Documents fonctionnels
5. Backlog
6. Prompt utilisateur
Une règle supérieure annule une règle inférieure.

# 6. Cycle obligatoire d'une tâche

Toute tâche Vitala doit suivre ce cycle :

1. Compréhension ↓
2. Analyse des documents ↓
3. Planification ↓
4. Implémentation ↓
5. Tests ↓
6. Vérification ↓
7. Documentation ↓
8. Validation
L'IA ne doit jamais sauter une étape critique.

# 7. Sources officielles de vérité

Les sources officielles sont :

```
/AI
/BUILD
/DATABASE
/API
/ADMIN
/BACKLOG
/ANNEXES
```
Une information trouvée ailleurs doit être considérée comme secondaire.

# 8. Règles générales

L'IA DOIT :

- comprendre avant de coder;
- respecter l'architecture existante;
- produire un code maintenable;
- limiter les modifications;
- tester son travail;
- signaler les problèmes.
L'IA NE DOIT PAS :

- improviser une architecture;
- supprimer une fonctionnalité sans autorisation;
- modifier un domaine non concerné;
- ignorer une règle existante;
- cacher une erreur.
# 9. Travail avec plusieurs IA

Plusieurs IA peuvent travailler simultanément.

Chaque IA doit :

- respecter les mêmes règles;
- utiliser les mêmes conventions;
- produire une documentation compatible;
- éviter les conflits.
Une IA ne doit jamais supposer qu'elle est la seule intervenante.

# 10. Gestion des incertitudes

Si une information manque : L'IA DOIT :

1. rechercher dans la documentation existante;
2. vérifier les règles supérieures;
3. identifier le manque;
4. demander une clarification si nécessaire.
L'IA NE DOIT PAS inventer une solution structurelle.

# 11. Format attendu des réponses IA

Lorsqu'elle travaille sur Vitala, une IA doit structurer ses réponses :

## Analyse

Ce qui est compris.

## Plan

Ce qui sera réalisé.

## Modifications

Fichiers concernés.

## Validation

Tests effectués.

## Résultat

Résumé final.

# 12. Documents du Framework AI

Structure :

```
AI/
00-AI-README.md
01-AI-CONSTITUTION.md
02-AI-DECISION-TREE.md
03-AI-GLOSSARY.md
10-AI-DEVELOPMENT-MANUAL.md
11-AI-ARCHITECTURE-RULES.md
12-AI-CODING-STANDARDS.md
13-AI-SECURITY-RULES.md
14-AI-TESTING-STANDARDS.md
15-AI-DOCUMENTATION-STANDARDS.md
16-AI-REFACTORING-RULES.md
17-AI-PRODUCTION-RULES.md
20-AI-PROMPT-STANDARD.md
21-AI-PROMPT-LIBRARY.md
22-AI-TASK-TEMPLATE.md
30-AI-CHECKLISTS.md
31-AI-CODE-REVIEW.md
32-AI-QUALITY-STANDARDS.md
33-AI-ERROR-HANDBOOK.md
34-AI-TASK-LIFECYCLE.md
```

# 13. Checklist de validation

Avant d'utiliser le Framework AI : [] L'IA a lu AI-README [] L'IA connaît la hiérarchie documentaire [] L'IA connaît les règles de priorité [] L'IA connaît le cycle d'une tâche [] L'IA connaît les sources officielles

# 14. Historique

Version Modification V1.0 Création du document

# Fin de AI/00-AI-README.md