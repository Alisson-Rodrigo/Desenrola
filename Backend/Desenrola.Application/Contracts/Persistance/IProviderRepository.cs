using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Domain.Entities;
namespace Desenrola.Application.Contracts.Persistence.Repositories
{
    public interface IProviderRepository : IBaseRepository<Provider>
    {
        Task<List<Provider>> GetByUserIdAsync(string userId);

        Task<Provider?> GetByIdAsync(Guid id);

    }
}
