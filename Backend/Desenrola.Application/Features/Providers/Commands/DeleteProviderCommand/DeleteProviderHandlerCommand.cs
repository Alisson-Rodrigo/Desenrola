using Desenrola.Application.Contracts.Application;
using Desenrola.Application.Contracts.Persistence.Repositories;
using MediatR;

namespace Desenrola.Application.Features.Providers.Commands.DeleteProviderCommand
{
    public class DeleteProviderHandlerCommand : IRequestHandler<DeleteProviderCommand, Unit>
    {
        private readonly IProviderRepository _providerRepository;
        private readonly ILogged _logged;

        public DeleteProviderHandlerCommand(IProviderRepository providerRepository, ILogged logged)
        {
            _providerRepository = providerRepository;
            _logged = logged;
        }   

        public async Task<Unit> Handle(DeleteProviderCommand request, CancellationToken cancellationToken)
        {
            var user = await _logged.UserLogged();

            var provider = await _providerRepository.GetByIdAsync(request.Id);
            if (provider == null)
                throw new Exception("Prestador não encontrado");
            if (provider.UserId != user.Id)
                throw new Exception("Prestador não pertence ao usuário logado");

            if (provider.IsActive == false)
                throw new Exception("Prestador já está inativo");

            provider.IsActive = false;

            await _providerRepository.Update(provider);

            return Unit.Value;
        }

    }
}
