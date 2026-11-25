# Documentation des moteurs métier

Ce répertoire est le point d'entrée des moteurs Vitalis. **Chaque moteur doit pouvoir être compris et utilisé à partir de son propre dossier, sans lecture préalable d'un autre moteur.** Le guide `ENGINE_GUIDE.md` de chaque dossier est la référence autonome : mission, périmètre, parcours utilisateur de bout en bout, règles métier, cycle de vie, données, sécurité, architecture, état d'implémentation et critères de validation.

Les autres documents du dossier apportent des détails spécialisés ou conservent les versions historiques. Ils ne remplacent pas le guide complet. Les intégrations entre moteurs sont décrites comme des contrats d'échange ; elles ne créent aucune dépendance de lecture documentaire ou de propriété métier.

## Références autonomes

| Moteur | Guide complet | Dossier |
| --- | --- | --- |
| **En direct** | [Guide complet En direct](./reel/ENGINE_GUIDE.md) | [reel/](./reel/) |
| **Flash** | [Guide complet Flash](./flash/ENGINE_GUIDE.md) | [flash/](./flash/) |
| **Scan** | [Guide complet Scan](./scan/ENGINE_GUIDE.md) | [scan/](./scan/) |
| **Radar** | [Guide complet Radar](./radar/ENGINE_GUIDE.md) | [radar/](./radar/) |
| **Mission** | [Guide complet Mission](./missions/ENGINE_GUIDE.md) | [missions/](./missions/) |
| **Recommendation** | [Guide complet Recommendation](./recommendation/ENGINE_GUIDE.md) | [recommendation/](./recommendation/) |
| **Trust** | [Guide complet Trust](./trust/ENGINE_GUIDE.md) | [trust/](./trust/) |
| **Veille** | [Guide complet Veille](./veille/ENGINE_GUIDE.md) | [veille/](./veille/) |

## Principe transversal — demandes partielles

Tous les moteurs appliquent les [principes fondamentaux de Vitalis](../foundation/vitalis-core-principles.md) : traiter les éléments exploitables, conserver les brouillons lorsque c'est pertinent et ne demander que les informations, autorisations ou consentements réellement indispensables à l'action demandée. Un complément facultatif ne devient pas une condition bloquante.

## Autonomie et frontières métier

- Chaque moteur possède ses propres règles, états, données, permissions et responsabilités.
- Une intégration peut consommer une projection ou un événement autorisé d'un autre domaine ; elle ne transfère pas la propriété des données.
- Aucune permission, visibilité, localisation ou identité n'est héritée implicitement d'un autre moteur.
- Un résultat, une recommandation, une tendance ou une correspondance ne déclenche pas automatiquement une action dans un autre domaine.
- Les contrats historiques sont signalés comme tels ; leur présence ne prouve pas qu'une route, une tâche planifiée ou une fonctionnalité est active.

## Capacités transversales — hors moteurs métier

L'Unified Digital Identity (UDI) est une capacité transversale d'agrégation et de présentation de l'identité, pas un moteur métier autonome. Ses références sont dans [l'architecture UDI](../architecture/14-VITALA-VEILLE-ENGINE.%20Model%20-%20Unified%20Digital%20Identity%20%28UDI%29.md), [le contrat UDI](../api/5.%20Unified%20Digital%20Identity%20API.md) et [l'évolution du modèle](../architecture/Evolution%20du%20mod%C3%A8le%20de%20donn%C3%A9es%20-%20Unified%20Digital%20Identity%20UDI.md).

La visibilité de profil doit être définie dans le contexte du moteur concerné. La [politique de visibilité et de profil](./visibility-and-profile-policy.md) donne le cadre commun, sans remplacer les règles autonomes de chaque guide.

## Règles de maintenance

1. Toute évolution d'un parcours commence par le guide du moteur propriétaire.
2. Le guide décrit le parcours complet ; les références croisées ne sont que des contrats d'intégration ou des sources historiques.
3. Chaque capacité porte un statut explicite : décision produit, cible, présente dans le code, testée, déployée ou non vérifiée.
4. Les endpoints historiques, maquettes et spécifications ne sont jamais présentés comme des fonctionnalités runtime sans preuve.
5. Toute évolution doit mettre à jour le guide et les documents spécialisés concernés dans la même contribution.
6. Les sources historiques sont conservées ; toute suppression ou fusion exige une comparaison, la vérification des liens entrants et une validation explicite.
