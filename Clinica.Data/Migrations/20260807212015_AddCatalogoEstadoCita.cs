using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Clinica.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddCatalogoEstadoCita : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_CatalogoEstadoCita",
                table: "CatalogoEstadoCita");

            migrationBuilder.DeleteData(
                table: "CatalogoEstadoCita",
                keyColumn: "Id",
                keyColumnType: "integer",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "CatalogoEstadoCita",
                keyColumn: "Id",
                keyColumnType: "integer",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "CatalogoEstadoCita",
                keyColumn: "Id",
                keyColumnType: "integer",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "CatalogoEstadoCita",
                keyColumn: "Id",
                keyColumnType: "integer",
                keyValue: 4);

            migrationBuilder.DropColumn(
                name: "Id",
                table: "CatalogoEstadoCita");

            migrationBuilder.AddColumn<string>(
                name: "EstadoCitaCodigo",
                table: "Citas",
                type: "character varying(1)",
                maxLength: 1,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CatalogoEstadoCita",
                table: "CatalogoEstadoCita",
                column: "Codigo");

            migrationBuilder.CreateIndex(
                name: "IX_Citas_EstadoCitaCodigo",
                table: "Citas",
                column: "EstadoCitaCodigo");

            migrationBuilder.AddForeignKey(
                name: "FK_Citas_CatalogoEstadoCita_EstadoCitaCodigo",
                table: "Citas",
                column: "EstadoCitaCodigo",
                principalTable: "CatalogoEstadoCita",
                principalColumn: "Codigo",
                onDelete: ReferentialAction.Restrict);
            
            migrationBuilder.InsertData(
                table: "CatalogoEstadoCita",
                columns: ["Codigo", "Descripcion", "Estado"],
                values: new object[,]
                {
                    { "A", "Atendido", true },
                    { "P", "Pendiente", true },
                    { "C", "Cancelado", true },
                    { "R", "Reagendado", true }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {


        }
    }
}
