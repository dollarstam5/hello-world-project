# Release readiness et décision Go/No-Go

**Statut :** référence opérationnelle canonique pour préparer une release ; ce document ne constitue pas une approbation de déploiement.  
**Périmètre :** contrôles du dépôt, validation en préproduction, décision humaine, publication, vérification et retour arrière.  
**Limite de preuve :** un workflow vert prouve le succès des étapes exécutées sur le commit concerné ; il ne prouve ni l'état de la production, ni l'application des migrations distantes, ni la validation des sauvegardes et du rollback.

## 1. Règle de décision

La release est **GO** uniquement lorsque toutes les conditions applicables sont vérifiées et documentées. Un contrôle rouge, absent, non concluant ou exécuté sur un autre commit entraîne **NO-GO** jusqu'à résolution ou décision d'exception explicitement approuvée.

Ne pas confondre :
- **CI verte** : les contrôles automatisés déclarés ont réussi ;
- **candidat Go** : les contrôles automatisés et artefacts sont disponibles, mais la préproduction et les validations opérationnelles restent à terminer ;
- **Go production** : la revue humaine a confirmé les critères, la préproduction, la procédure de retour arrière et les autorisations de publication.

## 2. Avant d'ouvrir une release

1. Identifier le commit candidat immuable et la PR associée.
2. Vérifier les changements inclus, les migrations éventuelles, les secrets/configurations nécessaires et les notes de version.
3. Confirmer que les workflows GitHub **Quality** et **Dependency review** sont terminés et réussis sur le commit candidat.
4. Vérifier le build de production et les contrôles de release exécutés par le dépôt.
5. Vérifier l'absence de secrets suivis par Git ; ne jamais copier de valeurs secrètes dans une PR, un rapport ou les logs.
6. Examiner les registres de problèmes : [problèmes techniques](./technical-issues.md) et [problèmes de performance](./performance-issues.md). Un problème ouvert doit être évalué par rapport au périmètre de la release, et non masqué par un résultat CI positif.

### Commandes disponibles dans le dépôt

Depuis un environnement de développement/CI avec les dépendances verrouillées :

```sh
bun install --frozen-lockfile
bun run check:foundation
bun run security:secrets
bun run check:release
```

Le script `check:release` enchaîne lint, tests unitaires, build, budget de performance, audit global, reproductibilité et vérification Go/No-Go. La CI du dépôt exécute également des étapes dédiées, notamment les tests RLS et les validations navigateur mobile/hors ligne. Vérifier les étapes réellement exécutées sur le commit : ne pas déduire la réussite d'une étape du seul nom du workflow.

Pour les tests de base de données, `bun run test:db` exige Supabase CLI et Docker. Il doit cibler une pile locale ou une base de préproduction jetable, jamais la production. Ne pas exécuter de migration en production comme une étape de diagnostic.

## 3. Vérifications bloquantes en préproduction

- Déployer avec des secrets et des ressources propres à la préproduction.
- Appliquer et vérifier les migrations autorisées dans leur ordre prévu, puis contrôler le schéma, les grants et les politiques RLS.
- Exécuter les parcours fonctionnels concernés par la release et les refus de sécurité attendus.
- Vérifier les routes principales `/`, `/flash`, `/radar`, `/espace`, l'assistant local et les flux API pertinents selon le périmètre.
- Vérifier la PWA : manifeste, icônes, service worker, installation, mise à jour, première visite et reprise hors ligne.
- Vérifier les budgets du build, les parcours mobiles, le débordement horizontal et les zones tactiles ; une mesure locale n'est pas une preuve de Web Vitals p75 en production.
- Vérifier les en-têtes de sécurité configurés, notamment CSP, HSTS, `nosniff` et `Permissions-Policy`.
- Vérifier que les sauvegardes requises existent et qu'une restauration ou une procédure de rollback a été testée pour le scénario concerné.
- Enregistrer le commit, l'environnement, les résultats, les écarts connus et la personne ayant donné la décision.

### Barrière migrations/base de données

