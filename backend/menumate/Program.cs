using menumate.Data;
using Microsoft.AspNetCore.Connections;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using menumate.Models.Entities;
using menumate.Services;
using Azure.Storage.Blobs;

var builder = WebApplication.CreateBuilder(args);

// Wczytanie dodatkowej konfiguracji dla usługi Azure Storage z zewnętrznego pliku JSON
builder.Configuration.AddJsonFile("azurestorage.json", optional: true, reloadOnChange: true);

// Konfiguracja stałego adresu URL dla hosta webowego
builder.WebHost.UseUrls("https://localhost:7084");

// Rejestracja usług kontrolerów API
builder.Services.AddControllers();

// Konfiguracja klienta dla usługi geokodowania Nominatim (OpenStreetMap)
builder.Services.AddHttpClient("Nominatim", client =>
{
    client.BaseAddress = new Uri("https://nominatim.openstreetmap.org/");
    // Wymagany nagłówek dla identyfikacji aplikacji w API Nominatim
    client.DefaultRequestHeaders.UserAgent.ParseAdd("MenuMate/1.0 (contact@menumate.app)");
});

// Rejestracja narzędzi do generowania dokumentacji Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Konfiguracja klienta Azure Blob Storage jako Singleton (jedna instancja na cykl życia aplikacji)
builder.Services.AddSingleton(x => new BlobServiceClient(builder.Configuration["AzureStorage:ConnectionString"]));

// Rejestracja serwisu obsługi zdjęć w kontenerze DI (Dependency Injection)
builder.Services.AddScoped<IImageService, AzureBlobStorageService>();

// Konfiguracja połączenia z bazą danych SQL Server przy użyciu Entity Framework Core
builder.Services.AddDbContext<ApplicationDbContext>(options => 
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Definicja polityki CORS umożliwiającej komunikację z frontendem działającym na porcie 4200
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => {
            policy.WithOrigins("http://localhost:4200")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials(); // Zezwolenie na przesyłanie poświadczeń (np. ciasteczek)
                        });
});


// Konfiguracja systemu tożsamości (Identity) dla użytkowników z wykorzystaniem GUID jako klucza głównego
builder.Services.AddIdentity<User, IdentityRole<Guid>>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

// Pobranie klucza bezpieczeństwa JWT z konfiguracji
var secretKey = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key is not configured");

// Konfiguracja uwierzytelniania opartego na tokenach JWT (JSON Web Token)
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        // Definicja parametrów walidacji tokenu przychodzącego
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,        // Weryfikacja wystawcy tokenu
            ValidateAudience = true,      // Weryfikacja odbiorcy tokenu
            ValidateLifetime = true,      // Sprawdzenie daty ważności
            ValidateIssuerSigningKey = true,
            ValidIssuer = "MenuMate",
            ValidAudience = "MenuMateUsers",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)) // Klucz symetryczny do podpisu
        };
    });

var app = builder.Build();

// Konfiguracja interfejsu Swagger dostępnego wyłącznie w środowisku deweloperskim
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Obsługa plików statycznych (np. obrazów lokalnych)
app.UseStaticFiles();

// Automatyczne przekierowanie żądań HTTP na HTTPS
app.UseHttpsRedirection();

// Zastosowanie zdefiniowanej wcześniej polityki CORS
app.UseCors("AllowFrontend");

// Aktywacja mechanizmów uwierzytelniania i autoryzacji w potoku żądań
app.UseAuthentication();
app.UseAuthorization();

// Mapowanie tras kontrolerów API
app.MapControllers();

// Uruchomienie aplikacji
app.Run();
