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
    public class EvaluationRepository : BaseRepository<Evaluation>, IEvaluationRepository
    {
        private readonly DefaultContext _context;

        public EvaluationRepository(DefaultContext context) : base(context)
        {
            _context = context;
        }

        public async Task<bool> Exists(string userId, Guid providerId)
        {
            return await _context.Evaluations
                .AnyAsync(e => e.UserId == userId && e.ProviderId == providerId);
        }

        public async Task<List<Evaluation>> GetByProviderIdAsync(Guid providerId)
        {
            return await _context.Evaluations
                .Where(e => e.ProviderId == providerId)
                .ToListAsync();
        }

        public async Task<double> GetAverageByProviderIdAsync(Guid providerId)
        {
            return await _context.Evaluations
                .Where(e => e.ProviderId == providerId)
                .AverageAsync(e => (double)e.Note);
        }

    }
}
