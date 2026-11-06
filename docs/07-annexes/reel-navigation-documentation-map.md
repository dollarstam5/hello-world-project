# Cartographie documentaire — Navigation et Réel V1–V3

**Périmètre :** décisions prises depuis l'ouverture du sujet Réel jusqu'à la demande de consolidation actuelle, et fichiers du dépôt à maintenir pour leur traçabilité.  
**Dépôt examiné :** `dollarstam5/hello-world-project`, branche `main` au commit `3c76b10d566ded23e2235373c5022da0942b884a`, puis branche documentaire `docs/reel-v1-spec`.  
**Date du contrôle :** 1er novembre 2026.  
**Statut :** cartographie de travail ; aucune suppression ni migration d'archives n'est autorisée par ce document.

## 1. Décisions à préserver depuis les échanges

### 1.1 Entrée Home et navigation

**Home est distincte de Réel.** La route racine `/` est réservée au point d'entrée Home et à ses états conditionnels :
- onboarding lors de la première utilisation tant qu'il n'est pas terminé ;
- Home explicative après onboarding et avant identification réussie ;
- Home interactive après réussite du parcours d'identification existant.

L'icône de l'application ramène à Home et ne doit pas ouvrir Réel directement. La Home interactive donne accès à Réel, Flash, Scan, Radar et aux pages/catégories secondaires.

La navigation métier principale conserve cinq entrées :
- Réel
- Flash
- Scan
- Radar
- 2x2

État des destinations :
- Home : `/`
- Réel : destination dédiée à confirmer dans l'inventaire runtime ; ne pas attribuer `/` à Réel. `/reel` reste une option à examiner, pas une route attestée.
- Flash : `/flash`
- Scan : `/scan` cible, à vérifier
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
- C-03.1 à C-03.9 sont validées : conversation créée après acceptation, texte uniquement, partage volontaire ponctuel d'une zone approximative après confirmation, notifications, états, limite de 1 000 caractères, retrait d'affichage côté auteur et signalement. Les seuils anti-spam et la rétention technique restent ouverts.

### 1.3 État des parties C

- C-01 : consultation du profil, déjà définie ; ne pas rouvrir.
- C-02.1 : demande simple sans message — validée.
- C-02.2 : profil visible, statut et distance approximative avant acceptation — validé.
- C-02.3 : notification in-app et push si autorisée, sans rappel automatique — validé.
- C-02.4 : pas de notification explicite de refus à l'expéditeur — validé.
- C-03.1 à C-03.9 : décisions fonctionnelles validées ; détails techniques, seuils anti-spam et rétention restent à spécifier/vérifier.
- C-04.1 à C-04.5 : décisions fonctionnelles validées, y compris états UI, confirmations, texte neutre et conséquences sur la découverte.

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
| `docs/03-engines/reel/reel-engine.md` | Référence fonctionnelle normative de Réel | Référence normative Groupes A/B et C-01 à C-04 ; maintenir les décisions validées et distinguer les inconnues techniques |
| `docs/03-engines/reel/roadmap.md` | Continuité V1/V2/V3 | Référence de versionnement ; C-03/C-04 validées en V1, V2/V3 non engagées |
| `docs/07-annexes/README.md` | Index des annexes | Ajouter la présente cartographie |
| `docs/07-annexes/reel-navigation-documentation-map.md` | Matrice fichier par fichier et traçabilité des décisions | Nouveau fichier canonique de suivi |

## 2.1 Parcours Home à tracer

| ID | Exigence | Documents de référence | Scénarios attendus | Statut |
| --- | --- | --- | --- | --- |
| HOME-01 | Première utilisation : onboarding avant Home explicative | `navigation.md`, `user-journeys.md` | T-HOME-01, T-HOME-02 | Décision produit clarifiée ; runtime/tests non vérifiés |
| HOME-02 | Après onboarding, présenter la Home explicative | mêmes références | T-HOME-03 | Décision produit clarifiée ; runtime/tests non vérifiés |
| HOME-03 | Le CTA de Home explicative ouvre le parcours d'identification existant | mêmes références, contrats Identity/UDI | T-HOME-04, T-HOME-05 | À confronter au parcours existant ; aucun changement Auth autorisé |
| HOME-04 | Après identification réussie, rediriger vers Home interactive | mêmes références | T-HOME-06, T-HOME-07 | Décision produit clarifiée ; runtime/tests non vérifiés |
| HOME-05 | L'icône de l'application ramène à Home selon l'état utilisateur | mêmes références, route racine | T-HOME-08, T-HOME-09 | Décision produit clarifiée ; runtime/tests non vérifiés |
| HOME-06 | Home interactive donne accès à Réel, Flash, Scan, Radar et aux catégories secondaires | navigation et architecture front | T-HOME-10 | Câblage runtime non vérifié |
| HOME-07 | Home et Réel ont des destinations distinctes | navigation, frontend-experience | T-HOME-11 | Correction documentaire requise avant runtime |

