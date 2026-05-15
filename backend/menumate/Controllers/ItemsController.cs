using menumate.Data;
using menumate.Models;
using menumate.Models.Entities;
using menumate.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO;

namespace menumate.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemsController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;
        private readonly IImageService imageService;

        public ItemsController(ApplicationDbContext dbContext, IImageService imageService)
        {
            this.dbContext = dbContext;
            this.imageService = imageService;
        }

        // Pobranie listy wszystkich dań
        [HttpGet]
        public IActionResult GetItems()
        {
            return Ok(dbContext.Items.ToList());
        }


        // Pobranie danych konkretnego dania na podstawie ID
        [HttpGet]
        [Route("{id:guid}")]
        public IActionResult GetItemById(Guid id)
        {
            var item = dbContext.Items.Find(id);
            
            if (item == null)
            {
                return NotFound();
            }
            
            return Ok(item);
        }

        // Pobranie wszystkich dań należących do konkretnej restauracji
        [HttpGet]
        [Route("Restaurant/{id:guid}")]
        public IActionResult GetItemsByRestaurant(Guid id)
        {
            var items = dbContext.Items.Where(item => item.RestaurantId == id).ToList();
            return Ok(items);
        }
        

        // Dodanie nowego dania do menu
        [HttpPost]
        public IActionResult AddItem(AddItemDto addItemDto)
        {
            var itemEntity = new MenuItem()
            {
                Name = addItemDto.Name,
                Description = addItemDto.Description,
                Price = addItemDto.Price,
                //Currency = (MenuItem.FiscalCurrency)(addItemDto.Currency),
                Calories = addItemDto.Calories,
                Carbs = addItemDto.Carbs,
                Fats = addItemDto.Fats,
                Proteins = addItemDto.Proteins,
                Allergens = addItemDto.Allergens,
                Image = addItemDto.Image,
                RestaurantId = addItemDto.RestaurantId
            }; 

            dbContext.Items.Add(itemEntity);
            dbContext.SaveChanges();
            return Ok(itemEntity);
        }

        // Aktualizacja danych istniejącego dania
        [HttpPut]
        [Route("{id:guid}")]
        public IActionResult UpdateItem(UpdateItemDto updateItemDto, Guid id) 
        {
            var itemEntity = dbContext.Items.Find(id);
            if (itemEntity == null) { return NotFound(); }

            itemEntity.Name = updateItemDto.Name;
            itemEntity.Description = updateItemDto.Description;
            itemEntity.Price = updateItemDto.Price;
            //itemEntity.Currency = (MenuItem.FiscalCurrency)(updateItemDto.Currency);
            itemEntity.Calories = updateItemDto.Calories;
            itemEntity.Carbs = updateItemDto.Carbs;
            itemEntity.Fats = updateItemDto.Fats;
            itemEntity.Allergens = updateItemDto.Allergens;
            itemEntity.Proteins = updateItemDto.Proteins;
            
            itemEntity.Image = updateItemDto.Image;

            dbContext.SaveChanges();

            return Ok(itemEntity);
        }

        // Usunięcie dania z menu
        [HttpDelete]
        public IActionResult DeleteItem(Guid id)
        {
            var item = dbContext.Items.Find(id);

            if (item == null)
            {
                return NotFound();
            }

            dbContext.Remove(id);
            dbContext.SaveChanges();
            return Ok("Successfully deleted item with id: " + id);
        }

        // Przesłanie i aktualizacja zdjęcia potrawy
        [HttpPost("{id:guid}/upload-image")]
        [Microsoft.AspNetCore.Authorization.Authorize(AuthenticationSchemes = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> UploadImage(Guid id, IFormFile file)
        {
            // Walidacja przesłanego pliku
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var item = await dbContext.Items.FindAsync(id);
            if (item == null) return NotFound();

            // Usunięcie poprzedniego zdjęcia z serwera
            if (!string.IsNullOrEmpty(item.Image))
            {
                await imageService.DeleteImageAsync(item.Image);
            }

            // Przesłanie nowej grafiki do folderu "items"
            var imageUrl = await imageService.UploadImageAsync(file, "items");

            // Zapisanie nowej ścieżki w bazie danych
            item.Image = imageUrl;
            dbContext.Items.Update(item);
            await dbContext.SaveChangesAsync();

            return Ok(new { imagePath = item.Image });
        }
    }
}
