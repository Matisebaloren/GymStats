namespace GymStats.Models;

// public class PanelEjercicios
// {
//     public List<EjerciciosPorDia>? EjerciciosPorDias { get; set; }
//     public List<TipoEjercicioPorMes>? TiposEjerciciosPorMes { get; set; }
// }

public class EjerciciosPorDia
{
    public int Dia { get; set; }
    public string? Mes { get; set; }
    public int CantidadMinutos { get; set; }
}

public class TipoEjercicioPorMes
{
    public int TipoEjercicioID { get; set; }
    public string? Nombre { get; set; }
    public decimal CantidadMinutos { get; set; }
}


// public class vistaInforme
// {
//     public int filtroID1 {get;set;}
//     public string? filtroNombre1 {get;set;}
//     public int filtroID2 {get;set;}
//     public string? filtroIDNombre {get;set;}
//     public List<VistaEjercicio>? vistaEjercicios {get;set;}

// }
