# Book-A-Trip Baseline Skeleton Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Stand up a working monorepo with a .NET 8 backend (Swagger, SQLite, hardcoded endpoints) and a React 18 frontend (styled-components, routing, API integration).

**Architecture:** Single .NET project with folder-based separation at `/backend/BookATrip.Api`. Vite+React app at `/frontend`. Frontend calls backend via Axios. CORS configured for local dev.

**Tech Stack:** .NET 8, EF Core + SQLite, Swashbuckle, React 18, Vite, TypeScript, styled-components, Axios, react-router-dom v6

**Design doc:** `docs/plans/2026-02-21-baseline-skeleton-design.md`

---

## Task 1: Scaffold .NET 8 Web API Project

**Files:**
- Create: `backend/BookATrip.Api/BookATrip.Api.csproj`
- Create: `backend/BookATrip.Api/Program.cs`
- Create: `backend/BookATrip.Api/appsettings.json`

**Step 1: Create the .NET project**

```bash
cd /Users/roeicohen/my-projects/claude/Book-A-Trip
mkdir -p backend
dotnet new webapi -n BookATrip.Api -o backend/BookATrip.Api --no-https --use-controllers
```

This scaffolds a Web API with controllers, HTTP only.

**Step 2: Remove boilerplate**

Delete the auto-generated `WeatherForecast.cs` and `Controllers/WeatherForecastController.cs`:

```bash
rm backend/BookATrip.Api/WeatherForecast.cs
rm backend/BookATrip.Api/Controllers/WeatherForecastController.cs
```

**Step 3: Add NuGet packages**

```bash
cd /Users/roeicohen/my-projects/claude/Book-A-Trip/backend/BookATrip.Api
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Swashbuckle.AspNetCore
```

**Step 4: Configure Program.cs**

Replace `backend/BookATrip.Api/Program.cs` with:

```csharp
using System.Text.Json;
using System.Text.Json.Serialization;
using BookATrip.Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors();
app.MapControllers();

app.Run();
```

**Step 5: Configure appsettings.json**

Replace `backend/BookATrip.Api/appsettings.json` with:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=bookATrip.db"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "Kestrel": {
    "Endpoints": {
      "Http": {
        "Url": "http://localhost:5000"
      }
    }
  }
}
```

**Step 6: Create empty folders**

```bash
mkdir -p backend/BookATrip.Api/Services
mkdir -p backend/BookATrip.Api/Models/Enums
mkdir -p backend/BookATrip.Api/Data/Entities
```

**Step 7: Verify it compiles (will fail — AppDbContext doesn't exist yet, that's expected)**

Don't run yet. Move to Task 2.

**Step 8: Commit**

```bash
git add backend/
git commit -m "feat(backend): scaffold .NET 8 Web API project with EF Core + SQLite config"
```

---

## Task 2: Backend Enums and Domain Models

**Files:**
- Create: `backend/BookATrip.Api/Models/Enums/AttractionCategory.cs`
- Create: `backend/BookATrip.Api/Models/Enums/BudgetLevel.cs`
- Create: `backend/BookATrip.Api/Models/Enums/TravelPace.cs`
- Create: `backend/BookATrip.Api/Models/Enums/FoodPreference.cs`
- Create: `backend/BookATrip.Api/Models/Enums/TransportType.cs`
- Create: `backend/BookATrip.Api/Models/Location.cs`
- Create: `backend/BookATrip.Api/Models/Attraction.cs`
- Create: `backend/BookATrip.Api/Models/TripDay.cs`
- Create: `backend/BookATrip.Api/Models/Trip.cs`

**Step 1: Create all enum files**

`backend/BookATrip.Api/Models/Enums/AttractionCategory.cs`:
```csharp
namespace BookATrip.Api.Models.Enums;

public enum AttractionCategory
{
    Nature,
    Museum,
    Food,
    Shopping,
    Hotel,
    Other
}
```

`backend/BookATrip.Api/Models/Enums/BudgetLevel.cs`:
```csharp
namespace BookATrip.Api.Models.Enums;

public enum BudgetLevel
{
    Minimal,
    Medium,
    Luxury,
    Elite
}
```

`backend/BookATrip.Api/Models/Enums/TravelPace.cs`:
```csharp
namespace BookATrip.Api.Models.Enums;

public enum TravelPace
{
    Light,
    Medium,
    Intensive
}
```

`backend/BookATrip.Api/Models/Enums/FoodPreference.cs`:
```csharp
namespace BookATrip.Api.Models.Enums;

