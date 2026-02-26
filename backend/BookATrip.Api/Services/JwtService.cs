using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BookATrip.Api.Models.Enums;
using Microsoft.IdentityModel.Tokens;

namespace BookATrip.Api.Services;

public interface IJwtService
{
    string GenerateToken(Guid userId, string email, UserRole role);
}

public class JwtService(IConfiguration configuration) : IJwtService
{
    public string GenerateToken(Guid userId, string email, UserRole role)
    {
        var secret = configuration["Jwt:Secret"]
            ?? throw new InvalidOperationException("Jwt:Secret is not configured");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, email),
            new Claim("role", role.ToString()),
        };

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
