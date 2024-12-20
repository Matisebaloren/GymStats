using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GymStats.Migrations
{
    /// <inheritdoc />
    public partial class modelsUpdate_203_EjercicioFixUsuarioID : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ejercicios_Deportistas_deportistaID",
                table: "Ejercicios");

            migrationBuilder.DropIndex(
                name: "IX_Ejercicios_deportistaID",
                table: "Ejercicios");

            migrationBuilder.DropColumn(
                name: "deportistaID",
                table: "Ejercicios");

            migrationBuilder.AddColumn<string>(
                name: "UsuarioID",
                table: "Ejercicios",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UsuarioID",
                table: "Ejercicios");

            migrationBuilder.AddColumn<int>(
                name: "deportistaID",
                table: "Ejercicios",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Ejercicios_deportistaID",
                table: "Ejercicios",
                column: "deportistaID");

            migrationBuilder.AddForeignKey(
                name: "FK_Ejercicios_Deportistas_deportistaID",
                table: "Ejercicios",
                column: "deportistaID",
                principalTable: "Deportistas",
                principalColumn: "DeportistaID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
