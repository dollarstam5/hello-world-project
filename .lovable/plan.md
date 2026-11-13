# Audit de l'interface et corrections minimales

## 1. Inventaire des pages (chemins exacts)

| Adresse | Fichier de route | Contenu |
|---|---|---|
| `/` | `src/routes/index.tsx` | `src/components/experience/HomeFoundation.tsx` |
| `/flash` | `src/routes/flash.tsx` | domaine `src/domains/flash` |
| `/scan` | `src/routes/scan.tsx` | `src/domains/scan/ui/ScanPanel.tsx` |
| `/reel` | `src/routes/reel.tsx` | `src/domains/presence/ui/ReelProximityScreen.tsx` (1044 lignes) |
| `/radar` | `src/routes/radar.tsx` | domaine `src/domains/radar` |
| `/talents` | `src/routes/talents.tsx` | menu 2x2 |
| `/espace` (+ `/apercu`, `/profil`, `/informations`, `/parametres/profil`, `/parametres/application`) | `src/routes/espace*.tsx` | espace personnel |
| `/auth`, `/reset-password` | `src/routes/auth.tsx`, `reset-password.tsx` | connexion |
| `/admin`, `/admin/$module` | `src/routes/_authenticated/admin*.tsx` | tableau de gestion |

Coque commune : `src/routes/__root.tsx` puis `src/components/app/AppShell.tsx`.

## 2. Sources clés
- Traductions FR/EN : `src/lib/i18n/messages.ts` + `src/lib/i18n/useI18n.ts`.
- En-tête global : `src/components/experience/AppHeader.tsx` (logo, qui ramène à l'accueil, cloche, avatar).
- En-tête Réel : intégré dans `ReelProximityScreen.tsx` (balise `<header class="reel-proximity__header">`, préférences, titre « RÉEL », cloche).
- Barre du bas principale : `src/components/app/BottomNav.tsx` (Flash, Scan, Réel au centre, Radar, 2x2).
- Barre propre à Réel : `src/domains/presence/ui/ReelBottomNav.tsx` (même ordre, rendu différent).

## 3. Ordre actuel de l'accueil (`HomeFoundation.tsx`)
1. Badge d'identité + bienvenue + sous-titre
2. Flash d'exemple (« home.demo.* »)
3. « Par où commencer » : cartes Flash, Scan, Réel, Radar
4. Astuce menu 2x2

## 4. Pourquoi il n'y a ni `src/App.tsx` ni `src/pages`
Le projet utilise TanStack Start : chaque fichier de `src/routes/` est une page (routage par fichiers) et `__root.tsx` remplace `App.tsx`. `src/routes/README.md` interdit explicitement `src/pages`. La règle du projet « routes = couche pages » le confirme. Rien ne manque.

## 5. Incohérences démontrées (confrontées aux règles validées)
1. **Barre du bas absente sur Flash, Scan et Radar.** `AppShell` masque `BottomNav` sur toutes les routes moteur (`!isEngineRoute`) ; seule Réel reçoit sa propre barre. Règle : 5 icônes partout sur mobile.
2. **Réel garde une barre de navigation globale.** `ReelBottomNav` est affichée à l'intérieur du moteur. Règle : Réel a son propre en-tête et masque la navigation globale.
3. **Deux barres concurrentes** (`BottomNav` et `ReelBottomNav`), avec des styles différents pour les mêmes destinations.
4. **Commandes de Réel incomplètes ou peu claires.** L'en-tête a préférences + cloche, mais les bips et mises en relation n'ont pas d'entrée distincte. Le Bluetooth est un bouton inactif au milieu de l'écran. Il devrait être dans l'en-tête, marqué « V3 ».
5. **Réel n'est pas traduit.** `ReelProximityScreen.tsx` n'utilise pas `useI18n` : tout le texte est en français, y compris le texte de chargement dans `reel.tsx`.
6. **Langues mélangées dans les exemples.** `src/domains/flash/model/demo-flashes.ts` écrit « Lieu non précisé » en dur.
7. **Ordre de l'accueil.** Les exemples passent avant « Par où commencer ». Règle : présenter d'abord les moteurs dans un ordre clair (Flash, Scan, Réel, Radar), puis les exemples.
8. **Informations de partage incomplètes.** `og:type`/`twitter:card` sont absents de la plupart des pages, et `reel.tsx` n'a pas `og:title`/`og:description`.

## 6. Corrections minimales proposées (fonctions V1 conservées)
1. **AppShell** : afficher `BottomNav` partout sauf sur Réel, admin et connexion. Ne plus monter `ReelBottomNav` (fichier supprimé une fois inutilisé). Sur Réel, l'en-tête global reste masqué.
2. **En-tête Réel** : regrouper ses commandes à droite : notifications/bips/mises en relation (cloche avec pastille, ouvre le panneau existant), préférences, Bluetooth désactivé avec la mention « Bientôt (V3) ». Ajouter un bouton retour vers l'accueil. Retirer le bouton Bluetooth du centre de l'écran.
3. **Traduire Réel** : déplacer tous ses textes dans `messages.ts` (FR + EN) et les lire avec `useI18n`. Aucune logique ne change.
4. **Exemples Flash** : remplacer « Lieu non précisé » par une clé de traduction.
5. **Accueil** : nouvel ordre : bienvenue, puis « Par où commencer » (Flash, Scan, Réel, Radar), puis exemples, puis astuce 2x2.
6. **Métadonnées** : ajouter `og:type` et `twitter:card` sur chaque page, et compléter `reel.tsx`.

Hors périmètre : la logique de synchronisation, le backend, Radar et la connexion Google ne sont pas touchés.

## 7. Vérification
- Captures mobiles (320 et 448 px) de `/`, `/flash`, `/scan`, `/reel`, `/radar`, `/talents` en FR et EN.
- Vérifier : barre du bas présente partout sauf sur Réel ; en-tête Réel avec ses 3 commandes ; aucun texte français en mode EN.
- Les tests existants et le build doivent passer.
