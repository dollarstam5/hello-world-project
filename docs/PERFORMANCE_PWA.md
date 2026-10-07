# Performance PWA

## P0.10.1 — contrat de performance

Ce document définit les seuils de référence pour la PWA et les écrans mobiles. Il s'agit d'un contrat de mesure : un seuil ne devient un Go production qu'après mesure en préproduction sur les appareils représentatifs.

### Web Vitals

| Signal | Healthy | Warning | Critical |
| --- | ---: | ---: | ---: |
| LCP p75 | < 2.5 s | 2.5–4.0 s | > 4.0 s |
| INP p75 | < 200 ms | 200–500 ms | > 500 ms |
| CLS p75 | < 0.10 | 0.10–0.25 | > 0.25 |

### Budgets de chargement

- JavaScript initial : **≤ 250 kB gzip**.
- CSS initial : **≤ 75 kB gzip**.
- Taille totale des ressources critiques initiales : **≤ 500 kB gzip**.
- Requête HTTP initiale document : **≤ 1.5 s** en préproduction de référence.
- Aucun écran P0/P1 mobile ne doit dépendre d'une requête réseau pour afficher sa structure de base hors connexion.

### Matrice mobile minimale

Les contrôles manuels et E2E devront couvrir au minimum :

| Profil | Viewport de référence | Priorité |
| --- | --- | --- |
| Petit téléphone | 360×800 | P0 |
| Téléphone standard | 390×844 | P0 |
| Grand téléphone | 412×915 | P1 |
| Tablette portrait | 768×1024 | P1 |

Les tests doivent vérifier : navigation principale, débordement horizontal, lisibilité, zones tactiles, état offline et retour online.

### Règles de décision

- **Healthy** : tous les indicateurs respectent leur budget.
- **Warning** : au moins un indicateur dépasse son budget Healthy sans atteindre Critical.
- **Critical** : un indicateur atteint Critical ou un budget de chargement critique est dépassé.
- Une mesure isolée ne suffit pas à déclarer un Go : utiliser le p75 et une fenêtre de mesure documentée.
- Toute régression Critical bloque le passage production jusqu'à analyse ou exception explicitement documentée.

### Périmètre

P0.10.1 formalise uniquement les contrats et seuils. La collecte Web Vitals, les budgets automatisés, la PWA installable et les parcours E2E seront traités dans les sous-milestones suivants.

L'authentification n'est pas modifiée par P0.10.1.


## P0.10.3 — socle PWA/installabilité

Le dépôt fournit désormais un service worker enregistré côté navigateur, un manifeste PWA cohérent avec les icônes versionnées et une commande de validation dédiée. Le service worker utilise le réseau en priorité pour les navigations et conserve un shell de secours ; les routes API et les Server Functions ne sont pas interceptées. Les données métier restent sous la responsabilité de Dexie et du moteur de synchronisation.

La validation d'installabilité réelle sur appareils représentatifs reste un contrôle E2E de sous-milestone ultérieur.
