using MediatR;

namespace Desenrola.Application.Features.Providers.Commands.CreateProvider
{
    public record CreateProviderCommand(
        Guid UserId,
        string ServiceName,
        string Description,
        string PhoneNumber,
        string Address
    ) : IRequest<Guid>;
}
