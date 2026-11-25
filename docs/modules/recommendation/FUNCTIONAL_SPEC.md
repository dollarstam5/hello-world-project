# Recommendation — spécification fonctionnelle V1

> Référence fonctionnelle autonome. Elle décrit le comportement attendu, pas une preuve d'implémentation runtime. Les contrats de données V1 sont définis dans `packages/core-contracts/src/recommendation.ts`.

## 1. Finalité

Recommendation aide un utilisateur à identifier une prochaine action potentiellement utile. Il transforme des signaux autorisés en propositions personnalisées, contextualisées, explicables et limitées dans le temps. Il ne décide pas à la place de l'utilisateur et n'exécute jamais automatiquement l'action suggérée.

## 2. Périmètre fonctionnel

Une proposition peut porter sur une mission, un Flash, une opportunité, une personne, une compétence, un contenu ou une action. Une proposition portant sur une personne ou des données sensibles exige une autorisation et une justification spécifiques.

Recommendation ne devient jamais propriétaire de la ressource proposée. Le domaine source garde l'autorité sur son contenu, sa visibilité, son état et ses mutations.

## 3. Acteurs

| Acteur | Rôle |
|---|---|
| Destinataire | Consulte et réagit aux propositions qui lui sont adressées |
| Moteur de production | Qualifie les signaux, génère les candidats, déduplique, classe et justifie |
| Domaine source | Autorise la projection et reste propriétaire de la ressource |
| Opérateur habilité | Supervise qualité, abus et métriques avec accès minimisé et audité |

## 4. Parcours utilisateur attendu

### 4.1 Préparer le contexte

1. Identifier le destinataire depuis son identité authentifiée.
2. Récupérer uniquement les préférences et projections autorisées pour la finalité `recommendation`.
3. Vérifier fraîcheur, statut et visibilité des ressources candidates.
4. Exclure les ressources inaccessibles, expirées, supprimées ou insuffisamment justifiées.
5. Conserver une provenance minimisée et les versions de schéma/règles utilisées.

La présence d'un type de cible dans le contrat ne signifie pas que sa source est raccordée ou activée. Une matrice des sources réellement disponibles devra être tenue à jour.

### 4.2 Produire et classer

1. Construire des candidats à partir des projections autorisées.
2. Vérifier éligibilité, destinataire, finalité et permissions.
3. Appliquer les règles de pertinence documentées et versionnées.
4. Dédupliquer les propositions équivalentes.
5. Appliquer fraîcheur, diversité et plafonds de fréquence.
6. Produire une explication fidèle aux signaux réellement utilisés.
7. Fixer la fenêtre de disponibilité et conserver la provenance.

Aucun algorithme, poids, seuil, score numérique ou modèle d'apprentissage n'est défini en V1. Le contrat expose une priorité `low | normal | high`, pas un score. Toute évolution vers un score devra faire l'objet d'une décision documentée et versionnée avant implémentation.

### 4.3 Consulter

Le destinataire accède à sa liste personnelle et au détail d'une proposition. L'interface doit expliquer ce qui est proposé, pourquoi, quelle ressource est concernée, sa fraîcheur, sa période de validité et les limites éventuelles. Elle doit revérifier les permissions de la ressource source au moment de l'affichage.

La justification ne révèle pas de données privées sur une autre personne ni de signaux internes non autorisés.

### 4.4 Réagir

Les réactions V1 sont des événements distincts :

- **viewed :** consultation, uniquement si cette télémétrie est justifiée et annoncée ;
- **saved :** enregistrement dans la liste personnelle ;
- **accepted :** intention de poursuivre la piste, sans preuve d'exécution ;
- **dismissed :** masquage de la proposition pour le destinataire ;
- **reported :** signalement pour revue, avec motif normalisé si nécessaire.

Les réactions sont append-only et rattachées au destinataire et à la recommandation. Elles ne modifient ni le statut de disponibilité de la proposition ni la ressource source. Toute réversibilité éventuelle doit être exprimée par un nouvel événement et une règle explicitement définie.

