using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Domain.Entities;

namespace Desenrola.Persistence.Repositories;

public class UserRepository(DefaultContext context): BaseRepository<User>(context), IUserRepository { }
