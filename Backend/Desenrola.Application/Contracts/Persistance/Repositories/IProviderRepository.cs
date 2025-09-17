using Desenrola.Domain.Entities;
namespace Desenrola.Application.Contracts.Persistance.Repositories
{
    public interface IProviderRepository : IBaseRepository<Provider>
    {
        public Task<Provider?> GetByUserIdAsync(string userId);

        Task<Provider?> GetByIdAsync(Guid id);

        public IQueryable<Provider> QueryAllWithIncludes();


    }
}
