using BookATrip.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace BookATrip.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ItineraryController(ITripService tripService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var summaries = await tripService.GetAllSummariesAsync();
        return Ok(summaries);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var trip = await tripService.GetByIdAsync(id);
        return trip is null ? NotFound() : Ok(trip);
    }
}
