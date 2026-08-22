using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Clinica.Data.Migrations
{
    /// <inheritdoc />
    public partial class CitaRecibo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Citas_CatalogoEstadoCita_EstadoCitaCodigo",
                table: "Citas");

            migrationBuilder.CreateTable(
                name: "CitaRecibo",
                columns: table => new
                {
                    IdRecibo = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CitaId = table.Column<int>(type: "integer", nullable: false),
                    MontoNeto = table.Column<decimal>(type: "numeric", nullable: false),
                    Observaciones = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    MedioPago = table.Column<short>(type: "smallint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CitaRecibo", x => x.IdRecibo);
                    table.ForeignKey(
                        name: "FK_CitaRecibo_Citas_CitaId",
                        column: x => x.CitaId,
                        principalTable: "Citas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CitaRecibo_CitaId",
                table: "CitaRecibo",
                column: "CitaId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Citas_CatalogoEstadoCita_EstadoCitaCodigo",
                table: "Citas",
                column: "EstadoCitaCodigo",
                principalTable: "CatalogoEstadoCita",
                principalColumn: "Codigo",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Citas_CatalogoEstadoCita_EstadoCitaCodigo",
                table: "Citas");

            migrationBuilder.DropTable(
                name: "CitaRecibo");

            migrationBuilder.AddForeignKey(
                name: "FK_Citas_CatalogoEstadoCita_EstadoCitaCodigo",
                table: "Citas",
                column: "EstadoCitaCodigo",
                principalTable: "CatalogoEstadoCita",
                principalColumn: "Codigo",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
