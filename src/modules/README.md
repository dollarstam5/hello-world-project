# Modules — architecture applicative

`src/modules/` regroupe les capacités métier autonomes de l'application. Un module peut contenir ses API, modèles, services, hooks et composants d'interface ; son fichier `index.ts` définit sa surface publique lorsqu'elle est nécessaire.

## Organisation

- **Moteurs produit** : `reel`, `flash`, `scan`, `radar`.
- **Identité et accès** : `auth`, `profile`, `access-mode`.
- **Capacités complémentaires** : `assistant`, `admin`, `creator`, `feed`, `knowledge`, `referral`, `spaces`, `trust`, `trust-network`, `wallet`.

Le nom technique historique `presence` a été remplacé par `reel` ; la route produit reste `/reel`.

## Règles de dépendance

- Un module garde la propriété de ses règles métier, données, services et interfaces.
- Les autres modules consomment sa surface publique, pas ses chemins internes.
- L'assemblage de plusieurs modules relève de `src/composition/` ou de `src/app/`, selon qu'il s'agit d'une expérience produit ou de la coque applicative.
- Les fondations transversales (appareil, réseau, permissions, PWA, hors ligne, temps réel) relèvent de `src/platform/`.
- Les ressources réellement génériques relèvent de `src/shared/`.
- Les contrôles d'autorisation sensibles restent obligatoires côté serveur ; les décisions de l'interface ne remplacent jamais les politiques serveur.

## État des extractions

La présence d'un dossier ou d'un export ne signifie pas que le module est entièrement extrait ou terminé. Certains points d'entrée restent des façades temporaires vers `src/lib/` ou vers des composants partagés. Toute extraction ultérieure doit vérifier les consommateurs, les dépendances et la responsabilité de chaque fichier avant de déplacer du code.
