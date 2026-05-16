namespace menumate.Models
{
    // backend/menumate/Models/AddRestaurantDto.cs
    // Dodawanie i aktualizacja restauracji
    public class AddRestaurantDto
    {
        public string Name { get; set; }
        public float Rating { get; set; }
        public string Description { get; set; }
        public string Location { get; set; }
        public string Phone { get; set; }
        public string ImagePath { get; set; }
        public string? Cuisine { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
    }
}
