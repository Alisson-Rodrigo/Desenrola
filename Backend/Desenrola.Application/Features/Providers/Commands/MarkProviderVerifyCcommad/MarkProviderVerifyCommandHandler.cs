using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Domain.Exception;
using MediatR;


namespace Desenrola.Application.Features.Providers.Commands.MarkProviderVerifyCcommad
{
    public class MarkProviderVerifyCommandHandler : IRequestHandler<MarkProviderVerifyCommand, Unit>
    {
        private readonly IProviderRepository _providerRepository;

        public MarkProviderVerifyCommandHandler(IProviderRepository providerRepository)
        {
            _providerRepository = providerRepository;
        }

        public async Task<Unit> Handle(MarkProviderVerifyCommand request, CancellationToken cancellationToken)
        {
            var validator = new MarkProviderVerifyCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (!validationResult.IsValid)
                throw new BadRequestException(validationResult);

            var provider = await _providerRepository.GetByIdAsync(request.Id);

            if (provider == null)
                throw new BadRequestException($"Prestador não foi encontrado.");

            if (provider.IsVerified)
                throw new BadRequestException("Prestador já está verificado.");

            provider.IsVerified = true;
            provider.IsActive = true; // opcional: ativa automaticamente ao verificar

            await _providerRepository.Update(provider);

            return Unit.Value;
        }
    }
}
