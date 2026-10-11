# Niveaux de confiance Vitala

**Statut :** définition produit consolidée ; alignement opérationnel à confirmer.  
**Principe :** la confiance porte sur la fiabilité démontrée dans l'écosystème, pas sur la valeur d'une personne ni sa popularité.

## Responsabilités

Le niveau affiché est une représentation compréhensible des informations de confiance produites par le domaine Trust. Il ne doit pas être calculé ou modifié directement par l'interface, le profil ou un autre domaine. Voir [Domaine Trust](../02-architecture/trust-domain.md).

La définition métier historique contient six étapes. Le modèle actuellement présent dans la base ne les représente pas toutes directement : `udi.level` accepte `guest`, `identified`, `verified` et `trusted`. Les six étapes ci-dessous sont donc une cible fonctionnelle documentaire, pas une correspondance exacte avec l'énumération actuellement implémentée.

## Progression fonctionnelle historique

| Niveau métier | Sens | Éléments historiques | État de validation |
| --- | --- | --- | --- |
| Consultant | Visiteur non engagé | Découverte et consultation des contenus publics | Le concept existe dans la documentation ; correspondance avec `guest` à confirmer au niveau des parcours |
| Membre enregistré | Compte créé | Prénom et téléphone ou courriel selon la source historique | Pas de valeur dédiée dans `udi.level` ; ne pas assimiler automatiquement à un niveau de base de données |
| Identifié | Informations minimales validées | Nom, prénom, téléphone vérifié et ville principale selon la source historique | Valeur `identified` présente dans la contrainte SQL ; critères métier exacts à vérifier |
| Vérifié | Identité contrôlée à partir d'une preuve reconnue | Document officiel ou méthode approuvée | Valeur `verified` présente ; procédure réelle de vérification à auditer |
| Confirmé | Fiabilité démontrée par des résultats réels | La source historique propose cinq actions et deux recommandations validées, sans incident majeur | Pas de valeur dédiée dans `udi.level` ; seuils historiques non confirmés comme règle active |
| Pro | Activité professionnelle ou organisationnelle reconnue | Preuve d'activité professionnelle lorsque nécessaire | Pas de valeur dédiée dans `udi.level` ; ne pas confondre avec un simple persona Professionnel |

Les seuils, quotas et avantages mentionnés dans les sources historiques sont des propositions à valider. Ils ne doivent pas être appliqués comme règles de production sans confirmation dans les contrats, politiques et tests actuels.

## Statuts complémentaires

La source historique cite « Référencé », « Recommandé », « Actif » et « Fiable ». Ces libellés sont des preuves ou des états complémentaires potentiels, pas des niveaux équivalents. Leur définition, leur durée de validité, leur visibilité et leurs critères d'attribution doivent être spécifiés avant implémentation.

## Preuves et événements

Les informations pertinentes peuvent inclure des vérifications, des collaborations terminées, des recommandations validées ou des signalements confirmés. Une activité ou une recommandation ne doit pas augmenter automatiquement la confiance sans validation et contrôles anti-abus.

- La confiance ne s'achète pas et ne se déduit pas du nombre de relations.
- Une preuve doit avoir une origine, une date, un contexte et un statut de validation.
- Les incidents ne doivent influencer le niveau qu'après le processus de confirmation prévu.
- Une erreur doit pouvoir être contestée ou corrigée avec une trace d'audit.
- Les données sensibles de sécurité et de modération ne sont pas des informations publiques.

## Visibilité

La documentation historique distingue les détails privés, les indicateurs publics et les informations accessibles aux services autorisés. La liste exacte des champs exposés doit être définie par les contrats API, les règles de confidentialité et les contrôles d'accès.

La source historique recommande de ne pas exposer un score numérique aux autres utilisateurs. Le code contient actuellement un champ `profiles.trust_score` borné entre 0 et 100 ; son affichage et ses règles de lecture doivent être vérifiés avant de conclure qu'il est strictement interne.

## Correspondance technique actuelle

À la date de cette consolidation, la migration `20260912000000_protect_identity_trust_system_fields.sql` définit :

- `udi.level` parmi `guest`, `identified`, `verified`, `trusted` ;
- `profiles.trust_score` dans l'intervalle 0–100 ;
- des protections empêchant les utilisateurs authentifiés de modifier directement certains champs système.

Cette structure ne suffit pas à démontrer l'existence du Trust Engine complet décrit dans les documents historiques : historique d'événements, preuves, pondérations, vieillissement, contestation et projection Trust View doivent être vérifiés séparément.

## Principes de conception

1. Expliquer ce que chaque niveau signifie et quelles preuves le justifient.
2. Distinguer l'identité vérifiée de la fiabilité démontrée dans les interactions.
3. Ne pas faire du niveau de confiance une note morale ou un classement social.
4. Appliquer des règles cohérentes, proportionnées et auditables.
5. Ne pas révéler les détails qui faciliteraient la fraude ou exposeraient des personnes.
6. Ne présenter comme active aucune règle qui n'est pas confirmée dans le code, les politiques et les tests.

## Sources historiques

Les documents historiques sur les niveaux et leurs mises à jour restent conservés. Cette consolidation ne les supprime ni ne les déplace ; leur retrait éventuel nécessite une validation et une autorisation distinctes.
