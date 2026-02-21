# Rules Files Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create `.rules/be/` and `.rules/fe/` rules files and update CLAUDE.md to point to them instead of inline standards.

**Architecture:** Four markdown files under `.rules/`, each a concise bullet-point reference. CLAUDE.md's `Coding Standards` and `Architecture` sections are replaced with a single `Rules` section linking to these files.

**Tech Stack:** Markdown only — no code changes.

---

### Task 1: Create `.rules/be/codeStyle.md`

**Files:**
- Create: `.rules/be/codeStyle.md`

**Step 1: Create the file**

```markdown
# Backend Code Style

- C# 12 features: primary constructors, collection expressions
- PascalCase for public members, camelCase for private fields
- File-scoped namespaces
- JSON: camelCase properties, enums as camelCase strings
- No magic strings — use constants or enums
```

**Step 2: Commit**

```bash
git add .rules/be/codeStyle.md
git commit -m "docs: add backend code style rules"
```

---

### Task 2: Create `.rules/be/codeStructure.md`

**Files:**
- Create: `.rules/be/codeStructure.md`

**Step 1: Create the file**

```markdown
# Backend Code Structure

- Single project at `backend/BookATrip.Api/`
- Folder-based separation: `Controllers/`, `Services/`, `Models/`, `Data/`
- Controllers call Services only — no business logic in controllers
- Services handle business logic, Data layer handles EF Core access
```

**Step 2: Commit**

```bash
git add .rules/be/codeStructure.md
git commit -m "docs: add backend code structure rules"
```

---

### Task 3: Create `.rules/fe/codeStyle.md`

**Files:**
- Create: `.rules/fe/codeStyle.md`

**Step 1: Create the file**

```markdown
# Frontend Code Style

- Functional components only, no class components
- styled-components for all styling — no CSS files
- camelCase for variables/functions, PascalCase for components/types
- Axios for all API calls via the api client
- No inline styles
- Styled components defined at the bottom of the component file
- Only the root wrapper is a styled component, named `{ComponentName}Wrapper`
- Inner elements use `className` props, not additional styled components
```

**Step 2: Commit**

```bash
git add .rules/fe/codeStyle.md
git commit -m "docs: add frontend code style rules"
```

---

### Task 4: Create `.rules/fe/codeStructure.md`

**Files:**
- Create: `.rules/fe/codeStructure.md`

**Step 1: Create the file**

```markdown
# Frontend Code Structure

- Atomic component structure: `components/`, `pages/`, `api/`, `types/`, `styles/`
- Pages compose components, components are reusable and stateless where possible
- API calls live in `api/` only — no fetch/axios calls inside components or pages
- Each API domain gets its own file in `api/` (e.g., `api/trips.ts`, `api/users.ts`)
- Shared types in `types/`
```

**Step 2: Commit**

```bash
git add .rules/fe/codeStructure.md
git commit -m "docs: add frontend code structure rules"
```

---

### Task 5: Update `CLAUDE.md`

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Replace `Coding Standards` and `Architecture` sections**

Remove these sections entirely:

```
## Coding Standards
...
## Architecture
...
```

Replace with:

```markdown
## Rules

- Backend: see [`.rules/be/codeStyle.md`](.rules/be/codeStyle.md) and [`.rules/be/codeStructure.md`](.rules/be/codeStructure.md)
- Frontend: see [`.rules/fe/codeStyle.md`](.rules/fe/codeStyle.md) and [`.rules/fe/codeStructure.md`](.rules/fe/codeStructure.md)
```

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md to reference rules files"
```

---

### Task 6: Push to origin

**Step 1: Push all commits**

```bash
git push origin master
```
