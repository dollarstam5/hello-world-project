BUILD-SUPABASE.md

Partie C.19 — Checklist PostgreSQL

Version : V1

Statut : Checklist officielle PostgreSQL de Vitala

1. Objectif

Cette checklist constitue la procédure officielle de validation de toute évolution PostgreSQL dans Vitala.

Elle doit être utilisée avant :

•

toute Pull Request ;

•

toute revue de code ;

•

toute fusion vers la branche principale ;

•

tout déploiement en préproduction ;

•

toute mise en production.

Aucune évolution PostgreSQL ne peut être considérée comme terminée sans cette validation.

2. Structure de la base

Vérifier que :

•

•

•

•

•

•

☐ Les nouvelles tables sont correctement modélisées.
☐ Les conventions de nommage ( snake_case ) sont respectées.
☐ Les clés primaires utilisent des UUID lorsque requis.
☐ Les colonnes d'audit sont présentes lorsque nécessaires.
☐ Les contraintes ( NOT NULL ,  CHECK ,  UNIQUE , etc.) sont définies.
☐ Aucune redondance inutile n'a été introduite.

3. Relations

Vérifier que :

•

•

•

•

•

☐ Toutes les clés étrangères sont définies.
☐ Les relations respectent le Domain Model.
☐ Les règles  ON DELETE  et  ON UPDATE  sont appropriées.
☐ Les tables de liaison sont utilisées pour les relations plusieurs-à-plusieurs.
☐ L'intégrité référentielle est garantie.

1

4. Index

Vérifier que :

•

•

•

•

•

☐ Les index nécessaires existent.
☐ Aucun index inutile n'a été ajouté.
☐ Les index composites sont justifiés.
☐ Les requêtes critiques utilisent les index prévus.
☐ Les performances ont été analysées lorsque nécessaire.

5. Vues

Vérifier que :

•

•

•

•

☐ Les vues répondent à un besoin identifié.
☐ Elles ne contiennent pas de logique métier.
☐ Les performances sont satisfaisantes.
☐ Les permissions sont correctement définies.

6. Fonctions SQL

Vérifier que :

•

•

•

•

•

☐ Les fonctions ont une responsabilité unique.
☐ Elles ne contiennent pas de logique métier complexe.
☐ Les paramètres sont correctement typés.
☐ Les erreurs sont gérées.
☐ Les fonctions sont documentées et testées.

7. Triggers

Vérifier que :

•

•

•

•

☐ Les triggers sont limités à des traitements techniques.
☐ Aucun workflow métier n'est implémenté.
☐ Les performances restent satisfaisantes.
☐ Les effets secondaires sont documentés.

2

8. Sécurité

Vérifier que :

•

•

•

•

•

☐ La Row Level Security (RLS) est activée sur toutes les tables métier.
☐ Les politiques RLS sont définies et testées.
☐ Les permissions respectent le principe du moindre privilège.
☐ Les données sensibles sont correctement protégées.
☐ Les fonctions utilisant  SECURITY DEFINER  sont justifiées.

9. Transactions

Vérifier que :

•

•
•

•

☐ Les transactions sont courtes.
☐ Elles garantissent l'atomicité.
☐ Les risques de blocage sont limités.
☐ Les scénarios d'échec sont couverts par des tests.

10. Performances

Vérifier que :

•

•

•

•

☐ Les requêtes critiques ont été analysées ( EXPLAIN ANALYZE ).
☐ Les temps de réponse respectent les objectifs.
☐ Les scans séquentiels non justifiés ont été éliminés.
☐ Les traitements coûteux sont optimisés.

11. Migrations

Vérifier que :

•

•

•

•

•

☐ Une migration versionnée a été créée.
☐ La migration possède un objectif unique.
☐ Elle a été testée en développement.
☐ Elle a été validée en préproduction.
☐ La stratégie de retour arrière est documentée lorsque nécessaire.

3

12. Sauvegarde et restauration

Vérifier que :

•

•

•

☐ Les impacts sur les sauvegardes ont été évalués.
☐ Les procédures de restauration restent valides.
☐ Les données critiques demeurent récupérables.

13. Monitoring

Vérifier que :

•

•

•

☐ Les nouvelles métriques utiles sont supervisées.
☐ Les alertes sont mises à jour si nécessaire.
☐ Les journaux couvrent les nouveaux traitements.

14. Documentation

Vérifier que :

•

•

•

•

•

☐ La documentation technique est à jour.
☐ Les nouvelles tables sont documentées.
☐ Les nouvelles fonctions sont documentées.
☐ Les politiques RLS sont documentées.
☐ Les migrations sont documentées.

15. Conformité avec les autres documents

Vérifier que les évolutions restent cohérentes avec :

•

•

•

•

•

•

•

•

☐ VPS (Vision Produit & Système)
☐ Build Blueprint
☐ Domain Model
☐ API Contracts
☐ Deployment Guide
☐ BUILD-ARCHITECTURE
☐ BUILD-SECURITY
☐ BUILD-SUPABASE

4

16. Validation finale

Avant toute mise en production, confirmer que :

•

•

•

•

•

•

•

•

☐ Toutes les règles PostgreSQL sont respectées.
☐ Les performances sont validées.
☐ Les tests sont réussis.
☐ Les migrations sont validées.
☐ Les sauvegardes sont compatibles.
☐ La sécurité est conforme.
☐ La documentation est complète.
☐ Les standards PostgreSQL de Vitala sont respectés.

17. Critères d'acceptation

Une évolution PostgreSQL est officiellement acceptée lorsque :

•

toutes les cases de cette checklist sont validées ;

•

aucune non-conformité critique n'est identifiée ;

•

les validations techniques sont terminées ;

•

la revue d'architecture est approuvée lorsque requise.

18. Conclusion

La Checklist PostgreSQL constitue le dernier contrôle qualité avant toute intégration ou mise en

production.

Son application systématique garantit que chaque évolution de la base de données respecte les

exigences de qualité, de sécurité, de performance et de maintenabilité définies pour Vitala.

5

