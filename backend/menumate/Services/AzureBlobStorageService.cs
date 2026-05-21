// backend/menumate/Services/AzureBlobStorageService.cs
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Threading.Tasks;

namespace menumate.Services
{
    // Usługa integracyjna z Azure Blob Storage odpowiedzialna za zarządzanie plikami binarnymi (zdjęciami)
    public class AzureBlobStorageService : IImageService
    {
        // Klient dedykowany do operacji na konkretnym kontenerze obiektów w chmurze Azure
        private readonly BlobContainerClient _containerClient;

        // Inicjalizacja klienta kontenera przy użyciu wstrzykiwanej konfiguracji oraz globalnego klienta BlobServiceClient
        public AzureBlobStorageService(IConfiguration configuration, BlobServiceClient blobServiceClient)
        {
            var containerName = configuration["AzureStorage:ContainerName"] ?? "uploads";
            _containerClient = blobServiceClient.GetBlobContainerClient(containerName);
        }

        // Asynchroniczne przesyłanie pliku graficznego do określonego folderu (katalogu wirtualnego) w Azure Blob Storage.
        // Zapewnia automatyczne utworzenie kontenera, wygenerowanie unikalnej nazwy pliku (UUID) oraz poprawne ustawienie nagłówków typu MIME.
        public async Task<string> UploadImageAsync(IFormFile file, string folder)
        {
            // Upewnienie się, że kontener istnieje i posiada uprawnienia dostępu publicznego do pojedynczych obiektów (Blob)
            await _containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob);

            var extension = Path.GetExtension(file.FileName);
            var fileName = $"{Guid.NewGuid()}{extension}";
            var blobName = $"{folder}/{fileName}";

            var blobClient = _containerClient.GetBlobClient(blobName);

            // Odczyt strumienia wejściowego przesłanego pliku i transfer do chmury
            using (var stream = file.OpenReadStream())
            {
                await blobClient.UploadAsync(stream, new BlobHttpHeaders { ContentType = file.ContentType });
            }

            // Zwrócenie pełnego, publicznie dostępnego adresu URI do zapisanego pliku
            return blobClient.Uri.ToString();
        }

        // Asynchroniczne usuwanie pliku graficznego z kontenera w chmurze Azure na podstawie pełnego adresu URI.
        // Wyodrębnia względną ścieżkę do obiektu (Blob Name) i wykonuje operację bezpiecznego usunięcia.
        public async Task DeleteImageAsync(string imageUrl)
        {
            if (string.IsNullOrEmpty(imageUrl)) return;

            try
            {
                var uri = new Uri(imageUrl);
                // Konwersja segmentów URI w celu uzyskania poprawnej ścieżki i dekodowanie znaków specjalnych (np. %2F na ukośniki)
                var blobName = string.Join("", uri.Segments[2..]).Replace("%2F", "/"); 
                // Segments[0] to "/", Segments[1] to nazwa kontenera, a Segments[2..] stanowi ścieżkę do pliku
                
                var blobClient = _containerClient.GetBlobClient(blobName);
                await blobClient.DeleteIfExistsAsync();
            }
            catch
            {
                // Ciche wygaszenie wyjątku w przypadku niepowodzenia operacji usuwania (np. brak łączności z siecią)
            }
        }
    }
}
