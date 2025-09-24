using Desenrola.Application.Contracts.Application;
using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Domain.Exception;
using MediatR;


namespace Desenrola.Application.Features.Evaluation.Command.CreatedEvaluationCommand
{
    public class CreateEvaluationCommandHandler : IRequestHandler<CreatedEvaluationCommand, Unit>
    {
        private readonly IEvaluationRepository _evaluationRepository;
        private readonly IProviderRepository _providerRepository;
        private readonly ILogged _logged;

        public CreateEvaluationCommandHandler(
            IEvaluationRepository evaluationRepository,
            IProviderRepository providerRepository,
            ILogged logged)
        {
            _evaluationRepository = evaluationRepository;
            _providerRepository = providerRepository;
            _logged = logged;
        }

        public async Task<Unit> Handle(CreatedEvaluationCommand request, CancellationToken cancellationToken)
        {
            var validator = new CreateEvaluationCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (!validationResult.IsValid)
                throw new BadRequestException(validationResult);

            var user = await _logged.UserLogged();
            if (user == null)
                throw new BadRequestException("Usuário não autenticado.");

            var provider = await _providerRepository.GetByIdAsync(request.ProviderId);
            if (provider == null)
                throw new BadRequestException("Prestador não encontrado.");

            if (provider.UserId == user.Id)
                throw new BadRequestException("Você não pode avaliar a si mesmo.");

            var alreadyEvaluated = await _evaluationRepository.Exists(user.Id, provider.Id);
            if (alreadyEvaluated)
                throw new BadRequestException("Você já avaliou este prestador.");

            var evaluation = new Domain.Entities.Evaluation
            {
                UserId = user.Id,
                ProviderId = provider.Id,
                Note = request.Note,
                Comment = request.Comment
            };

            await _evaluationRepository.CreateAsync(evaluation, cancellationToken);

            return Unit.Value;
        }

    }
}
