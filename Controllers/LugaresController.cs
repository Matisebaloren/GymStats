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
using GymStats.Migrations;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using Microsoft.AspNetCore.Authorization;

namespace GymStats.Controllers;
[Authorize]
    public class LugaresController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public LugaresController(ApplicationDbContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: Lugares
        public async Task<IActionResult> Index()
        {
            return View();
        }

        public JsonResult ListadoLugares(int? id)
        {
            var usuarioID = _userManager.GetUserId(HttpContext.User);

            if (usuarioID == null)
            {
                return Json("Usuario no autenticado.");
            }

            var Lugares = _context.Lugares.Where(l => l.UsuarioID == usuarioID).ToList();

            if (id != null)
            {
                Lugares = Lugares.Where(t => t.LugarID == id).ToList();
            }

            return Json(Lugares);
        }

        public JsonResult Eliminar(int? id)
        {
            var eliminado = false;
            var usuarioID = _userManager.GetUserId(HttpContext.User);

            if (usuarioID == null)
            {
                return Json("Usuario no autenticado.");
            }

            var lugar = _context.Lugares.Where(l => l.LugarID == id && l.UsuarioID == usuarioID && l.Ejercicios.Count() == 0).Include(e => e.Ejercicios).FirstOrDefault();

            if (lugar != null)
            {
                _context.Remove(lugar);
                _context.SaveChanges();
                eliminado = true;
            }
            return Json(eliminado);
        }

        public JsonResult Guardar(int lugarID, string nombre)
        {
            string resultado = "";
            var usuarioID = _userManager.GetUserId(HttpContext.User);

            if (usuarioID == null)
            {
                return Json("Usuario no autenticado.");
            }

            if (!String.IsNullOrEmpty(nombre))
            {
                nombre = nombre.ToUpper();

                if (lugarID == 0)
                {
                    var existeLugar = _context.Lugares.Where(t => t.Nombre == nombre && t.UsuarioID == usuarioID).Count();
                    if (existeLugar == 0)
                    {
                        var lugar = new Lugar
                        {
                            Nombre = nombre,
                            UsuarioID = usuarioID
                        };
                        _context.Add(lugar);
                        _context.SaveChanges();
                    }
                    else
                    {
                        resultado = "YA EXISTE UN REGISTRO CON LA MISMA NOMBRE";
                    }
                }
                else
                {
                    //EDITAR
                    var lugarEditar = _context.Lugares.Where(t => t.LugarID == lugarID && t.UsuarioID == usuarioID).SingleOrDefault();
                    if (lugarEditar != null)
                    {
                        //MISMO NOMBRE Y QUE TENGA MISMO USUARIO, YA QUE PERMITIMOS QUE DISTINTOS USUARIOS TENGAN EL MISMO LUGAR
                        var existeLugar = _context.Lugares.Where(t => t.Nombre == nombre && t.UsuarioID == usuarioID).Count();
                        if (existeLugar == 0)
                        {
                            //QUIERE DECIR QUE EL ELEMENTO EXISTE Y ES CORRECTO ENTONCES CONTINUAMOS CON EL EDITAR
                            lugarEditar.Nombre = nombre;
                            _context.SaveChanges();
                        }
                        else
                        {
                            resultado = "YA EXISTE UN REGISTRO CON EL MISMO NOMBRE";
                        }
                    }
                    else
                    {
                        resultado = "NO HAY AUTORIZACIÓN PARA MODIFICAR ESE REGISTRO.";
                    }
                }
            }
            else
            {
                resultado = "DEBE INGRESAR UN NOMBRE DEL LUGAR.";
            }

            return Json(resultado);
        }
    }
