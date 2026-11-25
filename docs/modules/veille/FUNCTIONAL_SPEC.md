# Veille — spécification fonctionnelle V1

> Référence autonome consolidée à partir de la charte et des trois parties historiques. Les capacités décrites comme cibles ne sont pas réputées opérationnelles sans preuve runtime.

## 1. Finalité et deux espaces

Veille répond à deux besoins distincts :

1. **Veille personnelle :** permettre à un membre de superviser ses propres surveillances, leurs paramètres, leurs états, les événements et les échéances.
2. **Veille collective :** analyser des signaux autorisés, agrégés et anonymisés pour faire ressortir des besoins émergents, des opportunités latentes et des tendances.

La veille personnelle est privée. La veille collective ne donne jamais accès aux personnes ou aux objets individuels à l'origine des agrégats.

## 2. Vocabulaire métier

- **Surveillance personnelle :** configuration persistante appartenant à un membre, avec cible, critères, zone, durée et préférences.
- **Événement de surveillance :** changement confirmé concernant une surveillance ou son résultat.
- **Besoin émergent :** motif de demande récurrent observé dans un ensemble de signaux compatibles.
- **Opportunité latente :** demande agrégée pour laquelle les signaux disponibles suggèrent une offre insuffisante.
- **Tendance :** évolution mesurable d'un besoin ou d'une activité sur une fenêtre temporelle.
- **IOV :** Indice d'Opportunité Vitala, indicateur exploratoire d'aide à la décision.
- **Manifestation d'intérêt :** action par laquelle un membre indique pouvoir répondre à un besoin collectif.
- **Mise en relation :** échange d'identité/contact uniquement après consentement mutuel.

## 3. Acteurs et droits

| Acteur | Droits et limites |
|---|---|
| Propriétaire d'une veille | Lire et gérer ses propres surveillances selon les états autorisés |
| Observateur collectif | Consulter uniquement les agrégats publiables et suffisamment anonymisés |
| Répondant potentiel | Manifester son intérêt pour une tendance sans connaître les demandeurs |
| Demandeur concerné | Accepter, refuser ou ignorer une mise en relation |
| Service de calcul | Ingestion, agrégation et calcul selon des finalités/permissions définies |
| Opérateur | Superviser les jobs et erreurs selon des accès audités ; pas de lecture arbitraire des données privées |

## 4. Parcours personnel

### 4.1 Créer une surveillance

Les parcours historiques proposent trois entrées : prolonger le suivi d'une recherche persistante ; surveiller un Flash que son auteur souhaite suivre ; créer une surveillance depuis l'espace Veille.

L'entrée Radar/Flash est une origine de configuration, pas un transfert de propriété. Une surveillance ne peut être créée ou activée que si la personne confirme les paramètres et les autorisations requises.

La configuration cible comprend : cible/intention, catégorie, zone(s) géographiques, critères et filtres, durée et expiration, préférences de notification, état, dates de création/mise à jour et historique d'événements.

Les exemples de catégories (emploi, immobilier, service, produit, événement), zones (ville, quartier, rayon) et durées (3 jours, semaine, mois, trimestre) sont illustratifs, pas des valeurs runtime garanties.

### 4.2 Consulter le tableau de bord personnel

Le tableau de bord présente uniquement les surveillances du membre connecté. Il distingue les éléments actifs, suspendus, arrivant à échéance, terminés et archivés.

Chaque ligne expose état, cible résumée, échéance, progression réellement mesurée et derniers événements confirmés. Les états sans donnée ne sont pas remplacés par une progression inventée.

### 4.3 Consulter le détail et gérer

Le détail affiche paramètres, historique, résultats, dates et raisons d'état. Les actions prévues sont : modifier les paramètres autorisés, ajuster la zone ou la durée, suspendre, reprendre, arrêter, prolonger et archiver.

Chaque action vérifie le propriétaire, l'état courant, les droits et l'impact sur le traitement sous-jacent. Veille ne change pas la stratégie d'une recherche persistante ni ne modifie une mission source sans commande dédiée et consentement.

### 4.4 Résumé depuis la dernière visite

Le résumé peut signaler des changements confirmés : nouveaux résultats, changement d'état, échéance proche, tendance suivie ayant évolué. Il doit s'appuyer sur un curseur/horodatage de dernière consultation défini, être idempotent et distinguer événements nouveaux, lus et alertes non délivrées.

## 5. Parcours collectif

### 5.1 Signaux admissibles

Les signaux doivent être explicitement autorisés, documentés, datés et compatibles avec la finalité collective. Les sources historiques mentionnent notamment activités/publications et événements de recherche persistante. Leur existence comme source technique ne doit pas être présumée : maintenir un registre de connecteurs réellement actifs.

### 5.2 Détection des besoins émergents

Le traitement regroupe des signaux comparables par catégorie, période et zone suffisamment large. Il recherche répétition, progression ou insatisfaction persistante. Il écarte les signaux invalides, dupliqués, trop anciens ou hors périmètre.

