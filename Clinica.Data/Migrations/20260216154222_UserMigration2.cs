using System;
using Clinica.Core.Models.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Clinica.Data.Migrations
{
    /// <inheritdoc />
    public partial class UserMigration2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "FechaCreacion",
                table: "AspNetUsers",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaModificacion",
                table: "AspNetUsers",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<bool>(
                name: "isEnabled",
                table: "AspNetUsers",
                type: "bit",
                nullable: false,
                defaultValue: false);

    var adminId = Guid.NewGuid().ToString();
    var securityStamp = Guid.NewGuid().ToString();
    var concurrencyStamp = Guid.NewGuid().ToString();
    
    var hasher = new Microsoft.AspNetCore.Identity.PasswordHasher<Microsoft.AspNetCore.Identity.IdentityUser>();
    var passwordHash = hasher.HashPassword(null, "Admin123!");


    migrationBuilder.InsertData(
        table: "AspNetUsers",
        columns:
        [
            "Id", 
            "UserName", 
            "NormalizedUserName", 
            "Email", 
            "NormalizedEmail", 
            "EmailConfirmed", 
            "PasswordHash", 
            "SecurityStamp", 
            "ConcurrencyStamp", 
            "PhoneNumber", 
            "PhoneNumberConfirmed", 
            "TwoFactorEnabled", 
            "LockoutEnabled", 
            "AccessFailedCount",
            "isEnabled",
            "FechaCreacion",
            "FechaModificacion",
        ],
        values:
        [
            adminId,
            "admin",
            "ADMIN", // ¡Siempre en Mayúsculas!
            "admin@dentalcloud.com",
            "ADMIN@DENTALCLOUD.COM", // ¡Siempre en Mayúsculas!
            true, // Email confirmado
            passwordHash,
            securityStamp,
            concurrencyStamp,
            null, // PhoneNumber
            false,
            false,
            true, // LockoutEnabled
            0,
            true, // EstadoActivo
            DateTime.Now,
            DateTime.Now,        
        ]
    );
                
    }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FechaCreacion",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "FechaModificacion",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "isEnabled",
                table: "AspNetUsers");

            migrationBuilder.Sql("DELETE FROM AspNetUsers WHERE UserName = 'admin'");
        }

    }
}
