using Desenrola.Application.Contracts.Application;
using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Domain.Exception;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.Favorite.Queries.GetUserFavoritesQuery
{
    public class GetUserFavoritesQueryHandler : IRequestHandler<GetUserFavoritesQuery, GetUserFavoritesResponse>
    {
        private readonly IFavoriteRepository _favoriteRepository;
        private readonly ILogged _logged;
        private readonly IProviderRepository _providerRepository;

        public GetUserFavoritesQueryHandler(
            IFavoriteRepository favoriteRepository,
            ILogged logged,
            IProviderRepository providerRepository)
        {
            _favoriteRepository = favoriteRepository;
            _logged = logged;
            _providerRepository = providerRepository;
        }

        public async Task<GetUserFavoritesResponse> Handle(GetUserFavoritesQuery request, CancellationToken cancellationToken)
        {
            // Obtém o usuário logado
            var user = await _logged.UserLogged();
            if (user == null)
                throw new BadRequestException("Usuário não encontrado.");

            // Obtém todos os IDs dos provedores favoritados pelo usuário
            var favoriteProviders = await _favoriteRepository
                .GetFavoritesByUserId(user.Id);

            if (!favoriteProviders.Any())
                throw new BadRequestException("Nenhum provedor favoritado encontrado.");

            // Mapeia os provedores favoritos para o DTO
            var providersDto = favoriteProviders.Select(fav => new ProviderDto
            {
                Id = fav.Provider.Id,
                Name = fav.Provider.User.Name,
                ServiceName = fav.Provider.ServiceName
                // Você pode adicionar outros campos aqui
            }).ToList();

            return new GetUserFavoritesResponse
            {
                Providers = providersDto
            };
        }
    }
}
