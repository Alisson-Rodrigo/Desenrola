using MediatR;

namespace Desenrola.Application.Features.Providers.Commands.CreateProvider;

public record CreateProviderCommand(
    string CPF,
    string RG,
    string DocumentPhotoUrl,
    string Address,
    string ServiceName,
    string Description,
    string PhoneNumber
) : IRequest<Guid>
{
    public Domain.Entities.Provider AssignTo(string userId)
    {
        return new Domain.Entities.Provider
        {
            UserId = userId,
            CPF = CPF,
            RG = RG,
            DocumentPhotoUrl = DocumentPhotoUrl,
            Address = Address,
            ServiceName = ServiceName,
            Description = Description,
            PhoneNumber = PhoneNumber,
            IsActive = true,
            IsVerified = false
        };
    }
}
