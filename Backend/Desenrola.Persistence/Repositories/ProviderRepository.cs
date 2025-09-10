using Desenrola.Application.Contracts.Persistence.Repositories;
using Desenrola.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Desenrola.Persistence.Repositories
{
    public class ProviderRepository : BaseRepository<Provider>, IProviderRepository
    {
        private readonly DbContext _context;

        public ProviderRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<List<Provider>> GetByUserIdAsync(Guid userId)
        {
            return await _context.Set<Provider>()
                .Where(p => p.UserId == userId)
                .AsNoTracking()
                .ToListAsync();
        }
    }
}
