using menumate.Data;
using menumate.Models;
using menumate.Models.Entities;
using menumate.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.Text.Json;

namespace menumate.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RestaurantsController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;
        private readonly IHttpClientFactory httpClientFactory;
        private readonly IImageService imageService;

        public RestaurantsController(ApplicationDbContext dbContext, IHttpClientFactory httpClientFactory, IImageService imageService)
        {
            this.dbContext = dbContext;
            this.httpClientFactory = httpClientFactory;
            this.imageService = imageService;
        }

        // Konwersja adresu tekstowego na współrzędne geograficzne przy użyciu zewnętrznego API Nominatim.
        // Metoda zapewnia obsługę błędów sieciowych i zwraca wartości null w przypadku niepowodzenia geokodowania.
        private async Task<(double? lat, double? lng)> GeocodeAsync(string location)
        {
            try
            {
                var client = httpClientFactory.CreateClient("Nominatim");
                var encoded = Uri.EscapeDataString(location);
                var response = await client.GetAsync($"search?q={encoded}&format=json&limit=1");
                if (!response.IsSuccessStatusCode) return (null, null);

                var json = await response.Content.ReadAsStringAsync();
                var results = JsonSerializer.Deserialize<JsonElement[]>(json);
                if (results == null || results.Length == 0) return (null, null);

                var first = results[0];
                // Parsowanie szerokości i długości geograficznej z formatu niezależnego od kultury (invariant culture)
                if (double.TryParse(first.GetProperty("lat").GetString(), System.Globalization.NumberStyles.Float, System.Globalization.CultureInfo.InvariantCulture, out var lat) &&
                    double.TryParse(first.GetProperty("lon").GetString(), System.Globalization.NumberStyles.Float, System.Globalization.CultureInfo.InvariantCulture, out var lng))
                {
                    return (lat, lng);
                }
            }
            catch { }
            return (null, null);
        }

        // Pobranie listy wszystkich restauracji wraz z uzupełnieniem brakujących współrzędnych
        [HttpGet]
        public async Task<IActionResult> GetRestaurants()
        {
            var restaurants = dbContext.Restaurants.ToList();

            var missing = restaurants
                .Where(r => r.Latitude == null && !string.IsNullOrWhiteSpace(r.Location))
                .ToList();

            foreach (var r in missing)
            {
                var (lat, lng) = await GeocodeAsync(r.Location);
                r.Latitude = lat;
                r.Longitude = lng;
                await Task.Delay(1100);
            }

            if (missing.Count > 0)
                await dbContext.SaveChangesAsync();

            return Ok(restaurants);
        }

        // Pobranie danych restauracji na podstawie identyfikatora ID
        [HttpGet]
        [Route("{id:guid}")]
        public IActionResult GetRestaurantByID(Guid id)
        {
            var restaurant = dbContext.Restaurants.Find(id);

            if (restaurant == null)
            {
                return NotFound();
            }

            return Ok(restaurant);
        }
 
        // Pobranie danych restauracji przypisanej do konkretnego właściciela
        [HttpGet]
        [Route("owner/{ownerId:guid}")]
        public IActionResult GetRestaurantByOwnerId(Guid ownerId)
        {
            var restaurant = dbContext.Restaurants.FirstOrDefault(r => r.OwnerId == ownerId);

            if (restaurant == null)
            {
                return NotFound();
            }

            return Ok(restaurant);
        }

        // Utworzenie nowej encji restauracji w bazie danych.
        // Proces obejmuje automatyczne pobranie współrzędnych geograficznych na podstawie podanego adresu tekstowego.
        [HttpPost]
        public async Task<IActionResult> AddRestaurant(AddRestaurantDto addRestaurantDto)
        {
            var (lat, lng) = await GeocodeAsync(addRestaurantDto.Location);

            var restaurantEntity = new Restaurant()
            {
                Name = addRestaurantDto.Name,
                Rating = addRestaurantDto.Rating,
                Description = addRestaurantDto.Description,
                Phone = addRestaurantDto.Phone,
                Location = addRestaurantDto.Location,
                ImagePath = addRestaurantDto.ImagePath,
                Cuisine = addRestaurantDto.Cuisine,
                Latitude = lat,
                Longitude = lng,
            };

            dbContext.Restaurants.Add(restaurantEntity);
            await dbContext.SaveChangesAsync();
            return Ok(restaurantEntity);
        }

        // Aktualizacja danych istniejącej restauracji.
        // W przypadku wykrycia zmiany adresu tekstowego następuje ponowne wywołanie procesu geokodowania w celu aktualizacji mapy.
        [HttpPut]
        [Route("{id:guid}")]
        public async Task<IActionResult> UpdateRestaurant(Guid id, UpdateRestaurantDto updateRestaurantDto)
        {
            var restaurant = dbContext.Restaurants.Find(id);

            if (restaurant == null) { return NotFound(); }

            // Weryfikacja zmiany lokalizacji w celu optymalizacji zapytań do API geokodowania
            var locationChanged = restaurant.Location != updateRestaurantDto.Location;

            restaurant.Name = updateRestaurantDto.Name;
            restaurant.Location = updateRestaurantDto.Location;
            restaurant.Rating = updateRestaurantDto.Rating;
            restaurant.Description = updateRestaurantDto.Description;
            restaurant.Phone = updateRestaurantDto.Phone;
            restaurant.ImagePath = updateRestaurantDto.ImagePath;
            restaurant.Cuisine = updateRestaurantDto.Cuisine;

            if (locationChanged)
            {
                var (lat, lng) = await GeocodeAsync(updateRestaurantDto.Location);
                restaurant.Latitude = lat;
                restaurant.Longitude = lng;
            }

            await dbContext.SaveChangesAsync();

            return Ok(restaurant);
        }

        // Usunięcie restauracji z bazy danych
        [HttpDelete]
        [Route("{id:guid}")]
        public IActionResult DeleteRestaurant(Guid id)
        {
            var restaurant = dbContext.Restaurants.Find(id);

            if(restaurant == null)
            {
                return NotFound();
            }

            dbContext.Restaurants.Remove(restaurant);
            dbContext.SaveChanges();

            return Ok();
        }

        // Przesłanie i aktualizacja zdjęcia restauracji
        [HttpPost("{id:guid}/upload-image")]
        [Microsoft.AspNetCore.Authorization.Authorize(AuthenticationSchemes = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> UploadImage(Guid id, IFormFile file)
        {
            // Sprawdzenie poprawności przesłanego pliku
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var restaurant = await dbContext.Restaurants.FindAsync(id);
            if (restaurant == null) return NotFound();

            // Usunięcie starego zdjęcia z serwera, jeśli istnieje
            if (!string.IsNullOrEmpty(restaurant.ImagePath))
            {
                await imageService.DeleteImageAsync(restaurant.ImagePath);
            }

            // Przesłanie nowego pliku do folderu "restaurants"
            var imageUrl = await imageService.UploadImageAsync(file, "restaurants");

            // Aktualizacja ścieżki w bazie danych
            restaurant.ImagePath = imageUrl;
            dbContext.Restaurants.Update(restaurant);
            await dbContext.SaveChangesAsync();

            return Ok(new { imagePath = restaurant.ImagePath });
        }
    }
}
