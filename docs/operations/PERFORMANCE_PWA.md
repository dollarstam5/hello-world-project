# Performance PWA

## P0.10.1 — contrat de performance

Ce document définit les seuils de référence pour la PWA et les écrans mobiles. Il s'agit d'un contrat de mesure : un seuil ne devient un Go production qu'après mesure en préproduction sur les appareils représentatifs.

### Web Vitals

| Signal  |  Healthy |    Warning | Critical |
| ------- | -------: | ---------: | -------: |
| LCP p75 |  < 2.5 s |  2.5–4.0 s |  > 4.0 s |
| INP p75 | < 200 ms | 200–500 ms | > 500 ms |
| CLS p75 |   < 0.10 |  0.10–0.25 |   > 0.25 |

### Budgets de chargement

- JavaScript initial : **≤ 250 kB gzip**.
- CSS initial : **≤ 75 kB gzip**.
- Taille totale des ressources critiques initiales : **≤ 500 kB gzip**.
- Requête HTTP initiale document : **≤ 1.5 s** en préproduction de référence.
- Aucun écran P0/P1 mobile ne doit dépendre d'une requête réseau pour afficher sa structure de base hors connexion.

### Matrice mobile minimale

Les contrôles manuels et E2E devront couvrir au minimum :

| Profil             | Viewport de référence | Priorité |
| ------------------ | --------------------- | -------- |
| Petit téléphone    | 360×800               | P0       |
| Téléphone standard | 390×844               | P0       |
| Grand téléphone    | 412×915               | P1       |
| Tablette portrait  | 768×1024              | P1       |

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

Le dépôt fournit désormais un service worker enregistré côté navigateur, un manifeste PWA cohérent avec les icônes versionnées et une commande de validation dédiée. Le shell de navigation conserve les routes principales Home, Flash, Scan, Réel et Radar, ainsi que les zones Espace et Talents. Le service worker utilise le réseau en priorité pour les navigations et conserve un shell de secours ; les routes API et les Server Functions ne sont pas interceptées. Les données métier restent sous la responsabilité de Dexie et du moteur de synchronisation.

La validation d'installabilité réelle sur appareils représentatifs reste un contrôle E2E de sous-milestone ultérieur.

## P0.10.4 — mesure réelle des Web Vitals

Le navigateur collecte désormais les signaux réels **LCP, INP et CLS** via PerformanceObserver lorsqu'ils sont disponibles. Les mesures sont conservées en mémoire côté client, sans contenu de page, URL complète, identifiant utilisateur ou donnée d'authentification.

- **LCP** : dernière observation largest-contentful-paint.
- **INP** : maximum observé sur les événements avec interactionId.
- **CLS** : score de session selon les fenêtres de 1 seconde / 5 secondes.
- Chaque mesure conserve aussi le type de navigation.
- Les API non disponibles sont ignorées sans bloquer l'application.
- Le point d'intégration démarre automatiquement au niveau de la racine de l'application.
- La collecte fournit des observations réelles ; l'agrégation **p75** et le contrôle automatique des budgets restent les objectifs de P0.10.5.

## P0.10.5 — budgets de performance automatisés

Le build de production est contrôlé automatiquement après compilation. Le contrôle mesure en gzip les ressources JavaScript, CSS et critiques référencées par chaque document HTML initial, puis retient le maximum par indicateur sans additionner les routes entre elles. Si aucun HTML ne fournit d'entrée JavaScript exploitable, il utilise le manifeste Vite et suit les imports statiques de chaque entrée.

Les seuils sont ceux du contrat P0.10.1 :

- JavaScript initial : ≤ 250 kB gzip.
- CSS initial : ≤ 75 kB gzip.
- Ressources critiques initiales : ≤ 500 kB gzip.

Le script `check:performance-budget` échoue avec le détail du budget dépassé et est intégré à `check:release`, donc une régression de budget bloque automatiquement le contrôle Quality.

L'agrégation p75 des mesures LCP/INP/CLS reste distincte de ces budgets de fichiers et sera traitée avec les données de mesure réelles.

## P0.10.6 — validation mobile/E2E

La validation navigateur automatisée couvre les cinq routes principales `/`, `/flash`, `/scan`, `/reel` et `/radar`, sur les quatre viewports de référence : **360×800**, **390×844**, **412×915** et **768×1024**.

Le script `test:e2e` reconstruit l'application, vérifie la présence des artefacts Nitro de production, puis démarre le runtime de production avec `nitro preview`. Chromium/Playwright attend un sélecteur propre à chaque route et enregistre une capture pour chaque couple route/viewport. Les captures sont conservées comme artefact CI pendant sept jours.

Cette validation est un smoke E2E mobile : elle détecte les erreurs de build, de démarrage, de routage et de rendu initial aux dimensions ciblées. Elle ne certifie pas à elle seule l'absence de débordement horizontal, la qualité visuelle, les zones tactiles ou l'usage offline/online réel sur appareils représentatifs ; ces contrôles restent nécessaires.

Le démarrage différé du moteur de synchronisation reste découpé dans un chunk séparé. Si le navigateur est hors ligne au premier affichage, le chargement attend le retour du réseau ; si un chargement échoue, il est retenté au retour en ligne ou lorsque l'application redevient visible. Le test associé vérifie le cas hors ligne puis reconnexion, mais ne remplace pas un test PWA complet sur appareil.

L'authentification n'est pas modifiée par P0.10.6.
