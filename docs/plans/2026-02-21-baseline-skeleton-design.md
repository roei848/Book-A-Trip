# Book-A-Trip Baseline Skeleton Design

**Date:** 2026-02-21
**Status:** Approved

## Overview

Initialize a monorepo skeleton for Book-A-Trip, an educational trip planning app. The goal is a simple, working version with a .NET 8 backend and a React 18 frontend.

## Decisions

- **Backend structure:** Single project, folder-based separation (Controllers/Services/Models/Data)
- **Database:** SQLite via EF Core, only `TestTable` entity mapped. Domain models are plain POCOs.
- **JSON serialization:** camelCase properties, enums as camelCase strings
- **Backend port:** http://localhost:5000 (HTTP only)
- **Frontend port:** http://localhost:3000
- **Theme:** Neutral defaults (grays + blue accent), to be restyled later

## Monorepo Structure

```
Book-A-Trip/
├── backend/
│   └── BookATrip.Api/
│       ├── Controllers/
│       │   └── ItineraryController.cs
│       ├── Services/                    (empty for now)
│       ├── Models/
│       │   ├── Enums/
│       │   │   ├── AttractionCategory.cs
│       │   │   ├── BudgetLevel.cs
│       │   │   ├── TravelPace.cs
│       │   │   ├── FoodPreference.cs
│       │   │   └── TransportType.cs
│       │   ├── Location.cs
│       │   ├── Attraction.cs
│       │   ├── TripDay.cs
│       │   └── Trip.cs
│       ├── Data/
│       │   ├── AppDbContext.cs
│       │   ├── Entities/
│       │   │   └── TestTable.cs
│       │   └── Migrations/
│       ├── Program.cs
│       ├── appsettings.json
│       └── BookATrip.Api.csproj
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.ts
│   │   ├── components/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Card.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   └── CreateTrip.tsx
│   │   ├── types/
│   │   │   ├── enums.ts
│   │   │   └── models.ts
│   │   ├── styles/
│   │   │   └── theme.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── CLAUDE.md
└── README.md
```

## Backend Design

### Tech Stack
- .NET 8 Web API
- Entity Framework Core with SQLite
- Swagger (Swashbuckle)

### Configuration
- SQLite database file: `bookATrip.db`
- CORS allows `http://localhost:3000`
- JSON: camelCase properties, enums serialized as camelCase strings via `JsonStringEnumConverter`

### Enums
- `AttractionCategory`: Nature, Museum, Food, Shopping, Hotel, Other
- `BudgetLevel`: Minimal, Medium, Luxury, Elite
- `TravelPace`: Light, Medium, Intensive
- `FoodPreference`: None, Kosher, Vegetarian, Vegan, Halal
- `TransportType`: CarRental, PublicTransport, Walking, Flight

### Domain Models (POCOs, not in DbContext)

**Location:** Lat (double), Lng (double), Address (string)

**Attraction:** Id, Name, Description, Location, DurationInMinutes, Category

**TripDay:** DayNumber, Date (nullable), Attractions (list), StartLocation

**Trip:** Id, Title, Destination, StartDate, EndDate, Days (list), Budget, Transport, Pace, Food, PointsOfInterest (list of categories), TravelersCount, Note

### Data Layer
- `AppDbContext` with `TestTable` entity only (Id: GUID, CreatedAt: DateTime)
- One initial EF migration

### Endpoints
- `GET /api/itinerary` — returns static list of trip summaries
- `GET /api/itinerary/{id}` — returns hardcoded full Trip object with sample data

## Frontend Design

### Tech Stack
- React 18 + Vite + TypeScript
- styled-components for styling
- Axios for API calls
- react-router-dom v6 for routing

### Theme
Neutral defaults: grays, single blue accent color. Includes colors, fonts, spacing tokens.

### Atomic Components
- `Button` — primary/secondary variants via props
- `Input` — text input with label support
- `Card` — container with shadow, padding, border-radius

### API Client
Axios instance with `baseURL: "http://localhost:5000/api"`

### Routes
- `/` — Home page: fetches trips, displays in Cards
- `/create` — CreateTrip page: placeholder with title and empty form

### TypeScript Types
Enums and interfaces mirroring the backend models exactly.

## Definition of Done
- Monorepo structure established
- Backend runs and shows Swagger UI at http://localhost:5000/swagger
- Frontend runs at http://localhost:3000 and displays "Book A Trip" title
- Frontend successfully fetches and logs hardcoded trip data from the API
