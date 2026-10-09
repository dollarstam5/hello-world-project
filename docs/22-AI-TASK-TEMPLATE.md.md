# 22-AI-TASK-TEMPLATE.md

Version : V1.0 Statut : ACTIVE Catégorie : AI Engineering Framework Projet : Vitala

# 1. Objectif

AI-TASK-TEMPLATE.md définit le format officiel d'une tâche Vitala destinée à être exécutée par une Intelligence Artificielle. Chaque tâche doit être :

- atomique;
- indépendante;
- mesurable;
- testable;
- documentée.
# 2. Principe d'une tâche atomique

Une tâche atomique doit représenter une seule unité de travail. Elle ne doit pas contenir plusieurs grands objectifs mélangés. Mauvais exemple :

```
Créer tout le système Flash complet.
```
Bon exemple :

```
Créer le modèle TypeScript FlashDraft.
```

# 3. Structure officielle d'une tâche

Chaque tâche Vitala doit contenir : ```text id="6p2mzk" TASK-ID Titre Objectif Contexte Domaine Priorité Documents référence Fichiers concernés Travail demandé Contraintes Critères de validation Tests Documentation Dépendances Résultat attendu

```
---
# 4. Identifiant de tâche
Chaque tâche doit avoir un identifiant unique.
Format recommandé :
```text id="q8w5n2"
VTL-[MODULE]-[NUMERO]
```
### Exemples :

```
VTL-FLASH-001
VTL-AUTH-014
VTL-DB-025
```
# 5. Titre

Le titre doit être :

- court;
- précis;
- orienté action.
Exemples : Correct :

```
Créer le service de synchronisation FlashDraft
```
Incorrect :

```
Améliorer Flash
```
# 6. Objectif

Explique le résultat attendu. Format :

```
Cette tâche permet de :
[objectif]
```
# 7. Contexte

Décrire pourquoi cette tâche existe.

Inclure :

- problème actuel;
- besoin utilisateur;
- impact système.
# 8. Domaine concerné

Chaque tâche appartient à un domaine. Exemples :

```
AUTH
FLASH
SCAN
RADAR
VEILLE
TRUST
ADMIN
DATABASE
API
AI
INFRASTRUCTURE
```
# 9. Priorité

Niveaux :

## P0 — Critique

Bloque le système.

## P1 — Important

Fonctionnalité majeure.

## P2 — Normal

Amélioration nécessaire.

## P3 — Optimisation

Amélioration future.

# 10. Documents de référence

La tâche doit indiquer les documents obligatoires. Exemple :

```
Références :
AI-ARCHITECTURE-RULES.md
FLASH-BUILD.md
DATABASE-DICTIONARY.md
```
# 11. Fichiers concernés

L'IA doit connaître :

- fichiers existants;
- fichiers à créer;
- fichiers potentiellement impactés.
Exemple :

```
Créer :
src/features/flash/types/FlashDraft.ts
Modifier :
```

```
src/features/flash/services/index.ts
```
# 12. Travail demandé

Cette section décrit précisément les actions. Format :

```
Étape 1 :
Étape 2 :
Étape 3 :
```
Chaque étape doit être vérifiable.

# 13. Contraintes obligatoires

Exemples :

- TypeScript strict;
- architecture modulaire;
- sécurité RLS;
- tests obligatoires;
- aucune nouvelle dépendance.
```
Respecter :
```
# 14. Critères de validation

Une tâche est terminée uniquement si : ```text id="1r9q0a" [] Fonctionnalité réalisée [] Architecture respectée [] Code propre [] Tests réussis

[] Sécurité vérifiée [] Documentation mise à jour

- tests unitaires;
- tests intégration;
- tests sécurité;
- tests UI. Exemple : ```text Tester :
- création correcte d'un FlashDraft;
- sauvegarde locale;
- gestion erreur.
```
---
# 15. Tests attendus
Définir :
```
# 16. Documentation attendue

Préciser :

- fichier documentation à modifier;
- informations à ajouter.
# 17. Dépendances

Une tâche peut dépendre d'autres tâches. Format :

```
Dépend de :
VTL-AUTH-001
VTL-DB-004
```
Une tâche sans dépendance doit fonctionner seule.

# 18. Résultat attendu de l'IA

L'IA doit répondre avec : ```text id="0w7f4k" Analyse : Plan : Fichiers créés/modifiés : Code : Tests : Validation : Documentation :

```
---
# 19. Statuts d'une tâche
Cycle officiel :
```text id="x9m2vb"
BACKLOG
↓
READY
↓
IN_PROGRESS
↓
TESTING
↓
REVIEW
↓
DONE
```

# 20. Règles finales

Une tâche Vitala doit être :

- suffisamment petite pour être réalisée par une IA;
- suffisamment précise pour éviter l'interprétation;
- suffisamment complète pour être validée.
Une IA doit pouvoir exécuter une tâche sans avoir besoin de deviner.

# Historique

Version Modification V1.0 Création du modèle tâche IA

# Fin de AI/22-AI-TASK-TEMPLATE.md