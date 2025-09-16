using MediatR;

namespace Desenrola.Application.Features.Providers.Commands.UpdateProvider;

public record UpdateProviderCommand(
    Guid Id,
    string CPF,
    string RG,
    string Address,
    string ServiceName,
    string Description,
    string PhoneNumber
) : IRequest<Guid>;
