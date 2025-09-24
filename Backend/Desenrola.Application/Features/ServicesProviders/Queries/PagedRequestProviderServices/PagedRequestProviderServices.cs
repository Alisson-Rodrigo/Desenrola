using Desenrola.Domain.Enums;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.ServicesProviders.Queries.PagedRequestProviderServices
{
    public class PagedRequestProviderServices : IRequest<PagedResultProviderServices>
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        // 🔎 filtros de busca
        public string? Search { get; set; } // título, descrição
        public ServiceCategory? ServiceCategory { get; set; }
        public bool? OnlyActive { get; set; } // apenas ativos
        public Guid? ProviderId { get; set; } // serviços de um prestador específico
        public Guid? ServiceId { get; set; }
    }
}
