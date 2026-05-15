using menumate.Data;
using menumate.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using menumate.Services;
using System.IO;
using System.Threading.Tasks;
using menumate.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.OutputCaching;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;


namespace menumate.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;
        private readonly IImageService imageService;

        public UsersController(ApplicationDbContext dbContext, IImageService imageService)
        {
            this.dbContext = dbContext;
            this.imageService = imageService;
        }

        // Pobranie listy wszystkich użytkowników z bazy danych
        [HttpGet]
        public IActionResult GetUsers()
        {
            return Ok(dbContext.Users.ToList());
        }

        // Pobranie danych konkretnego użytkownika na podstawie identyfikatora ID (Guid)
        [HttpGet]
        [Route("{id:guid}")]
        public IActionResult GetUserById(Guid id)
        {
            var user = dbContext.Users.Find(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        // Dodanie nowego użytkownika do bazy danych
        [HttpPost]
        public IActionResult AddUser(AddUserDto addUserDto)
        {
            var user = new User()
            {
                Name = addUserDto.Name,
                ImgPath = addUserDto.ImgPath,
            };

            dbContext.Users.Add(user);
            dbContext.SaveChanges();
            return Ok(user);
        }

        // Aktualizacja danych istniejącego użytkownika (wymaga autoryzacji)
        [HttpPut]
        [Route("{id:guid}")]
        [Authorize]
        public IActionResult UpdateUser(Guid id, UpdateUserDto updateUserDto)
        {
            var user = dbContext.Users.Find(id);

            if (user == null)
            {
                return NotFound();
            }

            user.Name = updateUserDto.Name;
            user.ImgPath = updateUserDto.ImgPath;

            dbContext.Users.Update(user);
            dbContext.SaveChanges();

            return Ok(user);
        }

        // Usunięcie użytkownika z bazy danych na podstawie ID (wymaga autoryzacji)
        [HttpDelete]
        [Authorize]
        public IActionResult DeleteUser(Guid id) 
        {
            var user = dbContext.Users.Find(id);

            if(user == null)
            {
                return NotFound();
            }

            dbContext.Users.Remove(user);
            dbContext.SaveChanges();
            return Ok();
        }

        // Pobranie danych obecnie zalogowanego użytkownika na podstawie tokena JWT
        [HttpGet]
        [Route("current")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IActionResult GetCurrentUser()
        {
            // Wyciągnięcie ID użytkownika z tokena
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;

            if (userId == null)
            {
                return Unauthorized();
            }

            var user = dbContext.Users.Find(Guid.Parse(userId));

            if (user == null)
            {
                return NotFound();
            }

            // Zwrócenie tylko niezbędnych danych użytkownika
            return Ok(new {
                user.Id,
                user.Name,
                user.Email,
                user.ImgPath
            });
        }
        [HttpPost("upload-image")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            // Sprawdzenie, czy plik został przesłany i nie jest pusty
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            // Pobranie ID użytkownika z roszczeń (claims) tokena JWT
            var userIdString = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            if (userIdString == null) return Unauthorized();

            // Konwersja ID na format Guid i wyszukanie użytkownika w bazie danych
            var userId = Guid.Parse(userIdString);
            var user = await dbContext.Users.FindAsync(userId);
            if (user == null) return NotFound();

            // Usunięcie starego pliku z serwera, jeśli użytkownik posiada już przypisane zdjęcie
            if (!string.IsNullOrEmpty(user.ImgPath))
            {
                await imageService.DeleteImageAsync(user.ImgPath);
            }

            // Przesłanie nowego zdjęcia za pomocą usługi imageService do folderu "users"
            var imageUrl = await imageService.UploadImageAsync(file, "users");

            // Aktualizacja ścieżki do zdjęcia w obiekcie użytkownika i zapisanie zmian w bazie
            user.ImgPath = imageUrl;
            dbContext.Users.Update(user);
            await dbContext.SaveChangesAsync();

            // Zwrócenie nowej ścieżki do zdjęcia w odpowiedzi
            return Ok(new { imgPath = user.ImgPath });
        }
    }
}
