namespace menumate.Models.Entities
{
    public class ReviewItem
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid ItemId { get; set; }
        public string UserName { get; set; }
        public string UserImagePath { get; set; }
        public string Title { get; set; }  
        public string Description { get; set; }
        public float Rating { get; set; }
        public MenuItem Item { get; set; }
    }
}
