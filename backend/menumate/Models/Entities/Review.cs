namespace menumate.Models.Entities
{
    public class Review
    {
        public Guid Id { get; set; }
        public Guid RestaurantId { get; set; }
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public string UserImagePath { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public float Rating { get; set; }
        public Restaurant Restaurant { get; set; }
    }
}
