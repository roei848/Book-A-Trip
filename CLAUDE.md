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

## Rules

- Backend: see [`.rules/be/codeStyle.md`](.rules/be/codeStyle.md) and [`.rules/be/codeStructure.md`](.rules/be/codeStructure.md)
- Frontend: see [`.rules/fe/codeStyle.md`](.rules/fe/codeStyle.md) and [`.rules/fe/codeStructure.md`](.rules/fe/codeStructure.md)
