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
    public string? UsuarioID { get; set; }
    public DateTime Inicio { get; set; }
    public DateTime Fin { get; set; }
    [NotMapped]
    public TimeSpan IntervaloEjercicio { get { return Fin - Inicio; } }
    public string? Observacion { get; set; }
    public EstadoEmocional EmocionInicio { get; set; }
    public EstadoEmocional EmocionFinal { get; set; }
    public virtual TipoEjercicio TipoEjercicio { get; set; }
    public virtual Lugar Lugar { get; set; }
    public virtual Evento Evento { get; set; }

}

public enum EstadoEmocional
{
    Feliz = 1,
    Optimista,
    Satisfecho,
    Motivado,
    Relajado,
    Triste,
    Pesimista,
    Cansado,
    Desanimado,
    Aburrido,
    Emocionado,
    Agobiado,
    Confundido,
    Eufórico,
    Agitado,
    Ansioso,
    Estresado,
    Enojado
}

public class VistaEjercicio
{
    public int EjercicioID { get; set; }
    public int TipoEjercicioID { get; set; }
    public string? TipoEjercicioNombre { get; set; }
    public int LugarID { get; set; }
    public string? LugarNombre { get; set; }
    public int EventoID { get; set; }
    public string? EventoNombre { get; set; }
    public DateTime Inicio { get; set; }
    public string? InicioString { get; set; }
    public TimeSpan IntervaloEjercicio { get; set; }
    public DateTime Fin { get; set; }
    public string? FinString { get; set; }
    public EstadoEmocional EmocionInicio { get; set; }
    public EstadoEmocional EmocionFin { get; set; }
    public string? EmocionInicioString { get; set; }
    public string? EmocionFinString { get; set; }
    public string? Observacion { get; set; }
    public decimal CaloriasQuemadas { get; set; }
}

