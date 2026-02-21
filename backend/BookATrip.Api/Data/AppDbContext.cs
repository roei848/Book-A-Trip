using BookATrip.Api.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace BookATrip.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<TestTable> TestTables => Set<TestTable>();
}
