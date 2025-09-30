using System.ComponentModel;

namespace menumate.Models.Entities
{
    public class MenuItem
    {
        public enum FiscalCurrency
        {
            [Description("zł")]
            PLN,

            [Description("$")]
            USD,

            [Description("€")]
            EUR,

            [Description("£")]
            GBP,

            [Description("¥")]
            JPY,

            [Description("CHF")]
            CHF,

            [Description("A$")]
            AUD,

            [Description("C$")]
            CAD,

            [Description("¥")]
            CNY,

            [Description("₽")]
            RUB,

            [Description("₹")]
            INR,

            [Description("R$")]
            BRL,

            [Description("₩")]
            KRW,

            [Description("Mex$")]
            MXN
        }

        public Guid Id { get; set; }
        public Guid RestaurantId { get; set; }
        public string Name { get; set; }
        public float Price { get; set; }
        public FiscalCurrency Currency { get; set; }
        public int Calories { get; set; }
        public int Fats { get; set; }
        public int Carbs { get; set; }
        public int Proteins { get; set; }
        public string Allergens { get; set; }
        public string Description { get; set; }
        public string Image { get; set; } = "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500";
    }
}