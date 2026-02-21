# Rules Files Design

**Date:** 2026-02-21
**Topic:** CLAUDE.md update + BE/FE rules files

## Goal

Replace inline coding standards in CLAUDE.md with dedicated rules files, making CLAUDE.md a navigation hub and each rules file a single source of truth for its topic.

## File Structure

```
.rules/
  be/
    codeStyle.md
    codeStructure.md
  fe/
    codeStyle.md
    codeStructure.md
```

## CLAUDE.md Change

Remove `Coding Standards` and `Architecture` sections. Replace with:

```md
## Rules

- Backend: see `.rules/be/codeStyle.md` and `.rules/be/codeStructure.md`
- Frontend: see `.rules/fe/codeStyle.md` and `.rules/fe/codeStructure.md`
```

## Rules File Content

### `.rules/be/codeStyle.md`
- C# 12 features: primary constructors, collection expressions
- PascalCase for public members, camelCase for private fields
- File-scoped namespaces
- JSON: camelCase properties, enums as camelCase strings
- No magic strings — use constants or enums

### `.rules/be/codeStructure.md`
- Single project at `backend/BookATrip.Api/`
- Folder-based separation: `Controllers/`, `Services/`, `Models/`, `Data/`
- Controllers call Services only — no business logic in controllers
- Services handle business logic, Data layer handles EF Core access

### `.rules/fe/codeStyle.md`
- Functional components only, no class components
- styled-components for all styling — no CSS files
- camelCase for variables/functions, PascalCase for components/types
- Axios for all API calls via the api client
- No inline styles
- Styled components defined at the bottom of the component file
- Only the root wrapper is a styled component, named `{ComponentName}Wrapper`
- Inner elements use `className` props, not additional styled components

### `.rules/fe/codeStructure.md`
- Atomic component structure: `components/`, `pages/`, `api/`, `types/`, `styles/`
- Pages compose components, components are reusable and stateless where possible
- API calls live in `api/` only — no fetch/axios calls inside components or pages
- Each API domain gets its own file in `api/` (e.g., `api/trips.ts`, `api/users.ts`)
- Shared types in `types/`
