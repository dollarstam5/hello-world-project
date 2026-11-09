# Bibliothèque des maquettes d'écran — Vitalis

Ce dossier est la **référence visuelle centralisée** de Vitalis pour Lovable, les développeurs, les designers et les personnes chargées des contrôles qualité.

Il accueille les captures et maquettes d'écran fournies ou validées par l'équipe. Il ne remplace pas les spécifications fonctionnelles et techniques de `docs/`.

## 1. Règle de référence

Avant de créer ou modifier un écran :
1. consulter le dossier correspondant dans `screenshots/` ;
2. lire les documents fonctionnels et techniques liés dans `docs/` ;
3. respecter les états, interactions, textes et règles décrits ;
4. signaler toute contradiction entre une image et la documentation au lieu de choisir arbitrairement.

**Une image montre l'apparence attendue ; la documentation définit le comportement attendu.**

Une maquette n'est une référence officielle que si son statut est `VALIDÉE`. Une image en attente ne doit pas être considérée comme une instruction de réalisation.

## 2. Organisation

```text
screenshots/
├── README.md
├── 00-design-system/
├── 01-onboarding/
├── 02-home/
├── 03-navigation/
├── 04-reel/
├── 05-flash/
├── 06-scan/
├── 07-radar/
├── 08-category/
├── 09-notifications/
├── 10-messages/
├── 11-assistance/
├── 12-profile/
└── 13-modals-dialogs/
```

Chaque dossier contient un fichier `.gitkeep` afin de rester visible dans GitHub avant l'ajout des images.

## 3. Statuts des maquettes

Utiliser l'un de ces statuts dans la fiche de suivi ou dans le nom du fichier si nécessaire :

- **PROPOSITION** : première piste, non validée.
- **À VALIDER** : soumise à examen.
- **VALIDÉE** : référence visuelle approuvée pour réalisation.
- **REMPLACÉE** : ancienne référence conservée pour l'historique ; ne plus l'utiliser pour une nouvelle réalisation.

Ne jamais remplacer silencieusement une maquette validée. Ajouter une nouvelle version et actualiser la référence après validation.

## 4. Convention de nommage

Utiliser des noms courts, explicites, en minuscules, sans espace ni accent :

`<espace>-<écran>-<état>-v<version>.<extension>`

Exemples :
- `home-main-default-v1.png`
- `reel-presence-active-v1.png`
- `reel-request-empty-v1.png`
- `navigation-mobile-open-v1.png`
- `dialog-confirmation-loading-v1.png`

Formats recommandés : **PNG** pour les captures précises et **WebP** pour les images optimisées. Conserver une bonne résolution et éviter les images floues ou recadrées de manière trompeuse.

## 5. Informations à fournir avec une maquette

Pour chaque écran important, ajouter une courte fiche Markdown à côté de l'image, ou compléter le fichier de suivi :

- Nom de l'écran et dossier concerné
- Version
- Statut
- Plateforme et format (mobile, tablette, desktop)
- État représenté (normal, vide, chargement, erreur, succès, etc.)
- Document(s) fonctionnel(s) lié(s) dans `docs/`
- Notes utiles sur les interactions ou les différences à respecter

Une image seule ne suffit pas à expliquer un comportement invisible.

## 6. Plusieurs états et tailles d'écran

Ne pas regrouper des états différents dans une seule image illisible. Ajouter une capture distincte pour chaque état qui change réellement l'interface ou la compréhension de l'utilisateur.

Pour les écrans adaptatifs, distinguer clairement mobile, tablette et desktop. La conception reste mobile-first.

## 7. Règles pour Lovable et les développeurs

- Consulter les références avant toute implémentation UI.
- Ne pas inventer les éléments absents d'une maquette validée sans vérifier la documentation.
- Ne pas déduire les règles métier d'une simple capture.
- Respecter l'identité visuelle Vitalis et les règles d'accessibilité, de responsive et de performance.
- Préserver la simplicité et limiter la charge mentale.
- En cas de contradiction, suspendre uniquement le point concerné et demander une clarification documentée.
- Ne pas considérer les images `PROPOSITION` ou `À VALIDER` comme approuvées.

## 8. Ajouter une maquette

1. Ouvrir le dossier correspondant.
2. Ajouter l'image avec le nommage défini ci-dessus.
3. Ajouter une fiche courte si le contexte n'est pas évident.
4. Mettre à jour le statut dans le suivi.
5. Faire valider la maquette avant de la déclarer comme référence officielle.

## 9. Suivi des références

| Espace | Référence principale | Version | Statut | Notes |
|---|---|---|---|---|
| Design system | À ajouter | — | À VALIDER | |
| Onboarding | À ajouter | — | À VALIDER | |
| Accueil | À ajouter | — | À VALIDER | |
| Navigation | À ajouter | — | À VALIDER | |
| Réel | À ajouter | — | À VALIDER | |
| Flash | À ajouter | — | À VALIDER | |
| Scan | À ajouter | — | À VALIDER | |
| Radar | À ajouter | — | À VALIDER | |
| Catégories | À ajouter | — | À VALIDER | |
| Notifications | À ajouter | — | À VALIDER | |
| Messages | À ajouter | — | À VALIDER | |
| Assistance | À ajouter | — | À VALIDER | |
| Profil | À ajouter | — | À VALIDER | |
| Fenêtres et dialogues | À ajouter | — | À VALIDER | |

> Les dossiers sont prêts à recevoir les images. Leur présence ne signifie pas que les maquettes sont déjà définies ou validées.
