using BookATrip.Api.Models;
using BookATrip.Api.Models.Enums;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookATrip.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
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
