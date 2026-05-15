namespace menumate.Models.Entities
{
    public class Review
    {
        // Unikalny identyfikator recenzji
        public Guid Id { get; set; }

        // Identyfikator restauracji, której dotyczy recenzja
        public Guid RestaurantId { get; set; }

        // Identyfikator użytkownika wystawiającego opinię
        public Guid UserId { get; set; }

        // Nazwa wyświetlana użytkownika
        public string UserName { get; set; }

        // Ścieżka do zdjęcia profilowego autora recenzji
        public string UserImagePath { get; set; }

        // Tytuł recenzji
        public string Title { get; set; }

        // Treść recenzji
        public string Description { get; set; }

        // Ocena punktowa restauracji
        public float Rating { get; set; }

        // Obiekt powiązanej restauracji (relacja)
        public Restaurant Restaurant { get; set; }
    }
}
