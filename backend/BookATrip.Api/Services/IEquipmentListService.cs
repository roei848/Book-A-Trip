using BookATrip.Api.Models;

namespace BookATrip.Api.Services;

public interface IEquipmentListService
{
    Task<EquipmentList> GenerateEquipmentListAsync(Trip trip);
}
