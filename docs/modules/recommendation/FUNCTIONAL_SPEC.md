# Recommendation — spécification fonctionnelle V1

> Référence fonctionnelle autonome. Les parcours ci-dessous décrivent le comportement attendu par le contrat historique. Ils ne constituent pas une preuve d'implémentation runtime.

## 1. Finalité

Recommendation aide un utilisateur à identifier une prochaine action utile dans Vitala. Il transforme des signaux autorisés en propositions personnalisées, contextualisées, explicables et limitées dans le temps. Il ne décide pas à la place de l'utilisateur et n'exécute jamais automatiquement l'action suggérée.

## 2. Périmètre fonctionnel

Une proposition peut porter sur :
- une mission à consulter ou à laquelle répondre ;
- un Flash ou une information utile ;
- une opportunité détectée ;
- une personne ou une compétence, si les permissions autorisent cette exposition ;
- un contenu ou une action à effectuer.

Recommendation ne devient jamais propriétaire de la ressource proposée. La source garde l'autorité sur son contenu, sa visibilité, son état et ses mutations.

## 3. Acteurs

| Acteur | Rôle |
|---|---|
| Destinataire | Consulte, enregistre, suit/accepte, ignore/masque ou signale une recommandation qui lui est adressée |
| Moteur de production | Qualifie les signaux, déduplique, classe, justifie et crée les propositions |
| Domaine source | Autorise la lecture de sa projection et reste propriétaire de l'objet source |
| Opérateur/administrateur | Supervise la qualité, les abus et les métriques sans accéder indûment aux données privées |

## 4. Parcours complet attendu

### 4.1 Préparer le contexte

1. Le système identifie le destinataire authentifié.
2. Il récupère uniquement les préférences et signaux autorisés pour la finalité de recommandation.
3. Il vérifie la fraîcheur, le statut et la visibilité des ressources candidates.
4. Il exclut les ressources privées non accessibles, expirées, supprimées, déjà indisponibles ou dépourvues de preuve suffisante.
5. Les sources et les champs utilisés doivent être traçables.

La disponibilité d'un connecteur, d'un événement ou d'une projection n'est pas présumée. La matrice des sources raccordées doit être maintenue à jour avant d'afficher un type de recommandation comme opérationnel.

### 4.2 Produire et classer

1. Le moteur construit un ensemble de candidats.
2. Il vérifie l'éligibilité et les permissions.
3. Il applique les règles de pertinence documentées et versionnées.
4. Il déduplique les propositions équivalentes.
5. Il applique les règles de fraîcheur, de diversité et de fréquence.
6. Il génère une justification fondée sur les signaux réellement utilisés.
7. Il fixe une période de validité et conserve la provenance utile à l'audit.

Aucun algorithme, poids, score, seuil, modèle d'apprentissage ou fréquence de calcul n'est défini par les fichiers actuels. Ils doivent faire l'objet d'une décision versionnée avant implémentation.

### 4.3 Consulter

L'utilisateur accède à sa liste personnelle et au détail d'une proposition. Chaque carte ou détail doit expliquer :
- ce qui est proposé ;
- pourquoi cette proposition est affichée ;
- la ressource source et son état courant ;
- la période de validité ;
- les limites ou incertitudes éventuelles.

La justification ne révèle jamais de données privées sur une autre personne ni de signaux sensibles internes.

### 4.4 Réagir

Les actions prévues par le contrat historique sont :

- **Enregistrer :** conserver la recommandation dans une liste personnelle.
- **Accepter / suivre :** indiquer que l'utilisateur souhaite poursuivre la piste ; cela ne prouve pas que l'action métier a été exécutée.
- **Ignorer / masquer :** retirer la proposition des surfaces actives de cet utilisateur.
- **Signaler :** demander une revue lorsqu'elle est inadaptée, trompeuse, obsolète ou contraire aux règles.
- **Consulter :** enregistrer éventuellement une vue, si cette télémétrie est justifiée et annoncée.

Une réaction est rattachée au destinataire et à la recommandation. Elle ne modifie pas la mission, le Flash, le profil ou la ressource source.

### 4.5 Retrait et expiration

Une recommandation cesse d'être proposée si elle expire, si sa ressource source devient indisponible ou si le destinataire perd le droit de la consulter. Une ressource révoquée doit être filtrée au moment de la lecture et non seulement lors du calcul initial.

L'historique des réactions et la durée de conservation doivent être définis par politique de données. Le contrat actuel ne précise ni durée de rétention ni mécanisme de purge.

## 5. Cycle de vie fonctionnel proposé

Le contrat historique décrit les réactions, mais ne fixe pas une machine d'état formelle. Pour l'implémentation, distinguer au minimum :

- `generated` : calculée et enregistrée ;
- `available` : affichable au destinataire ;
- `viewed` : consultée ;
- `saved` : enregistrée par l'utilisateur ;
- `accepted` : l'utilisateur souhaite poursuivre ;
- `dismissed` : masquée/ignorée ;
- `reported` : signalée pour revue ;
- `expired` : période échue ;
- `withdrawn` : ressource source retirée ou permission révoquée.

Cette liste est une proposition de vocabulaire, pas un enum existant. Les réactions devraient idéalement être modélisées comme des événements distincts plutôt que comme un seul statut écrasable : un utilisateur peut consulter puis enregistrer, puis retirer son enregistrement.

## 6. Règles et invariants

- Toute recommandation possède un destinataire précis.
- Chaque recommandation est explicable par des éléments vérifiables.
- Toute ressource source est relue avec ses permissions actuelles avant affichage/action.
- La fraîcheur et l'expiration sont appliquées.
- Les doublons et répétitions excessives sont limités.
- L'utilisateur garde le contrôle ; aucune action métier n'est exécutée implicitement.
- Les réactions ne modifient pas la ressource source.
- Une recommandation ne constitue ni une garantie, ni une décision, ni une preuve de qualité d'une personne.
- Les signaux sensibles ne sont pas révélés dans les explications.

## 7. Confidentialité et préférences

La personnalisation doit respecter les finalités autorisées, les préférences utilisateur, la minimisation et la durée de conservation. L'utilisateur doit pouvoir comprendre pourquoi une proposition lui est présentée et disposer d'un moyen de masquer ou signaler les propositions.

Les réactions peuvent contribuer à l'évaluation ou à l'amélioration du système seulement selon une politique transparente et documentée. Une acceptation isolée ne vaut pas consentement général à un profilage ou à un partage de données.

## 8. Hors périmètre/non démontré

Aucun des éléments suivants n'est confirmé par une implémentation dans la branche examinée : feed de recommandations, API, modèle de données, moteur de scoring, embeddings, apprentissage, jobs planifiés, connecteurs sources, préférences persistées, table de réactions, notifications, tableau de bord opérateur.

## 9. Critères d'acceptation

- La liste ne contient que des recommandations du destinataire authentifié.
- Chaque proposition explique sa raison, sa source et sa fraîcheur.
- Une ressource inaccessible/expirée est retirée sans fuite d'information.
- Enregistrer, accepter, ignorer et signaler sont idempotents et isolés par utilisateur.
- Une réaction ne modifie jamais l'objet source.
- L'action proposée n'est exécutée qu'après confirmation dans le domaine concerné.
- Les doublons, fréquences et règles de classement sont mesurables et testables.
- Les signaux utilisés et la version de la règle sont auditables.
