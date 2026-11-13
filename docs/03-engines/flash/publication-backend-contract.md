# Flash — contrat de publication géographique V1

**Statut :** préparation technique ; non activé en production  
**Référence :** décisions V1 validées et audit des migrations présentes dans `main` au 13 novembre 2026  
**Périmètre :** publication, stockage privé de la position, visibilité publique et recherche de proximité  
**Sécurité :** aucune migration exécutée sur une base distante pendant cette préparation

## 1. Règles produit validées

Les identifiants techniques existants sont conservés pour ne pas casser les enregistrements historiques et les mutations offline.

| Identifiant | Libellé d’interface | Rayon maximal |
|---|---|---:|
| `current_area` | Ma zone actuelle (500 m) | 500 m |
| `expanded_area` | Zone élargie (2 km) | 2 000 m |
| `half_city` | Grand secteur (5 km) | 5 000 m |
| `whole_city` | Large diffusion (15 km) | 15 000 m |

Les anciennes propositions 10 km et 100 km sont abandonnées. Le choix d’une zone libre et la diffusion nationale sont reportés à V3.

La position GPS utilisée comme centre du Flash est celle capturée au moment de sa publication. La portée choisie est une limite maximale, pas une indication approximative. Le rayon choisi par la personne qui consulte peut réduire les résultats, jamais élargir la portée décidée par l’auteur.

La détection du quartier/village et des niveaux administratifs sert à produire un libellé lisible. Elle est distincte du calcul de distance. Une localité non reconnue ne doit jamais être inventée.

## 2. Séquence de publication cible

1. La personne connectée exprime son besoin ou son offre et vérifie le texte, le type, la catégorie, le créneau, l’urgence et la portée.
2. Vitalis demande explicitement l’autorisation de localisation au moment de créer le Flash.
3. Le client obtient les coordonnées et leur précision, puis demande un libellé géographique par géocodage inverse. Le libellé est présenté pour confirmation ou correction.
4. Le client envoie au serveur le Flash et les coordonnées privées via une opération de publication authentifiée.
5. Le serveur vérifie l’identité, la propriété du Flash, les valeurs autorisées, les coordonnées et la précision.
6. Dans une seule transaction serveur, il enregistre la portée et l’urgence, écrit la position dans `flash_private_locations`, puis passe le Flash à l’état `live`.
7. Si une étape échoue, la transaction est annulée : aucun Flash incomplet ne devient visible.
8. Le client n’affiche la confirmation de publication qu’après le succès confirmé du serveur. Hors ligne, l’action reste en attente locale et n’est pas annoncée comme publiée.

Le statut `live` ne doit jamais être accordé par une simple mutation client de synchronisation. La transition vers `live` doit être réservée à l’opération serveur atomique. La fonction de transition existante doit être limitée à l’archivage ou à d’autres transitions explicitement autorisées.

## 3. Stockage et confidentialité

- `public.flashes` contient les métadonnées nécessaires au contrat et à la synchronisation, notamment `scope` et `urgency`.
- Les coordonnées précises restent exclusivement dans `public.flash_private_locations`, avec `flash_id`, `author_id`, latitude, longitude et précision.
- Ne jamais ajouter latitude, longitude ou précision à la ligne `public.flashes` : le transport de synchronisation lit les lignes Flash et ne doit pas exposer ces données.
- Les coordonnées ne sont jamais renvoyées par les RPC publiques, les projections de profil ou le flux de découverte.
- La table privée conserve RLS et les droits minimaux déjà introduits dans `20261113002000_flash_schema_columns.sql`. Les RPC privilégiées vérifient systématiquement le propriétaire.
- L’aire détectée est un libellé grossier et non une adresse précise.

## 4. Calcul de visibilité obligatoire côté serveur

Pour chaque Flash candidat :

`distance_m = distance_haversine(position_visiteur, position_publication)`

`limite_effective_m = LEAST(rayon_visiteur_m, rayon_scope_auteur_m)`

Le résultat est visible uniquement si :

`distance_m <= limite_effective_m`

La comparaison est faite sur la distance brute, avant arrondi. L’arrondi ne sert qu’à l’affichage.

Exemples de seuil pour une portée de 5 km :
- 4 999 m : visible si le rayon de recherche du visiteur le permet ;
- 5 000 m : visible si le rayon de recherche du visiteur le permet ;
- 5 001 m : invisible, même si la distance affichée arrondie paraît être 5,0 km.

Une recherche visiteur de 50 km ne peut donc jamais rendre visible un Flash de portée 500 m au-delà de 500 m. Les Flash historiques sans portée valide ou sans position privée doivent être exclus de la découverte géographique jusqu’à leur régularisation ; ne pas leur attribuer une portée par défaut.

