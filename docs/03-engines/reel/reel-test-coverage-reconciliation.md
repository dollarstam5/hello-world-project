# Réel V1 — réconciliation de couverture des tests

**Projet :** Vitalis  
**Référence :** [Matrice de traçabilité Réel V1](./reel-traceability-matrix.md)  
**Branche examinée :** `docs/reel-v1-spec`  
**Commit PR #28 contrôlé :** `3bfdc2f0a44a790fc89e6ca633b3c251f87ccb48`  
**Date du contrôle :** 6 novembre 2026  
**Statut :** revue de dépôt et de preuves CI ; aucun code ni test modifié.

> Cette réconciliation décrit les résultats des recherches et lectures effectuées. « Non localisé » ne signifie pas preuve absolue d'inexistence : cela signifie qu'aucun test direct n'a été retrouvé dans les emplacements et recherches contrôlés. Aucun scénario n'est déclaré couvert ou réussi sans test identifiable et preuve d'exécution.

## 1. Résultat exécutif

- **160 identifiants distincts** repris de la matrice de traçabilité.
- **0 test direct Réel localisé** dans cette revue.
- **0 scénario Réel dont l'exécution est prouvée** par le run CI examiné.
- Les tests transversaux existants restent utiles, mais ne prouvent pas les règles métier Réel.
- Les tests attendus Flash/Scan référencés dans le script Foundation présentent des chemins non retrouvés ; leur absence à ces chemins ne prouve pas que les fonctionnalités runtime sont absentes.
- Aucun ticket TECH n'est fermé par cette revue.

## 2. Légende de réconciliation

| Champ | Signification |
| --- | --- |
| Test direct localisé | Un fichier existant vérifie précisément le comportement du scénario Réel. |
| Couverture indirecte | Un test transverse touche un mécanisme connexe, sans démontrer la règle Réel. |
| Non localisé | Aucun test direct n'a été retrouvé dans le périmètre de recherche. |
| Exécuté | Un run CI ou local identifiable a exécuté le test. |
| Réussi | Le résultat de cette exécution est disponible et positif. |

**Règle appliquée :** un test de synchronisation n'est pas un test de chat Réel ; un test de géolocalisation Scan n'est pas automatiquement un test de proximité Réel ; un test RLS générique n'est pas une preuve des permissions propres aux demandes et conversations Réel.

## 3. Réconciliation des 160 scénarios

Tous les identifiants de la matrice source sont conservés ci-dessous. Le statut « Non localisé » est volontairement prudent et pourra être remplacé seulement après rattachement d'un fichier de test réel.

