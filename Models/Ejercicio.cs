using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GymStats.Models;

public class Ejercicio
{
    [Key]
    public int EjercicioID { get; set; }
    public int TipoEjercicioID { get; set; }
    public int LugarID { get; set; }
    public int EventoID { get; set; }
    public DateTime Inicio { get; set; }
    public DateTime Fin { get; set; }
    public string? Observacion {get;set;}
    public EstadoEmocional EmocionInicio { get; set;}
    public EstadoEmocional EmocionFinal { get; set;}
    public virtual TipoEjercicio TipoEjercicio { get; set; }
    public virtual Lugar Lugar { get; set; }
    public virtual Evento Evento { get; set; }

}

public enum EstadoEmocional
{
    Feliz = 1,
    Triste,
    Enojado,
    Ansioso,
    Estresado,
    Relajado,
    Aburrido,
    Emocionado,
    Agobiado,
    Confundido,
    Optimista,
    Pesimista,
    Motivado,
    Cansado,
    Eufórico,
    Agitado,
    Satisfecho,
    Desanimado
}
