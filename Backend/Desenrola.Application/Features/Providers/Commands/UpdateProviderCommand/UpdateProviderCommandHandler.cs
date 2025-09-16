using Desenrola.Application.Contracts.Application;
using Desenrola.Application.Contracts.Persistence.Repositories;
using Desenrola.Domain.Exception;
using MediatR;

namespace Desenrola.Application.Features.Providers.Commands.UpdateProvider
{
    public class UpdateProviderCommandHandler : IRequestHandler<UpdateProviderCommand, Guid>
    {
        private readonly IProviderRepository _providerRepository;
        private readonly ILogged _logged;
        private readonly ICPF _cpfValidator;

        public UpdateProviderCommandHandler(
            IProviderRepository providerRepository,
            ILogged logged,
            ICPF cpfValidator)
        {
            _providerRepository = providerRepository;
            _logged = logged;
            _cpfValidator = cpfValidator;
        }

        public async Task<Guid> Handle(UpdateProviderCommand request, CancellationToken cancellationToken)
        {
            var user = await _logged.UserLogged();
            if (user == null)
                throw new BadRequestException("Usuário não encontrado.");

            var validator = new UpdateProviderCommandValidator(_cpfValidator);
            var validationResult = await validator.ValidateAsync(request, cancellationToken);
            if (!validationResult.IsValid)
                throw new BadRequestException(validationResult);

            var provider = await _providerRepository.GetByIdAsync(request.Id);
            if (provider == null || provider.UserId != user.Id)
                throw new BadRequestException("Prestador não encontrado ou não pertence ao usuário logado.");

            // 🔒 Agora a regra é inversa: só pode atualizar SE estiver verificado
            if (!provider.IsVerified)
                throw new BadRequestException("Seu cadastro ainda não foi verificado. Aguarde aprovação para atualizar as informações.");

            // Atualiza apenas os campos permitidos
            provider.CPF = request.CPF;
            provider.RG = request.RG;
            provider.Address = request.Address;
            provider.Categories = request.Categories;
            provider.ServiceName = request.ServiceName;
            provider.Description = request.Description;
            provider.PhoneNumber = request.PhoneNumber;

            await _providerRepository.Update(provider);
            return provider.Id;
        }
    }
}
