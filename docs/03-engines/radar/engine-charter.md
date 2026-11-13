# Radar — fiche de cadrage du moteur

## Statut

Document de cadrage produit et métier. Il distingue les décisions de conception, les points à confirmer et les capacités effectivement vérifiées dans le runtime. Il ne certifie pas à lui seul l'exécution automatique d'une recherche.

## Rôle du moteur

Radar transforme une intention de recherche en **mission suivie dans le temps**. L'utilisateur lui délègue un objectif, définit une stratégie et valide le lancement. Radar peut ensuite analyser les possibilités, comparer les correspondances et surveiller les évolutions jusqu'à la fin ou l'arrêt de la mission.

Radar ne se limite donc pas à un balayage visuel ponctuel. Il peut continuer à travailler lorsque l'application est fermée, selon la durée et les capacités réellement disponibles côté service.

## Frontières avec les autres moteurs

- **Flash** diffuse une intention, un besoin, une proposition ou une information.
- **Scan** recherche à la demande les possibilités immédiatement disponibles ; son usage est ponctuel et de courte durée.
- **Radar** transforme une intention en mission de recherche suivie et persistante.
- **Veille** supervise les missions Radar et présente leur progression ainsi que les signaux collectifs anonymisés. Veille n'exécute pas à la place de Radar la stratégie de recherche de la mission.
- **Mission** peut représenter un engagement concret entre un auteur et un intervenant ; une correspondance Radar ne crée jamais automatiquement un tel engagement.

L'utilisateur peut démarrer une mission Radar directement, sans devoir effectuer un Scan préalable.

## Repères d'interface déjà établis

- En-tête propre à Radar : icône et nom du moteur à gauche, commandes propres à Radar à droite.
- Aucun titre, icône ou décor au centre de l'en-tête.
- L'action principale au centre de la page est le démarrage ou la validation d'une mission Radar.
- Les informations, paramètres et résultats propres à Radar se placent sous l'en-tête.

## Qualification et validation d'une mission

Le parcours cible est progressif :

1. l'utilisateur exprime son besoin ou son intention ;
2. Radar clarifie les éléments nécessaires sans imposer un long formulaire ;
3. l'utilisateur configure et examine une fiche de mission ;
4. Radar explique l'objectif, la stratégie, le périmètre et la durée ;
5. l'utilisateur valide explicitement le lancement ;
6. Radar exécute la mission et présente les résultats ainsi que les évolutions importantes.

Radar peut proposer des précisions, élargissements ou ajustements, mais ne modifie pas la mission de sa propre initiative. Toute modification importante requiert la validation de l'utilisateur.

## Configuration avant chaque mission

Avant le lancement, l'utilisateur choisit ou confirme :

- **Zones à explorer** : une ou plusieurs zones géographiques.
- **Critères de recherche** : catégories, types d'opportunités et caractéristiques attendues.
- **Durée de mission / de surveillance** : période pendant laquelle Radar poursuit l'objectif et surveille les nouvelles possibilités.

Distinguer les préférences par défaut enregistrées dans les paramètres Radar des paramètres propres à la mission en cours. Les choix doivent être proposés avec des contrôles courts : sélection de zones, cases à cocher et sélecteur de durée.

La durée correspond à la continuité de la mission, pas seulement au temps pendant lequel l'application reste ouverte. Les zones et critères doivent être transmis aux services et réellement appliqués. À échéance, Radar arrête ou clôt la surveillance selon l'état métier prévu et informe l'utilisateur.

Les valeurs exactes, dont les bornes de durée, doivent rester cohérentes avec le modèle de données et les contrats en vigueur. Le document technique `RADAR_MODULE.md` décrit actuellement une veille de 3 à 90 jours ; toute modification de ces bornes exige une décision et une migration documentées.

## Cycle métier cible

Le cycle de mission comprend les étapes suivantes :

- créée / en préparation ;
- qualifiée ;
- validée par l'utilisateur ;
- exécutée et suivie ;
- complétée, suspendue ou arrêtée.

Les états techniques déjà définis dans `RADAR_MODULE.md` (draft, active, watching, matched, paused, expired, cancelled) restent le contrat opérationnel existant tant qu'une évolution explicite n'est pas validée. Ne pas confondre ces états techniques avec les étapes métier ci-dessus.

## Résultats et transparence

Pour chaque résultat ou évolution importante, Radar doit permettre de comprendre :

- pourquoi la possibilité correspond aux critères ;
- quels critères sont satisfaits ou non ;
- quelle zone et quelle période sont concernées ;
- si la recherche a été élargie et pourquoi ;
- quelles limites empêchent une correspondance exacte.

Une absence de résultat doit être expliquée. Radar peut proposer une alternative ou un élargissement, sans l'appliquer sans accord.

## Utilisation du profil et confidentialité

Radar définit sa propre projection du profil selon le type d'opportunité et les interactions nécessaires. Il ne doit pas afficher automatiquement le profil complet ni réutiliser le réglage de visibilité d'Instant.

Les informations nécessaires, les règles membre/invité et l'éventuel accès au profil complet doivent être définis par des autorisations propres à Radar. Les critères et détails d'une mission personnelle restent privés. Les résultats ne doivent exposer que les informations autorisées par leur propriétaire et par le contexte de la mise en relation.

## Relation avec Veille

Radar est responsable de la création, de la qualification, de l'exécution et des résultats de la mission de recherche. Veille est responsable de la supervision et de la présentation de son évolution dans l'espace personnel de l'utilisateur.

Veille peut également analyser des signaux agrégés et anonymisés provenant de Flash et d'autres activités compatibles pour révéler des besoins émergents, des opportunités latentes et des tendances. Ces analyses ne donnent pas accès aux missions individuelles ni à l'identité des personnes concernées.

## Sujets à confirmer avant implémentation complète

- Stratégie de recherche et sources de données autorisées.
- Valeurs de durée et articulation avec la limite technique de 3 à 90 jours déjà documentée.
- Comportement en arrière-plan, fréquence de traitement et coûts.
- Critères de correspondance, comparaison et élargissement.
- Notifications et événements transmis à Veille.
- Conditions de clôture, reprise, suspension et archivage.
- Règles de confidentialité, consentement et mise en relation.
- Critères de tests et preuves de fonctionnement réel.

## Garde-fous

- Ne pas confondre Radar avec Instant ou Scan.
- Ne pas prétendre qu'une mission travaille en arrière-plan si le service planifié n'est pas raccordé et vérifié.
- Ne pas présenter un état `active` comme preuve suffisante d'une recherche automatique.
- Ne jamais créer une mission ou une mise en relation concrète à partir d'une simple correspondance sans action explicite de l'utilisateur.
- L'utilisateur garde le contrôle des paramètres et des modifications importantes.
