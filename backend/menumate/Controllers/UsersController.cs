using menumate.Data;
using menumate.Models;
using menumate.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;

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
        public IActionResult GetCurrentUser()
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == "nameid")?.Value;

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
    }
}
