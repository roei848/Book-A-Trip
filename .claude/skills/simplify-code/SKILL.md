---
name: simplify-code
description: Use when Claude has just finished writing or modifying React components, pages, or C# services in Book-A-Trip — before reporting work as complete
---

# Simplify Code

## Overview

After writing or modifying any file in this project, run this checklist before reporting the work done. Fix every violation inline — do not note them as comments or leave them for later.

## When to Trigger

After writing or editing any of these:
- React component (`frontend/src/components/`)
- React page (`frontend/src/pages/`)
- API file (`frontend/src/api/`)
- C# controller, service, or model (`backend/`)

## Frontend Checklist

- [ ] `export const ComponentName` — **no `export default`**
- [ ] Only one styled component per file: the root `{ComponentName}Wrapper`
- [ ] Inner elements use `className` props — no additional named styled components
- [ ] No inline styles (`style={{}}`)
- [ ] Styled components defined at the **bottom** of the file
- [ ] All colors, spacing, fonts, borderRadius come from `theme` — **no hardcoded values**
- [ ] `import { theme } from '../styles/theme'` is present if styled-components are used
- [ ] No fetch or axios inside the component — API calls live in `frontend/src/api/` only
- [ ] Functional component only (no class syntax)

## Backend Checklist

- [ ] Primary constructors used (C# 12 style)
- [ ] Collection expressions used where applicable (`[]` not `new List<T>()`)
- [ ] No magic strings — use constants or enums
- [ ] File-scoped namespace (`namespace Foo;` not `namespace Foo { }`)
- [ ] PascalCase public members, camelCase private fields

## Common Violations

| Wrong | Correct |
|-------|---------|
| `export default SearchBar` | `export const SearchBar = ...` |
| `gap: 8px` | `gap: ${theme.spacing.sm}` |
| `color: '#0070f3'` | `color: ${theme.colors.primary}` |
| `const Title = styled.h1\`...\`` | `<h1 className="title">` inside wrapper |
| `import axios from 'axios'` in component | Import function from `../api/trips` |

## Rule

If any item is violated, fix it now. Do not move on until all boxes are checked.
