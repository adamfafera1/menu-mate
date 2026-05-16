namespace menumate.Models
{
    // backend/menumate/Models/UpdateUserDto.cs
    // Zarządzanie danymi użytkownika
    public class UpdateUserDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string ImgPath { get; set; }
    }
}
