# Réconciliation fichier par fichier — Lot 12

**Branche :** `docs/lot12-engines-migration`  
**Base de comparaison :** `main` au point de départ de la PR #25.  
**Périmètre :** les 28 chemins déclarés modifiés par la PR #25.  
**Nature du contrôle :** revue documentaire et vérification ciblée des chemins/liens ; aucun test runtime n'est réputé passé sur la seule base de cette revue.

## Règles de décision

- Un déplacement de fichier ne signifie pas que son contenu est consolidé dans une référence canonique.
- Les documents de moteur et les contrats API historiques décrivent des intentions, sauf preuve runtime indépendante.
- Aucun candidat historique supplémentaire n'est supprimé par cette réconciliation.
- Aucun test sauté n'est marqué comme réussi. Quality #234 s'arrête au contrôle Foundation/secrets sur des erreurs de formatage/lint déjà observées sur `main` dans Quality #233 ; les étapes suivantes restent non vérifiées.
- TECH-001 à TECH-006 restent ouverts jusqu'à résolution et preuve spécifiques.

## A. Sources déplacées — contrôle individuel

| # | Ancien chemin → chemin de branche | Dépendances / consommateurs à contrôler | Contrôle disponible / attendu | Correction ou décision |
|---:|---|---|---|---|
| 1 | `docs/11-VITALA-UJ-08-FLASH-ENGINE.md` → `docs/03-engines/flash/11-VITALA-UJ-08-FLASH-ENGINE.md` | Index des moteurs, références produit UJ-08, liens entrants hors index | Liens relatifs sortants contrôlés ; rechercher les liens entrants globaux avant retrait éventuel | Déplacement documentaire seulement ; conserver le contenu historique et ne pas conclure à l'implémentation Flash |
| 2 | `docs/6. Flash API.md` → `docs/03-engines/flash/6. Flash API.md` | Index API, `flash-api.md`, runtime Flash, appelants/tests éventuels | Liens relatifs sortants contrôlés ; vérifier séparément contrat ↔ handlers et tests | Garder comme contrat historique ; ne pas supprimer la source au seul motif que l'index canonique existe |
| 3 | `docs/12-VITALA-UJ-09-SCAN-ENGINE.md` → `docs/03-engines/scan/12-VITALA-UJ-09-SCAN-ENGINE.md` | Index des moteurs, parcours UJ-09, Scan module, code et tests Scan | Liens sortants contrôlés ; `check-foundation.mjs` référence désormais le module Scan classé | Maintenir séparés le classement documentaire et la preuve de couverture du parcours/runtime |
| 4 | `docs/SCAN_MODULE.md` → `docs/03-engines/scan/SCAN_MODULE.md` | `src/scripts/check-foundation.mjs`, domaine Scan, tests de confidentialité/localisation | Chemin requis par le script aligné ; test CI bloqué avant la suite des contrôles | Ne pas toucher au comportement Scan dans ce lot ; valider le script via Quality quand le blocage préexistant est traité |
| 5 | `docs/RADAR_MODULE.md` → `docs/03-engines/radar/RADAR_MODULE.md` | `src/scripts/check-foundation.mjs`, contrats Radar, domaine et tests Radar | Chemin requis par le script aligné ; tests après Foundation non exécutés dans Quality #234 | Garder le déplacement ; vérifier les tests Radar séparément quand la CI peut atteindre ces étapes |
| 6 | `docs/9. Radar API.md` → `docs/03-engines/radar/9. Radar API.md` | `radar-api.md`, handlers éventuels, contrats et tests Radar | Liens sortants contrôlés ; contrat/runtime non certifié par ce déplacement | Marquer explicitement comme contrat historique jusqu'à vérification route par route |
| 7 | `docs/7. Mission API.md` → `docs/03-engines/missions/7. Mission API.md` | Missions, contrats partagés, transitions SQL/RLS et tests de mission | Liens sortants contrôlés ; aucune validation runtime induite par le déplacement | Conserver ; rapprocher du code/tests lors de la réconciliation API, sans modifier le runtime ici |
| 8 | `docs/03A-VITALA-TRUST-ENGINE-V1 Partie 1.md` → `docs/03-engines/trust/03A-VITALA-TRUST-ENGINE-V1 Partie 1.md` | Trust Levels, domaine Trust, identité UDI, index archive | Liens sortants contrôlés ; couverture de contenu non encore comparée section par section | Conserver comme source historique et comparer les règles uniques avant tout retrait |
| 9 | `docs/03A-VITALA-TRUST-ENGINE-V1 Partie 2.md` → `docs/03-engines/trust/03A-VITALA-TRUST-ENGINE-V1 Partie 2.md` | Même ensemble Trust/UDI, décisions et renvois entre parties | Liens sortants contrôlés ; cohérence inter-parties à relire lors de la consolidation | Aucun retrait ; vérifier la continuité et les décisions uniques avec les parties 1 et 3 |
| 10 | `docs/03A-VITALA-TRUST-ENGINE-V1 Partie 3.md` → `docs/03-engines/trust/03A-VITALA-TRUST-ENGINE-V1 Partie 3.md` | Même ensemble Trust/UDI, index des moteurs et archive | Liens sortants contrôlés ; couverture non certifiée | Aucun retrait ; vérifier les renvois et les éléments non repris par le domaine Trust canonique |
| 11 | `docs/03A-VITALA-TRUST-ENGINE-V1.md Mise � jour.md` → `docs/03-engines/trust/03A-VITALA-TRUST-ENGINE-V1.md Mise � jour.md` | Index Trust, liens avec les trois parties, chemin Unicode/mal encodé | Lien du nouvel index présent ; nom encodé conservé intentionnellement | Ne pas renommer sans inventaire des liens entrants et validation explicite du chemin |
| 12 | `docs/8. Trust API.md` → `docs/03-engines/trust/8. Trust API.md` | `trust-api.md`, inventaire runtime, contrat Trust historique | Contenu comparé à l'identique avant résolution du doublon ; liens sortants contrôlés | Conserver une seule copie classée dans la branche ; ne pas assimiler le contrat à des routes runtime disponibles |
| 13 | `docs/10. Veille API.md` → `docs/03-engines/veille/10. Veille API.md` | Index moteurs/API, UDI transversal, handlers/tests éventuels | Liens sortants contrôlés ; routes Veille non confirmées par l'inventaire runtime | Conserver comme contrat historique ; UDI reste séparée |
| 14 | `docs/14-VITALA-VEILLE-ENGINE.md Partie 1.md` → `docs/03-engines/veille/14-VITALA-VEILLE-ENGINE.md Partie 1.md` | Parties 2/3, index | Liens sortants contrôlés ; la copie exacte `Partie 1(1)` a été retirée dans la PR #25 après comparaison du blob Git | La partie 1 sans suffixe est conservée ; aucune suppression additionnelle n'est proposée ici |
| 15 | `docs/14-VITALA-VEILLE-ENGINE.md Partie 2.md` → `docs/03-engines/veille/14-VITALA-VEILLE-ENGINE.md Partie 2.md` | Parties 1/3, index, contenu UDI mal nommé à distinguer | Liens sortants contrôlés | Conserver ; s'assurer que les renvois de série pointent vers les trois parties classées |
| 16 | `docs/14-VITALA-VEILLE-ENGINE.md Partie 3.md` → `docs/03-engines/veille/14-VITALA-VEILLE-ENGINE.md Partie 3.md` | Parties 1/2, index, UDI transversal | Liens sortants contrôlés | Conserver ; aucune consolidation ni suppression déclarée |
| 17 | `docs/11._Recommendation_API.md` → `docs/03-engines/recommendation/11._Recommendation_API.md` | Index moteurs/API, architecture backend, handlers/tests de recommandation éventuels | Liens sortants contrôlés ; route runtime non confirmée dans l'inventaire actuel | Conserver comme contrat historique ; vérifier méthode/route/auth/schéma avant toute affirmation d'implémentation |

