using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.Providers.Queries.MarkProviderQueries
{
    public class PagedRequestPendingProviders : IRequest<PagedResultPendingProviders>
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        // Filtros
        public string? Search { get; set; } // Nome, CPF ou RG
        public bool? ActiveOnly { get; set; } // Apenas ativos
    }
}
