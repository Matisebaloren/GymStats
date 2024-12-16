using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GymStats.Migrations
{
    /// <inheritdoc />
    public partial class modelsUpdate_200_Evento : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "EventoID",
                table: "Ejercicios",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Eventos",
                columns: table => new
                {
                    EventoID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Eventos", x => x.EventoID);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Ejercicios_EventoID",
                table: "Ejercicios",
                column: "EventoID");

            migrationBuilder.AddForeignKey(
                name: "FK_Ejercicios_Eventos_EventoID",
                table: "Ejercicios",
                column: "EventoID",
                principalTable: "Eventos",
                principalColumn: "EventoID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ejercicios_Eventos_EventoID",
                table: "Ejercicios");

            migrationBuilder.DropTable(
                name: "Eventos");

            migrationBuilder.DropIndex(
                name: "IX_Ejercicios_EventoID",
                table: "Ejercicios");

            migrationBuilder.DropColumn(
                name: "EventoID",
                table: "Ejercicios");
        }
    }
}
