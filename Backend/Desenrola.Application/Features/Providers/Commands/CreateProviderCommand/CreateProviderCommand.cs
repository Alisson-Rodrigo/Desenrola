using Desenrola.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace Desenrola.Application.Features.Providers.Commands.CreateProvider;

public record CreateProviderCommand(
    string CPF,
    string RG,
    List<IFormFile> DocumentPhotos, // aqui recebemos os arquivos
    string Address,
    string ServiceName,
    string Description,
    string PhoneNumber,
    List<ServiceCategory> Categories
) : IRequest<Guid>;

