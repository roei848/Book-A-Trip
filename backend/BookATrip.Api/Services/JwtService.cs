using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BookATrip.Api.Constants;
using BookATrip.Api.Models.Enums;
using Microsoft.IdentityModel.Tokens;

namespace BookATrip.Api.Services;

public interface IJwtService
{
    string GenerateToken(Guid userId, string email, UserRole role);
}

public class JwtService(IConfiguration configuration) : IJwtService
{
    private static readonly JwtSecurityTokenHandler TokenHandler = new();

    public string GenerateToken(Guid userId, string email, UserRole role)
    {
        var secret = configuration["Jwt:Secret"]
            ?? throw new InvalidOperationException("Jwt:Secret is not configured");

        var keyBytes = Encoding.UTF8.GetBytes(secret);
        if (keyBytes.Length < 32)
            throw new InvalidOperationException("Jwt:Secret must be at least 32 bytes when UTF-8 encoded.");

        var key = new SymmetricSecurityKey(keyBytes);
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, email),
            new Claim(ClaimNames.Role, role.ToString()),
        };

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: credentials);

        return TokenHandler.WriteToken(token);
    }
}
