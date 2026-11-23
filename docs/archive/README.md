# Documentation Archive

Ce dossier documentaire répertorie les sources historiques conservées pour la traçabilité et la migration. Les fichiers restent à leur emplacement actuel ; ils ne sont pas supprimés ni déplacés du simple fait d'être répertoriés ici.

## Outils de migration documentaire

- [Cartographie de migration documentaire](../reference/documentation-migration-map.md) — associe les références canoniques aux sources historiques recensées et liste les vérifications restantes.
- [Candidats aux suppressions proposées](../reference/proposed-document-removals.md) — liste distincte de candidats, sans autorisation de suppression.

## Structure actuelle

La documentation active vit dans :

- `docs/foundation/`
- `docs/product/`
- `docs/architecture/`
- `docs/api/`
- `docs/modules/` — classement des sources de moteurs/API en cours dans Lot 12
- `docs/database/`
- `docs/engineering/ai/`
- `docs/operations/`
- `docs/reference/`

## Sources historiques conservées

### Vision, produit et personas

- `docs/product/01-VITALA - VISION PRODUIT V1.md`
- `docs/product/02-VITALA - PERSONAS V1.md`

### Parcours utilisateurs (User Journeys)

- `docs/04-VITALA-UJ-01-CONSULTANT-TO-MEMBER.md`
- `docs/05-VITALA-UJ-02-MEMBER-TO-IDENTIFIED.md`
- `docs/06-VITALA-UJ-03-PUBLISH-OPPORTUNITY.md`
- `docs/07-VITALA-UJ-04-RESPOND-OPPORTUNITY.md`
- `docs/08-VITALA-UJ-05-SELECT-CANDIDATE.md`
- `docs/09-VITALA-UJ-06-ACTION-VALIDATION.md`
- `docs/10-VITALA-UJ-07-CONFIDENCE-CREATION.md`
- `docs/04.0-VITALA-UJ-01-Annexe commune aux User Journeys.md`

Les documents historiques mentionnent aussi UJ-08 Flash, UJ-09 Radar et UJ-10 Veille. Leurs fichiers primaires n'ont pas été retrouvés sous les chemins attendus lors de la consolidation ; ne pas recréer ni supprimer ces sources avant d'avoir confirmé leur emplacement et leur contenu.

### Identité et confiance

- `docs/03-VITALA-TRUST-LEVELS-V1.md Mise � jour 1.md` (nom encodé de façon imparfaite dans GitHub)
- `docs/03-VITALA-TRUST-LEVELS-V1.md Mise � jour 2.md` (nom encodé de façon imparfaite dans GitHub)
- `docs/product/03A-VITALA-TRUST-A LEVELS-V1 Partie 0.md`
- `docs/modules/trust/03A-VITALA-TRUST-ENGINE-V1 Partie 1.md` (classé dans Lot 12)
- `docs/modules/trust/03A-VITALA-TRUST-ENGINE-V1 Partie 2.md` (classé dans Lot 12)
- `docs/modules/trust/03A-VITALA-TRUST-ENGINE-V1 Partie 3.md` (classé dans Lot 12)
- `docs/modules/trust/03A-VITALA-TRUST-ENGINE-V1.md Mise � jour.md` (nom encodé de façon imparfaite ; classé dans Lot 12)
- `docs/architecture/14-VITALA-VEILLE-ENGINE. Model - Unified Digital Identity (UDI).md`
- `docs/api/5. Unified Digital Identity API.md` (UDI, non déplacée ; contrat transversal historique)
- `docs/modules/trust/8. Trust API.md` (contrat historique classé sous Lot 12)

### Moteurs Veille et Recommendation

- `docs/modules/veille/10. Veille API.md`
- `docs/modules/veille/14-VITALA-VEILLE-ENGINE.md Partie 1.md`
- `docs/modules/veille/14-VITALA-VEILLE-ENGINE.md Partie 2.md`
- `docs/modules/veille/14-VITALA-VEILLE-ENGINE.md Partie 3.md`
- `docs/modules/veille/14-VITALA-VEILLE-ENGINE.md Partie 1(1).md` (copie de la partie 1 conservée ; décision distincte requise avant retrait)
- `docs/modules/recommendation/11._Recommendation_API.md`

### Architecture, API et données

- `docs/architecture/18-VITALA-ARCHITECTURE-V1 Partie 1.md`
- `docs/architecture/18-VITALA-ARCHITECTURE-V1 Partie 2.md`
- `docs/architecture/18-VITALA-ARCHITECTURE-V1 Partie 3.md`
- `docs/api/16. Settings API.md` (copie exacte conservée ; la variante `(1)` a été retirée dans Lot 12)
- `docs/modules/flash/6. Flash API.md` (classé dans Lot 12)
- `docs/modules/radar/9. Radar API.md` (classé dans Lot 12)
- `docs/modules/missions/7. Mission API.md` (classé dans Lot 12)
- `docs/BUILD-API.md 2. Principes communs.md`
- `docs/database/Database Architecture.md`
- `docs/database/DATA_MODEL.md`

### Exploitation et continuité

- `docs/operations/ANNEXE G — Plan de reprise d'activité (Disaster Recovery & Business Continuity).md`

### IA et règles du projet

- `docs/engineering/ai/00-AI-README.md.md`
- `docs/engineering/ai/AI-RULEBOOK.md`
- `docs/PROJECT_BIBLE.md`

### Expérience, design et performance

- `docs/operations/PERFORMANCE_ISSUES.md`
- `docs/operations/PERFORMANCE_PWA.md`

## Policy

- Les travaux actifs doivent pointer vers les documents canoniques.
- Les fichiers historiques ne sont ni modifiés ni supprimés, sauf réindexation nécessaire et autorisée.
- Une source historique reste conservée tant que sa référence canonique n'a pas été validée techniquement et que la migration n'a pas reçu d'autorisation explicite.
- La cartographie et la liste des candidats au retrait ne valent ni validation technique ni autorisation destructive.
- Éviter d'ajouter de nouveaux fragments numérotés ou redondants.
- Les références canoniques distinguent explicitement les exigences cibles de l'implémentation vérifiée.
