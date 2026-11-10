# Gouvernance des données de démonstration — V1

**Statut : décision produit validée ; règles d'architecture proposées pour revue.**  
**Périmètre :** tous les domaines et espaces de Vitalis qui présentent des contenus réels ou illustratifs.

## 1. Décisions produit

Deux décisions sont obligatoires en V1 :

1. **Affichage progressif (A).** Les contenus de démonstration apparaissent uniquement lorsqu'un espace ne dispose pas encore de suffisamment de données réelles utiles. Ils reculent à mesure que les données réelles deviennent disponibles.
2. **Mention sur chaque contenu (A).** Tout contenu de démonstration présenté à l'utilisateur porte une mention visible et compréhensible : **« Exemple »**. Cette mention reste présente dans les listes, cartes, détails et autres présentations.

Ces décisions concernent le comportement produit attendu. Ce document ne prétend pas que tous les domaines les implémentent déjà.

## 2. Catégories de données

Les systèmes doivent distinguer trois catégories qui ne sont jamais interchangeables :

| Catégorie | Définition | Cycle de vie |
| --- | --- | --- |
| Réelle | Contenu effectivement créé, reçu ou confirmé par un utilisateur ou un service autorisé | Stockage local Dexie, puis synchronisation vers le backend selon les contrats et politiques applicables |
| Démonstration | Contenu fictif, préparé pour expliquer l'expérience et éviter les espaces vides | Fixtures locales, lecture seule, jamais synchronisées |
| Test | Donnée contrôlée utilisée pour vérifier le comportement du logiciel | Environnements et suites de tests isolés |

Une donnée de démonstration ne devient jamais réelle par simple interaction, copie, synchronisation ou changement d'écran.

## 3. Frontière d'architecture

Les écrans et composants d'interface ne choisissent pas eux-mêmes la source des données. Le domaine concerné fournit un modèle de présentation unifié, avec une provenance explicite.

Flux cible :

```text
Écran
  -> hook / cas d'usage du domaine
      -> repository ou sélecteur du domaine
          -> données réelles (Dexie / repositories existants)
          -> fixtures de démonstration locales et en lecture seule
      -> modèle de présentation avec provenance
  -> interface
```

Règles :

- Dexie reste la source locale des données réelles de l'interface, conformément au PROJECT_BIBLE.
- Le worker de synchronisation reste le seul pont entre Dexie et le cloud.
- Supabase reçoit uniquement les données réelles autorisées par les contrats, les règles métier et les politiques de sécurité existantes.
- Les fixtures de démonstration sont détenues par leur domaine, dans `src/domains/<domain>/mocks/` ou l'emplacement canonique retenu par ce domaine.
- Aucun écran, widget ou composant ne doit appeler Supabase directement pour obtenir des données de démonstration ou réelles.
- Aucun registre global ne doit devenir propriétaire des contenus fictifs propres aux domaines.
- Les fixtures sont déterministes, documentées, légères et adaptées à la production ; elles ne sont pas des mocks jetables ni une voie alternative de persistance.

## 4. Provenance explicite

Chaque élément présenté doit conserver sa provenance jusqu'au composant qui l'affiche. Le type exact sera aligné sur les contrats partagés déjà présents dans le dépôt.

Exemple conceptuel :

```ts
type DataOrigin = "real" | "demo";

type PresentedItem<T> = {
  data: T;
  origin: DataOrigin;
};
```

Le rendu de la mention « Exemple » dépend exclusivement de cette provenance, jamais d'une déduction fondée sur le texte ou le contenu.

La provenance ne doit pas être perdue lors du tri, du filtrage, de la fusion de listes, de la pagination ou de l'ouverture d'un détail.

## 5. Politique d'affichage progressif

Chaque domaine définit un critère explicite de suffisance des données réelles. Il n'existe pas de seuil numérique universel : une seule présence réelle peut être pertinente dans Réel, tandis qu'un espace de découverte peut nécessiter plusieurs éléments.

Comportement obligatoire :

1. Tant que le chargement des données réelles n'est pas terminé, ne pas conclure à tort qu'il n'existe aucune donnée réelle et ne pas remplir prématurément l'écran avec des exemples.
2. Si aucune donnée réelle pertinente n'est disponible, afficher les exemples adaptés.
3. Si des données réelles sont disponibles mais insuffisantes selon le critère du domaine, les présenter en priorité et compléter avec des exemples clairement marqués si cela améliore réellement la compréhension ou l'utilité de l'écran.
4. Lorsque le critère de suffisance est atteint, retirer les exemples de la liste principale.
5. Ne jamais remplacer, masquer ou déclasser une donnée réelle pour favoriser un exemple.
6. Recalculer la sélection lorsque les données réelles changent, notamment après synchronisation.
7. En mode hors connexion, conserver les données réelles locales et les actions en attente. Les exemples restent identifiés comme tels et ne simulent jamais une activité en direct.

Les critères de suffisance doivent être documentés, testables et propres au cas d'usage. Ils ne doivent pas dépendre d'un seuil arbitraire partagé par tous les moteurs.

## 6. Sécurité et interactions

- Les contenus de démonstration sont en lecture seule.
- Ils ne sont jamais ajoutés à Dexie comme mutations utilisateur, à l'outbox, ni à Supabase.
- Ils ne génèrent aucune notification, conversation, demande, présence, disponibilité ou activité réelle.
- Une action impossible sur un exemple est désactivée ou accompagnée d'une explication simple indiquant qu'il s'agit d'un exemple.
- Les exemples de personnes, profils, lieux et présences ne doivent jamais laisser croire qu'une personne est réellement présente ou disponible à proximité.
- Les contenus réels ne portent jamais la mention « Exemple ».
- Les données de test ne sont jamais activées dans une version destinée aux utilisateurs.
- Les identifiants et métadonnées des fixtures doivent être isolés des identifiants réels pour éviter toute collision ou fusion accidentelle.

