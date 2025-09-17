using Desenrola.Domain.Entities;
namespace Desenrola.Application.Contracts.Persistance.Repositories
{
    public interface IProviderRepository : IBaseRepository<Provider>
    {
        Task<List<Provider>> GetByUserIdAsync(string userId);

        Task<Provider?> GetByIdAsync(Guid id);

    }
}
