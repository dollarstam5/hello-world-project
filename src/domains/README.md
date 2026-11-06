# Domaines métier

Chaque moteur ou domaine métier possède son propre espace, ses composants UI, ses modèles, ses services, son état et ses tests dans `src/domains/<domain>/`.

## Règles de séparation et de coopération

1. **Un domaine possède sa logique.** Ses règles métier, validations, états, services et composants spécifiques restent dans son répertoire.
2. **Une route est un point d'entrée.** `src/routes/` déclare la route et monte l'espace fourni par l'API publique du domaine.
3. **Les domaines ne consultent jamais les détails internes d'un autre domaine.** Un import inter-domaines éventuel passe uniquement par l'`index.ts` public ou un contrat partagé explicitement défini.
4. **La coopération ne transfère pas la propriété.** Un moteur peut consommer un événement ou une donnée publiée par un autre, mais ne modifie pas son état privé et n'exécute pas ses règles métier à sa place.
5. **Les événements et contrats sont explicites.** Les échanges passent par des contrats partagés, des événements documentés ou des services de plateforme communs ; les formats et autorisations restent vérifiables.
6. **Les composants transversaux restent neutres.** Le shell, la navigation, les primitives et les services de plateforme ne portent pas les règles d'un moteur.
7. **Les tests suivent la propriété.** Les tests d'un moteur vérifient son comportement propre ; les tests d'intégration vérifient les échanges sans fusionner les responsabilités.

## Moteurs de navigation V1

| Moteur | Route | Propriétaire UI | Responsabilité |
| --- | --- | --- | --- |
| Home | `/` | `components/experience/HomeFoundation` | Entrée, explication et accès aux espaces ; aucune règle métier des moteurs |
| Réel | `/reel` | `domains/reel/` | Présence et découverte à proximité physique immédiate |
| Flash | `/flash` | `domains/flash/` | Publication et consultation d'intentions |
| Scan | `/scan` | `domains/scan/` | Recherche active |
| Radar | `/radar` | `domains/radar/` | Exploration et suivi |

Le menu 2x2 reste une navigation secondaire et n'est pas un moteur.

## Constat runtime à ne pas masquer

- Scan réagit aux changements de Flash via `src/domains/scan/services/scan-realtime.service.ts`, qui s'abonne à la table publique `flashes`. C'est une intégration de données, pas un transfert de propriété métier ; le service utilise toutefois directement le client Supabase et devra être rapproché de la règle de centralisation des accès réseau.
- Radar possède des modèles et des schémas, mais son espace UI reste un conteneur avec sections génériques.
- Réel vient de recevoir un conteneur UI et une route dédiée. Ses fonctions métier V1 ne sont pas livrées par cette contribution.

## État de livraison

La création d'un espace et de son point d'entrée ne prouve pas que toutes ses fonctions métier sont livrées. Les contrats, états, données, autorisations, intégrations et tests doivent être vérifiés séparément avant de déclarer un moteur fonctionnellement indépendant et prêt.
