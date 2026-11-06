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

## Parcours d'entrée Vitalis — onboarding, Home et identification

Ce parcours formalise la règle d'entrée produit clarifiée : Home est distincte des moteurs métier, et Réel ne remplace pas Home.

### UJ-00A — première utilisation

1. L'utilisateur ouvre Vitalis pour la première fois.
2. Vitalis présente l'onboarding avant les autres écrans d'accueil.
3. À la fin de l'onboarding, Vitalis affiche la Home explicative.
4. La Home explicative présente le fonctionnement général de Vitalis et les possibilités offertes.
5. L'utilisateur peut choisir de poursuivre vers l'identification depuis l'action principale proposée.

**Résultat attendu :** onboarding terminé puis Home explicative affichée. Ce parcours ne présume pas d'un compte déjà créé ni d'une identification accomplie.

### UJ-00B — identification depuis la Home explicative

1. L'utilisateur déclenche l'action de poursuite depuis la Home explicative.
2. Vitalis ouvre le parcours d'identification existant.
3. L'utilisateur renseigne les informations demandées par ce parcours.
4. En cas de réussite confirmée, Vitalis redirige l'utilisateur vers la Home interactive.
5. En cas d'annulation, d'abandon ou d'échec, Vitalis respecte l'état du parcours existant et ne présente pas l'identification comme réussie.

**Résultat attendu :** redirection vers la Home interactive uniquement après la réussite du parcours d'identification.

**Limite :** cette documentation ne crée aucun champ d'identité, règle de validation, méthode d'authentification ou nouveau mécanisme de compte. Ces éléments restent définis par les contrats Identity/UDI et le parcours existant.

### UJ-00C — retour via l'icône de l'application

1. L'utilisateur sélectionne l'icône de Vitalis.
2. L'application revient au point d'entrée Home.
3. Le contenu Home dépend de l'état du parcours : Home explicative si l'utilisateur n'a pas terminé l'identification ; Home interactive après identification réussie.
4. Si l'utilisateur est en première utilisation et que l'onboarding n'a pas été terminé, l'onboarding reste prioritaire.

**Résultat attendu :** l'icône Vitalis ouvre Home, jamais directement le moteur Réel.

### UJ-00D — accès aux moteurs depuis la Home interactive

La Home interactive propose des accès aux moteurs et aux catégories de Vitalis :
- Réel ;
- Flash ;
- Scan ;
- Radar ;
- les autres pages et catégories disponibles via la navigation ou le menu secondaire 2x2.

Chaque destination conserve son propre parcours, ses règles, ses autorisations et ses états. Home est un hub de navigation, pas un moteur qui fusionne les logiques métier.

### États à couvrir

| État d'entrée | Écran attendu | Action ou transition |
| --- | --- | --- |
| Première ouverture, onboarding non terminé | Onboarding | Terminer l'onboarding |
| Onboarding terminé, identification non terminée | Home explicative | Choisir de s'identifier |
| Identification en cours | Parcours d'identification existant | Réussite, annulation ou échec |
| Identification réussie | Home interactive | Accéder aux moteurs |
| Retour via icône, identification non terminée | Home explicative (ou onboarding si première utilisation inachevée) | Reprendre le parcours |
| Retour via icône, identification réussie | Home interactive | Reprendre la navigation |

Ces états sont des exigences produit et des scénarios attendus ; leur persistance, leur résolution au démarrage et leur implémentation doivent être vérifiées dans le runtime.

## Carte des parcours connus

Les documents historiques accessibles à la date de cette consolidation décrivent les parcours suivants.

| ID | Parcours | Intention principale | Résultat attendu dans la spécification | Source |
| --- | --- | --- | --- | --- |
| UJ-01 | Consultant → membre enregistré | Découvrir la valeur de Vitala puis choisir de poursuivre | Compte créé au moment où une continuité ou une action le justifie | [Source historique](../04-VITALA-UJ-01-CONSULTANT-TO-MEMBER.md) |
| UJ-02 | Membre enregistré → utilisateur identifié | Compléter progressivement les éléments d'identité utiles | Éléments d'identité obtenus et validés selon une politique confirmée | [Source historique](../05-VITALA-UJ-02-MEMBER-TO-IDENTIFIED.md) |
| UJ-03 | Publier une opportunité | Exprimer un besoin, une offre ou une possibilité en langage naturel | Opportunité structurée, vérifiée par la personne et publiée si elle satisfait les règles | [Source historique](../06-VITALA-UJ-03-PUBLISH-OPPORTUNITY.md) |
| UJ-04 | Répondre à une opportunité | Manifester un intérêt sans créer une compétition ou une surcharge inutile | Réponse enregistrée et transmise de façon contrôlée à l'auteur | [Source historique](../07-VITALA-UJ-04-RESPOND-OPPORTUNITY.md) |
| UJ-05 | Sélectionner un candidat | Choisir une ou plusieurs personnes adaptées à l'opportunité | Décision de l'auteur, notifications et mise en relation selon les règles applicables | [Source historique](../08-VITALA-UJ-05-SELECT-CANDIDATE.md) |
| UJ-06 | Valider une action | Confirmer le résultat d'une mise en relation ou d'une action | Résultat confirmé, en attente ou en désaccord, avec trace des déclarations | [Source historique](../09-VITALA-UJ-06-ACTION-VALIDATION.md) |
| UJ-07 | Créer de la confiance | Construire des éléments de confiance à partir d'expériences réelles | Éléments de preuve évalués par le domaine Trust, sans score social automatique | [Source historique](../10-VITALA-UJ-07-CONFIDENCE-CREATION.md) |
| UJ-08 | Flash | Diffuser rapidement une information, un besoin, une opportunité ou une disponibilité vers les personnes pertinentes | Flash structuré par Vita, validé, diffusé de façon ciblée, avec réponses et mises en relation | [Référence canonique](../03-engines/flash/flash-engine.md) · [Source primaire](../03-engines/flash/11-VITALA-UJ-08-FLASH-ENGINE.md) |
| UJ-09 | Radar | Parcours fonctionnel mentionné dans les références historiques | À reconstituer à partir d'une source primaire vérifiée | Source primaire non retrouvée sous le chemin attendu pendant cet audit |
| UJ-10 | Veille | Parcours fonctionnel mentionné dans les références historiques | À reconstituer à partir d'une source primaire vérifiée | Source primaire non retrouvée sous le chemin attendu pendant cet audit |

L'annexe historique commune décrit également les frontières entre parcours, UDI et moteurs métier : [Annexe commune aux User Journeys](../04.0-VITALA-UJ-01-Annexe%20commune%20aux%20User%20Journeys.md).

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
- Les fichiers primaires Flash, Radar et Veille mentionnés dans des documents historiques n'ont pas été retrouvés sous les chemins attendus lors de cet audit. Il faut localiser les sources exactes avant de consolider leurs détails.
- Les exigences de collecte progressive d'identité, les seuils de réponse, les statuts de confiance et les automatismes décrits historiquement doivent être comparés aux schémas, contrats API, politiques et tests actuels.
- Aucun parcours ne doit être annoncé comme implémenté uniquement parce qu'une source historique le décrit ou le marque « VALIDÉ ».

## Sources historiques

Les spécifications originales restent en place pour la traçabilité. Cette référence canonique fournit une carte commune et des règles de lecture ; elle n'autorise ni la suppression ni le déplacement des fichiers historiques.
