using System.Net;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using BookATrip.Api.Data;

namespace BookATrip.Tests.Controllers;

public class ItineraryControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public ItineraryControllerTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureAppConfiguration((_, config) =>
            {
                config.AddInMemoryCollection(new Dictionary<string, string?>
                {
                    ["Google:ClientId"] = "test-client-id",
                    ["Google:ClientSecret"] = "test-client-secret",
                    ["Jwt:Secret"] = "test-jwt-secret-minimum-32-characters-long!!",
                    ["Encryption:Key"] = Convert.ToBase64String(new byte[32]),
                });
            });
            builder.ConfigureServices(services =>
            {
                var descriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));
                if (descriptor != null) services.Remove(descriptor);
                services.AddDbContext<AppDbContext>(o => o.UseInMemoryDatabase("ItineraryTests"));
            });
        });
    }

    [Fact]
    public async Task GetAll_WithoutToken_Returns401()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/itinerary");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}
