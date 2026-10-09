# Documentation

This directory was cleaned up into a canonical structure so the project documentation is easier to navigate and maintain.

## Canonical structure

- `00-foundation/` — project foundations, build rules, architecture baseline
- `01-product/` — vision, personas, trust, product journey
- `02-architecture/` — technical architecture, systems and modules
- `03-api/` — API reference and protocol docs
- `04-database/` — database, schema, RLS, performance standards
- `05-ai/` — AI governance and engineering rules
- `06-operations/` — deployment, operations, performance and release
- `07-annexes/` — glossary, checklists, policy references

## Start here

- [00-foundation/README.md](./00-foundation/README.md)
- [01-product/README.md](./01-product/README.md)
- [02-architecture/README.md](./02-architecture/README.md)
- [03-api/README.md](./03-api/README.md)
- [04-database/README.md](./04-database/README.md)
- [05-ai/README.md](./05-ai/README.md)
- [06-operations/README.md](./06-operations/README.md)
- [07-annexes/README.md](./07-annexes/README.md)

## Legacy note

The repository historically contained many unstructured Markdown files at the root of `docs/` with duplicate names, split documents, and mixed numbering. Those files are intentionally preserved for traceability during migration, while the canonical documentation is now organized under the folders above.

## Recommended usage

- Use the canonical folders for active reading and links from code or tooling.
- Prefer new documentation to be added in the relevant section instead of the root docs folder.
- Treat legacy files as historical or staging material until they are fully migrated.
