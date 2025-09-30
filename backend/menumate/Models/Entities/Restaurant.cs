namespace menumate.Models.Entities
{
    public class Restaurant
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public float Rating { get; set; }
        public required string Description { get; set; }
        public required string Location { get; set; }
        public required string Phone { get; set; }
        public required string ImagePath { get; set; }
        public Guid? OwnerId { get; set; }
        public User? Owner { get; set; }
    }
}
