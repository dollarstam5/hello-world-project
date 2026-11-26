# Architecture système

**Source normative :** [gouvernance architecturale du dépôt](../../ARCHITECTURE.md).  
Ce document donne une lecture synthétique du système et renvoie aux références spécialisées. Il ne crée pas une seconde convention de couches.

## Structure de la plateforme

Le dépôt sépare les responsabilités en couches :

- `src/app/` — bootstrap, shell, providers globaux, guards et intégration du routeur.
- `src/composition/` — expériences produit, layouts et widgets qui assemblent plusieurs capacités métier.
- `src/modules/` — capacités métier autonomes et propriétaires de leurs règles, données et services.
- `src/platform/` — adaptateurs techniques transversaux : appareil, réseau, PWA, offline, realtime et observabilité.
- `src/shared/` — ressources génériques sans dépendance métier.
- `src/routes/` — points d'entrée TanStack Start et composition de route requise par le framework.

La direction des dépendances et les exceptions autorisées sont définies exclusivement dans [ARCHITECTURE.md](../../ARCHITECTURE.md).

## Composition applicative et composition produit

Deux frontières sont présentes dans le code et ne doivent pas être confondues :

- `src/composition/` assemble les modules en expériences produit réutilisables.
- `src/app/composition/` contient le câblage de la racine applicative ; son composant `RootAppComposition` assemble les providers globaux autour du shell.

Le bootstrap et le cycle de vie racine restent dans `src/app/bootstrap/`. Le shell global reste dans `src/app/shell/`. Les routes restent dans `src/routes/`.

## Entrées runtime et références techniques

- [Architecture front-end et expérience](./frontend-experience.md)
- [Architecture backend et API](./backend-api.md)
- [Architecture base de données](./database-architecture.md)
- [Synchronisation, offline et realtime](./synchronization-offline-realtime.md)
- [Architecture du système de communication](./communication-system-architecture.md)
- [Modèle Unified Digital Identity](./identity-model.md)
- [Domaine Trust](./trust-domain.md)

Les entrées framework et runtime actuellement présentes comprennent notamment `src/server.ts`, `src/start.ts` et la configuration de build `vite.config.ts`. Leur rôle précis doit être lu dans leur code et les documents spécialisés ; cette liste ne prétend pas décrire tous les flux d'exécution.

## Principe de validation

Une architecture documentaire ou un arbre de dossiers cohérent ne suffit pas à prouver la conformité du runtime. Toute tranche de migration doit vérifier les consommateurs, imports statiques et dynamiques, barrels, alias, cycles, frontières client/serveur, tests ciblés, typecheck, lint et build. Les résultats doivent distinguer les contrôles exécutés de ceux qui restent à faire.
