# Domaines métier

Chaque moteur ou domaine métier possède son propre espace, ses composants UI, ses modèles, ses services, son état et ses tests dans `src/domains/<domain>/`.

## Règles de séparation

1. **Un domaine possède sa logique.** Ses règles métier, validations, états, services et composants spécifiques restent dans son répertoire.
2. **Une route est un point d'entrée.** `src/routes/` ne fait que déclarer la route et monter l'espace fourni par son domaine.
3. **Les domaines ne s'importent pas mutuellement pour exécuter leur logique interne.** Une coopération passe par des contrats partagés, des événements documentés ou des services de plateforme explicitement communs.
4. **Un domaine ne modifie pas l'état privé d'un autre.** Il consomme uniquement les données exposées par un contrat et respecte les autorisations du propriétaire.
5. **Les composants transversaux restent neutres.** Le shell, la navigation, les primitives et les services de plateforme ne portent pas les règles d'un moteur.
6. **Les tests suivent la propriété.** Les tests d'un moteur vérifient son comportement propre ; les tests d'intégration vérifient les échanges entre moteurs sans fusionner leurs responsabilités.

## Moteurs de navigation V1

| Moteur | Route | Propriétaire UI | Responsabilité |
| --- | --- | --- | --- |
| Home | `/` | `components/experience/HomeFoundation` | Entrée, explication et accès aux espaces ; aucune règle métier des moteurs |
| Réel | `/reel` | `domains/reel/` | Présence et découverte à proximité physique immédiate |
| Flash | `/flash` | `domains/flash/` | Publication et consultation d'intentions |
| Scan | `/scan` | `domains/scan/` | Recherche active |
| Radar | `/radar` | `domains/radar/` | Exploration et suivi |

Le menu 2x2 reste une navigation secondaire et n'est pas un moteur.

## État de livraison

La création d'un espace et de son point d'entrée ne prouve pas que toutes ses fonctions métier sont livrées. En particulier, le nouvel espace Réel est un conteneur UI dédié ; ses comportements V1 restent soumis à la spécification Réel, aux contrats, aux politiques de sécurité et aux tests associés.
