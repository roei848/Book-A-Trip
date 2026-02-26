using BookATrip.Api.Data.Entities;
using BookATrip.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BookATrip.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<TestTable> TestTables => Set<TestTable>();
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(u => u.GoogleId)
            .IsUnique();
    }
}
