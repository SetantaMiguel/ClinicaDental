using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Clinica.Data.Migrations
{
    /// <inheritdoc />
    public partial class UsuarioCreacion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UsuarioCreacion",
                table: "Pacientes",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "UsuarioCreacion",
                table: "Citas",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "UsuarioCreacion",
                table: "CitaRecibo",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "UsuarioCreacion",
                table: "CatalogoCitas",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "UsuarioCreacion",
                table: "AspNetUsers",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UsuarioCreacion",
                table: "Pacientes");

            migrationBuilder.DropColumn(
                name: "UsuarioCreacion",
                table: "Citas");

            migrationBuilder.DropColumn(
                name: "UsuarioCreacion",
                table: "CitaRecibo");

            migrationBuilder.DropColumn(
                name: "UsuarioCreacion",
                table: "CatalogoCitas");

            migrationBuilder.DropColumn(
                name: "UsuarioCreacion",
                table: "AspNetUsers");
        }
    }
}
