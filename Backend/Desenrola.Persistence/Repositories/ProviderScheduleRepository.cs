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
    public class ProviderScheduleRepository : BaseRepository<ProviderSchedule>, IProviderScheduleRepository
    {
        private readonly DefaultContext _context;

        public ProviderScheduleRepository(DefaultContext context) : base(context)
        {
            _context = context;
        }

        public async Task<List<ProviderSchedule>> GetByProviderIdAsync(Guid providerId)
        {
            return await _context.ProviderSchedules
                .Where(s => s.ProviderId == providerId && s.IsAvailable)
                .ToListAsync();
        }

        public async Task<ProviderSchedule?> GetByIdAsync(Guid scheduleId)
        {
            return await _context.ProviderSchedules
                .Include(s => s.Provider) // inclui dados do prestador
                .FirstOrDefaultAsync(s => s.Id == scheduleId);
        }
    }
}
