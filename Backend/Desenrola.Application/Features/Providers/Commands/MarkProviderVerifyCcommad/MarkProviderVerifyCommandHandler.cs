using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Domain.Exception;
using MediatR;
using Microsoft.AspNetCore.Identity;

// 👇 resolve ambiguidade
using DomainUser = Desenrola.Domain.Entities.User;

namespace Desenrola.Application.Features.Providers.Commands.MarkProviderVerifyCcommad
{

    /// <summary>
    /// Handler responsável por processar o comando <see cref="MarkProviderVerifyCommand"/>, 
    /// validando os dados, marcando o prestador como verificado e ativo, 
    /// e atualizando as permissões do usuário no sistema para a role "Provider".
    /// </summary>

    public class MarkProviderVerifyCommandHandler : IRequestHandler<MarkProviderVerifyCommand, Unit>
    {
        private readonly IProviderRepository _providerRepository;
        private readonly IUserRepository _userRepository;
        private readonly UserManager<DomainUser> _userManager;

        public MarkProviderVerifyCommandHandler(
            IProviderRepository providerRepository,
            IUserRepository userRepository,
            UserManager<DomainUser> userManager)
        {
            _providerRepository = providerRepository;
            _userRepository = userRepository;
            _userManager = userManager;
        }

        public async Task<Unit> Handle(MarkProviderVerifyCommand request, CancellationToken cancellationToken)
        {
            var validator = new MarkProviderVerifyCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (!validationResult.IsValid)
                throw new BadRequestException(validationResult);

            var provider = await _providerRepository.GetByIdAsync(request.Id);

            if (provider == null)
                throw new BadRequestException("Prestador não foi encontrado.");

            if (provider.IsVerified)
                throw new BadRequestException("Prestador já está verificado.");

            // ✅ Marca como verificado
            provider.IsVerified = true;
            provider.IsActive = true;

            await _providerRepository.Update(provider);

            // Atualiza role do usuário
            var user = await _userManager.FindByIdAsync(provider.UserId);
            if (user == null)
                throw new BadRequestException("Usuário não encontrado para este prestador.");

            // Remove todas as roles atuais
            var roles = await _userManager.GetRolesAsync(user);
            if (roles.Any())
            {
                var removeResult = await _userManager.RemoveFromRolesAsync(user, roles);
                if (!removeResult.Succeeded)
                    throw new BadRequestException("Erro ao remover roles existentes do usuário.");
            }

            // Adiciona apenas a role "Provider"
            var addResult = await _userManager.AddToRoleAsync(user, "Provider");
            if (!addResult.Succeeded)
                throw new BadRequestException("Erro ao atribuir role 'Provider' ao usuário.");



            return Unit.Value;
        }
    }
}