La précision GPS est enregistrée et peut être affichée/contrôlée séparément. Elle ne doit jamais servir à élargir le rayon. Aucun seuil minimal de précision supplémentaire n’est fixé dans ce document sans décision produit dédiée.

## 5. Écarts constatés dans `main`

L’audit du code versionné a identifié les points suivants :

1. `20261113002000_flash_schema_columns.sql` crée la table privée et les champs Flash historiques, mais ne crée pas encore les colonnes `scope` et `urgency`.
2. `src/integrations/supabase/types.ts` contient actuellement latitude, longitude et précision dans le type de ligne `flashes`, alors que la migration SQL documente explicitement leur stockage séparé. Ce type généré est incohérent avec le schéma versionné et doit être corrigé.
3. `scan_public_flashes` compare actuellement le rayon demandé à une distance déjà arrondie à 0,1 km et ne tient pas compte de la portée choisie par l’auteur.
4. `list_public_flashes(p_limit)` renvoie une liste globale sans coordonnées visiteur et sans filtre de portée. Tant que ce chemin existe, il peut contourner le filtrage géographique. La découverte publique doit passer par un RPC qui reçoit la position du visiteur et applique la même règle de visibilité.
5. `set_flash_location` et `transition_flash(..., 'live')` sont deux opérations séparées. Elles ne garantissent pas une publication atomique : un Flash pourrait devenir live sans position privée. Une opération serveur unique doit écrire la position et activer la publication dans la même transaction.
6. Le parcours d’interface actuel conserve volontairement `FLASH_SCOPE_FILTERING_ENABLED = false`. Il ne collecte pas encore la position de publication et ne doit pas être activé avant le raccordement serveur et les tests.
7. Le flux distant actuel appelle `list_public_flashes` sans position du visiteur. Il devra être raccordé au RPC géographique ; le mode offline ne doit pas être présenté comme une publication distante.

## 6. Migration et API à préparer

Après synchronisation réelle de la branche de travail avec `main`, préparer une migration additive versionnée qui :

- ajoute `scope` et `urgency` avec contraintes de valeurs ;
- conserve les anciennes lignes avec valeurs nulles, mais les exclut du flux géographique tant qu’elles ne sont pas régularisées ;
- remplace la recherche par un calcul de distance brute en mètres et un filtre `LEAST(rayon visiteur, portée auteur)` ;
- ferme l’ancien accès public global sans laisser de chemin de découverte qui contourne le rayon ;
- ajoute une RPC de publication atomique authentifiée ;
- empêche les mutations ordinaires de synchronisation de promouvoir directement un Flash vers `live`.

Le contrat TypeScript Supabase doit être régénéré ou corrigé à partir du schéma versionné, sans déclarer de colonnes qui n’existent pas.

## 7. Tests requis avant activation

- Chaque portée : juste en dessous, exactement à la limite et juste au-dessus.
- Recherche visiteur plus petite que la portée auteur.
- Recherche visiteur plus grande que la portée auteur : la portée auteur reste prioritaire.
- Distance arrondie à 5,0 km mais distance brute supérieure à 5 000 m : résultat exclu.
- Portée absente/invalide, position privée absente, Flash expiré, archivé ou supprimé : résultat exclu.
- Un utilisateur ne peut ni publier au nom d’un autre auteur, ni modifier sa position, ni archiver/publier le Flash d’un autre.
- Anonyme : aucune RPC d’écriture.
- Coordonnées absentes de toutes les réponses publiques et des lignes synchronisées.
- Échec d’écriture de position : rollback, aucun statut `live`.
- Un appel client direct de synchronisation ne peut pas contourner la publication atomique.
- Le RPC global historique ne peut pas contourner le filtre géographique.
- Tests de compatibilité des anciens enregistrements et des mutations offline.

## 8. Limites de cette préparation

Ce document est un contrat de travail et un audit du code versionné. Il ne prouve pas l’état d’une base distante, n’affirme pas que les migrations ont été exécutées et n’active pas la publication. Aucune base distante ne doit être modifiée dans cette phase.

## 9. Réconciliation du protocole de synchronisation — audit du 13 novembre 2026

**Référence :** code de `main` au commit `b2452f8b9ceda0a3dfb6e3b62dd99ee7bb93bc63`. La PR #47 est toujours divergente (37 commits en avance, 15 en retard). Audit statique uniquement.

### 9.1 Chemin d'écriture constaté

