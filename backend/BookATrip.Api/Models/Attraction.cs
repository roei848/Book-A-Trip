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
