# Comparaison de couverture — Trust et Unified Digital Identity (UDI)

**Lot 12 — revue de contenu avant toute décision de retrait**  
**Statut :** comparaison documentaire ciblée réalisée ; aucun document historique n'est supprimé par ce rapport.  
**Limite :** la couverture décrite ici porte sur les contenus accessibles dans le dépôt. Elle ne prouve ni l'implémentation runtime ni l'application en production.

## Règle de décision

Une notion similaire dans deux documents n'est pas une preuve de reprise intégrale. Les sources historiques restent conservées tant que les apports spécifiques, les contradictions et les références entrantes n'ont pas été traités. Toute suppression ultérieure exige une décision et une autorisation explicites séparées.

## 1. Niveaux de confiance — mise à jour 1 (version 1.1)

**Source :** `docs/01-product/03-VITALA-TRUST-LEVELS-V1.md Mise � jour 1.md`  
**Références canoniques :** `docs/01-product/trust-levels.md` et `docs/02-architecture/trust-domain.md`.

| Sujet historique | Couverture canonique constatée | Écart ou précaution |
| --- | --- | --- |
| Trust Engine, autorité unique sur le niveau et séparation entre produit et calcul | Couvert par la section Responsabilités de `trust-levels.md` et la frontière du domaine dans `trust-domain.md`. | Pas d'écart architectural majeur repéré dans cette mise à jour. |
| Évolution dynamique à partir d'événements validés | Couvert par les sections Preuves et événements, Calcul et évolution et Historique et correction de `trust-domain.md`. | Les poids et seuils historiques ne sont pas des règles actives tant qu'ils ne sont pas confirmés par les contrats, le code et les tests. |
| Transparence personnelle et confidentialité des détails sensibles | Couvert par Visibilité dans `trust-levels.md` et Trust View / Sécurité et gouvernance dans `trust-domain.md`. | Le détail des événements accessibles et les notifications concrètes restent à définir par contrat/politique. |
| Principes de progressivité, explicabilité, traçabilité, réversibilité et équité | Couvert en grande partie par les principes canoniques des deux documents. | Le terme « équité » est un objectif de gouvernance ; aucune mesure opérationnelle n'est définie par la seule documentation. |
| Liste des consommateurs (Flash, Scan, Radar, Veille, Recommendation, sélection, sécurité, modération) | Les consommateurs sont recensés dans `trust-domain.md`. | Conserver la liste historique comme trace ; confirmer chaque dépendance au niveau des contrats/runtime avant d'en faire une dépendance active. |

**Décision :** principes largement repris à travers deux références canoniques, mais retrait non autorisé. L'ancien document n'est pas une preuve d'implémentation.

## 2. Niveaux de confiance — mise à jour 2 (intégration UDI)

**Source :** `docs/01-product/03-VITALA-TRUST-LEVELS-V1.md Mise � jour 2.md`  
**Références canoniques :** `docs/01-product/trust-levels.md`, `docs/02-architecture/trust-domain.md`, `docs/02-architecture/identity-model.md`.

| Sujet historique | Couverture canonique constatée | Écart ou précaution |
| --- | --- | --- |
| Trust Engine seul producteur ; UDI agrège une Trust View ; interface présente sans recalcul | Couvert par la chaîne de responsabilité et les sections Trust View / Consommateurs de `trust-domain.md`, et par `identity-model.md`. | Aucune écriture Trust directe par l'UDI ou l'interface ne doit être interprétée comme permise. |
| Contenu possible de la Trust View : score, niveau, progression, historique synthétique, badges, facteurs explicatifs | Le niveau, les badges et la progression synthétique sont couverts ; les champs effectifs doivent être spécifiés dans les contrats. | La liste exacte de champs exposés n'est pas validée comme contrat runtime. |
| Notification des évolutions significatives | Le principe d'explication et d'historique est couvert, mais une règle de notification produit n'est pas définie comme comportement actif dans les références canoniques inspectées. | **Apport à arbitrer** : décider si une notification est exigée en V1, puis la spécifier/tester séparément. |
| Tous les domaines peuvent fournir des preuves, mais Trust seul décide de leur effet | Couvert par `trust-domain.md`. | Les noms d'événements historiques et leur poids restent des propositions tant qu'ils ne sont pas confirmés. |

**Décision :** aucune suppression. Une éventuelle exigence de notification doit être arbitrée, pas copiée automatiquement depuis une mise à jour historique.

## 3. Trust Engine — mise à jour d'intégration UDI

**Source :** `docs/03-engines/trust/03A-VITALA-TRUST-ENGINE-V1.md Mise � jour.md`  
**Référence canonique :** `docs/02-architecture/trust-domain.md`.

Les responsabilités, les familles de preuves, la publication de la Trust View, la gouvernance et la séparation Trust/UDI sont reprises dans les sections 1 à 10 de la référence canonique. Les idées de recalcul et d'évolution des modèles figurent dans les sections Calcul et évolution et Sécurité et gouvernance.

**Apports ou précautions :**
- Les formulations prospectives sur de futurs modèles hybrides ou d'intelligence artificielle ne sont pas des exigences V1 validées ; elles ne justifient pas une extension du périmètre.
- Le document historique emploie parfois « publie vers le domaine Trust » puis décrit le Trust Engine comme le domaine propriétaire. La référence canonique exprime la frontière de responsabilité sans présumer d'un mécanisme de publication technique déjà déployé.
- La liste de champs de la Trust View doit rester une projection autorisée ; les détails internes ne sont pas publics par défaut.

