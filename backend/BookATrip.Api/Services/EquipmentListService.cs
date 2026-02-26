using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using BookATrip.Api.Models;

namespace BookATrip.Api.Services;

public class EquipmentListService(IHttpClientFactory httpClientFactory, IConfiguration configuration) : IEquipmentListService
{
    private const string ChatCompletionsPath = "chat/completions";

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        Converters = { new JsonStringEnumConverter(JsonNamingPolicy.CamelCase) }
    };

    public async Task<EquipmentList> GenerateEquipmentListAsync(Trip trip)
    {
        var client = httpClientFactory.CreateClient(TripGenerationService.ClientName);
        var model = configuration["OpenRouter:Model"]!;

        var prompt = BuildPrompt(trip);

        var requestBody = new
        {
            model,
            messages = new[]
            {
                new { role = "system", content = SystemPrompt },
                new { role = "user", content = prompt }
            }
        };

        var json = JsonSerializer.Serialize(requestBody, JsonOptions);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await client.PostAsync(ChatCompletionsPath, content);
        response.EnsureSuccessStatusCode();

        var responseJson = await response.Content.ReadAsStringAsync();
        var completion = JsonSerializer.Deserialize<OpenRouterResponse>(responseJson, JsonOptions)
            ?? throw new InvalidOperationException("Empty response from OpenRouter");

        var listJson = completion.Choices[0].Message.Content;
        var equipmentList = JsonSerializer.Deserialize<EquipmentList>(listJson, JsonOptions)
            ?? throw new InvalidOperationException("Failed to deserialize equipment list from AI response");

        return equipmentList;
    }

    private static string BuildPrompt(Trip trip)
    {
        var activities = trip.PointsOfInterest.Count > 0
            ? string.Join(", ", trip.PointsOfInterest)
            : "general sightseeing";

        var duration = (trip.EndDate - trip.StartDate).Days + 1;

        return $"""
            Generate a packing/equipment list for this trip:
            - Destination: {trip.Destination}
            - Duration: {duration} days ({trip.StartDate:yyyy-MM-dd} to {trip.EndDate:yyyy-MM-dd})
            - Budget: {trip.Budget}
            - Transport: {trip.Transport}
            - Pace: {trip.Pace}
            - Food preference: {trip.Food}
            - Activities: {activities}
            - Number of travelers: {trip.TravelersCount}
            """;
    }

    private const string SystemPrompt = """
        You are a travel packing assistant. Return ONLY a valid JSON object with no markdown, no code blocks, and no extra text.

        The JSON must match this exact structure:
        {
          "items": [
            {
              "name": "string — item name",
              "category": "string — one of: Clothing, Toiletries, Electronics, Documents, Health, Gear, Food & Snacks, Misc",
              "quantity": number,
              "isEssential": boolean
            }
          ]
        }

        Rules:
        - Group items by logical category
        - Mark essential items (passport, medication, etc.) as isEssential: true
        - Tailor the list to the destination, duration, activities, and transport type
        - Include 15-30 items total
        - Quantity should reflect the trip duration (e.g. more clothing for longer trips)
        """;
}

file class OpenRouterResponse
{
    public List<Choice> Choices { get; set; } = [];
}

file class Choice
{
    public Message Message { get; set; } = new();
}

file class Message
{
    public string Content { get; set; } = string.Empty;
}