Une acceptation ne signifie pas que l'utilisateur a rejoint une mission, contacté une personne ou réalisé l'action proposée. Toute mutation métier passe par le domaine propriétaire et son propre contrôle d'autorisation.

### 4.5 Expiration et retrait

Le contrat distingue le statut système de la proposition (`generated`, `available`, `expired`, `withdrawn`) des réactions utilisateur. Une proposition devient indisponible si sa période expire, si la ressource source est retirée ou si le destinataire perd le droit de la consulter.

La permission doit être revérifiée à la lecture et avant toute action sensible, pas seulement lors du calcul initial.

## 5. Invariants fonctionnels

- Toute proposition possède un destinataire précis.
- Une proposition affichable est explicable et possède une provenance suffisante.
- La ressource source reste la seule autorité pour sa visibilité et ses mutations.
- Une ressource inaccessible, expirée ou retirée n'est pas exposée.
- La fraîcheur, la période de validité, les doublons et la fréquence sont contrôlés.
- L'utilisateur garde le contrôle ; aucune action métier n'est exécutée implicitement.
- Les réactions ne modifient pas la ressource source.
- Une recommandation n'est ni une garantie, ni une décision, ni une preuve de qualité d'une personne.
- Les signaux sensibles ne sont pas révélés dans les explications.

## 6. Confidentialité et préférences

La personnalisation respecte les finalités autorisées, les préférences, la minimisation et une durée de conservation documentée. L'utilisateur doit pouvoir comprendre pourquoi une proposition lui est présentée, la masquer et la signaler.

Les réactions ne peuvent contribuer à l'évaluation ou à l'amélioration du système que selon une politique transparente, proportionnée et documentée. Une acceptation isolée ne vaut pas consentement général à un profilage ou à un partage de données.

## 7. Hors périmètre et état non démontré

Le contrat de données V1 existe, mais les capacités suivantes ne sont pas confirmées comme implémentées : feed, API runtime, schéma SQL, RLS, moteur de classement, connecteurs, jobs, préférences persistées, notifications et tableau de bord opérateur.

Les recommandations collaboratives, embeddings, apprentissage automatique et recommandations prédictives sont des évolutions éventuelles, pas des capacités V1 promises.

## 8. Critères d'acceptation fonctionnels

- La liste ne contient que les propositions du destinataire authentifié.
- Chaque proposition explique sa raison, sa source et sa fraîcheur.
- Une ressource inaccessible ou expirée est retirée sans fuite d'information.
- Les réactions sont isolées par utilisateur et idempotentes.
- Une réaction ne modifie jamais l'objet source ni le statut système.
- L'acceptation n'exécute pas l'action proposée.
- Les règles de déduplication, diversité et fréquence sont mesurables et testables.
- Les signaux utilisés et la version de règle sont auditables.

## 9. Décisions fonctionnelles restant à valider

Cette section rend visibles les règles qui ne sont pas encore suffisamment précises pour être considérées comme des décisions V1. Les éléments ci-dessous ne doivent pas être remplacés par des valeurs supposées pendant l'implémentation. Chaque décision devra être validée par le responsable produit et consignée ici avant de devenir normative.

