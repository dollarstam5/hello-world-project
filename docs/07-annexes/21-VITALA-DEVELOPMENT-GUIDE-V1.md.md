# 21-VITALA-DEVELOPMENT-GUIDE-V1.md

## Version : V1

## Statut : Référence officielle de développement

# 1. Objectif

Ce document définit les principes, les règles et les bonnes pratiques qui doivent guider tout développement réalisé sur Vitala.

Il constitue la référence officielle pour les développeurs humains et les outils d'assistance au développement.

Son objectif est de garantir une architecture cohérente, maintenable, évolutive et conforme aux décisions prises dans le VPS.

# 2. Philosophie

Le développement de Vitala repose sur une idée simple :

## Construire une plateforme durable, modulaire et évolutive, où chaque domaine est

**indépendant, chaque responsabilité est clairement définie et chaque évolution peut être réalisée sans remettre en cause les fondations existantes.**

## Chaque décision technique doit privilégier :

- la lisibilité;
- la simplicité;
- la modularité;
- la testabilité;
- la sécurité;
- l'évolutivité.
# 3. Les 10 Commandements de Vitala

1. Un domaine possède toujours ses propres données.
2. Une API ne devient jamais propriétaire des données d'un autre domaine.
3. L'Unified Digital Identity agrège les informations, elle ne remplace jamais les domaines métier.
4. Les événements décrivent des changements, ils ne transportent pas la logique métier.
5. Toute fonctionnalité doit être conçue *Offline First* lorsque cela est pertinent.
6. Les contrats API évoluent sans casser les clients existants.

7. Le code doit être modulaire, documenté et testable.
8. Les composants d'interface restent découplés de la logique métier.
9. La sécurité est intégrée dès la conception (*Security by Design*).
10. Chaque évolution doit préserver l'architecture et éviter la dette technique.
# 4. Principes d'architecture

Les développements de Vitala appliquent systématiquement les principes suivants :

- Domain First
- Identity First
- API First
- Offline First
- Single Source of Truth
- Zero Cross Domain Ownership
- Event Ready
- Security by Design
Ces principes sont obligatoires pour tout nouveau développement.

# 5. Organisation du projet

Le projet est organisé de manière modulaire.

## Chaque domaine métier possède :

- ses modèles;
- ses services;
- ses règles métier;
- ses composants spécifiques;
- ses tests.
Aucun domaine ne doit accéder directement aux données internes d'un autre domaine.

Les échanges passent exclusivement par les contrats API ou les événements définis dans le VPS.

# 6. Standards de développement

Le code doit respecter les règles suivantes :

- nommage explicite et cohérent;
- fonctions courtes et spécialisées;
- séparation claire entre présentation, logique métier et accès aux données;
- documentation des éléments publics;
- couverture de tests adaptée;

- gestion centralisée des erreurs.
# 7. Qualité

## Avant toute intégration :

- les tests doivent être exécutés;
- le lint doit être sans erreur;
- les revues de code sont obligatoires pour les changements importants;
- la documentation doit être mise à jour lorsque le comportement évolue.
# 8. Évolutivité

Toute nouvelle fonctionnalité doit pouvoir être ajoutée sans remettre en cause les contrats existants.

L'ajout d'un nouveau domaine, d'une nouvelle API ou d'un nouveau moteur doit suivre les modèles définis dans ce guide.

Le respect de ces principes garantit la stabilité et la pérennité de Vitala.