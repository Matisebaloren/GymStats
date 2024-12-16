using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using GymStats.Models;

namespace GymStats.Controllers
{
    public class DeportistasController : Controller
    {
        private readonly ApplicationDbContext _context;

        public DeportistasController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Deportista
        public async Task<IActionResult> Index()
        {
            return View(await _context.Deportistas.ToListAsync());
        }

        // GET: Deportista/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var deportista = await _context.Deportistas
                .FirstOrDefaultAsync(m => m.DeportistaID == id);
            if (deportista == null)
            {
                return NotFound();
            }

            return View(deportista);
        }

        // GET: Deportista/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Deportista/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("DeportistaID,UsuarioID,NombreCompleto,FechaNacimiento,Altura,Peso,Genero")] Deportista deportista)
        {
            if (ModelState.IsValid)
            {
                _context.Add(deportista);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(deportista);
        }

        // GET: Deportista/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var deportista = await _context.Deportistas.FindAsync(id);
            if (deportista == null)
            {
                return NotFound();
            }
            return View(deportista);
        }

        // POST: Deportista/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("DeportistaID,UsuarioID,NombreCompleto,FechaNacimiento,Altura,Peso,Genero")] Deportista deportista)
        {
            if (id != deportista.DeportistaID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(deportista);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!DeportistaExists(deportista.DeportistaID))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(deportista);
        }

        // GET: Deportista/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var deportista = await _context.Deportistas
                .FirstOrDefaultAsync(m => m.DeportistaID == id);
            if (deportista == null)
            {
                return NotFound();
            }

            return View(deportista);
        }

        // POST: Deportista/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var deportista = await _context.Deportistas.FindAsync(id);
            if (deportista != null)
            {
                _context.Deportistas.Remove(deportista);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool DeportistaExists(int id)
        {
            return _context.Deportistas.Any(e => e.DeportistaID == id);
        }
    }
}
