# Modèle d'identité numérique unifiée (UDI)

**Statut :** consolidation documentaire du modèle cible ; couverture fonctionnelle à vérifier dans le code.  
**Rôle :** fournir une représentation cohérente de l'identité numérique sans devenir propriétaire de toutes les données métier affichées.

## 1. Principe

L'Unified Digital Identity (UDI) est une représentation unifiée de l'utilisateur. Elle agrège des informations ou vues produites par les domaines responsables. Elle ne doit pas recalculer la confiance, les recommandations, l'activité, les résultats Radar ou les statistiques.

Le terme « source de vérité » doit être utilisé avec précision : le domaine Identity est propriétaire des champs d'identité qu'il gère ; chaque domaine métier reste propriétaire de ses données et produit ses propres vues. L'UDI est le point d'agrégation de la représentation, pas la source de vérité universelle de chaque donnée.

## 2. Modules envisagés

Les documents historiques décrivent les vues et modules suivants. Leur présence dans cette liste ne garantit pas qu'ils sont tous implémentés.

| Module / vue | Responsabilité attendue | Domaine propriétaire |
| --- | --- | --- |
| Identity | Identifiants et informations d'identité autorisées | Identity / Profile |
| Capabilities | Compétences, expériences et certifications | Domaine responsable des compétences |
| Context | Localisation, disponibilité et contexte utile | Domaine responsable de chaque attribut |
| Intentions | Objectifs et besoins actuels | Domaine produit concerné |
| Preferences | Préférences de personnalisation | Paramètres / préférences |
| Privacy | Préférences et règles de visibilité | Domaine de confidentialité et politiques de sécurité |
| Activity View | Synthèse d'activité | Domaines qui produisent les activités |
| Trust View | Vue publique ou personnelle de la confiance | Trust |
| Recommendation View | Recommandations autorisées | Recommendation |
| Radar View | Informations de recherche autorisées | Radar |
| Veille View | Informations de veille autorisées | Veille |
| Statistics | Indicateurs agrégés | Domaine producteur des statistiques |

Chaque module doit déclarer ses champs, son propriétaire, ses règles de visibilité, son contrat de lecture et ses modalités de mise à jour. Une vue agrégée ne doit pas dupliquer une source éditable indépendante.

## 3. Contrat de responsabilité

- L'UDI assemble et expose une représentation cohérente.
- Les domaines métier valident et modifient leurs propres données.
- Trust est le seul domaine autorisé à produire le Trust Score, le niveau de confiance et les preuves Trust.
- L'interface affiche les vues et envoie les modifications aux domaines autorisés ; elle ne calcule pas les données métier.
- Les champs privés, les preuves sensibles et les informations d'autres utilisateurs sont filtrés selon les autorisations.

Les endpoints `/me`, `/me/identity` et les vues évoquées dans la documentation API historique doivent être traités comme des contrats proposés tant que leur implémentation n'est pas confirmée.

## 4. État observé dans le dépôt

La migration `src/supabase/migrations/20260912000000_protect_identity_trust_system_fields.sql` montre que la table `public.udi` possède au minimum un champ `level` avec les valeurs `guest`, `identified`, `verified` et `trusted`, et que les utilisateurs authentifiés ont un accès de lecture soumis à la politique RLS définie. La table `profiles` possède un champ `trust_score` distinct, borné entre 0 et 100.

Ces faits montrent que les données actuelles ne sont pas encore équivalentes au modèle documentaire complet de l'UDI. Il faut examiner le schéma complet, les repositories, les contrats API, les règles de synchronisation et les composants avant d'affirmer que les vues ou modules sont disponibles.

## 5. Gouvernance et sécurité

1. Un seul domaine est propriétaire de chaque donnée métier.
2. Les données dérivées sont des projections explicites, non des copies éditables.
3. Toute modification est autorisée par le domaine propriétaire et validée côté serveur.
4. Les règles RLS, les droits de colonne et les contrats API doivent empêcher les clients de modifier des champs système.
5. Les vues publiques n'exposent que les informations nécessaires et autorisées.
6. L'agrégation ne contourne jamais les politiques de confidentialité des domaines sources.

## 6. Sources historiques

Cette consolidation reprend le modèle UDI et les responsabilités décrites dans les documents historiques de modèle de domaine et d'API. Ces sources restent conservées pour traçabilité ; cette référence n'autorise ni leur suppression ni une migration destructive.
