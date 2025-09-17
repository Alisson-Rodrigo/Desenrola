using Desenrola.Application.Contracts.Application;
using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Domain.Exception;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.ServicesProviders.Commands.UpdateServiceProviderCommand
{
    public class UpdateProviderServiceCommandHandler : IRequestHandler<UpdateProviderServiceCommand, Guid>
    {
        private readonly IProviderServiceRepository _providerServiceRepository;
        private readonly IProviderRepository _providerRepository;
        private readonly ILogged _logged;

        public UpdateProviderServiceCommandHandler(
            IProviderServiceRepository providerServiceRepository,
            IProviderRepository providerRepository,
            ILogged logged)
        {
            _providerServiceRepository = providerServiceRepository;
            _providerRepository = providerRepository;
            _logged = logged;
        }

        public async Task<Guid> Handle(UpdateProviderServiceCommand request, CancellationToken cancellationToken)
        {
            var user = await _logged.UserLogged();

            if (user == null)
                throw new BadRequestException("Usuário não encontrado.");

            var validator = new UpdateProviderServiceCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (!validationResult.IsValid)
                throw new BadRequestException(validationResult);

            var service = await _providerServiceRepository.GetByIdAsync(request.Id);
            if (service == null)
                throw new BadRequestException($"Serviço não encontrado.");

            // 🔎 verifica se o serviço realmente pertence ao provider do usuário logado
            var provider = await _providerRepository.GetByIdAsync(service.ProviderId);
            if (provider == null || provider.UserId != user.Id)
                throw new BadRequestException("Você não tem permissão para atualizar este serviço.");

            // Só pode atualizar se o prestador for verificado e ativo
            if (!provider.IsActive)
                throw new BadRequestException("Conta de prestador está inativa.");
            if (!provider.IsVerified)
                throw new BadRequestException("Conta de prestador não foi verificada.");

            // Atualiza campos permitidos
            service.Title = request.Title;
            service.Description = request.Description;
            service.Price = request.Price;
            service.Category = request.Category;
            service.IsActive = request.IsActive;
            service.IsAvailable = request.IsAvailable;
            service.UpdatedAt = DateTime.UtcNow;

            await _providerServiceRepository.Update(service);

            return service.Id;
        }
    }
}
