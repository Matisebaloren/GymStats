using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GymStats.Migrations
{
    /// <inheritdoc />
    public partial class modelsUpdate_100 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ejercicios_TiposEjercicio_TipoEjercicioID",
                table: "Ejercicios");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TiposEjercicio",
                table: "TiposEjercicio");

            migrationBuilder.RenameTable(
                name: "TiposEjercicio",
                newName: "TiposEjercicios");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TiposEjercicios",
                table: "TiposEjercicios",
                column: "TipoEjercicioID");

            migrationBuilder.AddForeignKey(
                name: "FK_Ejercicios_TiposEjercicios_TipoEjercicioID",
                table: "Ejercicios",
                column: "TipoEjercicioID",
                principalTable: "TiposEjercicios",
                principalColumn: "TipoEjercicioID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ejercicios_TiposEjercicios_TipoEjercicioID",
                table: "Ejercicios");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TiposEjercicios",
                table: "TiposEjercicios");

            migrationBuilder.RenameTable(
                name: "TiposEjercicios",
                newName: "TiposEjercicio");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TiposEjercicio",
                table: "TiposEjercicio",
                column: "TipoEjercicioID");

            migrationBuilder.AddForeignKey(
                name: "FK_Ejercicios_TiposEjercicio_TipoEjercicioID",
                table: "Ejercicios",
                column: "TipoEjercicioID",
                principalTable: "TiposEjercicio",
                principalColumn: "TipoEjercicioID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
