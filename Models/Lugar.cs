using System.ComponentModel.DataAnnotations;

namespace GymStats.Models;

public class Lugar
{
    [Key]
    public int LugarID { get; set; }
    public string? Nombre { get; set; }
    public string? UsuarioID { get; set; }
    public virtual ICollection<Ejercicio> Ejercicios {get; set;}
}
