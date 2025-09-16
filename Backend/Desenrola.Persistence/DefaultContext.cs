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
            // Extensão útil para UUID em outras entidades (Postgres)
            builder.HasPostgresExtension("uuid-ossp");

            // Mapeamento do Provider
            builder.Entity<Provider>(entity =>
            {
                entity.HasKey(p => p.Id);

                entity.Property(p => p.Id)
                      .HasDefaultValueSql("uuid_generate_v4()");

                entity.Property(p => p.UserId)
                      .IsRequired();

                entity.Property(p => p.CPF)
                      .HasMaxLength(11)
                      .IsRequired();

                entity.Property(p => p.RG)
                      .HasMaxLength(20)
                      .IsRequired();

                entity.Property(p => p.DocumentPhotoUrl)
                      .HasColumnType("text[]")   // 👈 força o tipo Postgres
                      .IsRequired();


                entity.Property(p => p.Address)
                      .IsRequired();

                // Relacionamento 1:1 User <-> Provider
                entity.HasOne(p => p.User)
                      .WithOne(u => u.Provider)
                      .HasForeignKey<Provider>(p => p.UserId)
                      .HasPrincipalKey<User>(u => u.Id)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Aplica configurações adicionais se houver
            builder.ApplyConfigurationsFromAssembly(typeof(DefaultContext).Assembly);

            base.OnModelCreating(builder);
        }
    }
}
