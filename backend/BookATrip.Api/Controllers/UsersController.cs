using BookATrip.Api.Data;
using BookATrip.Api.Models.Enums;
using BookATrip.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookATrip.Api.Controllers;

[ApiController]
[Route("api/users")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin")]
public class UsersController(AppDbContext db, IEncryptionService encryption) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await db.Users.ToListAsync();
        var result = users.Select(u => new
        {
            u.Id,
            Email = encryption.Decrypt(u.EmailEncrypted),
            Name = encryption.Decrypt(u.NameEncrypted),
            Role = u.Role.ToString(),
            u.CreatedAt,
        });
        return Ok(result);
    }

    [HttpPatch("{id}/role")]
    public async Task<IActionResult> UpdateRole(Guid id, [FromBody] UpdateRoleRequest request)
    {
        if (request.Role == UserRole.Admin)
            return Forbid();

        var user = await db.Users.FindAsync(id);
        if (user is null) return NotFound();
        if (user.Role == UserRole.Admin) return Forbid();

        user.Role = request.Role;
        await db.SaveChangesAsync();
        return NoContent();
    }
}

public record UpdateRoleRequest(UserRole Role);
