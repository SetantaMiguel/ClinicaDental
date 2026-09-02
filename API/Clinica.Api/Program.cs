using System.Text;
using Clinica.Core.Models.Identity;
using Clinica.Data;
using Clinica.Services.IServices;
using Clinica.Services.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ClinicaContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("SupaConnection")));

builder.Services.AddIdentity<Usuario, IdentityRole>()
    .AddEntityFrameworkStores<ClinicaContext>()
    .AddDefaultTokenProviders();

// Configuración de JWT    
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]!);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero // Para que el token expire exactamente a la hora
    };
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();

// Inyección de dependencias para servicios
builder.Services.AddScoped<IPacienteService, PacienteService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<ICatalogoCitaService, CatalogoCitaService>();
builder.Services.AddScoped<ICitasService, CitasService>();
builder.Services.AddScoped<ICitaReciboService, CitaReciboService>();
builder.Services.AddScoped<IMonedaService, MonedaService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirReact", policy =>
    {
        // policy.WithOrigins("http://localhost:5173") // El puerto por defecto de Vite
        //       .AllowAnyHeader()
        //       .AllowAnyMethod();

        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment() || true) // Pon 'true' temporalmente para forzarlo en producción
{
    app.UseDeveloperExceptionPage();
}
app.UseCors("PermitirReact");



app.UseSwagger();
app.MapOpenApi();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint(
        "/swagger/v1/swagger.json",
        "Clinica.Api v1"
    );
});

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
