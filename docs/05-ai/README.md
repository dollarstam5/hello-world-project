# AI framework

This section is the canonical entry point for AI-assisted work on the project.

## Mandatory reading order

Before any code change, AI agents should follow this order:

1. AI constitution
2. AI decision tree
3. AI development manual
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

## Canonical AI files

- [ai-rulebook.md](./ai-rulebook.md)
- [constitution.md](./constitution.md)
- [coding-standards.md](./coding-standards.md)
- [security-rules.md](./security-rules.md)
- [testing-standards.md](./testing-standards.md)

## Legacy sources merged here

- `docs/00-AI-README.md.md`
- `docs/AI-RULEBOOK.md`
- `docs/AI Development Manual.md`
- `docs/AI Constitution.md`
- `docs/12-AI-CODING-STANDARDS.md`
- `docs/13-AI-SECURITY-RULES.md`
- `docs/14-AI-TESTING-STANDARDS.md`

These legacy files are still preserved as historical references, while the canonical folder above is the active source for AI process guidance.
