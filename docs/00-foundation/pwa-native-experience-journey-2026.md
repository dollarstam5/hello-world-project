# Parcours PWA à sensation native — Vitalis (standards 2026)

**Statut :** référence de parcours + audit de code. Validation physique encore requise.  
**Branche :** `feat/pwa-native-experience-journey-2026` (basée sur `main`, sans merge).

Une PWA peut approcher l'expérience native, mais ne peut pas garantir les mêmes APIs, permissions, arrière-plan ou intégration OS sur Android et iOS. Vitalis doit être fluide et cohérent tout en déclarant honnêtement les capacités réelles.

## 1. Inventaire vérifié dans le dépôt

| Domaine | Fichiers | Éléments existants |
|---|---|---|
| Capabilities | `src/lib/platform/capabilities.ts` | OS/browser, standalone, SW, geolocation, notifications, clipboard, partage, coarse pointer, reduced motion |
| Installation | `src/platform/pwa/install.ts`, `src/components/experience/InstallBanner.tsx` | Prompt Android si navigateur le fournit, instructions manuelles Android/iOS, dismissal persisté |
| Update | `src/platform/pwa/update.ts` | worker en attente, signal update, takeover et reload |
| Manifest | `public/manifest.webmanifest` | identité, standalone, start URL, icônes, shortcuts |
| Offline/sync | `public/sw.js`, `public/offline.html`, `src/platform/offline/`, `src/components/experience/OfflineBanner.tsx` | shell cache, page offline, état réseau et sync en attente |
| Shell/mobile | `src/components/app/AppShell.tsx`, `src/routes/__root.tsx`, `src/styles.css` | shell commun, viewport-fit, safe areas, 100dvh + fallback, style tactile |
| Navigation | `src/components/app/BottomNav.tsx` | 5 destinations, feedback haptique, navigation persistante |
| Haptique | `src/platform/device/haptics.ts` | utilitaire partagé |
| Tests mobile | `tests/mobile-viewport-contract.test.ts`, `tests/mobile-e2e-contract.test.ts`, `tests/pwa.test.ts`, `scripts/test-mobile-e2e.sh` | contrats viewport/manifest, routes, smoke test et export install/update |
| Standards | `docs/00-foundation/pwa-platform-adaptation.md`, `docs/02-architecture/mobile-navigation-standards.md` | règles d'adaptation, accessibilité et matrice appareils |

## 2. Branches connexes repérées

- `fix/phase2-pwa-web-vitals` : fondations PWA / Web Vitals, utilisée pour comparaison.
- `fix/reel-ssr-native-controls` : SSR et contrôles de Réel.
- `fix/mobile-navigation-accessibility` : navigation accessible.
- `fix/mobile-safe-area-margins` : marges/safe areas.
- `chore/p0-10-6-mobile-e2e-v2` : tests E2E mobile.
- `docs/mobile-navigation-standards-v1` : standard navigation.

Les branches ne sont pas présumées intégrées, ni leurs checks validés.

## 3. Parcours cible — expérience app, sans faux natif

### Étape A — première ouverture
- Afficher rapidement l'accueil sans flash, rebond ni animation excessive.
- Détecter langue, thème, viewport, navigateur, mode installé et capacités sans demander de permissions.
- Une action d'entrée claire ; onboarding court ; pas de bannière d'installation si déjà standalone.
- États loading/erreur/confirmation chaleureux, non techniques.

### Étape B — installation contextuelle
- Android : bouton d'installation uniquement lorsque le prompt événementiel est disponible, déclenché par geste utilisateur.
- iOS/iPadOS : guide Safari « Partager → Sur l'écran d'accueil »; jamais de faux prompt natif.
- Si installation indisponible, continuer l'usage web et ne pas insister.
- Dismiss mémorisé; accès à l'installation dans les réglages ultérieurs.

### Étape C — lancement depuis icône
- Start URL stable, session restaurée sans flash de déconnexion.
- Standalone réellement détecté, safe areas respectées (encoche, Dynamic Island, barres système, gestes).
- Viewport dynamique avec fallback; clavier virtuel ne masque pas les actions.
- Contexte de route, filtres et recherche préservé si sûr; données périmées/permissions revérifiées.

### Étape D — toucher et feedback
- Cibles recommandées : ≥48 dp Android et ≥44 pt iOS pour commandes principales; 24 CSS px WCAG 2.2 est le minimum réglementaire web, pas le but design.
- État pressé bref, clair, sans flash bleu ni scale exagéré.
- Haptique discret pour actions significatives, optionnel, et respectant le contexte/préférence système.
- Pas de gesture-only : chaque action reste accessible par commande visible.

### Étape E — navigation
- Barre principale Vitalis à 5 entrées, En direct au centre; labels et état actif visibles.
- Retour système/bord iOS et Android non intercepté. Retour ferme d'abord sheet/dialog, puis sous-route.
- URL directe, refresh, retour/avance navigateur, notification/deep-link fonctionnels.
- Transitions courtes; `prefers-reduced-motion` réduit/supprime l'animation.
- État pressé, focus clavier, actif et chargement distingués.

### Étape F — permissions au bon moment
- Position : seulement au moteur qui la requiert; expliquer et offrir un chemin sans localisation si permis.
- Notifications : expliquer la valeur avant prompt; refus sans blocage, inbox interne consultable.
- Camera, micro, Bluetooth, partage, clipboard : test de capacité et permission sur action explicite.
- Réévaluer permission après retour des réglages système ou changement de visibilité.

