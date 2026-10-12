using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Clinica.Data.Migrations
{
    /// <inheritdoc />
    public partial class DetalleTipoCitas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Citas_CatalogoCitas_TipoCitaId",
                table: "Citas");

            migrationBuilder.DropIndex(
                name: "IX_Citas_TipoCitaId",
                table: "Citas");

            migrationBuilder.DropColumn(
                name: "TipoCitaId",
                table: "Citas");

            migrationBuilder.AddColumn<int>(
                name: "CatalogoCitasId",
                table: "Citas",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "CitaDetalleCatalogo",
                columns: table => new
                {
                    CitaId = table.Column<int>(type: "integer", nullable: false),
                    CatalogoCitaId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CitaDetalleCatalogo", x => new { x.CitaId, x.CatalogoCitaId });
                    table.ForeignKey(
                        name: "FK_CitaDetalleCatalogo_CatalogoCitas_CatalogoCitaId",
                        column: x => x.CatalogoCitaId,
                        principalTable: "CatalogoCitas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CitaDetalleCatalogo_Citas_CitaId",
                        column: x => x.CitaId,
                        principalTable: "Citas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Citas_CatalogoCitasId",
                table: "Citas",
                column: "CatalogoCitasId");

            migrationBuilder.CreateIndex(
                name: "IX_CitaDetalleCatalogo_CatalogoCitaId",
                table: "CitaDetalleCatalogo",
                column: "CatalogoCitaId");

            migrationBuilder.AddForeignKey(
                name: "FK_Citas_CatalogoCitas_CatalogoCitasId",
                table: "Citas",
                column: "CatalogoCitasId",
                principalTable: "CatalogoCitas",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Citas_CatalogoCitas_CatalogoCitasId",
                table: "Citas");

            migrationBuilder.DropTable(
                name: "CitaDetalleCatalogo");

            migrationBuilder.DropIndex(
                name: "IX_Citas_CatalogoCitasId",
                table: "Citas");

            migrationBuilder.DropColumn(
                name: "CatalogoCitasId",
                table: "Citas");

            migrationBuilder.AddColumn<int>(
                name: "TipoCitaId",
                table: "Citas",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Citas_TipoCitaId",
                table: "Citas",
                column: "TipoCitaId");

            migrationBuilder.AddForeignKey(
                name: "FK_Citas_CatalogoCitas_TipoCitaId",
                table: "Citas",
                column: "TipoCitaId",
                principalTable: "CatalogoCitas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
