using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Desenrola.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class FixEntityCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int[]>(
                name: "Categories",
                table: "Providers",
                type: "integer[]",
                nullable: false,
                defaultValue: new int[0]);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Categories",
                table: "Providers");
        }
    }
}
