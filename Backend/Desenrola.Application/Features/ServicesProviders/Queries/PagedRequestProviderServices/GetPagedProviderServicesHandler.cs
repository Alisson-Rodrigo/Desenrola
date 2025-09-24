using Desenrola.Application.Contracts.Persistance.Repositories;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Desenrola.Application.Features.ServicesProviders.Queries.PagedRequestProviderServices
{
    /// <summary>
    /// Handler responsável por processar o comando <see cref="PagedRequestProviderServices"/>, 
    /// retornando uma lista paginada de serviços de prestadores. 
    /// Permite aplicar filtros por prestador específico, busca textual (título e descrição) 
    /// e exibir apenas serviços ativos. 
    /// Retorna um <see cref="PagedResultProviderServices"/> contendo os serviços e metadados da paginação.
    /// </summary>

    public class GetPagedProviderServicesHandler : IRequestHandler<PagedRequestProviderServices, PagedResultProviderServices>
    {
        private readonly IProviderServiceRepository _serviceRepository;

        public GetPagedProviderServicesHandler(IProviderServiceRepository serviceRepository)
        {
            _serviceRepository = serviceRepository;
        }

        public async Task<PagedResultProviderServices> Handle(PagedRequestProviderServices request, CancellationToken cancellationToken)
        {
            var query = _serviceRepository.QueryAllWithIncludes();

            // 🔎 filtra por prestador específico
            if (request.ProviderId.HasValue)
                query = query.Where(s => s.ProviderId == request.ProviderId.Value);

            if (request.ServiceCategory.HasValue)
                query = query.Where(s => s.Category == request.ServiceCategory);

            // 🔎 busca textual
            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                query = query.Where(s =>
                    EF.Functions.ILike(s.Title, $"%{request.Search}%") ||
                    EF.Functions.ILike(s.Description, $"%{request.Search}%"));
            }


            // 🔎 apenas ativos
            if (request.OnlyActive.HasValue && request.OnlyActive.Value)
                query = query.Where(s => s.IsActive);

            // ✅ usa CountAsync
            var totalItems = await query.CountAsync(cancellationToken);

            // ✅ usa ToListAsync
            var items = await query
                .OrderByDescending(s => s.CreatedOn)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(s => new ProviderServiceResult(s))
                .ToListAsync(cancellationToken);

            return new PagedResultProviderServices
            {
                Page = request.Page,
                PageSize = request.PageSize,
                TotalItems = totalItems,
                Items = items
            };
        }
    }
}