public enum FoodPreference
{
    None,
    Kosher,
    Vegetarian,
    Vegan,
    Halal
}
```

`backend/BookATrip.Api/Models/Enums/TransportType.cs`:
```csharp
namespace BookATrip.Api.Models.Enums;

public enum TransportType
{
    CarRental,
    PublicTransport,
    Walking,
    Flight
}
```

**Step 2: Create domain model files**

`backend/BookATrip.Api/Models/Location.cs`:
```csharp
namespace BookATrip.Api.Models;

public class Location
{
    public double Lat { get; set; }
    public double Lng { get; set; }
    public string Address { get; set; } = string.Empty;
}
```

`backend/BookATrip.Api/Models/Attraction.cs`:
```csharp
using BookATrip.Api.Models.Enums;

namespace BookATrip.Api.Models;

public class Attraction
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Location Location { get; set; } = new();
    public int DurationInMinutes { get; set; }
    public AttractionCategory Category { get; set; }
}
```

`backend/BookATrip.Api/Models/TripDay.cs`:
```csharp
namespace BookATrip.Api.Models;

public class TripDay
{
    public int DayNumber { get; set; }
    public DateTime? Date { get; set; }
    public List<Attraction> Attractions { get; set; } = [];
    public string StartLocation { get; set; } = string.Empty;
}
```

`backend/BookATrip.Api/Models/Trip.cs`:
```csharp
using BookATrip.Api.Models.Enums;

namespace BookATrip.Api.Models;

public class Trip
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public List<TripDay> Days { get; set; } = [];
    public BudgetLevel Budget { get; set; }
    public TransportType Transport { get; set; }
    public TravelPace Pace { get; set; }
    public FoodPreference Food { get; set; }
    public List<AttractionCategory> PointsOfInterest { get; set; } = [];
    public int TravelersCount { get; set; }
    public string Note { get; set; } = string.Empty;
}
```

**Step 3: Commit**

```bash
git add backend/BookATrip.Api/Models/
git commit -m "feat(backend): add domain enums and POCO models"
```

---

## Task 3: Data Layer — AppDbContext, TestTable, Migration

**Files:**
- Create: `backend/BookATrip.Api/Data/Entities/TestTable.cs`
- Create: `backend/BookATrip.Api/Data/AppDbContext.cs`

**Step 1: Create TestTable entity**

`backend/BookATrip.Api/Data/Entities/TestTable.cs`:
```csharp
namespace BookATrip.Api.Data.Entities;

public class TestTable
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }
}
```

**Step 2: Create AppDbContext**

`backend/BookATrip.Api/Data/AppDbContext.cs`:
```csharp
using BookATrip.Api.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace BookATrip.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<TestTable> TestTables => Set<TestTable>();
}
```

**Step 3: Verify the project builds**

```bash
cd /Users/roeicohen/my-projects/claude/Book-A-Trip/backend/BookATrip.Api
dotnet build
```

Expected: `Build succeeded.`

**Step 4: Create initial EF migration**

```bash
cd /Users/roeicohen/my-projects/claude/Book-A-Trip/backend/BookATrip.Api
dotnet ef migrations add InitialCreate
```

Expected: Creates `Data/Migrations/` folder with migration files.

**Step 5: Apply the migration (creates bookATrip.db)**

```bash
dotnet ef database update
```

**Step 6: Add bookATrip.db to .gitignore**

Create `backend/BookATrip.Api/.gitignore`:
```
bookATrip.db
bookATrip.db-shm
bookATrip.db-wal
```

**Step 7: Commit**

```bash
git add backend/BookATrip.Api/Data/ backend/BookATrip.Api/.gitignore
git commit -m "feat(backend): add AppDbContext with TestTable and initial migration"
```

---

## Task 4: ItineraryController with Hardcoded Data

**Files:**
- Create: `backend/BookATrip.Api/Controllers/ItineraryController.cs`

**Step 1: Create the controller**

`backend/BookATrip.Api/Controllers/ItineraryController.cs`:
```csharp
using BookATrip.Api.Models;
using BookATrip.Api.Models.Enums;
using Microsoft.AspNetCore.Mvc;