Les deux entrées Sync — `src/routes/api/sync/push.ts` et `src/lib/sync/sync.functions.ts` — valident la requête puis appellent `runPush` dans `src/lib/sync/transport.server.ts`. Ce transport utilise la session Supabase de l'appelant et écrit directement dans la table physique : `INSERT` pour `create`, `UPDATE` pour `update`, et mise à jour de `deleted_at` pour `delete`. Il n'existe pas de branche de commande Flash dédiée dans `runPush`.

### 9.2 Contournement confirmé dans les contrats

Dans `main`, `CLIENT_WRITE_POLICY.flashes` autorise `create: true`, conserve `status` dans les champs `update` et ne déclare aucune commande Flash. La validation accepte les statuts `draft`, `live`, `expired` et `archived`, et exige `status` lors d'une création.

La branche de la PR #47 ne ferme pas ce chemin : elle ajoute `scope` et `urgency` aux champs Flash modifiables génériquement, mais conserve `status` dans `update` et la création générique. La validation continue d'accepter `live`. Enfin, `src/domains/flash/data.ts` crée localement un Flash avec `status: "live"`. Le drapeau UI `FLASH_SCOPE_FILTERING_ENABLED = false` n'est donc pas une frontière de sécurité : une mutation Sync construite directement peut encore tenter de créer ou promouvoir un Flash `live`.

### 9.3 Barrière SQL actuelle insuffisante

La migration historique accorde `SELECT, INSERT, UPDATE, DELETE` sur `public.flashes` au rôle `authenticated`. La politique RLS `own flashes write` vérifie la propriété de la ligne, pas la transition métier ni la présence d'une position privée.

La RPC `transition_flash(p_flash_id, p_status)` accepte encore `live` et `archived`, sans exiger une position privée. `set_flash_location` est une opération séparée. Ces fonctions ne garantissent donc pas une publication atomique.

### 9.4 Pull Sync et confidentialité

`runPull` lit les tables synchronisées avec `.select("*")`, puis `toRecord` sérialise les colonnes reçues. La séparation de `20261113002000_flash_schema_columns.sql` est essentielle : les coordonnées doivent rester exclusivement dans `flash_private_locations`, qui ne figure pas dans la liste des tables synchronisées. Les champs de portée et d'urgence peuvent être synchronisés, à condition d'être ajoutés au schéma SQL et de ne contenir aucune coordonnée privée.

### 9.5 Correction cible — ordre impératif

1. **Contrat Sync :** retirer `status` des champs Flash modifiables directement et interdire sa présence dans les patches Flash `create` et `update`. Une création synchronisée crée uniquement un brouillon `draft` via le statut par défaut de la base. L'état local « en attente de publication » reste distinct de `live` et n'est jamais présenté comme publié à distance.
2. **Écriture ordinaire :** le transport générique peut créer/modifier les champs de contenu autorisés d'un brouillon, mais ne promeut jamais son statut. L'archivage passe par une commande métier ou une RPC dédiée, pas par une écriture générique de `status`.
3. **Barrière SQL :** révoquer les privilèges table-level `INSERT`/`UPDATE` trop larges du rôle `authenticated`, puis accorder uniquement les privilèges de colonnes nécessaires à la création d'un brouillon et à l'édition autorisée. Ne jamais accorder l'écriture directe sur `status`. Conserver RLS et la vérification du propriétaire. Cette barrière doit bloquer aussi un appel PostgREST direct qui contournerait TypeScript.
4. **Publication atomique :** introduire une RPC authentifiée `publish_flash` (`SECURITY DEFINER`) qui vérifie l'auteur, l'état brouillon, la portée, l'urgence, les coordonnées et leur précision, puis écrit `scope`, `urgency`, la ligne `flash_private_locations` et `status = 'live'` dans une seule transaction. Toute erreur annule l'ensemble.
5. **Transition existante :** restreindre `transition_flash` à l'archivage (ou la remplacer par une RPC d'archivage dédiée). Elle ne doit plus accepter `live`.
6. **Offline :** la création reste en attente jusqu'à la synchronisation du brouillon et au succès confirmé de `publish_flash`. En cas d'échec réseau ou métier, aucun Flash distant `live` ni message de succès n'est enregistré.
7. **Découverte :** fermer `list_public_flashes` comme voie de découverte globale dès que le flux géographique de remplacement existe ; aucun autre chemin public ne doit contourner le filtre géographique.

Ne pas utiliser un indicateur de session ou un paramètre de configuration modifiable par le client comme autorisation de passer `status` à `live`. La frontière doit reposer sur les privilèges SQL et la RPC dédiée.

### 9.6 Tests de sécurité à ajouter

