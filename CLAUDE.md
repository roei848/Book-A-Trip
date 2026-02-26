# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Book-A-Trip** — an AI-powered trip booking/planning application for educational purposes.

## Build & Run

### Backend (.NET 8 Web API)
```bash
dotnet run --project backend/BookATrip.Api
```
Runs on http://localhost:5000. Swagger UI at http://localhost:5000/swagger.

### Frontend (React 18 + Vite)
```bash
cd frontend && npm run dev
```
Runs on http://localhost:3000.

## Git Workflow

**Every task must be done on a new branch.** Before starting any work, create a branch named after the task (e.g., `feature/add-trip-card`, `fix/booking-form-validation`). Never commit or push directly to `master` — always open a PR.

## Rules

- Backend: see [`.rules/be/codeStyle.md`](.rules/be/codeStyle.md) and [`.rules/be/codeStructure.md`](.rules/be/codeStructure.md)
- Frontend: see [`.rules/fe/codeStyle.md`](.rules/fe/codeStyle.md) and [`.rules/fe/codeStructure.md`](.rules/fe/codeStructure.md)

## Agents

### `react-component-builder`
Use when creating any new React component or page. It enforces all code style rules, checks existing types/API files, reads the theme, and runs the `simplify-code` skill before finishing.

**Trigger:** user asks to create/add/build a component, page, or UI element.

### `api-docs-explorer`
Use when the user provides an API documentation URL. Reads the skill from `~/.claude/skills/api-explorer/`, explores the API (OpenAPI, WSDL, or HTML), and writes findings to `docs/api-exploration/<api-name>.md`. Returns a compact summary — never raw docs.

**Trigger:** user pastes a documentation URL or says "explore this API / here are the docs".

## Skills

### `simplify-code`
Run after writing or modifying any frontend component, page, API file, or backend C# file — before reporting work as complete. Checks a checklist of style rules and fixes violations inline.

**Trigger:** always, automatically after finishing any file write/edit in this project.
