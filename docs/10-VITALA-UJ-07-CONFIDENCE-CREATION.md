# VITALA-UJ-07-CONFIDENCE-CREATION

**Document ID :** VITALA-UJ-07 **Titre :** Journey 7 — Création de confiance **Version :** 1.0 **Statut :** VALIDÉ

# DÉPENDANCES

- VITALA-VISION-V1
- VITALA-PERSONAS-V1
- VITALA-TRUST-LEVELS-V1
- VITALA-UJ-01-CONSULTANT-TO-MEMBER
- VITALA-UJ-02-MEMBER-TO-IDENTIFIED
- VITALA-UJ-03-PUBLISH-OPPORTUNITY
- VITALA-UJ-04-RESPOND-OPPORTUNITY
- VITALA-UJ-05-SELECT-CANDIDATE
- VITALA-UJ-06-ACTION-VALIDATION
# 1. Objectif

Permettre à Vitala de construire un écosystème fondé sur la confiance réelle plutôt que sur la popularité. La confiance constitue l'un des piliers fondamentaux de Vitala. Elle permet aux utilisateurs de prendre des décisions plus éclairées tout en conservant leur liberté de choix.

# 2. Philosophie

La confiance ne s'achète pas. La confiance ne se déclare pas. La confiance se construit. Elle résulte d'actions réelles, d'expériences vécues et de preuves accumulées dans le temps.

# 3. Définition

La confiance Vitala représente l'ensemble des preuves observées permettant d'apprécier la crédibilité, la continuité et la fiabilité potentielle d'une entité.

# 4. Principe fondamental

Vitala ne garantit jamais une personne, un service, un produit ou une organisation. Vitala met simplement à disposition des preuves permettant aux utilisateurs de se faire leur propre opinion.

# 5. Recommandation et garantie

Une recommandation Vitala n'est jamais une garantie. Une recommandation représente une synthèse de preuves observées issues :

- d'actions validées;
- d'expériences réelles;
- de recommandations;
- de garants;
- de la continuité d'activité;
- de signaux de confiance disponibles.
# 6. Confiance universelle

Le moteur de confiance Vitala s'applique à toute entité ayant produit une expérience réelle. La confiance n'est pas limitée aux personnes.

# 7. Entités concernées

Exemples :

- Personne
- Famille
- Professionnel
- Entreprise
- Association
- Organisation

- Produit
- Service
- Opportunité
- Projet
- Lieu
- Zone
Toute nouvelle entité Vitala peut intégrer le moteur de confiance.

# 8. Sources de confiance

La confiance peut être alimentée par plusieurs catégories de preuves.

## Actions validées

Exemples :

- Mission réalisée
- Service exécuté
- Vente conclue
- Besoin satisfait
- Projet accompli
## Recommandations

Recommandations issues d'expériences réelles validées.

## Garants

Garants reconnus dans l'écosystème. Exemples :

- Utilisateur Confirmé
- Utilisateur Pro
- Entreprise
- Association
- Organisation
- Référence reconnue

## Continuité

Exemples :

- Activité régulière
- Présence durable
- Historique cohérent
## Validation d'identité

Exemples :

- Vérifié
- Confirmé
- Pro
# 9. Ce qui ne crée pas la confiance

Les éléments suivants ne constituent pas des preuves de confiance.

- Nombre d'abonnés
- Popularité
- Nombre de vues
- Nombre de likes
- Tendances virales
- Influence sociale
# 10. Transparence

Toute recommandation doit être explicable. L'utilisateur doit pouvoir comprendre pourquoi une entité est recommandée.

# 11. Fonction "Pourquoi recommandé ?"

L'utilisateur peut consulter : Pourquoi recommandé ?

Le système affiche alors :

- Vérifié
- Confirmé
- 12 actions validées
- 4 recommandations réelles
- Actif depuis 18 mois
- Aucun incident majeur enregistré
# 12. Preuves de confiance

Les preuves de confiance constituent les fondations du moteur. Exemples :

- Action validée
- Ancienneté
- Garantie
- Recommandation
- Vérification
- Participation
# 13. Recommandations

Les recommandations sont possibles uniquement après une expérience réelle validée.

# 14. Éligibilité à la recommandation

Peuvent recommander :

- Auteur de l'action
- Participant de l'action
- Parties directement impliquées
Ne peuvent pas recommander :

- Visiteurs
- Observateurs
- Utilisateurs non impliqués

# 15. Révocation

Une recommandation peut être retirée. La confiance étant dynamique, les recommandations doivent pouvoir évoluer dans le temps.

# 16. Niveaux visibles

Le moteur de confiance alimente les statuts visibles de Vitala.

## Référencé

Présence reconnue dans l'écosystème.

## Vérifié

Identité validée.

## Confirmé

Expériences réelles validées.

## Recommandé

Preuves positives suffisantes.

## Actif

Participation régulière.

## Fiable

Combinaison cohérente de preuves positives dans le temps.

# 17. Fiable

Le statut Fiable ne repose jamais sur une seule information. Il est construit à partir d'un ensemble de preuves. Exemples :

- Actions validées
- Ancienneté
- Recommandations
- Continuité
- Absence d'incidents majeurs
# 18. Aucun score public

Vitala interdit :

- Notes sur 5
- Pourcentages de réputation
- Classements publics
- Scores visibles
- Étoiles
- Podiums
# 19. Scores internes

Le moteur de confiance peut utiliser des calculs internes. Exemples :

- Trust Score
- Risk Score
- Consistency Score
- Recommendation Score
Ces indicateurs restent invisibles aux utilisateurs.

# 20. Neutralité

Le moteur de confiance n'impose jamais une décision. Il fournit des informations.

### L'utilisateur conserve toujours son libre arbitre.

# 21. Confiance contextuelle

Une entité peut être recommandée dans un contexte précis. Exemples :

- Service recommandé
- Produit recommandé
- Zone recommandée
- Entreprise recommandée
- Opportunité recommandée
La recommandation reste liée aux preuves observées.

# 22. Gestion des incidents

Les incidents peuvent influencer les preuves de confiance. Exemples :

- Fraude validée
- Informations trompeuses
- Abus répétés
- Comportements interdits
L'analyse reste réalisée par les moteurs internes.

# 23. Évolution

La confiance évolue en permanence. Une entité peut : Monter ↓ Stagner ↓ Redescendre

### selon son activité réelle.

# 24. Utilisation dans Vitala

Le moteur de confiance est utilisé par :

- Flash
- Radar
- Veille
- Profils
- Services
- Produits
- Entreprises
- Associations
- Organisations
- Opportunités
# 25. Architecture recommandée

```
packages/
└── trust/
├── entities/
├── validations/
├── recommendations/
├── guarantors/
├── trust-engine/
└── trust.types.ts
```
Le moteur de confiance doit être transversal à toute la plateforme.

# 26. Principes UX

## Principe 1

Les preuves sont préférées aux opinions.

## Principe 2

La transparence est obligatoire.

## Principe 3

Aucune popularité artificielle.

## Principe 4

La recommandation n'est jamais une garantie.

## Principe 5

La confiance se construit dans le temps.

## Principe 6

L'utilisateur reste libre de ses décisions.

# 27. Critère de réussite

Le parcours est réussi lorsque : Action réelle ↓ Validation ↓ Preuves de confiance ↓ Recommandations ↓ Statuts de confiance ↓ Décisions mieux informées

sans notes, sans étoiles et sans système de popularité.

# Fin du document

Document ID : VITALA-UJ-07 Version : 1.0 Statut : VALIDÉ