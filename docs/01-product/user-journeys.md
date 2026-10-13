# Parcours utilisateurs Vitala

**Statut :** référence produit canonique en cours de consolidation.  
**Portée :** intentions, étapes métier et résultats attendus des parcours ; ce document ne certifie pas leur implémentation.

## Principes communs

1. **Partir de l'intention.** Le parcours doit aider la personne à accomplir son objectif réel, sans lui imposer un tunnel unique.
2. **Demander les données au bon moment.** Une information personnelle ne doit être sollicitée que pour un besoin explicite, avec une explication compréhensible et une alternative lorsque c'est possible.
3. **Respecter les états et autorisations réels.** Les prérequis ci-dessous sont des règles de conception issues des documents historiques ; ils doivent être confirmés dans les contrats, politiques et tests avant d'être considérés comme actifs.
4. **Séparer les responsabilités.** Le parcours orchestre les interactions métier. Il ne calcule pas lui-même la confiance, les recommandations, la détection Radar ou l'analyse Veille.
5. **Préserver le contrôle humain.** Une recommandation ou une suggestion d'assistance aide à décider, sans se substituer à la décision de la personne.
6. **Rendre les résultats compréhensibles.** Succès, attente, refus, annulation, erreur, désaccord et absence de résultat doivent être représentés explicitement lorsqu'ils s'appliquent.
7. **Protéger les données.** Ne montrer que les informations nécessaires à l'étape et à la personne concernée. Les scores et signaux internes ne deviennent pas publics par défaut.
8. **Ne pas confondre cible et produit livré.** Les parcours décrits dans les sources historiques sont des spécifications de conception ; leur statut documentaire « VALIDÉ » ne prouve pas leur disponibilité dans le code.

## Carte des parcours connus

Les documents historiques accessibles à la date de cette consolidation décrivent les parcours suivants. Les liens ci-dessous pointent vers les chemins actuels sous `docs/01-product/`.

| ID | Parcours | Intention principale | Résultat attendu dans la spécification | Source |
| --- | --- | --- | --- | --- |
| UJ-01 | Consultant → membre enregistré | Découvrir la valeur de Vitala puis choisir de poursuivre | Compte créé au moment où une continuité ou une action le justifie | [Source historique](./04-VITALA-UJ-01-CONSULTANT-TO-MEMBER.md) |
| UJ-02 | Membre enregistré → utilisateur identifié | Compléter progressivement les éléments d'identité utiles | Éléments d'identité obtenus et validés selon une politique confirmée | [Source historique](./05-VITALA-UJ-02-MEMBER-TO-IDENTIFIED.md) |
| UJ-03 | Publier une opportunité | Exprimer un besoin, une offre ou une possibilité en langage naturel | Opportunité structurée, vérifiée par la personne et publiée si elle satisfait les règles | [Source historique](./06-VITALA-UJ-03-PUBLISH-OPPORTUNITY.md) |
| UJ-04 | Répondre à une opportunité | Manifester un intérêt sans créer une compétition ou une surcharge inutile | Réponse enregistrée et transmise de façon contrôlée à l'auteur | [Source historique](./07-VITALA-UJ-04-RESPOND-OPPORTUNITY.md) |
| UJ-05 | Sélectionner un candidat | Choisir une ou plusieurs personnes adaptées à l'opportunité | Décision de l'auteur, notifications et mise en relation selon les règles applicables | [Source historique](./08-VITALA-UJ-05-SELECT-CANDIDATE.md) |
| UJ-06 | Valider une action | Confirmer le résultat d'une mise en relation ou d'une action | Résultat confirmé, en attente ou en désaccord, avec trace des déclarations | [Source historique](./09-VITALA-UJ-06-ACTION-VALIDATION.md) |
| UJ-07 | Créer de la confiance | Construire des éléments de confiance à partir d'expériences réelles | Éléments de preuve évalués par le domaine Trust, sans score social automatique | [Source historique](./10-VITALA-UJ-07-CONFIDENCE-CREATION.md) |
| UJ-08 | Flash | Parcours fonctionnel mentionné dans les références historiques | À reconstituer à partir d'une source primaire vérifiée | Document moteur associé : [Flash Engine](../03-engines/flash/11-VITALA-UJ-08-FLASH-ENGINE.md) |
| UJ-09 | Radar | Parcours fonctionnel mentionné dans les références historiques | À reconstituer à partir d'une source primaire vérifiée | Document nommé UJ-09 / Scan Engine : [source historique](../03-engines/scan/12-VITALA-UJ-09-SCAN-ENGINE.md) ; son équivalence avec le parcours Radar reste à confirmer. |
| UJ-10 | Veille | Parcours fonctionnel mentionné dans les références historiques | À reconstituer à partir d'une source primaire vérifiée | Source primaire distincte non confirmée dans l'arborescence actuelle |

