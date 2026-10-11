# Reprise après incident et continuité d'activité

**Statut :** cadre opérationnel canonique à compléter et à valider par les responsables de l'exploitation.  
**Limite de preuve :** ce document définit les contrôles attendus ; il ne prouve pas que des sauvegardes existent, qu'une restauration a réussi, ni que des objectifs RTO/RPO ont été approuvés ou atteints.

## 1. Objectif et périmètre

Préparer une reprise maîtrisée après une panne d'infrastructure, une indisponibilité de la base, une corruption ou suppression de données, un déploiement défectueux, une panne réseau ou un incident de sécurité. Le plan couvre l'application, PostgreSQL/Supabase, les fichiers et ressources persistantes, les configurations nécessaires à la reprise et les services tiers indispensables.

La priorité est de préserver les données, de rétablir les parcours critiques et d'éviter une reprise qui réintroduirait la cause de l'incident.

## 2. Principes de décision

- Nommer un responsable de l'incident et consigner la chronologie, les décisions et les personnes autorisées à intervenir.
- Délimiter l'environnement touché et préserver les éléments utiles à l'analyse avant toute action destructive.
- Ne jamais traiter la présence d'une configuration de sauvegarde comme une preuve de sauvegarde exploitable.
- Ne pas lancer de restauration ou de migration destructive en production comme simple diagnostic.
- Réutiliser un commit et un artefact identifiés ; éviter les changements non contrôlés pendant la reprise.
- Vérifier l'intégrité, les autorisations et les parcours critiques avant de déclarer le service rétabli.

## 3. Scénarios et première réponse

| Scénario | Première réponse | Preuve nécessaire avant rétablissement |
| --- | --- | --- |
| Application ou VPS indisponible | Confirmer l'étendue, examiner les journaux et l'état de l'hébergement, puis appliquer la procédure de redéploiement approuvée. | Version/commit identifié, health checks disponibles et parcours critiques vérifiés. |
| PostgreSQL/Supabase indisponible | Confirmer l'état du fournisseur et éviter les opérations d'écriture répétées qui aggraveraient la situation. | Connectivité rétablie, intégrité vérifiée et tests d'accès/RLS pertinents réussis. |
| Corruption ou suppression de données | Suspendre les opérations risquant d'écraser les preuves ou d'aggraver les pertes ; identifier un point de restauration connu. | Restauration testée, pertes mesurées, cohérence des données et accès vérifiés. |
| Déploiement défectueux | Évaluer le rollback applicatif et la compatibilité des migrations ; ne pas supposer qu'un rollback du code annule une migration. | Version précédente compatible, état du schéma connu et parcours de contrôle réussis. |
| Compromission d'un compte ou d'un secret | Suivre la procédure de sécurité, limiter l'accès affecté et faire tourner les identifiants selon le processus approuvé. | Accès compromis révoqué, nouveaux secrets validés hors des logs et vérification de sécurité terminée. |
| Panne réseau ou fournisseur tiers | Déterminer si un mode dégradé sûr est possible et communiquer les limites connues. | Dépendances critiques disponibles ou mode dégradé explicitement accepté. |

Ce tableau est un cadre de triage, pas une procédure fournisseur spécifique. Les commandes et étapes exactes doivent être validées pour l'infrastructure réellement utilisée.

## 4. Objectifs RTO et RPO

Pour chaque service critique, le responsable métier et l'exploitation doivent approuver :

- **RTO (Recovery Time Objective)** : durée maximale acceptable avant rétablissement ;
- **RPO (Recovery Point Objective)** : quantité maximale de données que l'organisation accepte de perdre, exprimée en durée ou en point de restauration.

Aucune valeur RTO/RPO n'est considérée comme approuvée tant qu'elle n'est pas renseignée, acceptée par les responsables et testée. Le tableau suivant est à compléter :

| Service ou donnée | RTO approuvé | RPO approuvé | Point de restauration / source | Responsable | Dernier test de restauration |
| --- | --- | --- | --- | --- | --- |
| PostgreSQL / données utilisateur | À définir | À définir | À confirmer | À désigner | Non attesté ici |
| Application et artefacts de release | À définir | Sans objet ou à définir | Commit et artefact approuvés | À désigner | Non attesté ici |
| Fichiers persistants et configuration non secrète | À définir | À définir | À confirmer | À désigner | Non attesté ici |
| Secrets et accès opérationnels | À définir | À définir | Coffre ou mécanisme approuvé à confirmer | À désigner | Non attesté ici |

Ne jamais enregistrer de valeurs de secrets, jetons ou clés dans ce document ou dans les preuves de reprise.

## 5. Sauvegardes et restaurations

Pour chaque source de données, documenter et vérifier :

