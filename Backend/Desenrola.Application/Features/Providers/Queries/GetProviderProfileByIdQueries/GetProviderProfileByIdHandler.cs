using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Domain.Exception;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.Providers.Queries.GetProviderProfileByIdQueries
{
    public class GetProviderProfileByIdHandler : IRequestHandler<GetProviderProfileByIdQuery, ProviderProfileResult>
    {
        private readonly IProviderRepository _providerRepository;

        public GetProviderProfileByIdHandler(IProviderRepository providerRepository)
        {
            _providerRepository = providerRepository;
        }

        public async Task<ProviderProfileResult> Handle(GetProviderProfileByIdQuery request, CancellationToken cancellationToken)
        {
            var provider = await _providerRepository.QueryAllWithIncludes()
                .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

            if (provider == null)
                throw new BadRequestException($"Prestador com ID {request.Id} não encontrado.");

            return new ProviderProfileResult(provider);
        }
    }
}
