using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BookATrip.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddTrips : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Trips",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    Title = table.Column<string>(type: "TEXT", nullable: false),
                    Destination = table.Column<string>(type: "TEXT", nullable: false),
                    StartDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    EndDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Budget = table.Column<string>(type: "TEXT", nullable: false),
                    Transport = table.Column<string>(type: "TEXT", nullable: false),
                    Pace = table.Column<string>(type: "TEXT", nullable: false),
                    Food = table.Column<string>(type: "TEXT", nullable: false),
                    PointsOfInterest = table.Column<string>(type: "TEXT", nullable: false),
                    TravelersCount = table.Column<int>(type: "INTEGER", nullable: false),
                    Note = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Trips", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TripDay",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    TripId = table.Column<string>(type: "TEXT", nullable: false),
                    DayNumber = table.Column<int>(type: "INTEGER", nullable: false),
                    Date = table.Column<DateTime>(type: "TEXT", nullable: true),
                    StartLocation = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TripDay", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TripDay_Trips_TripId",
                        column: x => x.TripId,
                        principalTable: "Trips",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Attraction",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    TripDayId = table.Column<int>(type: "INTEGER", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    Location_Lat = table.Column<double>(type: "REAL", nullable: false),
                    Location_Lng = table.Column<double>(type: "REAL", nullable: false),
                    Location_Address = table.Column<string>(type: "TEXT", nullable: false),
                    DurationInMinutes = table.Column<int>(type: "INTEGER", nullable: false),
                    Category = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Attraction", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Attraction_TripDay_TripDayId",
                        column: x => x.TripDayId,
                        principalTable: "TripDay",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Trips",
                columns: new[] { "Id", "Budget", "Destination", "EndDate", "Food", "Note", "Pace", "PointsOfInterest", "StartDate", "Title", "Transport", "TravelersCount" },
                values: new object[] { "trip-1", "Medium", "Tel Aviv, Israel", new DateTime(2026, 4, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), "Kosher", "First trip to Israel!", "Medium", "[2,1,0]", new DateTime(2026, 4, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "3 Days in Tel Aviv", "PublicTransport", 2 });

            migrationBuilder.InsertData(
                table: "TripDay",
                columns: new[] { "Id", "Date", "DayNumber", "StartLocation", "TripId" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 4, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, "Ben Gurion Airport", "trip-1" },
                    { 2, new DateTime(2026, 4, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), 2, "Hotel", "trip-1" }
                });

            migrationBuilder.InsertData(
                table: "Attraction",
                columns: new[] { "Id", "Category", "Description", "DurationInMinutes", "Name", "TripDayId", "Location_Address", "Location_Lat", "Location_Lng" },
                values: new object[,]
                {
                    { "attr-1", "Food", "Vibrant open-air market with local food, spices, and street food.", 90, "Carmel Market", 1, "HaCarmel St, Tel Aviv", 32.065399999999997, 34.768799999999999 },
                    { "attr-2", "Museum", "World-class art museum featuring Israeli and international collections.", 120, "Tel Aviv Museum of Art", 1, "27 Shaul HaMelech Blvd, Tel Aviv", 32.077300000000001, 34.786799999999999 },
                    { "attr-3", "Nature", "Ancient port city with winding alleys, galleries, and sea views.", 180, "Jaffa Old City", 2, "Old Jaffa, Tel Aviv", 32.051499999999997, 34.751300000000001 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Attraction_TripDayId",
                table: "Attraction",
                column: "TripDayId");

            migrationBuilder.CreateIndex(
                name: "IX_TripDay_TripId",
                table: "TripDay",
                column: "TripId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Attraction");

            migrationBuilder.DropTable(
                name: "TripDay");

            migrationBuilder.DropTable(
                name: "Trips");
        }
    }
}
