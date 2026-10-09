BUILD-SUPABASE.md
Partie C.7 — Index PostgreSQL
Version : V1
Statut : Référence officielle des index PostgreSQL
1. Objectif
Cette section définit les règles officielles de création et de gestion des index PostgreSQL dans Vitala.
Les index ont pour objectif de :
• accélérer les recherches ;
• optimiser les jointures ;
• améliorer les tris et filtrages ;
• garantir de bonnes performances à grande échelle.
Chaque index doit répondre à un besoin clairement identifié.
2. Principes directeurs
Les index respectent les principes suivants :
• Performance by Design
• Simplicité
• Cohérence
• Évolutivité
• Documentation obligatoire
Créer un index "au cas où" est interdit.
Chaque index doit être justifié.
3. Index automatiques
PostgreSQL crée automatiquement des index pour :
• les clés primaires ;
• les contraintes UNIQUE .
1

Ces index ne doivent pas être dupliqués.
4. Index sur les clés étrangères
Toutes les clés étrangères utilisées dans :
• les jointures ;
• les recherches ;
• les synchronisations ;
• les filtres fréquents
doivent être indexées.
Cette règle est obligatoire pour garantir les performances des relations.
5. B-Tree
| Le type  B-Tree  est l'index par défaut. |     |     |
| ---------------------------------------- | --- | --- |
Il est utilisé pour :
| • égalité ( = )  |              |         |
| ---------------- | ------------ | ------- |
| • comparaisons ( | < ,  > ,  <= | ,  >= ) |
ORDER BY
| • tri ( | )   |     |
| ------- | --- | --- |
• recherches simples
Il constitue le choix standard dans Vitala.
6. GIN
| Les index  GIN  sont utilisés principalement pour : |          |     |
| --------------------------------------------------- | -------- | --- |
| • les colonnes                                      | JSONB  ; |     |
• les recherches plein texte ;
| • les tableaux ( | ARRAY ). |     |
| ---------------- | -------- | --- |
Ils doivent être réservés aux cas où leurs avantages sont démontrés.
7. GiST
| Les index  GiST  sont destinés aux cas spécifiques tels que : |     |     |
| ------------------------------------------------------------- | --- | --- |
• données géographiques ;
2

• recherches spatiales ;
• intervalles ;
• recherches de proximité.
Ils ne doivent pas être utilisés comme remplacement du B-Tree .
8. Index composites
Les index composites sont autorisés lorsque plusieurs colonnes sont systématiquement utilisées
ensemble dans les requêtes.
Leur ordre doit refléter les filtres les plus sélectifs.
Les index composites inutilisés doivent être supprimés.
9. Index partiels
Les index partiels sont recommandés lorsque seules certaines lignes sont fréquemment consultées.
Exemples :
• enregistrements actifs ;
• données non supprimées ( deleted_at IS NULL ) ;
• statuts spécifiques.
Ils permettent de réduire la taille des index et d'améliorer les performances.
10. Index sur JSONB
Les colonnes JSONB ne doivent être indexées que lorsqu'elles sont régulièrement interrogées.
Le choix entre GIN et d'autres stratégies dépend du type de requêtes réalisées.
Les recherches occasionnelles ne justifient pas la création d'un index.
11. Sur-indexation
La multiplication excessive des index est interdite.
Chaque index supplémentaire :
• augmente le coût des écritures ;
3

• consomme de l'espace disque ;
• complexifie la maintenance.
L'équilibre entre lecture et écriture doit toujours être recherché.
12. Maintenance des index
Les index doivent être surveillés régulièrement afin de :
• détecter les index inutilisés ;
• identifier les doublons ;
• optimiser les performances.
Les index devenus inutiles doivent être supprimés.
13. Documentation
Chaque index doit être documenté avec :
• son objectif ;
• les colonnes concernées ;
• son type ( B-Tree , GIN , GiST , etc.) ;
• sa justification métier ou technique.
14. Évolution
Toute création, modification ou suppression d'un index doit :
• être réalisée via une migration ;
• être accompagnée d'une analyse d'impact ;
• être documentée.
Les changements doivent être validés sur les environnements de développement et de préproduction
avant d'être appliqués en production.
15. Surveillance des performances
Les performances des index doivent être suivies grâce à :
• l'analyse des plans d'exécution ( EXPLAIN ANALYZE ) ;
• les statistiques PostgreSQL ;
• les outils de monitoring Supabase.
4

Toute dégradation importante doit faire l'objet d'une investigation.
16. Critères de conformité
Les index sont conformes lorsque :
• ils répondent à un besoin identifié ;
• ils respectent les conventions définies dans cette section ;
• ils sont documentés ;
• ils sont créés via des migrations ;
• ils améliorent réellement les performances.
17. Conclusion
Les index PostgreSQL constituent un élément essentiel des performances de Vitala.
Une stratégie d'indexation réfléchie garantit une plateforme rapide, évolutive et capable de traiter
efficacement un volume important de données tout en limitant les coûts de maintenance.
5