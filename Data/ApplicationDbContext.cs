using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using GymStats.Models;

public class ApplicationDbContext : IdentityDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }
    public DbSet<Lugar> Lugares { get; set; } = default!;
    public DbSet<TipoEjercicio> TiposEjercicios { get; set; } = default!;
    public DbSet<Deportista> Deportistas { get; set; } = default!;
    public DbSet<Ejercicio> Ejercicios { get; set; } = default!;
    public DbSet<Evento> Eventos { get; set; } = default!;
}

