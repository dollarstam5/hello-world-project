# Cartographie documentaire — Navigation et Réel V1–V3

**Périmètre :** décisions prises depuis l'ouverture du sujet Réel jusqu'à la demande de consolidation actuelle, et fichiers du dépôt à maintenir pour leur traçabilité.  
**Dépôt examiné :** `dollarstam5/hello-world-project`, branche `main` au commit `3c76b10d566ded23e2235373c5022da0942b884a`, puis branche documentaire `docs/reel-v1-spec`.  
**Date du contrôle :** 1er novembre 2026.  
**Statut :** cartographie de travail ; aucune suppression ni migration d'archives n'est autorisée par ce document.

## 1. Décisions à préserver depuis les échanges

### 1.1 Navigation

Décision produit validée :
- Réel
- Flash
- Scan
- Radar
- 2x2

Cible de routes décidée :
- Réel : `/`
- Flash : `/flash`
- Scan : `/scan`
- Radar : `/radar`
- 2x2 : ouverture du menu secondaire ; Espace et Talents sont les destinations déjà présentes dans le composant de menu.

Direction UI/UX : hybride, premium, simple et vivant.

### 1.2 Réel — règles validées

- Présence manuelle, indépendante du statut, maintenue jusqu'à désactivation explicite.
- Un statut actif maximum ; durées fixes 30 min, 1 h, 2 h, 3 h, 6 h, 12 h, 24 h ; à expiration, suppression ; modification sans renouvellement ; remplacement avec confirmation et atomicité serveur.
- Présence active sans statut visible : profil absent de la découverte.
- Rayons 10 m, 25 m, 50 m, 100 m, 250 m, 500 m, 1 km ; défaut 50 m ; dernier rayon mémorisé ; changement manuel ; aucun élargissement automatique.
- Profil intermédiaire ; nom/prénom, photo/avatar, intention/statut ; âge, présentation, intérêts facultatifs avec visibilité par champ.
- Téléphone et GPS exact privés ; distance approximative par plages ; protection contre la triangulation.
- GPS précis requis pour la visibilité ; position exacte utilisée temporairement, sans historique durable ; tolérance de dernière position fiable de 2 minutes puis masquage ; présence conservée si localisation indisponible.
- Demande simple « Ça m'intéresse », sans message joint ; destinataire voit le profil autorisé, le statut et la distance approximative ; notification in-app et push si autorisée ; aucun rappel automatique ; pas de notification explicite de refus à l'expéditeur.
- Cooldown de 24 h unidirectionnel après refus/retrait, horodaté côté serveur.
- Règles Groupe A sur unicité des demandes en attente, retrait, acceptation/refus, blocage, fin de connexion et historique en lecture seule.
- Les échanges antérieurs posent le chat textuel et le partage facultatif de coordonnées après acceptation comme orientation produit ; le parcours précis reste à arbitrer dans C-03.

### 1.3 État des parties C

- C-01 : consultation du profil, déjà définie ; ne pas rouvrir.
- C-02.1 : demande simple sans message — validée.
- C-02.2 : profil visible, statut et distance approximative avant acceptation — validé.
- C-02.3 : notification in-app et push si autorisée, sans rappel automatique — validé.
- C-02.4 : pas de notification explicite de refus à l'expéditeur — validé.
- C-03 : chat textuel et partage facultatif de coordonnées sont des orientations antérieures ; détails à arbitrer.
- C-04 : effets métier principaux déjà définis par Groupe A ; présentation UI à détailler.

## 2. Références documentaires canoniques

| Fichier | Rôle | Action documentaire |
| --- | --- | --- |
| `docs/README.md` | Index racine de la documentation | Ajouter les liens Navigation et Réel V1–V3 |
| `docs/01-product/README.md` | Index produit | Ajouter Navigation principale |
| `docs/01-product/navigation.md` | Contrat produit de navigation | Nouveau fichier canonique |
| `docs/01-product/experience-system.md` | Principes UX/UI communs | Référence liée ; mise à jour seulement si les principes globaux changent |
| `docs/00-foundation/design-language.md` | Tokens, mouvement, responsive, accessibilité | Référence de conformité visuelle ; pas de duplication des règles de navigation |
| `docs/01-product/user-journeys.md` | Carte des parcours | Ajouter le parcours Réel seulement après consolidation C-03/C-04 |
| `docs/02-architecture/frontend-experience.md` | Shell, routes et architecture front | Ajouter l'état observé de navigation et pointer vers la spécification produit |
| `docs/02-architecture/README.md` | Index architecture | Conserver le lien front-end ; ajouter la référence produit liée si utile |
| `docs/03-engines/README.md` | Index des domaines métier | Indexer Réel |
| `docs/03-engines/reel/reel-engine.md` | Référence fonctionnelle normative de Réel | Consolider Groupes A/B et C-01/C-02 ; compléter C-03/C-04 |
| `docs/03-engines/reel/roadmap.md` | Continuité V1/V2/V3 | Nouveau fichier ; V2/V3 restent non engagées tant qu'elles ne sont pas arbitrées |
| `docs/07-annexes/README.md` | Index des annexes | Ajouter la présente cartographie |
| `docs/07-annexes/reel-navigation-documentation-map.md` | Matrice fichier par fichier et traçabilité des décisions | Nouveau fichier canonique de suivi |

## 3. Fichiers runtime à aligner lors d'un lot distinct

Cette liste n'autorise pas une modification immédiate du code. Elle décrit les dépendances identifiées sur `main`.

