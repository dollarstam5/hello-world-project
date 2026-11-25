# Veille — architecture technique et état d'implémentation

## 1. Statut du dépôt

L'inventaire de l'arborescence de la branche ne révèle pas de package ou module runtime Veille, de type TypeScript Veille, de repository, de migration SQL, de route, de job planifié ou de test dédié. Les fichiers disponibles sont des documents de conception : charte, contrat API historique, trois parties de spécification et guide.

**Conclusion :** Veille est défini fonctionnellement, mais son implémentation technique n'est pas établie par les sources présentes. Les composants décrits ci-dessous constituent une architecture cible, pas des services déjà déployés.

## 2. Frontières de responsabilité

Veille possède les configurations de surveillance personnelles, l'état et l'historique des surveillances qu'il gère, les résultats de calcul collectif anonymisés, les versions des agrégats/tendances/IOV, les préférences et réactions propres à Veille, ainsi que les demandes d'intérêt et le workflow de consentement de mise en relation.

Les domaines sources gardent la propriété de leurs objets, états, permissions et données brutes. Veille consomme des projections ou événements versionnés ; il ne met pas à jour directement les tables sources.

## 3. Architecture cible en couches

```text
Domaines producteurs (sources autorisées)
      | événements/projections versionnés
      v
Connecteurs + registre de sources
      v
Ingestion, validation, déduplication
      v
Stockage tampon à rétention courte
      v
Normalisation / classification / géocodage agrégé
      v
Agrégation par fenêtre et zone
      v
Contrôles qualité + anti-réidentification
      v
Détection de tendance / opportunité / IOV
      v
Publication d'agrégats versionnés
      |                         |
      v                         v
API collective             Dashboard opérateur
      |
      v
Dashboard collectif

Surveillance personnelle
      |
      v
API personnelle + règles de transition
      |
      v
Persistance propriétaire / historique
      |
      +---- événements confirmés / notifications opt-in
```

Les pipelines personnels et collectifs doivent être séparés au niveau stockage, accès et finalité. Un écran commun ne doit pas conduire à une base commune sans séparation des politiques.

## 4. Registre des sources

Chaque source doit être décrite par un manifeste versionné :

| Propriété | Description requise |
|---|---|
| source_id / owner_domain | identifiant et domaine propriétaire |
| event/schema version | contrat de payload et compatibilité |
| allowed_purpose | finalité explicitement autorisée |
| fields | allowlist de champs |
| permission model | accès, révocation et filtrage |
| freshness | SLA, timestamp source et TTL |
| deletion semantics | propagation d'un retrait/suppression |
| geographic precision | précision maximale autorisée |
| rate/cost limits | quotas et coût d'ingestion |
| health state | actif, dégradé, suspendu |

Les documents citent Flash, Radar, Mission, Trust et Recommendation comme sources potentielles. Cela n'établit pas que leurs événements existent, sont accessibles ou sont autorisés pour l'agrégation.

## 5. Ingestion et normalisation

Le pipeline doit vérifier l'authenticité et la version du payload, rejeter les champs non autorisés, dédupliquer sur un identifiant d'événement stable, conserver l'horodatage source et l'horodatage d'ingestion, appliquer la fenêtre de fraîcheur, normaliser catégorie/zone vers une taxonomie versionnée, isoler les messages invalides et propager les événements de retrait/suppression.

L'ingestion doit être idempotente et tolérer les événements en retard ou hors ordre. Les données brutes doivent être retenues le moins longtemps possible.

## 6. Agrégation collective

Les agrégations sont calculées sur des groupes compatibles (catégorie, zone généralisée, fenêtre temporelle). Les résultats sont soumis à :
- seuil minimal de contribution ;
- suppression des petits groupes ;
- généralisation géographique et temporelle ;
- limitation des requêtes différentielles permettant d'isoler une personne ;
- contrôle des recoupements entre filtres ;
- limitation de fréquence d'accès ;
- audit des exports et requêtes opérateur.

Les seuils exacts, l'usage éventuel de confidentialité différentielle, le budget de requêtes et la technique de généralisation sont des décisions d'architecture à prendre après analyse de menace. Aucun mécanisme ou seuil numérique n'est revendiqué comme existant.

## 7. Tendances et opportunités latentes

Le moteur de tendance doit comparer des fenêtres homogènes et documenter métrique et unité, fenêtre de référence et fenêtre courante, nombre de sources/observations admissibles, couverture et taux d'échec des sources, seuil de publication, version du calcul et incertitude.

Une opportunité latente exige des signaux de demande et d'offre comparables. Si l'offre n'est pas mesurée, l'absence d'offre ne doit pas être inférée. Une panne de source doit produire un résultat « couverture partielle », pas un déficit d'offre.

## 8. IOV : architecture de calcul à définir

Facteurs candidats historiques : volume demande, disponibilité offre, évolution demande, attente moyenne et concentration géographique. Le calcul doit être spécifié avant implémentation : définition exacte de chaque variable, normalisation et données manquantes, poids ou méthode statistique, fenêtre et saisonnalité, calibration, classes et seuils, version de modèle, explication compréhensible, limites et incertitude.

Ne pas stocker un score opaque sans sa version et ses variables explicatives. Ne pas appeler l'IOV une prédiction garantie.

## 9. API et stockage cibles

Le contrat historique propose GET /veille, GET /veille/{id} et commandes read/save/ignore/report. Ces routes sont non confirmées. L'API future doit séparer routes personnelles filtrées par propriétaire, routes collectives alimentées uniquement par des agrégats publiables, commandes d'intérêt/mise en relation et endpoints opérateur réservés.

Le modèle persistant devra distinguer surveillance personnelle, événements personnels, agrégat collectif versionné, tendance, résultat IOV, réaction utilisateur, manifestation d'intérêt et consentement de mise en relation. Aucun schéma SQL actuel n'est identifié ; ne pas inventer de tables comme si elles existaient.

## 10. Jobs et exploitation

Les tâches potentielles comprennent ingestion, recalcul périodique, expiration, propagation des suppressions, nettoyage, notification et recalcul IOV. Chaque job doit avoir une clé d'idempotence, lease/lock ou mécanisme anti-chevauchement, retry borné et dead-letter, métriques, checkpoint de reprise, version de pipeline et capacité de replay contrôlé.

La fréquence ne peut être fixée sans données de volume, SLA, coût et sensibilité de la source.

## 11. Sécurité et séparation

- RLS/contrôle d'accès strict sur les surveillances personnelles.
- Stockage et accès séparés entre données brutes, personnelles et agrégats.
- Service account à privilèges minimaux pour jobs.
- Aucun endpoint collectif ne doit interroger les tables personnelles en temps réel.
- Les identifiants directs sont retirés avant agrégation/publication.
- Les accès opérateur et exports sont audités.
- Les données de Trust ne sont utilisées que si une finalité et une autorisation précises le permettent.

## 12. Critères d'achèvement technique

Registre des sources approuvé et connecteurs testés ; modèles, migrations, index, RLS et rétention déployés ; pipelines idempotents et observables ; agrégations protégées contre la réidentification ; tendances et IOV versionnés et explicables ; APIs personnelle/collective séparées ; jobs de recalcul/expiration/retrait opérationnels ; tests de sécurité, qualité, charge, reprise et suppression exécutés ; dashboards et notifications conformes aux permissions.