Un besoin émergent n'est publiable que si les seuils de volume et les protections anti-réidentification sont respectés. Les seuils doivent être définis par analyse de risque ; aucune valeur numérique n'est imposée par les documents actuels.

### 5.3 Opportunité latente

Une opportunité latente suggère un écart entre demande agrégée et offre disponible. Elle est présentée comme hypothèse, avec catégorie et zone agrégée, période observée, indicateurs de demande et d'offre, limites de couverture des sources, niveau de qualité, explication et date de calcul.

L'exemple historique de plusieurs personnes cherchant un artisan sans offre disponible illustre le concept, mais n'est pas un seuil de calcul.

### 5.4 Explorer une tendance

La fiche tendance explique catégorie et zone agrégée, évolution dans le temps, volume ou classe de volume si publiable, facteurs principaux, période et fraîcheur, couverture et limites des sources, incertitude.

Aucun détail ne doit permettre de reconstituer la liste des utilisateurs, les missions ou les publications individuelles.

### 5.5 Répondre à un besoin collectif

1. Un membre découvre une tendance publique agrégée.
2. Il choisit explicitement « Je peux répondre à ce besoin ».
3. Veille enregistre son intérêt sans lui révéler les demandeurs.
4. Les demandeurs compatibles reçoivent une sollicitation neutre, sans identité du répondant.
5. Chaque demandeur peut accepter, refuser ou ignorer.
6. Le répondant confirme son intérêt si nécessaire.
7. La mise en relation n'est créée que lorsque les consentements requis sont mutuels.
8. Les identités et coordonnées ne sont partagées qu'au périmètre accepté.

Le processus prévoit retrait du consentement, expiration d'une invitation et limitation anti-spam.

## 6. IOV — Indice d'Opportunité Vitala

Les facteurs historiques proposés sont le volume de la demande, la disponibilité de l'offre, l'évolution de la demande, la durée moyenne d'attente et la concentration géographique.

Les classes historiques sont Faible, Modéré, Fort et Prioritaire. La formule, normalisation, poids, seuils, fenêtre d'observation, gestion des données manquantes et méthode de calibration ne sont pas définis. Il est interdit de produire un chiffre ou une classe tant qu'une spécification mathématique versionnée n'a pas été approuvée.

Chaque IOV publié affiche une explication, une période, une couverture de données et une mention indiquant qu'il ne garantit ni marché ni résultat.

## 7. Notifications

Les cas d'usage historiques : évolution importante d'une surveillance ; résultat compatible confirmé ; échéance proche ; tendance suivie devenue significative ; réponse potentielle à un besoin collectif.

Les préférences de canal, consentements, seuils, heures silencieuses, quotas et politique de regroupement doivent être explicitement définis. Une notification n'est envoyée qu'après persistance de l'événement source ; elle doit être idempotente et ouvrir son contexte.

## 8. États fonctionnels proposés

Les états historiques de surveillance sont : préparation, active, attente de résultats, suspendue, arrivée à échéance, terminée, archivée. Il faut établir une machine canonique et des transitions explicites avant d'implémenter l'API.

Les états de calcul collectif sont distincts : collecte, agrégation, contrôle qualité, publiable, rejeté, expiré. Une tendance publiée peut évoluer sans écraser son historique de calcul.

## 9. Confidentialité et invariants

- Un membre ne lit que ses propres surveillances personnelles.
- Les données collectives sont agrégées et anonymisées avant exposition.
- Aucun identifiant de membre, mission individuelle ou publication privée n'est publié.
- Les agrégats trop rares ou localisés sont supprimés/généralisés.
- L'absence de signal ne prouve pas l'absence de demande.
- Une tendance est une observation, pas une prédiction.
- Toute mise en relation exige un consentement mutuel.
- Veille ne modifie jamais un objet métier source.
- Les données sources restent sous contrôle de leur domaine propriétaire ; Veille ne garde que les projections minimales nécessaires.

## 10. Hors périmètre/non démontré

Aucun pipeline runtime de collecte/agrégation/anonymisation, job planifié, dashboard, endpoint, table Veille, IOV calculé, notification proactive ou mécanisme de mise en relation n'a été identifié dans l'arborescence examinée. Les parcours décrivent la cible produit, pas une capacité active.

## 11. Critères d'acceptation

- Isolation propriétaire testée pour chaque opération personnelle.
- Actions suspendre/reprendre/arrêter/prolonger/archiver soumises à la machine d'état.
- Sources et couverture visibles dans les résultats collectifs.
- Déduplication, fraîcheur, seuils et contrôles anti-réidentification testés.
- Résultats agrégés reproductibles à version de pipeline égale.
- IOV explicable et calculé seulement selon une formule versionnée.
- Aucun lien vers une identité source sans consentement mutuel.
- Notifications opt-in, idempotentes et plafonnées.
- Effacement et conservation documentés.
