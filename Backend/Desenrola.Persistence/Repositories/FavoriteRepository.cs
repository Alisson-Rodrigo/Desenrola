using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Persistence.Repositories
{
    public class FavoriteRepository : BaseRepository<Favorite>, IFavoriteRepository
    {
        private readonly DefaultContext _context;

        public FavoriteRepository(DefaultContext context) : base(context)
        {
            _context = context;
        }

        public async Task<bool> Exists(string userId, Guid providerId)
        {
            return await _context.Favorites
                .AnyAsync(f => f.UserId == userId && f.ProviderId == providerId);
        }

        // Obtém um favorito específico
        public async Task<Favorite> GetFavoriteAsync(string userId, Guid providerId)
        {
            return await _context.Favorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.ProviderId == providerId);
        }

        public async Task<List<Favorite>> GetFavoritesByUserId(string userId)
        {
            return await _context.Favorites
                .Include(f => f.Provider)
                    .ThenInclude(p => p.User) // <-- inclui o usuário do provedor
                .Where(f => f.UserId == userId)
                .ToListAsync();
        }


    }
}
