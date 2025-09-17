using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Desenrola.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class FixEntityBaseEntity2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "ProviderServices");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "ProviderServices",
                newName: "CreatedOn");

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedOn",
                table: "ProviderServices",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ModifiedOn",
                table: "ProviderServices");

            migrationBuilder.RenameColumn(
                name: "CreatedOn",
                table: "ProviderServices",
                newName: "CreatedAt");

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "ProviderServices",
                type: "timestamp with time zone",
                nullable: true);
        }
    }
}
