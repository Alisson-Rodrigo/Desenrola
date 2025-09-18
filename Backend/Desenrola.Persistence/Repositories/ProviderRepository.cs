using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Desenrola.Persistence.Repositories
{
    public class ProviderRepository : BaseRepository<Provider>, IProviderRepository
    {
        private readonly DefaultContext _context;

        public ProviderRepository(DefaultContext context) : base(context)
        {
            _context = context;
        }

        public async Task<Provider?> GetByUserIdAsync(string userId)
        {
            return await _context.Providers
                .Include(p => p.User)
                .FirstOrDefaultAsync(x => x.UserId == userId);
        }

        public async Task<Provider?> GetByIdAsync(Guid id)
        {
            return await _context.Providers
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public IQueryable<Provider> QueryAllWithIncludes()
        {
            return _context.Providers
                .Include(p => p.User)       // inclui o User (se precisar do nome/email do usuário)
                .Include(p => p.Services)   // inclui os serviços do prestador
                .AsNoTracking()
                .AsQueryable();
        }
    }
}
