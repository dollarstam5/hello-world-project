# Veille — guide autonome du moteur

**Mission :** superviser les surveillances personnelles et révéler des tendances collectives à partir de signaux autorisés, agrégés et anonymisés.  
**Statut constaté :** vision fonctionnelle détaillée dans les documents historiques ; aucun pipeline runtime Veille complet n'est identifié dans l'arborescence de cette branche.

## 1. Finalité et deux espaces

Veille répond à deux besoins distincts :

1. **Veille personnelle :** permettre à un membre de suivre ses propres surveillances, leurs paramètres, états, événements, résultats et échéances.
2. **Veille collective :** analyser des signaux autorisés et anonymisés pour révéler besoins émergents, opportunités latentes et tendances.

La veille personnelle est privée. La veille collective ne révèle jamais les personnes ou objets individuels à l'origine des agrégats.

## 2. Responsabilités et frontières

Veille supervise les surveillances et explique les évolutions. Les domaines qui produisent les données restent propriétaires de leurs objets, états, permissions et mutations. Veille consomme des projections ou événements autorisés ; il ne modifie pas directement une mission, un Flash ou une recherche persistante.

Une surveillance peut être configurée à partir d'une recherche persistante, d'un Flash ou directement depuis Veille selon les capacités validées. Cette origine ne transfère pas la propriété de la ressource.

## 3. Parcours personnel de bout en bout

### 3.1 Créer une surveillance

L'utilisateur choisit la cible, la catégorie, la ou les zones, les critères, la durée et les préférences de notification. Il peut initier le parcours depuis une recherche persistante, un Flash qu'il souhaite suivre ou depuis Veille. Il relit et confirme la configuration avant toute activation qui a un effet réel.

Les catégories (emploi, immobilier, service, produit, événement), zones (ville, quartier, rayon) et durées (3 jours, semaine, mois, trimestre) des documents historiques sont des exemples, pas des valeurs runtime garanties.

### 3.2 Consulter le tableau de bord

Le tableau personnel affiche uniquement les surveillances du membre connecté. Il distingue les surveillances actives, suspendues, arrivant à échéance, terminées et archivées. Chaque élément présente état, cible, échéance, progression mesurée et derniers événements confirmés.

### 3.3 Consulter le détail et gérer

Le détail expose paramètres, historique, résultats, dates et raison du statut. Les actions fonctionnelles prévues sont modifier les paramètres autorisés, ajuster zone/durée, suspendre, reprendre, arrêter, prolonger et archiver.

Chaque commande doit contrôler propriétaire, état, permissions et impact sur le traitement sous-jacent. Veille ne modifie jamais les critères d'une recherche source sans confirmation explicite.

### 3.4 Résumé depuis la dernière visite

Le résumé met en évidence les changements confirmés : résultat nouveau, évolution d'état, échéance proche ou tendance suivie ayant évolué. Il s'appuie sur un curseur/horodatage de dernière visite, reste idempotent et distingue les événements nouveaux des événements déjà lus.

## 4. Parcours collectif de bout en bout

### 4.1 Ingestion des signaux

Les sources doivent être explicitement autorisées, documentées, versionnées et fraîches. Les documents historiques citent Flash, Radar, Mission, Trust et Recommendation comme producteurs potentiels. Aucun connecteur ne doit être considéré actif sans preuve de code et de permission.

### 4.2 Besoins émergents

Le moteur regroupe des signaux comparables par catégorie, période et zone suffisamment large. Il recherche répétition, progression ou insatisfaction persistante. Les signaux invalides, dupliqués, anciens ou hors finalité sont écartés.

Un résultat n'est publiable que si les seuils de contribution et les contrôles anti-réidentification sont respectés. Les seuils numériques restent à décider après analyse de risque.

### 4.3 Opportunités latentes

Une opportunité latente suggère un écart entre demande agrégée et offre mesurée. Elle présente catégorie, zone agrégée, période, métriques de demande/offre, couverture des sources, fraîcheur, explication et limites.

Une source d'offre absente ou en panne ne prouve pas une absence d'offre. Le système doit afficher une couverture partielle plutôt que produire une opportunité artificielle.

### 4.4 Tendances collectives

Une tendance compare des fenêtres temporelles homogènes. Sa fiche détaille catégorie, zone généralisée, évolution, volume publiable, facteurs, période, couverture, incertitude et date de calcul. Aucune identité, mission individuelle ou publication privée ne doit pouvoir être reconstituée.

### 4.5 Répondre à un besoin et mise en relation

1. Un membre découvre une tendance agrégée.
2. Il manifeste explicitement son intérêt pour y répondre.
3. Veille enregistre l'intérêt sans lui révéler les demandeurs.
4. Les demandeurs compatibles reçoivent une sollicitation neutre.
5. Chaque partie peut accepter, refuser ou ignorer.
6. La mise en relation n'est créée qu'après consentements mutuels.
7. Les identités et coordonnées sont révélées uniquement au périmètre accepté.