namespace BookATrip.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ItineraryController : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll()
    {
        var summaries = new[]
        {
            new { Id = "trip-1", Title = "3 Days in Tel Aviv", Destination = "Tel Aviv, Israel" },
            new { Id = "trip-2", Title = "Weekend in Paris", Destination = "Paris, France" },
            new { Id = "trip-3", Title = "Tokyo Adventure", Destination = "Tokyo, Japan" }
        };

        return Ok(summaries);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(string id)
    {
        var trip = new Trip
        {
            Id = "trip-1",
            Title = "3 Days in Tel Aviv",
            Destination = "Tel Aviv, Israel",
            StartDate = new DateTime(2026, 4, 10),
            EndDate = new DateTime(2026, 4, 12),
            Budget = BudgetLevel.Medium,
            Transport = TransportType.PublicTransport,
            Pace = TravelPace.Medium,
            Food = FoodPreference.Kosher,
            PointsOfInterest = [AttractionCategory.Food, AttractionCategory.Museum, AttractionCategory.Nature],
            TravelersCount = 2,
            Note = "First trip to Israel!",
            Days =
            [
                new TripDay
                {
                    DayNumber = 1,
                    Date = new DateTime(2026, 4, 10),
                    StartLocation = "Ben Gurion Airport",
                    Attractions =
                    [
                        new Attraction
                        {
                            Id = "attr-1",
                            Name = "Carmel Market",
                            Description = "Vibrant open-air market with local food, spices, and street food.",
                            Location = new Location { Lat = 32.0654, Lng = 34.7688, Address = "HaCarmel St, Tel Aviv" },
                            DurationInMinutes = 90,
                            Category = AttractionCategory.Food
                        },
                        new Attraction
                        {
                            Id = "attr-2",
                            Name = "Tel Aviv Museum of Art",
                            Description = "World-class art museum featuring Israeli and international collections.",
                            Location = new Location { Lat = 32.0773, Lng = 34.7868, Address = "27 Shaul HaMelech Blvd, Tel Aviv" },
                            DurationInMinutes = 120,
                            Category = AttractionCategory.Museum
                        }
                    ]
                },
                new TripDay
                {
                    DayNumber = 2,
                    Date = new DateTime(2026, 4, 11),
                    StartLocation = "Hotel",
                    Attractions =
                    [
                        new Attraction
                        {
                            Id = "attr-3",
                            Name = "Jaffa Old City",
                            Description = "Ancient port city with winding alleys, galleries, and sea views.",
                            Location = new Location { Lat = 32.0515, Lng = 34.7513, Address = "Old Jaffa, Tel Aviv" },
                            DurationInMinutes = 180,
                            Category = AttractionCategory.Nature
                        }
                    ]
                }
            ]
        };

        return Ok(trip);
    }
}
```

**Step 2: Run the backend and verify Swagger**

```bash
cd /Users/roeicohen/my-projects/claude/Book-A-Trip/backend/BookATrip.Api
dotnet run
```

Open in browser: `http://localhost:5000/swagger`
Verify both endpoints appear. Test `GET /api/itinerary` — should return 3 trip summaries.
Test `GET /api/itinerary/trip-1` — should return full trip JSON with camelCase enums.

Stop the server (Ctrl+C).

**Step 3: Commit**

```bash
git add backend/BookATrip.Api/Controllers/
git commit -m "feat(backend): add ItineraryController with hardcoded trip data"
```

---

## Task 5: Update CLAUDE.md with Build Commands

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Update CLAUDE.md**

Replace the entire file with:

```markdown
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
```

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md with build commands and coding standards"
```

---

## Task 6: Scaffold React Frontend with Vite

**Files:**
- Create: `frontend/` (entire Vite scaffold)
- Modify: `frontend/vite.config.ts`
- Modify: `frontend/package.json`

**Step 1: Create Vite project**

```bash
cd /Users/roeicohen/my-projects/claude/Book-A-Trip
npm create vite@latest frontend -- --template react-ts
```

**Step 2: Install dependencies**

```bash
cd /Users/roeicohen/my-projects/claude/Book-A-Trip/frontend
npm install
npm install styled-components axios react-router-dom
npm install -D @types/styled-components
```

**Step 3: Configure Vite to use port 3000**

Replace `frontend/vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
})
```

**Step 4: Clean up Vite boilerplate**

Delete these files:
```bash
rm frontend/src/App.css
rm frontend/src/index.css
rm frontend/public/vite.svg
rm frontend/src/assets/react.svg
```

**Step 5: Create folder structure**

```bash
mkdir -p frontend/src/api
mkdir -p frontend/src/components
mkdir -p frontend/src/pages
mkdir -p frontend/src/types
mkdir -p frontend/src/styles
```

**Step 6: Commit**

```bash
git add frontend/
git commit -m "feat(frontend): scaffold Vite + React 18 + TypeScript project"
```

---

## Task 7: Frontend Types (Enums + Interfaces)

**Files:**
- Create: `frontend/src/types/enums.ts`
- Create: `frontend/src/types/models.ts`

**Step 1: Create enums**

`frontend/src/types/enums.ts`:
```typescript
export enum AttractionCategory {
  Nature = 'nature',
  Museum = 'museum',
  Food = 'food',
  Shopping = 'shopping',
  Hotel = 'hotel',
  Other = 'other',
}

