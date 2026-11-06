# Navigation principale — spécification produit V1

**Statut :** décision produit consolidée ; alignement runtime à réaliser séparément.  
**Produit :** Vitalis (les sources historiques peuvent encore employer « Vitala »).  
**Périmètre :** entrée de l'application, parcours d'accueil, navigation des moteurs et accès aux espaces secondaires.

## 1. Modèle d'entrée : Home

**Home est distincte de Réel.** La page Home est le point d'entrée général de Vitalis et le point de retour associé à l'icône de l'application. Réel est un moteur fonctionnel accessible depuis Home ; il ne remplace pas Home.

Le parcours d'entrée attendu comporte les états suivants :

1. **Première utilisation : onboarding.** L'utilisateur découvre les étapes initiales de prise en main.
2. **Home explicative.** Après l'onboarding, une page présente clairement Vitalis, son fonctionnement et les possibilités offertes.
3. **Demande d'identification.** Lorsque l'utilisateur choisit de poursuivre depuis cette Home explicative, Vitalis lui demande de s'identifier.
4. **Identification terminée.** Une fois le parcours d'identification existant terminé avec succès, l'utilisateur est redirigé vers la Home interactive.
5. **Home interactive.** Elle sert de hub général et donne accès aux moteurs Réel, Flash, Scan et Radar, ainsi qu'aux autres pages et catégories disponibles.

L'icône de l'application ramène à Home. Le contenu présenté dépend de l'état du parcours : Home explicative avant identification, Home interactive après identification. Pour une première ouverture, l'onboarding précède la Home explicative.

**Frontière d'implémentation :** cette règle décrit l'orchestration de navigation. Elle ne définit pas de nouveaux champs d'identité, ne remplace pas le système d'authentification existant et ne prouve pas que ces écrans ou redirections sont déjà implémentés.

## 2. Navigation principale des moteurs

La navigation principale métier V1 conserve les entrées validées suivantes, dans cet ordre :

1. **Réel** — découverte des personnes à proximité physique immédiate.
2. **Flash** — diffusion et consultation des informations ou intentions Flash.
3. **Scan** — recherche active selon le périmètre Scan.
4. **Radar** — exploration et suivi de ce qui se passe autour de l'utilisateur.
5. **2x2** — accès au menu secondaire de l'écosystème.

Ces entrées ne remplacent pas Home. Home constitue le point d'entrée global ; les moteurs sont des destinations fonctionnelles accessibles depuis Home et la navigation de l'application.

| Entrée | Destination / règle | Responsabilité |
| --- | --- | --- |
| Home | Route racine `/` — rendu dépendant de l'état d'entrée | Présentation générale et hub interactif |
| Réel | Destination dédiée à confirmer dans le contrat de routes ; ne pas utiliser `/` par défaut | Découverte de personnes à proximité immédiate |
| Flash | `/flash` | Diffusion et consultation Flash |
| Scan | `/scan` cible, à vérifier dans le runtime | Recherche active Scan |
| Radar | `/radar` | Exploration et suivi |
| 2x2 | Ouvre le menu secondaire | Accès aux espaces et catégories secondaires |

Le chemin technique définitif de Réel doit être confirmé avec l'inventaire de routage avant toute modification runtime. `/reel` peut être étudié comme destination dédiée, mais n'est pas déclaré ici comme route déjà créée ou décision de chemin définitivement validée.

## 3. Menu 2x2 et catégories secondaires

Le 2x2 est le point d'accès au menu secondaire, distinct des destinations métier principales.

Les entrées déjà présentes dans le composant de menu sont :
- Espace — `/espace`
- Talents — `/talents`

Les futures pages et catégories doivent être ajoutées selon leur responsabilité produit, leur version et leur contrat de navigation. Ne pas inventer de destinations ni transformer le 2x2 en moteur métier sans arbitrage explicite.

## 4. Règles d'expérience

- Direction visuelle validée : **hybride, premium, simple et vivant**.
- L'onboarding précède la Home explicative uniquement lors de la première utilisation, selon l'état réellement conservé par l'application.
- La Home explicative présente le fonctionnement de Vitalis avant de proposer l'identification.
- La Home interactive n'est affichée qu'après la fin réussie du parcours d'identification.
- L'icône de l'application ramène au point d'entrée Home et ne doit pas ouvrir directement Réel.
- La navigation doit rester immédiatement compréhensible, mobile-first et accessible au pouce.
- Les libellés visibles sont internationalisés en français et en anglais.
- Respecter les safe areas, le clavier, le focus visible et la réduction de mouvement.
- Les pages Home orchestrent l'accès aux domaines ; elles ne deviennent pas propriétaires de la logique métier des moteurs.

