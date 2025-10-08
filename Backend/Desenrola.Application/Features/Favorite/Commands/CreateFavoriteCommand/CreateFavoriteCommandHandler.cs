using Desenrola.Application.Contracts.Application;
using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Domain.Exception;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.Favorite.Commands.CreateFavoriteCommand
{
    public class CreateFavoriteCommandHandler : IRequestHandler<CreateFavoriteCommand, Unit>
    {
        private readonly IFavoriteRepository _favoriteRepository;
        private readonly IProviderRepository _providerRepository;
        private readonly ILogged _logged;

        public CreateFavoriteCommandHandler(
            IFavoriteRepository favoriteRepository,
            IProviderRepository providerRepository,
            ILogged logged)
        {
            _favoriteRepository = favoriteRepository;
            _providerRepository = providerRepository;
            _logged = logged;
        }

        public async Task<Unit> Handle(CreateFavoriteCommand request, CancellationToken cancellationToken)
        {
            var validator = new CreateFavoriteCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (!validationResult.IsValid)
                throw new BadRequestException(validationResult);

            var user = await _logged.UserLogged();
            if (user == null)
                throw new BadRequestException("Usuário não autenticado.");

            var provider = await _providerRepository.GetByIdAsync(request.ProviderId);
            if (provider == null)
                throw new BadRequestException("Prestador não encontrado.");

            var alreadyFavorited = await _favoriteRepository.Exists(user.Id, provider.Id);
            if (alreadyFavorited)
                throw new BadRequestException("Você já favoritou este prestador.");

            var favorite = new Domain.Entities.Favorite
            {
                UserId = user.Id,
                ProviderId = provider.Id
            };

            await _favoriteRepository.CreateAsync(favorite, cancellationToken);

            return Unit.Value;
        }
    }
}
