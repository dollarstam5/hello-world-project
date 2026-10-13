# Database

This section documents the repository-backed PostgreSQL model, migrations, grants, and Row Level Security (RLS). It distinguishes schema present in the standard migration path from later candidate SQL artifacts.

## Canonical references

- [Data dictionary](./data-dictionary.md) — baseline tables, relationships, fields, and sync metadata.
- [Schema design, grants, and RLS](./schema-design.md) — baseline access matrix, test coverage, and reconciliation work.
- [Database architecture](../02-architecture/database-architecture.md) — Auth, persistence, synchronization, and migration-source boundaries.

## PostgreSQL standards

- Define table grants and RLS policies together in a reviewed migration.
- Keep ownership checks in the database; do not rely on UI visibility as authorization.
- Treat `service_role` as privileged and bypassing RLS.
- Use explicit, safe `search_path` values for privileged functions and review their execute grants.
- Keep server-assigned revision fields authoritative.
- Test both positive access and cross-user denial, including field-level restrictions and privileged transitions.
- Verify the actual migration runner and applied database schema before declaring a table or policy deployed.

## Historical references retained

- `docs/04-database/DATABASE-DICTIONARY Partie 1 — Présentation générale.md`
- `docs/04-database/DATABASE-DICTIONARY Partie 2 — Catalogue des Domaines.md` (reclassé depuis `docs/05-ai/` dans cette PR)
- `docs/04-database/DATABASE-DICTIONARY Partie 4 — Glossaire.md` (reclassé depuis `docs/05-ai/` dans cette PR)
- `docs/04-database/DATABASE-DICTIONARY Partie 5 — Annexes.md`
- `docs/04-database/Database Architecture.md` (copie exacte conservée ; `Vitala Database Architecture.md` a été retiré après vérification de l'identité du contenu)
- `docs/04-database/DATA_MODEL.md`

These references remain historical context. Their intended architecture is not proof of the current SQL schema. Seules les copies strictement identiques, vérifiées par leur blob Git et approuvées dans le cadre de la déduplication, peuvent être retirées ; les sources contenant des informations uniques restent conservées.
