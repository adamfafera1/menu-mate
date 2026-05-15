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
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _config;
        private readonly ApplicationDbContext _context;
        
        public AuthController(UserManager<User> userManager, IConfiguration config, ApplicationDbContext context)
        {
            _userManager = userManager;
            _config = config;
            _context = context;
        }

        // Rejestracja nowego użytkownika
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto registerDto)
        {
            var user = new User { 
                UserName = registerDto.UserName, 
                Email = registerDto.Email,
                Role = registerDto.Role
            };
            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded) return BadRequest(result.Errors);

            // Automatyczne tworzenie profilu restauracji dla kont typu RestaurantOwner
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

                _context.Restaurants.Add(restaurant);
                await _context.SaveChangesAsync();

                return Ok(new { restaurantId = restaurant.Id });
            }

            return Ok();
        }

        // Logowanie użytkownika i generowanie tokena JWT
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            // Wyszukanie użytkownika i weryfikacja hasła
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
                return Unauthorized("Invalid credentials");
            
            // Przygotowanie roszczeń (claims) dla tokena
            var claims = new[] { 
                new Claim(ClaimTypes.Name, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role ?? "User")
            };
            
            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? ""));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Tworzenie struktury tokena JWT
            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
                );

            // Zwrócenie wygenerowanego tokena
            return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
        }
        

    }
}
