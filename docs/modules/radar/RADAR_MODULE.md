# Moteur Radar

Radar permet d'enregistrer une recherche que la personne souhaite suivre sur plusieurs jours. Une veille dure au minimum 3 jours et au maximum 90 jours. Elle reste privée : seul son propriétaire peut lire ses critères et commander son cycle de vie.

## Frontière avec les autres moteurs

- **Flash** publie un besoin ou une proposition ponctuelle.
- **Scan** explore ponctuellement l'environnement autour d'un point de référence choisi pour chaque lancement : position GPS actuelle autorisée, zone approximative réellement prise en charge ou lieu public sélectionné manuellement. Plusieurs zones peuvent être explorées dans une même session, mais leurs résultats restent séparés. Scan ne suit pas la position en continu ; une autorisation temporaire de signalement après Scan, si elle est activée, n'est pas une mission Radar.
- **Radar** conserve une intention de recherche dans le temps sur une ou plusieurs zones choisies par l'utilisateur, indépendamment de sa position actuelle, et pourra, lorsque le moteur de correspondances sera raccordé, détecter plusieurs possibilités.
- **Mission** représente un engagement entre un auteur et un intervenant, avec attribution, réalisation et validation.

Une correspondance Radar ne crée jamais automatiquement une mission. Une action explicite de la personne sera nécessaire.

## Cycle de vie

| État        | Signification                                        | Sorties autorisées                                          |
| ----------- | ---------------------------------------------------- | ----------------------------------------------------------- |
| `draft`     | Critères enregistrés et modifiables, veille inactive | activation, annulation                                      |
| `active`    | Veille activée et échéance de revue programmée       | surveillance, pause, revalidation, expiration, annulation   |
| `watching`  | Moteur de correspondances en recherche               | correspondance, pause, revalidation, expiration, annulation |
| `matched`   | Au moins une correspondance est disponible           | pause, revalidation, expiration, annulation                 |
| `paused`    | Veille suspendue par la personne                     | reprise, expiration, annulation                             |
| `expired`   | Échéance atteinte                                    | état terminal                                               |
| `cancelled` | Arrêt volontaire                                     | état terminal                                               |

L'activation et la reprise programment une prochaine revue dans un délai maximal de sept jours, sans dépasser l'expiration. La revalidation renseigne `last_reviewed_at` et programme la suivante.

## Confidentialité et sécurité

- RLS limite la lecture et la création au propriétaire.
- Les critères ne sont modifiables directement qu'à l'état `draft`.
- Le statut, les échéances de revue, le propriétaire, la révision et les dates système sont protégés.
- `command_radar` verrouille la ligne et applique les commandes de cycle de vie côté PostgreSQL.
- Les visiteurs anonymes ne peuvent ni lire ni commander une veille.
- Le modèle Radar ne stocke aucune latitude ni longitude précise. La zone actuellement enregistrée est textuelle et approximative ; cela ne prouve ni une géolocalisation précise ni une surveillance géographique automatisée.

## Conformité au principe fondamental P0 — écart identifié

Référence : [principe fondamental de traitement des demandes partielles](../../foundation/vitalis-core-principles.md).

L'inspection du formulaire et du schéma de brouillon montre que la sauvegarde exige actuellement une requête d'au moins trois caractères **et** un libellé de zone d'au moins deux caractères. Le rayon et la durée sont également présents dans le modèle du brouillon.

**Écart P0 à examiner et corriger :** la personne doit pouvoir enregistrer une intention Radar exploitable comme brouillon privé même si sa zone ou certains paramètres ne sont pas encore précisés. Il faut distinguer les données nécessaires à la conservation d'une intention de celles indispensables à l'activation réelle d'une mission. Les informations manquantes restent inconnues ; aucune zone ni aucun critère ne doit être inventé. L'activation et l'exécution restent bloquées tant que leurs exigences réelles, les autorisations et les services nécessaires ne sont pas satisfaits.

La modification de ce parcours ne doit pas faire croire que la recherche automatique ou la surveillance en arrière-plan est déjà disponible.

## État de l'interface V1

La page Radar permet maintenant d'enregistrer une veille privée en brouillon, de modifier ses critères et de l'annuler après confirmation. Les données sont enregistrées dans IndexedDB et passent par l'outbox de synchronisation.

La détection automatique, le traitement planifié des correspondances, les résultats et les alertes ne sont pas encore raccordés. Un état `active` dans le modèle de données ne doit donc pas être présenté comme la preuve d'une recherche automatique en cours.

Voir [l'état d'implémentation Radar V1](./radar-v1-implementation-status.md).

## Étapes suivantes

1. Ajouter le dépôt local, l'outbox, les hooks et le formulaire mobile-first — réalisés pour la gestion des brouillons.
2. Vérifier les transitions synchronisées et les tests RLS sur le dernier commit.
3. Ajouter le moteur de correspondances, le traitement planifié et les notifications.
4. Ajouter les vues de résultats et les alertes uniquement après validation des règles de confidentialité et de pertinence.
