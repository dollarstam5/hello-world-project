# Règles d'architecture à appliquer dans Lovable

Ce rappel est subordonné aux références normatives : `/AGENTS.md`, `/docs/07-annexes/PROJECT_BIBLE.md`, `/ARCHITECTURE.md`, `/docs/05-ai/CONTRIBUTING_AI.md`. Les lire avant toute génération ou modification.

Ne pas choisir un dossier par commodité : identifier le propriétaire de la responsabilité, des données et des invariants.

- `src/shared` : générique, sans métier.
- `src/platform` : infrastructure technique transverse, sans politique métier.
- `src/features` : parcours utilisateur qui orchestrent domaines et platform ; aucun fait métier propriétaire.
- `src/domains/<name>` : propriétaire des données, règles, événements, états et services métier.
- `src/widgets` : composition multi-domaines/features.
- `src/routes` : entrée URL et composition.
- `src/app/bootstrap` : cycle de vie applicatif.

Sens des dépendances : `shared → platform → features → domains → widgets → routes`, imports uniquement vers les couches inférieures. Les domaines n'importent pas features, widgets ou routes.

Ne jamais déplacer un ancien répertoire en bloc. Auditer chaque fichier, ses consommateurs, imports, exports, tests et effets de bord ; répartir par propriétaire ; scinder si nécessaire ; migrer par lots ; mettre à jour consommateurs, tests et documentation ; garder des façades legacy dépréciées seulement si nécessaires, sans logique dupliquée.

Une capacité transversale n'est pas automatiquement du platform. Si le propriétaire est ambigu, arrêter et demander une clarification.