Prévoir retrait du consentement, expiration, anti-spam et audit.

## 5. IOV — Indice d'Opportunité Vitala

Les facteurs historiques proposés sont volume de demande, disponibilité de l'offre, évolution de la demande, durée moyenne d'attente et concentration géographique. Les classes proposées sont Faible, Modéré, Fort et Prioritaire.

La formule, les variables exactes, la normalisation, les poids, seuils, fenêtres, valeurs manquantes et calibration ne sont pas définis. Ne pas afficher de score ou de classe avant validation d'une formule versionnée. Chaque IOV doit être expliqué, daté, accompagné de la couverture et présenté comme aide à la décision, jamais comme garantie de marché.

## 6. Notifications et archives

Les événements pouvant justifier une notification sont une évolution importante, un résultat confirmé, une échéance proche, une tendance suivie devenue significative ou une manifestation d'intérêt pertinente. Les canaux, opt-in, fréquences, heures silencieuses et quotas restent à définir.

Les archives personnelles peuvent conserver paramètres, durée, événements et résultat selon une politique explicite de rétention, d'effacement et de coût. Aucune durée historique ne vaut règle de production sans validation.

## 7. États fonctionnels

Les documents historiques proposent les états de surveillance : préparation, active, attente de résultats, suspendue, arrivée à échéance, terminée et archivée. La machine canonique et les transitions doivent être versionnées avant de devenir un contrat API.

Le pipeline collectif a un cycle distinct : collecte, agrégation, contrôle qualité, publiable, rejeté, expiré. Un snapshot de tendance doit être versionné afin de conserver la reproductibilité sans garder inutilement les identifiants sources.

## 8. Architecture technique cible

```text
Sources autorisées
  -> registre de connecteurs et projections versionnées
  -> ingestion / validation / déduplication
  -> normalisation et fraîcheur
  -> agrégation par catégorie, zone et fenêtre
  -> contrôles qualité et anti-réidentification
  -> détection de tendances / opportunités / IOV
  -> snapshots publiables
  -> API collective et dashboard

Surveillances personnelles
  -> API privée et machine d'état
  -> stockage isolé par propriétaire
  -> historique / résumé / notifications opt-in
```

Les pipelines personnel et collectif doivent être séparés en stockage, permissions et finalité. Les jobs doivent être idempotents, observables, reprenables, versionnés et dotés de retries bornés/dead-letter.

## 9. Confidentialité et sécurité

- RLS stricte sur les surveillances personnelles.
- Séparation des données brutes, personnelles et agrégées.
- Minimisation des champs dès l'ingestion.
- Suppression des petits groupes et généralisation géographique/temporelle.
- Contrôle des requêtes différentielles et des exports.
- Audit des accès opérateur.
- Propagation des suppressions et révocations.
- Pas de réutilisation de données Trust sans finalité et autorisation explicites.
- Aucun partage d'identité avant consentement mutuel.

La pseudonymisation ne suffit pas à garantir l'anonymat. Les seuils, techniques de généralisation et éventuelle confidentialité différentielle doivent être décidés et testés ; aucune protection formelle n'est revendiquée comme implémentée.

## 10. API et état runtime

Le contrat historique propose GET /veille, GET /veille/{id} et les commandes read/save/ignore/report, ainsi que les événements VeilleItemViewed, VeilleItemSaved, VeilleItemIgnored et VeilleItemReported. Ces routes et événements ne sont pas confirmés comme actifs.

L'inventaire de la branche ne montre pas de module runtime Veille, types, repository, migration, endpoint, job planifié, tests dédiés ou IOV calculé. Les schémas, APIs, jobs et dashboards de ce guide sont des cibles à construire, pas des composants déjà déployés.

## 11. Critères de validation

Tester isolation propriétaire, transitions, sources et provenance, fraîcheur, déduplication, couverture partielle, seuils anti-réidentification, attaques par différences, tendances reproductibles, calcul IOV versionné, consentement mutuel, notifications opt-in/idempotentes, expiration, suppression et conservation.

## 12. Documentation autonome

- [Spécification fonctionnelle](FUNCTIONAL_SPEC.md)
- [Architecture technique](TECHNICAL_ARCHITECTURE.md)
- [Pipeline et confidentialité](DATA_PIPELINE_AND_PRIVACY.md)
- [API et exploitation](API_AND_OPERATIONS.md)
- [Charte de cadrage](engine-charter.md)
- [API historique](10.%20Veille%20API.md)
- [Partie 1 historique](14-VITALA-VEILLE-ENGINE.md%20Partie%201.md)
- [Partie 2 historique](14-VITALA-VEILLE-ENGINE.md%20Partie%202.md)
- [Partie 3 historique](14-VITALA-VEILLE-ENGINE.md%20Partie%203.md)

Ce guide contient la vue d'ensemble nécessaire pour comprendre Veille sans devoir lire la documentation d'un autre moteur.
