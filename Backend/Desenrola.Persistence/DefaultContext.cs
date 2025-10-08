using Desenrola.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace Desenrola.Persistence
{
    public class DefaultContext : IdentityDbContext<User>
    {
        public DefaultContext(DbContextOptions<DefaultContext> options) : base(options) { }

        // Tabelas do domínio
        public DbSet<Provider> Providers => Set<Provider>();
        public DbSet<ProviderService> ProviderServices => Set<ProviderService>();
        public DbSet<Evaluation> Evaluations { get; set; }
        public DbSet<ProviderSchedule> ProviderSchedules => Set<ProviderSchedule>();
        public DbSet<Payment> Payments { get; set; }

        // Tabelas de Message e Conversation
        public DbSet<Conversation> Conversations { get; set; } = null!;
        public DbSet<Message> Messages { get; set; } = null!;

        public DbSet<Favorite> Favorites { get; set; }



        protected override void OnModelCreating(ModelBuilder builder)
        {
            // Extensão útil para UUID em outras entidades (Postgres)
            builder.HasPostgresExtension("uuid-ossp");

            // --------------------------
            // Mapeamento do Provider
            // --------------------------
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
                      .HasColumnType("text[]")   // Postgres array de strings
                      .IsRequired();

                entity.Property(p => p.Address)
                      .IsRequired();

                // Relacionamento 1:1 User <-> Provider
                entity.HasOne(p => p.User)
                      .WithOne(u => u.Provider)
                      .HasForeignKey<Provider>(p => p.UserId)
                      .HasPrincipalKey<User>(u => u.Id)
                      .OnDelete(DeleteBehavior.Restrict);

                // Relacionamento 1:N Provider -> ProviderServices
                entity.HasMany(p => p.Services)
                      .WithOne(s => s.Provider)
                      .HasForeignKey(s => s.ProviderId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // --------------------------
            // Mapeamento do ProviderService
            // --------------------------
            builder.Entity<ProviderService>(entity =>
            {
                entity.HasKey(s => s.Id);

                entity.Property(s => s.Id)
                      .HasDefaultValueSql("uuid_generate_v4()");

                entity.Property(s => s.Title)
                      .HasMaxLength(100)
                      .IsRequired();

                entity.Property(s => s.Description)
                      .HasMaxLength(500)
                      .IsRequired();

                entity.Property(s => s.Price)
                      .HasColumnType("decimal(10,2)");

                entity.Property(s => s.ImageUrls)
                      .HasColumnType("text[]");

                entity.Property(s => s.Category)
                      .IsRequired();

                entity.Property(s => s.IsActive)
                      .HasDefaultValue(true);

                entity.Property(s => s.IsAvailable)
                      .HasDefaultValue(true);

                entity.Property(s => s.CreatedOn)
                      .HasDefaultValueSql("NOW() AT TIME ZONE 'UTC'");
            });

            builder.Entity<Evaluation>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id)
                      .HasDefaultValueSql("uuid_generate_v4()");

                entity.HasOne(e => e.User)
                    .WithMany(u => u.Evaluations)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Provider)
                    .WithMany(p => p.Evaluations)
                    .HasForeignKey(e => e.ProviderId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.Property(e => e.Note)
                    .IsRequired();
            });

            builder.Entity<ProviderSchedule>(entity =>
            {
                entity.HasKey(s => s.Id);

                entity.Property(s => s.Id)
                      .HasDefaultValueSql("uuid_generate_v4()");

                entity.HasOne(s => s.Provider)
                      .WithMany(p => p.Schedules)
                      .HasForeignKey(s => s.ProviderId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.Property(s => s.DayOfWeek)
                      .IsRequired();

                entity.Property(s => s.StartTime)
                      .IsRequired();

                entity.Property(s => s.EndTime)
                      .IsRequired();
            });

            builder.Entity<Payment>(entity =>
            {
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Id)
                      .HasDefaultValueSql("uuid_generate_v4()");

                entity.HasOne(p => p.User)
                      .WithMany(u => u.Payments)
                      .HasForeignKey(p => p.UserId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.Property(p => p.SessionId).IsRequired();
                entity.Property(p => p.UserId).IsRequired();
                entity.Property(p => p.PlanType).IsRequired();
                entity.Property(p => p.PurchaseDate).IsRequired();
                entity.Property(p => p.ExpirationDate).IsRequired();

                entity.HasIndex(p => p.SessionId).IsUnique();
                entity.HasIndex(p => p.PaymentIntentId).IsUnique();
            });

            // --------------------------
            // Mapeamento de Message
            // --------------------------
            builder.Entity<Message>(entity =>
            {
                entity.HasKey(m => m.Id);
                entity.Property(m => m.Id).HasDefaultValueSql("uuid_generate_v4()");
                entity.Property(m => m.Content).IsRequired();
                entity.Property(m => m.SentAt).HasDefaultValueSql("NOW() AT TIME ZONE 'UTC'");

                // Relacionamento 1:N entre Message e Conversation
                entity.HasOne(m => m.Conversation)
                      .WithMany(c => c.Messages)
                      .HasForeignKey(m => m.ConversationId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // --------------------------
            // Mapeamento de Conversation
            // --------------------------
            builder.Entity<Conversation>(entity =>
            {
                entity.HasKey(c => c.Id);
                entity.Property(c => c.Id).HasDefaultValueSql("uuid_generate_v4()");
                entity.Property(c => c.CreatedAt).HasDefaultValueSql("NOW() AT TIME ZONE 'UTC'");

                // Relacionamento 1:1 entre Conversation e User (User1)
                entity.HasOne(c => c.User1)
                      .WithMany()
                      .HasForeignKey(c => c.UserId1)
                      .OnDelete(DeleteBehavior.Restrict);

                // Relacionamento 1:1 entre Conversation e User (User2)
                entity.HasOne(c => c.User2)
                      .WithMany()
                      .HasForeignKey(c => c.UserId2)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // --------------------------
            // Relacionamento de Favoritos
            // --------------------------
            builder.Entity<Favorite>(entity =>
            {
                // Chave composta (UserId + ProviderId)
                entity.HasKey(f => new { f.UserId, f.ProviderId });

                // Relacionamento entre FavoriteModel e User (1:N)
                entity.HasOne(f => f.User)
                      .WithMany(u => u.Favorites)
                      .HasForeignKey(f => f.UserId)
                      .OnDelete(DeleteBehavior.Cascade);

                // Relacionamento entre FavoriteModel e Provider (1:N)
                entity.HasOne(f => f.Provider)
                      .WithMany(p => p.FavoritedBy)
                      .HasForeignKey(f => f.ProviderId)
                      .OnDelete(DeleteBehavior.Cascade);
            });



            // Aplica configurações adicionais se houver
            builder.ApplyConfigurationsFromAssembly(typeof(DefaultContext).Assembly);

            base.OnModelCreating(builder);
        }
    }
}
