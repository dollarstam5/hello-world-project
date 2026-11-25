# Instructions obligatoires pour les agents de code

Ces règles s'appliquent à Lovable, aux agents IA, aux assistants de programmation et aux développeurs.

## À lire avant toute modification
1. `docs/07-annexes/PROJECT_BIBLE.md`
2. `ARCHITECTURE.md`
3. `docs/05-ai/CONTRIBUTING_AI.md`
4. `docs/02-architecture/frontend-experience.md`
5. La documentation canonique du domaine concerné.

En cas de doute, arrêter et demander une clarification.

## Séparation des responsabilités
- Respecter `shared → platform → features → domains → widgets → routes` : imports vers le bas uniquement.
- `shared` : générique, sans métier.
- `platform` : infrastructure technique transverse, jamais de règles métier.
- `features` : parcours utilisateur composés à partir des domaines et de platform ; elles ne possèdent pas les faits métier.
- `domains/<name>` : propriétaire des données, invariants, règles, événements, états, hooks et services métier.
- `widgets` et `routes` : composition, sans propriété métier.
- `src/app/bootstrap` : cycle de vie et démarrage, sans logique métier.
- Un module transversal ou réutilisé n'est pas automatiquement du platform.

## Avant de déplacer un ancien dossier
Ne jamais déplacer un répertoire transversal en bloc. Inventorier chaque fichier, imports, consommateurs, tests, exports et effets de bord ; attribuer un propriétaire à chaque responsabilité ; repérer les cycles ; scinder si nécessaire ; migrer par lots ; mettre à jour consommateurs, tests, barrels et documentation. Garder des façades `@deprecated` uniquement si nécessaires, sans logique dupliquée.

## Règles à préserver
- Browser-specific installation UI uniquement après hydration pour préserver le rendu SSR.
- L'export historique FlashComposer continue de déléguer à FlashExperienceScreen tant que cette compatibilité est requise.
- Ne pas modifier les fichiers générés.
- Pas de logique métier dans les composants, pas d'accès Supabase direct depuis l'UI.
- Textes FR/EN et tokens de design obligatoires.

## Validation
Exécuter les contrôles adaptés. Ne jamais déclarer typecheck, tests, build ou CI réussis sans résultat effectif. Distinguer les contrôles exécutés, non exécutés, en attente et échoués.

Références normatives : Bible du projet, `ARCHITECTURE.md`, `docs/05-ai/CONTRIBUTING_AI.md`.
