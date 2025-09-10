using Desenrola.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Desenrola.Persistence
{
    public class AppDbContext : DbContext
    {
        public DbSet<Provider> Providers { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Provider>()
                .HasOne(p => p.User)
                .WithMany()
                .HasForeignKey(p => p.UserId);

            base.OnModelCreating(modelBuilder);
        }
    }
}
