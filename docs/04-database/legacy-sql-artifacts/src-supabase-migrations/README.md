# Artefacts SQL historiques — ancien dossier src/supabase/migrations

Ces six fichiers ont été déplacés ici le 27 novembre 2026 afin de retirer un faux chemin de migrations de l'arborescence applicative.

## Statut

- Ce dossier n'est pas un chemin de migrations Supabase CLI.
- Aucun script, workflow ou code runtime du dépôt ne charge ce chemin.
- Les fichiers sont conservés à titre d'archives et de traçabilité ; **ne pas les exécuter ni les rejouer**.
- La seule chaîne officielle pour les nouvelles migrations Supabase est `supabase/migrations/`.
- Les fichiers historiques Drizzle restent séparés : la base Supabase reliée au projet possède une table `drizzle.__drizzle_migrations` avec quatre migrations enregistrées (25 octobre, 6 novembre et 16 novembre 2026). Leur retrait nécessite une réconciliation et une désactivation vérifiée de tout runner externe.

## Fichiers conservés

Les six artefacts d'origine sont conservés sans modification. Deux ont des équivalents dans la chaîne Supabase canonique, mais les versions archivées restent utiles pour comparer les états historiques. Les autres ne doivent pas être considérés comme des migrations manquantes à rejouer.

## Vérification de la base au 27 novembre 2026

Lecture seule sur le projet Lovable « Hello World Project » :
- `supabase_migrations.schema_migrations` contient trois versions initiales (août 2026).
- `drizzle.__drizzle_migrations` contient quatre entrées, alignées sur les quatre entrées du journal Drizzle versionné.
- `public.flashes` possède encore `latitude`, `longitude` et `accuracy_meters`.
- La table `public.flash_private_locations` n'a pas été trouvée dans le catalogue consulté.

Ce constat révèle une divergence entre la chaîne SQL versionnée actuelle et la base reliée au projet. Aucun SQL distant n'a été exécuté pendant cette vérification. La consolidation vers Supabase CLI doit faire l'objet d'un lot séparé, testé et approuvé.
