using Desenrola.Domain.Enums;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.ServicesProviders.Commands.UpdateServiceProviderCommand
{
    public record UpdateProviderServiceCommand(
        Guid Id,                     // Id do serviço
        string Title,
        string Description,
        decimal? Price,
        ServiceCategory Category,
        bool IsActive,
        bool IsAvailable
    ) : IRequest<Guid>;
}
