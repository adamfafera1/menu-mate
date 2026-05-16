using menumate.Models;
using menumate.Models.Entities;
using menumate.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace menumate.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        // Usługa zarządzania użytkownikami z systemu ASP.NET Core Identity
        private readonly UserManager<User> _userManager;

        // Dostęp do konfiguracji aplikacji (np. kluczy JWT)
        private readonly IConfiguration _config;

        // Kontekst bazy danych aplikacji
        private readonly ApplicationDbContext _context;
        
        // Konstruktor kontrolera z wstrzykiwaniem zależności
        public AuthController(UserManager<User> userManager, IConfiguration config, ApplicationDbContext context)
        {
            _userManager = userManager;
            _config = config;
            _context = context;
        }

        // Rejestracja nowej tożsamości użytkownika. 
        // W przypadku wybrania roli 'RestaurantOwner', proces automatycznie inicjalizuje pusty profil restauracji przypisany do nowego konta.
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto registerDto)
        {
            // Utworzenie nowego użytkownika na podstawie danych z formularza
            var user = new User { 
                UserName = registerDto.UserName, 
                Email = registerDto.Email,
                Role = registerDto.Role
            };
            // Próba utworzenia konta z podanym hasłem (zabezpieczonym haszowaniem)
            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded) return BadRequest(result.Errors);

            // Automatyczne tworzenie rekordu w tabeli Restaurants dla nowo zarejestrowanych właścicieli
            if (registerDto.Role == "RestaurantOwner")
            {
                var restaurant = new Restaurant
                {
                    Id = Guid.NewGuid(),
                    Name = $"{registerDto.UserName}'s Restaurant",
                    Description = "Welcome to my restaurant! Please update this description.",
                    Location = "Please update your location",
                    Phone = "Please update your phone number",
                    ImagePath = "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500",
                    Rating = 0.0f,
                    OwnerId = user.Id
                };

                // Dodanie do bazy danych
                _context.Restaurants.Add(restaurant);
                await _context.SaveChangesAsync();

                return Ok(new { restaurantId = restaurant.Id });
            }

            return Ok();
        }

        // Uwierzytelnianie użytkownika i generowanie bezpiecznego tokena JWT (JSON Web Token).
        // Token zawiera informacje o tożsamości użytkownika (ID) oraz przypisanych mu uprawnieniach (Role).
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            // Weryfikacja istnienia użytkownika w bazie Identity i poprawności hasła
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
                return Unauthorized("Invalid credentials");
            
            // Definicja roszczeń (claims) zaszyfrowanych wewnątrz tokena
            var claims = new[] { 
                new Claim(ClaimTypes.Name, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role ?? "User")
            };
            
            // Przygotowanie klucza kryptograficznego na podstawie konfiguracji aplikacji
            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? ""));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Konstrukcja struktury tokena z określonym wystawcą (issuer), odbiorcą (audience) i czasem wygaśnięcia
            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
                );

            // Serializacja tokena do formatu tekstowego (Base64) gotowego do przesłania w nagłówku HTTP
            return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
        }
    }
}