**Décision :** contenu architectural principal repris ; source historique conservée jusqu'à validation globale des sources et de leurs liens entrants.

## 4. Modèle historique UDI — document de Domain Model

**Source :** `docs/02-architecture/14-VITALA-VEILLE-ENGINE. Model - Unified Digital Identity (UDI).md`  
**Référence canonique :** `docs/02-architecture/identity-model.md`.

| Sujet historique | Couverture canonique constatée | Écart ou précaution |
| --- | --- | --- |
| Modules Identity, Capabilities, Context, Intentions, Preferences, Privacy et vues métier | Tous les modules sont inventoriés dans la table des modules de `identity-model.md`. | L'ancien document détaille des exemples de champs : photo/langue/pays/statut, certifications, fuseau horaire, mobilité, etc. Ces champs doivent être considérés comme exemples historiques tant qu'ils ne sont pas spécifiés et validés par domaine. |
| Intentions dynamiques et historisées | La catégorie Intentions est présente dans la référence canonique. | L'historisation explicite des intentions est un détail à arbitrer si elle est requise ; ne pas l'implémenter par inférence documentaire. |
| Activity View : Flash publiés, réponses, missions, interactions, historique | La vue et son propriétaire sont décrits canoniquement. | La liste détaillée des agrégats doit être validée avec le domaine Activity et les contrats. |
| Trust View incluant « preuves de confiance » | La référence Trust distingue la vue autorisée des preuves brutes et des données sensibles. | **Contradiction de visibilité à ne pas recopier telle quelle** : l'exposition des preuves doit être filtrée ; aucune preuve sensible n'est publique par défaut. |
| UDI comme « Single Source of Truth » universelle | La référence canonique précise que chaque domaine reste propriétaire de ses données et que l'UDI est un agrégateur. | **Contradiction de formulation résolue au profit du canonique** : ne pas présenter l'UDI comme propriétaire universel des données métier. |
| Relations avec Auth, Profile, Flash, Scan, Radar, Veille, Recommendation, Trust, Mission, Notification et Media | Les domaines sont représentés dans les références canoniques, mais la liste seule ne prouve pas l'intégration runtime. | Confirmer les producteurs, consommateurs et contrats un par un avant d'annoncer une dépendance active. |

**Décision :** conserver. Les listes de champs et de dépendances peuvent contenir des détails utiles, mais doivent être validées avec leurs domaines propriétaires avant migration intégrale.

## 5. Modèle historique UDI — évolution du modèle de données

**Source :** `docs/02-architecture/Evolution du mod�le de donn�es - Unified Digital Identity (UDI).md`  
**Référence canonique :** `docs/02-architecture/identity-model.md`.

Les principes de propriété par domaine, d'agrégation et de non-duplication sont repris. Le document historique apporte des détails sur les responsabilités de Context, Intentions, Preferences, Privacy, Activity et Statistics, ainsi que l'historisation des intentions et l'ajout possible de domaines futurs.

Les apports potentiels encore à arbitrer sont :
- la nécessité et la durée de conservation de l'historique des intentions ;
- les champs concrets appartenant à chaque domaine ;
- les frontières de données entre Identity/Profile et les autres domaines ;
- le traitement des nouvelles vues et de leurs permissions.

Les propositions de domaines futurs (Organisation, Entreprise, Marketplace, IA) sont prospectives et ne constituent pas un engagement V1.

**Décision :** conserver ; ne pas supprimer avant une comparaison des champs, tables, relations, règles de confidentialité et contrats avec les références canoniques et le schéma réellement observé.

## 6. Contrat historique UDI API

**Source :** `docs/03-api/5. Unified Digital Identity API.md`  
**Référence canonique de classement :** `docs/03-api/README.md` et `docs/03-api/contract-runtime-status.md`.

Le contrat historique propose notamment `GET /me`, plusieurs `PATCH /me/...` et des lectures de vues `GET /me/trust`, `GET /me/radar`, `GET /me/veille` et `GET /me/recommendations`. Ces routes ne sont pas confirmées par l'inventaire runtime inspecté.

**Décision :** conserver comme contrat cible historique. Ajouter la mention UDI à l'inventaire des contrats non confirmés ; ne pas supprimer ou transformer ce contrat en affirmant que ses endpoints existent.

## 7. Résultat et autorisation

- Les principes centraux Trust/UDI sont largement couverts par `trust-levels.md`, `trust-domain.md` et `identity-model.md`.
- Des détails restent à arbitrer ou à valider : notifications de changement Trust, champs détaillés des modules UDI, historisation des intentions, liste réelle des dépendances et exposition de la Trust View.
- Certaines formulations historiques sont en conflit avec les frontières canoniques ou les exigences de confidentialité ; elles ne doivent pas être copiées sans décision.
- **Aucun des six documents de mise à jour/modèle ci-dessus n'est déclaré supprimable.** Le présent rapport ne vaut pas autorisation de retrait.
- TECH-001 à TECH-006 restent ouverts. Cette comparaison documentaire ne les résout pas.
