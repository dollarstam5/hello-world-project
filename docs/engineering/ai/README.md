# AI framework

This section is the canonical entry point for AI-assisted work on the project.

## Mandatory reading order

Before any code change, AI agents should follow this order:

1. [constitution.md](./constitution.md)
2. [decision-tree.md](./decision-tree.md)
3. [development-manual.md](./development-manual.md)
4. architecture rules
5. coding standards
6. security rules
7. testing standards
8. domain-specific docs

## Project rule hierarchy

When rules conflict, the order is:

1. constitution
2. architecture
3. database / API / security standards
4. functional documents
5. backlog
6. user prompt

## Required operating principles

An AI working on this project must:

- understand the task before coding
- respect the existing architecture
- minimize change scope
- validate work with tests
- document any significant changes
- avoid inventing undocumented design decisions

An AI must not:

- improvise architecture
- bypass security constraints
- modify unrelated domains
- hide errors or skip validation

## Architecture et intégrations IA

- [Architecture IA et intégrations](../../architecture/ai-architecture-integrations.md) décrit les voies IA présentes dans le runtime, leurs frontières de sécurité et les écarts à résoudre avant évolution.

## Canonical AI files

- [constitution.md](./constitution.md)
- [decision-tree.md](./decision-tree.md)
- [development-manual.md](./development-manual.md)
- [ai-rulebook.md](./ai-rulebook.md)
- [coding-standards.md](./coding-standards.md)
- [security-rules.md](./security-rules.md)
- [testing-standards.md](./testing-standards.md)

## Legacy sources merged here

- `docs/engineering/ai/00-AI-README.md.md`
- `docs/engineering/ai/AI-RULEBOOK.md`
- `docs/engineering/ai/AI Development Manual.md`
- `docs/engineering/ai/AI Constitution.md`
- `docs/engineering/ai/12-AI-CODING-STANDARDS.md`
- `docs/engineering/ai/13-AI-SECURITY-RULES.md`
- `docs/engineering/ai/14-AI-TESTING-STANDARDS.md`

These legacy files remain as historical references; the canonical AI folder above is the active source for guidance.
