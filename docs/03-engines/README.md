# Moteurs métier — documentation de référence

Ce répertoire regroupe les contrats produit, UI/UX, architecture et références historiques des moteurs Vitalis. Une documentation présente ne certifie pas à elle seule que la fonctionnalité correspondante est implémentée dans le runtime.

## Règle transversale de visibilité\n\n- [Visibilité et confidentialité propres à chaque moteur](./visibility-and-profile-policy.md) : chaque moteur et, lorsque pertinent, chaque publication possède ses propres autorisations ; aucune permission n'est héritée automatiquement d'un autre moteur.\n\n## Les quatre moteurs prioritaires

Chaque moteur possède son propre périmètre, son action centrale, ses commandes, ses données et ses règles de visibilité du profil.

| Moteur | Dossier documentaire | Domaine applicatif actuel | Action centrale |
| --- | --- | --- | --- |
| **Instant** (anciennement Réel) | [reel/](./reel/) | `src/domains/presence/` | Profil et présence de l'utilisateur au centre de l'expérience |
| **Flash** | [flash/](./flash/) | `src/domains/flash/` | Démarrer un Flash |
| **Scan** | [scan/](./scan/) | `src/domains/scan/` | Démarrer le scanner des possibilités |
| **Radar** | [radar/](./radar/) | `src/domains/radar/` | Démarrer le balayage des opportunités |

### Dossiers de cadrage

- **Instant** : [architecture UI](./reel/reel-ui-architecture.md), [visibilité du profil](./reel/instant-profile-visibility.md), [politique d'accès](./reel/reel-access-policy.md), [sessions invitées](./reel/reel-guest-session-architecture.md), [traçabilité](./reel/reel-traceability-matrix.md), [état d'implémentation V1](./reel/reel-v1-implementation-status.md).
- **Flash** : [fiche de cadrage](./flash/engine-charter.md).
- **Scan** : [fiche de cadrage](./scan/engine-charter.md).
- **Radar** : [fiche de cadrage](./radar/engine-charter.md).

Les fiches Flash, Scan et Radar sont des bases de travail à compléter au fil des décisions produit. Les sujets non décidés y sont explicitement laissés ouverts.

## Autres domaines et références historiques

### Missions

- [Mission API — contrat historique](<./missions/7. Mission API.md>)

### Veille

- [Veille API — contrat historique](<./veille/10. Veille API.md>)
- [Veille Engine — partie 1](<./veille/14-VITALA-VEILLE-ENGINE.md Partie 1.md>)
- [Veille Engine — partie 2](<./veille/14-VITALA-VEILLE-ENGINE.md Partie 2.md>)
- [Veille Engine — partie 3](<./veille/14-VITALA-VEILLE-ENGINE.md Partie 3.md>)

### Recommendation

- [Recommendation API — contrat historique](./recommendation/11._Recommendation_API.md)

### Trust

- [Trust Engine — partie 1](<./trust/03A-VITALA-TRUST-ENGINE-V1 Partie 1.md>)
- [Trust Engine — partie 2](<./trust/03A-VITALA-TRUST-ENGINE-V1 Partie 2.md>)
- [Trust Engine — partie 3](<./trust/03A-VITALA-TRUST-ENGINE-V1 Partie 3.md>)
- [Trust Engine — mise à jour historique](<./trust/03A-VITALA-TRUST-ENGINE-V1.md Mise � jour.md>)
- [Trust API — contrat historique](<./trust/8. Trust API.md>)

## Documents encore en attente de classement

Les sources Unified Digital Identity (UDI) restent à leur chemin historique, car elles relèvent de l'API transversale et du modèle d'identité, pas d'un moteur dédié. La copie strictement identique `Partie 1(1)` a été retirée après comparaison du blob Git ; la partie 1 sans suffixe est conservée.

- `docs/02-architecture/14-VITALA-VEILLE-ENGINE. Model - Unified Digital Identity (UDI).md` — malgré son préfixe Veille, son contenu concerne l'UDI ; ne pas le classer comme moteur Veille.
- `docs/03-api/5. Unified Digital Identity API.md`
- `docs/02-architecture/Evolution du mod�le de donn�es - Unified Digital Identity (UDI).md`

## Limites et traçabilité

- Les contrats REST historiques restent des références cibles tant que le runtime n'a pas été vérifié séparément.
- Les références canoniques transversales restent dans `docs/03-api/`, `docs/02-architecture/` et `docs/01-product/`.
- Les niveaux de confiance produit restent dans `docs/01-product/trust-levels.md`, et ne sont pas assimilés au Trust Engine.
- Cette organisation documentaire ne ferme aucun ticket technique ; TECH-001 à TECH-006 restent suivis dans le registre technique.
