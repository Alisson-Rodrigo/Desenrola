using Desenrola.Application.Contracts.Application;
using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Domain.Exception;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.Favorite.Commands.RemoveFavoriteCommand
{
    public class RemoveFavoriteCommandHandler : IRequestHandler<RemoveFavoriteCommand, Unit>
    {
        private readonly IFavoriteRepository _favoriteRepository;
        private readonly IProviderRepository _providerRepository;
        private readonly ILogged _logged;

        public RemoveFavoriteCommandHandler(
            IFavoriteRepository favoriteRepository,
            IProviderRepository providerRepository,
            ILogged logged)
        {
            _favoriteRepository = favoriteRepository;
            _providerRepository = providerRepository;
            _logged = logged;
        }

        public async Task<Unit> Handle(RemoveFavoriteCommand request, CancellationToken cancellationToken)
        {
            // Verifica se o usuário está autenticado
            var user = await _logged.UserLogged();
            if (user == null)
                throw new BadRequestException("Usuário não autenticado.");

            // Obtém o provedor a partir do ID
            var provider = await _providerRepository.GetByIdAsync(request.ProviderId);
            if (provider == null)
                throw new BadRequestException("Prestador não encontrado.");

            // Obtém o favorito que será removido
            var favorite = await _favoriteRepository.GetFavoriteAsync(user.Id, provider.Id);
            if (favorite == null)
                throw new BadRequestException("Este provedor não está nos seus favoritos.");

            // Remove o favorito
            await _favoriteRepository.Delete(favorite);

            return Unit.Value;
        }
    }
}