export enum BudgetLevel {
  Minimal = 'minimal',
  Medium = 'medium',
  Luxury = 'luxury',
  Elite = 'elite',
}

export enum TravelPace {
  Light = 'light',
  Medium = 'medium',
  Intensive = 'intensive',
}

export enum FoodPreference {
  None = 'none',
  Kosher = 'kosher',
  Vegetarian = 'vegetarian',
  Vegan = 'vegan',
  Halal = 'halal',
}

export enum TransportType {
  CarRental = 'carRental',
  PublicTransport = 'publicTransport',
  Walking = 'walking',
  Flight = 'flight',
}
```

**Step 2: Create model interfaces**

`frontend/src/types/models.ts`:
```typescript
import {
  AttractionCategory,
  BudgetLevel,
  FoodPreference,
  TransportType,
  TravelPace,
} from './enums';

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface Attraction {
  id: string;
  name: string;
  description: string;
  location: Location;
  durationInMinutes: number;
  category: AttractionCategory;
}

export interface TripDay {
  dayNumber: number;
  date: string | null;
  attractions: Attraction[];
  startLocation: string;
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  days: TripDay[];
  budget: BudgetLevel;
  transport: TransportType;
  pace: TravelPace;
  food: FoodPreference;
  pointsOfInterest: AttractionCategory[];
  travelersCount: number;
  note: string;
}

export interface TripSummary {
  id: string;
  title: string;
  destination: string;
}
```

**Step 3: Commit**

```bash
git add frontend/src/types/
git commit -m "feat(frontend): add TypeScript enums and model interfaces"
```

---

## Task 8: Theme + Styled Atomic Components

**Files:**
- Create: `frontend/src/styles/theme.ts`
- Create: `frontend/src/components/Button.tsx`
- Create: `frontend/src/components/Input.tsx`
- Create: `frontend/src/components/Card.tsx`

**Step 1: Create theme**

`frontend/src/styles/theme.ts`:
```typescript
export const theme = {
  colors: {
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    secondary: '#64748b',
    secondaryHover: '#475569',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#1e293b',
    textLight: '#64748b',
    border: '#e2e8f0',
    error: '#ef4444',
  },
  fonts: {
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  borderRadius: '8px',
} as const;

export type Theme = typeof theme;
```

**Step 2: Create Button component**

`frontend/src/components/Button.tsx`:
```tsx
import styled from 'styled-components';
import { theme } from '../styles/theme';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
}

const StyledButton = styled.button<ButtonProps>`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: none;
  border-radius: ${theme.borderRadius};
  font-family: ${theme.fonts.body};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  background-color: ${({ variant }) =>
    variant === 'secondary' ? theme.colors.secondary : theme.colors.primary};
  color: ${theme.colors.surface};

  &:hover {
    background-color: ${({ variant }) =>
      variant === 'secondary' ? theme.colors.secondaryHover : theme.colors.primaryHover};
  }
`;

export const Button = ({ variant = 'primary', ...props }: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <StyledButton variant={variant} {...props} />
);
```

**Step 3: Create Input component**

`frontend/src/components/Input.tsx`:
```tsx
import styled from 'styled-components';
import { theme } from '../styles/theme';

interface InputProps {
  label?: string;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const Label = styled.label`
  font-family: ${theme.fonts.body};
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.text};
`;

const StyledInput = styled.input`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius};
  font-family: ${theme.fonts.body};
  font-size: 14px;
  color: ${theme.colors.text};
  outline: none;

  &:focus {
    border-color: ${theme.colors.primary};
  }
`;

export const Input = ({ label, ...props }: InputProps & React.InputHTMLAttributes<HTMLInputElement>) => (
  <Wrapper>
    {label && <Label>{label}</Label>}
    <StyledInput {...props} />
  </Wrapper>
);
```

**Step 4: Create Card component**

`frontend/src/components/Card.tsx`:
```tsx
import styled from 'styled-components';
import { theme } from '../styles/theme';

export const Card = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius};
  padding: ${theme.spacing.lg};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;
```

**Step 5: Commit**

```bash
git add frontend/src/styles/ frontend/src/components/
git commit -m "feat(frontend): add theme and atomic components (Button, Input, Card)"
```

---

## Task 9: API Client + Pages + Routing

**Files:**
- Create: `frontend/src/api/client.ts`
- Create: `frontend/src/pages/Home.tsx`
- Create: `frontend/src/pages/CreateTrip.tsx`
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/main.tsx`

**Step 1: Create Axios client**

