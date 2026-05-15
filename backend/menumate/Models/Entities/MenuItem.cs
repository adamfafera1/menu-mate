using System.ComponentModel;

namespace menumate.Models.Entities
{
    public class MenuItem
    {
        // Typ wyliczeniowy dostępnych walut
        public enum FiscalCurrency
        {
            [Description("zł")] PLN,
            [Description("$")] USD,
            [Description("€")] EUR,
            [Description("£")] GBP,
            [Description("¥")] JPY,
            [Description("CHF")] CHF,
            [Description("A$")] AUD,
            [Description("C$")] CAD,
            [Description("¥")] CNY,
            [Description("₽")] RUB,
            [Description("₹")] INR,
            [Description("R$")] BRL,
            [Description("₩")] KRW,
            [Description("Mex$")] MXN
        }

        // Unikalny identyfikator dania
        public Guid Id { get; set; }

        // Identyfikator restauracji, do której należy danie
        public Guid RestaurantId { get; set; }

        // Nazwa dania
        public string Name { get; set; }

        // Cena dania
        public float Price { get; set; }

        // Waluta ceny
        public FiscalCurrency Currency { get; set; }

        // Wartość energetyczna (kalorie)
        public int Calories { get; set; }

        // Zawartość tłuszczu
        public int Fats { get; set; }

        // Zawartość węglowodanów
        public int Carbs { get; set; }

        // Zawartość białka
        public int Proteins { get; set; }

        // Lista alergenów
        public string Allergens { get; set; }

        // Opis dania
        public string Description { get; set; }

        // Ścieżka do zdjęcia potrawy
        public string Image { get; set; } = "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500";
    }
}