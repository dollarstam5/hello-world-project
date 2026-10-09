# Documentation

This directory now follows a canonical topology so the project documentation is easier to navigate, maintain, and evolve.

## Canonical structure

- `00-foundation/` — build rules, architecture baseline, project conventions
- `01-product/` — product vision, personas, trust, experience
- `02-architecture/` — technical architecture and database architecture
- `03-api/` — API references and contracts
- `04-database/` — data model, dictionary, schema, RLS, standards
- `05-ai/` — AI framework, rules, standards, and governance
- `06-operations/` — deployment, performance, release and operations
- `07-annexes/` — glossary, error catalog, policy references

## Quick start

- [00-foundation/README.md](./00-foundation/README.md)
- [01-product/README.md](./01-product/README.md)
- [02-architecture/README.md](./02-architecture/README.md)
- [03-api/README.md](./03-api/README.md)
- [04-database/README.md](./04-database/README.md)
- [05-ai/README.md](./05-ai/README.md)
- [06-operations/README.md](./06-operations/README.md)
- [07-annexes/README.md](./07-annexes/README.md)

## Phase 2 cleanup

The first cleanup created the canonical folders. This second pass consolidates the most important legacy documents into the structure above, so the repository no longer mixes architecture, AI rules, build rules, and product docs in a single flat directory.

## Legacy files still preserved

These remain as historical snapshots and migration references:

- `docs/00-AI-README.md.md`
- `docs/1. BUILD-OVERVIEW.md.md`
- `docs/AI-RULEBOOK.md`
- `docs/01-VITALA - VISION PRODUIT V1.md`
- `docs/18-VITALA-ARCHITECTURE-V1 Partie 1.md`
- `docs/18-VITALA-ARCHITECTURE-V1 Partie 2.md`
- `docs/18-VITALA-ARCHITECTURE-V1 Partie 3.md`

## Recommended policy

- Use canonical folders for all new documentation.
- Keep historical files only as traceability and migration references.
- Prefer deduplicated, topic-based files over numbered fragments and duplicates.
