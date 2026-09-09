# Instructions pour les agents IA

À lire **avant** toute modification. Ces instructions priment sur toute habitude générique.

## Avant d'écrire une ligne

1. Lire `docs/PROJECT_BIBLE.md` et `ARCHITECTURE.md`.
2. Identifier la couche propriétaire de la responsabilité concernée.
3. Vérifier qu'un module existant ne fait pas déjà le travail.

## Pendant

- Placer chaque fichier dans la couche la plus restrictive possible.
- Ne jamais importer `@supabase/*` depuis `src/components`, `src/widgets` ou `src/routes`.
- Écrire les données uniquement via un repository `@eco/core-db`.
- Ajouter chaque texte en FR **et** EN dans `src/lib/i18n/messages.ts`.
- Utiliser exclusivement les tokens de design.
- Créer le fichier de route pour chaque lien ajouté, dans le même lot de modifications.
- Ne jamais toucher aux fichiers générés (`src/routeTree.gen.ts`, `src/integrations/supabase/*` auto-générés).

## Après

- Typecheck et build verts, sans exception.
- Vérifier que l'écran fonctionne hors connexion.
- Mettre à jour la documentation si une règle change.

## Refus attendus

Si une demande contredit ce document (logique métier dans un composant, appel backend depuis l'UI, code temporaire, texte en dur), le dire clairement et proposer la voie conforme plutôt que de l'appliquer.
