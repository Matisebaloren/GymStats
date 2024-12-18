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

namespace GymStats.Controllers
{
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

        public JsonResult ListadoEjercicios(int? id)
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


            var ejercicios = _context.Ejercicios.Where(l => l.DeportistaID == deportista.DeportistaID).Include(e => e.TipoEjercicio).Include(e => e.Evento).Include(e => e.Lugar).ToList();

            if (id != null)
            {
                ejercicios = ejercicios.Where(t => t.EjercicioID == id).ToList();
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
                Observacion = e.Observacion,
                //    EmocionFin = e.EstadoEmocionalFin,
                //    EmocionFinString = e.EstadoEmocionalFin.ToString().ToUpper(),
                //    EmocionInicio = e.EstadoEmocionalInicio,
                //    EmocionInicioString = e.EstadoEmocionalInicio.ToString().ToUpper(),
                CaloriasQuemadas = decimal.Round(e.TipoEjercicio.Met * deportista.Peso * Convert.ToDecimal(e.IntervaloEjercicio.TotalHours) * varGenero, 2)
            })
            .ToList();

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


        public JsonResult Guardar(int ejercicioID, int tipoEjercicioID, int lugarID, int eventoID, string observacion, string inicio, string fin)
        {
            string resultado = "";
            var usuarioID = _userManager.GetUserId(HttpContext.User);

            if (usuarioID == null)
            {
                return Json("Usuario no autenticado.");
            }
            var deportista = _context.Deportistas.Where(d => d.UsuarioID == usuarioID).FirstOrDefault();
            if (deportista == null)
            {
                return Json("Deportista no autenticado.");
            }

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
                        DeportistaID = deportista.DeportistaID
                    };
                    _context.Add(ejercicio);
                    _context.SaveChanges();

                }
                else
                {
                    //EDITAR
                    var ejercicioEditar = _context.Ejercicios.Where(t => t.EjercicioID == ejercicioID && t.DeportistaID == deportista.DeportistaID).SingleOrDefault();
                    if (ejercicioEditar != null)
                    {
                        ejercicioEditar.TipoEjercicioID = tipoEjercicioID;
                        ejercicioEditar.EventoID = eventoID;
                        ejercicioEditar.LugarID = lugarID;
                        ejercicioEditar.Inicio = datetime_inicio;
                        ejercicioEditar.Fin = datetime_fin;
                        ejercicioEditar.Observacion = observacion;
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

        
    }
}
