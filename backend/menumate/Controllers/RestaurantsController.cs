using menumate.Data;
using menumate.Models;
using menumate.Models.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
    }
}
