# Lot 1 — graphe d'import vérifié (première tranche)

Branche : `chore/architecture-folder-cleanup-2026-11`  
Base auditée : `001921b203b2423c3756926fedaa3158625d6267`

## Portée de cette livraison

Cette première tranche consigne les fichiers dont le contenu a été relu directement dans la branche. Elle ne prétend pas être le graphe AST complet de tout `src/` : les importeurs entrants de l'ensemble du dépôt, les imports calculés, les exports indirects et les tests associés à chaque façade restent à établir. Aucun fichier applicatif n'est déplacé dans cette étape.

## Graphe vérifié

| Fichier | Dépendances sortantes vérifiées | Rôle / frontière |
|---|---|---|
| `src/routes/__root.tsx` | `@tanstack/react-router`, `@tanstack/react-query`, `../styles.css?url`, `@/app/composition`, `@/lib/i18n/useI18n`, `@/app/bootstrap` | Racine TanStack, shell SSR, point de montage de l'application. |
| `src/app/composition/index.ts` | `./RootAppComposition` | Façade publique de composition. |
| `src/app/composition/RootAppComposition.tsx` | `react`, `@tanstack/react-query`, `@/modules/access-mode`, `@/app/shell/AppShell` | Composition providers + shell. Client React. |
| `src/app/bootstrap/index.ts` | `@/lib/experience/orchestrator`, `./useRootLifecycle` | Façade lifecycle/bootstrap. |
| `src/app/bootstrap/useRootLifecycle.ts` | `react`, `@tanstack/react-router`, `@/platform/pwa`, `@/lib/performance/web-vitals`, `@/lib/performance/interaction-navigation` | Hook client : service worker, Web Vitals, mesure navigation. |
| `src/app/shell/index.ts` | `./AppShell` | Façade publique du shell. |
| `src/app/shell/AppShell.tsx` | `react`, `@tanstack/react-router`, `@/components/app/BottomNav`, plusieurs composants `@/components/experience/*`, `@/lib/*`, `@/modules/reel/*`, `@/domains/auth/model/useAuth`, `@/domains/access-mode` ; imports dynamiques de ReelBottomNav, MenuSheet, CommunicationSheet, OnboardingSheet | Shell client et point d'assemblage transverse. |
| `src/app/index.ts` | `./app-shell`, `./providers`, `./router`, `./bootstrap`, `./guards`, `./shell`, `./composition` | Façade agrégatrice de l'application. |
| `src/layouts/AdaptiveLayout.tsx` | `@/lib/platform/useResponsive`, `./mobile`, `./tablet`, `./desktop`, `react` | Sélection de layout selon le terminal. Client. |
| `src/layouts/index.ts` | `./mobile`, `./tablet`, `./desktop`, `./ecosystem`, `./modal`, `./AdaptiveLayout` | Façade des layouts. |
| `src/layouts/mobile/index.ts` | `@/components/app/AppShell` | Façade mobile qui réexporte AppShell comme MobileLayout. |
| `src/widgets/index.ts` | `./smart-feed`, `./ai-layer`, `./offline-banner`, `./smart-state`, `./section-foundation`, `./activity-strip` | Façade agrégatrice des widgets. |
| `src/server.ts` | `./lib/error-page`, `./lib/safe-log.server`, `./lib/security-headers.server`, `./lib/request-context.server`, import dynamique `@tanstack/react-start/server-entry` | Entrée serveur explicite ; ne doit pas être aspirée dans le graphe client. |
| `src/start.ts` | `@tanstack/react-start`, `@tanstack/react-start/server`, `./lib/error-page`, `@/integrations/supabase/auth-attacher`, `./lib/safe-log.server`, `./lib/request-context.server` | Bootstrap TanStack Start avec middleware serveur. |

## Alias et résolution

- `@/*` résout vers `./src/*` dans `tsconfig.json`.
- `@eco/core-contracts`, `@eco/core-logic`, `@eco/core-db`, `@eco/core-sync` résolvent vers les points d'entrée `packages/*/src/index.ts`.
- Vite redéfinit explicitement les quatre alias `@eco/*` pour les bundles worker.
- Vitest redéfinit `@` et les quatre alias `@eco/*` dans `tests/vitest.config.ts`.
- La configuration Vite délègue TanStack Start et le routage de l'entrée serveur à `src/server.ts`.

## Constats d'architecture à traiter dans les lots suivants

1. **Migration partielle de l'authentification et du mode d'accès :** `RootAppComposition.tsx` importe `@/modules/access-mode`, alors que `AppShell.tsx` conserve `@/domains/access-mode` et `@/domains/auth/model/useAuth`. Il faut vérifier les consommateurs, les contrats et les tests avant de retirer ces façades historiques.
2. **Façade de layout encore adossée à l'ancien emplacement :** `src/layouts/mobile/index.ts` réexporte `@/components/app/AppShell`. L'historique de migration de `components/app` doit être vérifié avant toute consolidation.
3. **Responsabilités transverses dans AppShell :** navigation, communication, auth, préférences assistant, onboarding, PWA/offline et projections Reel y convergent. Une extraction éventuelle doit être guidée par les importeurs et tests, pas par un simple déplacement de fichier.
4. **Frontière serveur :** `src/server.ts` et `src/start.ts` importent des modules `.server` et du middleware serveur. Ils restent séparés des modules React client.

## Couverture et limites

- Les alias TypeScript, Vite et Vitest ont été lus directement.
- Les dépendances listées sont les imports statiques et dynamiques visibles dans les fichiers consultés.
- Les entrées serveur `src/server.ts` et `src/start.ts` ont été consultées directement.
- Cette tranche ne certifie pas l'exhaustivité des importeurs entrants, des imports calculés, des dépendances indirectes, des cycles, ni l'association exhaustive des tests.
- Aucun lint, typecheck, test ou build n'a été exécuté depuis cette session.
- Aucun déplacement ni changement de code applicatif n'est inclus.

## Prochaine opération technique

Compléter le graphe AST sur l'ensemble du périmètre Lot 1 (routes, app, layouts, widgets et leurs importeurs), en incluant les réexports, imports dynamiques, alias, tests et classification client/serveur. La migration des composants et façades ne commence qu'après validation de cette couverture.


## Complément fichier par fichier — routes, layouts, widgets et tests consultés

Cette section ajoute les fichiers consultés directement dans la branche au commit précédent. Les exports des façades sont des réexports explicites (les regex de déclaration `export const/function` ne les représentent donc pas comme déclarations locales).

