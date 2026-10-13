# Mise à jour de 03A-VITALA-TRUST-ENGINE-V1.md

## Intégration avec l'Unified Digital Identity (UDI)

# 1. Nouveau rôle du Trust Engine

Le Trust Engine est un domaine métier autonome chargé de produire l'ensemble des informations liées à la confiance au sein de Vitala. Il constitue l'unique autorité responsable du calcul, de l'évolution et de la gouvernance du Trust. Aucun autre domaine de la plateforme ne peut modifier directement les données de confiance.

# 2. Responsabilités

Le Trust Engine est responsable de :

- calculer le Trust Score;
- déterminer le Trust Level;
- gérer les Trust Evidence;
- historiser les évolutions du Trust;
- recalculer les scores lorsque les règles évoluent;
- produire les événements liés au Trust;
- publier la Trust View destinée à l'Unified Digital Identity.
# 3. Principe de publication

Le Trust Engine ne modifie jamais directement l'interface utilisateur. Il publie uniquement des informations vers le domaine Trust. L'Unified Digital Identity récupère ces informations afin de construire la Trust View présentée dans le profil utilisateur. Chaîne de responsabilité : Trust Engine → Trust Domain → Trust View → Unified Digital Identity → Interface utilisateur

# 4. Sources d'information

Le Trust Engine peut recevoir des événements provenant de plusieurs domaines métier, notamment :

- Flash;
- Missions;
- Opportunities;
- Recommendations;
- Activité utilisateur;
- Validations communautaires;
- Signalements confirmés.
Ces événements constituent des preuves (Trust Evidence). Ils n'entraînent jamais directement une modification du Trust. Ils sont analysés selon les règles du moteur avant toute décision.

# 5. Gouvernance

Le Trust Engine applique les principes suivants :

- indépendance du domaine Trust;
- traçabilité complète des calculs;
- possibilité de recalcul global;
- évolution des modèles de pondération sans modifier les autres domaines;
- séparation entre production des données et présentation.
# 6. Publication de la Trust View

Le moteur produit une projection destinée à l'UDI. Cette projection peut contenir :

- Trust Score;
- Trust Level;
- évolution récente;
- badges;
- historique synthétique;
- indicateurs de progression.
Les algorithmes internes et les pondérations restent exclusivement gérés par le Trust Engine.

# 7. Intégration avec l'UDI

L'Unified Digital Identity n'est jamais propriétaire des données de confiance. Elle agrège uniquement la Trust View produite par le domaine Trust. Cette séparation garantit :

- une seule source de vérité;
- l'absence de duplication;
- une évolution indépendante du moteur de confiance;
- une architecture modulaire.
# 8. Compatibilité avec les autres moteurs

Le Trust Engine fonctionne indépendamment des moteurs :

- Radar;
- Veille;
- Recommendation;
- Flash;
- Mission.
Ces domaines publient des événements ou des preuves. Le Trust Engine décide seul de leur impact éventuel sur la confiance.

# 9. Préparation des évolutions futures

L'architecture permet l'ajout de nouveaux modèles de calcul, de nouvelles catégories de preuves ou de nouveaux critères de confiance sans modifier les contrats métier des autres domaines. Les futures versions pourront intégrer des modèles hybrides, des analyses avancées ou des mécanismes d'intelligence artificielle tout en conservant la même responsabilité fondamentale : produire une confiance fiable, explicable et évolutive.

# 10. Principe fondamental

Le Trust Engine produit la confiance. L'Unified Digital Identity la représente. L'interface utilisateur la présente.

Cette séparation constitue l'un des fondements de l'architecture de Vitala et garantit la stabilité, la transparence et l'évolutivité du système.