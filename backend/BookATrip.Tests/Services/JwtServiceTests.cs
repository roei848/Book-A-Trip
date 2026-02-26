using System.IdentityModel.Tokens.Jwt;
using BookATrip.Api.Constants;
using BookATrip.Api.Models.Enums;
using BookATrip.Api.Services;
using Microsoft.Extensions.Configuration;

namespace BookATrip.Tests.Services;

public class JwtServiceTests
{
    private readonly IJwtService _sut;

    public JwtServiceTests()
    {
        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Secret"] = "test-jwt-secret-minimum-32-characters-long!!"
            })
            .Build();
        _sut = new JwtService(config);
    }

    [Fact]
    public void GenerateToken_ReturnsReadableJwt()
    {
        var token = _sut.GenerateToken(Guid.NewGuid(), "test@example.com", UserRole.Free);
        Assert.True(new JwtSecurityTokenHandler().CanReadToken(token));
    }

    [Fact]
    public void GenerateToken_ContainsCorrectClaims()
    {
        var userId = Guid.NewGuid();
        var email = "test@example.com";
        var role = UserRole.Admin;

        var token = _sut.GenerateToken(userId, email, role);
        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);

        Assert.Equal(userId.ToString(), jwt.Subject);
        Assert.Equal(email, jwt.Claims.First(c => c.Type == JwtRegisteredClaimNames.Email).Value);
        Assert.Equal("Admin", jwt.Claims.First(c => c.Type == ClaimNames.Role).Value);
    }

    [Fact]
    public void GenerateToken_ExpiresInSevenDays()
    {
        var token = _sut.GenerateToken(Guid.NewGuid(), "test@example.com", UserRole.Free);
        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);

        Assert.True(jwt.ValidTo > DateTime.UtcNow.AddDays(6));
        Assert.True(jwt.ValidTo < DateTime.UtcNow.AddDays(8));
    }
}
