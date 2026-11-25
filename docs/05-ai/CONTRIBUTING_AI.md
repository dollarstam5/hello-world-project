# Instructions pour Lovable et les agents IA

**Obligatoire avant toute modification.** S'applique à Lovable, aux agents IA, aux développeurs et aux outils de génération.

## Hiérarchie des références
1. `AGENTS.md`
2. `docs/07-annexes/PROJECT_BIBLE.md`
3. `ARCHITECTURE.md`
4. Ce document
5. `docs/02-architecture/frontend-experience.md` et documentation du domaine concerné.

Les anciens plans et prompts ne permettent pas de contourner les règles canoniques. En cas de conflit entre références, signaler le conflit et demander une décision.

## Avant d'écrire une ligne
1. Lire les références ci-dessus.
2. Identifier le comportement à préserver.
3. Identifier le propriétaire des données, règles, événements, effets techniques et parcours.
4. Rechercher implémentations, exports, consommateurs et tests existants.
5. Lire la documentation canonique concernée.
6. Vérifier les dépendances et le sens des imports.

## Responsabilité obligatoire
- `shared` : générique, zéro métier.
- `platform` : infrastructure technique transverse, aucune politique métier.
- `features` : orchestration de parcours ; domaines propriétaires des faits et invariants.
- `domains/<name>` : source de vérité métier, règles, état, événements, API et services.
- `widgets` : composition multi-capacités.
- `routes` : entrée de navigation et composition.
- `app/bootstrap` : démarrage et cycle de vie applicatif.

Le caractère transversal ou réutilisé ne suffit pas à classer un module dans platform/shared. Le graphe `shared → platform → features → domains → widgets → routes` est descendant uniquement ; les domaines ne dépendent jamais des features/widgets/routes.

## Migration d'un répertoire historique
Audit obligatoire, jamais renommage en bloc :
1. Inventorier fichiers et responsabilités.
2. Cartographier imports, consommateurs, tests, exports et effets de bord.
3. Classer chaque responsabilité selon `ARCHITECTURE.md`.
4. Scinder les fichiers qui mélangent les propriétaires.
5. Migrer par lots cohérents en préservant le comportement.
6. Rebrancher consommateurs, tests, barrels et docs.
7. Conserver des façades legacy dépréciées seulement si nécessaires, sans logique dupliquée.
8. Rechercher imports anciens et cycles restants.
9. Exécuter les contrôles disponibles et rapporter les résultats exacts.
10. Mettre à jour les documents et consignes agents.

## Pendant et après
- Aucun import `@supabase/*` depuis composants, widgets ou routes.
- Écritures via repositories `@eco/core-db` et protocole canonique.
- Textes FR/EN via i18n canonique ; design via tokens.
- Ne pas modifier fichiers générés.
- Respecter SSR/hydration, accessibilité, responsive, offline et sécurité.
- Aucun TODO/mock jetable ni façade dupliquant la logique.
- Vérifier frontières, typecheck, lint, tests ciblés et build selon scripts disponibles.
- Distinguer explicitement validations exécutées, non exécutées, en attente et échouées.
- Mettre à jour documentation et index lorsque les règles évoluent.

Si une demande impose une dépendance inversée ou un mélange de propriétaires, expliquer le conflit et proposer la voie conforme. Question finale : **qui possède la responsabilité, les données et les invariants ?**
