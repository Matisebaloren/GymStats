using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GymStats.Models;

public class Deportista
{
    [Key]
    public int DeportistaID { get; set; }
    public string? UsuarioID { get; set; }
    public string? NombreCompleto { get; set; }
    public DateTime FechaNacimiento { get; set; }
    [Column(TypeName = "decimal(10, 2)")]
    public decimal Altura { get; set; }
    [Column(TypeName = "decimal(10, 2)")]
    public decimal Peso { get; set; }
    public Genero Genero { get; set; }

}

public enum Genero
{
    Masculino = 1,
    Femenino
}