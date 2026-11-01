# Navigation principale — spécification produit V1

**Statut :** décision produit validée ; documentation de référence en cours d'alignement avec le runtime.  
**Produit :** Vitalis (les sources historiques peuvent encore employer « Vitala »).  
**Périmètre :** navigation principale mobile et accès aux espaces de l'écosystème.

## 1. Navigation validée

La navigation principale V1 comporte les entrées suivantes, dans cet ordre :

1. **Réel** — découverte des personnes à proximité immédiate.
2. **Flash** — diffusion et consultation des informations/intentions Flash.
3. **Scan** — recherche active selon le périmètre Scan.
4. **Radar** — exploration et suivi de ce qui se passe autour de l'utilisateur.
5. **2x2** — accès au menu secondaire de l'écosystème.

Cette liste est la décision produit de référence. Elle remplace, pour la cible V1, l'ancienne navigation à quatre entrées « Accueil, Flash, Radar, Menu ». Elle ne signifie pas que le code actuel a déjà été aligné.

## 2. Comportement des entrées

| Entrée | Destination V1 | Responsabilité |
| --- | --- | --- |
| Réel | `/` | Page d'accueil fonctionnelle centrée sur la découverte à proximité |
| Flash | `/flash` | Conserver la destination Flash existante |
| Scan | `/scan` | Nouvelle destination à créer ; ne pas confondre avec Réel |
| Radar | `/radar` | Conserver la destination Radar existante |
| 2x2 | Ouvre le menu secondaire | Accès aux autres espaces ; ce n'est pas une page métier Réel |

La décision précédente établit que la route racine `/` devient Réel. Flash et Radar conservent leurs routes. Une route Scan dédiée est nécessaire.

## 3. Menu 2x2

Le 2x2 est le point d'accès au menu secondaire, distinct des quatre destinations métier principales.

Les entrées déjà présentes dans le composant de menu sont :
- Espace — `/espace`
- Talents — `/talents`

Le périmètre exact du menu 2x2 doit rester cohérent avec les choix produit validés. Ne pas ajouter de destinations ou transformer ce menu en cinquième moteur métier sans arbitrage explicite.

## 4. Règles d'expérience

- Direction visuelle validée : **hybride, premium, simple et vivant**.
- La navigation doit rester immédiatement compréhensible, mobile-first et accessible au pouce.
- L'état actif doit être perceptible et cohérent sur toutes les pages.
- Le menu secondaire se ferme après navigation et lors d'un changement de route.
- Les libellés visibles doivent être internationalisés en français et en anglais.
- Respecter les safe areas, le clavier, le focus visible et la réduction de mouvement.
- La navigation ne doit pas embarquer de logique métier propre aux moteurs.

## 5. État constaté dans le dépôt — main inspecté

Les fichiers examinés montrent un écart entre la décision cible et le runtime actuel :

| Fichier | État constaté | Alignement attendu |
| --- | --- | --- |
| `src/components/app/AppShell.tsx` | Monte BottomNav et MenuSheet dans le shell global ; ferme le menu au changement de route | Conserver le rôle de shell ; vérifier les états actifs et l'intégration des cinq entrées |
| `src/components/app/BottomNav.tsx` | Quatre onglets : Accueil (`/`), Flash, Radar et Menu | Remplacer la configuration cible par Réel, Flash, Scan, Radar et 2x2 |
| `src/components/app/MenuSheet.tsx` | Menu secondaire avec Espace et Talents | Conserver ces destinations tant que le périmètre 2x2 n'est pas autrement arbitré |
| `src/routes/index.tsx` | Route `/` affiche HomeFoundation | Faire de la route racine la page Réel V1, sans supprimer silencieusement le contenu historique utile |
| `src/routes/flash.tsx` | Route Flash présente | Conserver |
| `src/routes/radar.tsx` | Route Radar présente | Conserver |
| `src/routes/scan.tsx` | Fichier absent de la liste des routes examinées | Créer la route Scan dans un lot runtime ultérieur |
| `src/routes/espace.tsx` | Route présente | Conserver comme destination du menu secondaire |
| `src/routes/talents.tsx` | Route présente | Conserver comme destination du menu secondaire |
| `src/routes/README.md` | Convention TanStack file-based routing documentée | Compléter la table des routes lorsque Réel et Scan sont effectivement câblés |
| `src/routes/__root.tsx` | Shell racine avec AppShell et Outlet | Conserver le point d'insertion des routes |
| `src/lib/i18n/messages.ts` | Clés Accueil/Flash/Radar/Menu et Espace/Talents en FR/EN | Ajouter les clés Réel, Scan et 2x2 en FR/EN lors du lot runtime |
| `src/routeTree.gen.ts` | Fichier généré, non éditable à la main | Laisser le générateur le mettre à jour après création des routes |

Cette table est un état constaté lors de la revue documentaire du 1er novembre 2026 sur la branche main examinée. Toute intervention runtime devra recontrôler les fichiers sur la branche de travail au moment du développement.

## 6. Frontières entre les pages

- **Réel** répond à « qui est présent tout près de moi maintenant ? ».
- **Scan** répond à une intention de recherche active ; son périmètre et ses contrats restent ceux du domaine Scan.
- **Radar** répond à une logique d'exploration/suivi autour de l'utilisateur.
- **Flash** diffuse des informations ou intentions.
- **2x2** ouvre des destinations secondaires et ne remplace pas les moteurs.

Réel et Scan ne doivent pas être fusionnés sous prétexte qu'ils peuvent tous deux utiliser une notion de proximité.

## 7. Contrôles attendus avant livraison runtime

- La navigation affiche les cinq entrées dans l'ordre validé.
- Chaque entrée ouvre la destination correcte.
- Le 2x2 ouvre et ferme correctement le menu secondaire.
- L'état actif est correct sur les routes directes, les retours arrière et les changements de route.
- Les routes Réel, Flash, Scan, Radar, Espace et Talents répondent sans 404.
- Les libellés FR/EN sont complets.
- Les tests couvrent clavier, lecteur d'écran, focus, tailles mobiles et safe areas.
- Les tests vérifient qu'aucun écran historique utile n'a été perdu lors du changement de route racine.

## 8. Évolution V2/V3

La structure V2/V3 de la navigation est gouvernée par le document [Roadmap Réel V1–V3](../03-engines/reel/roadmap.md). Toute nouvelle entrée doit être arbitrée, affectée à une version et ajoutée aux index et tests correspondants avant son implémentation.
