using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GymStats.Migrations
{
    /// <inheritdoc />
    public partial class Ejercicio : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Deportista",
                table: "Deportista");

            migrationBuilder.RenameTable(
                name: "Deportista",
                newName: "Deportistas");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Deportistas",
                table: "Deportistas",
                column: "DeportistaID");

            migrationBuilder.CreateTable(
                name: "Ejercicios",
                columns: table => new
                {
                    EjercicioID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TipoEjercicioID = table.Column<int>(type: "int", nullable: false),
                    LugarID = table.Column<int>(type: "int", nullable: false),
                    Inicio = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Fin = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Observacion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EmocionInicio = table.Column<int>(type: "int", nullable: false),
                    EmocionFinal = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ejercicios", x => x.EjercicioID);
                    table.ForeignKey(
                        name: "FK_Ejercicios_Lugares_LugarID",
                        column: x => x.LugarID,
                        principalTable: "Lugares",
                        principalColumn: "LugarID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Ejercicios_TiposEjercicio_TipoEjercicioID",
                        column: x => x.TipoEjercicioID,
                        principalTable: "TiposEjercicio",
                        principalColumn: "TipoEjercicioID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Ejercicios_LugarID",
                table: "Ejercicios",
                column: "LugarID");

            migrationBuilder.CreateIndex(
                name: "IX_Ejercicios_TipoEjercicioID",
                table: "Ejercicios",
                column: "TipoEjercicioID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Ejercicios");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Deportistas",
                table: "Deportistas");

            migrationBuilder.RenameTable(
                name: "Deportistas",
                newName: "Deportista");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Deportista",
                table: "Deportista",
                column: "DeportistaID");
        }
    }
}
