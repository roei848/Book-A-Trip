# Frontend Code Structure

- Atomic component structure: `components/`, `pages/`, `api/`, `types/`, `styles/`
- Pages compose components, components are reusable and stateless where possible
- API calls live in `api/` only — no fetch/axios calls inside components or pages
- Each API domain gets its own file in `api/` (e.g., `api/trips.ts`, `api/users.ts`)
- Shared types in `types/`
