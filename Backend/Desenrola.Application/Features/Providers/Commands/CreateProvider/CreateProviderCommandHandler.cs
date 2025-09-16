using Desenrola.Application.Contracts.Application;
using Desenrola.Application.Contracts.Persistence.Repositories;
using Desenrola.Domain.Entities;
using Desenrola.Domain.Exception;
using MediatR;

namespace Desenrola.Application.Features.Providers.Commands.CreateProvider
{
    public class CreateProviderCommandHandler : IRequestHandler<CreateProviderCommand, Guid>
    {
        private readonly IProviderRepository _providerRepository;
        private readonly ILogged _logged;
        private readonly ICPF _cpfValidator;


        public CreateProviderCommandHandler(IProviderRepository providerRepository, ILogged logged, ICPF cpfValidator)
        {
            _providerRepository = providerRepository;
            _logged = logged;
            _cpfValidator = cpfValidator;

        }

        public async Task<Guid> Handle(CreateProviderCommand request, CancellationToken cancellationToken)
        {
            var user = await _logged.UserLogged();

            if (user == null)
            {
                throw new BadRequestException("Usuário não encontrado.");
            }

            var validator = new CreateProviderCommandValidator(_cpfValidator);

            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (!validationResult.IsValid)
            {
                throw new BadRequestException(validationResult);
            }

            var provider = request.AssignTo(user.Id);


            await _providerRepository.CreateAsync(provider);
            return provider.Id;
        }

    }
}