- Sync `create` avec `status: "live"` : rejeté par validation.
- Sync `update` avec `status: "live"` ou `"archived"` : rejeté, aucune écriture SQL.
- Sync `create` sans statut : crée uniquement un brouillon avec le statut par défaut.
- Appel PostgREST direct authentifié tentant un `INSERT` ou `UPDATE` avec `status = 'live'` : refusé par les privilèges SQL.
- `transition_flash(..., 'live')` : refusé.
- Publication valide : statut, portée, urgence et position privée écrits ensemble.
- Échec de validation ou d'écriture de position : rollback complet, statut toujours `draft`.
- Un autre membre ne peut ni publier ni archiver le Flash du propriétaire.
- Pull Sync sans coordonnées précises ; aucune table privée ajoutée au protocole.
- Flash historique sans portée ou position valide exclu de la découverte géographique.

**Validation :** audit statique du code GitHub uniquement. Aucun test automatisé n'a été lancé pendant cet audit ; aucun résultat CI n'est revendiqué. Aucune migration n'a été exécutée et aucune base distante n'a été modifiée.


## 10. Cycle de vie Flash — contrat des états validé

**Décision produit validée le 13 novembre 2026.** Le cycle de vie distant repose sur quatre états persistés : `draft`, `live`, `archived` et `expired`. L'état local « en attente de synchronisation/publication » n'est pas un état distant et ne doit jamais être assimilé à `live`.

### 10.1 Sens des états

| État | Signification | Visibilité publique |
|---|---|---|
| `draft` | Flash enregistré côté serveur mais pas encore publié | Non |
| `live` | Publication validée et active | Oui, uniquement via les RPC géographiques et dans les limites de portée |
| `archived` | Flash retiré volontairement par son propriétaire ou une action métier autorisée | Non |
| `expired` | Durée de vie atteinte ; état appliqué par le serveur | Non |

### 10.2 Transitions autorisées

| État source | État cible | Autorité / opération | Conditions |
|---|---|---|---|
| absent | `draft` | création Sync ordinaire ou création métier | propriétaire authentifié ; statut fixé côté serveur |
| `draft` | `live` | RPC authentifiée `publish_flash` uniquement | propriétaire, contenu valide, portée et urgence valides, position privée valide ; écriture atomique |
| `live` | `archived` | RPC/commande métier d’archivage | propriétaire du Flash ; aucune modification des coordonnées privées par cette opération |
| `live` | `expired` | processus serveur d’expiration | échéance atteinte ; transition idempotente |
| `draft` | `archived` | à ne pas autoriser dans le premier contrat V1 sans décision métier complémentaire | — |
| `archived` ou `expired` | tout autre état | aucune | états terminaux en V1 |

Aucune transition directe `draft → expired` n'est nécessaire : un brouillon non publié n'entre pas dans la découverte et sa durée de vie publique ne commence qu'à la publication. Si une règle de nettoyage des brouillons est ajoutée, elle devra être définie séparément et ne devra pas les faire apparaître comme des Flash publiés.

### 10.3 Invariants de sécurité

1. Le statut n'est jamais accepté depuis un payload Sync générique pour `create` ou `update`. Une création générique produit un `draft` grâce à une valeur par défaut SQL contrôlée par le serveur.
2. Les privilèges SQL empêchent un client authentifié de modifier directement la colonne `status`, même en contournant le code TypeScript et le transport Sync.
3. `publish_flash` vérifie que le statut courant est `draft` et que l'appelant est le propriétaire. Toute seconde publication d'un Flash déjà `live`, `archived` ou `expired` est refusée.
4. La mise à jour de `scope`, `urgency`, de la position privée et du statut `live` est atomique. Une erreur laisse le Flash en `draft` et ne laisse pas de position partielle.
5. `transition_flash` ne peut plus accepter `live`. L'archivage et l'expiration sont des opérations serveur distinctes, avec vérification de l'autorité et idempotence appropriées.
6. Les RPC de découverte excluent systématiquement `draft`, `archived`, `expired`, les Flash supprimés, expirés par date ou sans portée/position privée valide.
7. Les clients offline peuvent conserver une intention de publication en attente, mais ne montrent jamais un succès de publication avant confirmation serveur.

### 10.4 Tests bloquants avant activation

