using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using GymStats.Models;
using System.Globalization;

namespace GymStats.Controllers
{
    public class EventosController : Controller
    {
        private readonly ApplicationDbContext _context;

        public EventosController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: TipoEjercicio
        public async Task<IActionResult> Index()
        {
            return View();
        }

        public JsonResult ListadoTipoEjercicios(int? id)
        {
            var Eventos = _context.Eventos.ToList();

            if (id != null)
            {
                Eventos = Eventos.Where(t => t.EventoID == id).ToList();
            }

            return Json(Eventos);
        }

        public JsonResult Guardar(int eventoID, string nombre)
        {
            
            string resultado = "";

            if (!String.IsNullOrEmpty(nombre))
            {
                nombre = nombre.ToUpper();

                if (eventoID == 0)
                {
                    var existeTipoEjercicio = _context.Eventos.Where(t => t.Nombre == nombre).Count();
                    if (existeTipoEjercicio == 0)
                    {
                        // GUARDAR EL EVENTO
                        var evento = new TipoEjercicio
                        {
                            Nombre = nombre,
                        };
                        _context.Add(evento);
                        _context.SaveChanges();
                    }
                    else
                    {
                        resultado = "YA EXISTE UN REGISTRO CON LA MISMA DESCRIPCIÓN";
                    }
                }
                else
                {
                    //QUIERE DECIR QUE VAMOS A EDITAR EL REGISTRO
                    var eventoEditar = _context.Eventos.Where(t => t.EventoID == eventoID).SingleOrDefault();
                    if (eventoEditar != null)
                    {
                        //BUSCAMOS EN LA TABLA SI EXISTE UN REGISTRO CON EL MISMO NOMBRE PERO QUE EL ID SEA DISTINTO AL QUE ESTAMOS EDITANDO
                        var existeTipoEjercicio = _context.Eventos.Where(t => t.Nombre == nombre && t.EventoID != eventoID).Count();
                        if (existeTipoEjercicio == 0)
                        {
                            //QUIERE DECIR QUE EL ELEMENTO EXISTE Y ES CORRECTO ENTONCES CONTINUAMOS CON EL EDITAR
                            eventoEditar.Nombre = nombre;
                            _context.SaveChanges();
                        }
                        else
                        {
                            resultado = "YA EXISTE UN REGISTRO CON EL MISMO NOMBRE";
                        }
                    }
                }
            }
            else
            {
                resultado = "DEBE INGRESAR UN NOMBRE.";
            }

            return Json(resultado);
        }
    }
}
