using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Desenrola.Domain.Entities;

namespace Desenrola.Persistence
{
    public class DefaultContext : IdentityDbContext<User>
    {
        public DefaultContext(DbContextOptions<DefaultContext> options) : base(options) { }

        // Tabelas do domínio
        public DbSet<Provider> Providers => Set<Provider>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            // Extensão útil para UUID em outras entidades (opcional)
            builder.HasPostgresExtension("uuid-ossp");

            // Mapeamento do Provider -> User (UserId deve ser string)
            builder.Entity<Provider>(entity =>
            {
                entity.HasKey(p => p.Id);

                entity.Property(p => p.UserId)
                      .IsRequired();

                entity.HasOne(p => p.User)
                      .WithMany()
                      .HasForeignKey(p => p.UserId)   // FK string
                      .HasPrincipalKey(u => u.Id)     // PK string (Identity)
                      .OnDelete(DeleteBehavior.Restrict);
            });


            // Aplica configurações adicionais do assembly (se houver)
            builder.ApplyConfigurationsFromAssembly(typeof(DefaultContext).Assembly);

            base.OnModelCreating(builder);
        }
    }
}
