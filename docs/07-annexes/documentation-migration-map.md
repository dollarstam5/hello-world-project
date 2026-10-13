# Cartographie de migration documentaire

**Lot 12 — Étape 1 : cartographie et index.**  
**Statut :** inventaire documentaire établi à partir des index canoniques et des registres présents dans le dépôt. Ce document ne certifie pas que chaque ancien contenu a été intégralement repris ni que l'implémentation décrite existe en production.

## Règles de lecture

- **Canonique** : référence à consulter et modifier pour les travaux actifs.
- **Historique recensé** : source conservée pour traçabilité ; elle ne doit pas être modifiée ou supprimée automatiquement.
- **À comparer** : le contenu doit être comparé à la référence canonique avant toute proposition de retrait.
- **Non confirmé** : l'index mentionne la source, mais son existence, son nom exact ou son contenu doivent encore être vérifiés.
- Une correspondance thématique n'est pas une preuve de consolidation intégrale.
- Aucun statut de ce document n'autorise à lui seul un déplacement ou une suppression.

## Cartographie par domaine

| Domaine | Référence canonique active | Sources historiques recensées | État de migration / contrôle restant |
| --- | --- | --- | --- |
| Vision, produit et personas | `docs/01-product/vision.md`, `personas.md`, `user-journeys.md`, `trust-levels.md`, `experience-system.md` | `docs/01-product/01-VITALA - VISION PRODUIT V1.md`, `docs/01-product/02-VITALA - PERSONAS V1.md`, fichiers `docs/04-VITALA-UJ-*`, `docs/05-VITALA-UJ-*` à `docs/10-VITALA-UJ-*`, annexe UJ commune | À comparer document par document ; UJ-08/09/10 sont cités comme références historiques mais leurs sources primaires n'ont pas été retrouvées aux chemins attendus. |
| Identité et confiance | `docs/01-product/trust-levels.md`, `docs/02-architecture/identity-model.md`, `docs/02-architecture/trust-domain.md` | Sources Trust Levels, Trust Engine, UDI et API historiques listées dans `docs/archive/README.md` | À comparer ; noms de fichiers partiellement mal encodés dans l'index d'archives. Ne pas renommer ni supprimer sans vérification du chemin exact et du contenu. |
| Architecture système | `docs/02-architecture/system-architecture.md`, `frontend-experience.md`, `backend-api.md`, `database-architecture.md`, `synchronization-offline-realtime.md`, `ai-architecture-integrations.md` | `docs/02-architecture/18-VITALA-ARCHITECTURE-V1 Partie 1.md`, Partie 2 et Partie 3 ; `docs/04-database/Database Architecture.md` | Références canoniques établies ; comparer les décisions et contraintes uniques restantes avant de proposer un retrait. |
| API | `docs/03-api/README.md`, `contract-runtime-status.md`, `auth-api.md`, `flash-api.md`, `trust-api.md`, `radar-api.md`, `sync-api.md` | `docs/03-api/4. Auth API.md`, `docs/03-api/5. Unified Digital Identity API.md`, `docs/03-api/15. Sync API.md`, `docs/03-api/16. Settings API(1).md` ; les contrats Flash, Trust et Radar sont maintenant classés sous `docs/03-engines/` | Index API actualisés pour pointer vers les sources classées. Les contrats Flash, Trust, Radar, Veille, Recommendation et Mission sont classés sous `docs/03-engines/` dans la branche Lot 12. L'UDI API et le modèle de données UDI restent à leurs chemins historiques, car ils relèvent de références transversales. La présence d'une page n'établit pas l'existence d'une route runtime. |
| Moteurs métier | `docs/03-engines/README.md` (index de classement documentaire) | Flash, Scan, Radar, Missions, Trust, Veille et Recommendation sous `docs/03-engines/{flash,scan,radar,missions,trust,veille,recommendation}/` ; UDI conservée aux chemins historiques | Classement partiel ; 17 sources classées dans les sous-répertoires métier, dont le contrat Trust déplacé après vérification du contenu. Le doublon Veille `Partie 1(1)` est conservé en attente de décision distincte. L'index ne certifie pas l'implémentation runtime. |
| Données et PostgreSQL | `docs/04-database/data-dictionary.md`, `docs/04-database/schema-design.md`, `docs/02-architecture/database-architecture.md` | `docs/04-database/DATA_MODEL.md`, `docs/04-database/Database Architecture.md`, documents historiques contenant des schémas ou migrations | À comparer aux migrations versionnées et aux preuves d'environnement. TECH-001 et TECH-003 restent ouverts ; la documentation ne certifie pas le schéma distant. |
| IA et règles de projet | `docs/05-ai/constitution.md`, `decision-tree.md`, `development-manual.md`, `ai-rulebook.md`, `coding-standards.md`, `security-rules.md`, `testing-standards.md`, plus `docs/02-architecture/ai-architecture-integrations.md` | `docs/05-ai/00-AI-README.md.md`, `docs/05-ai/AI-RULEBOOK.md`, `docs/05-ai/AI Development Manual.md`, `docs/05-ai/AI Constitution.md`, `docs/05-ai/12-AI-CODING-STANDARDS.md`, `docs/05-ai/13-AI-SECURITY-RULES.md`, `docs/05-ai/14-AI-TESTING-STANDARDS.md`, `docs/PROJECT_BIBLE.md` | L'index canonique est établi ; comparer les règles et décisions spécifiques avant de conclure à une consolidation intégrale. TECH-006 reste ouvert. |
| Opérations, release et reprise | `docs/06-operations/deployment.md`, `operations.md`, `release-readiness.md`, `disaster-recovery.md`, `performance-pwa.md`, `performance-issues.md`, `technical-issues.md` | `docs/06-operations/DEPLOYMENT.md`, `docs/06-operations/OPERATIONS.md`, `docs/06-operations/PERFORMANCE_PWA.md`, `docs/06-operations/PERFORMANCE_ISSUES.md`, `docs/06-operations/GO_NO_GO.md`, annexe historique de reprise | Comparer les procédures et liens. Les documents de reprise et de Go/No-Go ne doivent pas être retirés avant validation de la référence canonique et des informations d'exploitation. |
| Annexes et catalogues | `docs/07-annexes/glossary.md`, `error-handbook.md` | `docs/03-api/API Error Catalog.md`, annexes C et D ; annexe G de reprise | Vérifier si les catalogues de politiques/objets et les détails d'erreurs sont entièrement repris ou encore référencés ailleurs. |

