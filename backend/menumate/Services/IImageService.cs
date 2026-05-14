using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace menumate.Services
{
    public interface IImageService
    {
        Task<string> UploadImageAsync(IFormFile file, string folder);
        Task DeleteImageAsync(string imageUrl);
    }
}
