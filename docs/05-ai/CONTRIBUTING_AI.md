# Instructions pour les agents IA

À lire **avant** toute modification. Ces instructions priment sur toute habitude générique.

## Avant d'écrire une ligne

1. Lire `docs/README.md` et `docs/00-foundation/README.md` pour identifier les références documentaires actives.
2. Lire `ARCHITECTURE.md` et `docs/05-ai/README.md` pour respecter les frontières et la hiérarchie des règles.
3. Identifier la couche propriétaire de la responsabilité concernée.
4. Vérifier qu'un module existant ne fait pas déjà le travail.
5. Consulter les documents du domaine concerné et leurs statuts d'implémentation.

**Traçabilité documentaire :** le dépôt ne contient pas de fichier actif `docs/PROJECT_BIBLE.md`. Ne pas le traiter comme une référence disponible ni prétendre que son contenu historique a été entièrement consolidé. Les écarts documentaires connus sont suivis dans `docs/07-annexes/documentation-content-coverage.md`.

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
