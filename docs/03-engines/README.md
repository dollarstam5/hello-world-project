# Moteurs métier — références historiques classées

Ce répertoire regroupe des documents de domaine et des contrats historiques par moteur. Il s'agit d'une organisation documentaire : elle ne certifie ni que tous les moteurs existent dans le runtime, ni que les endpoints décrits sont implémentés.

## Domaines

### Flash
- [Flash Engine](./flash/11-VITALA-UJ-08-FLASH-ENGINE.md)
- [Flash API — contrat historique](<./flash/6. Flash API.md>)

### Scan
- [Scan Engine / module](./scan/12-VITALA-UJ-09-SCAN-ENGINE.md)
- [Scan module](./scan/SCAN_MODULE.md)

### Radar
- [Radar module](./radar/RADAR_MODULE.md)
- [Radar API — contrat historique](<./radar/9. Radar API.md>)

### Missions
- [Mission API — contrat historique](<./missions/7. Mission API.md>)

### Veille
- [Veille API — contrat historique](<./veille/10. Veille API.md>)
- [Veille Engine — partie 1](<./veille/14-VITALA-VEILLE-ENGINE.md Partie 1.md>)
- [Veille Engine — partie 2](<./veille/14-VITALA-VEILLE-ENGINE.md Partie 2.md>)
- [Veille Engine — partie 3](<./veille/14-VITALA-VEILLE-ENGINE.md Partie 3.md>)

### Recommendation
- [Recommendation API — contrat historique](<./recommendation/11._Recommendation_API.md>)

### Trust
- [Trust Engine — partie 1](<./trust/03A-VITALA-TRUST-ENGINE-V1 Partie 1.md>)
- [Trust Engine — partie 2](<./trust/03A-VITALA-TRUST-ENGINE-V1 Partie 2.md>)
- [Trust Engine — partie 3](<./trust/03A-VITALA-TRUST-ENGINE-V1 Partie 3.md>)
- [Trust Engine — mise à jour historique](<./trust/03A-VITALA-TRUST-ENGINE-V1.md Mise � jour.md>)
- [Trust API — contrat historique](<./trust/8. Trust API.md>)

## Documents encore en attente de classement

Les documents Veille et Recommendation classés ci-dessus ont été déplacés dans cette branche. Les sources Unified Digital Identity (UDI) restent à leur chemin historique, car elles relèvent de l'API transversale et du modèle d'identité, pas d'un moteur dédié. Le doublon historique de la partie 1 Veille est conservé en attente de décision distincte.

- `docs/03-engines/veille/14-VITALA-VEILLE-ENGINE.md Partie 1(1).md` — doublon de la partie 1 classée, conservé pour l'instant
- `docs/02-architecture/14-VITALA-VEILLE-ENGINE. Model - Unified Digital Identity (UDI).md` — malgré son préfixe Veille, son contenu concerne l'UDI ; ne pas le classer comme moteur Veille.
- `docs/03-api/5. Unified Digital Identity API.md`
- `docs/02-architecture/Evolution du mod�le de donn�es - Unified Digital Identity (UDI).md`

## Limites et traçabilité

- Les contrats REST de ces sources sont des contrats cibles historiques tant que le runtime n'a pas été vérifié séparément.
- Les références canoniques transversales restent dans `docs/03-api/`, `docs/02-architecture/` et `docs/01-product/`.
- Les niveaux de confiance produit restent dans `docs/01-product/trust-levels.md`, et ne sont pas assimilés au Trust Engine.
- Cette migration documentaire ne ferme aucun ticket technique ; TECH-001 à TECH-006 restent suivis dans le registre technique.
