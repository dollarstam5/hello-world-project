# Audit global P0.11.1

## Objectif

P0.11.1 vérifie de façon déterministe que les fondations validées avant le passage au MVP restent présentes, testables et cohérentes.

## Contrôles

- documentation de gouvernance et d'exploitation présente ;
- contrat Performance/PWA présent ;
- collecte Web Vitals présente ;
- politique et contrôle des budgets présents ;
- socle PWA présent ;
- validation mobile E2E présente ;
- commandes CI correspondantes présentes dans `package.json` ;
- aucun fichier `.env` présent dans l'environnement CI.

L'authentification reste explicitement hors périmètre de cet audit, conformément au périmètre validé du projet.

Le contrôle est exécuté par `check:global-audit` et intégré à `check:release`.

## Critère de sortie

P0.11.1 est valide uniquement si le contrôle global, Quality et Dependency Review sont tous verts.

P0.11.1 ne modifie pas l'authentification.
