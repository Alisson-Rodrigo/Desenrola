using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Desenrola.Application.Contracts.Infrastructure;
using Desenrola.Domain.Entities;
using Desenrola.Infrastructure.Abstractions;
using Desenrola.Persistence;
using Desenrola.Application.Contracts.Persistence.Repositories;
using Desenrola.Persistence.Repositories;

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

        return services;
    }
}
