namespace menumate.Models
{
    // backend/menumate/Models/AddUserDto.cs
    // Rejestracja nowego użytkownika (starsza wersja)
    public class AddUserDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string ImgPath { get; set; }
    }
}
