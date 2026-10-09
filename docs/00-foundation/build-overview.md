# Build overview

This document is the canonical build blueprint for the project. It defines the official development sequence and the dependency chain for the platform.

## 1. Goal

The purpose of this document is to define the correct order of construction for the Vitala platform.

It is the entry point for both human developers and AI agents. No implementation should begin without respecting the phase dependencies described here.

## 2. Core principles

The platform is built on:

- Domain-Driven Design
- Modular architecture
- Offline-first design
- API-first development
- Security by design
- AI-ready implementation
- Documentation-first delivery

## 3. Official build order

### Phase 1 — Foundation

Objective: establish the technical base.

Includes:
- repository initialization
- project configuration
- backend setup
- Supabase setup
- environment management
- CI/CD
- folder structure
- quality tools

### Phase 2 — Infrastructure

Objective: build shared platform services.

Includes:
- authentication
- unified digital identity
- database
- storage
- media
- notifications
- auditing / logging
- error handling

### Phase 3 — Business domains

Build domains in a strict order.

Priority order:
1. UDI
2. Flash
3. Mission
4. Trust

Each domain should include models, services, repositories, API contracts, validation rules, and tests.

### Phase 4 — Offline synchronization

This phase is mandatory before intelligence modules.

Includes:
- local workspace
- drafts
- outbox
- sync engine
- conflict resolution
- checkpoints

### Phase 5 — Intelligence engines

Build:
- radar
- veille / monitoring
- recommendation
- search

These engines should never bypass the business domain layer.

### Phase 6 — User interface

Build progressively:
- design system
- components
- screens
- navigation
- states
- API integration

### Phase 7 — Integration

Validate:
- frontend ↔ backend
- backend ↔ database
- offline ↔ sync
- intelligence ↔ domains

### Phase 8 — Quality

Run:
- unit tests
- integration tests
- offline tests
- performance tests
- security tests
- architecture review

### Phase 9 — Production readiness

Configure:
- monitoring
- backups
- observability
- deployment
- final documentation

## 4. Dependency rules

The official dependency order is:

- Infrastructure before domains
- Domains before synchronization
- Synchronization before intelligence
- Intelligence before complete UI
- UI before final validation

No phase may bypass this chain.

## 5. Validation criteria

A phase is complete only when:

- all planned features are implemented
- tests pass
- documentation is updated
- no critical technical debt remains
- all AI development rules are respected

## 6. Required reading before implementation

Before a module is built, the team should read:

- project vision
- domain model
- API contracts
- database documentation
- development guide
- AI development rules
- the corresponding build blueprint

## 7. Hard rules

It is forbidden to:

- develop from undocumented ideas
- modify a domain without updating its documentation
- create circular dependencies
- bypass official APIs
- mix business logic and UI logic

## Legacy source

- `docs/1. BUILD-OVERVIEW.md.md`
- `docs/2. BUILD-ARCHITECTURE.md.md`
- `docs/3. BUILD-CONVENTIONS.md`
