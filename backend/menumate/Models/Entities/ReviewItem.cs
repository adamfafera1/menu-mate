namespace menumate.Models.Entities
{
    public class ReviewItem
    {
        // Unikalny identyfikator recenzji dania
        public Guid Id { get; set; }

        // Identyfikator użytkownika wystawiającego opinię
        public Guid UserId { get; set; }

        // Identyfikator dania, którego dotyczy recenzja
        public Guid ItemId { get; set; }

        // Nazwa wyświetlana użytkownika
        public string UserName { get; set; }

        // Ścieżka do zdjęcia profilowego autora
        public string UserImagePath { get; set; }

        // Tytuł recenzji
        public string Title { get; set; }  

        // Treść recenzji dania
        public string Description { get; set; }

        // Ocena punktowa dania
        public float Rating { get; set; }

        // Obiekt powiązanego dania (relacja)
        public MenuItem Item { get; set; }
    }
}