- Création Sync sans statut : état distant `draft`.
- Création ou mise à jour Sync avec `status` fourni, quelle que soit sa valeur : rejet avant écriture.
- Tentative PostgREST directe de modification de `status` par un membre : refus SQL.
- Publication valide de `draft` : une seule transition vers `live`, avec portée, urgence et position privée cohérentes.
- Publication sans position, avec portée invalide, par un non-propriétaire ou sur un état autre que `draft` : refus et rollback.
- Double appel concurrent à `publish_flash` : une seule publication réussit ; aucun doublon ni état partiel.
- `transition_flash(..., 'live')` : refus.
- Archivage par le propriétaire : `live → archived`, non visible dès confirmation.
- Expiration à échéance : `live → expired`, opération idempotente et non visible.
- `archived` et `expired` ne peuvent pas être réactivés.
- Les statuts terminaux et brouillons sont exclus de toutes les RPC publiques.

**Portée de cette décision :** contrat et préparation de tests uniquement. Elle n'autorise ni l'exécution de migrations sur une base distante, ni le déploiement, ni l'activation de la publication.


## 11. Implémentation du cycle de vie — branche de réconciliation

La branche `feat/flash-engine-experience-reconciled` applique maintenant la première barrière du cycle de vie :

- La politique Sync n'autorise plus `status` dans les champs Flash modifiables. Le mapping retire aussi le statut local du payload envoyé au serveur ; une création ordinaire s'appuie sur le défaut SQL `draft`.
- La validation Sync exige les champs métier nécessaires à la création et rejette tout statut fourni par un client, en création comme en mise à jour.
- La création locale Flash utilise `draft`, jamais `live`.
- L'archivage passe par `transition_flash(..., 'archived')`, puis demande une synchronisation. La RPC refuse désormais toute autre transition, notamment `draft → live`.
- La migration `20261113008000_flash_lifecycle_hardening.sql` ajoute les colonnes `scope` et `urgency`, une garde SQL sur les changements de statut et une RPC atomique `publish_flash`. La garde s'appuie sur une table d'autorisations privée liée à la transaction, au membre et au Flash ; aucun paramètre de session contrôlé par le client ne sert de passe-droit.
- L'exécution de `publish_flash` reste volontairement révoquée pour `authenticated` tant que le Scan ne respecte pas la portée auteur et le filtrage métrique sur distance brute avant arrondi. Le bouton de publication reste donc désactivé.

Le test `supabase/tests/database/141_flash_lifecycle.test.sql` couvre la présence des fonctions et du trigger, l'absence de privilège d'exécution de publication, le refus d'une promotion directe et le refus de promouvoir via la RPC d'archivage.

**Limite de validation :** ces changements sont enregistrés dans la branche Git uniquement. Les tests TypeScript et pgtap n'ont pas été exécutés ici ; aucune réussite CI n'est revendiquée. La migration n'a pas été appliquée à une base distante.


## 12. Réconciliation Scan — portée auteur et distance métrique

La migration `20261113009000_flash_scan_author_scope.sql` remplace le calcul de visibilité de `scan_public_flashes` :

- `current_area` limite chaque Flash à 500 m ;
- `expanded_area` limite chaque Flash à 2 km ;
- `half_city` limite chaque Flash à 5 km ;
- `whole_city` limite chaque Flash à 15 km ;
- la limite effective est `LEAST(rayon demandé par le visiteur, rayon de portée de l'auteur)` ;
- la distance Haversine est comparée en mètres avant l'arrondi de présentation ;
- les Flash sans portée reconnue ou sans position privée restent exclus ;
- aucune coordonnée précise n'est renvoyée.

L'ancien RPC `list_public_flashes(p_limit)` ne reçoit pas la position du visiteur et ne peut donc pas appliquer ces règles. Son exécution est révoquée pour `PUBLIC`, `anon` et `authenticated`. Le flux générique qui l'utilisait doit rester indisponible comme flux distant tant qu'il n'est pas raccordé à une recherche géographique avec position autorisée ; le RPC Scan dédié, lui, reçoit déjà les coordonnées et applique le nouveau filtre.

Le type Supabase `flashes` est également réaligné : latitude, longitude et précision sont retirées des types de la table synchronisée ; `scope` et `urgency` sont non nulles et la signature de `publish_flash` est déclarée.

Le test `142_flash_scan_author_scope.test.sql` couvre la fermeture du flux global, l'absence de coordonnées en sortie, la limite de portée auteur et la réduction supplémentaire par le rayon visiteur. Le test historique `122_flash_public_rpcs.test.sql` est ajusté pour vérifier le chemin géographique au lieu du flux global.

**État de validation :** migrations, types et tests sont enregistrés dans la branche de la PR #72. Leur validation automatisée reste en attente des contrôles GitHub sur le dernier commit. Aucune base distante n'a été modifiée. La publication reste désactivée tant que le parcours client complet et ses tests de publication atomique ne sont pas raccordés.
