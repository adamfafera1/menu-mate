namespace menumate.Models
{
    // backend/menumate/Models/RegisterDto.cs
    // Rejestracja nowego konta
    public class RegisterDto
    {
        public required string Email { get; set; }
        public required string UserName { get; set; }
        public required string Password { get; set; }
        public string Role { get; set; } = "User";
    }
}