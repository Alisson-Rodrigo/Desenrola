using Desenrola.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.ServicesProviders.Commands.CreateServiceProviderCommand
{
    public record CreateProviderServiceCommand(
        string Title,
        string Description,
        decimal? Price,
        ServiceCategory Category,
        List<IFormFile>? Images
    ) : IRequest<Guid>;
}
