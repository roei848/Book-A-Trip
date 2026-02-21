# Book-A-Trip

An AI-powered trip booking and planning application built for educational purposes.

## Stack

**Backend:** .NET 8 Web API · C# 12 · EF Core · SQLite
**Frontend:** React 18 · Vite · TypeScript · styled-components · Axios

## Getting Started

### Backend

```bash
dotnet run --project backend/BookATrip.Api
```

Runs on http://localhost:5000 — Swagger UI at http://localhost:5000/swagger

### Frontend

```bash
cd frontend && npm run dev
```

Runs on http://localhost:3000

## Project Structure

```
Book-A-Trip/
├── backend/
│   └── BookATrip.Api/
│       ├── Controllers/     # HTTP endpoints
│       ├── Services/        # Business logic
│       ├── Models/          # Domain models & enums
│       └── Data/            # EF Core DbContext
└── frontend/
    └── src/
        ├── api/             # Axios API client
        ├── components/      # Atomic UI components
        ├── pages/           # Route-level pages
        ├── styles/          # Global styles & theme
        └── types/           # TypeScript interfaces & enums
```
