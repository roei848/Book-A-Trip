using BookATrip.Api.Data;
using BookATrip.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BookATrip.Api.Services;

public interface ITripService
{
    Task<List<TripSummary>> GetAllSummariesAsync();
    Task<Trip?> GetByIdAsync(string id);
}

public record TripSummary(string Id, string Title, string Destination);

public class TripService(AppDbContext db) : ITripService
{
    public async Task<List<TripSummary>> GetAllSummariesAsync() =>
        await db.Trips
            .Select(t => new TripSummary(t.Id, t.Title, t.Destination))
            .ToListAsync();

    public async Task<Trip?> GetByIdAsync(string id) =>
        await db.Trips
            .Include(t => t.Days)
                .ThenInclude(d => d.Attractions)
            .FirstOrDefaultAsync(t => t.Id == id);
}
