using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using GymStats.Models;
using System.Globalization;
using Microsoft.AspNetCore.Identity;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.AspNetCore.Authorization;

namespace GymStats.Controllers;
[Authorize]
public class EjerciciosController : Controller
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<IdentityUser> _userManager;

    public EjerciciosController(ApplicationDbContext context, UserManager<IdentityUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    // GET: Ejercicios
    public async Task<IActionResult> Index()
    {
        return View();
    }

    public JsonResult ListadoEjercicios(int? id, string? filtro1 = "", string? filtro2 = "", string? desde = "", string? hasta = "")
    {
        var usuarioID = _userManager.GetUserId(HttpContext.User);
        if (usuarioID == null)
        {
            return Json("Usuario no autenticado.");
        }
        var deportista = _context.Deportistas.Where(d => d.UsuarioID == usuarioID).FirstOrDefault();

        if (deportista == null)
        {
            return Json("Usuario no autenticado.");
        }


        var ejercicios = _context.Ejercicios.Where(l => l.UsuarioID == usuarioID).Include(e => e.TipoEjercicio).Include(e => e.Evento).Include(e => e.Lugar).ToList();

        if (id != null)
        {
            ejercicios = ejercicios.Where(t => t.EjercicioID == id).ToList();
        }

        // Buscar en el lapso de tiempo
        DateTime datetime_desde;
        DateTime datetime_hasta;

        if (DateTime.TryParse(desde, out datetime_desde))
        {
            if (ejercicios[0].Inicio > datetime_desde)
            {

            }
            ejercicios = ejercicios.Where(e => e.Inicio.CompareTo(datetime_desde) > 0).ToList();
        }

        if (DateTime.TryParse(hasta, out datetime_hasta))
        {
            ejercicios = ejercicios.Where(e => e.Fin.CompareTo(datetime_hasta) < 0).ToList();
        }

        var varGenero = 1.0m;
        if (deportista.Genero == Genero.Femenino)
        {
            varGenero = 0.9m;
        }

        var ejercicioMostrar = ejercicios
        .Select(e => new VistaEjercicio
        {
            EjercicioID = e.EjercicioID,
            TipoEjercicioID = e.TipoEjercicioID,
            TipoEjercicioNombre = e.TipoEjercicio.Nombre,
            LugarID = e.LugarID,
            LugarNombre = e.Lugar.Nombre,
            EventoID = e.EventoID,
            EventoNombre = e.Evento.Nombre,
            Inicio = e.Inicio,
            InicioString = e.Inicio.ToString("dd/MM/yyyy HH:mm"),
            Fin = e.Fin,
            FinString = e.Fin.ToString("dd/MM/yyyy HH:mm"),
            IntervaloEjercicio = e.IntervaloEjercicio,
            EmocionInicio = e.EmocionInicio,
            EmocionFin = e.EmocionFinal,
            EmocionInicioString = e.EmocionInicio.ToString(),
            EmocionFinString = e.EmocionFinal.ToString(),
            Observacion = e.Observacion,

            CaloriasQuemadas = decimal.Round(e.TipoEjercicio.Met * deportista.Peso * Convert.ToDecimal(e.IntervaloEjercicio.TotalHours) * varGenero, 2)
        })
        .ToList();


        if (filtro2 != "")
        {
            ejercicioMostrar = OrdenarEjercicios(ejercicioMostrar, filtro2);
        }
        if (filtro1 != "")
        {
            ejercicioMostrar = OrdenarEjercicios(ejercicioMostrar, filtro1);
        }


        return Json(ejercicioMostrar);
    }

    public JsonResult Formulario(int? id)
    {
        var usuarioID = _userManager.GetUserId(HttpContext.User);
        if (usuarioID == null)
        {
            return Json("Usuario no autenticado.");
        }

        var lugares = _context.Lugares.Where(l => l.UsuarioID == usuarioID).ToList();
        var eventos = _context.Eventos.ToList();
        var tiposEjercicios = _context.TiposEjercicios.ToList();

        // JSON
        var data = new
        {
            lugares = lugares,
            eventos = eventos,
            tiposEjercicios = tiposEjercicios
        };

        return Json(data);
    }


    public JsonResult Guardar(int ejercicioID, int tipoEjercicioID, int lugarID, int eventoID, string observacion, string inicio, string fin, EstadoEmocional emocionInicio, EstadoEmocional emocionFinal)
    {
        string resultado = "";
        var usuarioID = _userManager.GetUserId(HttpContext.User);

        if (usuarioID == null)
        {
            return Json("Usuario no autenticado.");
        }
        // var deportista = _context.Deportistas.Where(d => d.UsuarioID == usuarioID).FirstOrDefault();
        // if (deportista == null)
        // {
        //     return Json("Deportista no autenticado.");
        // }

        DateTime datetime_inicio;
        DateTime datetime_fin;

        if (!DateTime.TryParse(inicio, out datetime_inicio) || !DateTime.TryParse(fin, out datetime_fin))
        {
            return Json("Formato de fecha/hora inválido.");
        }

        // Verificar si las fechas tienen sentido
        if (datetime_inicio >= datetime_fin)
        {
            return Json("La fecha de inicio debe ser anterior a la fecha de fin.");
        }



        if (new int?[] { eventoID, tipoEjercicioID, lugarID }.All(x => x != null && x != 0))
        {
            if (ejercicioID == 0)
            {
                var ejercicio = new Ejercicio
                {
                    TipoEjercicioID = tipoEjercicioID,
                    EventoID = eventoID,
                    LugarID = lugarID,
                    Inicio = datetime_inicio,
                    Fin = datetime_fin,
                    Observacion = observacion,
                    UsuarioID = usuarioID,
                    EmocionInicio = emocionInicio,
                    EmocionFinal = emocionFinal
                };
                _context.Add(ejercicio);
                _context.SaveChanges();

            }
            else
            {
                //EDITAR
                var ejercicioEditar = _context.Ejercicios.Where(e => e.EjercicioID == ejercicioID && e.UsuarioID == usuarioID).SingleOrDefault();
                if (ejercicioEditar != null)
                {
                    ejercicioEditar.TipoEjercicioID = tipoEjercicioID;
                    ejercicioEditar.EventoID = eventoID;
                    ejercicioEditar.LugarID = lugarID;
                    ejercicioEditar.Inicio = datetime_inicio;
                    ejercicioEditar.Fin = datetime_fin;
                    ejercicioEditar.Observacion = observacion;
                    ejercicioEditar.EmocionInicio = emocionInicio;
                    ejercicioEditar.EmocionFinal = emocionFinal;
                    _context.SaveChanges();
                }
                else
                {
                    resultado = "NO HAY AUTORIZACIÓN PARA MODIFICAR ESE REGISTRO.";
                }
            }
        }
        else
        {
            resultado = "FALTANTE DE DATOS";
        }

        return Json(resultado);
    }

    // INFORMES

    public async Task<IActionResult> Informe()
    {
        return View();
    }


    // public JsonResult InformeEjercicios(string filtro1 = "", string filtro2 = "")
    // {
    //     var usuarioID = _userManager.GetUserId(HttpContext.User);
    //     if (usuarioID == null)
    //     {
    //         return Json("Usuario no autenticado.");
    //     }
    //     var deportista = _context.Deportistas.Where(d => d.UsuarioID == usuarioID).FirstOrDefault();

    //     if (deportista == null)
    //     {
    //         return Json("Usuario no autenticado.");
    //     }

    //     var ejercicios = _context.Ejercicios
    //     .Where(l => l.UsuarioID == usuarioID)
    //     .Include(e => e.TipoEjercicio)
    //     .Include(e => e.Evento)
    //     .Include(e => e.Lugar)
    //     .ToList();

    //     if (filtro2 != "")
    //     {
    //         ejercicios = OrdenarEjercicios(ejercicios, filtro2);
    //     }
    //     ejercicios = OrdenarEjercicios(ejercicios, filtro1);

    //     return Json(ejercicios);
    // }

    private List<VistaEjercicio> OrdenarEjercicios(List<VistaEjercicio> ejercicios, string filtro)
    {
        // Ordenamiento dinámico según el filtro
        return filtro switch
        {
            "tipoEjercicio" => ejercicios.OrderBy(e => e.TipoEjercicioNombre).ToList(),
            "evento" => ejercicios.OrderBy(e => e.EventoNombre).ToList(),
            "lugar" => ejercicios.OrderBy(e => e.LugarNombre).ToList(),
            _ => ejercicios.OrderBy(e => e.TipoEjercicioNombre).ToList() // Orden por defecto
        };
    }

    public JsonResult Eliminar(int? id)
    {
        var eliminado = false;
        var usuarioID = _userManager.GetUserId(HttpContext.User);

        if (usuarioID == null)
        {
            return Json("Usuario no autenticado.");
        }

        var ejercicio = _context.Ejercicios.Where(l => l.EjercicioID == id && l.UsuarioID == usuarioID).FirstOrDefault();

        if (ejercicio != null)
        {
            _context.Remove(ejercicio);
            _context.SaveChanges();
            eliminado = true;
        }
        return Json(eliminado);
    }
}