| Identifiant | Domaine | Test direct | Constat de couverture | Exécution / résultat |
| --- | --- | --- | --- | --- |
| T-R02-01 | R | Non localisé | Aucun test Réel direct localisé. | Non exécuté / non prouvé |
| T-R02-02 | R | Non localisé | Aucun test Réel direct localisé. | Non exécuté / non prouvé |
| T-R02-03 | R | Non localisé | Aucun test Réel direct localisé. | Non exécuté / non prouvé |
| T-R03-01 | R | Non localisé | Aucun test Réel direct localisé. | Non exécuté / non prouvé |
| T-R03-02 | R | Non localisé | Aucun test Réel direct localisé. | Non exécuté / non prouvé |
| T-R04-01 | R | Non localisé | Aucun test Réel direct localisé. | Non exécuté / non prouvé |
| T-R04-02 | R | Non localisé | Aucun test Réel direct localisé. | Non exécuté / non prouvé |
| T-R04-03 | R | Non localisé | Aucun test Réel direct localisé. | Non exécuté / non prouvé |
| T-R05-01 | R | Non localisé | Aucun test Réel direct localisé. | Non exécuté / non prouvé |
| T-R05-02 | R | Non localisé | Aucun test Réel direct localisé. | Non exécuté / non prouvé |
| T-R05-03 | R | Non localisé | Aucun test Réel direct localisé. | Non exécuté / non prouvé |
| T-R05-04 | R | Non localisé | Aucun test Réel direct localisé. | Non exécuté / non prouvé |
| T-R05-05 | R | Non localisé | Aucun test Réel direct localisé. | Non exécuté / non prouvé |
| T-R06-01 | R | Non localisé | Aucun test Réel direct localisé. | Non exécuté / non prouvé |
| T-R06-02 | R | Non localisé | Aucun test Réel direct localisé. | Non exécuté / non prouvé |
| T-R06-03 | R | Non localisé | Aucun test Réel direct localisé. | Non exécuté / non prouvé |
| T-R06-04 | R | Non localisé | Aucun test Réel direct localisé. | Non exécuté / non prouvé |
| T-A01-01 | A | Non localisé | Aucun test de demandes, connexions, blocage ou cooldown Réel direct localisé. | Non exécuté / non prouvé |
| T-A01-02 | A | Non localisé | Aucun test de demandes, connexions, blocage ou cooldown Réel direct localisé. | Non exécuté / non prouvé |
| T-A02-01 | A | Non localisé | Aucun test de demandes, connexions, blocage ou cooldown Réel direct localisé. | Non exécuté / non prouvé |
| T-A02-02 | A | Non localisé | Aucun test de demandes, connexions, blocage ou cooldown Réel direct localisé. | Non exécuté / non prouvé |
| T-A03-01 | A | Non localisé | Aucun test de demandes, connexions, blocage ou cooldown Réel direct localisé. | Non exécuté / non prouvé |
| T-A03-02 | A | Non localisé | Aucun test de demandes, connexions, blocage ou cooldown Réel direct localisé. | Non exécuté / non prouvé |
| T-A04-01 | A | Non localisé | Aucun test de demandes, connexions, blocage ou cooldown Réel direct localisé. | Non exécuté / non prouvé |
| T-A04-02 | A | Non localisé | Aucun test de demandes, connexions, blocage ou cooldown Réel direct localisé. | Non exécuté / non prouvé |
| T-A04-03 | A | Non localisé | Aucun test de demandes, connexions, blocage ou cooldown Réel direct localisé. | Non exécuté / non prouvé |
| T-A05-01 | A | Non localisé | Aucun test de demandes, connexions, blocage ou cooldown Réel direct localisé. | Non exécuté / non prouvé |
| T-A05-02 | A | Non localisé | Aucun test de demandes, connexions, blocage ou cooldown Réel direct localisé. | Non exécuté / non prouvé |
| T-A05-03 | A | Non localisé | Aucun test de demandes, connexions, blocage ou cooldown Réel direct localisé. | Non exécuté / non prouvé |
| T-A06-01 | A | Non localisé | Aucun test de demandes, connexions, blocage ou cooldown Réel direct localisé. | Non exécuté / non prouvé |
| T-A06-02 | A | Non localisé | Aucun test de demandes, connexions, blocage ou cooldown Réel direct localisé. | Non exécuté / non prouvé |
| T-A07-01 | A | Non localisé | Aucun test de demandes, connexions, blocage ou cooldown Réel direct localisé. | Non exécuté / non prouvé |
| T-A07-02 | A | Non localisé | Aucun test de demandes, connexions, blocage ou cooldown Réel direct localisé. | Non exécuté / non prouvé |
| T-A07-03 | A | Non localisé | Aucun test de demandes, connexions, blocage ou cooldown Réel direct localisé. | Non exécuté / non prouvé |
| T-A08-01 | A | Non localisé | Aucun test de demandes, connexions, blocage ou cooldown Réel direct localisé. | Non exécuté / non prouvé |
| T-A08-02 | A | Non localisé | Aucun test de demandes, connexions, blocage ou cooldown Réel direct localisé. | Non exécuté / non prouvé |
| T-A08-03 | A | Non localisé | Aucun test de demandes, connexions, blocage ou cooldown Réel direct localisé. | Non exécuté / non prouvé |
| T-A09-01 | A | Non localisé | Aucun test de demandes, connexions, blocage ou cooldown Réel direct localisé. | Non exécuté / non prouvé |
| T-A09-02 | A | Non localisé | Aucun test de demandes, connexions, blocage ou cooldown Réel direct localisé. | Non exécuté / non prouvé |
| T-A10-01 | A | Non localisé | Aucun test de demandes, connexions, blocage ou cooldown Réel direct localisé. | Non exécuté / non prouvé |
| T-A10-02 | A | Non localisé | Aucun test de demandes, connexions, blocage ou cooldown Réel direct localisé. | Non exécuté / non prouvé |
| T-A11-01 | A | Non localisé | Aucun test de demandes, connexions, blocage ou cooldown Réel direct localisé. | Non exécuté / non prouvé |
| T-A11-02 | A | Non localisé | Aucun test de demandes, connexions, blocage ou cooldown Réel direct localisé. | Non exécuté / non prouvé |
| T-A11-03 | A | Non localisé | Aucun test de demandes, connexions, blocage ou cooldown Réel direct localisé. | Non exécuté / non prouvé |
| T-A12-01 | A | Non localisé | Aucun test de demandes, connexions, blocage ou cooldown Réel direct localisé. | Non exécuté / non prouvé |
| T-A12-02 | A | Non localisé | Aucun test de demandes, connexions, blocage ou cooldown Réel direct localisé. | Non exécuté / non prouvé |
| T-A12-03 | A | Non localisé | Aucun test de demandes, connexions, blocage ou cooldown Réel direct localisé. | Non exécuté / non prouvé |
| T-A13-01 | A | Non localisé | Aucun test de demandes, connexions, blocage ou cooldown Réel direct localisé. | Non exécuté / non prouvé |
| T-A13-02 | A | Non localisé | Aucun test de demandes, connexions, blocage ou cooldown Réel direct localisé. | Non exécuté / non prouvé |
| T-A13-03 | A | Non localisé | Aucun test de demandes, connexions, blocage ou cooldown Réel direct localisé. | Non exécuté / non prouvé |
| T-A14-01 | A | Non localisé | Aucun test de demandes, connexions, blocage ou cooldown Réel direct localisé. | Non exécuté / non prouvé |
| T-A14-02 | A | Non localisé | Aucun test de demandes, connexions, blocage ou cooldown Réel direct localisé. | Non exécuté / non prouvé |
| T-A15-01 | A | Non localisé | Aucun test de demandes, connexions, blocage ou cooldown Réel direct localisé. | Non exécuté / non prouvé |
| T-A15-02 | A | Non localisé | Aucun test de demandes, connexions, blocage ou cooldown Réel direct localisé. | Non exécuté / non prouvé |
| T-A15-03 | A | Non localisé | Aucun test de demandes, connexions, blocage ou cooldown Réel direct localisé. | Non exécuté / non prouvé |
| T-A15-04 | A | Non localisé | Aucun test de demandes, connexions, blocage ou cooldown Réel direct localisé. | Non exécuté / non prouvé |
| T-B01-01 | B | Non localisé | Aucun test Réel direct localisé. Les chemins Scan de géolocalisation référencés par le contrôle Foundation n'ont pas été retrouvés aux emplacements attendus. | Non exécuté / non prouvé |
| T-B01-02 | B | Non localisé | Aucun test Réel direct localisé. Les chemins Scan de géolocalisation référencés par le contrôle Foundation n'ont pas été retrouvés aux emplacements attendus. | Non exécuté / non prouvé |
| T-B01-03 | B | Non localisé | Aucun test Réel direct localisé. Les chemins Scan de géolocalisation référencés par le contrôle Foundation n'ont pas été retrouvés aux emplacements attendus. | Non exécuté / non prouvé |
| T-B01-04 | B | Non localisé | Aucun test Réel direct localisé. Les chemins Scan de géolocalisation référencés par le contrôle Foundation n'ont pas été retrouvés aux emplacements attendus. | Non exécuté / non prouvé |
| T-B01-05 | B | Non localisé | Aucun test Réel direct localisé. Les chemins Scan de géolocalisation référencés par le contrôle Foundation n'ont pas été retrouvés aux emplacements attendus. | Non exécuté / non prouvé |
| T-B02-01 | B | Non localisé | Aucun test Réel direct localisé. Les chemins Scan de géolocalisation référencés par le contrôle Foundation n'ont pas été retrouvés aux emplacements attendus. | Non exécuté / non prouvé |
| T-B02-02 | B | Non localisé | Aucun test Réel direct localisé. Les chemins Scan de géolocalisation référencés par le contrôle Foundation n'ont pas été retrouvés aux emplacements attendus. | Non exécuté / non prouvé |
| T-B02-03 | B | Non localisé | Aucun test Réel direct localisé. Les chemins Scan de géolocalisation référencés par le contrôle Foundation n'ont pas été retrouvés aux emplacements attendus. | Non exécuté / non prouvé |
| T-B02-04 | B | Non localisé | Aucun test Réel direct localisé. Les chemins Scan de géolocalisation référencés par le contrôle Foundation n'ont pas été retrouvés aux emplacements attendus. | Non exécuté / non prouvé |
| T-B03-01 | B | Non localisé | Aucun test Réel direct localisé. Les chemins Scan de géolocalisation référencés par le contrôle Foundation n'ont pas été retrouvés aux emplacements attendus. | Non exécuté / non prouvé |
| T-B03-02 | B | Non localisé | Aucun test Réel direct localisé. Les chemins Scan de géolocalisation référencés par le contrôle Foundation n'ont pas été retrouvés aux emplacements attendus. | Non exécuté / non prouvé |
| T-B03-03 | B | Non localisé | Aucun test Réel direct localisé. Les chemins Scan de géolocalisation référencés par le contrôle Foundation n'ont pas été retrouvés aux emplacements attendus. | Non exécuté / non prouvé |
| T-B03-04 | B | Non localisé | Aucun test Réel direct localisé. Les chemins Scan de géolocalisation référencés par le contrôle Foundation n'ont pas été retrouvés aux emplacements attendus. | Non exécuté / non prouvé |
| T-B03-05 | B | Non localisé | Aucun test Réel direct localisé. Les chemins Scan de géolocalisation référencés par le contrôle Foundation n'ont pas été retrouvés aux emplacements attendus. | Non exécuté / non prouvé |
| T-B03-06 | B | Non localisé | Aucun test Réel direct localisé. Les chemins Scan de géolocalisation référencés par le contrôle Foundation n'ont pas été retrouvés aux emplacements attendus. | Non exécuté / non prouvé |
| T-B03-07 | B | Non localisé | Aucun test Réel direct localisé. Les chemins Scan de géolocalisation référencés par le contrôle Foundation n'ont pas été retrouvés aux emplacements attendus. | Non exécuté / non prouvé |
| T-B03-08 | B | Non localisé | Aucun test Réel direct localisé. Les chemins Scan de géolocalisation référencés par le contrôle Foundation n'ont pas été retrouvés aux emplacements attendus. | Non exécuté / non prouvé |
| T-B03-09 | B | Non localisé | Aucun test Réel direct localisé. Les chemins Scan de géolocalisation référencés par le contrôle Foundation n'ont pas été retrouvés aux emplacements attendus. | Non exécuté / non prouvé |
| T-B03-10 | B | Non localisé | Aucun test Réel direct localisé. Les chemins Scan de géolocalisation référencés par le contrôle Foundation n'ont pas été retrouvés aux emplacements attendus. | Non exécuté / non prouvé |
| T-B03-11 | B | Non localisé | Aucun test Réel direct localisé. Les chemins Scan de géolocalisation référencés par le contrôle Foundation n'ont pas été retrouvés aux emplacements attendus. | Non exécuté / non prouvé |
| T-B03-12 | B | Non localisé | Aucun test Réel direct localisé. Les chemins Scan de géolocalisation référencés par le contrôle Foundation n'ont pas été retrouvés aux emplacements attendus. | Non exécuté / non prouvé |
| T-B03-13 | B | Non localisé | Aucun test Réel direct localisé. Les chemins Scan de géolocalisation référencés par le contrôle Foundation n'ont pas été retrouvés aux emplacements attendus. | Non exécuté / non prouvé |
| T-C01-01 | C01 | Non localisé | Aucun test de consultation de profil Réel direct localisé. | Non exécuté / non prouvé |
| T-C01-02 | C01 | Non localisé | Aucun test de consultation de profil Réel direct localisé. | Non exécuté / non prouvé |
| T-C01-03 | C01 | Non localisé | Aucun test de consultation de profil Réel direct localisé. | Non exécuté / non prouvé |
| T-C01-04 | C01 | Non localisé | Aucun test de consultation de profil Réel direct localisé. | Non exécuté / non prouvé |
| T-C01-05 | C01 | Non localisé | Aucun test de consultation de profil Réel direct localisé. | Non exécuté / non prouvé |
| T-C01-06 | C01 | Non localisé | Aucun test de consultation de profil Réel direct localisé. | Non exécuté / non prouvé |
| T-C02-01 | C02 | Non localisé | Aucun test de demande de contact Réel direct localisé. | Non exécuté / non prouvé |
| T-C02-02 | C02 | Non localisé | Aucun test de demande de contact Réel direct localisé. | Non exécuté / non prouvé |
| T-C02-03 | C02 | Non localisé | Aucun test de demande de contact Réel direct localisé. | Non exécuté / non prouvé |
| T-C02-04 | C02 | Non localisé | Aucun test de demande de contact Réel direct localisé. | Non exécuté / non prouvé |
| T-C02-05 | C02 | Non localisé | Aucun test de demande de contact Réel direct localisé. | Non exécuté / non prouvé |
| T-C02-06 | C02 | Non localisé | Aucun test de demande de contact Réel direct localisé. | Non exécuté / non prouvé |
| T-C02-07 | C02 | Non localisé | Aucun test de demande de contact Réel direct localisé. | Non exécuté / non prouvé |
| T-C02-08 | C02 | Non localisé | Aucun test de demande de contact Réel direct localisé. | Non exécuté / non prouvé |
| T-C02-09 | C02 | Non localisé | Aucun test de demande de contact Réel direct localisé. | Non exécuté / non prouvé |
| T-C02-10 | C02 | Non localisé | Aucun test de demande de contact Réel direct localisé. | Non exécuté / non prouvé |
| T-C02-11 | C02 | Non localisé | Aucun test de demande de contact Réel direct localisé. | Non exécuté / non prouvé |
| T-C03-01 | C03 | Non localisé | Aucun test de conversation Réel direct localisé. Les tests sync et assistant sont transversaux et ne vérifient pas les règles de chat Réel. | Non exécuté / non prouvé |
| T-C03-02 | C03 | Non localisé | Aucun test de conversation Réel direct localisé. Les tests sync et assistant sont transversaux et ne vérifient pas les règles de chat Réel. | Non exécuté / non prouvé |
| T-C03-03 | C03 | Non localisé | Aucun test de conversation Réel direct localisé. Les tests sync et assistant sont transversaux et ne vérifient pas les règles de chat Réel. | Non exécuté / non prouvé |
| T-C03-04 | C03 | Non localisé | Aucun test de conversation Réel direct localisé. Les tests sync et assistant sont transversaux et ne vérifient pas les règles de chat Réel. | Non exécuté / non prouvé |
| T-C03-05 | C03 | Non localisé | Aucun test de conversation Réel direct localisé. Les tests sync et assistant sont transversaux et ne vérifient pas les règles de chat Réel. | Non exécuté / non prouvé |
| T-C03-06 | C03 | Non localisé | Aucun test de conversation Réel direct localisé. Les tests sync et assistant sont transversaux et ne vérifient pas les règles de chat Réel. | Non exécuté / non prouvé |
| T-C03-07 | C03 | Non localisé | Aucun test de conversation Réel direct localisé. Les tests sync et assistant sont transversaux et ne vérifient pas les règles de chat Réel. | Non exécuté / non prouvé |
| T-C03-08 | C03 | Non localisé | Aucun test de conversation Réel direct localisé. Les tests sync et assistant sont transversaux et ne vérifient pas les règles de chat Réel. | Non exécuté / non prouvé |
| T-C03-09 | C03 | Non localisé | Aucun test de conversation Réel direct localisé. Les tests sync et assistant sont transversaux et ne vérifient pas les règles de chat Réel. | Non exécuté / non prouvé |
| T-C03-10 | C03 | Non localisé | Aucun test de conversation Réel direct localisé. Les tests sync et assistant sont transversaux et ne vérifient pas les règles de chat Réel. | Non exécuté / non prouvé |
| T-C03-11 | C03 | Non localisé | Aucun test de conversation Réel direct localisé. Les tests sync et assistant sont transversaux et ne vérifient pas les règles de chat Réel. | Non exécuté / non prouvé |
| T-C03-12 | C03 | Non localisé | Aucun test de conversation Réel direct localisé. Les tests sync et assistant sont transversaux et ne vérifient pas les règles de chat Réel. | Non exécuté / non prouvé |
| T-C03-13 | C03 | Non localisé | Aucun test de conversation Réel direct localisé. Les tests sync et assistant sont transversaux et ne vérifient pas les règles de chat Réel. | Non exécuté / non prouvé |
| T-C03-14 | C03 | Non localisé | Aucun test de conversation Réel direct localisé. Les tests sync et assistant sont transversaux et ne vérifient pas les règles de chat Réel. | Non exécuté / non prouvé |
| T-C03-15 | C03 | Non localisé | Aucun test de conversation Réel direct localisé. Les tests sync et assistant sont transversaux et ne vérifient pas les règles de chat Réel. | Non exécuté / non prouvé |
| T-C03-16 | C03 | Non localisé | Aucun test de conversation Réel direct localisé. Les tests sync et assistant sont transversaux et ne vérifient pas les règles de chat Réel. | Non exécuté / non prouvé |
| T-C03-17 | C03 | Non localisé | Aucun test de conversation Réel direct localisé. Les tests sync et assistant sont transversaux et ne vérifient pas les règles de chat Réel. | Non exécuté / non prouvé |
| T-C03-18 | C03 | Non localisé | Aucun test de conversation Réel direct localisé. Les tests sync et assistant sont transversaux et ne vérifient pas les règles de chat Réel. | Non exécuté / non prouvé |
| T-C03-19 | C03 | Non localisé | Aucun test de conversation Réel direct localisé. Les tests sync et assistant sont transversaux et ne vérifient pas les règles de chat Réel. | Non exécuté / non prouvé |
| T-C03-20 | C03 | Non localisé | Aucun test de conversation Réel direct localisé. Les tests sync et assistant sont transversaux et ne vérifient pas les règles de chat Réel. | Non exécuté / non prouvé |
| T-C03-21 | C03 | Non localisé | Aucun test de conversation Réel direct localisé. Les tests sync et assistant sont transversaux et ne vérifient pas les règles de chat Réel. | Non exécuté / non prouvé |
| T-C03-22 | C03 | Non localisé | Aucun test de conversation Réel direct localisé. Les tests sync et assistant sont transversaux et ne vérifient pas les règles de chat Réel. | Non exécuté / non prouvé |
| T-C03-23 | C03 | Non localisé | Aucun test de conversation Réel direct localisé. Les tests sync et assistant sont transversaux et ne vérifient pas les règles de chat Réel. | Non exécuté / non prouvé |
| T-C03-24 | C03 | Non localisé | Aucun test de conversation Réel direct localisé. Les tests sync et assistant sont transversaux et ne vérifient pas les règles de chat Réel. | Non exécuté / non prouvé |
| T-C03-25 | C03 | Non localisé | Aucun test de conversation Réel direct localisé. Les tests sync et assistant sont transversaux et ne vérifient pas les règles de chat Réel. | Non exécuté / non prouvé |
| T-C03-26 | C03 | Non localisé | Aucun test de conversation Réel direct localisé. Les tests sync et assistant sont transversaux et ne vérifient pas les règles de chat Réel. | Non exécuté / non prouvé |
| T-C03-27 | C03 | Non localisé | Aucun test de conversation Réel direct localisé. Les tests sync et assistant sont transversaux et ne vérifient pas les règles de chat Réel. | Non exécuté / non prouvé |
| T-C03-28 | C03 | Non localisé | Aucun test de conversation Réel direct localisé. Les tests sync et assistant sont transversaux et ne vérifient pas les règles de chat Réel. | Non exécuté / non prouvé |
| T-C03-29 | C03 | Non localisé | Aucun test de conversation Réel direct localisé. Les tests sync et assistant sont transversaux et ne vérifient pas les règles de chat Réel. | Non exécuté / non prouvé |
| T-C03-30 | C03 | Non localisé | Aucun test de conversation Réel direct localisé. Les tests sync et assistant sont transversaux et ne vérifient pas les règles de chat Réel. | Non exécuté / non prouvé |
| T-C03-31 | C03 | Non localisé | Aucun test de conversation Réel direct localisé. Les tests sync et assistant sont transversaux et ne vérifient pas les règles de chat Réel. | Non exécuté / non prouvé |
| T-C03-32 | C03 | Non localisé | Aucun test de conversation Réel direct localisé. Les tests sync et assistant sont transversaux et ne vérifient pas les règles de chat Réel. | Non exécuté / non prouvé |
| T-C04-01 | C04 | Non localisé | Aucun test de fin de connexion ou de blocage Réel direct localisé. | Non exécuté / non prouvé |
| T-C04-02 | C04 | Non localisé | Aucun test de fin de connexion ou de blocage Réel direct localisé. | Non exécuté / non prouvé |
| T-C04-03 | C04 | Non localisé | Aucun test de fin de connexion ou de blocage Réel direct localisé. | Non exécuté / non prouvé |
| T-C04-04 | C04 | Non localisé | Aucun test de fin de connexion ou de blocage Réel direct localisé. | Non exécuté / non prouvé |
| T-C04-05 | C04 | Non localisé | Aucun test de fin de connexion ou de blocage Réel direct localisé. | Non exécuté / non prouvé |
| T-C04-06 | C04 | Non localisé | Aucun test de fin de connexion ou de blocage Réel direct localisé. | Non exécuté / non prouvé |
| T-C04-07 | C04 | Non localisé | Aucun test de fin de connexion ou de blocage Réel direct localisé. | Non exécuté / non prouvé |
| T-C04-08 | C04 | Non localisé | Aucun test de fin de connexion ou de blocage Réel direct localisé. | Non exécuté / non prouvé |
| T-C04-09 | C04 | Non localisé | Aucun test de fin de connexion ou de blocage Réel direct localisé. | Non exécuté / non prouvé |
| T-C04-10 | C04 | Non localisé | Aucun test de fin de connexion ou de blocage Réel direct localisé. | Non exécuté / non prouvé |
| T-C04-11 | C04 | Non localisé | Aucun test de fin de connexion ou de blocage Réel direct localisé. | Non exécuté / non prouvé |
| T-C04-12 | C04 | Non localisé | Aucun test de fin de connexion ou de blocage Réel direct localisé. | Non exécuté / non prouvé |
| T-C04-13 | C04 | Non localisé | Aucun test de fin de connexion ou de blocage Réel direct localisé. | Non exécuté / non prouvé |
| T-C04-14 | C04 | Non localisé | Aucun test de fin de connexion ou de blocage Réel direct localisé. | Non exécuté / non prouvé |
| T-C04-15 | C04 | Non localisé | Aucun test de fin de connexion ou de blocage Réel direct localisé. | Non exécuté / non prouvé |
| T-C04-16 | C04 | Non localisé | Aucun test de fin de connexion ou de blocage Réel direct localisé. | Non exécuté / non prouvé |
| T-C04-17 | C04 | Non localisé | Aucun test de fin de connexion ou de blocage Réel direct localisé. | Non exécuté / non prouvé |
| T-C04-18 | C04 | Non localisé | Aucun test de fin de connexion ou de blocage Réel direct localisé. | Non exécuté / non prouvé |
| T-C04-19 | C04 | Non localisé | Aucun test de fin de connexion ou de blocage Réel direct localisé. | Non exécuté / non prouvé |
| T-P01-01 | P | Non localisé | Aucun test de confidentialité Réel direct localisé. Le test safe-log ne couvre que la rédaction de secrets/logs, pas les règles GPS ou messages Réel. | Non exécuté / non prouvé |
| T-P01-02 | P | Non localisé | Aucun test de confidentialité Réel direct localisé. Le test safe-log ne couvre que la rédaction de secrets/logs, pas les règles GPS ou messages Réel. | Non exécuté / non prouvé |
| T-P01-03 | P | Non localisé | Aucun test de confidentialité Réel direct localisé. Le test safe-log ne couvre que la rédaction de secrets/logs, pas les règles GPS ou messages Réel. | Non exécuté / non prouvé |
| T-P02-01 | P | Non localisé | Aucun test de confidentialité Réel direct localisé. Le test safe-log ne couvre que la rédaction de secrets/logs, pas les règles GPS ou messages Réel. | Non exécuté / non prouvé |
| T-P02-02 | P | Non localisé | Aucun test de confidentialité Réel direct localisé. Le test safe-log ne couvre que la rédaction de secrets/logs, pas les règles GPS ou messages Réel. | Non exécuté / non prouvé |
| T-P02-03 | P | Non localisé | Aucun test de confidentialité Réel direct localisé. Le test safe-log ne couvre que la rédaction de secrets/logs, pas les règles GPS ou messages Réel. | Non exécuté / non prouvé |
| T-P02-04 | P | Non localisé | Aucun test de confidentialité Réel direct localisé. Le test safe-log ne couvre que la rédaction de secrets/logs, pas les règles GPS ou messages Réel. | Non exécuté / non prouvé |
| T-P03-01 | P | Non localisé | Aucun test de confidentialité Réel direct localisé. Le test safe-log ne couvre que la rédaction de secrets/logs, pas les règles GPS ou messages Réel. | Non exécuté / non prouvé |
| T-P03-02 | P | Non localisé | Aucun test de confidentialité Réel direct localisé. Le test safe-log ne couvre que la rédaction de secrets/logs, pas les règles GPS ou messages Réel. | Non exécuté / non prouvé |
| T-P03-03 | P | Non localisé | Aucun test de confidentialité Réel direct localisé. Le test safe-log ne couvre que la rédaction de secrets/logs, pas les règles GPS ou messages Réel. | Non exécuté / non prouvé |
| T-P04-01 | P | Non localisé | Aucun test de confidentialité Réel direct localisé. Le test safe-log ne couvre que la rédaction de secrets/logs, pas les règles GPS ou messages Réel. | Non exécuté / non prouvé |
| T-P04-02 | P | Non localisé | Aucun test de confidentialité Réel direct localisé. Le test safe-log ne couvre que la rédaction de secrets/logs, pas les règles GPS ou messages Réel. | Non exécuté / non prouvé |
| T-P04-03 | P | Non localisé | Aucun test de confidentialité Réel direct localisé. Le test safe-log ne couvre que la rédaction de secrets/logs, pas les règles GPS ou messages Réel. | Non exécuté / non prouvé |
| T-P04-04 | P | Non localisé | Aucun test de confidentialité Réel direct localisé. Le test safe-log ne couvre que la rédaction de secrets/logs, pas les règles GPS ou messages Réel. | Non exécuté / non prouvé |

