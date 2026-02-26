using BookATrip.Api.Models;

namespace BookATrip.Api.Services;

public interface ITripGenerationService
{
    Task<Trip> GenerateTripAsync(GenerateTripRequest request);
}
