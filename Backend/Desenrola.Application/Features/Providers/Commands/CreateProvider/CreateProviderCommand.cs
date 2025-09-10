using MediatR;

namespace Desenrola.Application.Features.Providers.Commands.CreateProvider
{
    public record CreateProviderCommand(
        string UserId,
        string ServiceName,
        string Description,
        string PhoneNumber,
        string Address
    ) : IRequest<Guid>;
}
