using System.Net;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using BookATrip.Api.Data;

namespace BookATrip.Tests.Controllers;

public class AuthControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public AuthControllerTests(WebApplicationFactory<Program> factory)
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
                    ["ConnectionStrings:DefaultConnection"] = "DataSource=:memory:",
                });
            });
            builder.ConfigureServices(services =>
            {
                var descriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));
                if (descriptor != null) services.Remove(descriptor);
                services.AddDbContext<AppDbContext>(o => o.UseInMemoryDatabase("AuthTests"));
            });
        });
    }

    [Fact]
    public async Task Login_RedirectsToGoogle()
    {
        var client = _factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });

        var response = await client.GetAsync("/api/auth/login");

        Assert.Equal(HttpStatusCode.Redirect, response.StatusCode);
        Assert.Contains("accounts.google.com", response.Headers.Location?.ToString());
    }
}