`frontend/src/api/client.ts`:
```typescript
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
});
```

**Step 2: Create Home page**

`frontend/src/pages/Home.tsx`:
```tsx
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { apiClient } from '../api/client';
import { Card } from '../components/Card';
import { theme } from '../styles/theme';
import { TripSummary } from '../types/models';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};
`;

const Title = styled.h1`
  font-family: ${theme.fonts.body};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.lg};
`;

const TripList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const TripTitle = styled.h3`
  font-family: ${theme.fonts.body};
  color: ${theme.colors.text};
  margin: 0 0 ${theme.spacing.xs} 0;
`;

const TripDestination = styled.p`
  font-family: ${theme.fonts.body};
  color: ${theme.colors.textLight};
  margin: 0;
`;

export const Home = () => {
  const [trips, setTrips] = useState<TripSummary[]>([]);

  useEffect(() => {
    apiClient.get<TripSummary[]>('/itinerary').then((res) => {
      console.log('Fetched trips:', res.data);
      setTrips(res.data);
    });
  }, []);

  return (
    <Container>
      <Title>Book A Trip</Title>
      <TripList>
        {trips.map((trip) => (
          <Card key={trip.id}>
            <TripTitle>{trip.title}</TripTitle>
            <TripDestination>{trip.destination}</TripDestination>
          </Card>
        ))}
      </TripList>
    </Container>
  );
};
```

**Step 3: Create CreateTrip placeholder page**

`frontend/src/pages/CreateTrip.tsx`:
```tsx
import styled from 'styled-components';
import { theme } from '../styles/theme';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};
`;

const Title = styled.h1`
  font-family: ${theme.fonts.body};
  color: ${theme.colors.text};
`;

export const CreateTrip = () => {
  return (
    <Container>
      <Title>Create a New Trip</Title>
      <p>Form coming soon...</p>
    </Container>
  );
};
```

**Step 4: Update App.tsx with routing**

Replace `frontend/src/App.tsx`:
```tsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { CreateTrip } from './pages/CreateTrip';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateTrip />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

**Step 5: Update main.tsx (remove CSS import)**

Replace `frontend/src/main.tsx`:
```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

**Step 6: Commit**

```bash
git add frontend/src/
git commit -m "feat(frontend): add API client, Home/CreateTrip pages, and routing"
```

---

## Task 10: End-to-End Verification

**Step 1: Start the backend**

```bash
cd /Users/roeicohen/my-projects/claude/Book-A-Trip/backend/BookATrip.Api
dotnet run &
```

Wait for `Now listening on: http://localhost:5000`.

**Step 2: Verify backend API**

```bash
curl http://localhost:5000/api/itinerary
```

Expected: JSON array with 3 trip summaries.

```bash
curl http://localhost:5000/api/itinerary/trip-1
```

Expected: Full trip JSON with camelCase enum values (e.g., `"budget": "medium"`).

**Step 3: Start the frontend**

```bash
cd /Users/roeicohen/my-projects/claude/Book-A-Trip/frontend
npm run dev &
```

Wait for `Local: http://localhost:3000/`.

**Step 4: Verify frontend**

Open `http://localhost:3000` in browser. Should show:
- "Book A Trip" title
- 3 trip cards fetched from the API
- Browser console should log `Fetched trips: [...]`

**Step 5: Verify Swagger**

Open `http://localhost:5000/swagger` in browser. Both endpoints should be visible.

**Step 6: Stop servers and commit any remaining changes**

```bash
kill %1 %2  # stop background processes
git status
# If any uncommitted changes remain, commit them
```

---

## Summary

| Task | What | Commit message |
|------|------|----------------|
| 1 | .NET scaffold + config | `feat(backend): scaffold .NET 8 Web API project with EF Core + SQLite config` |
| 2 | Enums + domain models | `feat(backend): add domain enums and POCO models` |
| 3 | DbContext + migration | `feat(backend): add AppDbContext with TestTable and initial migration` |
| 4 | ItineraryController | `feat(backend): add ItineraryController with hardcoded trip data` |
| 5 | CLAUDE.md update | `docs: update CLAUDE.md with build commands and coding standards` |
| 6 | Vite scaffold | `feat(frontend): scaffold Vite + React 18 + TypeScript project` |
| 7 | TS types | `feat(frontend): add TypeScript enums and model interfaces` |
| 8 | Theme + components | `feat(frontend): add theme and atomic components (Button, Input, Card)` |
| 9 | API + pages + routing | `feat(frontend): add API client, Home/CreateTrip pages, and routing` |
| 10 | E2E verification | Manual verification, no commit |
