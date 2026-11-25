# Mission — validation, tests et sécurité

## 1. Tests présents sur la branche

| Fichier | Couverture constatée |
|---|---|
| `tests/mission-transitions.test.ts` | Trois tests unitaires : affectation par l'auteur, refus d'un démarrage par un tiers, validation finale réservée à l'auteur |
| `supabase/tests/database/123_mission_state_machine.test.sql` | 23 assertions pgTAP sur contraintes, fonctions, triggers, RLS, index, privilèges et structure de sécurité |

La présence des fichiers de tests ne signifie pas qu'ils ont été exécutés pendant la rédaction de cette documentation.

## 2. Matrice fonctionnelle à couvrir

| Scénario | Résultat attendu |
|---|---|
| Création avec auteur du scope | mission `open`, assignee null |
| Création depuis un scope invité | refus avant écriture |
| Création avec auteur forgé | impossible : auteur injecté depuis le scope |
| Affectation à soi-même | refus |
| Affectation par un tiers | refus |
| Double affectation | refus |
| Refus par l'assigné | retour open, assignee null |
| Refus par auteur/tiers | refus |
| Démarrage par assigné | in_progress |
| Démarrage par auteur/tiers | refus |
| Soumission par assigné | pending_validation |
| Validation par auteur | completed |
| Validation par assigné/tiers | refus |
| Litige par auteur ou assigné | disputed |
| Litige par un tiers ou depuis open | refus |
| Annulation par auteur depuis open/assigned | cancelled |
| Annulation par assigné/tiers ou depuis in_progress | refus |
| Édition après affectation | refus |
| Suppression logique d'une mission ouverte sans assigné | autorisée pour l'auteur |
| Suppression par tiers ou après affectation | refus serveur |
| Modification de author_id, id ou created_at | refus |
| Suppression physique par authenticated | refus |

## 3. Tests de sécurité PostgreSQL à ajouter

Les tests SQL actuels inspectent surtout les définitions de contraintes, policies, privilèges et fonctions. Compléter par des tests d'intégration exécutés avec des JWT de trois utilisateurs distincts :

1. auteur ;
2. assigné ;
3. tiers sans relation.

Pour chaque action, vérifier l'identité effective via `auth.uid()`, les valeurs OLD/NEW, le code SQLSTATE, l'absence de modification en cas de refus et la ligne d'audit en cas de transition acceptée.

Cas de concurrence prioritaires : deux tentatives d'affectation simultanées, assignation concurrente avec annulation, soumission concurrente avec litige, validation concurrente avec litige. La base doit arbitrer sans double assigné ni saut d'état.

## 4. Validation des données

Tester les bornes inclusives et exclusives :

- titre vide, espaces seuls, 1, 160 et 161 caractères ;
- brief vide, espaces seuls, 1, 4 000 et 4 001 caractères ;
- reward_amount négatif, zéro et valeur positive ;
- devise différente de XAF ;
- dueAt nul, dans le passé et dans le futur ;
- statut inconnu ;
- champs immuables modifiés par le client.

Le préflight de migration doit échouer avec un diagnostic si des lignes historiques sont incompatibles. Ne pas contourner ce diagnostic par une normalisation destructive non revue.

## 5. Offline et synchronisation

- création locale puis redémarrage navigateur ;
- outbox persistée si réseau absent ;
- ordre des mutations pour un même record ;
- reprise après échec temporaire ;
- refus permanent mis en quarantaine ;
- séparation stricte des outbox selon ownerId ;
- changement de compte : fermeture de la base précédente et aucune fuite de données ;
- conflits de révision et mutations obsolètes ;
- confirmation visuelle distincte entre « enregistré sur cet appareil » et « synchronisé ».

## 6. Observabilité et audit

Chaque changement de statut doit produire une entrée audit identifiant acteur, table cible, record cible, action et résumé. Les logs applicatifs ne doivent pas contenir de données personnelles superflues. Les refus de sécurité doivent rester mesurables sans exposer les détails internes à un utilisateur non autorisé.

## 7. Conditions de mise en production

Avant d'affirmer que Mission est prêt :

- [ ] migration actuelle appliquée sur l'environnement cible ;
- [ ] contraintes validées et aucun enregistrement historique incompatible ;
- [ ] RLS vérifiée sous auteur, assigné et tiers ;
- [ ] tests TypeScript et pgTAP exécutés ;
- [ ] parcours UI relié au repository (aucune route UI dédiée identifiée dans l'inventaire courant) ;
- [ ] sync worker et reprise d'outbox vérifiés ;
- [ ] gestion de conflits et échecs présentée clairement ;
- [ ] audit vérifié sur les vraies transitions ;
- [ ] documentation API alignée sur le transport réellement déployé.

## 8. Risques ouverts

- La fonction locale `canRemoveMission` autorise l'auteur d'une mission open même si un assigneeId résiduel est présent ; le trigger SQL exige assignee null. Ajouter un test de cohérence et aligner la prévalidation locale sur la règle SQL.
- Le test unitaire couvre peu de transitions par rapport aux sept actions disponibles.
- Le modèle ne stocke pas de contenu de résultat, de preuve ou de discussion.
- La migration de septembre est historique et plus permissive sur certains cas que celle de novembre ; confirmer l'ordre d'application en environnement.
- Les tests pgTAP structurels ne prouvent pas à eux seuls les comportements RLS réels avec des JWT de rôles différents.
