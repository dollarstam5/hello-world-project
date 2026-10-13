# Audit préliminaire de couverture documentaire

**Statut :** première passe de comparaison, non exhaustive ; la comparaison Trust/UDI ciblée est consignée séparément.  
**Objet :** identifier les candidats qui ne peuvent pas être retirés sans perte d'information ou changement technique.  
**Portée :** revue documentaire seulement ; aucun code, SQL, migration, configuration ou document historique n'est modifié par cet audit.

## Méthode et limites

Cette passe combine l'inspection des sources historiques et canoniques disponibles, la comparaison de leur structure et de leur contenu visible, ainsi que la recherche de références entrantes dans le dépôt. Elle permet d'identifier des blocages manifestes, mais ne vaut pas encore validation exhaustive, section par section, de chaque candidat.

Les conclusions « conserver » ou « bloqué » ci-dessous sont des décisions de sécurité documentaire provisoires : elles interdisent de proposer un retrait à ce stade. Elles ne prétendent pas certifier l'implémentation en production.

## Résultats préliminaires

| Domaine / candidats | Observation vérifiée | Décision à ce stade | Travail restant |
| --- | --- | --- | --- |
| Vision produit — `docs/01-VITALA - VISION PRODUIT V1.md` | La référence `docs/01-product/vision.md` est principalement une synthèse et recense la source historique ; la reprise complète de toutes les décisions du document V1 n'est pas démontrée. | **Conserver** | Comparer objectifs, périmètre, hypothèses, exclusions et décisions avant de réévaluer. |
| Personas — `docs/02-VITALA - PERSONAS V1.md` | La référence canonique explicite les intentions d'usage et précise que les personas ne sont ni des rôles d'accès ni une progression obligatoire. | **À comparer** | Vérifier chaque persona, ses exemples, transitions et éléments distinctifs de la V1. |
| Trust et UDI — mises à jour des niveaux, mise à jour du Trust Engine, modèles UDI et UDI API | La comparaison dédiée indique que les principes centraux sont largement repris, mais relève des détails non arbitrés (notifications Trust, champs UDI, historisation des intentions) et des formulations historiques à ne pas recopier sans validation (UDI « source de vérité » universelle, exposition des preuves Trust). | **Conserver** | Voir `trust-udi-content-reconciliation.md` ; ne retirer aucune source tant que les écarts, les liens entrants et les contrats runtime ne sont pas vérifiés. |
| Parcours UJ-01 à UJ-07 et annexe commune | Les sources historiques contiennent des étapes, prérequis, états et détails de parcours. La référence canonique apporte des principes et une carte, mais la couverture intégrale de chaque étape n'est pas encore prouvée. Les sources primaires UJ-08/09/10 restent non confirmées aux chemins attendus. | **Conserver en attendant la comparaison** | Comparaison par parcours et résolution séparée des chemins UJ-08/09/10 ; aucune suppression en bloc. |
| Architecture — trois parties V1 | Les trois sources historiques font chacune plusieurs milliers de caractères. `docs/02-architecture/system-architecture.md` est un résumé très court ; d'autres pages canoniques sont détaillées. | **À comparer** | Associer chaque partie historique aux pages canoniques concernées et vérifier les décisions uniques. Le résumé système seul ne remplace pas les trois parties. |
| Données — `docs/04-database/Database Architecture.md`, `docs/04-database/DATA_MODEL.md` | Les sources historiques décrivent le modèle et la persistance. Les pages canoniques de dictionnaire et de schéma sont plus structurées, mais les incertitudes sur les migrations et les reçus d'idempotence restent suivies dans TECH-001/003. | **Conserver pendant la vérification technique** | Comparer champs, relations, règles de suppression, contraintes, grants et RLS ; confronter les constats aux migrations et aux preuves d'environnement. |
| API historiques — Auth, UDI, Flash, Trust, Radar, Sync, Settings | Plusieurs références canoniques Auth/Flash/Trust/Radar sont de courts renvois vers les anciens contrats. Le contrat Sync canonique est plus détaillé et la page d'état runtime distingue contrats historiques et routes observées. | **Conserver** | Les renvois seuls ne constituent pas une consolidation. Comparer les contrats, rechercher les appelants et séparer spécification cible et route réellement observée. TECH-002 reste ouvert. |
| Règles IA — constitution, manuel, rulebook, coding/security/testing | Les références canoniques de coding, sécurité et tests sont actuellement des pages très courtes renvoyant aux sources historiques, tandis que les documents V1 contiennent des règles détaillées. | **Conserver** | Migrer ou comparer les règles et exigences uniques avant tout retrait. TECH-006 reste ouvert. |
| Opérations — déploiement, opérations, performance, Go/No-Go | Certaines pages canoniques sont des renvois courts ; les références de performance et de release sont plus développées. Des scripts du dépôt référencent explicitement des chemins historiques, notamment `docs/OPERATIONS.md`. | **Bloqué pour retrait** | Toute évolution des chemins requis par les scripts relève d'un changement technique distinct, avec tests et autorisation propres. Vérifier aussi les liens et procédures d'exploitation. |
| `docs/07-annexes/PROJECT_BIBLE.md` | Le guide `docs/05-ai/CONTRIBUTING_AI.md` est mis à jour pour pointer vers le chemin actuel ; les scripts `scripts/check-go-no-go.ts` et `scripts/check-global-audit.ts` référencent encore `docs/PROJECT_BIBLE.md`. | **Conserver ; retrait bloqué** | Le chemin consommé par les scripts est une dépendance technique à traiter dans un lot séparé avec tests ; aucune modification de code n'est incluse ici. |
| Reprise après incident — annexe G | La référence canonique est plus développée, mais elle indique elle-même que certaines informations opérationnelles restent à compléter et valider. | **Conserver** | Comparer les procédures, seuils et détails uniques ; obtenir une validation du responsable opérationnel. |
| Catalogues — `API Error Catalog.md`, annexes C et D | Les sources historiques contiennent des catalogues substantiels ; les références canoniques repérées pour le manuel d'erreurs et le glossaire sont très courtes et ne démontrent pas la reprise des catalogues de politiques et d'objets. | **Conserver** | Déterminer les références canoniques cibles, vérifier l'exhaustivité et les usages par les équipes/outils. |
| Expérience et design — VES, `DESIGN_LANGUAGE.md` | Une référence canonique de langage de design existe et est plus développée que le document historique court ; le document VES historique décrit une philosophie d'expérience plus large. | **À comparer** | Vérifier les principes d'expérience, tokens, mouvements, règles et décisions de design uniques ; les chemins actuels sont `docs/01-product/17-Vitala Experience System Partie 1.md` et `docs/00-foundation/DESIGN_LANGUAGE.md`. |
| Performance PWA et problèmes historiques | Les références canoniques de performance sont plus structurées et cadrent certains anciens constats comme hypothèses à revalider, non comme défauts actuels. | **À comparer** | Comparer budgets, méthodes de mesure, contraintes mobiles et décisions ; garder séparés les faits mesurés et les anciennes hypothèses. |

