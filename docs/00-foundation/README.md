# Foundation

This section contains the canonical foundations of the project: architecture, build sequencing, and engineering conventions.

## Contents

- [architecture.md](./architecture.md)
- [build-overview.md](./build-overview.md)
- [build-conventions.md](./build-conventions.md)

## Core principle

The project must be built in a stable, dependency-driven order. No phase can be skipped or partially bypassed without breaking the design integrity of the platform.

## Canonical references

- [`../ARCHITECTURE.md`](../ARCHITECTURE.md)
- [`../QUALITY.md`](../QUALITY.md)
- [`../GO_NO_GO.md`](../GO_NO_GO.md)
- [`../REPRODUCIBILITY.md`](../REPRODUCIBILITY.md)

## Legacy sources merged here

- `docs/1. BUILD-OVERVIEW.md.md`
- `docs/2. BUILD-ARCHITECTURE.md.md`
- `docs/3. BUILD-CONVENTIONS.md`
- `docs/BUILD-API.md 2. Principes communs.md`
- `docs/BUILD-API.md 3. Conventions REST.md`

These files are preserved as historical source material but are superseded by the canonical folder structure above.
