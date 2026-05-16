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

        // Nowa proponowana wartość zmiany
        public string NewValue { get; set; }

        // Data utworzenia zgłoszenia zmiany
        public DateTime CreatedAt { get; set; }

        // Powiązana encja restauracji
        public Restaurant Restaurant { get; set; }
    }
}
 