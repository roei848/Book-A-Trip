using BookATrip.Api.Models.Enums;

namespace BookATrip.Api.Models;

public class User
{
    public Guid Id { get; set; }
    public string EmailEncrypted { get; set; } = string.Empty;
    public string NameEncrypted { get; set; } = string.Empty;
    public string GoogleId { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public DateTime CreatedAt { get; set; }
}
