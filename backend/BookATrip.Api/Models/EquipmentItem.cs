namespace BookATrip.Api.Models;

public class EquipmentItem
{
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public int Quantity { get; set; } = 1;
    public bool IsEssential { get; set; }
}
