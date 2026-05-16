// backend/menumate/Models/Entities/EditItem.cs

namespace menumate.Models.Entities
{
    public class EditItem
    {
        // Unikalny identyfikator propozycji zmiany
        public Guid Id { get; set; }

        // Identyfikator dania, którego dotyczy zmiana
        public Guid ItemId { get; set; }

        // Nazwa właściwości podlegającej zmianie (np. Price, Name)
        public string PropertyName { get; set; }

        // Nowa proponowana wartość
        public string NewValue { get; set; }

        // Data utworzenia zgłoszenia
        public DateTime CreatedAt { get; set; }

        // Powiązana encja dania
        public MenuItem Item { get; set; }
    }
}
