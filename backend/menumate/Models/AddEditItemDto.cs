namespace menumate.Models
{
    // backend/menumate/Models/AddEditItemDto.cs 
    // Propozycja zmiany parametrów produktu
    public class AddEditItemDto
    {
        public Guid ItemId { get; set; }
        public required string PropertyName { get; set; }
        public required string NewValue { get; set; }
    }
}
