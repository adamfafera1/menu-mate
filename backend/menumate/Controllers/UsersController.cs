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

            if (!string.IsNullOrEmpty(user.ImgPath))
            {
                await imageService.DeleteImageAsync(user.ImgPath);
            }

            var imageUrl = await imageService.UploadImageAsync(file, "users");

            user.ImgPath = imageUrl;
            dbContext.Users.Update(user);
            await dbContext.SaveChangesAsync();

            return Ok(new { imgPath = user.ImgPath });
        }
    }
}
