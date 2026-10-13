# Suppressions documentaires proposées — en attente de validation

**Lot 12 — Étape 2 : liste de propositions uniquement.**  
**Statut : AUCUNE suppression autorisée par ce document.** Dans la branche de travail Lot 12, plusieurs sources ont déjà été déplacées vers `docs/03-engines/` après validation du classement. Cette liste ne remet pas en cause ces déplacements et ne permet aucune suppression supplémentaire. Les suppressions de doublons ou de sources restantes demeurent bloquées tant que leur chemin exact et leurs liens entrants ne sont pas contrôlés.

Avant de décider du sort d'un candidat, consulter l'[audit préliminaire de couverture du contenu](./documentation-content-coverage.md). Cette première passe relève des blocages manifestes et n'est pas une validation exhaustive de chaque fichier.

Cette liste sert à préparer une décision explicite. Les candidats ci-dessous ne sont pas déclarés redondants par simple similarité de nom ou par présence dans un index d'archives.

## Candidats à évaluer après comparaison de contenu

| Candidat historique (chemin indiqué dans les index actuels) | Référence canonique de comparaison | Action éventuellement proposée | Conditions préalables |
| --- | --- | --- | --- |
| `docs/01-VITALA - VISION PRODUIT V1.md` | `docs/01-product/vision.md` | Retrait éventuel ou conservation comme source historique | Vérifier que décisions, hypothèses produit et historique utile sont repris ; vérifier les liens entrants. |
| `docs/02-VITALA - PERSONAS V1.md` | `docs/01-product/personas.md` | Retrait éventuel ou conservation comme source historique | Comparer tous les personas, leurs distinctions et les liens entrants. |
| Sources historiques `docs/04-VITALA-UJ-*` à `docs/10-VITALA-UJ-*` et annexe commune | `docs/01-product/user-journeys.md` | Retrait au cas par cas, jamais en bloc | Vérifier chaque parcours, ses étapes, ses exceptions et ses références ; résoudre séparément les sources UJ-08/09/10 non retrouvées. |
| Sources Trust Levels / Trust Engine / UDI listées dans `docs/archive/README.md` | `docs/01-product/trust-levels.md`, `docs/02-architecture/trust-domain.md`, `docs/02-architecture/identity-model.md` | Retrait éventuel après consolidation complète | Vérifier les chemins exacts, les noms encodés, les règles et décisions non reprises ; TECH-001 ne doit pas être considéré comme résolu par la seule documentation. |
| `docs/18-VITALA-ARCHITECTURE-V1 Partie 1.md`, Partie 2, Partie 3 | Références sous `docs/02-architecture/` | Retrait éventuel ou conservation pour historique de décisions | Comparer chaque partie et confirmer qu'aucune décision unique n'est perdue. |
| `docs/Database Architecture.md`, `docs/DATA_MODEL.md` | `docs/02-architecture/database-architecture.md`, `docs/04-database/data-dictionary.md`, `schema-design.md` | Retrait éventuel ou conservation pour traçabilité | Comparer les champs, contraintes, relations, grants/RLS et références ; ne pas confondre documentation et état distant. TECH-001/003 restent ouverts. |
| `docs/4. Auth API.md`, `docs/5. Unified Digital Identity API.md`, `docs/15. Sync API.md`, `docs/16. Settings API(1).md`; contrats Flash, Trust, Radar, Mission, Veille et Recommendation classés sous `docs/03-engines/` (dans la branche Lot 12) | Références sous `docs/03-api/` et `docs/02-architecture/backend-api.md` | Retrait éventuel ou conservation comme contrats historiques | Comparer les contrats complets et les exigences uniques ; vérifier les appelants et liens entrants ; ne pas présenter un contrat cible comme une route livrée. Le fichier `docs/8. Trust API.md` a été retiré de cette branche après comparaison exacte du contenu avec `docs/03-engines/trust/8. Trust API.md`. Le doublon `docs/14-VITALA-VEILLE-ENGINE.md Partie 1(1).md` reste conservé à son emplacement historique ; sa suppression n'est pas incluse dans cette migration. Les sources UDI restent à leur emplacement historique car leur destination relève d'un classement transversal à décider séparément. |
| `docs/00-AI-README.md.md`, `docs/AI-RULEBOOK.md`, `docs/AI Development Manual.md`, `docs/AI Constitution.md`, `docs/12-AI-CODING-STANDARDS.md`, `docs/13-AI-SECURITY-RULES.md`, `docs/14-AI-TESTING-STANDARDS.md` | `docs/05-ai/` | Retrait éventuel ou conservation comme historique de règles | Vérifier les différences de règles, les éventuelles instructions encore uniques et les liens entrants ; TECH-006 reste ouvert. |
| `docs/DEPLOYMENT.md`, `docs/OPERATIONS.md`, `docs/PERFORMANCE_PWA.md`, `docs/PERFORMANCE_ISSUES.md`, `docs/GO_NO_GO.md` | `docs/06-operations/` | Retrait éventuel ou conservation de procédures historiques | Confirmer que procédures, critères, liens de runbook et décisions sont repris et toujours valides ; vérifier les références encore utilisées. |
| `docs/ANNEXE G — Plan de reprise d'activité (Disaster Recovery & Business Continuity).md` | `docs/06-operations/disaster-recovery.md` | Retrait éventuel ou conservation pour historique | Comparer les procédures, seuils et contacts opérationnels ; faire valider par le responsable des opérations. |
| `docs/API Error Catalog.md`, `docs/ANNEXE C — Catalogue officiel des politiques.md`, `docs/ANNEXE D — Catalogue officiel des objets.md` | `docs/07-annexes/error-handbook.md`, glossaire et références API/données concernées | Retrait éventuel ou conservation | Vérifier l'exhaustivité des erreurs, politiques et objets et les usages par les équipes/outils. |
| `docs/17-Vitala Experience System Partie 1.md`, `docs/DESIGN_LANGUAGE.md` | `docs/01-product/experience-system.md`, `docs/00-foundation/design-language.md` | Retrait éventuel ou conservation | Vérifier les décisions de design et tokens uniques ; confirmer les liens entrants. |
| `docs/PROJECT_BIBLE.md` | Index canoniques et règles sous `docs/05-ai/` | Retrait éventuel ou conservation comme document de synthèse historique | Examiner chaque lien et chaque règle unique ; ne pas supposer que les autres index remplacent tout son contenu. |

## Hors de toute suppression proposée automatiquement

- Tout fichier de migration SQL, schéma ou artefact technique.
- Toute source dont le chemin exact ou l'existence n'a pas été vérifié.
- Toute source liée à un problème TECH-001 à TECH-006 dont le contenu reste nécessaire à l'analyse.
- Tout document avec des informations opérationnelles non validées ou des références entrantes non résolues.

## Approbation requise avant exécution

Pour chaque fichier, la décision doit identifier explicitement le chemin exact et choisir l'une des options suivantes : **conserver**, **conserver en archive**, **déplacer vers une archive approuvée** ou **supprimer**. Toute action destructive nécessite une autorisation explicite distincte après comparaison du contenu, vérification des liens entrants et validation de la traçabilité.

Jusqu'à une décision propre à chaque candidat, aucune suppression n'est autorisée. Les déplacements déjà effectués dans la branche Lot 12 sont documentés dans `docs/03-engines/README.md` et `docs/documentation-migration-map.md` ; `main` n'est pas modifiée.
