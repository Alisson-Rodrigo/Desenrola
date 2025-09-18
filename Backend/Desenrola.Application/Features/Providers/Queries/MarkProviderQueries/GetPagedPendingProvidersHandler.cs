using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Desenrola.Application.Features.Providers.Queries.MarkProviderQueries
{

    /// <summary>
    /// Handler responsável por processar o comando <see cref="PagedRequestPendingProviders"/>, 
    /// retornando uma lista paginada de prestadores que ainda não foram verificados. 
    /// Permite aplicar filtros de pesquisa (CPF, RG, endereço, telefone) e 
    /// restringir resultados apenas para prestadores ativos.
    /// Retorna um <see cref="PagedResultPendingProviders"/> contendo os dados da página solicitada.
    /// </summary>

    public class GetPagedPendingProvidersHandler : IRequestHandler<PagedRequestPendingProviders, PagedResultPendingProviders>
    {
        private readonly IProviderRepository _providerRepository;

        public GetPagedPendingProvidersHandler(IProviderRepository providerRepository)
        {
            _providerRepository = providerRepository;
        }

        public async Task<PagedResultPendingProviders> Handle(PagedRequestPendingProviders request, CancellationToken cancellationToken)
        {
            var providers = _providerRepository.QueryAllWithIncludes()
                                               .Where(p => !p.IsVerified);

            // 🔎 Filtro de pesquisa (CPF, RG, telefone, endereço)
            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                providers = providers.Where(p =>
                    p.CPF.Contains(request.Search, StringComparison.OrdinalIgnoreCase) ||
                    p.RG.Contains(request.Search, StringComparison.OrdinalIgnoreCase) ||
                    p.Address.Contains(request.Search, StringComparison.OrdinalIgnoreCase) ||
                    p.PhoneNumber.Contains(request.Search, StringComparison.OrdinalIgnoreCase));
            }

            // 🔎 Apenas ativos
            if (request.ActiveOnly.HasValue && request.ActiveOnly.Value)
                providers = providers.Where(p => p.IsActive);

            var totalItems = await providers.CountAsync(cancellationToken);

            var pagedItems = await providers
                .OrderByDescending(p => p.CPF) // ordem default (ajustável)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(p => new PendingProviderResult(p))
                .ToListAsync(cancellationToken);

            return new PagedResultPendingProviders
            {
                Page = request.Page,
                PageSize = request.PageSize,
                TotalItems = totalItems,
                Items = pagedItems
            };
        }
    }
}