## 7. Responsabilités par domaine

| Domaine | Exemples autorisés | Limite particulière |
| --- | --- | --- |
| Flash | Besoins et propositions illustratifs | Ne pas simuler une contribution publiée par un utilisateur réel |
| Scan | Objets, services et résultats explicatifs | Ne pas présenter un résultat fictif comme une identification vérifiée |
| Réel | Scénarios guidés de fonctionnement | Ne jamais simuler une personne réellement présente dans la zone |
| Radar | Exemples de catégories ou de découvertes | Ne pas inventer une disponibilité ou une activité en direct |
| 2x2 | Catégories et contenus illustratifs | Toujours distinguer l'exemple d'un contenu utilisateur |
| Profil | Profil fictif de démonstration | Ne pas créer de faux compte utilisateur |
| Assistant | Exemples de demandes et de réponses | Ne pas prétendre qu'une capacité V2/V3 est disponible en V1 |

Chaque domaine peut refuser les exemples lorsque le risque de confusion est trop élevé.

## 8. Présentation et internationalisation

- Le libellé fonctionnel canonique est « Exemple » en français ; son équivalent anglais doit être idiomatique (« Example »).
- Les deux libellés passent par le système i18n existant.
- Le marqueur est visible, accessible et cohérent avec la hiérarchie visuelle ; il ne repose pas uniquement sur la couleur.
- Il reste visible dans les vues détaillées et les composants réutilisés, pas seulement sur la première carte.
- Le langage environnant reste humain, direct et sans jargon.

## 9. Tests d'acceptation obligatoires

Chaque domaine qui utilise des exemples doit couvrir :

- absence de données réelles après fin de chargement ;
- données réelles présentes mais sous le seuil de suffisance ;
- seuil atteint et retrait des exemples de la liste principale ;
- mise à jour après synchronisation ;
- fonctionnement hors connexion ;
- conservation de la provenance lors du tri, filtrage, fusion et ouverture du détail ;
- présence du marqueur « Exemple » en FR et EN dans chaque surface ;
- impossibilité de synchroniser ou de muter un contenu de démonstration ;
- absence de notification, message, demande, présence ou disponibilité réelle générée par un exemple ;
- absence de collision entre identifiants de démonstration et identifiants réels.

## 10. Critères de revue

Une implémentation n'est pas considérée conforme si :

- la source est déduite dans un composant d'interface ;
- un exemple peut entrer dans le flux Dexie/outbox/Supabase ;
- un exemple est présenté sans marqueur visible ;
- un exemple simule une personne ou une activité réelle ;
- le seuil de suffisance est implicite ou non testé ;
- les exemples apparaissent avant la fin du chargement réel ;
- les contenus fictifs sont centralisés dans un domaine partagé sans propriétaire métier.

## 11. Alignement documentaire

Ce document complète, sans les remplacer :

- `ARCHITECTURE.md` — propriété des mocks par domaine ;
- `src/domains/README.md` — responsabilité des domaines ;
- `docs/07-annexes/PROJECT_BIBLE.md` — Dexie, worker de synchronisation, backend séparé et interdiction du code jetable ;
- les contrats de données, de synchronisation et de sécurité propres à chaque domaine.

En cas de conflit apparent, préserver les frontières de données et de synchronisation du PROJECT_BIBLE. Les fixtures décrites ici sont des données de démonstration durables, locales et isolées, pas des données de production ni des mocks temporaires.

## 12. État de mise en œuvre

Décisions produit validées. Règles d'architecture documentées dans cette proposition. Les seuils propres aux domaines, les modèles de provenance définitifs, les fixtures et les tests restent à auditer et à implémenter séparément. La présence de ce document ne constitue pas une preuve d'implémentation.


## 13. Précision — fixtures issues d'une source SQL

Le fichier `donnees_sql.sql` fourni par le produit est une source de données fictives, et non une base métier à importer. Les fixtures qui en sont dérivées doivent utiliser les mêmes contrats, validateurs, normaliseurs, sélecteurs et règles de lecture que les données réelles.

Cette réutilisation concerne exclusivement le chemin de lecture et de présentation. Les opérations d'écriture métier, Dexie, outbox, synchronisation et Supabase restent interdites aux fixtures. La provenance `demo` doit survivre à chaque transformation.

Le mapping, les exclusions de sécurité, le traitement des dates anciennes et les tests du convertisseur sont définis dans [Adaptation du jeu SQL de démonstration aux domaines Vitalis — V1](./demo-sql-fixture-adapter-v1.md). En cas de différence entre le schéma SQL et un contrat Vitalis, le contrat Vitalis prévaut ; aucune nouvelle valeur d'enum ou aucun champ métier ne doit être inventé pour faire entrer une ligne SQL.


## 14. Première intégration contrôlée — Flash

Une première intégration de démonstration est ajoutée sur la branche de travail pour le domaine Flash uniquement. Elle utilise le contrat public `PublicFlash`, conserve la provenance jusqu'à la carte, complète progressivement le flux après résolution des sources réelles et n'écrit jamais dans les dépôts métier.

La sélection et les tests sont décrits dans [Adaptation du jeu SQL de démonstration aux domaines Vitalis — V1](./demo-sql-fixture-adapter-v1.md). L'intégration reste en attente des contrôles CI et ne doit pas être considérée comme fusionnée dans `main`. Aucun autre domaine n'est activé par cette tranche.
