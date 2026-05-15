// backend\menumate\Models\Entities\Restaurant.cs

namespace menumate.Models.Entities
{
    public class Restaurant
    {
        // Unikalny identyfikator restauracji
        public Guid Id { get; set; } 

        // Nazwa restauracji
        public required string Name { get; set; }

        // Średnia ocena lokalu
        public float Rating { get; set; }

        // Opis restauracji
        public required string Description { get; set; }

        // Adres lub lokalizacja fizyczna
        public required string Location { get; set; }

        // Numer telefonu kontaktowego
        public required string Phone { get; set; }

        // Ścieżka do zdjęcia lokalu
        public required string ImagePath { get; set; }

        // Rodzaj serwowanej kuchni
        public string? Cuisine { get; set; }

        // Współrzędne geograficzne (szerokość)
        public double? Latitude { get; set; }

        // Współrzędne geograficzne (długość)
        public double? Longitude { get; set; }

        // Identyfikator właściciela restauracji
        public Guid? OwnerId { get; set; }

        // Obiekt właściciela (relacja)
        public User? Owner { get; set; }
    }
}
