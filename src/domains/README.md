# Domains — architecture modulaire

Dans l'architecture actuelle, les quatre moteurs sont modélisés comme des **domaines métier** (bounded contexts), et non comme de simples features d'interface. Ils possèdent chacun leurs règles, contrats, modèles, API, états et composants propres.

## Correspondance des moteurs

| Moteur produit | Domaine applicatif | Remarque |
| --- | --- | --- |
| Instant (anciennement Réel) | `presence` | Le nom technique `presence` est conservé pour la compatibilité des routes et du code existant. |
| Flash | `flash` | Domaine dédié. |
| Scan | `scan` | Domaine dédié. |
| Radar | `radar` | Domaine dédié. |

## Domain vs feature

- **Domain** : frontière métier autonome. Un moteur est un domain lorsqu'il porte une finalité, des règles d'accès, des données et des contrats propres.
- **Feature** : capacité fonctionnelle située à l'intérieur d'un domaine ou réutilisée par plusieurs domaines, sans devenir automatiquement une nouvelle frontière métier.
- **UI component** : élément de présentation ; il ne constitue pas à lui seul un domain.

Exemples de capacités qui pourront être organisées comme features internes : démarrer un Flash, gérer sa durée de vie, lancer un scan, filtrer les résultats Radar, gérer les bips et les fiches de proximité Instant. Leur découpage exact dépendra des responsabilités et des dépendances réellement observées dans le code.

## Règles d'architecture

- Chaque domaine possède ses propres types, modèles, API, services métier et composants UI.
- Aucun domaine n'importe les détails internes d'un autre domaine ; les échanges passent par une API publique explicite ou un contrat transversal documenté.
- Les services partagés doivent rester limités aux fondations réellement communes (authentification, accès, langue, plateforme, capacités appareil, etc.).
- Les règles métier et les autorisations sont vérifiées côté serveur ; l'interface ne constitue jamais l'autorité d'accès.
- Les moteurs ne partagent pas automatiquement leurs règles de profil, de visibilité ou de consentement.
- Les textes visibles passent par `src/lib/i18n` et les styles par les tokens du système de design.
- La création d'un dossier ou d'une fiche documentaire ne signifie pas que le code correspondant est terminé.

## Domaines prévus ou transversaux

Les autres domaines existants ou planifiés restent indépendants des quatre moteurs prioritaires : trust, profile, referral, trust-network, assistant, knowledge, creator, wallet, spaces, feed, search, recommendations, realtime, offline, admin et analytics. Leur état réel doit être vérifié dans l'arborescence et les exports avant toute nouvelle création.
