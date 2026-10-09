# Mise à jour de 03-VITALA-TRUST-LEVELS-V1.md

## Intégration de l'Unified Digital Identity (UDI)

# 1. Nouveau principe

Le niveau de confiance (Trust Level) ne constitue pas une propriété du profil utilisateur. Il est produit exclusivement par le **Trust Engine**. L'Unified Digital Identity (UDI) présente uniquement une **Trust View**, qui est la représentation officielle du niveau de confiance de l'utilisateur.

# 2. Séparation des responsabilités

Afin de garantir la cohérence de la plateforme, chaque composant possède une responsabilité clairement définie.

## Trust Engine

Responsable de :

- calculer le Trust Score;
- produire les niveaux de confiance;
- analyser les preuves (Trust Evidence);
- enregistrer l'historique du Trust;
- appliquer les règles de pondération;
- recalculer le Trust lors des évolutions de l'utilisateur.
Le Trust Engine est la seule autorité capable de modifier les données de confiance.

## Unified Digital Identity (UDI)

Responsable de :

- récupérer les informations produites par le Trust Engine;
- construire la Trust View;
- présenter le niveau de confiance dans l'interface utilisateur.
L'UDI ne calcule jamais le Trust.

## Interface utilisateur

Responsable de :

- afficher la Trust View;
- expliquer le niveau de confiance à l'utilisateur;
- notifier les évolutions significatives du Trust.
L'interface ne modifie jamais directement les données de confiance.

# 3. Trust View

La Trust View est la représentation officielle du Trust dans l'identité numérique. Elle peut contenir notamment :

- Trust Score actuel;
- niveau de confiance;
- évolution récente;
- historique synthétique;
- badges de confiance;
- principaux facteurs influençant le niveau de confiance.
Les détails des algorithmes restent exclusivement gérés par le Trust Engine.

# 4. Évolution du Trust

Le niveau de confiance est dynamique. Il peut évoluer positivement ou négativement selon les actions réalisées sur la plateforme. Exemples :

- missions réussies;
- validations de la communauté;
- nouvelles preuves de confiance;
- inactivité prolongée;
- signalements confirmés;
- perte de crédibilité;
- évolution des modèles de calcul.
Chaque évolution est historisée afin de garantir la traçabilité.

# 5. Transparence

La plateforme informe l'utilisateur lorsqu'une évolution importante de son Trust intervient. Cependant, Vitala n'expose pas nécessairement l'intégralité des mécanismes de calcul. Cette approche permet :

- de préserver la robustesse du système;
- de limiter les tentatives de manipulation;
- de maintenir un niveau élevé de confiance dans l'écosystème.
# 6. Principe de gouvernance

Le Trust appartient exclusivement au domaine Trust. Aucun autre domaine (Flash, Radar, Veille, Mission, Recommendation, etc.) ne peut modifier directement les données de confiance. Tous les domaines peuvent produire des événements ou des preuves qui seront analysés par le Trust Engine. Le Trust Engine reste seul responsable de la décision finale.

# 7. Relation avec l'UDI

L'Unified Digital Identity ne stocke pas le Trust. Elle présente uniquement la Trust View produite par le domaine Trust. Cette architecture garantit :

- une seule source de vérité;
- l'absence de duplication;
- une évolution indépendante du Trust Engine;
- une cohérence de l'expérience utilisateur.
# 8. Principe fondamental

Le Trust est un domaine métier autonome. L'UDI est une couche d'agrégation.

L'interface utilisateur est une couche de présentation. Cette séparation des responsabilités constitue l'un des principes architecturaux majeurs de Vitala et garantit la stabilité du système à long terme.