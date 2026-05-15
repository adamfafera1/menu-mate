namespace menumate.Models.Entities
{
    public class EditRestaurant
    {
        // Unikalny identyfikator propozycji zmiany
        public Guid Id { get; set; }

        // Identyfikator restauracji, której dotyczy zmiana
        public Guid RestaurantId { get; set; }

        // Nazwa właściwości podlegającej zmianie (np. Name, Location)
        public string PropertyName { get; set; }

        // Nowa proponowana wartość
        public string NewValue { get; set; }

        // Data utworzenia zgłoszenia
        public DateTime CreatedAt { get; set; }

        // Obiekt powiązanej restauracji (relacja)
        public Restaurant Restaurant { get; set; }
    }
}
 