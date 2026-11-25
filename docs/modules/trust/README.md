# Trust — documentation du domaine

Ce dossier conserve les spécifications historiques du Trust Engine et de son contrat API. Il ne constitue pas la source de vérité pour les niveaux de confiance visibles côté produit.

## Références canoniques à utiliser

- [Niveaux de confiance produit](../../product/trust-levels.md) — niveaux, règles et expérience produit.
- [Domaine Trust et Trust Engine](../../architecture/trust-domain.md) — responsabilités et architecture du domaine.
- [Contrat API Trust](../../api/) — consulter l'index API pour le contrat actuellement retenu.

Ces références sont séparées volontairement : les niveaux de confiance produit, le domaine technique Trust et son contrat d'API sont des sujets liés, mais non interchangeables.

## Sources historiques conservées

Les fichiers suivants sont des versions de conception antérieures. Ils sont conservés pour la traçabilité et ne doivent pas être modifiés comme s'ils étaient les spécifications actives.

### Trust Engine

- [Trust Engine — partie 1](./03A-VITALA-TRUST-ENGINE-V1%20Partie%201.md)
- [Trust Engine — partie 2](./03A-VITALA-TRUST-ENGINE-V1%20Partie%202.md)
- [Trust Engine — partie 3](./03A-VITALA-TRUST-ENGINE-V1%20Partie%203.md)
- [Trust Engine — mise à jour historique](./03A-VITALA-TRUST-ENGINE-V1.md%20Mise%20%EF%BF%BD%20jour.md)

### Contrat API historique

- [Trust API — contrat historique](./8.%20Trust%20API.md)

## Règles de maintenance

- Toute évolution produit des niveaux de confiance commence dans `docs/product/trust-levels.md`.
- Toute évolution des responsabilités ou composants techniques commence dans `docs/architecture/trust-domain.md`.
- Toute évolution du contrat API commence par la vérification de l'index `docs/api/README.md` et de son contrat canonique.
- Les fichiers historiques ne sont ni renommés, ni fusionnés, ni supprimés sans comparaison de contenu, vérification des liens entrants et validation explicite.
- Une présence documentaire ne prouve pas qu'une règle ou un endpoint est implémenté dans le runtime.
