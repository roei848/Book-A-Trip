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

## Coding Standards

### Backend (C#)
- C# 12 features (primary constructors, collection expressions)
- PascalCase for public members
- File-scoped namespaces
- JSON: camelCase properties, enums as camelCase strings

### Frontend (TypeScript/React)
- Functional components only
- styled-components for all styling (no CSS files)
- camelCase for variables/functions, PascalCase for components/types
- Axios for API calls

## Architecture

- **Backend:** Single .NET project at `backend/BookATrip.Api/` with folder-based separation (Controllers, Services, Models, Data)
- **Frontend:** Vite + React app at `frontend/` with atomic components
- **Database:** SQLite via EF Core (dev), only `TestTable` entity currently mapped
