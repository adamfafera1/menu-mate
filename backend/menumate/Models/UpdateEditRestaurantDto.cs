using menumate.Models.Entities;

namespace menumate.Models
{
    // backend/menumate/Models/UpdateEditRestaurantDto.cs
    // Aktualizacja propozycji edycji restauracji
    public class UpdateEditRestaurantDto
    {
        public Guid RestaurantId { get; set; }
        public Restaurant Restaurant { get; set; }
        public string Description { get; set; } = string.Empty;

        public string? StringValue { get; set; } = string.Empty;
        public float? FloatValue { get; set; } = null;
    }
}
