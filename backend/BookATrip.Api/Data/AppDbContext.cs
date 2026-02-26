using System.Text.Json;
using BookATrip.Api.Data.Entities;
using BookATrip.Api.Models;
using BookATrip.Api.Models.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace BookATrip.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<TestTable> TestTables => Set<TestTable>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Trip> Trips => Set<Trip>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(u => u.GoogleId)
            .IsUnique();

        var attractionCategoryListConverter = new ValueConverter<List<AttractionCategory>, string>(
            v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
            v => JsonSerializer.Deserialize<List<AttractionCategory>>(v, (JsonSerializerOptions?)null) ?? new List<AttractionCategory>()
        );

        var attractionCategoryListComparer = new ValueComparer<List<AttractionCategory>>(
            (a, b) => a != null && b != null && a.SequenceEqual(b),
            v => v.Aggregate(0, (h, e) => HashCode.Combine(h, e.GetHashCode())),
            v => v.ToList()
        );

        modelBuilder.Entity<Trip>(trip =>
        {
            trip.HasKey(t => t.Id);
            trip.Property(t => t.Budget).HasConversion<string>();
            trip.Property(t => t.Transport).HasConversion<string>();
            trip.Property(t => t.Pace).HasConversion<string>();
            trip.Property(t => t.Food).HasConversion<string>();
            trip.Property(t => t.PointsOfInterest)
                .HasConversion(attractionCategoryListConverter, attractionCategoryListComparer)
                .HasColumnType("TEXT");
            trip.HasMany(t => t.Days)
                .WithOne()
                .HasForeignKey(d => d.TripId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<TripDay>(day =>
        {
            day.HasKey(d => d.Id);
            day.HasMany(d => d.Attractions)
                .WithOne()
                .HasForeignKey(a => a.TripDayId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Attraction>(attr =>
        {
            attr.HasKey(a => a.Id);
            attr.Property(a => a.Category).HasConversion<string>();
            attr.OwnsOne(a => a.Location, loc =>
            {
                loc.Property(l => l.Lat).HasColumnName("Location_Lat");
                loc.Property(l => l.Lng).HasColumnName("Location_Lng");
                loc.Property(l => l.Address).HasColumnName("Location_Address");
            });
        });

        modelBuilder.Entity<Trip>().HasData(new Trip
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
            Note = "First trip to Israel!"
        });

        modelBuilder.Entity<TripDay>().HasData(
            new TripDay { Id = 1, TripId = "trip-1", DayNumber = 1, Date = new DateTime(2026, 4, 10), StartLocation = "Ben Gurion Airport" },
            new TripDay { Id = 2, TripId = "trip-1", DayNumber = 2, Date = new DateTime(2026, 4, 11), StartLocation = "Hotel" }
        );

        modelBuilder.Entity<Attraction>().HasData(
            new
            {
                Id = "attr-1",
                TripDayId = 1,
                Name = "Carmel Market",
                Description = "Vibrant open-air market with local food, spices, and street food.",
                DurationInMinutes = 90,
                Category = AttractionCategory.Food
            },
            new
            {
                Id = "attr-2",
                TripDayId = 1,
                Name = "Tel Aviv Museum of Art",
                Description = "World-class art museum featuring Israeli and international collections.",
                DurationInMinutes = 120,
                Category = AttractionCategory.Museum
            },
            new
            {
                Id = "attr-3",
                TripDayId = 2,
                Name = "Jaffa Old City",
                Description = "Ancient port city with winding alleys, galleries, and sea views.",
                DurationInMinutes = 180,
                Category = AttractionCategory.Nature
            }
        );

        modelBuilder.Entity<Attraction>().OwnsOne(a => a.Location).HasData(
            new { AttractionId = "attr-1", Lat = 32.0654, Lng = 34.7688, Address = "HaCarmel St, Tel Aviv" },
            new { AttractionId = "attr-2", Lat = 32.0773, Lng = 34.7868, Address = "27 Shaul HaMelech Blvd, Tel Aviv" },
            new { AttractionId = "attr-3", Lat = 32.0515, Lng = 34.7513, Address = "Old Jaffa, Tel Aviv" }
        );
    }
}
