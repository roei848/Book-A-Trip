using BookATrip.Api.Data;
using BookATrip.Api.Models;
using BookATrip.Api.Models.Enums;
using BookATrip.Api.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BookATrip.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(
    AppDbContext db,
    IEncryptionService encryption,
    IJwtService jwt,
    IConfiguration configuration) : ControllerBase
{
    [HttpGet("login")]
    public IActionResult Login()
    {
        var properties = new AuthenticationProperties { RedirectUri = "/api/auth/callback" };
        return Challenge(properties, GoogleDefaults.AuthenticationScheme);
    }

    [HttpGet("callback")]
    public async Task<IActionResult> Callback()
    {
        var result = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        if (!result.Succeeded)
            return Redirect("http://localhost:3000/login?error=auth_failed");

        var principal = result.Principal;
        var googleId = principal?.FindFirstValue(ClaimTypes.NameIdentifier);
        if (googleId is null || principal is null)
            return Redirect("http://localhost:3000/login?error=auth_failed");

        var email = principal.FindFirstValue(ClaimTypes.Email) ?? string.Empty;
        var name = principal.FindFirstValue(ClaimTypes.Name) ?? string.Empty;

        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

        var user = await db.Users.FirstOrDefaultAsync(u => u.GoogleId == googleId);

        if (user is null)
        {
            var adminEmails = configuration.GetSection("Auth:AdminEmails").Get<string[]>() ?? [];
            var role = adminEmails.Contains(email, StringComparer.OrdinalIgnoreCase)
                ? UserRole.Admin
                : UserRole.Free;

            user = new User
            {
                Id = Guid.NewGuid(),
                GoogleId = googleId,
                EmailEncrypted = encryption.Encrypt(email),
                NameEncrypted = encryption.Encrypt(name),
                Role = role,
                CreatedAt = DateTime.UtcNow,
            };
            db.Users.Add(user);
            await db.SaveChangesAsync();
        }

        var token = jwt.GenerateToken(user.Id, email, user.Role);
        return Redirect($"http://localhost:3000/auth/callback?token={token}");
    }
}
