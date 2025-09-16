using Desenrola.Domain.Entities;

namespace Desenrola.Application.Contracts.Persistance.Repositories;

public interface IUserRepository : IBaseRepository<User>
{
    public Task<User?> GetById(string id);


}
