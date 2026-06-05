using Clinica.Core.Models;
using Clinica.Core.Models.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Clinica.Data;

public class ClinicaContext : IdentityDbContext<Usuario>
{
    public ClinicaContext(DbContextOptions<ClinicaContext> options)
        : base(options)
    {
    }

    public DbSet<Pacientes> Pacientes { get; set; }
 
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      base.OnModelCreating(modelBuilder);

      modelBuilder.Entity<Pacientes>(entity =>
      {
        entity.ToTable("Pacientes");
        entity.HasKey(e => e.Id);
        entity.Property(e => e.Id).ValueGeneratedOnAdd();
        entity.Property(e => e.Nombre)
            .IsRequired()
            .HasMaxLength(100);
        entity.Property(e => e.Apellido)
            .IsRequired()
            .HasMaxLength(100);
        entity.Property(e => e.FechaNacimiento)
            .IsRequired(false);
        entity.Property(e => e.Telefono)
            .HasMaxLength(20);

        entity.Property(e => e.Email)
            .HasMaxLength(200);
      });

    // Configuración para que todas las fechas sean tratadas como UTC
    foreach (var entityType in modelBuilder.Model.GetEntityTypes())
    {
        var properties = entityType.GetProperties()
            .Where(p => p.ClrType == typeof(DateTime) || p.ClrType == typeof(DateTime?));

        foreach (var property in properties)
        {
            property.SetValueConverter(new Microsoft.EntityFrameworkCore.Storage.ValueConversion.ValueConverter<DateTime, DateTime>(
                v => v.Kind == DateTimeKind.Utc ? v : v.ToUniversalTime(),
                v => DateTime.SpecifyKind(v, DateTimeKind.Utc)));
        }
    }
 
      
    }
}

