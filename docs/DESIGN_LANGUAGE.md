# Langage de design

## Principe

« Less but better ». Sombre par défaut, charcoal profond et bleu électrique, verre et halos cinématiques. Rien de décoratif qui n'aide pas à comprendre.

## Tokens

Toutes les valeurs visuelles sont définies dans `src/styles.css` et miroitées en JS dans `src/lib/design/tokens.ts`. Aucun composant n'écrit une couleur, une ombre ou un espacement en dur.

- **Surfaces** : échelle de six niveaux, du fond au verre le plus élevé.
- **Glow** : cinq niveaux, réservés à l'attention (état actif, IA, alerte).
- **Typographie** : échelle fluide, lisible dès 320 px.
- **Espacement** : base 4 px, utilitaires de rythme sémantique.

## Mouvement

Easings cinématiques, animations `breathe`, `radar-scan`, `rise-in`. Tout mouvement respecte `prefers-reduced-motion` et la classe `low-end` posée sur `<html>` pour les appareils modestes.

## Responsive

Mobile-first strict : 320 px → ultra-wide. Navigation flottante à quatre onglets en bas, atteignable au pouce. Les écrans de gestion (`/admin`) et de connexion (`/auth`) portent leur propre habillage.

## Écriture

Le texte fait partie du design. On écrit comme on parlerait : « Vos échanges en attente », jamais « Sync queue: 3 pending ». Tout passe par `useI18n`, FR et EN livrés ensemble.
