# Veille — pipeline de données, agrégation et confidentialité

## 1. Principes non négociables

La valeur de Veille collective dépend de la confiance : un résultat utile ne justifie pas d'exposer une personne. La suppression d'un nom ne suffit pas à anonymiser un signal. La combinaison d'une zone précise, d'une période courte, d'une catégorie rare et d'un événement singulier peut réidentifier une personne.

La confidentialité doit être intégrée à l'ingestion, au stockage, au calcul, à l'API et à l'exploitation.

## 2. Classes de données

| Classe | Exemple | Traitement |
|---|---|---|
| Donnée source brute | publication, événement de recherche, mission | reste sous contrôle du domaine source ; accès strict |
| Projection autorisée | catégorie, timestamp arrondi, zone généralisée | allowlist et TTL ; pas de payload complet |
| Signal normalisé | catégorie canonique, période, zone adaptée | pseudonymisé si nécessaire, accès pipeline |
| Agrégat interne | compte par groupe, métriques de demande/offre | seuils, contrôles de recoupement |
| Agrégat publiable | tendance par catégorie/zone large | anonymisé, validé et versionné |
| Donnée personnelle de surveillance | paramètres et historique d'un membre | isolée par propriétaire, jamais vers le collectif en direct |

La pseudonymisation n'est pas l'anonymisation. Les clés de rapprochement doivent être séparées, protégées et supprimées dès qu'elles ne sont plus nécessaires.

## 3. Cycle de vie d'un signal

1. **Autorisation :** vérifier que le domaine source permet l'usage de ce signal pour la veille collective.
2. **Minimisation :** n'extraire que les champs requis.
3. **Validation :** vérifier format, schéma, timestamp, catégorie et zone.
4. **Déduplication :** éviter de compter plusieurs fois le même événement.
5. **Fraîcheur :** rejeter ou déclasser les signaux au-delà du TTL.
6. **Normalisation :** convertir les catégories et zones vers une taxonomie versionnée.
7. **Agrégation :** compter par groupe et fenêtre compatibles.
8. **Protection :** appliquer suppression des petits groupes, généralisation et contrôle de requêtes différentielles.
9. **Publication :** exposer seulement les agrégats validés.
10. **Expiration/suppression :** propager les retraits et purger les données selon la politique.

## 4. Anti-réidentification

Mesures à définir et tester :

- **Seuil minimal de groupe :** ne jamais publier un agrégat reposant sur trop peu de contributeurs indépendants.
- **Généralisation géographique :** augmenter la taille de zone lorsque la densité est faible.
- **Fenêtres temporelles :** éviter les périodes si courtes qu'elles révèlent un événement individuel.
- **Suppression complémentaire :** empêcher de déduire une valeur supprimée par soustraction entre totaux.
- **Contrôle de requêtes :** limiter les filtres, exports et requêtes répétées permettant des différences ciblées.
- **Résistance aux valeurs extrêmes :** ne pas laisser une seule contribution dominer l'agrégat.
- **Revue des catégories rares :** regrouper ou supprimer les catégories trop spécifiques.
- **Contrôle opérateur :** accès, export et exploration sont audités.

Aucun seuil numérique ne doit être choisi arbitrairement. Le choix dépend de la densité, du risque de réidentification, de la sensibilité et des usages. La confidentialité différentielle peut être étudiée, mais elle ne doit pas être revendiquée sans budget de confidentialité, mécanisme et tests formels.

## 5. Demande, offre et opportunité latente

Une mesure de demande doit préciser ce qui est compté : recherches uniques, besoins publiés, surveillances actives ou événements. Éviter de compter plusieurs événements d'une même personne comme plusieurs demandeurs indépendants.

Une mesure d'offre doit avoir une source explicite et une définition de disponibilité. Si une source d'offre est absente, partielle ou en panne, ne pas interpréter son silence comme une offre nulle.

Une opportunité latente doit publier définition de demande et d'offre, période observée, zone généralisée, nombre ou classe de contributeurs admissibles, couverture des sources, fraîcheur, limites et incertitude, version du calcul.

## 6. Tendances temporelles

Comparer des fenêtres de même durée et de même méthode. Documenter saisonnalité, changements de collecte, nouveaux connecteurs, couverture incomplète et événements exceptionnels. Une variation de volume due à un connecteur nouvellement activé ne doit pas être interprétée comme une variation réelle de demande.

Chaque tendance garde ses snapshots versionnés pour audit et reproduction, sans conserver les identifiants source plus longtemps que nécessaire.

## 7. IOV

Les facteurs candidats sont volume de demande, disponibilité de l'offre, évolution, attente et concentration géographique. Avant calcul : définir chaque variable et sa source ; déterminer l'unité et la fenêtre ; traiter les valeurs manquantes ; normaliser les distributions ; définir les poids ou modèle ; calibrer les classes Faible/Modéré/Fort/Prioritaire ; tester sensibilité et stabilité ; publier l'incertitude et les limites.

Ne pas calculer l'IOV lorsque la couverture minimale n'est pas atteinte. Le score ne doit pas masquer une donnée source absente ou une forte incertitude.

## 8. Suppression et droits

La suppression d'un signal source doit déclencher une politique documentée : retrait des résultats individuels, recalcul des agrégats concernés lorsque nécessaire et possible, purge des identifiants de liaison, conservation minimale des preuves d'audit. Les agrégats déjà publiés doivent être évalués selon leur risque de réidentification et la politique applicable.

Les archives personnelles suivent les droits du propriétaire et une durée de conservation explicite. La suppression d'une surveillance personnelle ne doit pas supprimer des données sources appartenant à un autre domaine.

## 9. Menaces à tester

- groupe composé d'une seule personne ;
- utilisateur isolé dans une petite zone ;
- filtre successif par catégorie, zone et période ;
- soustraction entre deux requêtes d'agrégats proches ;
- événement source unique et reconnaissable ;
- corrélation avec une publication publique externe ;
- opérateur exportant un grand nombre de résultats ;
- réutilisation d'un identifiant pseudonyme entre domaines ;
- source qui change de définition ou de couverture ;
- suppression non propagée.

## 10. Registre de décision

Avant mise en production, faire approuver les seuils, niveaux de généralisation, fenêtres, règles de rétention, mécanismes de protection, finalités des sources et responsabilités d'accès. Les choix doivent être versionnés, documentés et réévalués périodiquement.
