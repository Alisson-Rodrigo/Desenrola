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

        /// <summary>
        /// Repository responsible for handling persistence operations related to <see cref="Evaluation"/> entities.
        /// </summary>
        /// <remarks>
        /// Provides methods for checking the existence of evaluations, retrieving all evaluations 
        /// by provider, and calculating the average evaluation score. 
        /// Inherits basic CRUD functionality from <see cref="BaseRepository{TEntity}"/>.
        /// </remarks>
        /// 
        private readonly DefaultContext _context;

        /// <summary>
        /// Initializes a new instance of the <see cref="EvaluationRepository"/> class.
        /// </summary>
        /// <param name="context">Database context used for data access.</param>

        public EvaluationRepository(DefaultContext context) : base(context)
        {
            _context = context;
        }

        /// <summary>
        /// Checks if a given user has already submitted an evaluation for a specific provider.
        /// </summary>
        /// <param name="userId">The unique identifier of the user.</param>
        /// <param name="providerId">The unique identifier of the provider.</param>
        /// <returns>
        /// <c>true</c> if the evaluation exists; otherwise, <c>false</c>.
        /// </returns>

        public async Task<bool> Exists(string userId, Guid providerId)
        {
            return await _context.Evaluations
                .AnyAsync(e => e.UserId == userId && e.ProviderId == providerId);
        }

        /// <summary>
        /// Retrieves a list of all evaluations associated with a specific provider.
        /// </summary>
        /// <param name="providerId">The unique identifier of the provider.</param>
        /// <returns>
        /// A list of <see cref="Evaluation"/> objects related to the specified provider.
        /// </returns>

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
