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
    public class TipoEjercicioController : Controller
    {
        private readonly ApplicationDbContext _context;

        public TipoEjercicioController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: TipoEjercicio
        public async Task<IActionResult> Index()
        {
            return View(await _context.TiposEjercicio.ToListAsync());
        }

        // GET: TipoEjercicio/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var tipoEjercicio = await _context.TiposEjercicio
                .FirstOrDefaultAsync(m => m.TipoEjercicioID == id);
            if (tipoEjercicio == null)
            {
                return NotFound();
            }

            return View(tipoEjercicio);
        }

        // GET: TipoEjercicio/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: TipoEjercicio/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("TipoEjercicioID,Nombre,Met")] TipoEjercicio tipoEjercicio)
        {
            if (ModelState.IsValid)
            {
                _context.Add(tipoEjercicio);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(tipoEjercicio);
        }

        // GET: TipoEjercicio/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var tipoEjercicio = await _context.TiposEjercicio.FindAsync(id);
            if (tipoEjercicio == null)
            {
                return NotFound();
            }
            return View(tipoEjercicio);
        }

        // POST: TipoEjercicio/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("TipoEjercicioID,Nombre,Met")] TipoEjercicio tipoEjercicio)
        {
            if (id != tipoEjercicio.TipoEjercicioID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(tipoEjercicio);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!TipoEjercicioExists(tipoEjercicio.TipoEjercicioID))
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
            return View(tipoEjercicio);
        }

        // GET: TipoEjercicio/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var tipoEjercicio = await _context.TiposEjercicio
                .FirstOrDefaultAsync(m => m.TipoEjercicioID == id);
            if (tipoEjercicio == null)
            {
                return NotFound();
            }

            return View(tipoEjercicio);
        }

        // POST: TipoEjercicio/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var tipoEjercicio = await _context.TiposEjercicio.FindAsync(id);
            if (tipoEjercicio != null)
            {
                _context.TiposEjercicio.Remove(tipoEjercicio);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool TipoEjercicioExists(int id)
        {
            return _context.TiposEjercicio.Any(e => e.TipoEjercicioID == id);
        }
    }
}
