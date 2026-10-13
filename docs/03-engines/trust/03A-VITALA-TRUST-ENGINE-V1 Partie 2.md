# 03A-VITALA-TRUST-ENGINE-V1.md

## Partie 2 — Fonctionnement du Trust Engine

# 10. Principe général

Le Trust Engine ne modifie jamais directement le Capital de Confiance. Chaque évolution provient d'un ou plusieurs **événements de confiance** validés. Ces événements sont enregistrés dans un historique permanent et servent à recalculer l'état actuel du Capital de Confiance.

# 11. Les événements de confiance

Un événement de confiance représente une action, une validation ou une situation ayant un impact sur la fiabilité d'un utilisateur. Chaque événement possède :

- une origine;
- une catégorie;
- une date;
- un poids relatif;
- une justification;
- un état (actif, annulé, expiré);
- une référence vers l'objet métier concerné lorsque cela est applicable.
# 12. Les familles d'événements

Les événements sont regroupés en grandes familles.

## 12.1 Vérification d'identité

Exemples :

- identité validée;
- document vérifié;
- informations mises à jour.
Ces événements renforcent la crédibilité de l'utilisateur.

## 12.2 Activité

Exemples :

- publication d'un Flash;
- création d'une Veille;
- lancement d'un Radar;
- participation à une mission.
Ils valorisent l'engagement dans la plateforme.

## 12.3 Réussite

Exemples :

- mission terminée avec succès;
- collaboration confirmée;
- recommandation validée.
Ils renforcent fortement le Capital de Confiance.

## 12.4 Qualité des interactions

Exemples :

- retours positifs;
- réponses utiles;
- comportements collaboratifs.
Ils reflètent la qualité des échanges.

## 12.5 Signalements

Exemples :

- signalement confirmé;
- fraude avérée;
- non-respect des règles.
Ces événements diminuent le Capital de Confiance.

## 12.6 Ancienneté et régularité

Le Trust Engine valorise également :

- la présence durable;
- l'activité régulière;
- la stabilité dans le temps.
# 13. Pondération

Tous les événements n'ont pas le même impact. Leur poids dépend :

- de leur nature;
- de leur fiabilité;
- de leur gravité;
- de leur ancienneté;
- du contexte.
Le Trust Engine applique des règles de pondération afin d'obtenir une évaluation équilibrée. Les valeurs numériques exactes ne sont pas figées dans ce document afin de permettre leur ajustement sans modifier la philosophie du moteur.

# 14. Vieillissement des événements

Le Trust Capital évolue dans le temps. Certains événements peuvent perdre progressivement de leur influence. Exemples :

- une activité ancienne;
- une compétence non utilisée depuis longtemps;
- une identité nécessitant une nouvelle vérification.
À l'inverse, certains événements conservent leur importance durablement, comme une fraude confirmée ou une vérification officielle.

# 15. Trust History

Chaque évolution est enregistrée dans un historique permanent.

Cet historique contient notamment :

- la date;
- l'origine;
- la catégorie;
- la justification;
- l'impact relatif;
- l'état de l'événement.
Le Trust History garantit :

- la transparence;
- la traçabilité;
- les audits;
- les corrections éventuelles.
# 16. Réversibilité

Un événement peut être annulé lorsqu'une erreur est détectée. Dans ce cas :

- l'événement initial est conservé;
- un événement correctif est ajouté;
- le Capital de Confiance est recalculé.
Aucune modification n'efface l'historique.

# 17. Visibilité

Le Trust Engine applique trois niveaux de visibilité.

## Privée

Le propriétaire accède à l'ensemble de son historique.

## Publique

Les autres utilisateurs voient uniquement :

- le niveau actuel;
- la tendance générale;
- les badges ou certifications publiques.
Les détails des événements restent confidentiels.

## Système

Les services autorisés disposent des informations nécessaires à la sécurité, à la modération et aux audits.

# 18. Interaction avec les moteurs

Le Trust Engine alimente :

- Flash;
- Scan;
- Radar;
- Veille;
- Recommendation;
- Sélection des candidats.
Ces moteurs utilisent le Capital de Confiance pour améliorer leurs décisions, sans jamais le modifier directement.

# 19. Objectifs du fonctionnement

Le fonctionnement du Trust Engine vise à :

- encourager les comportements positifs;
- limiter les abus;
- renforcer la qualité des interactions;
- garantir des décisions cohérentes;
- préserver la confiance dans l'écosystème.
# 20. Conclusion de la Partie 2

Le Trust Engine repose sur un historique d'événements, une pondération contextuelle et une transparence maîtrisée. Cette approche garantit une évaluation évolutive, explicable et robuste de la fiabilité des interactions, tout en protégeant les utilisateurs contre les jugements arbitraires et les manipulations.