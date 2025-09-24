using Desenrola.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Contracts.Persistance.Repositories
{
    public interface IEvaluationRepository : IBaseRepository<Evaluation>
    {
        Task<bool> Exists(string userId, Guid providerId);

    }
}
