# État des contrats API et correspondance runtime

**Statut :** inventaire documentaire des contrats API et des routes repérées dans le dépôt.  
**Règle de preuve :** un endpoint décrit dans une source historique est une intention contractuelle, pas une preuve d'implémentation. Cet inventaire ne certifie ni le déploiement ni la disponibilité des routes dans un environnement hébergé.

## 1. Inventaire runtime vérifié dans le dépôt

La référence [Backend et architecture des API](../02-architecture/backend-api.md) inventorie les handlers HTTP observés sous `src/routes/api/`. À la dernière revue documentaire, les routes confirmées dans cet inventaire sont :

| Méthode | Route | Responsabilité constatée | Référence |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Réponse de santé de base, statut, nom de service et horodatage | [Architecture backend/API](../02-architecture/backend-api.md) |
| `POST` | `/api/sync/pull` | Lecture des changements distants par curseurs | [Contrat de synchronisation](./sync-api.md) |
| `POST` | `/api/sync/push` | Soumission de mutations locales | [Contrat de synchronisation](./sync-api.md) |
| `POST` | `/api/public/assistant` | Assistant IA en flux ; malgré le segment `public`, une session est requise | [Architecture backend/API](../02-architecture/backend-api.md) |

Cette liste est limitée à l'inventaire existant. Elle ne prouve pas l'absence d'autres points d'entrée TanStack Start ou de services intégrés.

## 2. Contrats de domaines historiques : statut

Les contrats historiques décrivent des chemins REST métier. Les pages canoniques restent des points d'entrée et doivent signaler explicitement que ces chemins ne sont pas confirmés par l'inventaire runtime ci-dessus.

| Domaine | Exemples de chemins historiques | Statut dans cet inventaire |
| --- | --- | --- |
| Flash | `POST /flash`, `GET /flash/{id}`, `PATCH /flash/{id}`, `POST /flash/{id}/publish` | Contrat cible historique ; route runtime non confirmée ici |
| Trust | `GET /trust/me`, `GET /trust/me/history`, `GET /trust/me/badges` | Contrat cible historique ; route runtime non confirmée ici |
| Radar | `GET /radar`, `GET /radar/{id}`, `POST /radar/{id}/save` | Contrat cible historique ; route runtime non confirmée ici |
| Veille | `GET /veille`, `GET /veille/{id}`, `POST /veille/{id}/read` | Contrat cible historique ; route runtime non confirmée ici |
| Recommendation | `GET /recommendations`, `GET /recommendations/{id}` | Contrat cible historique ; route runtime non confirmée ici |
| Auth | Les contrats historiques décrivent inscription, connexion, renouvellement et récupération de compte | Inventaire runtime distinct à mener avant toute conclusion sur les routes disponibles |

Les chemins ci-dessus sont des exemples tirés des documents historiques, non une liste exhaustive et non des endpoints garantis. Ne pas générer de client, d'intégration ou de test d'acceptation en supposant leur disponibilité.

## 3. Comment fermer un écart contrat/runtime

Pour chaque endpoint envisagé :

1. retrouver la source canonique et le contrat historique ;
2. rechercher les définitions de routes, fonctions serveur, appels clients, tests et éventuels handlers générés ;
3. vérifier méthode HTTP, chemin effectif, schéma d'entrée/sortie, authentification, autorisation, pagination et erreurs ;
4. ajouter ou mettre à jour les tests adaptés, sans confondre test local et disponibilité déployée ;
5. mettre à jour la référence canonique et les index ;
6. vérifier le déploiement séparément avant d'affirmer qu'un endpoint est disponible en production.

Si un contrat cible n'est pas implémenté, le documenter comme capacité planifiée ou écart à traiter. Ne pas créer de route applicative ni modifier des contrats runtime dans un lot documentaire.

## 4. Contrats de synchronisation

La synchronisation est plus détaillée car ses handlers et contrats partagés ont été repérés dans le dépôt. Les routes vérifiées dans le code utilisent `POST` pour `/api/sync/pull` et `/api/sync/push`. Le document historique `docs/SYNC_PROTOCOL.md` décrit encore un `GET` pour le pull ; l'écart reste suivi par [TECH-002](../06-operations/technical-issues.md#tech-002--contrat-documentaire-du-pull-non-aligné-sur-limplémentation).

Les garanties liées aux reçus d'idempotence et au schéma distant restent non certifiées ; voir [TECH-001 et TECH-003](../06-operations/technical-issues.md).

## 5. Sources de référence

- [Inventaire backend et routes vérifiées](../02-architecture/backend-api.md)
- [Répertoire des contrats API](./README.md)
- [Contrat API de synchronisation](./sync-api.md)
- [Registre des problèmes techniques](../06-operations/technical-issues.md)
- Sources historiques conservées : [`docs/03-engines/flash/6. Flash API.md`](<../03-engines/flash/6. Flash API.md>), [`docs/03-engines/trust/8. Trust API.md`](<../03-engines/trust/8. Trust API.md>), [`docs/03-engines/radar/9. Radar API.md`](<../03-engines/radar/9. Radar API.md>), [`docs/03-engines/veille/10. Veille API.md`](<../03-engines/veille/10. Veille API.md>), [`docs/03-engines/recommendation/11._Recommendation_API.md`](<../03-engines/recommendation/11._Recommendation_API.md>), `docs/4. Auth API.md`. L'UDI API demeure à `docs/5. Unified Digital Identity API.md` en tant que contrat transversal historique.

## 6. Limites

Cet inventaire ne remplace pas une exploration complète de toutes les fonctions serveur, ni les tests de contrat, ni une vérification de production. Il doit être actualisé quand le code runtime ou les tests changent.