### Étape G — offline et réseau
- États distincts : offline, réseau lent, requête échouée, pending, sync en cours, confirmée.
- Cache seulement shell/ressources autorisées; éviter cache générique API/mutations.
- Garder uniquement actions éligibles, idempotence et état de confirmation; synchroniser selon capacités réelles.
- Ne pas promettre sync background sur iOS; page offline utile et bouton retour.
- Une action n'est confirmée qu'après résultat réel.

### Étape H — reprise / mises à jour
- Reprise foreground/pageshow : revalider session, réseau, permissions, données expirées et sync.
- Gérer pagehide/visibilitychange/bfcache sans doublons de subscriptions.
- Version prête : message doux, action « Mettre à jour », préserver opérations en cours.
- Reload seulement après takeover confirmé du service worker; fallback timeout documenté, erreur update non bloquante.

### Étape I — accessibilité / appareils
- Safe areas, scroll interne, orientation, fenêtre redimensionnée, split-screen/tablettes, zoom et clavier.
- Reduced-motion, contraste, focus, lecteur d'écran, tailles de texte, clavier/switch control.
- Test petit téléphone, référence 390×844, grand téléphone, tablette portrait/paysage, low-end, réseaux lents et permissions refusées.

## 4. Écart natif selon plateforme

| Fonction | Android | iOS/iPadOS | Règle Vitalis |
|---|---|---|---|
| Installation | prompt varie selon browser | ajout manuel à l'accueil, Safari | instructions exactes par contexte |
| Notifications | APIs et permissions variables | disponibilité dépend OS/version et PWA installée | détecter puis tester réel |
| Background | APIs/quotas variables | limitations fortes | pas de promesse non testée |
| Haptique | support web variable | support web limité/variable | discret, optionnel, fallback |
| Bluetooth/NFC/caméra | support API variable | support web plus restreint | capability-first |
| Partage/files/clipboard | permissions/contextuel | permissions/contextuel | revalider au déclenchement |

## 5. Priorités de mise en œuvre

**P0 — fiabilité :** auditer AppShell, viewport et clavier; retour/gestes/modal; reprise foreground; vérifier cache/offline réel; interactions haptique et accessibilité sur appareil.

**P1 — polish :** press states harmonisés, settings d'installation/update, raccourcis 4 moteurs, effects réduits pour appareils modestes, audit dimensions touch.

**P2 — API conditionnelles :** push, deep links depuis notifications/raccourcis, arrière-plan selon capacités, diagnostics de compatibilité sans données sensibles.

## 6. Critères d'acceptation
- [ ] Routes moteurs : accès direct, refresh, navigation retour/avance.
- [ ] Installation Android et méthode iOS claires et vraies.
- [ ] Permissions demandées à l'instant utile, refus non bloquant.
- [ ] Retour système et gestes testés sans interception.
- [ ] Safe areas, keyboard, viewport dynamique, zoom, orientation validés.
- [ ] Cache offline, opérations en attente, reprise et update vérifiés.
- [ ] Cibles touch, press states, haptique, focus et reduced motion vérifiés.
- [ ] CI automatisée réussie et appareils physiques documentés séparément.

## 7. Preuve
Cette mise à jour est une inspection statique et documentaire. Aucun build, CI, rendu mobile ni test physique n'est déclaré exécuté. La validation doit consigner modèle, OS, navigateur/version, standalone/browser, réseau, permission, étapes, attendu/observé et capture si utile.

## Références
- `docs/00-foundation/pwa-platform-adaptation.md`
- `docs/02-architecture/mobile-navigation-standards.md`
- `src/lib/platform/capabilities.ts`
- `src/platform/pwa/install.ts`, `src/platform/pwa/update.ts`
- `public/manifest.webmanifest`, `public/sw.js`
- `src/components/app/AppShell.tsx`, `src/styles.css`
## 8. P0 code pass — cycle de vie, clavier et reprise (2026-11-23)

**Modifications réalisées dans le code sur cette branche :**

- `src/components/app/AppShell.tsx`: ajoute un suivi de `visibilitychange` et `pageshow` (incluant BFCache), dispatch un événement de reprise `vitalis:app-resume` après passage background→foreground, et met à jour la taille du viewport visuel via `visualViewport.resize/scroll`. Tous les listeners sont nettoyés et le CSS runtime est réinitialisé au démontage.
- `src/routes/__root.tsx`: écoute l'événement de reprise et invalide les queries TanStack Query actives uniquement lorsque la connexion est présente, pour rafraîchir les données au retour sans lancer de refetch hors ligne.
- `src/styles.css`: ajoute `--keyboard-inset`, scroll-padding pour la zone clavier, scroll-margin sur inputs, et masque la barre de navigation fixe lorsque le clavier virtuel réduit l'espace disponible.
- `tests/mobile-viewport-contract.test.ts`: couvre le contrat de cycle de vie, pageshow, visualViewport, variable clavier et masquage de la barre mobile.

**Décision de navigation/gestes :** aucun interception global du geste retour Android/iOS ajouté. Le navigateur et le système gardent le contrôle des gestes de bord/retour; les modals doivent conserver leur propre priorité de fermeture. La navigation par historique n'est pas interceptée.

**CI :** `.github/workflows/quality.yml` est configuré pour déclencher Quality sur cette branche de travail en plus de main. L'exécution doit être consultée après le push; l'ajout du déclencheur ne prouve pas encore la réussite des jobs.

**Limites de preuve :** les tests automatisés et le rendu sur appareils physiques ne sont pas exécutés depuis cet environnement. Vérifier visuellement clavier, retour système, safe-area et reprise sur Android/iOS réels.