| Fichier | État observé sur main | Travail runtime attendu pour la navigation Réel V1 |
| --- | --- | --- |
| `src/routes/__root.tsx` | Racine TanStack, AppShell et Outlet | Préserver le shell et l'insertion des routes |
| `src/routes/index.tsx` | `/` affiche HomeFoundation | Faire de `/` l'entrée Réel ; décider séparément du contenu HomeFoundation à préserver |
| `src/routes/flash.tsx` | Présent | Conserver |
| `src/routes/radar.tsx` | Présent | Conserver |
| `src/routes/scan.tsx` | Absent de l'inventaire des routes | Créer route Scan dédiée |
| `src/routes/espace.tsx` | Présent | Conserver |
| `src/routes/talents.tsx` | Présent | Conserver |
| `src/routes/README.md` | Convention de routage fichier par fichier | Mettre à jour la table des routes après création |
| `src/components/app/AppShell.tsx` | Monte BottomNav et MenuSheet ; ferme le menu au changement de route | Vérifier le shell, le menu et les états actifs |
| `src/components/app/BottomNav.tsx` | Accueil, Flash, Radar, Menu (4 entrées) | Passer à Réel, Flash, Scan, Radar, 2x2 |
| `src/components/app/MenuSheet.tsx` | Menu secondaire Espace et Talents | Conserver comme menu secondaire 2x2 |
| `src/lib/i18n/messages.ts` | Clés FR/EN pour Accueil, Flash, Radar, Menu, Espace et Talents | Ajouter Réel, Scan et 2x2 en FR/EN |
| `src/routeTree.gen.ts` | Généré automatiquement ; non éditable à la main | Régénérer par l'outillage après ajout des routes |
| `src/components/experience/HomeFoundation.tsx` | Cible actuelle de la route racine | Examiner les éléments réutilisables avant remplacement ; ne pas supprimer à l'aveugle |

## 4. Fichiers domaine, contrats, données et tests — à vérifier avant création

| Zone | Cible de travail proposée | Statut |
| --- | --- | --- |
| Domaine UI/hooks/services | `src/domains/reel/` | Structure candidate, existence complète non vérifiée |
| Contrats partagés | `packages/core-contracts/` | Impacts à spécifier après C-03/C-04 et audit des contrats existants |
| Logique métier pure | `packages/core-logic/` | Impacts à spécifier ; aucune création anticipée |
| Persistance locale et distante | `packages/core-db/`, Supabase | Schéma et migrations à réconcilier avant toute proposition |
| Synchronisation | `packages/core-sync/` | Nécessité et volume à établir ; viser les coûts V1 minimaux |
| Tests domaine | `tests/reel/` ou emplacement canonique réellement utilisé | Localiser la convention réelle avant d'ajouter |
| Tests navigation | suite de tests existante | Le chemin `tests/navigation.test.ts` évoqué antérieurement n'a pas été retrouvé par la recherche ; localiser avant de créer un doublon |
| Notifications | plateforme et contrats existants | Vérifier les capacités réellement disponibles |
| Localisation | permissions Android/iOS et plateforme | Tester les limites OS ; ne pas promettre le suivi continu |

## 5. Sources existantes à conserver et relier

| Fichier existant | Relation avec Navigation/Réel | Décision |
| --- | --- | --- |
| `src/routes/README.md` | Source technique des conventions de route | Conserver ; compléter après changement runtime |
| `docs/02-architecture/frontend-experience.md` | Source canonique architecture front | Conserver et lier à Navigation |
| `docs/01-product/experience-system.md` | Principes d'expérience | Conserver |
| `docs/00-foundation/design-language.md` | Langage visuel et accessibilité | Conserver |
| `docs/01-product/user-journeys.md` | Parcours produit | Étendre après arbitrages complets |
| `docs/03-engines/flash/flash-engine.md` et sources Flash | Frontière avec Flash | Conserver ; ne pas modifier le moteur Flash pour Réel |
| Sources Scan sous `docs/03-engines/scan/` | Frontière Scan / Réel | Comparer pour éviter le doublon de proximité |
| Sources Radar sous `docs/03-engines/radar/` | Frontière Radar / Réel | Conserver |
| `docs/05-ai/CONTRIBUTING_AI.md` | Gouvernance des modifications | Conserver ; appliquer ses règles i18n, routes, tests et fichiers générés |

## 6. Séquence documentaire et technique

1. Stabiliser les arbitrages fonctionnels Réel, notamment C-03 et C-04.
2. Finaliser la spécification `reel-engine.md` et les index.
3. Valider le contrat produit de navigation et les routes cibles.
4. Effectuer la matrice d'impact runtime, contrats, données, sécurité, coûts et tests.
5. Faire approuver séparément tout changement de schéma, migration ou permission.
6. Réaliser le lot runtime dans une PR dédiée, sans modifier l'authentification.
7. Vérifier navigation complète, accessibilité, FR/EN, performances, confidentialité, offline et tests.
8. Conserver les sources historiques ; aucune suppression sans comparaison intégrale et autorisation explicite.

## 7. Règle de continuité V1–V3

La roadmap `docs/03-engines/reel/roadmap.md` est la source de suivi des évolutions. Une proposition V2 ou V3 doit référencer la règle V1 concernée, être explicitement arbitrée, et préciser ses impacts ainsi que ses critères de validation. Les versions futures ne sont pas des promesses de livraison.
