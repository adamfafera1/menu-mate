// backend/menumate/Controllers/EditItemsController.cs

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

        // Pobranie wszystkich oczekujących propozycji zmian
        [HttpGet]
        public IActionResult GetEdits()
        {
            var edits = dbContext.EditItems.ToList();
            return Ok(edits);
        }

        // Pobranie propozycji zmian dla konkretnego dania
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

        // Pobranie propozycji zmian dla wszystkich dań w danej restauracji
        [HttpGet("Restaurant/{restaurantId:guid}")]
        public IActionResult GetEditsByRestaurantId(Guid restaurantId)
        {
            var edits = dbContext.EditItems
                .Include(e => e.Item)
                .Where(e => e.Item.RestaurantId == restaurantId)
                .ToList();
            return Ok(edits);
        }

        // Rejestracja nowej propozycji zmiany dla wybranego elementu menu.
        [HttpPost]
        public IActionResult AddEdit(AddEditItemDto addEditItemDto)
        {
            // Dynamiczne sprawdzenie, czy wskazana nazwa właściwości istnieje w modelu MenuItem przy użyciu refleksji
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

        // Zatwierdzenie i automatyczne aplikowanie propozycji zmiany na docelowy rekord w bazie danych.
        [HttpPut("{id:guid}/approve")]
        public IActionResult ApproveEdit(Guid id)
        {
            // Pobranie propozycji zmiany wraz z daniem, którego dotyczy zmiana
            var edit = dbContext.EditItems
                .Include(e => e.Item)
                .FirstOrDefault(e => e.Id == id);

            if (edit == null)
                return NotFound("Edit not found");

            var item = dbContext.Items.Find(edit.ItemId);
            if (item == null)
                return NotFound("Item not found");

            // Pobranie informacji o właściwości modelu MenuItem na podstawie nazwy zapisanej w edycji
            var property = typeof(MenuItem).GetProperty(edit.PropertyName);

            // Sprawdzenie, czy właściwość istnieje
            if (property == null)
                return BadRequest("Invalid property name");

            try
            {
                // Dynamiczna konwersja tekstowej wartości NewValue na typ docelowy (np. float, int) właściwości obiektu
                var convertedValue = Convert.ChangeType(edit.NewValue, property.PropertyType);
                // Przypisanie skonwertowanej wartości bezpośrednio do obiektu przy użyciu refleksji
                property.SetValue(item, convertedValue);

                // Usunięcie rekordu propozycji z bazy danych po pomyślnym naniesieniu zmian
                dbContext.EditItems.Remove(edit);
                dbContext.SaveChanges();

                return Ok(new { message = "Edit approved and applied", item });
            }
            catch (Exception ex)
            {
                return BadRequest($"Error applying edit: {ex.Message}");
            }
        }

        // Usunięcie (odrzucenie) propozycji zmiany
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
