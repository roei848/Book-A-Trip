# Backend Code Structure

- Single project at `backend/BookATrip.Api/`
- Folder-based separation: `Controllers/`, `Services/`, `Models/`, `Data/`
- Controllers call Services only — no business logic in controllers
- Services handle business logic, Data layer handles EF Core access
