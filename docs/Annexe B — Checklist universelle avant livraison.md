Annexe B — Checklist universelle avant livraison

Cette annexe complète le document 22-VITALA-AI-DEVELOPMENT-RULES-V1.md.

Elle définit la checklist obligatoire que toute IA ou développeur doit valider avant de considérer une

tâche comme terminée et prête à être intégrée dans Vitala.

1. Architecture

•

Le domaine métier concerné est-il correctement identifié ?

•

Le principe Domain First est-il respecté ?

•

Le principe Single Source of Truth est-il respecté ?

•

Aucune logique métier n’a-t-elle été déplacée vers un mauvais domaine ?

•

Aucune dépendance circulaire n’a-t-elle été introduite ?

2. API & Contrats

•

Les contrats API existants sont-ils respectés ?

•

Aucune modification cassante n’a-t-elle été introduite sans justification ?

•

Les endpoints suivent-ils les conventions définies dans le VPS ?

•

Les événements métiers sont-ils correctement émis ?

•

Les responsabilités des APIs sont-elles respectées (pas de cross-domain ownership) ?

3. Données

•

Le domaine reste-t-il propriétaire de ses données ?

•

Les accès aux données respectent-ils les règles de sécurité ?

•

Les règles Offline First sont-elles respectées si applicable ?

•

Les données sensibles sont-elles correctement protégées ?

4. Code

•

Le code est-il modulaire ?

•

Le code est-il lisible et compréhensible ?

•

Les responsabilités sont-elles bien séparées ?

•

Aucune duplication inutile n’a-t-elle été introduite ?

•

Les conventions de nommage sont-elles respectées ?

•

Le code est-il testable ?

1

5. Tests

•

Les tests nécessaires ont-ils été ajoutés ou mis à jour ?

•

Les cas critiques sont-ils couverts ?

•

Les régressions potentielles sont-elles vérifiées ?

•

Les tests respectent-ils le comportement attendu du domaine ?

6. Sécurité

•

Les règles d’authentification sont-elles respectées ?

•

Les permissions et autorisations sont-elles correctes ?

•

Aucune exposition de données sensibles n’a-t-elle été introduite ?

•

Les accès entre domaines sont-ils correctement contrôlés ?

7. Performance

•

Les modifications introduisent-elles des ralentissements ?

•

Les requêtes sont-elles optimisées ?

•

Les appels inutiles ont-ils été évités ?

•

Le système reste-t-il scalable ?

8. Offline First

•

Les opérations critiques fonctionnent-elles hors ligne ?

•

La synchronisation est-elle correctement prise en compte ?

•

Les conflits potentiels sont-ils gérés ou anticipés ?

•

Les règles de Sync API sont-elles respectées ?

9. Documentation

•

Les documents VPS impactés ont-ils été identifiés ?

•

La documentation a-t-elle été mise à jour si nécessaire ?

•

Les API contracts restent-ils cohérents avec la documentation ?

•

Le Domain Model est-il toujours valide ?

10. Évolutivité

•

La solution permet-elle des évolutions futures sans refactor massif ?

•

L’ajout de nouveaux domaines est-il possible sans modification profonde ?

2

•

L’architecture reste-t-elle conforme aux principes du VPS ?

•

La solution privilégie-t-elle la réutilisabilité ?

11. Validation finale

Avant livraison, l’IA ou le développeur doit pouvoir répondre “OUI” à toutes les questions critiques

suivantes :

•

Le domaine est-il respecté ?

•

Les contrats sont-ils intacts ?

•

Les données sont-elles sécurisées ?

•

Le système est-il stable ?

•

Le code est-il propre et testable ?

•

L’architecture est-elle préservée ?

•

L’évolution future est-elle facilitée ?

Conclusion

Cette checklist constitue la dernière étape avant validation.

Aucune fonctionnalité ne doit être considérée comme terminée si elle ne respecte pas ces critères.

Elle garantit la cohérence, la qualité et la stabilité à long terme de Vitala.

3

