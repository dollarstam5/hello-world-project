30-AI-CHECKLISTS.md

Version : V1.0

Statut : ACTIVE

Catégorie : AI Quality Framework

Projet : Vitala

1. Objectif

AI-CHECKLISTS.md définit les listes de vérification obligatoires utilisées avant validation d'une

modification dans Vitala.

Son objectif est d'éviter :

•

les oublis ;

•

les erreurs de conception ;

•

les problèmes de sécurité ;

•

les livraisons incomplètes.

2. Principe fondamental

Une IA ne doit jamais déclarer :

"Travail terminé"

sans avoir effectué les vérifications adaptées.

Une checklist validée représente une preuve de contrôle.

3. Checklist générale de toute tâche

Avant validation :

Compréhension

[ ] Objectif compris

[ ] Domaine identifié

1

[ ] Documents consultés

[ ] Impacts analysés

Architecture

[ ] Structure respectée

[ ] Responsabilités séparées

[ ] Aucun mélange de couches

[ ] Aucun fichier inutile créé

Code

[ ] Nommage correct

[ ] Code lisible

[ ] Types correctement définis

[ ] Duplication évitée

[ ] Code mort supprimé

Sécurité

[ ] Permissions vérifiées

[ ] Données protégées

[ ] Secrets absents du code

[ ] Validation des entrées présente

Tests

[ ] Tests ajoutés si nécessaire

[ ] Tests exécutés

[ ] Résultats vérifiés

2

Documentation

[ ] Documentation mise à jour

[ ] Décisions importantes enregistrées

[ ] Historique modifié si nécessaire

4. Checklist nouvelle fonctionnalité

Avant ajout d'une fonctionnalité :

[ ] Besoin utilisateur défini

[ ] Architecture validée

[ ] Modèle de données défini

[ ] API définie si nécessaire

[ ] Sécurité analysée

[ ] Cas d'erreur prévus

[ ] Tests planifiés

5. Checklist Frontend

Interface

[ ] Design System respecté

[ ] Responsive vérifié

[ ] Accessibilité considérée

[ ] États chargement présents

[ ] États erreur présents

[ ] États vides gérés

3

Performance

[ ] Rendus inutiles évités

[ ] Chargements optimisés

[ ] Données limitées correctement

6. Checklist Backend

[ ] Logique métier séparée

[ ] Validation présente

[ ] Gestion erreurs présente

[ ] Permissions contrôlées

[ ] Logs appropriés

7. Checklist Database

Avant migration :

[ ] Schéma analysé

[ ] Relations vérifiées

[ ] Migration créée

[ ] RLS configuré

[ ] Index nécessaires analysés

[ ] Impact API vérifié

8. Checklist API

Avant création/modification :

[ ] Endpoint défini

[ ] Contrat documenté

4

[ ] Authentification vérifiée

[ ] Permissions vérifiées

[ ] Erreurs définies

[ ] Tests réalisés

9. Checklist fonctionnalité Offline

Pour les modules Offline First :

[ ] Stockage local défini

[ ] Synchronisation prévue

[ ] Gestion conflit prévue

[ ] Reprise réseau testée

[ ] Données cohérentes après sync

10. Checklist Intelligence Artificielle

Pour une fonctionnalité IA :

[ ] Objectif IA défini

[ ] Données utilisées identifiées

[ ] Permissions vérifiées

[ ] Coûts analysés

[ ] Limites définies

[ ] Gestion erreurs prévue

11. Checklist Administration

Pour Admin Dashboard :

[ ] Rôles définis

5

[ ] Permissions configurées

[ ] Actions sensibles protégées

[ ] Audit disponible

[ ] Logs disponibles

12. Checklist Production

Avant mise en ligne :

[ ] Build réussi

[ ] Tests réussis

[ ] Sécurité validée

[ ] Migration vérifiée

[ ] Monitoring actif

[ ] Rollback possible

13. Checklist modification importante

Pour changement majeur :

[ ] Impact analysé

[ ] Plan défini

[ ] Risques identifiés

[ ] Solution retour arrière disponible

[ ] Documentation complète

14. Checklist avant livraison IA

L'IA doit fournir :

```text id="7v9d2m" Résumé :

6

Modifications :

Tests :

Problèmes rencontrés :

Décisions prises :

Validation finale : ```

15. Règle d'échec

Si un élément critique échoue :

La tâche ne peut pas être considérée terminée.

Exemples :

•

sécurité non validée ;

•

tests échoués ;

•

architecture non respectée.

16. Règle finale

Les checklists ne remplacent pas l'intelligence.

Elles empêchent simplement les erreurs évitables.

Dans Vitala :

Vérifier avant livrer est obligatoire.

Historique

Version Modification

V1.0

Création des checklists qualité IA

Fin de AI/30-AI-CHECKLISTS.md

7