### Application et layouts

| Fichier | Dépendances directes | Exports / constat |
|---|---|---|
| `src/app/app-shell/index.ts` | `@/components/app/AppShell`, `@/components/app/BottomNav`, `@/components/app/MenuSheet` | Réexporte les trois surfaces AppShell, BottomNav et MenuSheet. |
| `src/app/providers/index.ts` | `@/lib/app/theme` | Réexporte `initTheme`, `useThemeStore`, `ThemeMode`. |
| `src/app/router/index.ts` | `@/router` | Réexporte `getRouter`; les routes concrètes sont dans `src/routes/`. |
| `src/app/guards/index.ts` | `@/lib/app/featureFlags` | Réexporte `isEnabled`, `features`, `FeatureKey`; commentaire de placeholder de guards. |
| `src/layouts/desktop/index.ts` | `@/components/app/AppShell` | Réexporte AppShell comme DesktopLayout (placeholder). |
| `src/layouts/tablet/index.ts` | `@/components/app/AppShell` | Réexporte AppShell comme TabletLayout (placeholder). |
| `src/layouts/ecosystem/index.ts` | `@/components/app/AppShell` | Réexporte AppShell comme EcosystemLayout (placeholder). |
| `src/layouts/modal/index.ts` | `@/components/app/Sheet`, `@/components/app/Modal` | Réexporte Sheet et Modal. |
| `src/layouts/mobile/index.ts` | `@/components/app/AppShell` | Réexporte AppShell comme MobileLayout (placeholder). |

Les quatre variantes mobile/tablet/desktop/ecosystem convergent donc actuellement vers le même composant historique `components/app/AppShell`. `AdaptiveLayout` choisit une façade selon `useResponsive`, mais ne sélectionne pas encore des compositions distinctes.

### Widgets

| Fichier | Dépendance directe | Export / constat |
|---|---|---|
| `src/widgets/ai-layer/index.ts` | `@/components/experience/CommunicationSheet` | Réexporte CommunicationSheet. |
| `src/widgets/offline-banner/index.ts` | `@/components/experience/OfflineBanner` | Réexporte OfflineBanner. |
| `src/widgets/section-foundation/index.ts` | `@/components/experience/SectionFoundation` | Réexporte SectionFoundation. |
| `src/widgets/smart-feed/index.ts` | `@/components/experience/HomeFoundation` | Réexporte HomeFoundation sous le nom SmartFeed. |
| `src/widgets/smart-state/index.ts` | `@/components/experience/SmartStateView` | Réexporte SmartStateView. |
| `src/widgets/activity-strip/index.ts` | aucune | Placeholder, export vide. |

Ces widgets sont des façades vers `components/experience`, pas encore des implémentations autonomes dans `widgets`.

### Routes et composants montés

| Fichier | Dépendances directes | Rôle / runtime |
|---|---|---|
| `src/routes/index.tsx` | `@tanstack/react-router` | Déclare la route `/` et ses métadonnées. |
| `src/routes/index.lazy.tsx` | `@tanstack/react-router`, `@/components/experience/HomeFoundation` | Monte HomeFoundation pour `/`. |
| `src/routes/auth.tsx` | `@tanstack/react-router`, `@/modules/auth/ui/SignInView` | Route d'authentification. |
| `src/routes/flash.tsx` | `@tanstack/react-router` | Déclare la route `/flash` et ses métadonnées. |
| `src/routes/flash.lazy.tsx` | `@tanstack/react-router`, `@/modules/flash/ui/FlashExperienceScreen` | Monte FlashExperienceScreen. |
| `src/routes/radar.tsx` | `@tanstack/react-router` | Déclare la route `/radar` et ses métadonnées. |
| `src/routes/radar.lazy.tsx` | `@tanstack/react-router`, `lucide-react`, `@/components/experience/EnginePreviewCard`, `@/components/experience/SectionFoundation`, `@/modules/radar/ui/RadarManagement` | Composition de la page Radar ; monte RadarManagement et EnginePreviewCard dans SectionFoundation. |
| `src/routes/reel.tsx` | `@tanstack/react-router` | Déclare la route `/reel` et ses métadonnées. |
| `src/routes/reel.lazy.tsx` | `@tanstack/react-router`, `@/modules/reel/ui/ReelProximityScreen`, `@/lib/i18n/useI18n` | Monte ReelProximityScreen dans `ClientOnly` avec fallback localisé ; frontière client explicite. |
| `src/routes/scan.tsx` | `@tanstack/react-router` | Déclare la route `/scan` et ses métadonnées. |
| `src/routes/scan.lazy.tsx` | `@tanstack/react-router`, `@/modules/scan/ui/ScanPanel` | Monte ScanPanel. |
| `src/routes/vision.tsx` | `@tanstack/react-router` | Déclare la route `/vision` et ses métadonnées. |
| `src/routes/vision.lazy.tsx` | `@tanstack/react-router`, `@/components/experience/VitalisVisionPage` | Monte VitalisVisionPage depuis l'ancien répertoire experience. |

Les fichiers `*.tsx` de déclaration et `*.lazy.tsx` sont des paires de routes TanStack : les premiers portent les métadonnées et les seconds chargent les composants d'écran. Les routes lazy examinées n'utilisent pas d'import dynamique JavaScript explicite : le chargement différé est assuré par la convention TanStack `createLazyFileRoute`.

### Tests explicitement reliés par leurs imports

Les fichiers suivants ont été lus directement ; le lien de test est limité à la dépendance effectivement importée (il ne signifie pas que le composant testé n'a pas d'autres tests indirects).

| Test | Cible importée |
|---|---|
| `tests/components/app-header.test.tsx` | `@/components/experience/AppHeader` |
| `tests/components/bottom-nav.test.tsx` | `@/components/app/BottomNav` |
| `tests/components/communication-sheet.test.tsx` | `@/components/experience/CommunicationSheet` |
| `tests/components/engine-preview-card.test.tsx` | `@/components/experience/EnginePreviewCard` |
| `tests/sync-engine-loader.test.tsx` | `@/components/app/SyncEngineLoader` |
| `tests/onboarding.test.ts` | `@/lib/experience/onboarding` |
| `tests/pwa.test.ts` | `@/platform/pwa`, `@/platform/pwa/install` |
| `tests/interaction-navigation.test.ts` | `@/lib/performance/interaction-navigation` |