| Sujet | Décision encore nécessaire | Conséquence à couvrir dans les critères de recette |
|---|---|---|
| Sources activées | Définir, pour chaque type de cible, les domaines sources autorisés, les champs projetables, les destinataires possibles et les conditions d'activation. | Une source non activée ou non autorisée ne produit aucun candidat. |
| Contrôle utilisateur | Préciser si l'utilisateur peut désactiver Recommendation globalement, exclure des catégories de suggestions ou limiter certaines finalités. Définir le comportement par défaut et la prise en compte immédiate d'un changement. | Un choix de désactivation ou d'exclusion est respecté lors des générations suivantes et des lectures. |
| Fraîcheur et validité | Définir les règles de fraîcheur par catégorie de ressource, les durées de disponibilité et les événements qui provoquent une expiration anticipée. Aucune durée par défaut n'est approuvée dans cette spécification. | Une proposition obsolète ou hors période n'est pas affichée ; les règles sont vérifiables par catégorie. |
| Fréquence et diversité | Définir les plafonds par destinataire, période, catégorie et éventuellement source, ainsi que la règle de diversité et les exceptions éventuelles. | Les limites sont déterministes, testables et ne peuvent pas être contournées par une nouvelle génération. |
| Déduplication | Définir ce qui rend deux propositions équivalentes, le périmètre temporel de comparaison et le traitement d'une même ressource proposée sous plusieurs angles. | Une proposition équivalente n'encombre pas le feed ; la règle conserve une provenance exploitable. |
| Réactions répétées | Préciser si saved, accepted et dismissed sont des états dérivés du dernier événement ou un historique d'événements, et définir les transitions autorisées ainsi que leur réversibilité. | Les répétitions et changements de réaction ont un résultat prévisible ; l'historique ne crée pas d'effets métier implicites. |
| Persistance après retrait | Définir ce que voit l'utilisateur lorsqu'une proposition sauvegardée ou acceptée expire, est retirée ou devient inaccessible. Définir si une entrée historique minimale reste consultable. | Aucun détail de ressource devenu interdit n'est révélé ; l'utilisateur comprend pourquoi l'entrée n'est plus disponible. |
| Signalement | Définir les motifs proposés, les champs libres éventuels, les règles anti-abus, le niveau de gravité, le circuit de revue, les délais/engagements de traitement et le retour éventuel au déclarant. | Un signalement est traçable et accessible uniquement aux opérateurs habilités ; son dépôt ne révèle pas l'identité du déclarant à des personnes non autorisées. |
| Explications | Définir le niveau de détail, les formulations autorisées par catégorie et les informations de provenance qui peuvent être montrées sans révéler des signaux privés ou sensibles. | Chaque explication est fidèle aux signaux utilisés et ne permet pas d'inférer des informations protégées. |
| Feed vide et indisponibilité | Définir les états d'interface lorsque rien n'est recommandé, lorsque toutes les propositions sont masquées ou lorsque les sources ne sont temporairement pas disponibles. | L'interface distingue clairement l'absence de résultat d'une erreur ou d'une absence d'autorisation. |
| Notifications | Décider si la V1 comporte des notifications. Si oui, définir les canaux, préférences, fréquences, contenus et règles de confidentialité. En l'absence de décision, aucune notification ne doit être considérée comme une capacité promise. | Les notifications respectent les préférences et ne divulguent pas de contenu protégé sur un écran ou canal non maîtrisé. |
| Conservation et droits utilisateur | Définir les durées de conservation des propositions, réactions et signalements, ainsi que les effets d'une demande d'accès, d'export ou de suppression du compte. | Les données sont conservées et supprimées selon une politique explicite, cohérente avec les obligations applicables. |
| Accessibilité et langues | Définir les langues V1, le comportement de repli linguistique et les exigences d'accessibilité du feed, des explications et des actions de réaction. | Les parcours essentiels restent compréhensibles et utilisables avec les langues et technologies d'assistance prises en charge. |

### 9.1 Conditions de clôture de cette revue

La spécification fonctionnelle pourra être considérée comme suffisamment définie pour passer à la revue technique lorsque :

- chaque sujet du tableau est soit décidé et documenté, soit explicitement exclu du périmètre V1 ;
- les règles retenues sont cohérentes avec les états et événements du contrat de données ;
- les transitions, cas limites et permissions disposent de critères de recette observables ;
- aucune valeur métier (durée, quota, seuil, motif ou canal) n'est introduite uniquement par commodité technique ;
- les sujets encore ouverts ont un responsable de décision et ne sont pas présentés comme des comportements déjà disponibles.

Tant qu'une décision reste ouverte, l'implémentation devra s'abstenir de supposer un comportement produit ; elle devra soit rester hors périmètre, soit attendre une validation explicite.
