using menumate.Data;
using menumate.Models;
using menumate.Models.Entities;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace menumate.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;

        public ReviewsController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        // Pobranie listy wszystkich recenzji restauracji
        [HttpGet]
        public IActionResult GetReviews()
        {
            return Ok(dbContext.Reviews.ToList());
        }

        // Pobranie wszystkich recenzji dla danej restauracji
        [HttpGet]
        [Route("{id:guid}")]
        public IActionResult GetReviewByRestaurantId(Guid id)
        {
            var review = dbContext.Reviews.Where(item => item.RestaurantId == id);

            if (review == null) 
            {
                return NotFound();
            }

            return Ok(review);
        }

        // Pobranie recenzji wystawionych przez konkretnego użytkownika
        [HttpGet]
        [Route("user/{id:guid}")]
        public IActionResult GetReviewsByUserId(Guid id)
        {
            var review = dbContext.Reviews
                .Include(r => r.Restaurant)
                .Where(item => item.UserId == id)
                .ToList();

            return Ok(review);
        }

        // Dodanie nowej recenzji restauracji
        [HttpPost]
        public IActionResult AddReview(AddReviewDto addReviewDto)
        {
            var reviewEntity = new Review()
            {
                RestaurantId = addReviewDto.RestaurantId,
                UserId = addReviewDto.UserId,
                UserName = addReviewDto.UserName,
                UserImagePath = addReviewDto.UserImagePath,
                Title = addReviewDto.Title,
                Description = addReviewDto.Description,
                Rating = addReviewDto.Rating
            };

            dbContext.Reviews.Add(reviewEntity);
            dbContext.SaveChanges();
            return Ok(reviewEntity);
        }

        // Usunięcie recenzji restauracji
        [HttpDelete]    
        public IActionResult DeleteReview(Guid id)
        {
            var reviewEntity = dbContext.Reviews.Find(id);

            if (reviewEntity == null)
            {
                return NotFound();
            }

            dbContext.Reviews.Remove(reviewEntity);
            dbContext.SaveChanges();
            return Ok();
        }


    }
}