L'inventaire du dépôt contient également des tests de contrats d'accès Reel, de projection d'activité, de runtime communication, de navigation mobile et de fondation. Leur rattachement précis aux fichiers du Lot 1 doit être établi par résolution AST, pas déduit de leur nom.

## Résolution fichier et niveau de preuve

- Les dépendances du tableau sont issues des imports et réexports littéraux visibles dans les contenus de fichiers consultés.
- Les alias `@` sont résolus par `tsconfig.json`, Vite et Vitest selon la configuration documentée plus haut.
- Les chemins relatifs ont été conservés tels qu'écrits lorsqu'aucune résolution TypeScript effective n'a été exécutée.
- Les lignes d'export listent les cibles de réexport ; elles ne prétendent pas être un inventaire des symboles exportés de chaque module cible.
- La liste des tests ci-dessus est une correspondance confirmée par import direct, non une preuve exhaustive de couverture.
- L'import entrant complet (reverse graph), les cycles, les imports non littéraux, les modules de déclaration générés par TanStack, et la classification client/serveur par graphe transitif restent à calculer par le compilateur TypeScript.


## Complément vérifié — façade AppShell et dépendances directes (relecture au HEAD 6c5546d)

Cette passe a relu directement les implémentations canoniques et les façades de l'application, du shell, des layouts et widgets. Elle affine le sens des arêtes sans déplacer de code.

| Fichier | Imports / réexports directs vérifiés | Exports / runtime / destination candidate |
|---|---|---|
| `src/components/app/AppShell.tsx` | `@/app/shell/AppShell` | Shim de compatibilité uniquement ; réexporte AppShell. Cible canonique : `src/app/shell/`. |
| `src/app/shell/AppShell.tsx` | `react`, `@tanstack/react-router`, `@/components/app/BottomNav`, `@/lib/experience/orchestrator`, `@/components/experience/OfflineBanner`, `AppHeader`, `InstallBanner`, `UpdateBanner`, `@/lib/platform/useResponsive`, `@/lib/app/assistant-preferences`, `AssistantNoticeLayer`, `@/lib/experience/onboarding`, `@/components/app/SyncEngineLoader`, `@/lib/communication/CommunicationRuntimeProvider`, `@/domains/auth/model/useAuth`, `@/lib/i18n/useI18n`, `@/modules/reel/model/reel-activity-projection`, `ReelCommunicationBridge`, `@/domains/access-mode`; imports dynamiques de ReelBottomNav, MenuSheet, CommunicationSheet et OnboardingSheet | Composant React client (hooks, document, événements UI). Candidat : rester dans `app/shell`, mais extraire les responsabilités après graphe entrant/tests. |
| `src/app/composition/RootAppComposition.tsx` | `react`, `@tanstack/react-query`, `@/modules/access-mode`, `@/app/shell/AppShell` | Exporte RootAppComposition ; composition React côté client. |
| `src/components/app/BottomNav.tsx` | `@tanstack/react-router`, `lucide-react`, `@/lib/i18n/useI18n`, `@/lib/utils`, `@/platform/device/haptics`, `./reel-bottom-nav.css` | Exporte BottomNav ; UI client et interaction tactile. Candidate : `shared/ui` seulement après vérification que les destinations métier restent injectées et que le composant est réellement générique. |
| `src/components/app/index.ts` | Réexports relatifs de Icon, Surface, SmartCard, FlashCard, RadarCard, WalletCard, TrustCard, AIBubble, FloatingButton, SmartTabs, Sheet, Modal, Indicator, EmptyState, StatusBanner, FormField, Skeletons, PublicProfilePreview | Barrel mixant primitives visuelles génériques et cartes nommées par domaine ; ne pas déplacer en bloc vers shared sans audit de chaque réexport. |
| `src/layouts/AdaptiveLayout.tsx` | `@/lib/platform/useResponsive`, `./mobile`, `./tablet`, `./desktop`, `react` | Exporte AdaptiveLayout ; sélection responsive côté client. |
| `src/layouts/mobile/index.ts`, `desktop/index.ts` | `@/components/app/AppShell` | Réexportent AppShell via le shim de compatibilité ; les layouts ne constituent pas encore des shells indépendants. |
| `src/widgets/ai-layer/index.ts` | `@/components/experience/CommunicationSheet` | Réexporte CommunicationSheet ; façade vers experience. |
| `src/widgets/offline-banner/index.ts` | `@/components/experience/OfflineBanner` | Réexporte OfflineBanner ; façade vers experience. |
| `src/widgets/index.ts` | Barrels locaux smart-feed, ai-layer, offline-banner, smart-state, section-foundation, activity-strip | Exporte des namespaces de widgets ; les implémentations restent principalement dans components/experience. |

### Arêtes entrantes / dépendances à ne pas masquer

- `src/layouts/mobile/index.ts` et `src/layouts/desktop/index.ts` consomment `src/components/app/AppShell.tsx`, qui n'est plus une implémentation : c'est un shim vers `src/app/shell/AppShell.tsx`.
- Le shell canonique importe encore `@/domains/auth/model/useAuth` et `@/domains/access-mode`, tandis que RootAppComposition consomme `@/modules/access-mode`. La migration de l'accès est donc incomplète au niveau du shell même si la composition racine a basculé vers modules.
- Le shell utilise également des modules `components/experience` et `lib/*` nombreux. La présente passe ne constitue pas encore le reverse graph complet de ces répertoires : leurs autres importeurs doivent être vérifiés avant de proposer un déplacement.
- `BottomNav` n'est pas une primitive neutre dans son état actuel : destinations Flash/Scan/Reel/Radar, libellés de navigation et haptics y sont codés en dur. Le ranger dans `shared/ui` sans découplage créerait une dépendance métier dans shared.
- Le barrel `components/app/index.ts` contient des cartes Flash/Radar/Wallet/Trust et PublicProfilePreview ; son commentaire « generic, reusable primitives » ne suffit pas à prouver que chaque export est transversal.

### Portée runtime affinée

- `src/app/shell/AppShell.tsx`, `src/app/composition/RootAppComposition.tsx`, `src/components/app/BottomNav.tsx` et `src/layouts/AdaptiveLayout.tsx` sont des composants/hooks React côté client.
- `src/server.ts`, `src/start.ts` et les routes `src/routes/api/**` appartiennent à la frontière serveur/API ; ils ne doivent pas être fusionnés au graphe du bundle client.
- Le chargement différé de quatre composants dans AppShell utilise `React.lazy(() => import(...))`, distinct du mécanisme `createLazyFileRoute` des fichiers de routes.

