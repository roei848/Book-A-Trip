# Book-A-Trip

An AI-powered trip booking and planning application built for educational purposes.

## Stack

**Backend:** .NET 8 Web API · C# 12 · EF Core · SQLite
**Frontend:** React 18 · Vite · TypeScript · styled-components · Axios

## Getting Started

### 1. Setup config files

Run once after cloning — copies both example config files into place:

```bash
./setup.sh
```

### 2. Run the backend

```bash
dotnet run --project backend/BookATrip.Api
```

Runs on http://localhost:5000 — Swagger UI at http://localhost:5000/swagger

### 3. Run the frontend

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
