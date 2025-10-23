using Desenrola.Application.Contracts.Infrastructure;
using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Domain.Entities;
using Desenrola.Infrastructure.Abstractions;
using Desenrola.Persistence;
using Desenrola.Persistence.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace Desenrola.Infrastructure.IoC
{
    /// <summary>
    /// Classe estática responsável pela injeção das dependências da camada de infraestrutura.
    /// Esta camada fornece implementações para persistência de dados, abstrações de identidade e repositórios.
    /// </summary>
    public static class InfrastructureDependecyInjector
    {
        /// <summary>
        /// Método de extensão que registra todos os serviços e repositórios da camada de infraestrutura
        /// no contêiner de injeção de dependências do .NET.
        /// </summary>
        /// <param name="services">
        /// A instância de <see cref="IServiceCollection"/> onde as dependências serão registradas.
        /// </param>
        /// <returns>
        /// A mesma instância de <see cref="IServiceCollection"/> contendo os serviços da infraestrutura registrados.
        /// </returns>
        public static IServiceCollection InjectInfrastructureDependencies(this IServiceCollection services)
        {
            // 🔹 Configuração da identidade padrão utilizando a entidade User
            // e integrando com o Entity Framework Core e provedores de token.
            services.AddDefaultIdentity<User>()
                .AddRoles<IdentityRole>()
                .AddEntityFrameworkStores<DefaultContext>()
                .AddDefaultTokenProviders();

            // 🔹 Registro das abstrações e repositórios da camada de persistência e infraestrutura.
            services.AddScoped<IIdentityAbstractor, IdentityAbstractor>();
            services.AddScoped<IProviderRepository, ProviderRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IProviderServiceRepository, ProviderServiceRepository>();
            services.AddScoped<IEvaluationRepository, EvaluationRepository>();
            services.AddScoped<IProviderScheduleRepository, ProviderScheduleRepository>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IPaymentRepository, PaymentRepository>();
            services.AddScoped<IMessagesRepository, MessagesRepository>();
            services.AddScoped<IConversationRepository, MessagesRepository>();
            services.AddScoped<IFavoriteRepository, FavoriteRepository>();

            return services;
        }
    }
}
