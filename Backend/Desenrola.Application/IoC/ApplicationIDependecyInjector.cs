using Desenrola.Application.Contracts.Application;
using Desenrola.Application.Services;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.IoC
{
    /// <summary>
    /// Classe estática responsável pela injeção de dependências da camada de aplicação.
    /// </summary>
    public static class ApplicationDependencyInjector
    {
        /// <summary>
        /// Método de extensão para registrar os serviços da camada de aplicação no contêiner de injeção de dependência.
        /// </summary>
        /// <param name="services">Coleção de serviços do .NET utilizada para registrar dependências.</param>
        /// <returns>
        /// A instância atual de <see cref="IServiceCollection"/> com as dependências da aplicação registradas.
        /// </returns>
        public static IServiceCollection InjectApplicationDependencies(this IServiceCollection services)
        {
            // 🔹 Serviços responsáveis por autenticação, envio de dados, e integração com Stripe.
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<ISend, Send>();
            services.AddScoped<ILogged, Logged>();
            services.AddScoped<ICPF, CPF>();
            services.AddScoped<IStripeService, StripeService>();

            return services;
        }
    }
}
