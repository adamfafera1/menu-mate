using Microsoft.AspNetCore.Identity;

namespace menumate.Models.Entities
{
    public class User : IdentityUser<Guid>
    {
        public string? Name { get; set; }
        public string? ImgPath { get; set; } = "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500";
        public string Role { get; set; } = "User";
    }
}