L'annexe historique commune décrit également les frontières entre parcours, UDI et moteurs métier : [Annexe commune aux User Journeys](./04.0-VITALA-UJ-01-Annexe%20commune%20aux%20User%20Journeys.md).

## Cycle métier principal

Le flux principal décrit par les sources UJ-03 à UJ-07 est :

1. Une personne publie une opportunité.
2. Des personnes éligibles expriment leur intérêt.
3. L'auteur examine les informations utiles et choisit librement.
4. La mise en relation est créée selon les conditions prévues.
5. Les parties déclarent le résultat de l'action.
6. Le domaine Trust évalue les événements et preuves admissibles, selon des règles indépendantes du parcours.

Ce cycle n'est pas une obligation pour toutes les fonctionnalités : explorer, utiliser Flash, effectuer une recherche Radar ou configurer une veille peuvent suivre d'autres chemins.

## Responsabilités et données

- **Parcours utilisateur :** enchaînement des interactions, choix, confirmations et états présentés.
- **Identity / UDI :** représentation agrégée de l'identité et des vues autorisées ; l'UDI n'est pas propriétaire de toutes les données métiers.
- **Trust :** évaluation des preuves et production des vues de confiance ; une action ou une recommandation ne doit pas augmenter automatiquement la confiance sans validation.
- **Radar, Veille et Recommendation :** calculs et analyses propres à leurs domaines ; leurs résultats sont exposés par des contrats ou vues définis.
- **API et persistance :** autorisations, validation serveur, transitions d'état et intégrité doivent être garanties côté serveur, pas seulement par l'interface.

Références d'architecture : [Domaine Trust](../02-architecture/trust-domain.md), [Modèle UDI](../02-architecture/identity-model.md), [Vitala Experience System](./experience-system.md), [Personas](./personas.md) et [Niveaux de confiance](./trust-levels.md).

## États à traiter explicitement

Pour chaque parcours détaillé, documenter au minimum :

- point d'entrée et prérequis ;
- acteur(s) et permissions nécessaires ;
- étapes nominales et décisions de la personne ;
- validations côté serveur et transitions d'état ;
- états d'attente, échec, annulation, expiration et reprise ;
- données visibles, données privées et événements enregistrés ;
- notifications et conséquences pour les autres acteurs ;
- accessibilité, mobile, réseau dégradé et reprise hors ligne si applicable ;
- critères d'acceptation testables ;
- preuves de disponibilité dans le code et les tests.

## Écarts et vérifications restantes

- Les fichiers historiques UJ-01 à UJ-07 et l'annexe commune sont accessibles et conservés ; ils ne sont pas déplacés par cette consolidation.
- Les sources UJ-08/09/10 doivent être distinguées des documents de moteurs : le dépôt contient un document Flash Engine nommé UJ-08 et un document Scan Engine nommé UJ-09, mais leur équivalence avec des parcours détaillés n'est pas démontrée. Des sources historiques nomment UJ-09 « Radar » et UJ-10 « Veille » ; aucun document primaire distinct UJ-10 n'a été confirmé. Ne pas assimiler Scan à Radar ni un document de moteur à un parcours utilisateur sans vérification.
- Les exigences de collecte progressive d'identité, les seuils de réponse, les statuts de confiance et les automatismes décrits historiquement doivent être comparés aux schémas, contrats API, politiques et tests actuels.
- Aucun parcours ne doit être annoncé comme implémenté uniquement parce qu'une source historique le décrit ou le marque « VALIDÉ ».

## Sources historiques

Les spécifications originales restent en place pour la traçabilité. Cette référence canonique fournit une carte commune et des règles de lecture ; elle n'autorise ni la suppression ni le déplacement des fichiers historiques.
