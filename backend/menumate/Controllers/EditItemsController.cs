using menumate.Data;
using menumate.Models;
using menumate.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace menumate.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EditItemsController : ControllerBase
    {
        public readonly ApplicationDbContext dbContext;

        public EditItemsController(ApplicationDbContext dbContext) 
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public IActionResult GetEdits()
        {
            var edits = dbContext.EditItems.ToList();
            return Ok(edits);
        }

        [HttpGet("item/{itemId:guid}")]
        public IActionResult GetEditsByItemId(Guid itemId)
        {
            var edits = dbContext.EditItems.Where(e => e.ItemId == itemId).ToList();
            
            if (edits == null)
            {
                return NotFound();
            }

            return Ok(edits);
        }

        [HttpGet("Restaurant/{restaurantId:guid}")]
        public IActionResult GetEditsByRestaurantId(Guid restaurantId)
        {
            var edits = dbContext.EditItems
                .Include(e => e.Item)
                .Where(e => e.Item.RestaurantId == restaurantId)
                .ToList();
            return Ok(edits);
        }

        [HttpPost]
        public IActionResult AddEdit(AddEditItemDto addEditItemDto)
        {
            var property = typeof(MenuItem).GetProperty(addEditItemDto.PropertyName);
            if (property == null)
                return BadRequest("Invalid property name");
            
            var edit = new EditItem()
            {
                ItemId = addEditItemDto.ItemId,
                PropertyName = addEditItemDto.PropertyName,
                NewValue = addEditItemDto.NewValue,
                CreatedAt = DateTime.UtcNow
            };

            dbContext.EditItems.Add(edit);
            dbContext.SaveChanges();
            return Ok(edit);
        }

        [HttpPut("{id:guid}/approve")]
        public IActionResult ApproveEdit(Guid id)
        {
            var edit = dbContext.EditItems
                .Include(e => e.Item)
                .FirstOrDefault(e => e.Id == id);

            if (edit == null)
                return NotFound("Edit not found");

            var item = dbContext.Items.Find(edit.ItemId);
            if (item == null)
                return NotFound("Item not found");

            var property = typeof(MenuItem).GetProperty(edit.PropertyName);
            if (property == null)
                return BadRequest("Invalid property name");

            try
            {
                var convertedValue = Convert.ChangeType(edit.NewValue, property.PropertyType);
                property.SetValue(item, convertedValue);

                dbContext.EditItems.Remove(edit);
                dbContext.SaveChanges();

                return Ok(new { message = "Edit approved and applied", item });
            }
            catch (Exception ex)
            {
                return BadRequest($"Error applying edit: {ex.Message}");
            }
        }

        [HttpDelete("{id:guid}")]
        public IActionResult DeleteEdit(Guid id)
        {
            var edit = dbContext.EditItems.Find(id);
            if (edit == null)
            {
                return NotFound();
            }
            dbContext.EditItems.Remove(edit);
            dbContext.SaveChanges();
            return Ok("Successfully deleted edit with id: " + id);
        }
    }
}
