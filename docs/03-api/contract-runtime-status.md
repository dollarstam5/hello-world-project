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
| UDI | Le contrat historique propose `GET /me`, des `PATCH /me/...` et des lectures de vues (`/me/trust`, `/me/radar`, `/me/veille`, etc.) | Contrat cible historique ; routes runtime non confirmées par l'inventaire courant |

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
- Sources historiques conservées : [`docs/03-engines/flash/6. Flash API.md`](<../03-engines/flash/6. Flash API.md>), [`docs/03-engines/trust/8. Trust API.md`](<../03-engines/trust/8. Trust API.md>), [`docs/03-engines/radar/9. Radar API.md`](<../03-engines/radar/9. Radar API.md>), [`docs/03-engines/veille/10. Veille API.md`](<../03-engines/veille/10. Veille API.md>), [`docs/03-engines/recommendation/11._Recommendation_API.md`](<../03-engines/recommendation/11._Recommendation_API.md>), [`4. Auth API`](<./4. Auth API.md>), [`Unified Digital Identity API`](<./5. Unified Digital Identity API.md>). L'UDI API demeure un contrat transversal historique ; ses routes ne sont pas confirmées par l'inventaire runtime.

## 6. Limites

Cet inventaire ne remplace pas une exploration complète de toutes les fonctions serveur, ni les tests de contrat, ni une vérification de production. Il doit être actualisé quand le code runtime ou les tests changent.


## 7. Notifications, conversations et assistance : état runtime

La présence du contrat historique [Notification API](./14.%20Notification%20API.md) ne signifie pas que le service est livré.

| Capacité | État constaté dans le dépôt | Conclusion |
|---|---|---|
| Fenêtre de communication | `CommunicationSheet` avec onglets notifications, assistant et conversations | Coque UI présente ; onglets Notifications et Conversations sont des états vides statiques. |
| Notification API | `src/platform/notifications/index.ts` expose un payload et `noopNotifications` ; aucun handler de liste/lecture/archivage, domaine dédié ou route API n'a été confirmé | Contrat historique uniquement ; runtime non démontré. |
| Conversations entre membres | Aucun domaine, route, schéma, table ou test de conversation n'a été identifié dans l'inventaire de cette passe | Non démontré ; ne pas assimiler Assistant Vita à une messagerie membre. |
| Conversations déclenchées par action | Aucun lien runtime vers une action source / mission / mise en relation n'a été identifié | Contrat et règles V1 à définir avant implémentation. |
| Assistant Vita | Composants UI, hook hybride, fonction serveur authentifiée, validation Zod, quotas SQL et tests de politique/isolation présents | Assistance IA partielle présente ; aucun endpoint de conversation membre ni historique serveur membre n'est établi. |

La règle produit à préserver est l'absence de messagerie libre : une conversation membre doit être créée uniquement à partir d'une action métier autorisée et rester liée à son contexte. Les détails et écarts sont consignés dans [la réconciliation Communication et moteurs secondaires — vague 10](../07-annexes/foundation-communication-engines-reconciliation-wave-5.md).

## 8. Moteurs secondaires : état runtime observé

| Domaine | État observé | Référence runtime |
|---|---|---|
| Flash | Partiel : feed public, création locale, commandes limitées | `src/domains/flash/`, `src/routes/flash.tsx` |
| Scan | Partiel : fonction de scan, hook et abonnement Realtime | `src/domains/scan/`, `src/routes/scan.tsx` |
| Radar | Schéma et logique/test présents ; route encore placeholder | `src/domains/radar/`, `src/routes/radar.tsx` |
| Veille | Contrat historique ; runtime non confirmé | `docs/03-engines/veille/10. Veille API.md` |
| Recommendation | Contrat historique ; runtime non confirmé | `docs/03-engines/recommendation/11._Recommendation_API.md` |
| Trust | Documents et index de domaine ; parcours runtime complet non confirmé | `docs/03-engines/trust/`, `src/domains/trust/` |
| Missions | Contrat historique ; route/domaine runtime non confirmé dans cette passe | `docs/03-engines/missions/7. Mission API.md` |

Les routes et écrans placeholder ne doivent pas être présentés comme des moteurs livrés. Les contrats historiques sont des cibles documentaires jusqu'à confirmation de leurs handlers et tests. Voir la [vague 10](../07-annexes/foundation-communication-engines-reconciliation-wave-5.md) pour les réserves détaillées.
