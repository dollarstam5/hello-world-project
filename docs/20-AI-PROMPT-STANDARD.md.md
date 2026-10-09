# 20-AI-PROMPT-STANDARD.md

Version : V1.0 Statut : ACTIVE Catégorie : AI Engineering Framework Projet : Vitala

# 1. Objectif

AI-PROMPT-STANDARD.md définit la structure obligatoire utilisée pour communiquer avec les IA travaillant sur Vitala. Son objectif est de garantir que chaque demande IA soit :

- claire;
- précise;
- complète;
- vérifiable;
- compatible avec l'architecture Vitala.
# 2. Principe fondamental

Un bon prompt Vitala ne demande pas uniquement : "Créer une fonctionnalité." Il précise :

- le contexte;
- l'objectif;
- les règles;
- les fichiers concernés;
- les contraintes;
- les critères de validation.
# 3. Structure obligatoire d'un prompt Vitala

Tout prompt doit suivre :

```text id="a1k5bz" 1. Contexte

1. Objectif
2. Périmètre
3. Documents de référence
4. Règles obligatoires
5. Travail demandé
6. Contraintes techniques
7. Tests attendus
8. Critères de validation
9. Format de réponse attendu --- # 4. Section Contexte Cette partie explique à l'IA où elle intervient. Exemple : ```text Tu travailles sur Vitala. Le projet utilise :
- React/TypeScript
- Supabase
- PostgreSQL
- Architecture modulaire
- Offline First
L'objectif est d'éviter que l'IA travaille hors contexte.

# 5. Section Objectif

Définir précisément le résultat attendu. Mauvais :

```
Améliore le système Flash.
```
Bon :

```
Créer le système FlashDraft permettant
la création locale d'un brouillon Flash
avec synchronisation différée.
```
# 6. Section Périmètre

Définir ce qui est inclus. Exemple : Inclus :

- création du service;
- création des types;
- ajout des tests.
Exclus :

- refonte complète du module Flash.
# 7. Section Documents de référence

L'IA doit connaître les documents à consulter. Exemple :

```
Références obligatoires :
AI-CONSTITUTION.md
AI-ARCHITECTURE-RULES.md
DATABASE-DICTIONARY.md
FLASH-BUILD.md
```

# 8. Section Règles obligatoires

Définir les contraintes. Exemple :

- architecture modulaire;
- TypeScript strict;
- sécurité RLS;
- tests obligatoires.
```
Respecter :
```
# 9. Section Travail demandé

La tâche doit être découpée. Format :

```
Étape 1 :
Étape 2 :
Étape 3 :
```
Une IA doit savoir exactement quoi produire.

# 10. Section Contraintes techniques

Préciser :

- technologies;
- versions;
- conventions;
- limitations.
Exemple :

```
Ne pas utiliser de nouvelle dépendance.
Utiliser les services existants.
```

```
Respecter les types actuels.
```
# 11. Section Tests attendus

Chaque prompt doit préciser : Quels tests doivent être réalisés. Exemple :

- tests unitaires;
- tests intégration;
- validation sécurité.
```
Ajouter :
```
# 12. Section Critères de validation

Définir quand la tâche est considérée terminée. Exemple :

```
La tâche est terminée uniquement si :
[] Code créé
[] Tests réussis
[] Documentation mise à jour
[] Architecture respectée
```
# 13. Format de réponse obligatoire demandé à l'IA

Une IA travaillant sur Vitala doit répondre :

```
Analyse :
Plan :
Fichiers modifiés :
Code réalisé :
Tests :
Points d'attention :
Résultat final :
```
# 14. Types de prompts Vitala

Les prompts peuvent être :

## Création

Nouvelle fonctionnalité.

## Correction

Résolution d'un problème.

## Amélioration

Optimisation existante.

## Audit

Analyse qualité ou sécurité.

## Migration

Changement technique contrôlé.

# 15. Règles pour Lovable

Lorsqu'un prompt est destiné à Lovable : Ajouter :

- conserver la structure existante;
- ne pas créer de fichiers inutiles;
- séparer les modules;
- ne pas supprimer de fonctionnalités;
- expliquer les changements.
# 16. Règles pour plusieurs IA

Chaque IA doit recevoir :

- le contexte Vitala;
- les documents concernés;
- les contraintes;
- les critères de validation.
Une IA ne doit jamais recevoir uniquement une phrase courte sans contexte.

# 17. Interdictions

Un prompt Vitala ne doit jamais être : ❌ vague. ❌ contradictoire. ❌ sans critère de validation. ❌ sans contexte technique. ❌ sans limite de modification.

# 18. Checklist avant utilisation d'un prompt

[] Objectif clair [] Domaine identifié

[] Documents référencés [] Contraintes définies [] Tests demandés [] Validation définie

# 19. Règle finale

Un prompt Vitala doit permettre à une IA qui ne connaît pas le projet de comprendre exactement :

- quoi faire;
- pourquoi le faire;
- comment le faire;
- comment vérifier que c'est correct.
# Historique

Version Modification V1.0 Création du standard de prompts IA

# Fin de AI/20-AI-PROMPT-STANDARD.md