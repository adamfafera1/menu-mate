// backend/menumate/Services/IImageService.cs
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace menumate.Services
{
    // Interfejs definiujący kontrakt dla serwisu zarządzania plikami graficznymi (zdjęciami) w aplikacji.
    // Umożliwia unifikację i separację logiki przechowywania plików (np. lokalnie lub w chmurze).
    public interface IImageService
    {
        // Asynchroniczne przesyłanie pliku binarnego do wskazanego folderu docelowego.
        // Zwraca pełny adres URL do zapisanego pliku.
        Task<string> UploadImageAsync(IFormFile file, string folder);

        // Asynchroniczne usuwanie pliku na podstawie jego pełnego adresu URL.
        Task DeleteImageAsync(string imageUrl);
    }
}
