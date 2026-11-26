# Radar — état d'implémentation V1

**Statut :** gestion privée des critères enregistrés raccordée à la base locale et à la synchronisation. La recherche automatique, les correspondances et les alertes ne sont pas encore actives. Les enregistrements créés depuis l'interface V1 sont des brouillons d'intention, pas des veilles actives.

## Capacités disponibles dans l'interface

- Enregistrer une intention de recherche privée sous forme de brouillon, avec un texte, un rayon et une durée ; la zone textuelle est facultative.
- Modifier un brouillon tant qu'il est au statut `draft`.
- Annuler un brouillon après confirmation.
- Conserver les modifications dans la base locale ; elles sont envoyées par le mécanisme de synchronisation habituel lorsqu'il est disponible.
- Consulter les intentions de recherche enregistrées du compte connecté.

Les rayons autorisés sont 1, 3, 5, 10, 25 et 50 km. Une veille dure de 3 à 90 jours. Aucun GPS précis n'est demandé par ce formulaire.

## Architecture raccordée

- Contrat : `packages/core-contracts/src/radar.ts`.
- Règles de durée et de cycle de vie : `packages/core-logic/src/radar.ts`.
- Stockage local IndexedDB : table `radars` de `packages/core-db/src/schema.ts`.
- Dépôt offline-first : `packages/core-db/src/radar-repository.ts`.
- Synchronisation : `radars` figure dans `SYNCED_TABLES`; les transitions de statut passent par la fonction PostgreSQL `command_radar`.
- Sécurité : table privée, RLS propriétaire et fonction de commande dans `src/supabase/migrations/20260912010000_secure_radar_lifecycle.sql`.
- Tests existants : contrat, cycle de vie et RLS ; le mapping des commandes de synchronisation est couvert par `src/tests/radar/radar-command.test.ts`.

## Limites explicites

- Aucun moteur de correspondance automatique n'est raccordé.
- Aucun traitement planifié ne parcourt encore les Flash, missions ou autres sources pour produire des correspondances.
- Aucune alerte Radar n'est envoyée.
- La page ne fabrique ni résultat, ni distance calculée, ni compteur de correspondances.
- Le statut enregistré décrit le cycle de vie de l'enregistrement ; un brouillon n'est pas une veille active et un statut `active` ne prouve pas à lui seul qu'une recherche automatique s'exécute en arrière-plan.

## Suite nécessaire

1. Ajouter le moteur de correspondances avec des critères explicites et des tests déterministes.
2. Ajouter le traitement planifié et les règles d'expiration/revalidation.
3. Ajouter les alertes internes, puis les notifications push uniquement si autorisées.
4. Ajouter les vues de résultats avec provenance, date et accès à la ressource d'origine.
5. Vérifier les politiques RLS, les tests d'isolation entre propriétaires et le fonctionnement offline avant d'activer ces capacités.

Ne pas présenter Radar comme une veille automatique tant que ces étapes ne sont pas livrées et vérifiées.
