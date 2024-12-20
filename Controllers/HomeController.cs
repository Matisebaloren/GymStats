using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using GymStats.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Humanizer;

namespace GymStats.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private ApplicationDbContext _context;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly RoleManager<IdentityRole> _rolManager;

    public HomeController(ILogger<HomeController> logger, ApplicationDbContext context
     , UserManager<IdentityUser> userManager, RoleManager<IdentityRole> rolManager
    )
    {
        _logger = logger;
        _context = context;
        _userManager = userManager;
        _rolManager = rolManager;
    }


    public async Task<JsonResult> InicializarPermisosUsuario()
    {
        //INICIALIZAMOS ROLES
        if (!await _rolManager.RoleExistsAsync("ADMIN"))
        {
            await _rolManager.CreateAsync(new IdentityRole("ADMIN"));
        }

        if (!await _rolManager.RoleExistsAsync("DEPORTISTA"))
        {
            await _rolManager.CreateAsync(new IdentityRole("DEPORTISTA"));
        }

        //CREAR ADMIN
        bool creado = false;
        var usuario = _context.Users.Where(u => u.Email == "admin@sistema.com").SingleOrDefault();
        if (usuario == null)
        {
            var user = new IdentityUser { UserName = "admin@sistema.com", Email = "admin@sistema.com" };
            var result = await _userManager.CreateAsync(user, "password123");

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "ADMIN");
                creado = true;
            }
        }
        return Json(creado);
    }

    public async Task<IActionResult> Index()
    {
        await InicializarPermisosUsuario();

        var tipoEjercicios = _context.TiposEjercicios.ToList();
        ViewBag.TipoEjercicioID = new SelectList(tipoEjercicios.OrderBy(c => c.Nombre), "TipoEjercicioID", "Nombre");

        return View();
    }


    public JsonResult GraficoTipoEjercicioMes(int TipoEjercicioID, int Mes, int Anio)
    {
        var usuarioID = _userManager.GetUserId(HttpContext.User);

        List<EjerciciosPorDia> ejerciciosPorDias = new List<EjerciciosPorDia>();

        //POR DEFECTO EN EL LISTADO AGREGAR TODOS LOS DIAS DEL MES PARA LUEGO RECORRER Y COMPLETAR EN BASE A LOS DIAS CON EJERCICIOS
        var diasDelMes = DateTime.DaysInMonth(Anio, Mes);

        //INICIALIZO UNA VARIABLE DE TIPO FECHA
        DateTime fechaMes = new DateTime();
        //RESTAMOS UN MES SOBRE ESA FECHA
        fechaMes = fechaMes.AddMonths(Mes - 1);

        for (int i = 1; i <= diasDelMes; i++)
        {
            var diaMesMostrar = new EjerciciosPorDia
            {
                Dia = i,
                Mes = fechaMes.ToString("MMM").ToUpper(),
                CantidadMinutos = 0
            };
            ejerciciosPorDias.Add(diaMesMostrar);
        }


        //DEBEMOS BUSCAR EN BASE DE DATOS EN LA TABLA DE EJERCICIOS LOS EJERCICIOS QUE COINCIDAN CON LOS PARAMETROS INGRESADOS
        var ejercicios = _context.Ejercicios.Where(e => e.TipoEjercicioID == TipoEjercicioID
          && e.Inicio.Month == Mes && e.Inicio.Year == Anio && e.UsuarioID == usuarioID).ToList();

        foreach (var ejercicio in ejercicios.OrderBy(e => e.Inicio))
        {
            //POR CADA EJERCICIO DEBEMOS AGREGAR EN EL LISTADO SI EL DIA DE ESE EJERCICIO NO EXISTE, SINO SUMARLO
            var ejercicioDiaMostrar = ejerciciosPorDias.Where(e => e.Dia == ejercicio.Inicio.Day).SingleOrDefault();
            if (ejercicioDiaMostrar != null)
            {
                //CON LA CLASE TIMESPAN PODEMOS GUARDAR EL INTERVALO DE TIEMPO ENTRE DOS FECHAS PARA LUEGO USAR EL RESULTADO EN MINUTOS TOTALES
                //TimeSpan diferencia = ejercicio.Fin - ejercicio.Inicio;
                //ejercicioDiaMostrar.CantidadMinutos += Convert.ToInt32(diferencia.TotalMinutes);
                ejercicioDiaMostrar.CantidadMinutos += Convert.ToInt32(ejercicio.IntervaloEjercicio.TotalMinutes);
            }
        }

        return Json(ejerciciosPorDias);
    }

    public JsonResult GraficoPorcentajeMes(int Mes, int Anio)
    {
        var usuarioID = _userManager.GetUserId(HttpContext.User);

        DateTime fechaMes = new DateTime();
        fechaMes = fechaMes.AddMonths(Mes - 1);

        var ejercicios = _context.Ejercicios.Where(e => e.Inicio.Month == Mes && e.Inicio.Year == Anio && e.UsuarioID == usuarioID).Include(e => e.TipoEjercicio).ToList();

        List<TipoEjercicioPorMes> tiposEjerciciosMes = new List<TipoEjercicioPorMes>();

        foreach (var e in ejercicios)
        {
            var minutos = (decimal)e.IntervaloEjercicio.TotalMinutes;
            var encontrado = false;

            foreach (var te in tiposEjerciciosMes)
            {
                if (te.TipoEjercicioID == e.TipoEjercicioID)
                {
                    te.CantidadMinutos += minutos;
                    encontrado = true;
                    break;
                }
            }
            if (!encontrado)
            {
                var tipo = new TipoEjercicioPorMes
                {
                    TipoEjercicioID = e.TipoEjercicioID,
                    Nombre = e.TipoEjercicio.Nombre,
                    CantidadMinutos = minutos
                };
                tiposEjerciciosMes.Add(tipo);
            }
        }
        return Json(tiposEjerciciosMes);
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }



}
