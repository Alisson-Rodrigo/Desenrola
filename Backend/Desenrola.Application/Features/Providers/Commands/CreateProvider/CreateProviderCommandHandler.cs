using Desenrola.Application.Contracts.Persistence.Repositories;
using Desenrola.Domain.Entities;
using MediatR;

namespace Desenrola.Application.Features.Providers.Commands.CreateProvider
{
    public class CreateProviderCommandHandler : IRequestHandler<CreateProviderCommand, Guid>
    {
        private readonly IProviderRepository _providerRepository;

        public CreateProviderCommandHandler(IProviderRepository providerRepository)
        {
            _providerRepository = providerRepository;
        }

        public async Task<Guid> Handle(CreateProviderCommand request, CancellationToken cancellationToken)
        {
            var provider = new Provider
            {
                Id = Guid.NewGuid(),
                UserId = request.UserId,
                ServiceName = request.ServiceName,
                Description = request.Description,
                PhoneNumber = request.PhoneNumber,
                Address = request.Address,
                IsActive = true
            };

            await _providerRepository.CreateAsync(provider, cancellationToken);
            return provider.Id;
        }
    }
}
