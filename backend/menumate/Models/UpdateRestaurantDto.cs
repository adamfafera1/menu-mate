namespace menumate.Models.Entities
{
    public class UpdateRestaurantDto
    {
        public string Name { get; set; }
        public float Rating { get; set; }
        public string Description { get; set; }
        public string Location { get; set; }
        public string Phone { get; set; }
        public string ImagePath { get; set; }
        public string? Cuisine { get; set; }
    }
}