### Limites de cette passe

Les fichiers listés ont été lus directement dans la branche au HEAD indiqué. Les arêtes entrantes ne sont ajoutées que lorsqu'un importeur a été vérifié. L'index complet des blobs ne donne pas, à lui seul, le contenu des imports de tous les fichiers : l'AST global, les cycles et la résolution exhaustive des tests ne sont toujours pas certifiés. Aucun test, lint, typecheck ou build n'a été exécuté.


## Complément vérifié — importeurs directs du shell et des façades experience (HEAD `e6445fef2e681235bf4e7f20709dadd6c69f250d`)

### Importeurs entrants vérifiés

| Importeur | Cible importée | Nature du lien |
|---|---|---|
| `src/routes/__root.tsx` | `@/app/composition` (RootAppComposition) et `@/app/bootstrap` (useRootLifecycle) | Entrée racine de l'application ; monte la composition et le hook de cycle de vie. |
| `src/app/composition/RootAppComposition.tsx` | `@/app/shell/AppShell` | Monte le shell canonique directement. |
| `src/layouts/mobile/index.ts` | `@/components/app/AppShell` | Réexport via shim de compatibilité vers le shell canonique. |
| `src/layouts/tablet/index.ts` | `@/components/app/AppShell` | Même shim, façade placeholder. |
| `src/layouts/desktop/index.ts` | `@/components/app/AppShell` | Même shim, façade placeholder. |
| `src/layouts/ecosystem/index.ts` | `@/components/app/AppShell` | Même shim, façade placeholder. |
| `src/app/app-shell/index.ts` | `@/components/app/AppShell`, `BottomNav`, `MenuSheet` | Façade historique qui agrège shell et éléments de navigation/menu. |
| `src/routes/index.lazy.tsx` | `@/components/experience/HomeFoundation` | Route d'accueil. |
| `src/routes/radar.lazy.tsx` | `@/components/experience/EnginePreviewCard`, `SectionFoundation` | Composition de la page Radar. |
| `src/routes/vision.lazy.tsx` | `@/components/experience/VitalisVisionPage` | Page Vision. |
| `src/routes/espace.tsx` | `@/components/experience/PersonalDashboard` | Route Espace. |
| `src/routes/talents.tsx` | `@/components/experience/EnginePreviewCard`, `SectionFoundation` | Composition de la page Talents. |
| `src/app/shell/AppShell.tsx` | `@/components/app/BottomNav` et composants experience OfflineBanner, AppHeader, InstallBanner, UpdateBanner, AssistantNoticeLayer, CommunicationSheet, OnboardingSheet | Assemblage central ; quatre imports React.lazy sont des imports dynamiques réels. |

Cette liste contient uniquement les importeurs dont le contenu a été relu dans cette passe. Elle ne prouve pas encore l'absence d'autres importeurs dans les 436 fichiers source du dépôt.

### Graphe fonctionnel confirmé

```text
routes/__root
  ├── app/bootstrap (useRootLifecycle)
  └── app/composition (RootAppComposition)
        └── app/shell/AppShell
              ├── components/app/BottomNav
              ├── components/experience/{AppHeader, OfflineBanner, InstallBanner,
              │   UpdateBanner, AssistantNoticeLayer}
              ├── React.lazy -> components/app/MenuSheet
              ├── React.lazy -> components/experience/{CommunicationSheet, OnboardingSheet}
              ├── modules/reel/{ReelCommunicationBridge, activity projection, ReelBottomNav}
              └── lib/{communication, experience, app, platform, i18n}
```

Les routes secondaires montent séparément les façades ou composants experience ; elles ne passent pas toutes par un widget intermédiaire. Les répertoires `widgets/*` restent des façades minces et ne sont pas, à ce stade, les points d'entrée effectifs de toutes les pages.

### Tests associés — liens directs confirmés

| Test | Import direct observé | Portée réelle |
|---|---|---|
| `tests/components/bottom-nav.test.tsx` | `@/components/app/BottomNav` | Contrats d'ordre, d'accessibilité, d'état actif et de dimensions des contrôles. |
| `tests/components/app-header.test.tsx` | `@/components/experience/AppHeader` | Contrat du header, compte de notifications et dimensions/focus des contrôles. |
| `tests/components/communication-sheet.test.tsx` | `@/components/experience/CommunicationSheet` | Onglets, événements, état hors ligne et compteurs. |
| `tests/components/engine-preview-card.test.tsx` | `@/components/experience/EnginePreviewCard` | Présentation d'un exemple explicitement identifié. |
| `tests/sync-engine-loader.test.tsx` | `@/components/app/SyncEngineLoader` ; mock de `SyncEngineBootstrap` | Chargement différé du moteur de synchronisation. |
| `tests/onboarding.test.ts` | `@/lib/experience/onboarding` | État et transitions du store d'onboarding, pas rendu de OnboardingSheet. |
| `tests/home-journey-copy.test.ts` | `@/lib/i18n/messages`, `vision-messages` | Vérifie le contenu de traduction ; ne teste pas directement HomeFoundation. |
| `tests/foundation.smoke.test.ts` | mapping assistant et assistant-policy | Aucun import direct des façades shell/experience dans ce test. |

### Constats de dépendances et ownership

1. **Le shell est un véritable point de composition, pas une simple coquille visuelle.** Il possède des états UI (menu, communication), observe le routeur, coordonne l'identité et le mode d'accès, hydrate les préférences assistant, déclenche l'orchestration, et monte plusieurs surfaces transverses. Une extraction devra préserver l'ordre et le cycle de vie de ces services.
2. **La dépendance auth est incohérente à l'intérieur du shell.** `AppHeader` et `HomeFoundation` utilisent `@/modules/auth/model/useAuth`, tandis que `AppShell` conserve `@/domains/auth/model/useAuth`. C'est une dépendance historique restante à traiter dans un lot auth dédié ; ne pas modifier ce chemin dans ce lot de graphe.
3. **Le composant BottomNav est lié à la navigation produit.** Ses destinations, clés i18n et interactions haptics sont codées dans le composant. Ownership provisoire : `app/navigation` ou `composition/navigation`, pas `shared/ui` sans extraction de la présentation et injection des items.
4. **HomeFoundation n'est pas une simple façade visuelle générique.** Elle assemble identité/auth, messages, exemples Flash, navigation vers les modules, profil public et carte Vision. Candidate plus cohérente : `composition/experiences/home` ou un module d'expérience dédié ; à arbitrer après inventaire des importeurs et dépendances.
5. **SectionFoundation est plus proche d'une primitive de composition.** Elle dépend toutefois des tokens i18n globaux et des primitives app. Elle pourrait relever de `composition/layouts` ou `shared/ui` après découplage des clés métier.
6. **Les composants experience portent des responsabilités différentes.** OfflineBanner/InstallBanner/UpdateBanner sont des surfaces d'infrastructure PWA/réseau ; AppHeader est de la composition de navigation/identité ; CommunicationSheet est une expérience multi-modules ; OnboardingSheet est un parcours applicatif. Leur ancien dossier commun ne constitue pas une raison de les déplacer ensemble.

