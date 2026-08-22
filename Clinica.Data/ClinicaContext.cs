using Clinica.Core.Models;
using Clinica.Core.Models.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Clinica.Data;

public class ClinicaContext(DbContextOptions<ClinicaContext> options) : IdentityDbContext<Usuario>(options)
{
    public DbSet<Pacientes> Pacientes { get; set; }
    public DbSet<CatalogoCitas> CatalogoCitas { get; set; }
    public DbSet<CatalogoEstadoCita> CatalogoEstadoCita { get; set; }
    public DbSet<Citas> Citas { get; set; }
    public DbSet<CitaRecibo> CitasRecibo { get; set; }
    public DbSet<Moneda> Monedas { get; set; }

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

        modelBuilder.Entity<CatalogoCitas>(entity =>
        {
            entity.ToTable("CatalogoCitas");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.NombreCita)
              .IsRequired()
              .HasMaxLength(100);
            entity.Property(e => e.Descripcion)
              .IsRequired()
              .HasMaxLength(500);
            entity.Property(e => e.Vigente)
              .IsRequired();
        });

        modelBuilder.Entity<CatalogoEstadoCita>(entity =>
        {
            entity.ToTable("CatalogoEstadoCita");
            entity.HasKey(e => e.Codigo);
            entity.Property(e => e.Codigo)
                .IsRequired()
                .HasMaxLength(1);
            entity.Property(e => e.Descripcion)
                .IsRequired()
                .HasMaxLength(30);
            entity.Property(e => e.Estado)
                .IsRequired();
        });

        modelBuilder.Entity<Moneda>(entity =>
        {
            entity.ToTable("Moneda");
            entity.HasKey(e => e.IdMoneda);
            entity.Property(e => e.IdMoneda)
            .IsRequired()
            .HasMaxLength(1);
            entity.Property(e=>e.MonedaSimbolo)
            .IsRequired()
            .HasMaxLength(3);
            entity.Property(e=>e.MonedaDescripcion)
            .IsRequired()
            .HasMaxLength(10);
        });

        modelBuilder.Entity<CitaRecibo>(entity =>
        {
            entity.ToTable("CitaRecibo");
            entity.HasKey(e => e.IdRecibo);
            entity.Property(e => e.IdRecibo).ValueGeneratedOnAdd();
            entity.Property(e => e.CitaId)
                .IsRequired();
            entity.Property(e => e.MontoNeto)
                .IsRequired();
            entity.Property(e => e.Observaciones)
                .HasMaxLength(500);
            entity.Property(e => e.MedioPago)
                .IsRequired();

            entity.HasOne(cr => cr.Cita)
                .WithMany()
                .HasForeignKey(cr => cr.CitaId)
                .OnDelete(DeleteBehavior.Cascade); // Si se elimina una cita, se eliminan sus recibos asociados

            entity.HasOne(m => m.Moneda)
            .WithMany()
            .HasForeignKey(m=>m.IdMoneda)
            .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Citas>(entity =>
            {
                // 1. Nombre de la tabla y clave primaria
                entity.ToTable("Citas");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();

                // 2. Propiedades obligatorias
                entity.Property(e => e.FechaInicio)
                    .IsRequired();

                entity.Property(e => e.FechaFin)
                    .IsRequired();

                // 3. Configuración explícita de la relación (Uno a Muchos)
                entity.HasOne(c => c.TipoCita)
                    .WithMany(tc => tc.ListaCitas)
                    .HasForeignKey(c => c.TipoCitaId)
                    .OnDelete(DeleteBehavior.Restrict); // Evita borrar todas las citas si se elimina un tipo de cita

                entity.HasOne(c => c.Paciente)
                    .WithMany(p => p.ListaCitas)
                    .HasForeignKey(c => c.PacienteId)
                    .OnDelete(DeleteBehavior.Restrict); // Evita borrar todas las citas si se elimina un paciente
                    
                entity.HasOne(c => c.Recibo)
                    .WithOne(r => r.Cita)
                    .HasForeignKey<CitaRecibo>(r => r.CitaId)
                    .OnDelete(DeleteBehavior.Restrict);
                    
                entity.HasOne(c => c.EstadoCita)
                .WithMany() // No hay colección inversa en CatalogoEstadoCita
                .HasForeignKey(c => c.EstadoCitaCodigo)
                .OnDelete(DeleteBehavior.Restrict); // Evita borrar todas las citas si se elimina un estado de cita
            });


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

