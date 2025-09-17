using Desenrola.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Contracts.Persistance.Repositories
{
    public interface IProviderServiceRepository : IBaseRepository<ProviderService>
    {
        Task<ProviderService?> GetByIdAsync(Guid id);
        IQueryable<ProviderService> QueryAllWithIncludes();
    }
}