### État de preuve et limites inchangées

Les fichiers listés dans ce complément ont été récupérés sur la branche de travail et leurs imports directs relus. Le tree Git contient 436 fichiers TypeScript/TSX/JavaScript/JSX sous `src/`, mais leur contenu n'a pas tous été analysé dans cette passe. Les recherches de code du connecteur GitHub sont indexées sur la branche par défaut et ne sont donc pas utilisées pour certifier les importeurs de cette branche de travail. L'inventaire inverse complet, la résolution AST effective, les cycles et la matrice complète tests/fichiers restent à produire. Aucun déplacement applicatif ni exécution de test/build n'a été réalisé.


## Complément vérifié — routes Espace et dépendances des composants experience (HEAD `eb35d5751698bf2e215229aca75e056421713df3`)

Cette passe a poursuivi l'inventaire au-delà du shell et des routes principales. Les fichiers ci-dessous ont été récupérés depuis la branche de travail et leurs imports directs ont été relus.

### Nouveaux importeurs entrants confirmés

| Importeur | Cible | Type de lien |
|---|---|---|
| `src/routes/espace.apercu.tsx` | `@/components/experience/PublicProfilePreviewPage` | Route fichier `/espace/apercu`, montage direct. |
| `src/routes/espace.informations.tsx` | `@/components/experience/AccountInformationPage` | Route fichier `/espace/informations`, montage direct. |
| `src/routes/espace.parametres.application.tsx` | `@/components/experience/ApplicationSettingsPage` | Route fichier `/espace/parametres/application`, montage direct. |
| `src/routes/espace.parametres.profil.tsx` | `@/components/experience/ProfileVisibilitySettingsPage` | Route fichier `/espace/parametres/profil`, montage direct. |
| `src/routes/espace.profil.tsx` | `@/components/experience/ProfileManagementPage` | Route fichier `/espace/profil`, montage direct. |
| `src/routes/espace.tsx` | `@/components/experience/PersonalDashboard` | Route fichier `/espace`, montage direct. |
| `src/routes/vision.lazy.tsx` | `@/components/experience/VitalisVisionPage` | Route lazy TanStack `/vision`. |
| `src/routes/index.lazy.tsx` | `@/components/experience/HomeFoundation` | Route lazy TanStack `/`. |
| `src/routes/radar.lazy.tsx` | `@/components/experience/EnginePreviewCard`, `SectionFoundation`, `@/modules/radar/ui/RadarManagement` | Composition de la page Radar. |

Les six routes Espace montent les composants de page directement. Elles ne passent pas par un barrel `components/experience` ni par les façades `widgets/*`. Les routes lazy Vision, accueil et Radar utilisent `createLazyFileRoute`, et non des appels `import()` écrits dans ces fichiers.

### Dépendances sortantes directes des composants experience relus

| Fichier | Dépendances directes observées | Conséquence de résolution / ownership |
|---|---|---|
| `AccountInformationPage.tsx` | React hooks, TanStack Router, lucide, `components/app/Surface`, `components/ui/button`, client Supabase, `lib/i18n/useI18n` | Page applicative authentifiée avec accès direct au client Supabase ; pas une primitive shared. |
| `ApplicationSettingsPage.tsx` | TanStack Router, lucide, Surface/Button, types et hook i18n, store thème, préférences assistant, notifications assistant | Page de réglages qui orchestre plusieurs services app ; candidate composition/app settings. |
| `AssistantNoticeLayer.tsx` | React hooks, Button, préférences et notices assistant, i18n, `CommunicationRuntimeProvider` | Surface client dépendante du runtime communication et de l'état assistant ; candidate app/composition ou platform UI selon séparation à venir. |
| `EngineManagementGrid.tsx` | Indicator, Surface, i18n et `MessageKey` | Présentation générique de liste d'éléments, mais les clés i18n globales restent un couplage à examiner. |
| `PersonalDashboard.tsx` | TanStack Router, icônes, Indicator/Surface, store identité, `modules/auth/model/useAuth`, i18n | Expérience Espace liée à l'auth, au profil et aux routes produit ; candidate composition/experiences/space. |
| `ProfileFieldRow.tsx` | lucide, Button/Input, type `MessageKey` | Sous-composant de formulaire de profil, actuellement utilisé par ProfileManagementPage ; ne pas classer shared sans autre consommateur et sans découplage i18n. |
| `ProfileManagementPage.tsx` | React hooks, TanStack Router, Supabase client, Surface, AlertDialog/Button, ProfileFieldRow local, store identité, i18n | Page métier profil avec lectures/écritures directes de `profiles` via Supabase. Frontière client à préserver. |
| `ProfileQuickPreview.tsx` | React hooks, TanStack Router, Avatar, Sheet, Button, store identité, i18n, import dynamique du client Supabase | Surface client d'aperçu profil ; le chargement Supabase est différé dans un effet. |
| `ProfileVisibilitySettingsPage.tsx` | TanStack Router, lucide, Indicator/Surface/Button, i18n | Page de réglage du profil, état « bientôt » ; composition applicative plutôt que shared. |
| `PublicProfilePreviewPage.tsx` | TanStack Router, lucide, Indicator/Surface/Button, i18n | Page de route de prévisualisation, actuellement placeholder fonctionnel. |
| `SmartStateView.tsx` | ReactNode, SkeletonList, EmptyState, StatusBanner, i18n | Seul candidat évident à une primitive de composition transversale, mais reste couplé aux primitives app et au dictionnaire i18n. |
| `VisionEngineArtwork.tsx` | quatre assets d'images d'expérience | Présentation liée au récit Vision et aux ressources visuelles dédiées. |
| `VitalisVisionCard.tsx` | TanStack Router, lucide, i18n | Carte de navigation produit vers /vision. |
| `VitalisVisionPage.tsx` | TanStack Router, lucide, `useVisionI18n`, `VisionEngineArtwork` | Page d'expérience autonome, mais ancrée au parcours Vision et aux routes Flash/Scan/Reel/Radar. |
| `PublicProfilePreviewPage.tsx` et pages Espace | Composants app/UI | Dépendances visuelles partagées, mais ownership métier conservé au niveau expérience Espace. |

