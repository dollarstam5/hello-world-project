# Veille — fiche de cadrage du moteur

## Statut et position

Veille est documenté comme un moteur de supervision et d'intelligence collective. Il complète les quatre moteurs prioritaires (Instant, Flash, Scan et Radar). Cette fiche ne décide pas de son emplacement dans la navigation V1 et ne certifie pas que les fonctions décrites sont déjà raccordées au runtime.

Les trois documents historiques Veille restent conservés comme sources de conception. Cette fiche en synthétise les responsabilités sans transformer leurs propositions en preuves d'implémentation.

## Mission

Veille remplit deux fonctions complémentaires :

1. **Veille personnelle** : permettre à chaque utilisateur de suivre ses propres surveillances, missions, paramètres, événements et évolutions.
2. **Veille collective** : analyser des signaux suffisamment agrégés et anonymisés pour faire ressortir les besoins émergents, les opportunités latentes et les tendances de la plateforme.

Veille privilégie la compréhension des évolutions utiles plutôt que l'accumulation de notifications.

## Frontières avec les autres moteurs

- **Flash** diffuse une intention, un besoin, une proposition ou une information ; ses signaux peuvent contribuer à l'analyse collective selon les règles de confidentialité.
- **Scan** recherche des possibilités disponibles immédiatement, à la demande.
- **Radar** crée, qualifie, exécute et suit une mission de recherche persistante.
- **Veille** supervise l'évolution des missions Radar et analyse les signaux collectifs compatibles. Il ne remplace pas Radar et n'exécute pas sa stratégie de recherche.
- **Mission** conserve la responsabilité de ses propres engagements et de leur cycle métier.

Une veille personnelle peut être créée depuis une mission Radar, depuis un Flash que l'utilisateur souhaite surveiller, ou directement depuis Veille selon les capacités qui seront retenues.

## Veille personnelle

L'espace personnel est strictement privé. Il ne présente que les surveillances et missions appartenant à l'utilisateur connecté.

Une surveillance peut comporter :

- une cible et une catégorie ;
- une ou plusieurs zones ;
- des critères de recherche ou de suivi ;
- une durée ;
- des préférences de notification ;
- un état et un historique d'événements.

Les états décrits dans les sources historiques comprennent préparation, active, attente de résultats, suspendue, arrivée à échéance, terminée et archivée. Leur correspondance avec les états techniques du runtime reste à vérifier.

L'utilisateur doit pouvoir consulter le détail, modifier les paramètres autorisés, suspendre, reprendre, arrêter, prolonger ou archiver une surveillance lorsque ces actions sont prises en charge. Veille ne modifie, n'active et ne partage jamais une mission sans l'accord de son propriétaire.

## Veille collective et confidentialité

L'espace collectif présente uniquement des résultats agrégés et anonymisés, par exemple :

- besoins émergents observés de manière répétée ;
- opportunités latentes lorsque la demande semble insuffisamment satisfaite ;
- tendances par catégorie ou zone ;
- évolutions de la demande et de l'offre disponibles.

Aucune mission personnelle, publication privée, identité ou donnée permettant de réidentifier une personne ne doit être exposée. Les seuils d'agrégation, les protections contre la réidentification et les sources autorisées restent à spécifier avant activation.

Une tendance ou un indice d'opportunité est une aide à la décision, jamais une garantie de marché ou de résultat.

## Répondre à un besoin collectif

Un utilisateur peut signaler qu'il est en mesure de répondre à une tendance. Cette action ne révèle pas directement les personnes à l'origine des signaux et ne crée pas de contact automatique.

Toute mise en relation nécessite un processus explicite et un intérêt mutuel. Les identités restent protégées jusqu'à ce que les autorisations nécessaires soient réunies.

## Notifications et résumé

Veille privilégie les notifications contextuelles et pertinentes : évolution significative d'une mission, nouvelle correspondance, échéance proche ou tendance utile. Un résumé à l'ouverture peut présenter les changements importants depuis la dernière consultation.

Les fréquences, canaux, seuils de pertinence et règles de consentement doivent être définis et testés avant toute promesse de notification proactive.

## Indice d'Opportunité

Les sources historiques proposent un Indice d'Opportunité (IOV) construit à partir du volume de demande, de la disponibilité de l'offre, de l'évolution de la demande, du temps d'attente et de la concentration géographique.

Cet indice reste une proposition de cadrage à valider : méthode de calcul, seuils, qualité des données, explicabilité et protections contre les biais doivent être définis avant son utilisation. Il ne doit jamais être présenté comme une prédiction certaine.

## Archives et conservation

Les sources historiques proposent de conserver les paramètres, la durée, les événements importants, les opportunités détectées et les résultats d'une surveillance terminée, jusqu'à suppression par l'utilisateur. La durée de conservation, les droits d'effacement et les coûts associés doivent être alignés avec la politique globale de données et les exigences V1 avant implémentation.

## Principes UX

- Présenter séparément les espaces personnel et collectif.
- Montrer clairement l'état et les changements utiles.
- Expliquer pourquoi une tendance est signalée.
- Employer un langage naturel, simple et direct.
- Préserver la confidentialité et laisser l'utilisateur maître des actions.
- Éviter les notifications excessives et les tableaux de bord surchargés.

## Sujets à confirmer

- Place de Veille dans le périmètre et la navigation produit V1.
- Sources de signaux autorisées et seuils minimaux d'agrégation.
- États canoniques et correspondance avec les états techniques existants.
- Création directe de surveillances et relation exacte avec Radar, Flash et Mission.
- Méthode, seuils et validation de l'IOV.
- Durées de conservation, suppression et archivage.
- Notifications, traitement planifié, fréquence et coût.
- Contrôles anti-réidentification et scénarios de tests.

## Garde-fous

- Veille ne remplace jamais Radar.
- Les espaces personnels restent strictement privés.
- Les tendances collectives sont agrégées et anonymisées.
- Une tendance n'est pas une garantie de marché.
- Aucune mise en relation sans intérêt mutuel et consentement explicite.
- Ne pas présenter comme opérationnelle une analyse, une alerte ou une tâche planifiée qui n'a pas été vérifiée dans le runtime.
