using BookATrip.Api.Models.Enums;

namespace BookATrip.Api.Models;

public class GenerateTripRequest
{
    public string Destination { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public BudgetLevel Budget { get; set; }
    public TransportType Transport { get; set; }
    public TravelPace Pace { get; set; }
    public FoodPreference Food { get; set; }
    public List<AttractionCategory> PointsOfInterest { get; set; } = [];
    public int TravelersCount { get; set; }
    public string Note { get; set; } = string.Empty;
}
