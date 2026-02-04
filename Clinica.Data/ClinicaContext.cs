using Clinica.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Clinica.Data;

public class ClinicaContext : DbContext
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
    }
}

