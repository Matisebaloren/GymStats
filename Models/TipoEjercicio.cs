using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GymStats.Models;

public class TipoEjercicio
{
    [Key]
    public int TipoEjercicioID { get; set; }
    public string? Nombre {get;set;}
    
    [Column(TypeName = "decimal(10, 2)")]
    public decimal Met {get; set;}
    public virtual ICollection<Ejercicio> Ejercicios {get; set;}
}
