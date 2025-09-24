using Desenrola.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.ProviderSchedules.Queries.GetSchedulesByProviderQuery
{
    public class GetSchedulesByProviderQuery : IRequest<List<GetScheduleResult>>
    {
        public Guid ProviderId { get; set; }

        public GetSchedulesByProviderQuery(Guid providerId)
        {
            ProviderId = providerId;
        }
    }
}
