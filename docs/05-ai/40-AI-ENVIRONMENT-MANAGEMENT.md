40-AI-ENVIRONMENT-MANAGEMENT.md

Version : V1.0

Statut : ACTIVE

Catégorie : AI Operations Framework

Projet : Vitala

1. Objectif

AI-ENVIRONMENT-MANAGEMENT.md définit les règles de gestion des environnements utilisés pour

développer, tester et exploiter Vitala.

Son objectif est de garantir :

•

séparation des environnements ;

•

sécurité des données ;

•

stabilité ;

•

reproductibilité.

2. Principe fondamental

Aucun environnement ne doit être utilisé pour un autre objectif que celui prévu.

Une erreur d'environnement peut provoquer :

•

perte de données ;

•

exposition de secrets ;

•

perturbation utilisateurs.

3. Environnements officiels Vitala

Vitala doit utiliser au minimum :

```text id="x7m2qa" LOCAL

↓

DEVELOPMENT

1

↓

STAGING

↓

PRODUCTION

---

# 4. Environnement LOCAL

Objectif :

Permettre aux IA et développeurs de travailler sans risque.

Utilisation :

- développement ;

- expérimentation ;

- tests rapides.

Caractéristiques :

- données fictives ;

- accès limité ;

- aucune donnée utilisateur réelle.

---

# 5. Environnement DEVELOPMENT

Objectif :

Intégration des nouvelles fonctionnalités.

Utilisé pour :

- développement quotidien ;

- tests techniques ;

- validation initiale.

---

# 6. Environnement STAGING

Objectif :

Reproduire la production avant publication.

2

Il doit être proche de :

- configuration ;

- services ;

- architecture.

Utilisé pour :

- tests finaux ;

- validation IA ;

- tests utilisateurs internes.

---

# 7. Environnement PRODUCTION

Objectif :

Servir les utilisateurs réels.

Règles :

- accès strictement contrôlé ;

- modifications limitées ;

- surveillance active.

---

# 8. Règle de séparation

Interdit :

❌ utiliser Production pour tester.

❌ utiliser des données Production en développement sans protection.

❌ partager des secrets entre environnements.

---

# 9. Gestion des variables d'environnement

Chaque environnement possède ses propres configurations.

Exemples :

- URL API ;

- clés services ;

- paramètres système.

Les valeurs doivent être séparées.

3

---

# 10. Gestion des secrets

Les secrets doivent :

- être stockés dans un système sécurisé ;

- ne jamais être écrits dans le code ;

- ne jamais être envoyés dans un prompt public.

Interdit :

- clés API dans Git ;

- mots de passe dans fichiers visibles.

---

# 11. Configuration IA

Une IA travaillant sur Vitala doit connaître :

- environnement ciblé ;

- limites d'accès ;

- données disponibles.

Elle ne doit jamais supposer l'environnement.

---

# 12. Synchronisation des environnements

Les environnements doivent rester cohérents.

Vérifier :

- versions dépendances ;

- migrations Database ;
- variables nécessaires.

---

# 13. Base de données par environnement

Chaque environnement doit avoir sa propre base.

Exemple :

```text id="r5k9nz"

vitala_local_db

4

vitala_dev_db

vitala_stage_db

vitala_prod_db

14. Déploiement entre environnements

Le flux officiel :

```text id="m8q3vy" LOCAL

↓

DEVELOPMENT

↓

STAGING

↓

PRODUCTION ```

Un changement ne doit pas sauter des étapes critiques.

15. Audit environnement

Régulièrement vérifier :

[ ] Variables correctes

[ ] Secrets protégés

[ ] Versions cohérentes

[ ] Accès contrôlés

[ ] Services fonctionnels

5

16. Environnement temporaire

Pour les expériences IA :

Créer un environnement isolé.

Objectif :

Tester sans mettre en danger Vitala.

17. Restauration environnement

Chaque environnement critique doit permettre :

•

restauration configuration ;

•

restauration données ;

•

récupération après erreur.

18. Interdictions

Une IA ne doit jamais :

❌ modifier Production sans autorisation.

❌ supprimer une configuration critique.

❌ mélanger les données entre environnements.

❌ ignorer les règles de sécurité.

19. Checklist environnement

Avant intervention :

[ ] Environnement identifié

[ ] Accès correct

[ ] Sauvegarde disponible

[ ] Impact évalué

6

[ ] Configuration vérifiée

20. Règle finale

Un système professionnel commence par des environnements maîtrisés.

Avant de modifier Vitala :

Toujours savoir :

•

où on travaille ;

•

quelles données sont utilisées ;

•

quel risque existe.

Historique

Version Modification

V1.0

Création gestion environnements IA

Fin de AI/40-AI-ENVIRONMENT-

MANAGEMENT.md

7

