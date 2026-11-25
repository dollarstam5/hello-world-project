# Flash — guide complet du moteur

**Objet :** exprimer, structurer, publier, diffuser et gérer une information utile à durée limitée.  
**Action centrale :** démarrer un Flash.  
**État :** référence autonome produit et technique ; les contrats cibles et l'état runtime sont explicitement distingués.

## 1. Mission et périmètre

Flash permet à une personne de diffuser rapidement un besoin, une opportunité, une disponibilité, une information locale, un événement ou une offre. Il optimise la pertinence et le résultat concret, pas la viralité, les vues ou les interactions sociales. Un Flash possède une intention, un type/catégorie, une description, une zone, une durée, un auteur, une visibilité et un état.

Types documentés : opportunité, disponibilité, information utile, événement et offre. La création V1 privilégie le texte et, lorsque le navigateur le permet, la dictée vocale.

## 2. Parcours utilisateur complet

### 2.1 Création et brouillon
1. L'utilisateur ouvre Flash et exprime son intention en langage naturel.
2. Il rédige ou dicte le contenu.
3. Le moteur propose une structuration (intention, catégorie, lieu, date, contraintes et durée) que l'utilisateur peut corriger.
4. Le brouillon peut être conservé sans exiger les informations qui ne sont nécessaires qu'à la publication.
5. Un brouillon local ou synchronisé n'est jamais présenté comme publié ou visible publiquement.

Le principe de demande partielle s'applique : conserver les éléments exploitables et demander uniquement les données réellement indispensables à l'action suivante.

### 2.2 Publication
La publication est distincte de la sauvegarde. Avant publication, l'utilisateur confirme le contenu, la durée, la zone/portée, l'urgence si applicable, le public autorisé et les informations de profil visibles. Le serveur vérifie l'auteur, les droits, la modération, les champs requis, la position privée et les règles de diffusion. Le succès n'est affiché qu'après confirmation serveur.

La cible de sécurité documentée exige une opération atomique de publication : portée, urgence, position privée et état `live` doivent être validés et écrits ensemble. Le statut ne doit jamais être promu par une mutation Sync générique.

### 2.3 Découverte et réponses
Les Flash publiés sont découverts uniquement par des lecteurs autorisés, dans les limites du public et de la portée de l'auteur. Une recherche peut présenter le titre, la catégorie, le type, la fenêtre temporelle, une zone approximative et la distance si la source l'autorise. Les coordonnées précises et champs privés ne sont jamais exposés.

Les personnes intéressées peuvent répondre, demander une précision ou se proposer selon les capacités réellement raccordées. Les réponses doivent rester liées au Flash et respecter ses permissions.

### 2.4 Gestion personnelle
L'espace « Mes Flashs » permet au propriétaire de consulter ses publications, leur état, leurs interactions confirmées et leurs échéances. Les filtres, regroupements temporels, détails et actions destructives ne portent que sur ses propres Flashs. Les données d'exemple doivent être explicitement marquées et séparées des données réelles. L'archivage et la suppression exigent une confirmation et une opération métier autorisée.

## 3. Cycle de vie canonique

États distants documentés : `draft`, `live`, `archived`, `expired`. L'état local « en attente de synchronisation/publication » n'est pas un état distant.

- absent → `draft` : création contrôlée, statut fixé côté serveur ;
- `draft` → `live` : publication atomique dédiée uniquement ;
- `live` → `archived` : archivage autorisé par le propriétaire ;
- `live` → `expired` : expiration serveur à l'échéance ;
- `archived` et `expired` sont terminaux dans le contrat V1 documenté.

Les brouillons ne sont pas visibles publiquement. Les états archivés, expirés, supprimés ou sans portée/position valide sont exclus de la découverte.

## 4. Visibilité, confidentialité et diffusion

Chaque Flash possède sa propre politique de diffusion. L'auteur choisit séparément le public cible, les zones de découverte, les informations de profil visibles et l'éventuel accès au profil complet. La visibilité d'un Flash n'ouvre jamais automatiquement le profil complet de son auteur. Les paramètres d'une publication ne sont pas repris silencieusement par la suivante.

La découverte géographique doit appliquer la plus restrictive des deux limites : rayon demandé par le visiteur et portée définie par l'auteur. La distance brute est comparée avant arrondi. Les coordonnées précises restent dans un stockage privé et ne sont jamais incluses dans les projections publiques ou Sync.

## 5. Règles métier et invariants

- Un brouillon n'est pas une publication.
- Un client ne choisit jamais directement le statut distant.
- Seul le propriétaire ou une autorité métier autorisée peut modifier/archiver le Flash.
- La publication et l'écriture de la position privée sont atomiques.
- Les Flash sans portée ou position valide ne sont pas publiquement découvrables.
- La recherche Scan peut lire des Flash autorisés, mais ne peut ni les modifier ni changer leur visibilité.
- Les données privées de profil et de localisation ne sont jamais renvoyées à un lecteur non autorisé.
- Aucune source ou capacité non raccordée ne doit être annoncée comme active.

## 6. Architecture et responsabilités

Le domaine Flash possède ses contrats, sa logique, son stockage, ses API, ses hooks et son UI. Le dépôt comprend notamment `src/modules/flash/api/`, `hooks/useFlashFeed.ts`, `ui/FlashComposer*`, `ui/FlashFeed.tsx` et le dashboard de gestion. La route est `/flash`. Les règles métier et les protections de statut/portée doivent rester côté serveur et base, pas uniquement dans l'interface.

## 7. Statut runtime et limites connues

Le dépôt contient le parcours de composition, de feed et de gestion ainsi que des protections et contrats de cycle de vie. Les documents d'audit identifient historiquement des écarts autour de la publication atomique, du filtrage géographique, de l'ancien flux public global et du transport Sync. L'état précis doit être vérifié sur le commit et les migrations actuels avant activation. La présence d'une RPC, d'une migration ou d'un blueprint ne prouve pas qu'elle a été exécutée sur une base distante ou que le parcours complet est disponible.

## 8. Critères de validation

Tester la création brouillon offline/online, l'interdiction de statut dans Sync, la publication atomique, l'échec avec rollback, l'isolation propriétaire, les limites de portée juste en dessous/à/au-dessus du seuil, l'absence de coordonnées dans les projections, l'expiration, l'archivage, la modération, les réponses et la séparation des données réelles/démonstration.

## 9. Sources conservées

Le blueprint du Dashboard, le contrat de publication backend, la charte, l'API historique et la vision UJ-08 sont conservés comme documents détaillés ou historiques. Ce guide constitue le point d'entrée autonome pour comprendre le moteur.