using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Clinica.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateLastConnexion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "isEnabled",
                table: "AspNetUsers",
                newName: "IsEnabled");

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaUltimaConexion",
                table: "AspNetUsers",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FechaUltimaConexion",
                table: "AspNetUsers");

            migrationBuilder.RenameColumn(
                name: "IsEnabled",
                table: "AspNetUsers",
                newName: "isEnabled");
        }
    }
}
