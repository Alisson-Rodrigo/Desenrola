using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Domain.Exception;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.Evaluation.Queries.GetEvaluationsByProviderQuery
{
    public class GetEvaluationsQueryHandler :
        IRequestHandler<GetEvaluationsByProviderQuery, List<GetEvaluationResult>>,
        IRequestHandler<GetAverageEvaluationQuery, double>
    {
        private readonly IEvaluationRepository _evaluationRepository;
        private readonly IUserRepository _userRepository;
        private readonly IProviderRepository _providerRepository;

        public GetEvaluationsQueryHandler(
            IEvaluationRepository evaluationRepository,
            IUserRepository userRepository,
            IProviderRepository providerRepository)
        {
            _evaluationRepository = evaluationRepository;
            _userRepository = userRepository;
            _providerRepository = providerRepository;
        }

        public async Task<List<GetEvaluationResult>> Handle(GetEvaluationsByProviderQuery request, CancellationToken cancellationToken)
        {
            var provider = await _providerRepository.GetByIdAsync(request.ProviderId);
            if (provider == null)
                throw new BadRequestException("Prestador não encontrado.");

            var evaluations = await _evaluationRepository.GetByProviderIdAsync(request.ProviderId);

            if (!evaluations.Any())
                throw new BadRequestException("Nenhuma avaliação encontrada para este prestador.");

            var result = new List<GetEvaluationResult>();

            foreach (var e in evaluations)
            {
                var user = await _userRepository.GetById(e.UserId);

                result.Add(new GetEvaluationResult
                {
                    Id = e.Id,
                    Note = e.Note,
                    Comment = e.Comment,
                    UserName = user?.Name ?? "Usuário",
                    UserImage = user?.ImageProfile
                });
            }

            return result;
        }

        public async Task<double> Handle(GetAverageEvaluationQuery request, CancellationToken cancellationToken)
        {
            var provider = await _providerRepository.GetByIdAsync(request.ProviderId);
            if (provider == null)
                throw new BadRequestException("Prestador não encontrado.");

            return await _evaluationRepository.GetAverageByProviderIdAsync(request.ProviderId);
        }
    }
}
