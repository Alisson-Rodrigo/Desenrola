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
            .AsNoTracking() // não rastrear, melhora performance em consultas
            .FirstOrDefaultAsync(u => u.Id == id);
    }
    public async Task UpdateAsync(User user)
    {
        Context.Users.Update(user);
        await Context.SaveChangesAsync();
    }
}