## 3. Matrice de traçabilité Réel V1

La matrice détaillée des décisions R/A/B/C/P, exigences techniques et scénarios de test est [Réel V1 — matrice de traçabilité](../03-engines/reel/reel-traceability-matrix.md). Elle décrit des exigences et tests attendus ; elle ne certifie ni l'existence des tests ni leur exécution.

## 4. Fichiers runtime à aligner lors d'un lot distinct

Cette liste n'autorise pas une modification immédiate du code. Elle décrit les dépendances identifiées sur `main`.

| Fichier | État observé sur main | Travail runtime attendu pour la navigation Réel V1 |
| --- | --- | --- |
| `src/routes/__root.tsx` | Racine TanStack, AppShell et Outlet | Préserver le shell et l'insertion des routes |
| `src/routes/index.tsx` | `/` affiche toujours HomeFoundation sur `main` au 6 novembre 2026 | Faire évoluer la route en point d'entrée Home à états ; préserver et inventorier le contenu utile |
| `src/routes/flash.tsx` | Présent | Conserver |
| `src/routes/radar.tsx` | Présent | Conserver |
| `src/routes/scan.tsx` | Route `/scan` présente sur `main` au 6 novembre 2026 | Vérifier le parcours et les contrats Scan ; présence de route ne vaut pas validation fonctionnelle |
| `src/routes/espace.tsx` | Présent | Conserver |
| `src/routes/talents.tsx` | Présent | Conserver |
| `src/routes/README.md` | Convention de routage fichier par fichier | Mettre à jour la table des routes après création |
| `src/components/app/AppShell.tsx` | Monte BottomNav et MenuSheet ; ferme le menu au changement de route | Vérifier le shell, le menu et les états actifs |
| `src/components/app/BottomNav.tsx` | Cinq entrées : Réel (`/`), Flash, Scan, Radar et 2x2 ; Réel pointe actuellement vers la racine | Faire pointer Home vers `/` et Réel vers une destination dédiée ; revoir l'icône et l'état actif selon les règles validées |
| `src/components/app/MenuSheet.tsx` | Menu secondaire Espace et Talents | Conserver comme menu secondaire 2x2 |
| `src/lib/i18n/messages.ts` | Clés FR/EN pour Accueil, Flash, Radar, Menu, Espace et Talents | Ajouter Réel, Scan et 2x2 en FR/EN |
| `src/routeTree.gen.ts` | Généré automatiquement ; non éditable à la main | Régénérer par l'outillage après ajout des routes |
| `src/components/experience/HomeFoundation.tsx` | Cible actuelle de la route racine dans l'audit historique | Évaluer sa réutilisation pour Home explicative/interactive ; ne pas supprimer à l'aveugle |

## 5. Fichiers domaine, contrats, données et tests — à vérifier avant création

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

## 6. Sources existantes à conserver et relier

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

## 7. Séquence documentaire et technique

1. Maintenir les décisions fonctionnelles R/A/B/C/P synchronisées dans la spécification et la matrice de traçabilité.
2. Valider les index et la cartographie documentaire.
3. Valider le contrat produit de navigation et les routes cibles.
4. Effectuer la matrice d'impact runtime, contrats, données, sécurité, coûts et tests.
5. Faire approuver séparément tout changement de schéma, migration ou permission.
6. Réaliser le lot runtime dans une PR dédiée, sans modifier l'authentification.
7. Vérifier navigation complète, accessibilité, FR/EN, performances, confidentialité, offline et tests.
8. Conserver les sources historiques ; aucune suppression sans comparaison intégrale et autorisation explicite.

## 8. Règle de continuité V1–V3

La roadmap `docs/03-engines/reel/roadmap.md` est la source de suivi des évolutions. Une proposition V2 ou V3 doit référencer la règle V1 concernée, être explicitement arbitrée, et préciser ses impacts ainsi que ses critères de validation. Les versions futures ne sont pas des promesses de livraison.
