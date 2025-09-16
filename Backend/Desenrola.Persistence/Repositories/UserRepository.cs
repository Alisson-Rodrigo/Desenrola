using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Desenrola.Persistence.Repositories;

public class UserRepository : BaseRepository<User>, IUserRepository
{
    public UserRepository(DefaultContext context) : base(context)
    {
    }

    public async Task<User?> GetById(string id)
    {
        return await Context.Users
            .FirstOrDefaultAsync(u => u.Id == id);
    }
}
