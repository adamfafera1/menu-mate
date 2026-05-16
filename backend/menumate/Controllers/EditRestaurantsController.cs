// backend/menumate/Controllers/EditRestaurantsController.cs

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
    public class EditRestaurantsController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;
        public EditRestaurantsController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        // Pobranie wszystkich propozycji zmian dla restauracji
        [HttpGet]
        public IActionResult GetEditRestaurants()
        {
            return Ok(dbContext.EditRestaurants.ToList());
        }

        // Pobranie propozycji zmian dla konkretnej restauracji
        [HttpGet]
        [Route("{id:guid}")]
        public IActionResult GetEditRestaurantById(Guid id)
        {
            var editRestaurant = dbContext.EditRestaurants.Where(edit => edit.RestaurantId == id).ToList();

            if (editRestaurant == null)
            {
                return NotFound();
            }
            return Ok(editRestaurant);
        }

        // Dodanie nowej propozycji zmiany danych restauracji
        [HttpPost]
        public IActionResult AddEditRestaurant(AddEditRestaurantDto addEditRestaurantDto)
        {
            // Sprawdzenie poprawności nazwy właściwości w modelu Restaurant
            var property = typeof(Restaurant).GetProperty(addEditRestaurantDto.PropertyName);
            if (property == null)
                return BadRequest("Invalid property name");

            var edit = new EditRestaurant
            {
                RestaurantId = addEditRestaurantDto.RestaurantId,
                PropertyName = addEditRestaurantDto.PropertyName,
                NewValue = addEditRestaurantDto.NewValue,
                CreatedAt = DateTime.UtcNow
            };

            dbContext.EditRestaurants.Add(edit);
            dbContext.SaveChanges();
            return Ok(edit);
        }

        // Zatwierdzenie i naniesienie zmiany na profil restauracji
        [HttpPut]
        [Route("{id:guid}/approve")]
        public IActionResult ApproveEdit(string id)
        {
            var edit = dbContext.EditRestaurants
                .Include(e => e.Restaurant)
                .FirstOrDefault(e => e.Id.ToString() == id);

            if (edit == null)
                return NotFound("Edit not found");

            var restaurant = dbContext.Restaurants.Find(edit.RestaurantId);
            if (restaurant == null)
                return NotFound("Restaurant not found");

            var property = typeof(Restaurant).GetProperty(edit.PropertyName);
            if (property == null)
                return BadRequest("Invalid property name");

            try
            {
                // Dynamiczne przypisanie nowej wartości do właściwości modelu
                var convertedValue = Convert.ChangeType(edit.NewValue, property.PropertyType);
                property.SetValue(restaurant, convertedValue);

                // Usunięcie wpisu o propozycji zmiany po jej zatwierdzeniu
                dbContext.EditRestaurants.Remove(edit);
                dbContext.SaveChanges();

                return Ok(new { message = "Edit approved and applied", restaurant });
            }
            catch (Exception ex)
            {
                return BadRequest($"Error applying edit: {ex.Message}");
            }
        }


        // Usunięcie (odrzucenie) propozycji zmiany restauracji
        [HttpDelete]
        [Route("{id:guid}")]
        public IActionResult DeleteEditRestaurant(Guid id)
        {
            var existingEditRestaurant = dbContext.EditRestaurants.Find(id);
            if (existingEditRestaurant == null)
            {
                return NotFound();
            }
            dbContext.EditRestaurants.Remove(existingEditRestaurant);
            dbContext.SaveChanges();
            return Ok(existingEditRestaurant);
        }
    }
}
