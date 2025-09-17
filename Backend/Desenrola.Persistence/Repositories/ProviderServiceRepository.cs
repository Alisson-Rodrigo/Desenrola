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
    public class ProviderServiceRepository : BaseRepository<ProviderService>, IProviderServiceRepository
    {
        private readonly DefaultContext _context;

        public ProviderServiceRepository(DefaultContext context) : base(context)
        {
            _context = context;
        }

        public async Task<ProviderService?> GetByIdAsync(Guid id)
        {
            return await _context.ProviderServices
                .Include(s => s.Provider)      // inclui o prestador dono do serviço
                .ThenInclude(p => p.User)      // inclui o usuário dono do prestador
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        // 🔹 Função para paginação e listagem otimizada
        public IQueryable<ProviderService> QueryAllWithIncludes()
        {
            return _context.ProviderServices
                .Include(s => s.Provider)      // inclui prestador
                .ThenInclude(p => p.User)      // inclui usuário do prestador
                .AsNoTracking()
                .AsQueryable();
        }
    }
}
