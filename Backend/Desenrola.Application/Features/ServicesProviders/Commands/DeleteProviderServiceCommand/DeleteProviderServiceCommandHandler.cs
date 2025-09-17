using Desenrola.Application.Contracts.Application;
using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Domain.Exception;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.ServicesProviders.Commands.DeleteProviderServiceCommand
{
    public class DeleteProviderServiceCommandHandler : IRequestHandler<DeleteProviderServiceCommand, Unit>
    {
        private readonly IProviderServiceRepository _providerServiceRepository;
        private readonly IProviderRepository _providerRepository;
        private readonly ILogged _logged;

        public DeleteProviderServiceCommandHandler(
            IProviderServiceRepository providerServiceRepository,
            IProviderRepository providerRepository,
            ILogged logged)
        {
            _providerServiceRepository = providerServiceRepository;
            _providerRepository = providerRepository;
            _logged = logged;
        }

        public async Task<Unit> Handle(DeleteProviderServiceCommand request, CancellationToken cancellationToken)
        {
            var user = await _logged.UserLogged();

            if (user == null)
                throw new BadRequestException("Usuário não encontrado.");

            var validator = new DeleteProviderServiceCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);
            if (!validationResult.IsValid)
                throw new BadRequestException(validationResult);

            var service = await _providerServiceRepository.GetByIdAsync(request.Id);
            if (service == null)
                throw new BadRequestException($"Serviço {request.Id} não encontrado.");

            // Verifica se o serviço pertence ao prestador logado
            var provider = await _providerRepository.GetByIdAsync(service.ProviderId);
            if (provider == null || provider.UserId != user.Id)
                throw new BadRequestException("Você não tem permissão para alterar este serviço.");

            // 🔎 Nova regra: só pode inativar se o prestador estiver verificado
            if (!provider.IsVerified)
                throw new BadRequestException("Conta de prestador não está verificada. Não é possível inativar serviços.");

            // Marca o serviço como inativo (soft delete)
            service.IsActive = false;
            service.UpdatedAt = DateTime.UtcNow;

            await _providerServiceRepository.Update(service);

            return Unit.Value;
        }
    }
}
