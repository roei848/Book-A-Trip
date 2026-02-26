using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using BookATrip.Api.Models;

namespace BookATrip.Api.Services;

public class TripGenerationService(IHttpClientFactory httpClientFactory, IConfiguration configuration) : ITripGenerationService
{
    public const string ClientName = "OpenRouter";
    private const string ChatCompletionsPath = "chat/completions";

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        Converters = { new JsonStringEnumConverter(JsonNamingPolicy.CamelCase) }
    };

    public async Task<Trip> GenerateTripAsync(GenerateTripRequest request)
    {
        var client = httpClientFactory.CreateClient(ClientName);
        var model = configuration["OpenRouter:Model"]!;

        var prompt = BuildPrompt(request);

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

        var tripJson = completion.Choices[0].Message.Content;
        var trip = JsonSerializer.Deserialize<Trip>(tripJson, JsonOptions)
            ?? throw new InvalidOperationException("Failed to deserialize trip from AI response");

        trip.Id = Guid.NewGuid().ToString();
        return trip;
    }

    private static string BuildPrompt(GenerateTripRequest request)
    {
        var pointsOfInterest = request.PointsOfInterest.Count > 0
            ? string.Join(", ", request.PointsOfInterest)
            : "none specified";

        return $"""
            Generate a trip itinerary with these details:
            - Destination: {request.Destination}
            - Start date: {request.StartDate:yyyy-MM-dd}
            - End date: {request.EndDate:yyyy-MM-dd}
            - Budget: {request.Budget}
            - Transport: {request.Transport}
            - Pace: {request.Pace}
            - Food preference: {request.Food}
            - Points of interest: {pointsOfInterest}
            - Number of travelers: {request.TravelersCount}
            - Notes: {(string.IsNullOrWhiteSpace(request.Note) ? "none" : request.Note)}
            """;
    }

    private const string SystemPrompt = """
        You are a travel itinerary generator. Return ONLY a valid JSON object with no markdown, no code blocks, and no extra text.

        The JSON must match this exact structure:
        {
          "title": "string — creative trip title",
          "destination": "string",
          "startDate": "YYYY-MM-DDT00:00:00",
          "endDate": "YYYY-MM-DDT00:00:00",
          "budget": "minimal|medium|luxury|elite",
          "transport": "carRental|publicTransport|walking|flight",
          "pace": "light|medium|intensive",
          "food": "none|kosher|vegetarian|vegan|halal",
          "pointsOfInterest": ["nature|museum|food|shopping|hotel|other"],
          "travelersCount": number,
          "note": "string",
          "days": [
            {
              "dayNumber": number,
              "date": "YYYY-MM-DDT00:00:00",
              "startLocation": "string",
              "attractions": [
                {
                  "id": "attr-uuid",
                  "name": "string",
                  "description": "string",
                  "location": { "lat": number, "lng": number, "address": "string" },
                  "durationInMinutes": number,
                  "category": "nature|museum|food|shopping|hotel|other"
                }
              ]
            }
          ]
        }

        Rules:
        - All enum values must be camelCase strings exactly as shown
        - Include 2-5 attractions per day appropriate to the pace
        - Use real coordinates for locations
        - Generate one day entry per calendar day between startDate and endDate
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
