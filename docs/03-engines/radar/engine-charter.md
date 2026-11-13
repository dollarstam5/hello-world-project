# Radar — fiche de cadrage du moteur

## Statut
Document de cadrage produit et métier. Il distingue les décisions de conception, les points à confirmer et les capacités effectivement vérifiées dans le runtime. Il ne certifie pas à lui seul l'exécution automatique d'une recherche.

## Rôle du moteur
Radar transforme une intention de recherche en **mission suivie dans le temps**. L'utilisateur lui délègue un objectif, définit une stratégie et valide le lancement. La cible produit est de pouvoir analyser les possibilités, comparer les correspondances et surveiller les évolutions jusqu'à la fin ou l'arrêt de la mission.

Cette continuité est le comportement cible de Radar ; elle ne signifie pas que le traitement automatique en arrière-plan est déjà actif. L'état d'implémentation V1 indique que l'enregistrement et la synchronisation des critères sont raccordés, mais que la recherche automatique, les correspondances et les alertes ne sont pas encore actives.

## Frontières avec les autres moteurs
- **Instant** montre les présences proches et les interactions disponibles maintenant ; il ne suit pas une recherche d'opportunités.
- **Flash** diffuse une intention, un besoin, une proposition ou une information courte et temporaire.
- **Scan** recherche à la demande les possibilités immédiatement disponibles, dans un périmètre ponctuel.
- **Radar** conserve une intention et un ensemble de critères pour une recherche suivie dans le temps.
- **Veille** supervise la progression des missions Radar et présente des signaux collectifs anonymisés ; Veille n'exécute pas à la place de Radar la stratégie de recherche de la mission.
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
6. Radar exécute la mission et présente les résultats ainsi que les évolutions importantes, lorsque les services correspondants sont disponibles.

Radar peut proposer des précisions, élargissements ou ajustements, mais ne modifie pas la mission de sa propre initiative. Toute modification importante requiert la validation de l'utilisateur.

## Configuration avant chaque mission
Avant le lancement, l'utilisateur choisit ou confirme :
- **Zones à explorer** : une ou plusieurs zones géographiques et, si le mode retenu le permet, un rayon associé.
- **Critères de recherche** : catégories, types d'opportunités et caractéristiques attendues.
- **Durée de mission / de surveillance** : période pendant laquelle la mission doit poursuivre son objectif.

Le contrat technique V1 actuellement documenté autorise les rayons de **1, 3, 5, 10, 25 et 50 km** et une durée de **3 à 90 jours**. Ces valeurs constituent les limites documentées actuelles, et non une règle commune aux autres moteurs. Toute évolution exige une décision produit, une mise à jour du contrat et, si nécessaire, une migration.

Distinguer les préférences par défaut enregistrées dans les paramètres Radar des paramètres propres à la mission en cours. L'utilisateur doit pouvoir vérifier les paramètres effectifs avant validation. Les zones, rayons, critères et durée choisis doivent être transmis aux services et réellement appliqués avant qu'une interface puisse prétendre que la mission les respecte.

La durée correspond à la période de mission, pas seulement au temps pendant lequel l'application reste ouverte. Toutefois, tant que le traitement planifié et les sources de correspondance ne sont pas raccordés et vérifiés, l'interface doit présenter la capacité comme une cible non disponible, et non comme une surveillance active en arrière-plan.

## Cycle métier cible
- créée / en préparation ;
- qualifiée ;
- validée par l'utilisateur ;
- exécutée et suivie ;
- complétée, suspendue ou arrêtée.

Les états techniques déjà définis dans `RADAR_MODULE.md` (draft, active, watching, matched, paused, expired, cancelled) restent le contrat opérationnel existant tant qu'une évolution explicite n'est pas validée. Ne pas confondre ces états techniques avec les étapes métier ci-dessus. Un statut enregistré ne prouve pas à lui seul qu'une recherche automatique est en cours.

## Sources et résultats
Les sources autorisées pour les correspondances Radar doivent être définies explicitement. Les Flash peuvent constituer une source, mais la recherche automatique dans les Flash et les autres domaines n'est pas déclarée active dans l'état V1 documenté.

Pour chaque résultat ou évolution importante, Radar devra permettre de comprendre :
- la source et la ressource d'origine ;
- pourquoi la possibilité correspond aux critères ;
- quels critères sont satisfaits ou non ;
- quelle zone et quelle période sont concernées ;
- si la recherche a été élargie et pourquoi ;
- quelles limites empêchent une correspondance exacte.

Une absence de résultat doit être expliquée. Radar peut proposer une alternative ou un élargissement, sans l'appliquer sans accord.

## Utilisation du profil et confidentialité
Radar définit sa propre projection du profil selon le type d'opportunité et les interactions nécessaires. Il ne doit pas afficher automatiquement le profil complet ni réutiliser le réglage de visibilité d'Instant ou de Flash.

Les informations nécessaires, les règles membre/invité et l'éventuel accès au profil complet doivent être définis par des autorisations propres à Radar. Les critères et détails d'une mission personnelle restent privés. Les résultats ne doivent exposer que les informations autorisées par leur propriétaire et par le contexte de la mise en relation.

## Relation avec Veille
Radar est responsable de la création, de la qualification, de l'exécution et des résultats de la mission de recherche. Veille est responsable de la supervision et de la présentation de son évolution dans l'espace personnel de l'utilisateur, lorsque ces capacités sont raccordées.

Veille peut également analyser des signaux agrégés et anonymisés provenant de Flash et d'autres activités compatibles pour révéler des besoins émergents, des opportunités latentes et des tendances. Ces analyses ne donnent pas accès aux missions individuelles ni à l'identité des personnes concernées.

## Sujets à confirmer avant implémentation complète
- Stratégie de recherche et sources de données autorisées.
- Confirmation de la sémantique des zones multiples et du rayon par zone.
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