## B. Index, registres et contrôle de fondation

| # | Fichier modifié | Dépendances / consommateurs | Contrôle disponible / attendu | Correction ou décision |
|---:|---|---|---|---|
| 18 | `docs/03-engines/README.md` | Les 17 sources classées, UDI, doublon Veille | Tous les liens relatifs de l'index contrôlés | Index de classement ; maintenir la note que le classement ne certifie pas le runtime |
| 19 | `docs/README.md` | Tous les index de section et registres de migration | Liens relatifs ciblés contrôlés | Conserver les entrées migration et la convention d'approbation préalable |
| 20 | `docs/03-api/README.md` | Pages API canoniques et contrats historiques classés | Liens relatifs ciblés contrôlés | Signaler les pages « link-only » et distinguer index canonique du contrat historique complet |
| 21 | `docs/03-api/contract-runtime-status.md` | Backend API, sync API, contrats moteur, TECH-001/002/003 | Liens ciblés contrôlés ; l'inventaire indique que les routes métier restent non confirmées | Maintenir les limites de preuve et le constat de divergence du pull Sync ; ne pas marquer TECH clos |
| 22 | `docs/03-api/flash-api.md` | Contrat Flash historique, domaine Flash, tests | Lien vers source classée vérifié | Le rôle de page d'entrée doit rester explicite ; ne pas présenter le renvoi comme consolidation complète |
| 23 | `docs/03-api/trust-api.md` | Contrat Trust classé, domaine Trust, TECH lié | Lien vers source classée vérifié | Garder la distinction Trust Engine / niveaux de confiance / routes runtime |
| 24 | `docs/03-api/radar-api.md` | Contrat Radar classé, domaine Radar, tests | Lien vers source classée vérifié | Page d'entrée seulement tant que les clauses contractuelles n'ont pas été intégrées et vérifiées |
| 25 | `docs/07-annexes/documentation-migration-map.md` | Index canonique, index archive, liste de suppressions, TECH-001..006 | Liens ciblés vérifiés | Conserver les statuts « à comparer/non confirmé » ; la cartographie n'est pas une validation de couverture |
| 26 | `docs/archive/README.md` | Chemins historiques et liens entrants, encodage des noms | Liens ciblés contrôlés ; certains chemins historiques restent à vérifier exactement | Ne pas corriger les noms encodés à l'aveugle ; faire un inventaire exact avant renommage |
| 27 | `docs/07-annexes/proposed-document-removals.md` | Audit de couverture, cartographie, liens entrants, approbation utilisateur | Liens ciblés contrôlés | Maintenir les propositions séparées ; aucune suppression additionnelle autorisée |
| 28 | `src/scripts/check-foundation.mjs` | Chemins Scan/Radar, contrôle CI Foundation, documents requis | Diff limité aux deux chemins déplacés ; Quality échoue avant la suite à cause d'erreurs format/lint préexistantes sur `main` également | Ne pas lancer de formatage global. Après résolution séparée du blocage CI, vérifier que le script passe et que tous les contrôles aval s'exécutent |