## Conséquences pour la liste des suppressions proposées

1. **Aucun fichier n'est déclaré supprimable sur la base de cette première passe.**
2. Les pages canoniques qui sont des renvois doivent être complétées ou leur rôle limité à celui d'un index clairement assumé avant de retirer la source historique.
3. Les documents contenant des contrats API, des schémas, des règles de sécurité, des procédures d'exploitation ou des décisions produit uniques restent conservés jusqu'à comparaison et validation appropriées.
4. Les références de chemins historiques consommées par les scripts sont des blocages distincts d'une simple consolidation rédactionnelle.
5. Les problèmes TECH-001 à TECH-006 restent ouverts. Cet audit ne les résout pas et ne modifie aucun artefact technique.

La comparaison ciblée des sources historiques Trust/UDI est consignée dans [trust-udi-content-reconciliation.md](./trust-udi-content-reconciliation.md) ; aucun retrait n'y est autorisé.

## Critères avant toute nouvelle décision

Pour chaque fichier candidat, consigner séparément : (a) existence et chemin exacts, (b) sections et règles uniques, (c) référence canonique de remplacement, (d) liens entrants et consommateurs techniques, (e) décision proposée — conserver, archiver, déplacer ou supprimer — et (f) approbation explicite requise avant toute action destructive.
