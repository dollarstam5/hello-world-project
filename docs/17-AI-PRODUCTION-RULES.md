# 17-AI-PRODUCTION-RULES.md

Version : V1.0 Statut : ACTIVE Catégorie : AI Engineering Framework Projet : Vitala

# 1. Objectif

AI-PRODUCTION-RULES.md définit les règles obligatoires avant tout déploiement de Vitala en production. Il garantit que :

- le système est stable;
- les données sont protégées;
- les utilisateurs ne sont pas exposés à des erreurs critiques;
- les changements sont contrôlés.
# 2. Principe fondamental

Une mise en production est une opération critique. Aucune IA ne doit déployer une modification importante sans validation complète. La priorité est : ```text id="5k3q91" Sécurité ↓ Stabilité ↓ Protection des données ↓ Disponibilité

↓ Performance ↓ Nouveauté

```
---
# 3. Définition d'une version prête pour production
Une version est prête uniquement si :
[] Fonctionnalités terminées
[] Tests validés
[] Sécurité vérifiée
[] Documentation mise à jour
[] Monitoring préparé
[] Plan de retour arrière défini
---
# 4. Environnements obligatoires
Vitala doit séparer :
## Développement
Objectif :
Création et expérimentation.
---
## Staging
Objectif :
Validation proche de la production.
---
## Production
```

```
Objectif :
Utilisateurs réels.
---
Une IA ne doit jamais tester directement des changements risqués en
production.
---
# 5. Processus de déploiement
Le processus obligatoire :
```text id="0m8qvz"
Développement
↓
Tests locaux
↓
Review
↓
Staging
↓
Validation
↓
Production
↓
Surveillance
```
# 6. Vérification avant déploiement

Avant publication : L'IA doit vérifier :

## Code

[] Build réussi [] Erreurs corrigées [] Code review effectuée

## Tests

[] Tests automatiques réussis [] Tests critiques validés

## Sécurité

[] Secrets protégés [] Permissions vérifiées [] RLS vérifié

## Documentation

[] Changements documentés [] Version mise à jour

# 7. Gestion des migrations Database

Toute migration production doit :

- être versionnée;
- être testée;
- être réversible si possible;
- être documentée.
Interdit :

- modification directe en production;
- suppression dangereuse;
- migration non testée.

# 8. Gestion des API en production

Avant publication d'une API : Vérifier :

- contrat stable;
- versionnement;
- sécurité;
- erreurs;
- performances.
Une modification cassant une API existante doit avoir une stratégie de migration.

# 9. Gestion des utilisateurs

Avant activation d'une fonctionnalité utilisateur : Vérifier :

- permissions;
- expérience utilisateur;
- messages d'erreur;
- protection des données.
# 10. Monitoring obligatoire

Une fonctionnalité importante doit être surveillée. Le monitoring doit suivre :

- erreurs;
- performances;
- disponibilité;
- comportements inhabituels.
# 11. Logs production

Les logs doivent permettre :

- diagnostic;
- sécurité;
- analyse.

Ils ne doivent jamais contenir :

- mots de passe;
- tokens;
- données privées inutiles.
# 12. Gestion des incidents

En cas de problème : Procédure : ```text id="9r1p4m" Détection ↓ Analyse ↓ Limitation impact ↓ Correction ↓ Validation ↓ Documentation

- méthode de retour arrière;
- sauvegarde nécessaire;
- procédure claire. Une IA doit toujours connaître : "Comment revenir à l'état précédent ?"
```
---
# 13. Rollback
Toute modification critique doit prévoir :
```

- sécurité minimale;
- validation;
- documentation après correction. Une urgence n'autorise pas une mauvaise pratique permanente. --- # 15. Gestion des fonctionnalités expérimentales Une fonctionnalité non stable doit être :
- isolée;
- identifiée;
- contrôlée. Elle ne doit pas affecter le système principal. --- # 16. Versionnement des releases Chaque version doit avoir :
- numéro;
- date;
- résumé;
- changements;
- corrections;
- risques connus. Format recommandé : ```text id="j5m7q2" MAJOR.MINOR.PATCH
```
---
# 14. Changements urgents
Même en urgence :
L'IA doit respecter :
```
Exemple : V1.0.0

# 17. Validation finale IA

Avant de déclarer une release terminée : L'IA doit fournir : ```text id="r3t9kx" Résumé : Fonctionnalités : Tests : Risques : Monitoring : Rollback : ```

# 18. Interdictions absolues

Une IA ne doit jamais : ❌ déployer sans tests. ❌ ignorer une erreur critique. ❌ modifier la production directement sans procédure. ❌ supprimer une protection pour faciliter le déploiement. ❌ cacher un problème connu.

# 19. Checklist Production

[] Build production réussi [] Tests validés [] Sécurité validée [] Database validée [] API validées

[] Monitoring actif [] Documentation mise à jour [] Rollback disponible

# 20. Règle finale

La production représente la confiance des utilisateurs. Une IA doit toujours préférer un retard contrôlé à une mise en production dangereuse.

# Historique

Version Modification V1.0 Création des règles production IA

# Fin de AI/17-AI-PRODUCTION-RULES.md