## C. Dépendances et tests à traiter dans la suite

| Contrôle | État constaté | Prochaine correction / preuve attendue |
|---|---|---|
| Liens relatifs sortants des 17 sources déplacées | Contrôle ciblé effectué ; aucune cible cassée relevée dans ce lot de contrôle | Conserver le contrôle reproductible dans la revue de PR |
| Liens des index et registres touchés | Contrôle ciblé effectué ; aucune cible cassée relevée dans ce lot de contrôle | Refaire le contrôle après tout changement de chemin |
| Liens entrants depuis tout le dépôt vers les anciens chemins | Pas considéré comme exhaustivement prouvé par les seuls contrôles de liens sortants | Rechercher les anciens chemins dans tout le dépôt, y compris scripts, tests et docs hors index |
| `check-foundation.mjs` | Deux références de chemin ajustées ; pas de preuve d'exécution réussie après modification | Exécuter le script/Quality lorsque le blocage de formatage/lint est levé ou isolé |
| Formatage/lint Quality #234 | Échec avant tests aval ; 430 erreurs et 7 avertissements, même famille d'échec observée sur main dans Quality #233 | Ne pas attribuer ces erreurs à Lot 12 sans diff causal ; corriger dans un lot de qualité distinct, sans reformatage global ici |
| Tests RLS, release, Chromium/mobile/offline | Sautés après l'échec du contrôle Foundation | État **non vérifié**, pas « réussi » ; réexécuter après déblocage de CI |
| Contrats API métier | L'inventaire runtime ne confirme pas plusieurs chemins historiques Flash/Trust/Radar/Veille/Recommendation/Mission | Revue route par route : handler, méthode, schéma, auth, autorisation, erreurs, tests, puis déploiement si pertinent |
| Doublon Veille `Partie 1(1)` | Conservé | Comparer le contenu complet et les liens entrants ; demander décision explicite distincte |
| Sources UDI historiques | Conservées aux chemins historiques | Décider le classement transversal séparément ; ne pas les ranger sous Veille sur la base du nom |
| TECH-001 à TECH-006 | Ouverts | Maintenir le registre jusqu'à correction technique et vérification dédiées |

## D. Conclusion de réconciliation

**Résultat : réconciliation documentaire de la PR #25 effectuée pour les 28 chemins modifiés**, avec dépendances, contrôles disponibles et corrections proposées consignés ci-dessus. Cela valide la cohérence documentaire ciblée des déplacements, pas l'exhaustivité de la migration de l'ensemble du dépôt.

**Restent ouverts avant déclaration de documentation finale :**
1. recherche exhaustive des liens entrants vers les anciens chemins ;
2. comparaison section par section des sources historiques avec les références canoniques sur tous les domaines ;
3. décision explicite fichier par fichier sur les candidats au retrait ;
4. réexécution des tests CI actuellement sautés ;
5. validation distincte des problèmes TECH-001 à TECH-006.

Aucune suppression supplémentaire et aucune fusion de PR ne sont autorisées par ce document.
