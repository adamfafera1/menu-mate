using menumate.Data;
using menumate.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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

        public UsersController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public IActionResult GetUsers()
        {
            return Ok(dbContext.Users.ToList());
        }

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

        [HttpGet]
        [Route("current")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IActionResult GetCurrentUser()
        {
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
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var userIdString = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            if (userIdString == null) return Unauthorized();

            var userId = Guid.Parse(userIdString);
            var user = await dbContext.Users.FindAsync(userId);
            if (user == null) return NotFound();

            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "users");
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            var extension = Path.GetExtension(file.FileName);
            var fileName = $"{userId}{extension}";
            var filePath = Path.Combine(folderPath, fileName);

            var existingFiles = Directory.GetFiles(folderPath, $"{userId}.*");
            foreach (var existingFile in existingFiles)
            {
                System.IO.File.Delete(existingFile);
            }

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            user.ImgPath = $"/uploads/users/{fileName}";
            dbContext.Users.Update(user);
            await dbContext.SaveChangesAsync();

            return Ok(new { imgPath = user.ImgPath });
        }
    }
}
