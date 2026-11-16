# Architecture Governance

Mandatory rules for every future feature, component, hook, state, and page.

## Dependency direction (lowest → highest)

```
shared → platform → features → domains → widgets → pages(routes)
```

Higher layers may import lower layers. Lower layers **must never** import higher layers.

| Layer               | Owns                                                                                                           | Forbidden                                                      |
| ------------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `shared/`           | generic primitives (Button, Card, Modal, Skeleton, utils, validators, generic types)                           | any business-specific code (WalletCard, RadarCard, TrustCard…) |
| `platform/`         | cross-app infra (AI, realtime, offline, pwa, analytics, trust infra, notifications, permissions, device, a11y) | UI screens, domain pages, business flows                       |
| `features/`         | reusable user flows (onboarding, search, settings, i18n, notifications)                                        | business domains, large pages                                  |
| `domains/<name>/`   | business: components, hooks, types, services, state, mocks                                                     | leaking domain code into shared/widgets/pages                  |
| `widgets/`          | composition of multiple domains                                                                                | owning state, services, business logic                         |
| `routes/` (= pages) | route entry points; layout + widget composition only                                                           | business logic, API calls, heavy state                         |

> **Routing note:** This project uses TanStack Start file-based routing under `src/routes/`. `src/routes/` IS the `pages/` layer in the governance doc — same rules apply.

## Stores & hooks

- Global stores: app state, theme, navigation, preferences, session, notifications only.
- Business state (wallet, trust, radar, referral) lives in `domains/<name>/`.
- Global hooks: `useTheme`, `useDevice`, `useNetwork`, `useOffline`, `useSafeArea`.
- Domain hooks: `domains/<name>/hooks/` (`useWallet`, `useRadar`…).

## Services

- Global `services/`: storage, cache, network, sync, mock-api.
- Domain services: `domains/<name>/services/` (`WalletService`, `TrustService`…).

## Types

- Generic → `shared/types/`.
- Business → `domains/<name>/types/`.

## Component creation decision tree

1. Generic? → `shared/`
2. Business-specific? → `domains/<name>/`
3. Assembles multiple domains? → `widgets/`
4. Route entry? → `routes/`

Always choose the most restrictive location.

## File size

- **Hard limit: 300 lines maximum per component file** (blank lines and comments excluded from the ESLint count).
- Aim for fewer than 200 lines whenever practical.
- A component approaching 300 lines must be split by responsibility before adding more UI or behavior.
- Do not bypass the limit by moving unrelated code into opaque helper files; extract cohesive components, hooks, or domain utilities with clear ownership.
- ESLint reports files over 300 lines as warnings during the progressive cleanup of existing oversized files. New components must never exceed 300 lines.

## Mock data

- Always under `domains/<name>/mocks/`. No scattered mock files.

## i18n & design tokens

- All user-facing strings via `useI18n` — no hardcoded strings.
- All visual values via tokens (`src/styles.css`, `src/lib/design/tokens`) — no hardcoded colors/spacing/typography.

## Final rule

Ask **"who owns this responsibility?"** — the owner determines the folder.
Never bypass architecture for convenience.
