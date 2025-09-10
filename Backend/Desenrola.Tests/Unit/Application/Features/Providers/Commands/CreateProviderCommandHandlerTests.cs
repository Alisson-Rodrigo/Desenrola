// Desenrola.Application/Features/Providers/Commands/CreateProvider/CreateProviderCommandHandler.cs
using System;
using System.Threading;
using System.Threading.Tasks;
using Desenrola.Application.Contracts.Persistence.Repositories;
using Desenrola.Domain.Entities;
using MediatR;

namespace Desenrola.Application.Features.Providers.Commands.CreateProvider
{
    public class CreateProviderCommandHandler : IRequestHandler<CreateProviderCommand, Guid>
    {
        private readonly IProviderRepository _repo;

        public CreateProviderCommandHandler(IProviderRepository repo)
        {
            _repo = repo;
        }

        public async Task<Guid> Handle(CreateProviderCommand request, CancellationToken ct)
        {
            var provider = new Provider
            {
                // garante que o teste passe sem depender do DB gerar o Id
                Id = Guid.NewGuid(),

                // 👇 conversão do Guid vindo no command para string do domínio
                UserId = request.UserId.ToString(),

                ServiceName = request.ServiceName,
                Description = request.Description,
                PhoneNumber = request.PhoneNumber,
                Address = request.Address,
                IsActive = true
            };

            await _repo.CreateAsync(provider, ct);

            return provider.Id;
        }
    }
}
