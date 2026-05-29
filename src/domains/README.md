# Domains — Domain-Driven Architecture

Each business capability lives in its own folder under `src/domains/`.
A domain owns its types, store, mock data, hooks, and UI building blocks.
Cross-domain communication only through the realtime bus, shared stores,
or explicit imports of a domain's public `index.ts`.

Planned domains (Phase 1 reserves the slots, implementation comes later):

- flash · radar · scan · trust · profile · referral · trust-network
- assistant · knowledge · creator · wallet · spaces · feed
- search · recommendations · realtime · offline · admin · analytics

Rules:
- No domain imports another domain's internals — only its `index.ts`.
- No domain talks to network/storage directly — go through `src/lib/platform/*`.
- All user-facing strings go through `src/lib/i18n`.
- All colors / spacing through design tokens in `src/styles.css`.
