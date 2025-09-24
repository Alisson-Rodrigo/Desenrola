using Desenrola.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Contracts.Persistance.Repositories
{
    public interface IProviderScheduleRepository : IBaseRepository<ProviderSchedule>
    {
        Task<List<ProviderSchedule>> GetByProviderIdAsync(Guid providerId);

        Task<ProviderSchedule?> GetByIdAsync(Guid scheduleId);

    }
}
