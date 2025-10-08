using Desenrola.Application.Contracts.Infrastructure;
using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Domain.Entities;
using Desenrola.Infrastructure.Abstractions;
using Desenrola.Persistence;
using Desenrola.Persistence.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace Desenrola.Infrastructure.IoC;

public static class InfrastructureDependecyInjector {
    /// <summary>
    /// Inject the dependencies of the Infrastructure layer into an
    /// <see cref="IServiceCollection"/>
    /// </summary>
    /// <param name="services">
    /// The <see cref="IServiceCollection"/> to inject the dependencies into
    /// </param>
    /// <returns>
    /// The <see cref="IServiceCollection"/> with dependencies injected
    /// </returns>
    public static IServiceCollection InjectInfrastructureDependencies(this IServiceCollection services) {
        services.AddDefaultIdentity<User>()
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<DefaultContext>()
            .AddDefaultTokenProviders();

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


        return services;
    }
}
