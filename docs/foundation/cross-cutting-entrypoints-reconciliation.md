# Réconciliation des composants transversaux et des points d'entrée

Date : 25 novembre 2026  
Référence comparée : commit `55f2408969c7da6367f06f0fc096cb2018807a9e` de la PR #89  
Branche de travail : `chore/architecture-folder-cleanup-2026-11`

## Objectif

Rétablir les frontières canoniques introduites dans #89 pour les ressources transversales, sans casser les imports historiques de #90 ni modifier les comportements des moteurs.

## Composants UI partagés

La PR #89 place les primitives génériques dans `src/shared/ui` et conserve `src/components/ui` comme couche de compatibilité.

Cette organisation est reprise :

- Les 55 fichiers canoniques de `src/shared/ui` sont présents.
- Les 54 chemins historiques de `src/components/ui` deviennent des façades de réexport vers `@/shared/ui`.
- L'alias shadcn `ui` de `components.json` pointe désormais vers `@/shared/ui`, afin que les nouveaux composants générés rejoignent la couche canonique.
- Les imports historiques explicites restent fonctionnels pendant la migration progressive.

Les primitives Button, Dialog, Sheet et Input ont été comparées entre les deux emplacements : leur contenu fonctionnel est équivalent après normalisation du seul chemin d'import de `cn`. Les autres primitives sont reprises depuis les blobs canoniques de la PR #89 et conservent les façades correspondantes.

Les composants composés `Modal`, `Sheet` et `Skeletons` importent maintenant directement les primitives depuis `@/shared/ui`, sans dépendre de l'ancien chemin `@/components/ui`.

## Features transversales

### Communication

- `src/features/communication` devient la source canonique du runtime, du contexte, de la préparation des messages, de la déduplication, des règles de priorité et des contrats de présentation.
- `src/lib/communication` conserve des façades de compatibilité vers la feature.
- La version générique de `resolveCommunicationCandidates<T>` de #89 est conservée afin de préserver le type concret des candidats.

Le runtime reste local et en mémoire selon son implémentation actuelle : cette réorganisation ne lui ajoute ni stockage distant, ni minuterie, ni nouvelle capacité de communication.

### Première ouverture

- `src/features/onboarding` devient la source canonique du store de première ouverture.
- `src/lib/experience/onboarding.ts` reste une façade historique.
- La clé locale, les cinq étapes, le saut et la fin du parcours ne changent pas.

Les décisions produit validées restent inchangées : découverte initiale proposée mais facultative, accès libre à l'application, aucun moteur lancé automatiquement, persistance invitée locale aujourd'hui. La synchronisation de ce parcours pour les comptes connectés reste future et n'est pas prétendue livrée.

### Découverte

- Le registre de sections est canonisé sous `src/features/discovery/model/discovery-registry.ts`.
- `src/features/discovery` expose ce contrat.
- `src/lib/experience/discovery.ts` reste une façade de compatibilité.

Le registre reste un mécanisme d'extension local ; cette réorganisation ne crée pas de nouveau service de découverte ni de résultats supplémentaires.

## Plateforme

- Le composant de statut de synchronisation est déplacé de `shared/components` vers `platform/offline/SyncIndicator.tsx`, car il présente l'état du système hors ligne.
- Le chemin partagé historique reste une façade de compatibilité.
- Le barrel `platform/offline` expose maintenant `SyncIndicator` tout en conservant `OfflineBanner` et les exports existants.
- Le composant importe directement `./sync-status` pour éviter un cycle via le barrel du dossier.

Les implémentations canoniques de l'internationalisation, des capacités appareil, du réseau et des mesures de performance étaient déjà sous `platform/` dans #90. Les anciens chemins `lib/i18n` et `lib/platform` restent des façades lorsqu'ils sont encore référencés.

## Entrées des modules autonomes

Les pages de compte et de profil sont déjà détenues par leurs modules dans #90 :

- `modules/auth` expose les informations du compte.
- `modules/profile` expose la gestion, la visibilité et l'aperçu du profil.
- Les routes correspondantes importent directement les pages depuis ces modules.
- `modules/index.ts` conserve les entrées publiques de auth, profile, Flash, Scan, Radar, En direct et des autres modules.

Aucun déplacement supplémentaire de ces pages n'était nécessaire dans cette étape.

## Imports applicatifs alignés

Les points d'entrée suivants utilisent maintenant les couches canoniques :

- `AppShell` : bootstrap plateforme, onboarding feature et runtime de communication feature.
- `AppHeader` : auth/profile modules, internationalisation plateforme et communication feature.
- `CommunicationSheet` : communication feature, réseau plateforme, Sheet partagé et Tabs partagés.
- `HomeFoundation` : auth/profile modules, internationalisation plateforme et helpers de communication feature.
- `OnboardingSheet` : onboarding feature, auth module, internationalisation plateforme et composants partagés.
- `PersonalDashboard` : auth/profile modules et internationalisation plateforme.

Les anciens chemins sont maintenus comme compatibilité ; les nouveaux imports doivent viser les entrées canoniques.

## Vérifications ajoutées

`tests/cross-cutting-entrypoints.test.ts` vérifie :
- la présence de `shared/ui` et les façades historiques ;
- les entrées communication, onboarding et découverte ;
- le propriétaire plateforme de `SyncIndicator` ;
- l'absence de dépendance des composants composés partagés vers les anciens chemins UI ;
- les entrées publiques des modules autonomes.

Ces tests vérifient les contrats source et les chemins d'import, pas le rendu visuel ou le comportement en production.

## Contrôle global à exécuter

Avant de considérer la réconciliation achevée :

1. `bun run check:architecture-imports` — résolution des imports locaux et signalement des chemins de propriété historiques.
2. `bun run lint`.
3. `bun run test:run`.
4. `bun run build:check`.
5. Contrôles CI de budget de performance, audit global, reproductibilité et Go/No-Go.

La CI GitHub doit confirmer ces contrôles sur le nouveau commit. Aucune fusion de PR n'est effectuée dans cette étape.

## Résultat du contrôle statique ciblé

Sur le commit de travail courant, un contrôle de résolution des imports a été effectué à partir de l'arbre GitHub :

- les 55 fichiers canoniques de `src/shared/ui` et leurs imports locaux ;
- les entrées communication, onboarding et découverte ;
- le statut de synchronisation et son export plateforme ;
- les principaux fichiers d'assemblage (shell, en-tête, panneau Communication, accueil, introduction, espace personnel) ;
- les composants partagés `Modal`, `Sheet` et `Skeletons`.

Aucun import local non résolu n'a été détecté dans cet échantillon. Ce contrôle ciblé n'est pas un substitut à l'exécution complète de `bun run check:architecture-imports` sur le dépôt.

Aucune exécution GitHub Actions n'est associée au dernier SHA au moment de cette vérification. La PR est toujours en brouillon ; elle n'a pas été marquée prête à être examinée pour forcer un déclenchement CI.
