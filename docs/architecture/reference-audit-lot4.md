# Audit des références — Lot 4

Date: 2026-11-23
Branch: chore/architecture-folder-cleanup-2026-11

## Corrections finalisées
- Références documentaires canoniques mises à jour dans les scripts Global Audit et Go/No-Go.
- Index archive, migration map, checklist production et manifest de déplacement alignés lors des corrections précédentes.
- **Foundation checker assaini** : inventaire historique de 145 chemins remplacé par 27 ancres structurelles actuelles; validations de structure de `src/data/knowledge.json` maintenues (JSON valide, au moins 50 entrées, champs de base).
- Le script `check:foundation` appelle maintenant le checker Foundation, puis lint et tests; il était auparavant un simple alias lint/tests.
- Six index documentaires (foundation, product, api, modules, database, engineering/ai) corrigés pour les préfixes de dossiers renumérotés.
- Lien de l'index AI corrigé vers `docs/architecture/ai-architecture-integrations.md`.

## Vérifications de chemins
- Arbre Git non tronqué : 1 148 entrées.
- Foundation : 27/27 chemins existent.
- Global Audit : 19/19 chemins requis existent.
- Go/No-Go : 17/17 chemins requis existent.
- 10 README d'index de dossiers canoniques contrôlés; les liens relatifs obsolètes identifiés ont été corrigés. Une détection regex brute a un faux positif sur un nom de fichier contenant des parenthèses; la cible UDI a été confirmée présente dans l'arbre.
- Vérification ciblée des chemins liés aux scripts déplacés et aux dossiers documentaires.

## Limites
Les scripts ne sont pas exécutés dans cet environnement : Bun, dépendances, lint, tests, typecheck et build restent non vérifiés. La validation de liens a couvert les dix README d'index canoniques, pas chaque fichier Markdown du dépôt. L'audit exhaustif de tous les imports TypeScript n'est pas certifié ici.
