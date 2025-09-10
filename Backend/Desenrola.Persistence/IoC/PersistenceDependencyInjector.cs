using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Desenrola.Persistence.IoC;

public static class PersistenceDependencyInjector {
    /// <summary>
    /// Inject the dependencies of the Persistence layer into an
    /// <see cref="IServiceCollection"/>
    /// </summary>
    /// <param name="services">
    /// The <see cref="IServiceCollection"/> to inject the dependencies into
    /// </param>
    /// <returns>
    /// The <see cref="IServiceCollection"/> with dependencies injected
    /// </returns>
    public static IServiceCollection InjectPersistenceDependencies(this IServiceCollection services, IConfiguration configuration) {
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        services.AddDbContext<DefaultContext>(options =>
            options.UseNpgsql(connectionString));

        return services;
    }
}
