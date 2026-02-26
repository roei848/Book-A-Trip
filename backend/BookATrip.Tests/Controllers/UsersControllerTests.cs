using System.Net;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using BookATrip.Api.Data;
using BookATrip.Api.Models.Enums;
using BookATrip.Api.Services;

namespace BookATrip.Tests.Controllers;

public class UsersControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public UsersControllerTests(WebApplicationFactory<Program> factory)
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
                services.AddDbContext<AppDbContext>(o => o.UseInMemoryDatabase("UsersTests"));
            });
        });
    }

    [Fact]
    public async Task GetUsers_WithoutToken_Returns401()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/users");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetUsers_WithFreeRoleToken_Returns403()
    {
        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Secret"] = "test-jwt-secret-minimum-32-characters-long!!"
            })
            .Build();
        var token = new JwtService(config).GenerateToken(Guid.NewGuid(), "user@example.com", UserRole.Free);

        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await client.GetAsync("/api/users");
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }
}
