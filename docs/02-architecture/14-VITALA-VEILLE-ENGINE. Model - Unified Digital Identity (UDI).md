# Évolution du Domain Model : Unified Digital Identity (UDI)

## 1. Nouveau principe fondamental

La **Unified Digital Identity (UDI)** est la représentation métier unifiée de l'identité numérique d'un utilisateur dans l'écosystème Vitalis. Elle fournit un point de référence cohérent pour présenter les informations issues des domaines métier.

L'UDI n'est pas une permission générale de consulter toutes les données de l'utilisateur. La visibilité dépend des règles de confidentialité, du contexte et des autorisations propres au moteur qui demande ou présente une information.

## 2. Rôle de l'UDI

L'UDI agrège et expose des représentations des informations produites par les différents domaines. Elle ne calcule pas les données métier et ne devient pas propriétaire des données des autres domaines.

Chaque domaine reste propriétaire de ses données et de ses règles métier. L'UDI ne duplique pas ces données ; elle fournit une représentation cohérente et contrôlée.

## 3. Modules de représentation

### Identity

Informations d'identité telles que l'identifiant, le nom, la photo, la langue, le pays, les vérifications et le statut du compte, selon les droits d'accès.

### Capabilities

Compétences, domaines d'expertise, expériences, certifications et centres d'intérêt, selon les autorisations.

### Context

Localisation, disponibilité, mobilité et fuseau horaire. Les données précises ne sont exposées que lorsque le contexte et le consentement le permettent.

### Intentions

Objectifs dynamiques de l'utilisateur : rechercher ou proposer une opportunité, développer son réseau, trouver des partenaires, recruter ou rechercher des investisseurs.

### Preferences

Préférences et paramètres produits par les domaines concernés, notamment Radar, Veille et Recommendation. Chaque moteur conserve ses propres réglages.

### Privacy

Politiques de visibilité, consentements et préférences de confidentialité. La politique transversale est détaillée dans [Visibilité et confidentialité propres à chaque moteur](../03-engines/visibility-and-profile-policy.md).

### Activity View

Vue agrégée d'activités telles que les Flash publiés, réponses, missions, interactions et historiques, alimentée par les domaines propriétaires et filtrée selon les droits.

### Trust View

Vue issue du Trust Engine : niveau, score, historique et preuves autorisées. Le calcul et la gouvernance du Trust restent sous la responsabilité du domaine Trust.

### Recommendation View, Radar View et Veille View

Vues alimentées par les domaines Recommendation, Radar et Veille. L'UDI les présente sans modifier leurs données ni prendre leurs décisions métier.

### Statistics

Indicateurs agrégés calculés par les domaines responsables, exposés selon leur niveau de confidentialité.

## 4. Gouvernance et propriété des données

Chaque donnée appartient à un seul domaine métier. Les autres domaines ne la dupliquent pas et ne la modifient pas directement. Ils la consultent au moyen de contrats métier ou de vues adaptées.

Ce principe garantit la cohérence, évite les duplications et préserve l'autonomie des domaines.

## 5. Projections du profil selon le moteur

L'UDI peut fournir plusieurs projections du profil. Une projection est un sous-ensemble de champs autorisés pour un usage précis ; elle ne constitue pas un accès implicite à l'identité complète.

- Chaque moteur définit les informations dont il a besoin et les champs qu'il peut exposer.
- Les autorisations d'un moteur ne sont jamais héritées automatiquement par un autre.
- Les paramètres d'une publication ou d'une action s'appliquent à son propre contexte lorsqu'ils sont prévus.
- L'accès au profil complet exige une autorisation explicite et propre au moteur.
- Les champs non autorisés ne doivent pas être transmis dans les réponses API, même s'ils sont masqués dans l'interface.
- Les règles doivent être appliquées côté serveur et testées pour les utilisateurs authentifiés, les invités et les accès hors périmètre.

L'UDI fournit les données autorisées ; le domaine consommateur reste responsable de la décision métier et de l'application de son contrat d'accès.

## 6. Relations avec les domaines

L'UDI peut agréger des vues provenant notamment de Auth, Profile, Flash, Scan, Radar, Veille, Recommendation, Trust, Mission, Notification et Media. Ces domaines restent autonomes et propriétaires de leurs données.

## 7. Évolution

De nouveaux modules ou domaines pourront être ajoutés sous forme de nouvelles vues sans transformer l'UDI en propriétaire des données métier. Toute extension doit préserver la séparation entre agrégation, propriété des données et autorisation de visibilité.

## 8. Statut documentaire

Ce document décrit le modèle cible et les règles de gouvernance. Il ne prouve pas à lui seul que chaque projection, filtre d'accès ou intégration est déjà implémenté dans les API ou le runtime.