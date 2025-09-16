using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Desenrola.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ProviderRepositoryFixsAddImage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageProfile",
                table: "Providers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageProfile",
                table: "AspNetUsers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImgUrl",
                table: "AspNetUsers",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageProfile",
                table: "Providers");

            migrationBuilder.DropColumn(
                name: "ImageProfile",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "ImgUrl",
                table: "AspNetUsers");
        }
    }
}