### Barrels et façades réexaminés

- `src/components/experience/index.ts` ne réexporte que HomeFoundation, AppHeader, CommunicationSheet, OnboardingSheet, OfflineBanner et SmartStateView. Il n'expose pas toutes les pages de compte/profil/Vision listées ci-dessus.
- `src/components/app/index.ts` réexporte un ensemble hétérogène : primitives visuelles, cartes nommées Flash/Radar/Wallet/Trust, et PublicProfilePreview. Le commentaire « domain-agnostic » n'est pas suffisant pour démontrer cette propriété pour tous les exports.
- `src/layouts/index.ts` agrège mobile/tablet/desktop/ecosystem/modal et AdaptiveLayout ; `layouts/modal/index.ts` réexporte Sheet et Modal depuis `components/app`.
- `src/widgets/index.ts` agrège six sous-façades. `widgets/activity-strip/index.ts` reste vide ; ai-layer, offline-banner, section-foundation, smart-feed et smart-state sont des réexports de composants experience.
- `src/app/index.ts` agrège les façades app-shell, providers, router, bootstrap, guards, shell et composition ; cette agrégation n'est pas en soi une preuve que chaque sous-module est importé par l'entrée client.

### Résolution de dépendances — résultats et limites

- Les importeurs entrants directs des six pages Espace sont désormais établis par lecture des six fichiers route correspondants.
- Les dépendances sortantes ci-dessus sont des imports directs observés, pas des dépendances transitives entièrement résolues. Les alias `@/` suivent le mapping `@/* -> ./src/*` déjà vérifié ; les imports relatifs et packages externes restent écrits tels quels.
- Les pages AccountInformationPage et ProfileManagementPage accèdent directement au client Supabase dans le navigateur. Ce couplage est un signal architectural important : toute extraction doit conserver le contexte client et ne pas les déplacer dans une zone server-only.
- ProfileQuickPreview charge le client Supabase par import dynamique à l'intérieur d'un effet ; cette arête doit rester distinguée des imports statiques.
- Les pages Espace/Vision sont des composants client (hooks React, événements, composants UI). La frontière serveur des API `src/routes/api/**`, `src/server.ts` et `src/start.ts` demeure distincte.
- Le contenu de tous les 436 fichiers source n'a pas encore été parcouru ; aucun résultat d'absence d'importeur n'est donc affirmé. Les imports calculés, cycles, exports transitifs, résolution par TypeScript et matrice complète de tests restent à établir.
- Aucun fichier applicatif n'a été déplacé et aucun test, lint, typecheck ou build n'a été exécuté.

## Complément vérifié — dépendances des primitives app, couches UI et contrats de tests (HEAD a4da7d09cc0ddeafed6f3c9a4016ce85d0d6d1ff)

Cette passe a relu les implémentations de primitives dans src/components/app, les wrappers Radix sous src/components/ui et les tests transversaux. Les arêtes ci-dessous sont directes et vérifiées dans les fichiers consultés.

### Dépendances sortantes et ownership

| Fichier | Dépendances directes vérifiées | Ownership provisoire |
|---|---|---|
| components/app/AIBubble.tsx | lucide, framer-motion, Icon, motion tokens, reduced-motion, cn | UI conversation réutilisable ; candidat shared après extraction du thème/motion. |
| components/app/BottomNav.tsx | TanStack Router, lucide, i18n, cn, haptics plateforme, CSS local | Navigation produit client ; app/navigation, pas shared en l'état. |
| components/app/EmptyState.tsx | ReactNode, lucide, Icon, i18n, cn | Primitive visuelle ; valeurs par défaut couplées au catalogue global. |
| components/app/FlashCard.tsx | SmartCard, Icon, Indicator, i18n, contrat core PublicProfilePreview et UI PublicProfilePreview | Présentation d'une entité Flash ; module Flash ou shared après vérification des consommateurs. |
| components/app/FloatingButton.tsx | framer-motion, motion tokens, reduced-motion, cn | Primitive UI candidate shared, dépend de la couche design. |
| components/app/FormField.tsx | ReactNode, useId, UI Label, cn | Primitive de formulaire candidate shared. |
| components/app/Icon.tsx | React SVG types, design tokens, cn | Primitive UI candidate shared, couplée aux tokens. |
| components/app/Indicator.tsx | ReactNode, cn | Primitive de statut candidate shared. |
| components/app/MenuSheet.tsx | TanStack Link, lucide, UI Sheet Radix, i18n | Navigation produit Espace/Talents ; app/navigation. |
| components/app/Modal.tsx | ReactNode, UI Dialog Radix, cn | Wrapper UI générique candidate shared. |
| components/app/PublicProfilePreview.tsx | React state, lucide, contrat core PublicProfilePreview, UI Avatar, wrapper app Sheet, i18n | UI profil public ; module profile ou composition profil. |
| components/app/RadarCard.tsx | ReactNode, lucide, SmartCard, Icon | Carte de proximité nommée Radar ; ownership produit à confirmer. |
| components/app/Sheet.tsx | ReactNode, UI Sheet Radix, i18n, cn | Wrapper partagé possible ; dépend de la couche UI et du contexte i18n. |
| components/app/Skeletons.tsx | UI Skeleton, Surface, cn | Primitive de chargement candidate shared, dépendance interne app à aplanir. |
| components/app/SmartCard.tsx | React HTML props, framer-motion, Surface, motion tokens, reduced-motion, cn | Primitive candidate shared après séparation design. |
| components/app/SmartTabs.tsx | React useId, framer-motion, spring token, cn | Primitive UI candidate shared, dépend du système d'animation. |
| components/app/StatusBanner.tsx | ReactNode/SVG types, lucide, Icon, cn | Primitive de statut candidate shared ; sans logique réseau/PWA. |
| components/app/Surface.tsx | React HTML props, cn | Primitive de surface candidate shared ; dépend des classes/tokens CSS globaux. |
| components/app/SyncEngineBootstrap.tsx | platform/offline/sync-controller | Pont app vers infrastructure offline ; moteur détenu par platform/offline. |
| components/app/SyncEngineLoader.tsx | React hooks, import dynamique local SyncEngineBootstrap, APIs navigateur | Orchestration client différée du démarrage offline ; app/bootstrap ou adaptateur platform/offline. |
| components/app/TrustCard.tsx | ReactNode, lucide, SmartCard, Icon, Indicator, i18n | Carte de réputation nommée Trust ; ownership produit à confirmer. |
| components/app/WalletCard.tsx | ReactNode, Surface, cn | Carte de valeur générique possible ; vérifier le domaine Wallet et les consommateurs. |

