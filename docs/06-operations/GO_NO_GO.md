# Go / No-Go P0.11.3

## Go criteria

Le passage au MVP est un **GO** lorsque tous les critères suivants sont satisfaits :

- Quality CI est vert sur le commit candidat ;
- Dependency Review est vert sur le commit candidat ;
- audit global P0.11.1 validé ;
- reproductibilité P0.11.2 validée ;
- budgets de performance respectés ;
- validation mobile/E2E verte ;
- build de production réussi ;
- aucun `.env` dans le contrôle CI ;
- aucune modification de l'authentification dans le périmètre de ces milestones.

## No-Go

Le verdict est **NO-GO** si un seul de ces critères est rouge, indéterminé ou contredit par une régression non documentée.

`check:go-no-go` vérifie les préconditions présentes dans le dépôt. Il ne remplace pas le verdict des contrôles GitHub Quality et Dependency Review, ni une validation de déploiement externe.

## Décision attendue

Après validation de la PR P0.11.3, la phase P0 est considérée comme prête pour le passage au **MVP / P1**, sans fusion automatique des PRs.

L'authentification reste hors périmètre de modification.
