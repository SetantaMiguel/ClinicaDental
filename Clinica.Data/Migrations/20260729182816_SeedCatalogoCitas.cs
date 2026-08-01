using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Clinica.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedCatalogoCitas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "CatalogoCitas",
                columns: new[] { "NombreCita", "Descripcion", "Vigente" },
                values: new object[,]
                {
                    { "Valoración Inicial", "Primera evaluación del paciente", true },
                    { "Mantenimiento", "Cita de mantenimiento preventivo", true },
                    { "Procedimiento", "Cita para procedimientos clínicos", true },
                    { "Control", "Seguimiento y revisión posterior", true },
                    { "Emergencia", "Atención urgente o de emergencia", true }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "CatalogoCitas",
                keyColumn: "NombreCita",
                keyValues: new object[]
                {
                    "Valoración Inicial",
                    "Mantenimiento",
                    "Procedimiento",
                    "Control",
                    "Emergencia"
                });
        }
    }
}