1. le mécanisme de sauvegarde réel, sa fréquence et sa rétention ;
2. le périmètre couvert et les exclusions connues ;
3. le contrôle d'accès, le chiffrement et la séparation des sauvegardes par rapport au système source ;
4. la surveillance des échecs et la personne qui les reçoit ;
5. le point de restauration sélectionné et sa date ;
6. la procédure de restauration vers un environnement isolé ;
7. les contrôles d'intégrité, de cohérence applicative, de grants et de RLS ;
8. la durée mesurée et les écarts par rapport au RTO/RPO approuvé.

Une sauvegarde n'est considérée comme validée qu'après un test de restauration documenté. Un résultat CI, un fichier de configuration ou une capture d'écran isolée ne remplace pas cette preuve.

## 6. Migrations et état de la base

Avant toute reprise impliquant PostgreSQL :

- identifier la base et l'environnement ciblés ;
- vérifier les migrations réellement appliquées et l'état du schéma, des grants et des politiques RLS ;
- comparer l'état cible aux migrations versionnées et à la version applicative à restaurer ;
- vérifier la compatibilité avant un rollback applicatif ;
- consigner les décisions et obtenir l'autorisation requise pour toute modification de schéma.

**Barrière connue :** [TECH-001](./technical-issues.md#tech-001--divergence-des-sources-de-migration-postgresql) reste ouvert. Les artefacts hors du chemin standard et leur application distante ne sont pas prouvés par le dépôt. Ne pas les déplacer, convertir, exécuter ou supprimer dans le cadre de la reprise sans revue et autorisation explicites. Si le scénario dépend d'un schéma non vérifié, maintenir le **NO-GO** jusqu'à réconciliation autorisée.

Les autres entrées TECH-002 à TECH-006 restent à évaluer selon l'impact de l'incident, en particulier l'idempotence et la synchronisation.

## 7. Procédure de reprise

1. **Détecter et qualifier** : enregistrer heure, symptômes, périmètre, impacts connus et niveau de gravité.
2. **Stabiliser** : limiter les changements, protéger les données et appliquer les mesures de confinement appropriées.
3. **Choisir une stratégie** : retour à la version précédente, restauration de données ou bascule vers une capacité de secours, selon les preuves disponibles.
4. **Autoriser** : faire approuver l'action, les risques de perte et le point de restauration par les responsables désignés.
5. **Exécuter** : suivre une procédure versionnée, en consignant les commandes opérationnelles sans y inclure de secrets.
6. **Vérifier** : contrôler intégrité, schéma, accès/RLS, routes de santé réellement disponibles, synchronisation et parcours critiques.
7. **Rétablir progressivement** : surveiller erreurs, latence, files hors ligne et mises en quarantaine ; conserver la possibilité de retour arrière.
8. **Clôturer** : communiquer l'état, les limites, les pertes éventuelles, les actions restantes et le responsable du suivi.

## 8. Tests et exercices

Prévoir des exercices périodiques et après toute évolution importante de l'infrastructure. Tester au minimum la restauration d'une sauvegarde PostgreSQL vers un environnement isolé, le redéploiement d'un artefact connu et l'accès avec les permissions attendues.

Pour chaque exercice, consigner le scénario, l'environnement, le commit ou point de restauration, l'heure de début et de fin, les vérifications, les pertes observées, les résultats RTO/RPO, les écarts et les actions correctives. Ne jamais effectuer un exercice destructif sur la production sans plan formel et autorisation.

## 9. Communication et revue post-incident

La communication doit préciser les services touchés, les effets connus sur les données, les mesures de contournement, l'heure de la prochaine mise à jour et le responsable du message. Ne pas divulguer de données personnelles, de secrets ou de détails qui augmenteraient le risque de sécurité.

Après l'incident, réaliser une revue sans blâme qui couvre la cause, l'impact, la durée, la qualité des alertes, la capacité de restauration, les décisions prises et les actions préventives. Attribuer un responsable et une échéance à chaque action.

## 10. Critères de rétablissement

Ne déclarer le service rétabli que lorsque les critères applicables sont vérifiés :

- le système et la version exécutée sont identifiés ;
- l'intégrité des données et la cohérence du schéma sont contrôlées ;
- les permissions et politiques RLS pertinentes sont validées ;
- les parcours critiques fonctionnent et les erreurs sont sous surveillance ;
- les risques résiduels, pertes de données et fonctionnalités dégradées sont documentés ;
- le responsable autorisé accepte le rétablissement ;
- une revue post-incident et les actions de suivi sont planifiées.

## Référence historique

Le document historique [Plan de reprise d'activité — Annexe G](../ANNEXE%20G%20%E2%80%94%20Plan%20de%20reprise%20d'activit%C3%A9%20(Disaster%20Recovery%20%26%20Business%20Continuity).md) est conservé pour la traçabilité. Cette référence canonique précise les preuves opérationnelles attendues ; elle ne certifie pas que les sauvegardes, restaurations, responsables ou objectifs RTO/RPO sont déjà configurés et validés.
