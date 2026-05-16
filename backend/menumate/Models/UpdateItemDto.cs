using menumate.Models.Entities;
using System.ComponentModel;

namespace menumate.Models
{
    // backend/menumate/Models/UpdateItemDto.cs
    // Aktualizacja pozycji w menu
    public class UpdateItemDto
    {
        public Guid RestaurantId { get; set; }
        public string Name { get; set; }
        public float Price { get; set; }
        public MenuItem.FiscalCurrency Currency { get; set; }
        public int Calories { get; set; }
        public int Fats { get; set; }
        public int Carbs { get; set; }
        public int Proteins { get; set; }
        public string Allergens { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }

    }
}