## Contrôles transversaux à terminer

1. Vérifier l'existence exacte de chaque chemin historique mentionné et corriger les noms mal encodés sans renommer les fichiers à ce stade. Les déplacements de sources métier classées sont terminés dans cette branche ; restent le traitement du doublon Veille `Partie 1(1)` et la décision sur les sources UDI historiques.
2. Rechercher les liens entrants vers chaque source historique, y compris depuis les documents hors des index de section. Les index `docs/README.md`, `docs/03-api/README.md`, `docs/03-api/contract-runtime-status.md`, `docs/archive/README.md` et `docs/03-engines/README.md` doivent refléter le classement de cette branche.
3. Comparer les sections et décisions uniques, pas seulement les titres, entre chaque source et sa référence canonique.
4. Distinguer les documents remplacés des documents sources encore utiles à la traçabilité, à l'audit ou à l'exploitation.
5. Faire approuver séparément toute liste de suppression avant d'effectuer des suppressions.

## Réconciliation fichier par fichier

La réconciliation détaillée des 28 chemins modifiés par la PR #25, avec dépendances, contrôles disponibles, tests attendus et corrections proposées, est consignée dans [la réconciliation du Lot 12](./lot12-file-reconciliation.md). Elle couvre le diff de cette PR et ne remplace pas la comparaison exhaustive de toutes les sources historiques du dépôt.

## Registres techniques liés

La consolidation documentaire ne clôt aucun problème technique. TECH-001 à TECH-006 restent suivis dans [le registre des problèmes techniques](./06-operations/technical-issues.md) jusqu'à résolution et vérification spécifiques.
