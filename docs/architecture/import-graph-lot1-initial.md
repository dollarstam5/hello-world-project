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
