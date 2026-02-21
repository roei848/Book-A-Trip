namespace BookATrip.Api.Models;

public class TripDay
{
    public int DayNumber { get; set; }
    public DateTime? Date { get; set; }
    public List<Attraction> Attractions { get; set; } = [];
    public string StartLocation { get; set; } = string.Empty;
}
