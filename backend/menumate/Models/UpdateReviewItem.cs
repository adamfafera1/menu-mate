namespace menumate.Models
{
    // backend/menumate/Models/UpdateReviewItem.cs
    // Aktualizacja recenzji dania
    public class UpdateReviewItem
    {
        public Guid ItemId { get; set; }
        public string Description { get; set; }
        public float Rating { get; set; }
    }
}