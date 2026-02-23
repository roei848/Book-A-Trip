# Frontend Code Structure

- Atomic component structure: `components/`, `pages/`, `api/`, `types/`, `styles/`
- Pages compose components, components are reusable and stateless where possible
- API calls live in `api/` only — no fetch/axios calls inside components or pages
- Each API domain gets its own file in `api/` (e.g., `api/trips.ts`, `api/users.ts`)
- Shared types in `types/`

## Component Organization

Components are organized by feature domain. Each feature gets its own subfolder under `components/`:

```
components/
  sharedComponents/   # Generic, reusable UI primitives (Button, Card, Input)
  trips/              # Components specific to the trips feature
  bookings/           # Components specific to the bookings feature
  ...
```

- Group components by the feature they belong to, not by type
- Cross-feature reusable UI primitives belong in `sharedComponents/`
- Only move a component to `sharedComponents/` when it is genuinely used across multiple features.

## Shared Components

Always use these existing components instead of raw HTML elements:

- **`Button`** (`components/sharedComponents/Button.tsx`) — use for all buttons; supports `variant="primary"` (default) and `variant="secondary"`
- **`Card`** (`components/sharedComponents/Card.tsx`) — use for all card/panel containers
- **`Input`** (`components/sharedComponents/Input.tsx`) — use for all text inputs; supports an optional `label` prop
