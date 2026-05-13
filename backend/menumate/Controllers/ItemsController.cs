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
    public class ItemsController : ControllerBase
    {
        public readonly ApplicationDbContext dbContext;

        public ItemsController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public IActionResult GetItems()
        {
            return Ok(dbContext.Items.ToList());
        }


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

        [HttpGet]
        [Route("Restaurant/{id:guid}")]
        public IActionResult GetItemsByRestaurant(Guid id)
        {
            var items = dbContext.Items.Where(item => item.RestaurantId == id).ToList();
            return Ok(items);
        }
        

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

        [HttpPost("{id:guid}/upload-image")]
        [Microsoft.AspNetCore.Authorization.Authorize(AuthenticationSchemes = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> UploadImage(Guid id, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var item = await dbContext.Items.FindAsync(id);
            if (item == null) return NotFound();

            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "items");
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

            item.Image = $"/uploads/items/{fileName}";
            dbContext.Items.Update(item);
            await dbContext.SaveChangesAsync();

            return Ok(new { imagePath = item.Image });
        }
    }
}
