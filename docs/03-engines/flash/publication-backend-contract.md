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
