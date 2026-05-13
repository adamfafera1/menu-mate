using menumate.Data;
using menumate.Models;
using menumate.Models.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO;

namespace menumate.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RestaurantsController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;

        public RestaurantsController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public IActionResult GetRestaurants()
        {
            return Ok(dbContext.Restaurants.ToList());
        }

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

        [HttpPost]
        public IActionResult AddRestaurant(AddRestaurantDto addRestaurantDto)
        {
            var restaurantEntity = new Restaurant()
            {
                Name = addRestaurantDto.Name,
                Rating = addRestaurantDto.Rating,
                Description = addRestaurantDto.Description,
                Phone = addRestaurantDto.Phone,
                Location = addRestaurantDto.Location,
                ImagePath = addRestaurantDto.ImagePath,
                Cuisine = addRestaurantDto.Cuisine,
            };

            dbContext.Restaurants.Add(restaurantEntity);
            dbContext.SaveChanges();
            return Ok(restaurantEntity);
        }

        [HttpPut]
        [Route("{id:guid}")]
        public IActionResult UpdateRestaurant(Guid id, UpdateRestaurantDto updateRestaurantDto)
        {
            var restaurant = dbContext.Restaurants.Find(id);

            if (restaurant == null) { return NotFound(); }

            restaurant.Name = updateRestaurantDto.Name;
            restaurant.Location = updateRestaurantDto.Location;
            restaurant.Rating = updateRestaurantDto.Rating;
            restaurant.Description = updateRestaurantDto.Description;
            restaurant.Phone = updateRestaurantDto.Phone;
            restaurant.ImagePath = updateRestaurantDto.ImagePath;
            restaurant.Cuisine = updateRestaurantDto.Cuisine;


            dbContext.SaveChanges();

            return Ok(restaurant);

        }

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

        [HttpPost("{id:guid}/upload-image")]
        [Microsoft.AspNetCore.Authorization.Authorize(AuthenticationSchemes = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> UploadImage(Guid id, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var restaurant = await dbContext.Restaurants.FindAsync(id);
            if (restaurant == null) return NotFound();

            // Note: Ideally verify that the current user owns this restaurant
            // var userId = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.Name)?.Value;
            // if (userId != restaurant.OwnerId.ToString()) return Forbid();

            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "restaurants");
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            var extension = Path.GetExtension(file.FileName);
            var fileName = $"{id}{extension}";
            var filePath = Path.Combine(folderPath, fileName);

            var existingFiles = Directory.GetFiles(folderPath, $"{id}.*");
            foreach (var existingFile in existingFiles)
            {
                System.IO.File.Delete(existingFile);
            }

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            restaurant.ImagePath = $"/uploads/restaurants/{fileName}";
            dbContext.Restaurants.Update(restaurant);
            await dbContext.SaveChangesAsync();

            return Ok(new { imagePath = restaurant.ImagePath });
        }
    }
}