## 4. Tests transversaux réellement localisés

| Fichier réel | Ce qu'il vérifie | Ce qu'il ne prouve pas pour Réel |
| --- | --- | --- |
| `tests/sync/engine.test.ts` | Push avant pull, conservation de l'outbox hors ligne, limite de pagination | Aucun statut, demande, connexion, blocage ou chat Réel |
| `tests/sync/protocol.test.ts` | Validation stricte du protocole, champs inconnus/protégés, curseurs, identifiants de mutation | Aucun contrat Réel spécifique |
| `tests/sync-validation.test.ts` | Validation des mutations et refus de champs système | Aucune transition métier Réel |
| `tests/offline/diagnostics.test.ts` | Compteurs d'actions en attente, ancienneté, quarantaine et seuils d'état | Aucune reprise métier d'une demande ou conversation Réel |
| `supabase/tests/database/rls_core.test.sql` | Tests pgTAP de tables de base et isolation générale | Ne teste pas les demandes, connexions, blocages ou conversations Réel |
| `tests/assistant/privacy-isolation.test.ts` | Isolation du stockage local de conversations de l'assistant entre comptes | Ne teste pas le chat Réel |
| `tests/observability/safe-log.test.ts` | Masquage de secrets et limitation des logs | Ne prouve pas l'absence de GPS exact ou de contenu Réel dans tous les payloads/logs |
| `tests/security/security-headers.test.ts` | En-têtes HTTP de sécurité | Aucun comportement fonctionnel Réel |
| `src/tests/flash/flash-intent.test.ts` | Analyse déterministe d'intentions Flash | Aucun statut ou cycle de vie Réel |

