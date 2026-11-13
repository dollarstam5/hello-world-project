# Évolution du Domain Model : Unified Digital Identity (UDI)

## 1. Principe fondamental

La **Unified Digital Identity (UDI)** est la représentation métier unifiée de l'identité numérique d'un utilisateur dans l'écosystème Vitalis. Elle constitue un point de référence cohérent pour présenter les informations issues des domaines métier.

L'UDI n'est pas une permission générale de consulter toutes les données de l'utilisateur. La visibilité dépend des règles de confidentialité, du contexte et des autorisations propres au moteur qui demande ou présente une information.

## 2. Rôle de l'UDI

L'UDI agrège et expose des représentations des informations produites par les différents domaines. Elle ne calcule pas les données métier et ne devient pas propriétaire des données des autres domaines.

Chaque domaine reste propriétaire de ses données et de ses règles métier. L'UDI ne duplique pas ces données ; elle fournit une représentation cohérente et contrôlée.

## 3. Structure de l'UDI

### Identity

Informations d'identité :
- identifiant ;
- nom ;
- photo ;
- langue ;
- pays ;
- vérifications ;
- statut du compte.

### Capabilities

Capacités de la personne :
- compétences ;
- domaines d'expertise ;
- expériences ;
- certifications ;
- centres d'intérêt.

### Context

Contexte actuel :
- localisation ;
- disponibilité ;
- mobilité ;
- fuseau horaire.

Les données précises ne sont exposées que lorsque le contexte et les autorisations le permettent.

### Intentions

Objectifs dynamiques de l'utilisateur, par exemple :
- rechercher une opportunité ;
- proposer une opportunité ;
- développer son réseau ;
- trouver des partenaires ;
- recruter ;
- rechercher des investisseurs.

Les intentions peuvent évoluer au fil du temps et restent sous la responsabilité du domaine propriétaire.

### Preferences

Paramètres et préférences utilisés par les moteurs, notamment :
- préférences Radar ;
- préférences Veille ;
- préférences Recommendation ;
- paramètres de personnalisation.

Chaque moteur conserve ses propres réglages. L'agrégation UDI ne fusionne pas les autorisations de visibilité entre moteurs.

### Privacy

Représente les règles de visibilité, consentements et préférences de confidentialité définis par l'utilisateur et la plateforme. Les projections exposées dépendent du moteur, de la publication et du contexte. Voir [la politique de visibilité par moteur](../03-engines/visibility-and-profile-policy.md).

### Activity View

Vue agrégée de l'activité de l'utilisateur :
- Flash publiés ;
- réponses ;
- missions ;
- interactions ;
- historique.

Cette vue est alimentée par les domaines responsables et filtrée selon les droits d'accès.

### Trust View

Vue produite par le Trust Engine, pouvant exposer :
- Trust Score ;
- niveau de confiance ;
- historique du Trust ;
- preuves de confiance autorisées.

Le calcul et la gouvernance du Trust restent entièrement sous la responsabilité du domaine Trust.

### Recommendation View

Présente les recommandations générées par le Recommendation Engine, selon les droits applicables.

### Radar View

Présente les informations issues du moteur Radar sans devenir propriétaire de ses missions, critères ou résultats.

### Veille View

Présente les informations produites par Veille sans accéder aux missions personnelles d'autres utilisateurs ni contourner les règles d'anonymisation des signaux collectifs.

### Statistics

Expose des indicateurs agrégés concernant l'activité et l'utilisation de la plateforme, calculés par les domaines responsables.

## 4. Gouvernance et propriété des données

Chaque donnée appartient à un seul domaine métier. Les autres domaines ne doivent jamais dupliquer cette donnée ni la modifier directement. Ils la consultent ou en présentent une vue via des contrats métier ou des vues adaptées.

Ce principe garantit :
- la cohérence des informations ;
- l'absence de duplication ;
- la facilité d'évolution ;
- la maintenabilité de la plateforme.

## 5. Projections du profil selon le moteur

L'UDI peut fournir plusieurs projections du profil. Une projection est un sous-ensemble de champs autorisés pour un usage précis ; elle ne constitue pas un accès implicite à l'identité complète.

- Chaque moteur définit les informations dont il a besoin et les champs qu'il peut exposer.
- Les autorisations d'un moteur ne sont jamais héritées automatiquement par un autre.
- Les paramètres d'une publication ou d'une action s'appliquent à leur propre contexte lorsqu'ils sont prévus.
- L'accès au profil complet exige une autorisation explicite et propre au moteur.
- Les champs non autorisés ne doivent pas être transmis dans les réponses API, même s'ils sont masqués dans l'interface.
- Les règles doivent être appliquées côté serveur et testées pour les utilisateurs authentifiés, les invités et les accès hors périmètre.

L'UDI fournit les données autorisées ; le domaine consommateur reste responsable de la décision métier et de l'application de son contrat d'accès.

## 6. Relations avec les domaines

L'UDI peut agréger des vues provenant notamment de Auth, Profile, Flash, Scan, Radar, Veille, Recommendation, Trust, Mission, Notification et Media. Ces domaines restent autonomes et propriétaires de leurs données.

## 7. Principes d'évolution

De nouveaux modules ou domaines pourront être ajoutés sans transformer l'UDI en propriétaire des données métier. Toute extension doit préserver la séparation entre agrégation, propriété des données et autorisation de visibilité.

## 8. Statut documentaire

Ce document décrit le modèle cible et les règles de gouvernance. Il ne prouve pas à lui seul que chaque projection, filtre d'accès ou intégration est déjà implémenté dans les API ou le runtime.
