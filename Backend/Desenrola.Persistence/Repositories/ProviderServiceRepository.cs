using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Domain.Entities;
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
    }
}