### Dépendances des wrappers UI sous-jacents

- components/ui/button.tsx dépend de Radix Slot, class-variance-authority et lib/utils.
- components/ui/sheet.tsx dépend de Radix Dialog, lucide, lib/utils et lib/i18n/useI18n : le wrapper UI Sheet est lui-même couplé au contexte i18n.
- components/ui/dialog.tsx dépend de Radix Dialog, lucide, lib/utils et i18n.
- components/ui/tabs.tsx dépend de Radix Tabs et lib/utils.
- components/ui/avatar.tsx dépend de Radix Avatar et lib/utils.
- components/ui/skeleton.tsx dépend de lib/utils.

Conséquence : déplacer les wrappers app Sheet, Modal ou FormField vers shared sans cartographier les dépendances UI et le contexte i18n pourrait introduire une dépendance transitive non visible dans les imports du composant appelant.

### Tests reliés directement aux composants ou à leurs services

| Test | Imports directs vérifiés | Portée / limite |
|---|---|---|
| tests/components/app-header.test.tsx | components/experience/AppHeader | Rendu statique du header, compteur notifications, tailles/focus. |
| tests/components/bottom-nav.test.tsx | components/app/BottomNav | Ordre des destinations, route active, menu et cibles tactiles. |
| tests/components/communication-sheet.test.tsx | components/experience/CommunicationSheet | Onglets, offline, événements et compteurs ; runtime mocké. |
| tests/components/engine-preview-card.test.tsx | components/experience/EnginePreviewCard | Libellé explicite d'exemple et contenu localisé. |
| tests/sync-engine-loader.test.tsx | components/app/SyncEngineLoader, mock relatif SyncEngineBootstrap | Chargement après premier rendu, attente offline et reprise online. |
| tests/auth/deferred-auth.test.tsx | modules/auth/model/useAuth, modules/auth/services/auth.service | Contrat du hook d'auth et des événements Supabase ; pas test du shell. |
| tests/communication/runtime-provider.test.tsx | lib/communication/CommunicationRuntimeProvider | Instance runtime partagée dans l'arbre React ; dépendance consommée par AppHeader et CommunicationSheet. |
| tests/communication/assistant-notices.test.ts | stores assistant preferences/notices | Teste l'état consommé par AssistantNoticeLayer, pas son rendu. |
| tests/communication/reel-activity-projection.test.ts | modules/reel/model/reel-activity-projection | Store partagé par AppHeader et CommunicationSheet. |
| tests/platform/use-network-status.test.tsx | lib/platform/useNetworkStatus | Hook utilisé par OfflineBanner et CommunicationSheet. |
| tests/onboarding.test.ts | lib/experience/onboarding | Store utilisé par OnboardingSheet, pas rendu de la sheet. |
| tests/pwa.test.ts | platform/pwa, platform/pwa/install | API consommées par InstallBanner et UpdateBanner, pas test des composants. |
| tests/access-mode/engine-access.test.ts | modules/access-mode | Contrat du moteur d'accès, pas test du shell. |
| tests/access-mode/reel-access-policy.test.ts | modules/reel/policy/reel-access-policy | Politique Réel, distincte du rendu de navigation. |

Autres portées négatives vérifiées : home-journey-copy.test.ts teste les messages i18n et non HomeFoundation ; foundation.smoke.test.ts teste le mapping assistant et sa policy ; mobile-e2e-contract.test.ts inspecte un script E2E brut et ne monte aucun composant. Ces fichiers ne sont pas comptés comme tests directs des façades.

### Graphe de dépendances affiné

AppShell
- BottomNav -> router + i18n + haptics + CSS
- AppHeader -> auth + identity + communication runtime + projection Reel -> ProfileQuickPreview
- CommunicationSheet -> runtime + préférences assistant + projection Reel + network status + AssistantTab lazy
- OfflineBanner -> network status + offline sync status + StatusBanner
- InstallBanner / UpdateBanner -> platform/pwa ; InstallBanner utilise aussi haptics
- OnboardingSheet -> auth + onboarding store + router + i18n
- SyncEngineLoader -> import dynamique SyncEngineBootstrap -> platform/offline/sync-controller
- MenuSheet -> router + i18n + components/ui/sheet
- HomeFoundation -> auth + identity + greeting/format + Flash demos + profile preview + Vision card + assets
- SectionFoundation -> Surface/Indicator/EmptyState/Icon + i18n

### Points de résolution / risques confirmés

1. components/app ne représente pas un seul ownership. Surface, Icon, Indicator, Modal, FormField, SmartTabs et Skeletons sont candidates shared ; BottomNav/MenuSheet relèvent de la navigation app ; FlashCard/RadarCard/TrustCard ont une sémantique produit ; SyncEngineLoader est un adaptateur app/offline.
2. La couche UI n'est pas totalement neutre : les wrappers components/ui/sheet et dialog consomment i18n. Une extraction shared doit préserver ce contexte ou injecter les libellés d'accessibilité.
3. AppHeader et CommunicationSheet partagent le runtime communication et la projection Reel. Leurs tests unitaires isolent ces dépendances par mocks ; une refactorisation doit préserver le contrat d'intégration.
4. La chaîne offline a deux niveaux : le loader orchestre côté client, le bootstrap appelle le contrôleur platform/offline. Il faut préserver le chargement différé.
5. Les tests associés couvrent surtout les stores/services ou le rendu statique de quatre composants. Aucun test direct de rendu n'a été identifié dans les fichiers consultés pour InstallBanner, OfflineBanner, OnboardingSheet, UpdateBanner, HomeFoundation ou SectionFoundation.
6. Cette passe éclaire les dépendances sortantes et les tests ; elle ne certifie pas que tous les consommateurs entrants du dépôt ont été identifiés. La recherche de code GitHub étant limitée à la branche par défaut, elle ne prouve pas l'absence d'autres consommateurs sur la branche de travail.