Ces fichiers sont des preuves de tests présents dans le dépôt. Leur présence ne signifie pas que le run CI de la PR #28 les a exécutés.

## 5. Chemins de tests attendus mais non retrouvés

Le script `src/scripts/check-foundation.mjs` référence notamment les chemins suivants. Les recherches/fetch effectués n'ont pas permis de les retrouver à ces emplacements :

- `tests/flash/flash-contract.test.ts`
- `tests/flash/flash-mapping.test.ts`
- `tests/flash/public-flash-feed.test.ts`
- `tests/scan/geolocation-privacy.test.ts`
- `tests/scan/scan-realtime-stability.test.ts`
- `tests/sync/offline-reconnect.e2e.test.ts`
- `tests/sync/conflict-recovery.e2e.test.ts`
- `supabase/tests/database/90_flash_lifecycle_rls.test.sql`
- `supabase/tests/database/100_scan_location_privacy.test.sql`
- `supabase/tests/database/110_public_flash_feed_security.test.sql`

Le script Foundation contient aussi de nombreux chemins obligatoires pour d'autres domaines. Leur vérification effective n'a pas été atteinte dans le run examiné. Il faudra distinguer les fichiers absents, déplacés, renommés et les références obsolètes après un inventaire complet.

## 6. Preuve CI — PR #28

