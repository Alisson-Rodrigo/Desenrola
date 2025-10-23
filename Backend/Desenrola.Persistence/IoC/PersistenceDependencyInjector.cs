using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Desenrola.Persistence.IoC
{
    /// <summary>
    /// Classe estática responsável pela injeção das dependências da camada de persistência.
    /// Esta camada gerencia a configuração do contexto do banco de dados e sua integração com o Entity Framework Core.
    /// </summary>
    public static class PersistenceDependencyInjector
    {
        /// <summary>
        /// Método de extensão que registra o contexto de banco de dados <see cref="DefaultContext"/>
        /// no contêiner de injeção de dependências, utilizando a string de conexão definida nas configurações da aplicação.
        /// </summary>
        /// <param name="services">
        /// Instância de <see cref="IServiceCollection"/> utilizada para registrar as dependências da camada de persistência.
        /// </param>
        /// <param name="configuration">
        /// Objeto <see cref="IConfiguration"/> que fornece acesso às configurações da aplicação,
        /// incluindo a string de conexão do banco de dados.
        /// </param>
        /// <returns>
        /// A mesma instância de <see cref="IServiceCollection"/> contendo o contexto configurado.
        /// </returns>
        public static IServiceCollection InjectPersistenceDependencies(this IServiceCollection services, IConfiguration configuration)
        {
            // 🔹 Recupera a string de conexão definida no arquivo de configuração (appsettings.json)
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            // 🔹 Registra o contexto de banco de dados utilizando o provedor PostgreSQL (Npgsql)
            services.AddDbContext<DefaultContext>(options =>
                options.UseNpgsql(connectionString));

            return services;
        }
    }
}