### État de cette tranche

- Fichiers relus : 22 composants app, 6 wrappers UI sous-jacents et 14 tests/contrats pertinents (certains tests avaient déjà été relus dans les compléments précédents).
- Aucune source applicative modifiée.
- Aucun test, lint, typecheck ou build exécuté.
- Le graphe AST/reverse-import complet, les cycles et la résolution exhaustive des importeurs entrants restent ouverts ; la migration reste suspendue jusqu'à leur établissement.


## Suite de migration contrôlée — shared/components et app/navigation

Après les constats précédents, deux petites tranches de déplacement ont été appliquées sur la branche. Les chemins historiques restent disponibles comme shims de compatibilité.

### Primitives partagées déplacées

| Ancien chemin | Emplacement canonique | Traitement |
|---|---|---|
| `src/components/app/Surface.tsx` | `src/shared/components/Surface.tsx` | Implémentation déplacée ; shim historique conservé. |
| `src/components/app/Icon.tsx` | `src/shared/components/Icon.tsx` | Implémentation déplacée ; dépendances design résolues via `@/shared/tokens` et utilitaires via `@/shared/utils` ; shim historique conservé. |
| `src/components/app/Indicator.tsx` | `src/shared/components/Indicator.tsx` | Implémentation déplacée ; shim historique conservé. |

Le barrel `src/shared/components/index.ts` pointe désormais directement vers ces trois implémentations. `src/components/app/index.ts` continue de les exposer via les chemins de compatibilité. Aucune clé i18n n'est ajoutée à ces trois primitives.

**FormField n'a pas été déplacé dans cette tranche.** Son libellé « optional » est codé en anglais et sa dépendance à Label doit être traitée avant de le considérer comme une primitive partagée neutre.

### Navigation applicative déplacée

| Ancien chemin | Emplacement canonique | Traitement |
|---|---|---|
| `src/components/app/BottomNav.tsx` | `src/app/navigation/BottomNav.tsx` | Implémentation déplacée ; shim historique conservé. |
| `src/components/app/MenuSheet.tsx` | `src/app/navigation/MenuSheet.tsx` | Implémentation déplacée ; shim historique conservé. |
| `src/components/app/reel-bottom-nav.css` | `src/app/navigation/reel-bottom-nav.css` | Feuille de style déplacée avec BottomNav. |

Le barrel `src/app/navigation/index.ts` expose BottomNav et MenuSheet. AppShell importe BottomNav depuis ce nouveau dossier et conserve le chargement différé de MenuSheet via `React.lazy(() => import("@/app/navigation/MenuSheet"))`. La façade `src/app/app-shell/index.ts` réexporte les composants depuis `app/navigation`.

Les responsabilités métier restent dans `app/navigation` : destinations Flash/Scan/Reel/Radar, routes Espace/Talents, libellés i18n et interactions haptics ne sont pas remontés dans shared.

### Commits publiés

- `fc8733595211ba69769bcd0fa5a0a4f72c277a28` — déplacement de Surface, Icon et Indicator vers shared/components.
- `f3b71f39ba4b1005d27ee20635dab52ade853c7f` — déplacement de BottomNav et MenuSheet vers app/navigation.
- `44d6e6d16a5b9fc2d6f74c12c3a015f297264e46` — correction pour préserver le chargement différé de MenuSheet.

### Limites de validation

Les mises à jour de branche ont été confirmées sur GitHub. Aucun test, lint, typecheck ou build n'a été exécuté dans cet environnement. Les shims évitent de casser les importeurs historiques connus, mais le graphe inverse exhaustif reste à calculer ; ces déplacements ne constituent pas une validation AST complète.


## Tranche suivante — primitives partagées avec copie injectée

### Déplacements publiés

| Ancien chemin | Emplacement canonique | Traitement |
|---|---|---|
| `src/components/app/FormField.tsx` | `src/shared/components/FormField.tsx` | Copie déplacée ; libellé optionnel désormais injecté par `optionalLabel`. |
| `src/components/app/StatusBanner.tsx` | `src/shared/components/StatusBanner.tsx` | Copie déplacée ; aucun texte produit ou traduction interne. |
| `src/components/app/Skeletons.tsx` | `src/shared/components/Skeletons.tsx` | Copie déplacée ; dépendance au primitive UI Skeleton conservée, Surface et utilitaires pointent vers shared. |

Les anciens fichiers sont conservés comme shims de compatibilité. Le barrel `shared/components` expose directement les nouvelles implémentations.

### Décision i18n — FormField

Le texte anglais codé en dur « optional » a été retiré. `FormField` conserve le booléen `optional`, mais n'affiche le marqueur que si le parent fournit `optionalLabel` (texte ou élément React localisé). Ainsi, shared ne dépend pas d'un provider de traduction et le texte peut être adapté à la locale du formulaire.

**Point d'intégration à vérifier :** les consommateurs qui activent `optional` doivent transmettre `optionalLabel` pour conserver le marqueur visible. Le scan de code disponible ici ne certifie pas la liste exhaustive des consommateurs sur la branche de travail ; les shims préservent les chemins d'import, pas l'ancien texte par défaut.

### Primitives candidates non déplacées dans cette tranche

- `EmptyState` garde un fallback i18n interne (`common.empty`, `common.empty.desc`) : il doit recevoir des textes injectés avant extraction.
- `Sheet` et `Modal` reposent sur les wrappers UI dont les libellés/accessibilité dépendent du contexte i18n ; à traiter avec leurs dépendances.
- `SmartCard`, `AIBubble`, `FloatingButton`, `SmartTabs` restent candidats, mais ont des dépendances motion/design à normaliser avant extraction.
- `SyncIndicator` est actuellement exporté depuis shared mais lit directement `platform/offline` et `i18n`. Cette dépendance est contraire à la frontière shared ; il doit être reclassé côté plateforme ou transformé en primitive de présentation recevant son état et son contenu en props.

### Validation

Commit de cette tranche : `2aa1b25cb29c33e0f1f4bea266a7bc8085881334`.

La publication de la branche a été confirmée. Aucun test, lint, typecheck ou build n'a été exécuté. Le scan exhaustif des consommateurs et le graphe AST inverse restent ouverts.