Run examiné : [Quality — run 41991407836](https://github.com/dollarstam5/hello-world-project/actions/runs/41991407836)

| Étape du job | Résultat observé |
| --- | --- |
| Installation des dépendances | Réussie |
| `bun run check:foundation` | Échec |
| Sous-étape `bun run lint` | Échec : 499 erreurs, 8 avertissements |
| Sous-étape `bun run test:run` | Non exécutée, car la commande est chaînée après lint avec `&&` |
| Tests RLS Supabase | Sautés |
| Contrôle Release | Sauté |
| Tests navigateur/mobile | Sautés |
| Dependency review | Réussie dans le run séparé |

Le script `package.json` définit `check:foundation` comme `bun run lint && bun run test:run`. Le lint étant en échec, les tests Vitest ne sont pas lancés. Il est donc incorrect de conclure que les tests Réel ont échoué : ils n'ont pas été exécutés dans ce run. Il est tout aussi incorrect de conclure qu'ils ont réussi.

## 7. Écarts et suites à traiter

| Priorité | Écart | Suite recommandée |
| --- | --- | --- |
| P0 — preuve | Aucun test direct Réel localisé | Inventorier le runtime, les contrats et le modèle avant de définir les suites exactes |
| P0 — CI | Lint en échec, tests non exécutés | Traiter le blocage Quality dans un lot distinct ; ne pas masquer le résultat par un rerun sans correction |
| P1 — sécurité | RLS Réel non démontrée | Identifier les tables/relations réellement utilisées, puis construire les tests par rôle et relation |
| P1 — localisation | Tests Scan attendus non retrouvés | Vérifier les chemins et l'implémentation existante avant de conclure à une absence |
| P1 — chat | Aucun test de conversation Réel | Définir les contrats et transitions après revue API/données |
| P2 — offline/coûts | Tests transversaux seulement | Définir les scénarios Réel offline/idempotence et les plafonds mesurables |

## 8. Conditions de mise à jour

Pour faire évoluer un scénario de « Non localisé » vers un statut de couverture :

1. fournir le chemin réel du test ;
2. vérifier que son assertion correspond exactement à l'exigence ;
3. identifier les fixtures, rôles et données testés ;
4. enregistrer le run CI ou le rapport local ;
5. vérifier le résultat ;
6. conserver le lien de preuve et la date de contrôle.

Un test présent mais non exécuté reste « présent — exécution non prouvée ». Un test exécuté mais en échec reste « exécuté — échec ». Un test qui ne couvre qu'une partie du scénario reste « couverture partielle ».

## 9. Conclusion

Cette réconciliation donne un état conservateur et traçable : **160 scénarios Réel, aucun test direct localisé et aucune exécution Réel prouvée dans le run CI examiné**. Des tests transversaux existent, mais ils ne remplacent pas les preuves métier attendues.

Cette conclusion ne signifie ni que toutes les fonctions Réel sont absentes du runtime, ni que les 160 tests doivent être créés sans analyse préalable. La prochaine étape est l'inventaire des contrats API, du modèle de données, des migrations et des composants runtime existants, afin de définir une couverture réaliste sans doublons.

**Périmètre de cette réconciliation :** documentation et inspection en lecture seule. Aucun code, test, schéma, migration, politique RLS, authentification ou ticket TECH n'a été modifié ou clôturé.