Le registre [TECH-001](./technical-issues.md#tech-001--divergence-des-sources-de-migration-postgresql) demeure ouvert : des artefacts SQL existent hors du chemin standard Supabase et leur application sur les environnements distants n'est pas prouvée par Git. Toute release qui dépend de ces artefacts doit rester **NO-GO** tant que la provenance, l'état de la base cible, les migrations réellement appliquées et un plan de réconciliation autorisé n'ont pas été vérifiés. Ne pas déplacer, exécuter, convertir ou supprimer les migrations pour contourner ce blocage.

Les autres entrées TECH-002 à TECH-006 restent ouvertes jusqu'à résolution et vérification ; évaluer explicitement leur impact sur la release visée.

## 4. Publication

Après une décision GO explicite :

1. Publier le commit immuable approuvé et, lorsque la plateforme le permet, promouvoir exactement l'artefact validé en préproduction.
2. Ne pas reconstruire un artefact différent au moment de la promotion sans refaire les contrôles pertinents.
3. Garder l'artefact précédent disponible et noter le chemin de retour arrière.
4. Ne pas effectuer de modification de schéma destructive sans sauvegarde restaurable, compatibilité vérifiée et plan de récupération.
5. Ne pas activer une fonctionnalité dépendante d'un secret ou d'un fournisseur qui n'a pas été vérifié dans l'environnement cible.

## 5. Vérifications après publication

- Vérifier `GET /api/health` et, si déployés et configurés, `GET /api/health/live` et `GET /api/health/ready`. Les routes exactes disponibles doivent être confirmées dans le commit déployé.
- Vérifier les parcours critiques avec un compte de test autorisé et sans données personnelles réelles.
- Surveiller les taux HTTP 401, 409, 429 et 500, la latence, les erreurs du navigateur, l'état de la file offline et les mises en quarantaine.
- Examiner les logs structurés et les `x-request-id` sans consigner tokens, secrets, corps de requête ni contenu utilisateur sensible.
- Confirmer la bonne version du client, la disponibilité des ressources statiques et l'absence de régression évidente.
- Enregistrer le résultat, l'heure, le commit et toute décision d'escalade.

Les seuils de diagnostic opérationnel sont documentés dans [Opérations](./operations.md). Ils servent au triage et ne constituent pas à eux seuls un SLO ou une garantie publique de disponibilité.

## 6. No-Go, incident et retour arrière

Déclarer **NO-GO** ou lancer l'escalade prévue si un contrôle de sécurité, de RLS, de migration, de build, de budget, de PWA ou de parcours essentiel échoue, ou si l'état de la base cible reste incertain pour la release.

En cas de régression après publication :

1. limiter l'impact conformément à la procédure d'incident de l'environnement ;
2. recueillir le commit, l'heure, les `x-request-id` et les métriques sans collecter de données sensibles ;
3. restaurer l'artefact précédent si c'est la mesure sûre et compatible ;
4. ne jamais annuler aveuglément une migration destructive : évaluer la compatibilité du schéma, la sauvegarde et la stratégie de récupération ;
5. vérifier la santé et les parcours essentiels après retour arrière ;
6. consigner la cause démontrée, l'impact, les actions et les conditions de réouverture.

Si un secret est exposé, le révoquer ou le faire tourner dans la console du fournisseur, évaluer les sessions/accès concernés et rechercher l'exposition dans l'historique Git. Ne jamais recopier le secret dans le rapport d'incident.

## 7. Dossier de preuve minimal

Chaque release doit conserver :
- commit et PR approuvés ;
- liens vers Quality et Dependency review ;
- résultats du build, de la reproductibilité et des contrôles de performance ;
- résultats des tests de base de données et RLS pertinents ;
- preuve de validation de préproduction et des parcours mobiles/PWA ;
- état des migrations et du schéma de l'environnement cible ;
- plan et preuve du retour arrière ;
- décision GO/NO-GO et personne qui l'a autorisée ;
- vérifications après publication et écarts connus.

## 8. Références canoniques et historiques

- [Qualité et tests](../QUALITY.md) — contrôles automatisés et règles de fusion.
- [Reproductibilité](../REPRODUCIBILITY.md) — comparaison des builds.
- [Performance PWA](./performance-pwa.md) — budgets et validation mobile.
- [Opérations](./operations.md) — santé, diagnostics et seuils de triage.
- [Registre des problèmes techniques](./technical-issues.md) — incertitudes qui nécessitent des preuves.
- [Go/No-Go historique](../GO_NO_GO.md), [déploiement historique](../DEPLOYMENT.md) et [opérations historiques](../OPERATIONS.md) — conservés pour la traçabilité.

Les documents historiques ne sont pas supprimés ni déplacés dans ce lot. La présente référence consolide la procédure et ne prétend pas certifier qu'une release ou un environnement est prêt.
