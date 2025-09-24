using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.Evaluation.Queries.GetEvaluationsByProviderQuery
{
    public class GetEvaluationsByProviderQuery : IRequest<List<GetEvaluationResult>>
    {
        public Guid ProviderId { get; }

        public GetEvaluationsByProviderQuery(Guid providerId)
        {
            ProviderId = providerId;
        }
    }

    public class GetAverageEvaluationQuery : IRequest<double>
    {
        public Guid ProviderId { get; }

        public GetAverageEvaluationQuery(Guid providerId)
        {
            ProviderId = providerId;
        }
    }

}
