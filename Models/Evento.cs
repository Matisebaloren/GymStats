using System.ComponentModel.DataAnnotations;

namespace GymStats.Models;

public class Evento
{
    [Key]
    public int EventoID { get; set; }
    public string? Nombre {get;set;}
    public virtual ICollection<Ejercicio> Ejercicios {get; set;}
}
