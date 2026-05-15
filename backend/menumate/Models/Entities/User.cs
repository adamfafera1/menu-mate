// backend\menumate\Models\Entities\User.cs

using Microsoft.AspNetCore.Identity;

namespace menumate.Models.Entities
{
    public class User : IdentityUser<Guid>
    {
        // Nazwa wyświetlana użytkownika
        public string? Name { get; set; }

        // Ścieżka do zdjęcia profilowego
        public string? ImgPath { get; set; } = "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500";

        // Rola użytkownika w systemie (np. User, RestaurantOwner, Admin)
        public string Role { get; set; } = "User";
    }
}
