using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Clinica.Data.Migrations
{
    /// <inheritdoc />
    public partial class CitaReciboMoneda : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "FIngreso",
                table: "CitaRecibo",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "IdMoneda",
                table: "CitaRecibo",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Moneda",
                columns: table => new
                {
                    IdMoneda = table.Column<int>(type: "integer", maxLength: 1, nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MonedaSimbolo = table.Column<string>(type: "character varying(3)", maxLength: 3, nullable: false),
                    MonedaDescripcion = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Moneda", x => x.IdMoneda);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CitaRecibo_IdMoneda",
                table: "CitaRecibo",
                column: "IdMoneda");

            migrationBuilder.AddForeignKey(
                name: "FK_CitaRecibo_Moneda_IdMoneda",
                table: "CitaRecibo",
                column: "IdMoneda",
                principalTable: "Moneda",
                principalColumn: "IdMoneda",
                onDelete: ReferentialAction.Restrict);

                            
            migrationBuilder.InsertData(
                table: "Moneda",
                columns: ["IdMoneda", "MonedaSimbolo", "MonedaDescripcion"],
                values: new object[,]
                {
                    { "1", "C$", "Cordobas" },
                    { "2", "$", "Dolares" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CitaRecibo_Moneda_IdMoneda",
                table: "CitaRecibo");

            migrationBuilder.DropTable(
                name: "Moneda");

            migrationBuilder.DropIndex(
                name: "IX_CitaRecibo_IdMoneda",
                table: "CitaRecibo");

            migrationBuilder.DropColumn(
                name: "FIngreso",
                table: "CitaRecibo");

            migrationBuilder.DropColumn(
                name: "IdMoneda",
                table: "CitaRecibo");
        }
    }
}
