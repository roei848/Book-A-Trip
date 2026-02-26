using BookATrip.Api.Models;
using BookATrip.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookATrip.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class ItineraryController(ITripService tripService, ITripGenerationService tripGenerationService, IEquipmentListService equipmentListService) : ControllerBase
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

    [HttpPost("generate")]
    public async Task<IActionResult> Generate([FromBody] GenerateTripRequest request)
    {
        var trip = await tripGenerationService.GenerateTripAsync(request);
        return Ok(trip);
    }

    [HttpPost("{id}/equipment")]
    public async Task<IActionResult> GenerateEquipmentList(string id)
    {
        var trip = await tripService.GetByIdAsync(id);
        if (trip is null) return NotFound();
        var equipmentList = await equipmentListService.GenerateEquipmentListAsync(trip);
        return Ok(equipmentList);
    }

    [HttpPatch("{id}/image")]
    public async Task<IActionResult> UpdateImage(string id, [FromBody] UpdateTripImageRequest request)
    {
        var updated = await tripService.UpdateTripImageAsync(id, request.ImageUrl);
        return updated ? NoContent() : NotFound();
    }
}

public record UpdateTripImageRequest(string ImageUrl);
