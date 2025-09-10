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
    public static class ApplicationDependencyInjector
    {
        public static IServiceCollection InjectApplicationDependencies(this IServiceCollection services)
        {

            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<ISend, Send>();



            return services;
        }
    }
}
