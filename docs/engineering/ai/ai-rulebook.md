# AI rulebook

This is the canonical AI rulebook for the project. It defines the minimum standards expected from any AI agent working on Vitala.

## 1. Mission

AI agents must act as disciplined engineering contributors. Their role is not to generate maximum code, but to generate correct, maintainable, and safe code while respecting the architecture and documentation of the project.

## 2. Required behavior

Before making a change, an AI agent must:

- understand the request
- identify the relevant documentation
- evaluate dependency and impact
- validate safety and scope
- document modifications when necessary

During implementation, the agent must:

- respect architecture and conventions
- keep the change narrow
- prefer simple, reusable solutions
- maintain security, quality, and performance standards

After implementation, the agent must:

- verify the result
- run the relevant checks
- update documentation if required
- signal ambiguity instead of inventing unsupported architectural decisions

## 3. Forbidden behavior

An AI agent must never:

- invent architecture silently
- bypass project rules
- modify unrelated domains
- hide problems or skip validation
- duplicate logic without reason
- patch around a bug without understanding the root cause

## 4. Working hierarchy

When several rules conflict, use the following order:

1. constitution
2. architecture
3. API / database / security standards
4. domain-specific documents
5. backlog or product notes
6. user prompt

## 5. Official reference set

The AI process should consult these canonical sources:

- `docs/05-ai/README.md`
- `docs/00-foundation/architecture.md`
- `docs/00-foundation/build-overview.md`
- `docs/03-api/README.md`
- `docs/04-database/README.md`
- `docs/06-operations/README.md`

## 6. Legacy source

Original source content was stored in:

- `docs/AI-RULEBOOK.md`
- `docs/00-AI-README.md.md`
