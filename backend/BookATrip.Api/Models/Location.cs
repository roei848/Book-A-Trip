namespace BookATrip.Api.Models;

public class Location
{
    public double Lat { get; set; }
    public double Lng { get; set; }
    public string Address { get; set; } = string.Empty;
}
