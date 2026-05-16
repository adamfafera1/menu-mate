using menumate.Models.Entities;

namespace menumate.Models
{
    // backend/menumate/Models/AddEditRestaurantDto.cs
    // Propozycja edycji danych restauracji
    public class AddEditRestaurantDto
    {
        public Guid RestaurantId { get; set; }
        public string PropertyName { get; set; }
        public string NewValue { get; set; }
    }
}
