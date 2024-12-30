using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using GymStats.Models;
using System.Globalization;
using Microsoft.AspNetCore.Authorization;

namespace GymStats.Controllers;
    [Authorize]
    public class TiposEjerciciosController : Controller
    {

        private readonly ApplicationDbContext _context;

        public TiposEjerciciosController(ApplicationDbContext context)
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
            var TiposEjercicios = _context.TiposEjercicios.ToList();

            if (id != null)
            {
                TiposEjercicios = TiposEjercicios.Where(t => t.TipoEjercicioID == id).ToList();
            }

            return Json(TiposEjercicios);
        }

        public JsonResult Guardar(int tipoEjercicioID, string nombre, string met)
        {
            Thread.CurrentThread.CurrentCulture = new CultureInfo("es-AR");
            if (!string.IsNullOrEmpty(met))
            {
                met = met.Replace(".", ",");
            }
            Decimal metDecimal = new Decimal();
            Decimal.TryParse(met, out metDecimal);

            string resultado = "";

            if (!String.IsNullOrEmpty(nombre))
            {
                nombre = nombre.ToUpper();

                if (tipoEjercicioID == 0)
                {
                    var existeTipoEjercicio = _context.TiposEjercicios.Where(t => t.Nombre == nombre).Count();
                    if (existeTipoEjercicio == 0)
                    {
                        // GUARDAR EL TIPO DE EJERCICIO
                        var tipoEjercicio = new TipoEjercicio
                        {
                            Nombre = nombre,
                            Met = metDecimal
                        };
                        _context.Add(tipoEjercicio);
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
                    var tipoEjercicioEditar = _context.TiposEjercicios.Where(t => t.TipoEjercicioID == tipoEjercicioID).SingleOrDefault();
                    if (tipoEjercicioEditar != null)
                    {
                        //BUSCAMOS EN LA TABLA SI EXISTE UN REGISTRO CON EL MISMO NOMBRE PERO QUE EL ID SEA DISTINTO AL QUE ESTAMOS EDITANDO
                        var existeTipoEjercicio = _context.TiposEjercicios.Where(t => t.Nombre == nombre && t.TipoEjercicioID != tipoEjercicioID).Count();
                        if (existeTipoEjercicio == 0)
                        {
                            //QUIERE DECIR QUE EL ELEMENTO EXISTE Y ES CORRECTO ENTONCES CONTINUAMOS CON EL EDITAR
                            tipoEjercicioEditar.Nombre = nombre;
                            tipoEjercicioEditar.Met = metDecimal;
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

        public JsonResult Eliminar(int? id)
        {
            var eliminado = false;

            var tipo = _context.TiposEjercicios.Where(l => l.TipoEjercicioID == id && l.Ejercicios.Count() == 0).Include(e => e.Ejercicios).FirstOrDefault();

            if (tipo != null)
            {
                _context.Remove(tipo);
                _context.SaveChanges();
                eliminado = true;
            }
            return Json(eliminado);
        }
    }