## 5. État constaté dans le dépôt — inventaire historique

Les constats ci-dessous ont été actualisés le 6 novembre 2026 sur `main` (HEAD `86f4f43cbd6942a8e7df95d3ce53c3db9634a7fb`). Ils décrivent le câblage observé à cette date, pas la conformité au parcours produit attendu.

| Fichier | État constaté | Alignement attendu |
| --- | --- | --- |
| `src/components/app/AppShell.tsx` | Monte BottomNav et MenuSheet dans le shell global | Conserver le shell et définir les états de navigation cohérents avec Home et les moteurs |
| `src/components/app/BottomNav.tsx` | Cinq entrées : Réel (`/`), Flash (`/flash`), Scan (`/scan`), Radar (`/radar`) et menu 2x2 | Corriger la destination Réel pour qu'elle soit distincte de Home ; vérifier les états actifs et l'accès à Home |
| `src/components/app/MenuSheet.tsx` | Menu secondaire avec Espace et Talents | Conserver ces destinations tant que le périmètre 2x2 n'est pas autrement arbitré |
| `src/routes/index.tsx` | Route `/` affiche `HomeFoundation` | Examiner et faire évoluer cette Home selon les états onboarding, explicatif et interactif |
| `src/routes/flash.tsx` | Route Flash présente | Conserver |
| `src/routes/radar.tsx` | Route Radar présente | Conserver |
| `src/routes/scan.tsx` | Route `/scan` présente sur `main` au contrôle du 6 novembre 2026 | Vérifier le parcours et les contrats fonctionnels de Scan ; ne pas assimiler présence de route et validation métier |
| Route Réel | Destination dédiée non confirmée par cet inventaire | Localiser ou créer une route distincte de Home après vérification |
| `src/routes/espace.tsx` | Route présente | Conserver comme destination secondaire |
| `src/routes/talents.tsx` | Route présente | Conserver comme destination secondaire |
| `src/routes/__root.tsx` | Shell racine avec AppShell et Outlet | Préserver le shell et l'insertion des routes |
| `src/lib/i18n/messages.ts` | Clés Accueil/Flash/Radar/Menu et Espace/Talents en FR/EN | Compléter les libellés Home, Réel, Scan et 2x2 selon les écrans réellement livrés |
| `src/routeTree.gen.ts` | Fichier généré | Laisser le générateur le mettre à jour après évolution des routes |

## 6. Frontières entre les pages

- **Home explicative** répond à « qu'est-ce que Vitalis et comment fonctionne-t-il ? ».
- **Home interactive** répond à « où puis-je accéder aux fonctions de Vitalis ? ».
- **Réel** répond à « qui est présent tout près de moi maintenant ? ».
- **Scan** répond à une intention de recherche active ; il ne doit pas être confondu avec Réel.
- **Radar** répond à une logique d'exploration et de suivi autour de l'utilisateur.
- **Flash** diffuse des informations ou intentions.
- **2x2** ouvre les espaces et catégories secondaires.

Home ne calcule pas elle-même les règles métier de Réel, Flash, Scan ou Radar. Les moteurs conservent leurs contrats et responsabilités propres.

## 7. Contrôles attendus avant livraison runtime

- Première ouverture : onboarding avant Home explicative.
- Après onboarding : Home explicative accessible et compréhensible.
- Depuis le CTA de la Home explicative : ouverture du parcours d'identification existant.
- Après identification réussie : redirection vers Home interactive.
- Après identification incomplète, annulée ou échouée : ne pas afficher la Home interactive comme si l'identification avait réussi ; respecter les états du parcours existant.
- L'icône de l'application ramène à Home et affiche l'état adapté au parcours.
- Home interactive donne accès à Réel, Flash, Scan, Radar et aux catégories secondaires.
- Les routes Home et Réel sont distinctes ; aucun lien ne doit faire de Home un alias de Réel.
- Le 2x2 ouvre et ferme correctement le menu secondaire.
- L'état actif, les retours arrière et les changements de route sont cohérents.
- Les libellés FR/EN, le clavier, le lecteur d'écran, le focus, les tailles tactiles et les safe areas sont contrôlés.
- Aucun écran historique utile de `HomeFoundation` n'est supprimé sans inventaire et décision explicite.

## 8. Évolution V2/V3

La structure V2/V3 de la navigation est gouvernée par [Roadmap Réel V1–V3](../03-engines/reel/roadmap.md). Toute nouvelle entrée doit être arbitrée, affectée à une version et ajoutée aux index et tests correspondants avant son implémentation.
