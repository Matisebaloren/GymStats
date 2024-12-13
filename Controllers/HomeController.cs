using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using GymStats.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;

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
        return View();
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
