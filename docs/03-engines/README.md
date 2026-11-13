# Moteurs métier — documentation de référence

Ce répertoire regroupe les contrats produit, UI/UX, architecture et références historiques des moteurs Vitalis. Une documentation présente ne certifie pas à elle seule que la fonctionnalité correspondante est implémentée dans le runtime.

## Règle transversale de visibilité

- [Visibilité et confidentialité propres à chaque moteur](./visibility-and-profile-policy.md) : chaque moteur et, lorsque pertinent, chaque publication possède ses propres autorisations ; aucune permission n'est héritée automatiquement d'un autre moteur.

## Les quatre moteurs prioritaires

Chaque moteur possède son propre périmètre, son action centrale, ses commandes, ses données et ses règles de visibilité du profil.

| Moteur | Dossier documentaire | Domaine applicatif actuel | Action centrale |
| --- | --- | --- | --- |
| **Instant** (anciennement Réel) | [reel/](./reel/) | `src/domains/presence/` | Profil et présence de l'utilisateur au centre de l'expérience |
| **Flash** | [flash/](./flash/) | `src/domains/flash/` | Démarrer un Flash |
| **Scan** | [scan/](./scan/) | `src/domains/scan/` | Démarrer le scanner des possibilités |
| **Radar** | [radar/](./radar/) | `src/domains/radar/` | Démarrer une mission de recherche d'opportunités |

### Dossiers de cadrage

- **Instant** : [architecture UI](./reel/reel-ui-architecture.md), [visibilité du profil](./reel/instant-profile-visibility.md), [politique d'accès](./reel/reel-access-policy.md), [sessions invitées](./reel/reel-guest-session-architecture.md), [traçabilité](./reel/reel-traceability-matrix.md), [état d'implémentation V1](./reel/reel-v1-implementation-status.md).
- **Flash** : [fiche de cadrage](./flash/engine-charter.md).
- **Scan** : [fiche de cadrage](./scan/engine-charter.md).
- **Radar** : [fiche de cadrage](./radar/engine-charter.md), [module Radar existant](./radar/RADAR_MODULE.md), [état d'implémentation V1](./radar/radar-v1-implementation-status.md).

Les fiches de cadrage distinguent les décisions produit, les sujets encore ouverts et les fonctions effectivement vérifiées dans le runtime.

## Veille — supervision et intelligence collective

Veille est documenté comme un moteur de supervision des missions et d'analyse de signaux collectifs. Il complète les quatre moteurs prioritaires, sans que cette documentation décide de sa place dans la navigation V1.

- [Fiche de cadrage Veille](./veille/engine-charter.md)
- [Veille Engine — partie 1, source historique](<./veille/14-VITALA-VEILLE-ENGINE.md Partie 1.md>)
- [Veille Engine — partie 2, source historique](<./veille/14-VITALA-VEILLE-ENGINE.md Partie 2.md>)
- [Veille Engine — partie 3, source historique](<./veille/14-VITALA-VEILLE-ENGINE.md Partie 3.md>)
- [Veille API — contrat historique](<./veille/10. Veille API.md>)

## Autres domaines et références historiques

### Missions

- [Mission API — contrat historique](<./missions/7. Mission API.md>)

### Recommendation

- [Recommendation API — contrat historique](./recommendation/11._Recommendation_API.md)

### Trust

- [Trust Engine — partie 1](<./trust/03A-VITALA-TRUST-ENGINE-V1 Partie 1.md>)
- [Trust Engine — partie 2](<./trust/03A-VITALA-TRUST-ENGINE-V1 Partie 2.md>)
- [Trust Engine — partie 3](<./trust/03A-VITALA-TRUST-ENGINE-V1 Partie 3.md>)
- [Trust Engine — mise à jour historique](<./trust/03A-VITALA-TRUST-ENGINE-V1.md Mise � jour.md>)
- [Trust API — contrat historique](<./trust/8. Trust API.md>)

## Unified Digital Identity (UDI)

L'UDI est une capacité transversale d'agrégation et de présentation de l'identité, pas un moteur métier autonome. Ses sources restent dans les dossiers d'architecture et d'API.

- [Modèle métier UDI](../02-architecture/14-VITALA-VEILLE-ENGINE.%20Model%20-%20Unified%20Digital%20Identity%20(UDI).md)
- [Contrat Unified Digital Identity API](../03-api/5.%20Unified%20Digital%20Identity%20API.md)
- [Évolution du modèle de données UDI](<../02-architecture/Evolution du mod�le de donn�es - Unified Digital Identity (UDI).md>)

## Limites et traçabilité

- Les contrats REST historiques restent des références cibles tant que le runtime n'a pas été vérifié séparément.
- Les domaines restent propriétaires de leurs données ; l'UDI en expose des vues sans les dupliquer.
- Les niveaux de confiance produit restent dans `docs/01-product/trust-levels.md`, et ne sont pas assimilés au Trust Engine.
- Cette organisation documentaire ne ferme aucun ticket technique ; TECH-001 à TECH-006 restent suivis dans le registre technique.
